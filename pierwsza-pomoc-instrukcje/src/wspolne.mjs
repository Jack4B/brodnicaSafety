// Wspólne ustawienia arkuszy „pierwsza-pomoc-instrukcje”: kit medic, paleta, skala, układ, polska stopka.
// Kit: skill medic (https://github.com/zenbakiak/medic), domyślnie w ~/.claude/skills/medic.
// Ścieżkę można zmienić zmienną MEDIC_KIT.
import { writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KIT = process.env.MEDIC_KIT || join(homedir(), '.claude/skills/medic/kit/body.mjs');
export const m = await import(pathToFileURL(KIT).href);
export const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- jedna skala i jedna scena dla wszystkich paneli ---
export const S = 26;                     // px na głowę dorosłego — ta sama postać we wszystkich arkuszach
export const FLOOR = 238;                // linia podłogi
export const STAND = FLOOR - (m.BUILDS.adult.thigh + m.BUILDS.adult.shin) * S; // biodro stojącego dorosłego
export const floor = m.ground(FLOOR, 24, 296);
export const ROG = [262, 54];            // miejsce dużej liczby w każdym panelu

/** Duża liczba kluczowa — zawsze w tym samym miejscu i rozmiarze. */
export const liczba = (text, at = ROG) => m.count(at, text, { size: 26 });

/** Leżący na plecach (głowa po lewej). `glowa` — kąt głowy (−90 neutralnie, ok. −115 odgięta). */
export function lezacy(x = 196, { glowa = -90 } = {}) {
  return m.figure({ at: [x, FLOOR - 14], scale: S, pose: { torso: -90, head: glowa, armNear: [92, 90], armFar: [92, 90], legNear: [90, 90], legFar: [90, 88], footNear: 0, footFar: 0 } });
}

/** Ratownik klęczący po drugiej stronie leżącego, zwrócony w lewo. Ręce sięgają podanych punktów. */
export function kleczacy(x, { pochylenie = 35, glowa = 60, rekaBliz, rekaDal, lit = ['armNear'] } = {}) {
  const pose = { torso: pochylenie, head: glowa, legNear: [176, -90], legFar: [184, -90], footNear: -90, footFar: -90 };
  if (rekaBliz) pose.armNear = { to: rekaBliz, bend: 1 };
  if (rekaDal) pose.armFar = { to: rekaDal, bend: 1 };
  return m.figure({ at: [x, FLOOR - 50], scale: S, tone: 'b', facing: -1, pose, lit });
}

// --- paleta (zamiast domyślnych tokenów kitu) ---
// czerwień #C8102E: znaczniki i strzałki · granat #1F2A44: kontury · jasny beż: skóra · białe tło.
// Poszkodowany: jaśniejszy beż, ratownik: ciemniejszy beż — żeby od razu było widać, kto jest kim.
const PALETA = ':root{--mp-page:#ffffff;--mp-paper:#ffffff;--mp-ink:#1F2A44;--mp-mid:#5A6478;--mp-faint:#D8DCE4;--mp-a:#F6E7D7;--mp-b:#DFC2A3;--mp-accent:#C8102E;--mp-water:#7E95BE;--mp-ok:#1F2A44;--mp-soft:#F3EEE8}';

const POLSKA_STOPKA = 'Materiał edukacyjny, nie porada medyczna. Nie zastępuje kursu pierwszej pomocy. Do weryfikacji przez osobę z uprawnieniami KPP/ratownika.';

/**
 * Zapisuje arkusz. `wybory` — lista decyzji protokołu (gdzie wytyczne się różnią: wybrano wersję ERC),
 * pokazywana w stopce. `doSprawdzenia` — punkty oznaczone „DO SPRAWDZENIA”.
 */
export function arkusz({ plik, title, lede, call, panels, donts = [], notes = [], source, wybory = [], doSprawdzenia = [] }) {
  let html = m.page({ title, lede, call, panels, donts, notes, source, theme: 'light', lang: 'pl', columns: 2, disclaimer: POLSKA_STOPKA });
  html = html
    .replace(/:root\{--mp-page:[^}]+\}/, PALETA)
    .replace('<h4>Do not</h4>', '<h4>Nie rób tego</h4>')
    .replace('<h4>Keep in mind</h4>', '<h4>Pamiętaj</h4>')
    .replace('<p class="mp-source">Source: ', '<p class="mp-source">Źródło: ')
    .replace('</style>', '.mp-protokol{border:1px solid var(--mp-faint);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--mp-mid)}.mp-protokol h4{margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mp-ink)}.mp-protokol ul{margin:0;padding-left:18px}.mp-sprawdz{color:var(--mp-accent);font-weight:700}.mp-protokol a{color:inherit}</style>');
  const blok = [
    ...wybory.map((w) => `<li>${w}</li>`),
    ...doSprawdzenia.map((w) => `<li><span class="mp-sprawdz">DO SPRAWDZENIA:</span> ${w}</li>`),
  ];
  if (blok.length) html = html.replace('<p class="mp-source">', `<div class="mp-protokol"><h4>Protokół i wybory</h4><ul>${blok.join('')}</ul></div><p class="mp-source">`);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, plik), html);
  console.log(`zapisano ${plik}`);
}

export const ZRODLO_ERC = 'Europejska Rada Resuscytacji (ERC), wytyczne 2025 — polskie wydanie Polskiej Rady Resuscytacji „Resuscytacja dla każdego” (2026); rządowy „Poradnik bezpieczeństwa” (MSWiA, MON, RCB, 2025)';

// --- rekwizyty wspólne dla arkuszy ---

/** AED: obudowa z sercem i błyskawicą. `at` — środek. */
export function aed([x, y], w = 64) {
  const h = w * 0.78;
  return m.prop(m.box(x - w / 2, y - h / 2, w, h, 8), { fill: 'paper' }) +
    m.prop(`M${x} ${y + h * 0.26}c-${w * 0.22} -${h * 0.16} -${w * 0.3} -${h * 0.34} -${w * 0.16} -${h * 0.46}c${w * 0.08} -${h * 0.07} ${w * 0.14} -${h * 0.02} ${w * 0.16} ${h * 0.05}c${w * 0.02} -${h * 0.07} ${w * 0.08} -${h * 0.12} ${w * 0.16} -${h * 0.05}c${w * 0.14} ${h * 0.12} ${w * 0.06} ${h * 0.3} -${w * 0.16} ${h * 0.46}Z`, { fill: 'accent', tone: 'accent' }) +
    m.label([x, y + h / 2 + 14], 'AED');
}

/** Dwie dłonie z góry, jedna na drugiej (zbliżenie): nasada dolnej dłoni w punkcie `at`. */
export function dlonie([x, y], { szer = 46, wys = 26 } = {}) {
  return m.prop(m.box(x - szer / 2, y - wys, szer, wys, 10), { fill: 'soft' }) + m.prop(m.box(x - szer / 2 + 6, y - wys - 12, szer - 4, wys, 10), { fill: 'soft' });
}

/** Opatrunek (gaza) w punkcie `at`; `warstwy` > 1 rysuje kolejne warstwy. */
export function opatrunek([x, y], { szer = 60, wys = 18, warstwy = 1 } = {}) {
  let out = '';
  for (let i = 0; i < warstwy; i++) out += m.prop(m.box(x - szer / 2 + i * 4, y - wys / 2 - i * 7, szer, wys, 4), { fill: 'paper' });
  return out;
}
