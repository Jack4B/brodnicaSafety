#!/usr/bin/env node
// Buduje wszystkie arkusze (animowane HTML), statyczne PNG do druku (MEDIC_FREEZE=0.5 + scripts/shot.sh),
// index.html z miniaturami. Uruchom: node src/zbuduj.mjs   (CHROME — ścieżka do Chrome, jeśli shot.sh go nie znajdzie)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..');
const SHOT = join(process.env.MEDIC_DIR || join(homedir(), '.claude/skills/medic'), 'scripts/shot.sh');
const ARKUSZE = [
  ['01-ocena', 'Ocena poszkodowanego'],
  ['02-rko', 'RKO u dorosłego'],
  ['03-aed', 'Użycie AED'],
  ['04-pozycja-boczna', 'Pozycja boczna bezpieczna'],
  ['05-zadlawienie-dorosly', 'Zadławienie — dorosły'],
  ['06-zadlawienie-niemowle', 'Zadławienie — niemowlę'],
  ['07-krwotok', 'Tamowanie krwotoku'],
  ['08-oparzenie', 'Oparzenie termiczne'],
  ['09-anafilaksja', 'Anafilaksja — autostrzykawka'],
];

// wysokość strony do zrzutu
let chromium = null;
try { chromium = createRequire(import.meta.url)('playwright').chromium; } catch { /* bez Playwright: stała wysokość */ }
const browser = chromium ? await chromium.launch() : null;
const height = async (file) => {
  if (!browser) return 1700;
  const p = await browser.newPage({ viewport: { width: 900, height: 800 } });
  await p.goto('file://' + file);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.close();
  return h + 10;
};

mkdirSync(join(OUT, 'png'), { recursive: true });
for (const [name] of ARKUSZE) {
  const run = (env) => execFileSync(process.execPath, [join(HERE, name + '.mjs')], { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'inherit'] });
  run({ MEDIC_FREEZE: '0.5' });                                       // wersja statyczna
  const still = join(OUT, 'png', name + '.html');
  writeFileSync(still, readFileSync(join(OUT, name + '.html')));
  execFileSync('sh', [SHOT, still, join(OUT, 'png', name + '.png'), '900', String(await height(still))], { stdio: 'inherit' });
  rmSync(still);
  run({ MEDIC_FREEZE: '' });                                          // wersja animowana (docelowy HTML)
}
if (browser) await browser.close();

const karty = ARKUSZE.map(([name, title], i) => `<a class="k" href="${name}.html"><img src="png/${name}.png" alt="Podgląd: ${title}" loading="lazy"><span><b>${String(i + 1).padStart(2, '0')}</b> ${title}</span></a>`).join('\n');
writeFileSync(join(OUT, 'index.html'), `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pierwsza pomoc — instrukcje</title>
<style>body{margin:0;padding:28px max(16px,3vw);background:#fff;color:#1F2A44;font:15px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}h1{margin:0 0 4px;font-size:26px}p{margin:0 0 20px;color:#5A6478;max-width:70ch}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}.k{display:grid;gap:8px;text-decoration:none;color:inherit;border:1px solid #D8DCE4;border-radius:10px;padding:10px}.k img{width:100%;height:260px;object-fit:cover;object-position:top;border-radius:6px;border:1px solid #D8DCE4}.k b{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#1F2A44;color:#fff;font-size:13px;margin-right:6px}.k:hover{border-color:#C8102E}footer{margin-top:24px;font-size:13px;color:#5A6478}</style></head><body>
<h1>Pierwsza pomoc — instrukcje obrazkowe</h1>
<p>Osiem arkuszy z numerowanymi panelami. Kliknij, aby otworzyć wersję animowaną; wersje do druku są w katalogu <code>png/</code>. Materiał edukacyjny, nie porada medyczna — do weryfikacji przez osobę z uprawnieniami KPP/ratownika. Źródła: <a href="ZRODLA.md">ZRODLA.md</a>.</p>
<div class="g">
${karty}
</div>
<footer>Ilustracje wykonane skillem <a href="https://github.com/zenbakiak/medic">medic</a>; wytyczne: ERC 2025 (polskie wydanie PRR), „Poradnik bezpieczeństwa” 2025.</footer>
</body></html>
`);
console.log('Gotowe:', readdirSync(join(OUT, 'png')).length, 'PNG, index.html');
