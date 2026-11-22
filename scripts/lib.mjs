// Wspólne funkcje skryptów pobierających dane. Bez zależności, Node 18+.
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dataPath = (name) => resolve(ROOT, 'data', name);

const UA = 'GotowoscBrodnica/0.1 (niekomercyjny serwis informacyjny)';

// gov.pl czasem zrywa połączenie — kilka prób z rosnącą przerwą.
export async function fetchText(url, { tries = 4 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status} dla ${url}`);
      return await res.text();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 1500 * 2 ** i));
    }
  }
  throw last;
}

export function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/[​ \s]+/g, ' ').trim();
}

const NAMED = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', ndash: '–', mdash: '—', hellip: '…',
  bdquo: '„', rdquo: '”', ldquo: '“', laquo: '«', raquo: '»', oacute: 'ó', Oacute: 'Ó', shy: '',
};

export function decodeEntities(s) {
  return s
    .replace(/&([a-zA-Z]+);/g, (all, n) => (n in NAMED ? NAMED[n] : all))
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

// Zwraca bloki tekstu (<p>, <li>, <h1-6>) z głównej treści strony gov.pl w kolejności występowania.
export function govBlocks(html) {
  const main = (html.match(/<article[\s\S]*?<\/article>/) || html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const out = [];
  const re = /<(p|li|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(main))) {
    const text = stripTags(m[2]);
    if (text) out.push({ tag: m[1], text });
  }
  return out;
}

export const MONTHS = { stycznia: 1, lutego: 2, marca: 3, kwietnia: 4, maja: 5, czerwca: 6, lipca: 7, sierpnia: 8, września: 9, października: 10, listopada: 11, grudnia: 12 };

// „30 listopada 2026” → „2026-11-30”
export function parsePolishDate(text) {
  const m = text.match(/(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia)\s+(\d{4})/i);
  if (!m) return null;
  return `${m[3]}-${String(MONTHS[m[2].toLowerCase()]).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

export async function readJson(path) {
  try { return JSON.parse(await readFile(path, 'utf8')); } catch { return null; }
}

export async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n');
}
