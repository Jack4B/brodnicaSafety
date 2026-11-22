#!/usr/bin/env node
// Eksportuje rysunki z arkuszy pierwsza-pomoc-instrukcje/ (skill medic) jako pliki SVG dla strony:
// src/illustrations/medic/<arkusz>-<panel>.svg. Wymaga skilla medic w ~/.claude/skills/medic (lub MEDIC_KIT).
//   node scripts/ilustracje-medic.mjs
// Wszystkie panele: wersja statyczna (moment akcji). Panele z ANIMOWANE: wersja animowana (pętla CSS).
import { execFileSync } from 'node:child_process';
import { readdirSync, rmSync, mkdirSync, copyFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'pierwsza-pomoc-instrukcje/src');
const OUT = join(ROOT, 'src/illustrations/medic');
const ANIMOWANE = ['02-rko-2']; // uciśnięcia w prawdziwym tempie ~110/min
const sheets = readdirSync(SRC).filter((f) => /^\d\d-.*\.mjs$/.test(f));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const run = (file, env) => execFileSync(process.execPath, [join(SRC, file)], { env: { ...process.env, ...env }, stdio: ['ignore', 'ignore', 'inherit'] });
for (const f of sheets) run(f, { EKSPORT_SVG_DIR: OUT, MEDIC_FREEZE: '0.5' });
const tmp = join(tmpdir(), 'medic-anim');
rmSync(tmp, { recursive: true, force: true });
for (const f of sheets) if (ANIMOWANE.some((a) => a.startsWith(f.replace('.mjs', '')))) run(f, { EKSPORT_SVG_DIR: tmp, MEDIC_FREEZE: '' });
for (const a of ANIMOWANE) copyFileSync(join(tmp, a + '.svg'), join(OUT, a + '.svg'));
// arkusze HTML w pierwsza-pomoc-instrukcje/ zostały nadpisane wersją statyczną — przywróć animowane
for (const f of sheets) run(f, { MEDIC_FREEZE: '' });
// Style rysunków z kitu medic, zawężone do .illu-medic (strona nie potrzebuje kitu przy buildzie).
const kit = await import(pathToFileURL(process.env.MEDIC_KIT || join(homedir(), '.claude/skills/medic/kit/body.mjs')).href);
const rules = kit.CSS.split('\n').filter((l) => /^\.mp-(edge|skin|blob|eye|figure|stroke|tip|dot|callout|label|flesh|closeup|hint|prop|patch|blister|band|fibre|lobes|count|forbid|ground|drops|frame)|^\[data-tone/.test(l));
const scoped = rules.map((l) => l.replace(/^([^{]+)\{/, (_, sel) => sel.split(',').map((x) => `.illu-medic ${x.trim()}`).join(',') + '{')).join('\n');
writeFileSync(join(ROOT, 'src/assets/medic.css'), `/* Wygenerowane przez scripts/ilustracje-medic.mjs z kitu skilla medic — nie edytuj ręcznie. */
/* Paleta rysunków jak w arkuszach: czerwień #C8102E, granat #1F2A44, beż; zawsze na białej karcie. */
.illu-medic{--mp-paper:#ffffff;--mp-ink:#1F2A44;--mp-mid:#5A6478;--mp-faint:#D8DCE4;--mp-a:#F6E7D7;--mp-b:#DFC2A3;--mp-accent:#C8102E;--mp-water:#7E95BE;--mp-ok:#1F2A44;--mp-soft:#F3EEE8;background:#ffffff}
${scoped}
@media (prefers-reduced-motion:reduce){.illu-medic .mp-frame{animation:none!important}.illu-medic .mp-frame[data-still]{visibility:visible}}
@media print{.illu-medic .mp-frame{animation:none!important}.illu-medic .mp-frame[data-still]{visibility:visible}}
`);
const files = readdirSync(OUT);
const kb = files.reduce((s, f) => s + statSync(join(OUT, f)).size, 0) / 1024;
console.log(`Wyeksportowano ${files.length} rysunków (${kb.toFixed(0)} KB) do src/illustrations/medic/`);
