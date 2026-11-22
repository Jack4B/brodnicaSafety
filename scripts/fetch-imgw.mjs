#!/usr/bin/env node
// Pobiera aktualne ostrzeżenia meteorologiczne IMGW-PIB i zapisuje te,
// które dotyczą powiatu brodnickiego (TERYT 0402), do data/ostrzezenia-imgw.json.
// Uruchamiane przy buildzie (lub z crona na CT8) — przeglądarka nie odpytuje API,
// więc strona działa offline i nie obciąża źródła.
//
// Użycie: node scripts/fetch-imgw.mjs [--teryt 0402]

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://danepubliczne.imgw.pl/api/data/warningsmeteo';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data/ostrzezenia-imgw.json');
const i = process.argv.indexOf('--teryt');
const TERYT = i >= 0 ? process.argv[i + 1] : '0402'; // kujawsko-pomorskie (04), powiat brodnicki (02)

const res = await fetch(API);
if (!res.ok) { console.error(`IMGW: HTTP ${res.status}`); process.exit(1); }
const json = await res.json();

// Gdy nie ma ostrzeżeń, API zwraca obiekt { message: "Brak ostrzeżeń ..." } zamiast listy.
const list = Array.isArray(json) ? json : [];
const local = list.filter((w) => Array.isArray(w.teryt) && w.teryt.some((t) => String(t).startsWith(TERYT)));

const out = {
  zrodlo: 'IMGW-PIB — dane publiczne',
  api: API,
  teryt: TERYT,
  pobrano: new Date().toISOString(),
  komunikat_api: Array.isArray(json) ? null : json.message || null,
  liczba: local.length,
  ostrzezenia: local.map((w) => ({
    zdarzenie: w.nazwa_zdarzenia,
    stopien: w.stopien,
    od: w.obowiazuje_od,
    do: w.obowiazuje_do,
    tresc: w.tresc,
    komentarz: w.komentarz,
    biuro: w.biuro,
    opublikowano: w.opublikowano,
  })),
};
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`IMGW: ${local.length} ostrzeżeń dla TERYT ${TERYT}${out.komunikat_api ? ` (${out.komunikat_api})` : ''}`);
