#!/usr/bin/env node
// Eksportuje rysunki z arkuszy pierwsza-pomoc-instrukcje/ (skill medic) jako pliki SVG dla strony:
// src/illustrations/medic/<arkusz>-<panel>.svg. Wymaga skilla medic w ~/.claude/skills/medic (lub MEDIC_KIT).
//   node scripts/ilustracje-medic.mjs
// Wszystkie panele: wersja statyczna (moment akcji). Panele z ANIMOWANE: wersja animowana (pętla CSS).
import { execFileSync } from 'node:child_process';
import { readdirSync, rmSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
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
const files = readdirSync(OUT);
const kb = files.reduce((s, f) => s + statSync(join(OUT, f)).size, 0) / 1024;
console.log(`Wyeksportowano ${files.length} rysunków (${kb.toFixed(0)} KB) do src/illustrations/medic/`);
