// Testy jednostkowe: parser Markdown i parsery źródeł danych (na zapisanych fragmentach stron).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRenderer, parseFrontMatter } from '../src/lib/md.mjs';
import { parseRaport, dlaBrodnicy } from '../scripts/fetch-stopnie.mjs';
import { parseAtom, parseGovList, psseDotyczyMiasta } from '../scripts/fetch-komunikaty.mjs';

const fx = (f) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const md = createRenderer({ link: (u) => '/base' + u, illustration: (n, c) => `<fig ${n}>${c}</fig>` });

test('Markdown: nagłówki, kroki, ramki, tabele, telefony', () => {
  const html = md.render(`## Tytuł sekcji\n\n1. **Zrób to.** Opis kroku.\n2. Drugi krok\n\n> [!112] Dzwoń\n> Treść {{tel:112}}\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n[link](/schrony/) i [zewn](https://gov.pl)`);
  assert.match(html, /<h2 id="tytul-sekcji">Tytuł sekcji<\/h2>/);
  assert.match(html, /<ol class="steps"><li><b>Zrób to\.<\/b><span>Opis kroku\.<\/span><\/li><li>Drugi krok<\/li><\/ol>/);
  assert.match(html, /<aside class="callout callout-112"><p class="callout-t">Dzwoń<\/p>/);
  assert.match(html, /<a class="tel" href="tel:112">112<\/a>/);
  assert.match(html, /<table>.*<th>A<\/th>.*<td>2<\/td>/s);
  assert.match(html, /href="\/base\/schrony\/"/);
  assert.match(html, /href="https:\/\/gov\.pl" rel="noopener" class="ext"/);
});

test('Markdown: blok szybko, ilustracja i escapowanie HTML', () => {
  const html = md.render(`::: szybko\n1. **Krok.**\n:::\n\n{{ilustracja:rko|Podpis}}\n\nTekst <script>x</script>`);
  assert.match(html, /<section class="quick"><h2 class="quick-h">Najważniejsze w 30 sekund<\/h2>/);
  assert.match(html, /<fig rko>Podpis<\/fig>/);
  assert.doesNotMatch(html, /<script>/);
});

test('Front matter z listą źródeł', () => {
  const { meta, body } = parseFrontMatter('---\ntitle: Test\nzrodla:\n- A | https://a\n- B\n---\nTreść');
  assert.equal(meta.title, 'Test');
  assert.deepEqual(meta.zrodla, ['A | https://a', 'B']);
  assert.equal(body.trim(), 'Treść');
});

test('Markdown: kod i telefon w tekście linku', () => {
  const html = md.inline('[numer `999`](/kontakty/) i [{{tel:112}}](/a/)');
  assert.doesNotMatch(html, /undefined|\u0000/);
  assert.match(html, /<a href="\/base\/kontakty\/">numer <code>999<\/code><\/a>/);
});

test('Front matter z końcami linii Windows (CRLF) i BOM', () => {
  const { meta, body } = parseFrontMatter('\uFEFF---\r\ntitle: A\r\nzrodla:\r\n- X | https://x.pl\r\n---\r\nTreść');
  assert.equal(meta.title, 'A');
  assert.equal(meta.zrodla.length, 1);
  assert.equal(body.trim(), 'Treść');
});

test('Stopnie alarmowe z raportu dobowego RCB', () => {
  const r = parseRaport(fx('raport-dobowy.html'));
  assert.equal(r.raportDate, '2026-11-22');
  assert.equal(r.obowiazujeDo, '2026-11-30');
  assert.deepEqual(r.stopnie.map((s) => s.stopien), ['CHARLIE', 'BRAVO', 'BRAVO-CRP', 'BRAVO']);
  const [charlie, bravo, crp, abroad] = r.stopnie;
  assert.equal(charlie.poziom, 3);
  assert.match(charlie.obszar, /linii kolejowych/);
  assert.equal(bravo.obszar, 'na terytorium całego kraju');
  assert.deepEqual(bravo.zarzadzenie, { nr: 47, data: '2026-08-25' });
  assert.equal(crp.crp, true);
  assert.match(abroad.zakres, /infrastruktury energetycznej/);
  assert.equal(dlaBrodnicy(bravo), 'cały kraj, w tym Brodnica');
  assert.equal(dlaBrodnicy(charlie), 'obszary linii kolejowych, w tym w Brodnicy');
  assert.equal(dlaBrodnicy(abroad), 'nie dotyczy bezpośrednio mieszkańców');
});

test('Brak sekcji stopni → pusta lista (bez zgadywania)', () => {
  assert.equal(parseRaport('<article><p>22 listopada 2026 r.</p><p>Inne</p></article>').stopnie.length, 0);
});

test('Kanał Atom Urzędu Miejskiego', () => {
  const e = parseAtom(fx('um-brodnica.xml'));
  assert.ok(e.length > 0);
  assert.ok(e.every((x) => x.title && x.link?.startsWith('https://')));
});

test('Lista komunikatów sanepidu i filtr miasta', () => {
  const items = parseGovList(fx('psse-komunikaty.html'));
  assert.ok(items.length >= 5);
  assert.match(items[0].data, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(psseDotyczyMiasta('Komunikat o przydatności wody do spożycia z wodociągu publicznego Brodnica'), true);
  assert.equal(psseDotyczyMiasta('Komunikat … wodociągu publicznego Mszano, gm. Brodnica'), false);
  assert.equal(psseDotyczyMiasta('Komunikat Inspektora Sanitarnego w Brodnicy o wodzie z wodociągu publicznego Sumin'), false);
  assert.equal(psseDotyczyMiasta('Komunikaty dotyczące jakości wody w kąpieliskach'), true);
});
