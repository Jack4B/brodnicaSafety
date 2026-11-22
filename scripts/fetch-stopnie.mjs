#!/usr/bin/env node
// Automatyczna aktualizacja stopni alarmowych.
//
// Źródło: „Raport dobowy” Rządowego Centrum Bezpieczeństwa (gov.pl/web/rcb/raport-dobowy3),
// publikowany codziennie. Zawiera sekcję „STOPNIE ALARMOWE …” z listą obowiązujących stopni,
// obszarem i numerem zarządzenia. Oficjalnego API brak, więc czytamy HTML.
//
// Bezpiecznik: jeśli sekcji nie da się odczytać, NIE nadpisujemy danych — zostaje poprzedni stan,
// a skrypt kończy się błędem (cron/CI to zgłosi). Strona pokazuje wtedy datę ostatniego odczytu.
//
// Użycie: node scripts/fetch-stopnie.mjs [--file raport.html]

import { readFile } from 'node:fs/promises';
import { fetchText, govBlocks, parsePolishDate, dataPath, readJson, writeJson } from './lib.mjs';

export const SOURCE = 'https://www.gov.pl/web/rcb/raport-dobowy3';
const OUT = dataPath('stopnie.json');
const LEVEL = /^(ALFA|BRAVO|CHARLIE|DELTA)(-CRP)?\b/;

export function parseRaport(html) {
  const blocks = govBlocks(html);
  const raportDate = blocks.map((b) => /^\d{1,2}\s+\p{L}+\s+\d{4}\s*r\.?$/u.test(b.text) && parsePolishDate(b.text)).find(Boolean) || null;

  const start = blocks.findIndex((b) => /^STOPNIE ALARMOWE/i.test(b.text));
  if (start < 0) return { raportDate, stopnie: [], naglowek: null };

  const naglowek = blocks[start].text;
  const stopnie = [];
  for (const b of blocks.slice(start + 1)) {
    const m = b.text.match(LEVEL);
    if (!m) {
      // Zdanie wprowadzające zaraz po nagłówku pomijamy; każdy inny blok kończy sekcję.
      if (stopnie.length === 0 && !/^[A-ZĄĆĘŁŃÓŚŹŻ\s–-]{12,}$/.test(b.text)) continue;
      break;
    }
    const zarz = b.text.match(/zarządzenie\s+nr\s+(\d+)\s+z\s+(\d{1,2}\s+\p{L}+\s+\d{4})/iu);
    const obszar = b.text.match(/obowiązuje\s+(.*?)(?:\s*[–-]\s*zarządzenie|$)/i);
    const stopienNr = b.text.match(/\((\d)\.\s*stopień/);
    stopnie.push({
      stopien: m[0],
      poziom: stopienNr ? Number(stopienNr[1]) : null,
      crp: Boolean(m[2]),
      obszar: obszar ? obszar[1].replace(/[;,\s]+$/, '') : null,
      zakres: /wobec\s+(.*?)\s*[–-]\s*zarządzenie/i.exec(b.text)?.[1] || null,
      zarzadzenie: zarz ? { nr: Number(zarz[1]), data: parsePolishDate(zarz[2]) } : null,
      tekst: b.text.replace(/[;.]\s*$/, ''),
    });
  }
  const doMatch = naglowek.match(/do\s+(\d{1,2}\s+\p{L}+\s+\d{4})/u);
  return { raportDate, naglowek, obowiazujeDo: doMatch ? parsePolishDate(doMatch[1]) : null, stopnie };
}

// Co z tego dotyczy mieszkańca Brodnicy (cały kraj + obszary kolejowe — przez miasto biegną linie PKP PLK).
export function dlaBrodnicy(s) {
  const o = (s.obszar || '').toLowerCase();
  if (/całego kraju|terytorium/.test(o) && !s.zakres) return 'cały kraj, w tym Brodnica';
  if (/kolej/.test(o)) return 'obszary linii kolejowych, w tym w Brodnicy';
  return 'nie dotyczy bezpośrednio mieszkańców';
}

async function main() {
  const i = process.argv.indexOf('--file');
  const html = i >= 0 ? await readFile(process.argv[i + 1], 'utf8') : await fetchText(SOURCE);
  const parsed = parseRaport(html);

  if (parsed.stopnie.length === 0) {
    const prev = await readJson(OUT);
    console.error(`Nie znaleziono sekcji „STOPNIE ALARMOWE” w raporcie. Dane bez zmian${prev ? ` (ostatni odczyt: ${prev.pobrano})` : ''}.`);
    process.exit(2);
  }

  const out = {
    zrodlo: 'Rządowe Centrum Bezpieczeństwa — Raport dobowy',
    url: SOURCE,
    raport_z: parsed.raportDate,
    pobrano: new Date().toISOString(),
    naglowek: parsed.naglowek,
    obowiazuje_do: parsed.obowiazujeDo,
    stopnie: parsed.stopnie.map((s) => ({ ...s, dla_brodnicy: dlaBrodnicy(s) })),
  };
  await writeJson(OUT, out);
  console.log(`Stopnie alarmowe (raport z ${out.raport_z}, do ${out.obowiazuje_do}):`);
  for (const s of out.stopnie) console.log(` - ${s.stopien}: ${s.obszar} → ${s.dla_brodnicy}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
