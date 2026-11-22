#!/usr/bin/env node
// Eksport spójnego zestawu ikon pierwszej pomocy z Health Icons (CC0).
//   git clone --depth 1 https://github.com/resolvetosavelives/healthicons /tmp/healthicons
//   node scripts/ikony-healthicons.mjs /tmp/healthicons
// Wynik: pierwsza-pomoc-ikony/{svg,svg-negatyw,png-512}/, arkusz.html, LICENCJA.md
//
// Spójność: jeden wariant (filled), jedna siatka (48 px), jeden kolor (#C8102E),
// ten sam margines — każdy kształt skalowany proporcjonalnie do pola 40×40 i centrowany (4 px marginesu).

import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'pierwsza-pomoc-ikony');
const SRC = join(process.argv[2] || '/tmp/healthicons', 'public/icons/svg/filled');
const RED = '#C8102E';
const GRID = 48, PAD = 4, BOX = GRID - 2 * PAD;

// plik w repozytorium → [nazwa po polsku, opis]
export const ICONS = [
  ['people/cpr', 'rko', 'Resuscytacja (RKO) — uciskanie klatki piersiowej'],
  ['devices/defibrillator', 'aed', 'Defibrylator AED'],
  ['conditions/burn', 'oparzenie', 'Oparzenie termiczne'],
  ['conditions/chemical-burn', 'oparzenie-chemiczne', 'Oparzenie chemiczne'],
  ['objects/running-water', 'chlodzenie-woda', 'Chłodzenie bieżącą wodą'],
  ['objects/bandage-adhesive', 'plaster', 'Plaster z opatrunkiem'],
  ['body/blood-drop', 'krwawienie', 'Krwawienie'],
  ['devices/stitches', 'rana', 'Rana'],
  ['emotions/face-bandaged', 'uraz-glowy', 'Uraz głowy, opatrunek'],
  ['people/traumatism', 'uraz', 'Uraz, osoba poszkodowana'],
  ['devices/cast', 'zlamanie', 'Złamanie (gips)'],
  ['devices/sling', 'temblak', 'Temblak, unieruchomienie ręki'],
  ['devices/crutches', 'kula', 'Kula łokciowa'],
  ['body/bone', 'kosc', 'Kość'],
  ['ppe/ppe-gloves', 'rekawiczki', 'Rękawiczki ochronne'],
  ['objects/phone', 'telefon-alarmowy', 'Telefon alarmowy 112'],
  ['people/call-centre', 'dyspozytor', 'Dyspozytor numeru alarmowego'],
  ['vehicles/ambulance', 'karetka', 'Karetka pogotowia'],
  ['specialties/accident-and_emergency', 'ratunkowy', 'Sygnał ratunkowy'],
  ['places/emergency-post', 'punkt-pomocy', 'Punkt pomocy medycznej'],
  ['places/hospital', 'szpital', 'Szpital'],
  ['symbols/hospital-symbol', 'szpital-h', 'Znak szpitala „H”'],
  ['symbols/heart', 'serce', 'Serce'],
  ['symbols/heartbeat', 'tetno', 'Tętno'],
  ['body/lungs', 'oddech', 'Oddech'],
  ['emotions/face-dizzy', 'zaslabniecie', 'Zasłabnięcie, zawroty głowy'],
  ['conditions/allergies', 'alergia', 'Alergia'],
  ['devices/syringe', 'zastrzyk', 'Zastrzyk'],
  ['medications/medicines', 'leki', 'Leki'],
  ['devices/thermometer', 'termometr', 'Temperatura ciała'],
  ['symbols/poison', 'zatrucie', 'Zatrucie'],
  ['symbols/hazardous', 'skazenie', 'Skażenie (CBRN)'],
  ['symbols/alert-triangle', 'uwaga', 'Uwaga, zagrożenie'],
  ['symbols/assembly-point', 'punkt-zbiorki', 'Miejsce zbiórki'],
];

const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();

async function main() {
  await rm(OUT, { recursive: true, force: true });
  for (const d of ['svg', 'svg-negatyw', 'png-512']) await mkdir(join(OUT, d), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];
  for (const [src, name, label] of ICONS) {
    const body = inner(await readFile(join(SRC, src + '.svg'), 'utf8')).replace(/currentColor/g, RED);
    // obwiednia kształtu w siatce 48
    await page.setContent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="480" height="480"><g id="g">${body}</g></svg>`);
    const bb = await page.evaluate(() => { const b = document.getElementById('g').getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    const s = BOX / Math.max(bb.w, bb.h);
    const tx = PAD + (BOX - bb.w * s) / 2 - bb.x * s;
    const ty = PAD + (BOX - bb.h * s) / 2 - bb.y * s;
    const g = `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)})">${body}</g>`;
    const meta = `<title>${label}</title><desc>Health Icons (CC0): ${src}.svg</desc>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">${meta}${g}</svg>\n`;
    const neg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">${meta}<rect width="48" height="48" rx="8" fill="${RED}"/>${g.replaceAll(RED, '#FFFFFF')}</svg>\n`;
    await writeFile(join(OUT, 'svg', name + '.svg'), svg);
    await writeFile(join(OUT, 'svg-negatyw', name + '.svg'), neg);
    // PNG 512×512, przezroczyste tło
    await page.setViewportSize({ width: 512, height: 512 });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('width="48" height="48"', 'width="512" height="512"')}</body></html>`);
    await page.locator('svg').screenshot({ path: join(OUT, 'png-512', name + '.png'), omitBackground: true });
    results.push({ src, name, label, scale: s });
  }
  await browser.close();

  const cells = results.map((r) => `<figure><div class="ico">${'<img src="svg/' + r.name + '.svg" alt="">'}</div><div class="ico neg"><img src="svg-negatyw/${r.name}.svg" alt=""></div><figcaption><b>${r.label}</b><code>${r.name}.svg</code><small>${r.src}.svg</small></figcaption></figure>`).join('\n');
  await writeFile(join(OUT, 'arkusz.html'), `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ikony pierwszej pomocy — arkusz</title>
<style>
  :root { --red: ${RED}; --ink: #1F2A44; --muted: #5B6478; --line: #E3E6EC; }
  body { margin: 0; padding: 24px max(16px, 3vw); font: 15px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: var(--ink); background: #fff; }
  h1 { margin: 0 0 4px; font-size: 26px; } p.lead { margin: 0 0 20px; color: var(--muted); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
  figure { margin: 0; border: 1px solid var(--line); border-radius: 14px; padding: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .ico { min-width: 0; aspect-ratio: 1; display: grid; place-items: center; background: #fff; border-radius: 10px; outline: 1px dashed var(--line); }
  .ico img { display: block; width: 100%; height: 100%; max-width: 100%; }
  figcaption { grid-column: 1 / -1; display: grid; gap: 2px; }
  figcaption b { font-size: 14.5px; } code { font-size: 12.5px; color: var(--red); } small { font-size: 11.5px; color: var(--muted); }
  footer { margin-top: 24px; font-size: 13px; color: var(--muted); }
</style></head><body>
<h1>Ikony pierwszej pomocy</h1>
<p class="lead">${results.length} ikon · Health Icons, wariant <b>filled</b>, siatka <b>48 px</b>, kolor <b>${RED}</b>, margines 4 px (kształt w polu 40×40). Po lewej wersja podstawowa, po prawej biały na czerwonym. Przerywana ramka = granica siatki.</p>
<div class="grid">
${cells}
</div>
<footer>Źródło: <a href="https://github.com/resolvetosavelives/healthicons">Health Icons</a> (CC0 1.0). Kolor i marginesy dostosowane. Szczegóły w LICENCJA.md.</footer>
</body></html>
`);

  await writeFile(join(OUT, 'LICENCJA.md'), `# Licencja

Ikony pochodzą z projektu **Health Icons** — https://github.com/resolvetosavelives/healthicons (podgląd: https://healthicons.org).

Ikony (pliki SVG i PNG w \`public/icons\`) są udostępnione jako **CC0 1.0 Universal** (domena publiczna): https://creativecommons.org/publicdomain/zero/1.0/deed.pl
Można je kopiować, zmieniać i używać, także komercyjnie, bez podawania autora. Podanie źródła jest mile widziane.

## Zmiany w tym zestawie

- wariant \`filled\`, siatka 48 px,
- kolor zmieniony z \`currentColor\` na **${RED}** (atrybut \`fill\` w SVG, bez rastrowania); wariant \`svg-negatyw\` — biały kształt na czerwonym kwadracie,
- każdy kształt przeskalowany proporcjonalnie do pola 40×40 i wyśrodkowany (identyczny margines 4 px),
- nazwy plików po polsku; oryginalna ścieżka zapisana w elemencie \`<desc>\` każdego pliku,
- \`png-512/\` — eksport 512×512 z przezroczystym tłem.

| Plik | Źródło w Health Icons |
|---|---|
${results.map((r) => `| \`${r.name}.svg\` | \`public/icons/svg/filled/${r.src}.svg\` |`).join('\n')}

Zestaw wygenerowano skryptem \`scripts/ikony-healthicons.mjs\`.
`);
  console.log(`Wyeksportowano ${results.length} ikon do pierwsza-pomoc-ikony/`);
  const small = results.filter((r) => r.scale > 1.6).map((r) => `${r.name} ×${r.scale.toFixed(2)}`);
  if (small.length) console.log('Mocno powiększone (sprawdź ostrość):', small.join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
