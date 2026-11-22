#!/usr/bin/env node
// Komunikaty lokalne dla miasta Brodnicy, pobierane automatycznie z oficjalnych źródeł:
//  1. Urząd Miejski w Brodnicy — kanał Atom aktualności (tylko wpisy pasujące do słów kluczowych
//     o bezpieczeństwie i mediach, reszta aktualności miasta nas nie interesuje),
//  2. Powiatowa Stacja Sanitarno-Epidemiologiczna w Brodnicy — komunikaty o jakości wody
//     (tylko dotyczące miasta Brodnicy i kąpielisk; gmina wiejska Brodnica to inne wodociągi).
// Wynik: data/komunikaty-auto.json. Komunikaty wpisywane ręcznie są w data/komunikaty.json.
//
// Użycie: node scripts/fetch-komunikaty.mjs

import { fetchText, stripTags, decodeEntities, dataPath, writeJson, readJson } from './lib.mjs';

const CITY_FEED = 'https://www.portal.brodnica.pl/aktualnosci.xml';
const PSSE = 'https://www.gov.pl/web/psse-brodnica/komunikaty';
const OUT = dataPath('komunikaty-auto.json');

// Słowa kluczowe dla aktualności miasta. Celowo wąskie, żeby nie wpuszczać imprez i sesji rady.
const KEYWORDS = /alarm|syren|ostrze|zagroż|kryzys|ewakuac|schron|ochron\w* ludno|obron\w* cywil|awari|wyłącz|przerw\w* w dostaw|brak (wody|prądu|ciepła)|woda pitn|wodociąg|ogrzew|ciepł\w* sieci|mróz|upał|burz|powód|podtop|smog|jakoś\w* powietrza|szczepien|epidem|ćwiczeni|RCB|RSO/i;

// Wpisy, które pasują do słów kluczowych, ale nie są komunikatami o zagrożeniach.
const EXCLUDE = /bezdomn|sesj\w* rady|konkurs|jubileusz|koncert/i;

export function parseAtom(xml) {
  const entries = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const title = decodeEntities((e.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    const link = (e.match(/<link[^>]*href="([^"]+)"/) || [])[1] || null;
    const updated = (e.match(/<updated>([^<]+)<\/updated>/) || [])[1] || null;
    const summary = stripTags(decodeEntities((e.match(/<(?:summary|content)[^>]*>([\s\S]*?)<\/(?:summary|content)>/) || [])[1] || '').replace(/<!\[CDATA\[|\]\]>/g, ''));
    entries.push({ title, link, updated, summary });
  }
  return entries;
}

export function parseGovList(html, base = 'https://www.gov.pl') {
  const items = [];
  const re = /<span class="date">\s*([\d.]+)\s*<\/span>[\s\S]*?<div class="title">\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  for (const m of html.matchAll(re)) {
    const [d, mo, y] = m[1].split('.');
    items.push({ data: `${y}-${mo}-${d}`, tytul: stripTags(m[3]), url: base + m[2] });
  }
  return items;
}

// Miasto zasila wodociąg publiczny „Brodnica”. Nazwa urzędu („Inspektora … w Brodnicy”) i gmina
// wiejska („gm. Brodnica”) to fałszywe trafienia, więc je usuwamy przed sprawdzeniem.
export function psseDotyczyMiasta(tytul) {
  if (/kąpielisk/i.test(tytul)) return true;
  const t = tytul.replace(/Inspektora Sanitarnego w Brodnicy/gi, '').replace(/gm\.\s*Brodnica/gi, '');
  return /wod/i.test(t) && /(wodociągu publicznego|miasta|m\.)\s+Brodnic/i.test(t);
}

async function main() {
  const out = { pobrano: new Date().toISOString(), zrodla: [], komunikaty: [], bledy: [] };
  const prev = (await readJson(OUT)) || { komunikaty: [] };
  // Gdy źródło nie odpowiada, zostawiamy jego poprzednie wpisy — brak danych to nie „brak komunikatów”.
  const keepPrevious = (zrodlo) => out.komunikaty.push(...prev.komunikaty.filter((k) => k.zrodlo === zrodlo));

  try {
    const xml = await fetchText(CITY_FEED);
    const entries = parseAtom(xml);
    out.zrodla.push({ nazwa: 'Urząd Miejski w Brodnicy', url: CITY_FEED, wpisow: entries.length });
    for (const e of entries) {
      const text = `${e.title} ${e.summary}`;
      if (!KEYWORDS.test(text) || EXCLUDE.test(text)) continue;
      out.komunikaty.push({ data: e.updated?.slice(0, 10), tytul: e.title, url: e.link, zrodlo: 'Urząd Miejski w Brodnicy', waga: 'info' });
    }
  } catch (e) { out.bledy.push(`Urząd Miejski: ${e.message}`); keepPrevious('Urząd Miejski w Brodnicy'); }

  try {
    const items = parseGovList(await fetchText(PSSE));
    out.zrodla.push({ nazwa: 'PSSE w Brodnicy', url: PSSE, wpisow: items.length });
    for (const it of items) {
      if (!psseDotyczyMiasta(it.tytul)) continue;
      const waga = /niezgodno|nieprzydatno|warunkowej/i.test(it.tytul) ? 'wazne' : 'info';
      out.komunikaty.push({ ...it, zrodlo: 'PSSE w Brodnicy', waga });
    }
  } catch (e) { out.bledy.push(`PSSE: ${e.message}`); keepPrevious('PSSE w Brodnicy'); }

  out.komunikaty.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  await writeJson(OUT, out);
  console.log(`Komunikaty: ${out.komunikaty.length} (źródła: ${out.zrodla.map((z) => `${z.nazwa} ${z.wpisow}`).join(', ')})`);
  if (out.bledy.length) { console.error('Błędy:', out.bledy.join('; ')); process.exitCode = 1; }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
