// Szablony HTML. Czyste funkcje: dostają dane, zwracają tekst.
import { SITE, NAV, TABS, TILES } from './site.mjs';
import { sprite, icon } from './lib/icons.mjs';
import { esc } from './lib/md.mjs';

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
export const fmtDate = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.slice(0, 10).split('-'); return `${d}.${m}.${y}`; };
export const fmtLong = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.slice(0, 10).split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

export function layout(ctx, { title, description, path, main, noindex = false }) {
  const u = ctx.url;
  const isCurrent = (p) => (p === '/' ? path === '/' : path.startsWith(p));
  const fullTitle = path === '/' ? `${SITE.name} — ${SITE.tagline}` : `${title} · ${SITE.name}`;
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || SITE.description)}">
<meta name="theme-color" content="${SITE.themeColor}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(SITE.url + path)}">`}
<link rel="manifest" href="${u('/manifest.webmanifest')}">
<link rel="icon" href="${u('/icons/icon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u('/icons/apple-touch-icon.png')}">
<link rel="stylesheet" href="${u('/' + ctx.assets.css)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || SITE.description)}">
<meta property="og:type" content="website">
<script src="${u('/' + ctx.assets.js)}" defer></script>
</head>
<body data-base="${SITE.base}" data-built="${ctx.buildDate}">
${sprite()}
<a class="skip" href="#tresc">Przejdź do treści</a>
<header class="top">
  <div class="top-in">
    <a class="brand" href="${u('/')}"><svg class="mark" aria-hidden="true"><use href="#i-mark"/></svg><span>${SITE.name}<small>${SITE.tagline}</small></span></a>
    <a class="call112" href="tel:112" aria-label="Zadzwoń pod numer alarmowy 112">${icon('phone')}112</a>
  </div>
  <div class="netbar" id="netbar" data-state="online" aria-live="polite"><span class="dot"></span><span id="netbar-t">Treści z ${fmtDate(ctx.buildDate)}</span></div>
</header>
<div class="layout">
  <nav class="side" aria-label="Menu">
    ${NAV.map((n) => `<a href="${u(n.path)}"${isCurrent(n.path) ? ' aria-current="page"' : ''}>${icon(n.icon)}${n.label}</a>`).join('\n    ')}
  </nav>
  <main id="tresc">
${main}
  </main>
</div>
<footer class="foot">
  <p><strong>Strona informacyjno-edukacyjna.</strong> Nie zastępuje oficjalnych komunikatów służb i władz. W sytuacji zagrożenia słuchaj poleceń służb, syren, Alertów RCB i aplikacji RSO.</p>
  <p>Niekomercyjna, bez reklam i śledzenia. Treści z ${fmtLong(ctx.buildDate)}. <a href="${u('/o-stronie/')}">Źródła i licencje</a> · <a href="${u('/offline/')}">Offline i druk</a></p>
</footer>
<nav class="tabbar" aria-label="Nawigacja główna">
  ${TABS.map((t) => `<a class="tab" href="${u(t.path)}"${(t.path === '/' ? path === '/' : path.startsWith(t.path)) || (t.path === '/wiecej/' && !TABS.some((x) => x.path !== '/' && x.path !== '/wiecej/' && path.startsWith(x.path)) && path !== '/') ? ' aria-current="page"' : ''}>${icon(t.icon)}${t.label}</a>`).join('\n  ')}
</nav>
</body>
</html>
`;
}

// ---------- elementy wspólne ----------

function crumbs(ctx, path, title) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 2) return `<p class="crumb"><a href="${ctx.url('/')}">Start</a></p>`;
  const parent = `/${parts[0]}/`;
  const p = ctx.pages.get(parent);
  return `<p class="crumb"><a href="${ctx.url('/')}">Start</a> › <a href="${ctx.url(parent)}">${esc(p ? p.meta.title : parts[0])}</a></p>`;
}

export function sourcesBlock(ctx, meta) {
  const src = meta.zrodla || [];
  if (!src.length && !meta.aktualizacja) return '';
  const items = src.map((s) => {
    const [name, url] = s.split('|').map((x) => x.trim());
    return `<li>${url ? `<a href="${esc(url)}" rel="noopener" class="ext">${esc(name)}</a>` : esc(name)}</li>`;
  });
  return `<section class="sources" aria-label="Źródła">
  ${src.length ? `<p><strong>Źródła:</strong></p><ul>${items.join('')}</ul>` : ''}
  ${meta.aktualizacja ? `<p>Treść sprawdzona: ${fmtLong(meta.aktualizacja)}${meta.przeglad ? ` · ${esc(meta.przeglad)}` : ''}</p>` : ''}
</section>`;
}

function childLinks(ctx, children) {
  if (!children.length) return '';
  return `<nav class="links" aria-label="W tej sekcji">${children
    .map((c) => `<a href="${ctx.url(c.path)}">${c.meta['ikona-hi'] && ctx.healthIcons?.get(c.meta['ikona-hi']) ? ctx.healthIcons.get(c.meta['ikona-hi']) : c.meta.ikona ? icon(c.meta.ikona) : ''}<span>${esc(c.meta.title)}${c.meta.lead ? `<small>${esc(c.meta.lead)}</small>` : ''}</span>${icon('chev', 'i chev')}</a>`)
    .join('')}</nav>`;
}

export function article(ctx, page, { before = '', after = '', children = [] } = {}) {
  return `${crumbs(ctx, page.path, page.meta.title)}
<h1 class="page-h">${esc(page.meta.title)}</h1>
${page.meta.lead ? `<p class="lead">${esc(page.meta.lead)}</p>` : ''}
${before}
<div class="prose">${page.html}</div>
${childLinks(ctx, children)}
${after}
${sourcesBlock(ctx, page.meta)}`;
}

// ---------- stopnie alarmowe ----------

export function levelsCard(ctx, { compact = false } = {}) {
  const s = ctx.data.stopnie;
  if (!s || !s.stopnie?.length) {
    return `<div class="card"><span class="sec-title">Stopnie alarmowe</span><p>Nie udało się pobrać aktualnego stanu. Sprawdź na <a class="ext" rel="noopener" href="https://www.gov.pl/web/rcb">gov.pl/rcb</a>.</p></div>`;
  }
  const stale = daysBetween(s.raport_z, ctx.buildDate) > 3;
  const expired = s.obowiazuje_do && s.obowiazuje_do < ctx.buildDate;
  const localOnes = s.stopnie.filter((l) => !/nie dotyczy/.test(l.dla_brodnicy));
  const others = s.stopnie.length - localOnes.length;
  const rows = (compact ? localOnes : s.stopnie).map((l) => {
    const local = !/nie dotyczy/.test(l.dla_brodnicy);
    const what = l.crp ? 'cyberprzestrzeń' : (l.zakres ? l.zakres : (l.obszar || ''));
    const short = /kolej/.test(l.obszar || '') ? 'tereny kolejowe, także w Brodnicy' : (/całego kraju/.test(l.obszar || '') ? (l.crp ? 'systemy informatyczne, cały kraj' : 'cały kraj, także Brodnica') : (local ? what : `${what} — nie dotyczy mieszkańców`));
    return `<div class="lvl${local ? '' : ' off'}"><b>${esc(l.stopien)}</b><span>${l.poziom ? `${l.poziom}. stopień · ` : ''}${esc(short)}</span></div>`;
  });
  return `<div class="card">
  <div class="row"><span class="sec-title">Stopnie alarmowe</span>${s.obowiazuje_do ? `<span class="meta">do ${fmtDate(s.obowiazuje_do)}</span>` : ''}</div>
  <div class="levels">${rows.join('')}</div>
  ${compact && others ? `<p class="meta">+ ${others} ${others === 1 ? 'stopień' : 'stopnie'} poza Polską lub niedotyczące mieszkańców</p>` : ''}
  ${stale || expired ? `<p class="callout callout-uwaga" style="margin:0">Dane mogą być nieaktualne${expired ? ' (minął podany termin)' : ''}. Sprawdź stan na <a class="ext" rel="noopener" href="${esc(s.url)}">gov.pl</a>.</p>` : ''}
  <p class="meta">Raport RCB z ${fmtDate(s.raport_z)} · aktualizowane automatycznie</p>
  ${compact ? `<a href="${ctx.url('/stopnie-alarmowe/')}" style="font-weight:650">Co to znaczy dla mnie</a>` : ''}
</div>`;
}

// ---------- komunikaty ----------

function msgItem(ctx, m) {
  const chip = { pilne: 'chip-pilne', wazne: 'chip-wazne', info: 'chip-info' }[m.waga] || 'chip-info';
  const label = m.etykieta || { pilne: 'Pilne', wazne: 'Ważne', info: 'Informacja' }[m.waga] || 'Informacja';
  const inner = `<div class="row"><span class="chip ${chip}">${esc(label)}</span><span class="meta">${fmtDate(m.data)}</span></div>
  <b>${esc(m.tytul)}</b>
  ${m.tresc ? `<span>${esc(m.tresc)}</span>` : ''}
  <span class="meta">źródło: ${esc(m.zrodlo)}${m.url ? ' ↗' : ''}</span>`;
  return m.url ? `<a class="msg" href="${esc(m.url)}" rel="noopener">${inner}</a>` : `<article class="msg">${inner}</article>`;
}

export function msgList(ctx, list, { limit = 0, empty = '' } = {}) {
  const items = limit ? list.slice(0, limit) : list;
  if (!items.length) return `<p class="empty">${empty}</p>`;
  return `<div class="msgs">${items.map((m) => msgItem(ctx, m)).join('')}</div>`;
}

// ---------- strona główna ----------

export function pageStart(ctx) {
  const u = ctx.url;
  const recent = ctx.data.komunikaty.filter((m) => daysBetween(m.data, ctx.buildDate) <= 60);
  return `<h1 class="sr">${SITE.name}</h1>
${levelsCard(ctx, { compact: true })}
<a class="btn btn-primary" href="${u('/alarm/')}">${icon('siren')}<span>Alarm? Co robić teraz</span>${icon('chev')}</a>
<nav class="tiles" aria-label="Sekcje">
  ${TILES.map((t) => `<a class="tile" href="${u(t.path)}">${icon(t.icon)}<span>${t.label}<small>${t.hint}</small></span></a>`).join('\n  ')}
</nav>
<section class="msgs" aria-labelledby="km">
  <div class="row"><h2 class="sec-title" id="km">Komunikaty dla Brodnicy</h2><a href="${u('/komunikaty/')}" style="font-size:15px;font-weight:650">Wszystkie</a></div>
  ${msgList(ctx, recent, { limit: 3, empty: `Brak nowych komunikatów w sprawdzanych źródłach (IMGW, Urząd Miejski, sanepid) z ostatnich 60 dni. Sprawdzono: ${fmtDate(ctx.buildDate)}. To nie znaczy, że nie ma zagrożeń — słuchaj syren i Alertów RCB.` })}
</section>
<a class="btn btn-signal" href="${u('/offline/')}">${icon('down')}<span>Zapisz poradnik w telefonie</span></a>
<div class="card">
  <span class="sec-title">Bądź na bieżąco</span>
  <p>Zainstaluj bezpłatną aplikację <strong>RSO</strong> (Regionalny System Ostrzegania). Alerty RCB przychodzą SMS-em same. Miejskie powiadomienia <strong>SMS-Brodnica</strong> zamówisz bezpłatnie: wyślij SMS o treści <code>brodnicaogolny</code> na numer <a class="tel" href="sms:503340503">503 340 503</a>.</p>
</div>`;
}

// ---------- strona „Więcej” ----------

export function pageWiecej(ctx) {
  return `<h1 class="page-h">Wszystkie działy</h1>
<nav class="links" aria-label="Wszystkie działy">${NAV.filter((n) => n.path !== '/')
    .map((n) => `<a href="${ctx.url(n.path)}">${icon(n.icon)}<span>${n.label}</span>${icon('chev', 'i chev')}</a>`)
    .join('')}</nav>`;
}

// ---------- stopnie alarmowe (podstrona) ----------

export function pageStopnie(ctx, page) {
  const s = ctx.data.stopnie;
  const list = s?.stopnie?.length
    ? `<div class="table"><table><thead><tr><th>Stopień</th><th>Gdzie obowiązuje</th><th>Podstawa</th></tr></thead><tbody>${s.stopnie
        .map((l) => `<tr><td><strong>${esc(l.stopien)}</strong>${l.poziom ? `<br><span class="meta">${l.poziom}. stopień</span>` : ''}</td><td>${esc(l.obszar || ('wobec ' + (l.zakres || '')))}<br><span class="meta">${esc(l.dla_brodnicy)}</span></td><td>${l.zarzadzenie ? `zarządzenie nr ${l.zarzadzenie.nr} z ${fmtDate(l.zarzadzenie.data)}` : ''}</td></tr>`)
        .join('')}</tbody></table></div>
<p class="meta">${esc(s.naglowek || '')}. Źródło: <a class="ext" rel="noopener" href="${esc(s.url)}">Raport dobowy RCB z ${fmtDate(s.raport_z)}</a>. Pobrano automatycznie ${fmtDate(s.pobrano)}.</p>`
    : '';
  return article(ctx, page, { before: `${levelsCard(ctx)}${list}` });
}

// ---------- komunikaty ----------

export function pageKomunikaty(ctx, page) {
  const srcs = ctx.data.zrodlaKomunikatow.map((z) => `<li>${esc(z.nazwa)} — sprawdzono ${fmtDate(z.sprawdzono)}${z.blad ? ' <strong>(błąd pobierania, pokazano ostatnie dane)</strong>' : ''}</li>`).join('');
  return article(ctx, page, {
    before: `${msgList(ctx, ctx.data.komunikaty, { empty: `Brak komunikatów w sprawdzanych źródłach. Sprawdzono: ${fmtDate(ctx.buildDate)}.` })}
<div class="sources"><p><strong>Sprawdzane źródła:</strong></p><ul>${srcs}</ul></div>`,
  });
}

// ---------- plecak ----------

export function pagePlecak(ctx, page) {
  const p = ctx.data.plecak;
  const src = p.zrodla;
  const groups = p.grupy.map((g) => `<section class="group"><h2>${esc(g.nazwa)}</h2>${g.pozycje
    .map((it) => `<label class="check" data-lvl="${it.poziom}"${it.dla ? ` data-dla="${it.dla}"` : ''}><input type="checkbox" id="pl-${it.id}" data-id="${it.id}"><span><span class="name">${esc(it.nazwa)}</span>${it.poziom === 'rozsz' ? '<span class="tag tag-rozsz">rozszerzony</span>' : ''}${it.dla === 'rodzina' ? '<span class="tag">rodzina</span>' : ''}${it.uwaga ? `<small>${esc(it.uwaga)}</small>` : ''}<small>${esc(src[it.zrodlo]?.nazwa.split(',')[0] || it.zrodlo)}</small></span></label>`)
    .join('')}</section>`).join('\n');
  const tool = `<div class="no-print" style="display:grid;gap:10px" id="plecak">
  <div class="seg" role="group" aria-label="Zakres listy"><button type="button" data-set-lvl="podst" aria-pressed="true">Podstawowy</button><button type="button" data-set-lvl="rozsz" aria-pressed="false">Rozszerzony</button></div>
  <div class="seg" role="group" aria-label="Dla kogo"><button type="button" data-set-dla="osoba" aria-pressed="true">Dla 1 osoby</button><button type="button" data-set-dla="rodzina" aria-pressed="false">Rodzina z dziećmi</button></div>
  <div class="progress"><div class="row"><b id="pl-txt">Lista do odhaczania</b><span class="meta">zapisuje się tylko w tym telefonie</span></div><div class="bar"><i id="pl-bar"></i></div></div>
</div>
${groups}
<button type="button" class="btn btn-ghost btn-sm no-print" id="pl-reset">Wyczyść zaznaczenia</button>
<ul class="prose" style="padding-left:20px">${p.uwagi.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<section class="sources"><p><strong>Źródła listy:</strong></p><ul>${Object.values(src).map((z) => `<li><a class="ext" rel="noopener" href="${esc(z.url)}">${esc(z.nazwa)}</a></li>`).join('')}</ul><p>Lista sprawdzona: ${fmtLong(p.aktualizacja)}</p></section>`;
  return article(ctx, page, { before: tool });
}

// ---------- schrony ----------

export function pageSchrony(ctx, page) {
  const d = ctx.data.schrony;
  const pts = d.punkty.filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lon));
  const lat0 = pts.reduce((a, x) => a + x.lat, 0) / pts.length;
  const kx = Math.cos((lat0 * Math.PI) / 180);
  const minX = Math.min(...pts.map((x) => x.lon * kx)), maxX = Math.max(...pts.map((x) => x.lon * kx));
  const minY = Math.min(...pts.map((x) => x.lat)), maxY = Math.max(...pts.map((x) => x.lat));
  const W = 640, pad = 24;
  const scale = (W - 2 * pad) / (maxX - minX);
  const H = Math.round((maxY - minY) * scale + 2 * pad + 20);
  const X = (lon) => (lon * kx - minX) * scale + pad;
  const Y = (lat) => (maxY - lat) * scale + pad;
  const metersPerUnit = 111320 / scale; // metry na 1 px
  const barM = 500, barPx = barM / metersPerUnit;
  const dots = pts.map((x, i) => `<circle class="pt" data-i="${i}" cx="${X(x.lon).toFixed(1)}" cy="${Y(x.lat).toFixed(1)}" r="4"/>`).join('');
  const counts = d.punkty.reduce((a, x) => ((a[x.dostepnosc || 'brak danych'] = (a[x.dostepnosc || 'brak danych'] || 0) + 1), a), {});
  const items = pts.map((x, i) => {
    const osm = `https://www.openstreetmap.org/?mlat=${x.lat.toFixed(6)}&mlon=${x.lon.toFixed(6)}#map=18/${x.lat.toFixed(6)}/${x.lon.toFixed(6)}`;
    const geo = `geo:${x.lat.toFixed(6)},${x.lon.toFixed(6)}?q=${x.lat.toFixed(6)},${x.lon.toFixed(6)}(${encodeURIComponent(x.adres)})`;
    const acc = x.dostepnosc && x.dostepnosc !== 'Całodobowa' ? `<span class="chip chip-wazne">${esc(x.dostepnosc.toLowerCase())}</span>` : '<span class="chip chip-ok">całodobowo</span>';
    return `<div class="place" data-i="${i}" data-lat="${x.lat}" data-lon="${x.lon}" data-q="${esc(x.adres.toLowerCase())}"><span><b>${esc(x.adres)}</b> ${acc}<span class="dist"></span></span><span class="acts"><a href="${esc(geo)}" aria-label="Otwórz ${esc(x.adres)} w aplikacji map">${icon('pin')}</a><a href="${esc(osm)}" rel="noopener" aria-label="Mapa online: ${esc(x.adres)}">Mapa</a></span></div>`;
  }).join('\n');
  const tool = `<div class="card">
  <div class="row"><span class="sec-title">Punkty schronienia w Brodnicy</span><span class="meta">dane PSP z ${fmtDate(d.dane_z)}</span></div>
  <p><strong>${pts.length}</strong> miejsc w mieście: ${Object.entries(counts).map(([k, v]) => `${esc(k.toLowerCase())} — ${v}`).join(', ')}.</p>
</div>
<button type="button" class="btn btn-primary no-print" id="sh-near">${icon('locate')}<span>Pokaż najbliższe mi miejsca</span></button>
<p class="meta no-print" id="sh-status" aria-live="polite">Lokalizacja zostaje w telefonie i działa bez internetu (GPS).</p>
<figure class="map" aria-label="Rozmieszczenie punktów schronienia na planie miasta">
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schemat: ${pts.length} punktów schronienia w Brodnicy">
    <rect width="${W}" height="${H}" fill="transparent"/>
    ${dots}
    <circle class="me" id="sh-me" r="8" cx="-20" cy="-20"/>
    <g transform="translate(${W - pad - 26},${pad + 4})"><path d="M13 0 L20 22 L13 17 L6 22 Z" fill="currentColor" style="color:var(--muted)"/><text class="lbl" x="13" y="38" text-anchor="middle">N</text></g>
    <g transform="translate(${pad},${H - 14})"><path class="grid" d="M0 0 H${barPx.toFixed(1)}" style="stroke:var(--muted);stroke-width:3"/><text class="lbl" x="0" y="-6">${barM} m</text></g>
  </svg>
</figure>
<div class="search no-print"><label class="sr" for="sh-q">Szukaj ulicy</label><input id="sh-q" type="search" placeholder="Szukaj ulicy, np. Sikorskiego" autocomplete="off"></div>
<div class="places" id="sh-list">
${items}
</div>
<p class="meta">Źródło: Komenda Główna PSP, <a class="ext" rel="noopener" href="${esc(d.zbior)}">„Punkty schronienia w Polsce”</a> (dane.gov.pl), licencja ${esc(d.licencja)}. Dane z ${fmtDate(d.dane_z)}, pobrane ${fmtDate(d.pobrano)}. Mapa PSP online: <a class="ext" rel="noopener" href="https://gdziesieukryc.pl">gdziesieukryc.pl</a>.</p>`;
  return article(ctx, page, { before: tool });
}

// ---------- offline ----------

export function pageOffline(ctx, page) {
  const box = `<div class="card" id="off-box">
  <span class="sec-title">Stan zapisu w tym telefonie</span>
  <p id="off-status">Sprawdzam…</p>
  <button type="button" class="btn btn-ghost btn-sm no-print" id="off-save">Zapisz ponownie całą stronę</button>
</div>
<a class="btn btn-signal no-print" href="${ctx.url('/poradnik/')}">${icon('print')}<span>Cały poradnik na jednej stronie — do druku lub PDF</span></a>`;
  return article(ctx, page, { before: box });
}

// ---------- poradnik w jednym pliku ----------

export function pagePoradnik(ctx, sections) {
  const body = sections.map((s, i) => `<section class="${i ? 'print-break' : ''}">
<h2 class="page-h" style="font-size:26px">${esc(s.title)}</h2>
${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ''}
<div class="prose">${s.html}</div>
</section>`).join('\n<hr>\n');
  return `<h1 class="page-h">Poradnik — wersja do druku</h1>
<p class="lead">Cała treść strony w jednym miejscu. Wydrukuj albo zapisz jako PDF (menu przeglądarki → Drukuj → Zapisz jako PDF) i trzymaj przy plecaku. Telefon może się rozładować, kartka nie.</p>
<p class="meta">Stan na ${fmtLong(ctx.buildDate)}. Aktualna wersja: ${esc(SITE.url)}</p>
${body}`;
}
