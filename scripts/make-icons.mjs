#!/usr/bin/env node
// Generuje ikony PNG aplikacji ze znaku SVG (jednorazowo; wynik w src/icons/, trafia do repozytorium).
// Wymaga Playwright: node scripts/make-icons.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // CommonJS, także z globalnej instalacji
import { MARK_SVG } from '../src/lib/icons.mjs';

const out = new URL('../src/icons/', import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage();
const shots = [
  ['icon-192.png', 192, 0], ['icon-512.png', 512, 0], ['apple-touch-icon.png', 180, 0], ['icon-maskable-512.png', 512, 0.12],
];
for (const [name, size, pad] of shots) {
  const inner = Math.round(size * (1 - 2 * pad));
  const svg = pad ? MARK_SVG.replace('rx="7"', 'rx="0"') : MARK_SVG;
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<body style="margin:0;background:${pad ? '#F08A24' : 'transparent'};display:grid;place-items:center;height:${size}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</body>`);
  await p.screenshot({ path: out + name, omitBackground: !pad });
}
await b.close();
console.log('Ikony zapisane w src/icons/');
