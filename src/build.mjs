#!/usr/bin/env node
// Buduje statyczną stronę do katalogu dist/. Bez zależności — wystarczy Node 18+.
//   node src/build.mjs
// Treści: content/**/*.md · dane: data/*.json · ilustracje: src/illustrations/*.svg

import { readFile, writeFile, mkdir, readdir, rm, copyFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, NAV } from './site.mjs';
import { createRenderer, parseFrontMatter, esc } from './lib/md.mjs';
import { MARK_SVG } from './lib/icons.mjs';
import * as T from './templates.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const CONTENT = join(ROOT, 'content');
const today = (process.env.BUILD_DATE || new Date().toISOString()).slice(0, 10);

const url = (p) => (SITE.base + p.replace(/^\//, '')).replace(/\/{2,}/g, '/');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const readJson = async (p, d = null) => { try { return JSON.parse(await readFile(join(ROOT, p), 'utf8')); } catch { return d; } };

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// ---------- ilustracje i dźwięki ----------
/** Strona do druku: z animowanych rysunków medic zostaje tylko klatka nieruchoma (data-still). */
function stillFrames(html) {
  let out = '', i = 0;
  for (;;) {
    const start = html.indexOf('<g class="mp-frame"', i);
    if (start < 0) return out + html.slice(i);
    let depth = 0, j = start, end = -1;
    const re = /<g[\s>]|<\/g>/g;
    re.lastIndex = start;
    for (let mm; (mm = re.exec(html));) {
      depth += mm[0] === '</g>' ? -1 : 1;
      if (depth === 0) { end = re.lastIndex; break; }
    }
    if (end < 0) return out + html.slice(i);
    const frame = html.slice(start, end);
    out += html.slice(i, start);
    const open = frame.slice(0, frame.indexOf('>') + 1);
    if (open.includes('data-still')) out += '<g>' + frame.slice(open.length);
    i = end;
  }
}

const illuCache = new Map();
const medicIllu = new Set();
const healthIcons = new Map();
async function loadIllustrations() {
  for (const f of await readdir(join(ROOT, 'src/illustrations/medic')).catch(() => [])) {
    if (!f.endsWith('.svg')) continue;
    const name = f.replace(/\.svg$/, '');
    illuCache.set(name, (await readFile(join(ROOT, 'src/illustrations/medic', f), 'utf8')).trim());
    medicIllu.add(name);
  }
  // Ikony Health Icons (CC0) z pierwsza-pomoc-ikony/svg — kolor #C8102E w pliku
  for (const f of await readdir(join(ROOT, 'pierwsza-pomoc-ikony/svg')).catch(() => [])) {
    if (f.endsWith('.svg')) healthIcons.set(f.replace(/\.svg$/, ''), (await readFile(join(ROOT, 'pierwsza-pomoc-ikony/svg', f), 'utf8')).replace(/<title>.*?<\/title><desc>.*?<\/desc>/, '').replace(/ width="48" height="48"/, ' class="i hi" aria-hidden="true" focusable="false"').trim());
  }
  const dir = join(ROOT, 'src/illustrations');
  try {
    for (const f of await readdir(dir)) if (f.endsWith('.svg')) illuCache.set(f.replace(/\.svg$/, ''), (await readFile(join(dir, f), 'utf8')).trim());
  } catch { /* brak katalogu */ }
}
const missing = [];
const renderer = createRenderer({
  link: (u) => url(u),
  illustration: (name, caption) => {
    const svg = illuCache.get(name);
    if (!svg) { missing.push(`ilustracja: ${name}`); return ''; }
    const clean = svg.replace(/<\?xml[^>]*>/, '');
    const body = /role="img"/.test(clean) ? clean : clean.replace(/<svg /, '<svg role="img" ');
    const medic = medicIllu.has(name);
    return `<figure class="illu${medic ? ' illu-medic' : ''}">${body}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  },
  audio: (file, caption) => `<div class="audio"><p>${caption || 'Posłuchaj'}</p><audio controls preload="none" src="${url('/assets/audio/' + file)}"></audio></div>`,
});

// ---------- komunikaty: scalenie źródeł ----------
function mergeMessages(manual, auto, imgw) {
  const list = [];
  for (const m of manual || []) {
    if (m.wazne_do && m.wazne_do < today) continue;
    list.push({ ...m, zrodlo: m.zrodlo || 'redakcja' });
  }
  for (const m of auto?.komunikaty || []) list.push({ ...m, etykieta: m.zrodlo === 'PSSE w Brodnicy' ? 'Sanepid' : 'Urząd Miejski' });
  for (const w of imgw?.ostrzezenia || []) {
    if (w.do && w.do.slice(0, 10) < today) continue;
    list.push({
      data: (w.opublikowano || w.od || today).slice(0, 10),
      tytul: `${w.zdarzenie || 'Ostrzeżenie meteorologiczne'} — powiat brodnicki`,
      tresc: [w.od && w.do ? `Od ${T.fmtDate(w.od)} ${w.od.slice(11, 16)} do ${T.fmtDate(w.do)} ${w.do.slice(11, 16)}.` : '', w.tresc || ''].filter(Boolean).join(' '),
      waga: +w.stopien >= 2 ? 'pilne' : 'wazne',
      etykieta: `IMGW · ${w.stopien || '?'}. stopień`,
      zrodlo: 'IMGW-PIB',
      url: 'https://meteo.imgw.pl/dyn/?osmet=true',
    });
  }
  return list.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await loadIllustrations();

  // ---------- dane ----------
  const [stopnie, auto, manual, imgw, schrony, plecak] = await Promise.all([
    readJson('data/stopnie.json'), readJson('data/komunikaty-auto.json'), readJson('data/komunikaty.json', []),
    readJson('data/ostrzezenia-imgw.json'), readJson('data/schrony.json'), readJson('data/plecak.json'),
  ]);
  const data = {
    stopnie, schrony, plecak,
    komunikaty: mergeMessages(manual, auto, imgw),
    zrodlaKomunikatow: [
      { nazwa: 'IMGW-PIB — ostrzeżenia dla powiatu brodnickiego', sprawdzono: imgw?.pobrano },
      ...(auto?.zrodla || []).map((z) => ({ nazwa: z.nazwa, sprawdzono: z.sprawdzono || auto.pobrano, blad: !!z.blad })),
      { nazwa: 'Komunikaty redakcji (data/komunikaty.json)', sprawdzono: today },
    ],
  };

  // ---------- zasoby z hashem ----------
  const css = (await readFile(join(ROOT, 'src/assets/style.css'), 'utf8')) + '\n' + (await readFile(join(ROOT, 'src/assets/medic.css'), 'utf8').catch(() => ''));
  const js = await readFile(join(ROOT, 'src/assets/app.js'), 'utf8');
  const assets = { css: `assets/style.${hash(css)}.css`, js: `assets/app.${hash(js)}.js` };
  await mkdir(join(DIST, 'assets/audio'), { recursive: true });
  await writeFile(join(DIST, assets.css), css);
  await writeFile(join(DIST, assets.js), js);
  for (const f of await readdir(join(ROOT, 'src/assets/audio'))) await copyFile(join(ROOT, 'src/assets/audio', f), join(DIST, 'assets/audio', f));
  await mkdir(join(DIST, 'icons'), { recursive: true });
  await writeFile(join(DIST, 'icons/icon.svg'), MARK_SVG);
  for (const f of await readdir(join(ROOT, 'src/icons')).catch(() => [])) await copyFile(join(ROOT, 'src/icons', f), join(DIST, 'icons', f));

  // ---------- treści ----------
  const pages = new Map();
  for (const file of await walk(CONTENT)) {
    const rel = relative(CONTENT, file).replace(/\\/g, '/');
    const path = '/' + rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/');
    const { meta, body } = parseFrontMatter(await readFile(file, 'utf8'));
    if (!meta.title) throw new Error(`Brak „title” w ${rel}`);
    const ctxH = { headings: [] };
    pages.set(path === '//' ? '/' : path, { path: path === '//' ? '/' : path, meta, html: renderer.render(body, ctxH), headings: ctxH.headings, file: rel });
  }
  const children = (p) => [...pages.values()].filter((x) => x.path !== p && x.path.startsWith(p) && x.path.slice(p.length).split('/').filter(Boolean).length === 1)
    .sort((a, b) => (+a.meta.kolejnosc || 99) - (+b.meta.kolejnosc || 99) || a.meta.title.localeCompare(b.meta.title, 'pl'));

  const ctx = { url, data, pages, buildDate: today, assets, healthIcons };
  const out = new Map(); // ścieżka → { title, description, main }

  const special = {
    '/stopnie-alarmowe/': T.pageStopnie,
    '/komunikaty/': T.pageKomunikaty,
    '/plecak/': T.pagePlecak,
    '/schrony/': T.pageSchrony,
    '/offline/': T.pageOffline,
  };
  for (const page of pages.values()) {
    if (page.path === '/') continue;
    const fn = special[page.path];
    const main = fn ? fn(ctx, page) : T.article(ctx, page, { children: children(page.path) });
    out.set(page.path, { title: page.meta.title, description: page.meta.lead, main });
  }
  out.set('/', { title: SITE.name, description: SITE.description, main: T.pageStart(ctx) });
  out.set('/wiecej/', { title: 'Wszystkie działy', main: T.pageWiecej(ctx) });

  // Poradnik w jednym pliku: kolejność wg menu, potem podstrony każdego działu.
  const order = [];
  for (const n of NAV) {
    if (['/', '/offline/', '/o-stronie/', '/komunikaty/'].includes(n.path)) continue;
    const p = pages.get(n.path);
    if (!p) continue;
    const html = n.path === '/plecak/'
      ? `${p.html}${plecak.grupy.map((g) => `<h3>${esc(g.nazwa)}</h3><ul>${g.pozycje.map((it) => `<li>☐ ${esc(it.nazwa)}${it.poziom === 'rozsz' ? ' (rozszerzony)' : ''}${it.dla === 'rodzina' ? ' (rodzina)' : ''}</li>`).join('')}</ul>`).join('')}`
      : n.path === '/stopnie-alarmowe/' ? `${T.levelsCard(ctx)}${p.html}`
        : n.path === '/schrony/' ? `${p.html}<p>Lista ${schrony.liczba} punktów schronienia w Brodnicy jest na stronie internetowej (dział „Schrony”) i w aplikacji/mapie PSP: gdziesieukryc.pl.</p>`
          : p.html;
    order.push({ title: p.meta.title, lead: p.meta.lead, html });
    for (const c of children(n.path)) order.push({ title: c.meta.title, lead: c.meta.lead, html: c.html });
  }
  out.set('/poradnik/', { title: 'Poradnik do druku', description: 'Cały poradnik na jednej stronie — do druku lub zapisania jako PDF.', main: stillFrames(T.pagePoradnik(ctx, order)) });

  // ---------- zapis stron ----------
  const files = [];
  for (const [path, p] of out) {
    const html = T.layout(ctx, { title: p.title, description: p.description, path, main: p.main });
    const dest = join(DIST, path, 'index.html');
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html);
    files.push(url(path));
  }
  const notFound = T.layout(ctx, { title: 'Nie ma takiej strony', path: '/404/', noindex: true, main: `<h1 class="page-h">Nie ma takiej strony</h1><p class="lead">Adres mógł się zmienić. Wróć na <a href="${url('/')}">stronę główną</a> albo wybierz dział z menu.</p>${T.pageWiecej(ctx).replace(/<h1[^>]*>.*?<\/h1>/, '')}` });
  await writeFile(join(DIST, '404.html'), notFound);

  // ---------- PWA ----------
  const manifest = {
    name: SITE.name, short_name: 'Gotowość', description: SITE.description, lang: 'pl',
    start_url: SITE.base, scope: SITE.base, display: 'standalone', background_color: '#F6F8FB', theme_color: SITE.themeColor,
    icons: [
      { src: url('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: url('/icons/icon.svg'), sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcuts: [
      { name: 'Alarm — co robić', url: url('/alarm/') },
      { name: 'Schrony', url: url('/schrony/') },
      { name: 'Pierwsza pomoc', url: url('/pierwsza-pomoc/') },
    ],
  };
  await writeFile(join(DIST, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

  const staticFiles = [assets.css, assets.js, 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/apple-touch-icon.png',
    ...(await readdir(join(DIST, 'assets/audio'))).map((f) => `assets/audio/${f}`)].map((f) => url('/' + f));
  const precache = [...files, ...staticFiles];
  const version = hash(precache.join() + css + js + [...out.values()].map((p) => p.main).join());
  const sw = (await readFile(join(ROOT, 'src/sw.template.js'), 'utf8'))
    .replace('__VERSION__', `${today}-${version}`).replace('__BASE__', SITE.base).replace('__FILES__', JSON.stringify(precache));
  await writeFile(join(DIST, 'sw.js'), sw);

  // ---------- hosting ----------
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}${url('/sitemap.xml')}\n`);
  await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map((f) => `  <url><loc>${SITE.url}${f}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  await copyFile(join(ROOT, 'src/htaccess'), join(DIST, '.htaccess'));

  // ---------- raport ----------
  let total = 0;
  const diskPath = (f) => { const rel = f.slice(SITE.base.length); return rel === '' || rel.endsWith('/') ? join(DIST, rel, 'index.html') : join(DIST, rel); };
  for (const f of precache) total += (await stat(diskPath(f)).catch(() => ({ size: 0 }))).size;
  const sizes = await Promise.all(files.map(async (f) => ({ f, s: (await stat(join(DIST, f.slice(SITE.base.length), 'index.html'))).size })));
  const big = sizes.sort((a, b) => b.s - a.s).slice(0, 3).map((x) => `${x.f} ${(x.s / 1024).toFixed(0)} KB`).join(', ');
  console.log(`Zbudowano ${files.length} stron · offline ${precache.length} plików, ${(total / 1024).toFixed(0)} KB (bez kompresji) · największe: ${big}`);
  if (missing.length) { console.error('Brakujące elementy:', [...new Set(missing)].join(', ')); process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exit(1); });
