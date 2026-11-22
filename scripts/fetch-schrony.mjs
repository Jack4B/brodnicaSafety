#!/usr/bin/env node
// Pobiera oficjalny zbiór „Punkty schronienia w Polsce” (KG PSP, dane.gov.pl, CC BY 4.0)
// i zapisuje lokalną kopię tylko dla miasta Brodnicy do data/schrony.json.
// (Gmina wiejska Brodnica ma inne miejscowości, więc filtr po miejscowości jej nie obejmuje.)
//
// Użycie:
//   node scripts/fetch-schrony.mjs                  # pobiera aktualny CSV
//   node scripts/fetch-schrony.mjs --file ps.csv    # używa pliku pobranego ręcznie
//   node scripts/fetch-schrony.mjs --show-columns
//   node scripts/fetch-schrony.mjs --caly-powiat     # cały powiat brodnicki zamiast samego miasta
//
// Bez zależności. Wymaga Node 18+.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATASET_API = 'https://api.dane.gov.pl/1.4/datasets/28058/resources';
const DATASET_PAGE = 'https://dane.gov.pl/pl/dataset/28058,punkty-schronienia-w-polsce';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data/schrony.json');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);
const POWIAT = (opt('powiat', 'brodnicki')).toLowerCase();
const MIEJSCOWOSC = flag('caly-powiat') ? null : (opt('miejscowosc', 'Brodnica')).toLowerCase();

function decode(buf) {
  const utf = new TextDecoder('utf-8').decode(buf);
  if (!utf.includes('�')) return utf.replace(/^﻿/, '');
  return new TextDecoder('windows-1250').decode(buf);
}

function parseCSV(text) {
  const first = text.slice(0, text.indexOf('\n'));
  const delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows = []; let row = []; let field = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ''));
}

// Nazwy kolumn w zbiorze mogą się zmieniać, więc szukamy ich po wzorcach.
const COLS = {
  nazwa: /nazwa/i,
  typ: /rodzaj|typ|kategori/i,
  miejscowosc: /miejscowo/i,
  ulica: /ulica|adres/i,
  nr: /^nr|numer/i,
  gmina: /gmina/i,
  powiat: /powiat/i,
  wojewodztwo: /wojew/i,
  pojemnosc: /pojemno|liczba.*miejsc|miejsc/i,
  lat: /^lat|szeroko|wsp.*y|^y$/i,
  lon: /^lon|^lng|d(l|ł)ugo|wsp.*x|^x$/i,
};

async function getCsvUrl() {
  const res = await fetch(DATASET_API, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`dane.gov.pl API: HTTP ${res.status}`);
  const json = await res.json();
  const csv = json.data.find((r) => (r.attributes.format || '').toLowerCase() === 'csv');
  if (!csv) throw new Error('Nie znaleziono zasobu CSV w zbiorze 28058');
  const a = csv.attributes;
  return { url: a.file_url || a.link || a.download_url, dataDate: a.data_date || a.modified };
}

async function main() {
  let buf, meta = { url: null, dataDate: null };
  const file = opt('file');
  if (file) {
    buf = await readFile(resolve(file));
  } else {
    meta = await getCsvUrl();
    console.log(`Pobieram ${meta.url} (dane z ${meta.dataDate})`);
    const res = await fetch(meta.url);
    if (!res.ok) throw new Error(`Pobieranie CSV: HTTP ${res.status}`);
    buf = new Uint8Array(await res.arrayBuffer());
  }

  const [header, ...rows] = parseCSV(decode(buf));
  if (flag('show-columns')) console.log('Kolumny:', header.join(' | '));

  const idx = {};
  for (const [key, re] of Object.entries(COLS)) idx[key] = header.findIndex((h) => re.test(h.trim()));
  const missing = ['powiat', 'nazwa'].filter((k) => idx[k] < 0);
  if (missing.length) {
    console.error('Nie rozpoznano kolumn:', missing.join(', '), '\nKolumny w pliku:', header.join(' | '));
    process.exit(1);
  }

  const get = (r, k) => (idx[k] >= 0 ? (r[idx[k]] || '').trim() : '');
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };

  const items = rows
    .filter((r) => get(r, 'powiat').toLowerCase().includes(POWIAT))
    .filter((r) => !MIEJSCOWOSC || idx.miejscowosc < 0 || get(r, 'miejscowosc').toLowerCase() === MIEJSCOWOSC)
    .map((r) => ({
      nazwa: get(r, 'nazwa'),
      typ: get(r, 'typ'),
      miejscowosc: get(r, 'miejscowosc'),
      adres: [get(r, 'ulica'), get(r, 'nr')].filter(Boolean).join(' '),
      gmina: get(r, 'gmina'),
      pojemnosc: num(get(r, 'pojemnosc')),
      lat: num(get(r, 'lat')),
      lon: num(get(r, 'lon')),
    }))
    .sort((a, b) => a.miejscowosc.localeCompare(b.miejscowosc, 'pl') || a.adres.localeCompare(b.adres, 'pl'));

  const out = {
    zrodlo: 'Komenda Główna Państwowej Straży Pożarnej — Punkty schronienia w Polsce',
    zbior: DATASET_PAGE,
    plik: meta.url,
    licencja: 'CC BY 4.0',
    dane_z: meta.dataDate,
    pobrano: new Date().toISOString(),
    filtr: { powiat: POWIAT, miejscowosc: MIEJSCOWOSC },
    kolumny_zrodlowe: Object.fromEntries(Object.entries(idx).map(([k, i]) => [k, i >= 0 ? header[i] : null])),
    liczba: items.length,
    punkty: items,
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`Zapisano ${items.length} punktów (${MIEJSCOWOSC || `powiat ${POWIAT}`}) do data/schrony.json`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
