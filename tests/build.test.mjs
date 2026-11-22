// Test zbudowanej strony: linki wewnętrzne, pliki offline, budżety rozmiaru, wymagane elementy.
// Uruchom po `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) pages.push(p); } })(DIST);
// Adresy na stronie zawierają BASE_PATH (np. /gotowosc/), pliki w dist/ — nie.
const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const toFile = (u) => {
  let p = u.split('#')[0].split('?')[0];
  if (p.startsWith(BASE)) p = '/' + p.slice(BASE.length);
  return join(DIST, p.endsWith('/') ? p + 'index.html' : p);
};

test('są wszystkie kluczowe strony', () => {
  for (const p of ['/', '/alarm/', '/schrony/', '/plecak/', '/pierwsza-pomoc/rko/', '/stopnie-alarmowe/', '/offline/', '/poradnik/', '/kontakty/']) assert.ok(existsSync(toFile(p)), p);
});

test('linki wewnętrzne i zasoby prowadzą do istniejących plików', () => {
  const broken = [];
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    for (const [, u] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!existsSync(toFile(u))) broken.push(`${page.replace(DIST, '/')} → ${u}`);
  }
  assert.deepEqual(broken, []);
});

test('Service Worker zapisuje wszystkie strony i istniejące pliki', () => {
  const sw = readFileSync(join(DIST, 'sw.js'), 'utf8');
  const files = JSON.parse(sw.match(/const FILES = (\[.*?\]);/s)[1]);
  assert.ok(files.length > 40);
  for (const f of files) assert.ok(existsSync(toFile(f)), f);
  for (const page of pages.filter((p) => !p.endsWith('404.html'))) {
    const url = page.replace(DIST, BASE).replace(/index\.html$/, '');
    assert.ok(files.includes(url), `brak w SW: ${url}`);
  }
});

test('budżety: strona < 200 KB, całość offline < 1,5 MB', () => {
  const sw = readFileSync(join(DIST, 'sw.js'), 'utf8');
  const files = JSON.parse(sw.match(/const FILES = (\[.*?\]);/s)[1]);
  let total = 0;
  for (const f of files) { const s = statSync(toFile(f)).size; total += s; if (f.endsWith('/')) assert.ok(s < 200 * 1024, `${f} ${s}`); }
  assert.ok(total < 1.5 * 1024 * 1024, `razem ${total}`);
});

test('każda strona ma tytuł, opis, 112, disclaimer i jeden h1', () => {
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    assert.match(html, /<title>.+<\/title>/, page);
    assert.match(html, /<meta name="description" content=".+">/, page);
    assert.match(html, /href="tel:112"/, page);
    assert.match(html, /Nie zastępuje oficjalnych komunikatów/, page);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, page);
  }
});

test('treści medyczne i dane mają źródła', () => {
  for (const page of pages.filter((p) => /pierwsza-pomoc\/.+\//.test(p.replace(DIST, '')))) {
    assert.match(readFileSync(page, 'utf8'), /Źródła:/, page);
  }
  const start = readFileSync(join(DIST, 'index.html'), 'utf8');
  assert.match(start, /Raport RCB z \d\d\.\d\d\.\d{4}/);
});
