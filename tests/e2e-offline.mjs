#!/usr/bin/env node
// Test w prawdziwej przeglądarce (Playwright): zapis offline, checklista, najbliższy schron.
// Uruchom: npm run build && node tests/e2e-offline.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');

const PORT = 8123, BASE = `http://localhost:${PORT}`;
const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const fail = [];
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'BŁĄD'} ${msg}`); if (!ok) fail.push(msg); };

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 53.2560, longitude: 19.3990 }, permissions: ['geolocation'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(BASE + '/');
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(() => {});
  if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) await page.reload();
  await page.waitForFunction(() => /Zapisano w telefonie/.test(document.querySelector('#netbar-t').textContent), null, { timeout: 20000 }).catch(() => {});
  check(/Zapisano w telefonie/.test(await page.textContent('#netbar-t')), 'pasek: strona zapisana w telefonie');

  await ctx.setOffline(true);
  for (const p of ['/pierwsza-pomoc/zadlawienie/', '/przetrwanie/orientacja/', '/schrony/', '/plecak/', '/poradnik/']) {
    const res = await page.goto(BASE + p).catch(() => null);
    const h1 = res ? await page.textContent('h1') : '';
    check(!!res && h1.length > 3, `offline: ${p} → „${h1.trim()}”`);
  }
  check(/Brak internetu/.test(await page.textContent('#netbar-t')), 'pasek: informacja o braku internetu');

  await page.goto(BASE + '/plecak/');
  await page.click('label.check:not([hidden]) >> nth=0');
  await page.click('[data-set-lvl="rozsz"]');
  const txt1 = await page.textContent('#pl-txt');
  await page.reload();
  check((await page.textContent('#pl-txt')) === txt1 && /^1 z \d+/.test(txt1), `plecak zapamiętuje stan offline (${txt1})`);

  await page.goto(BASE + '/schrony/');
  await page.click('#sh-near');
  await page.waitForFunction(() => /Najbliższe/.test(document.querySelector('#sh-status').textContent), null, { timeout: 10000 }).catch(() => {});
  const status = await page.textContent('#sh-status');
  check(/Najbliższe: .+ \(\d+/.test(status), `najbliższy schron offline: ${status}`);
  check((await page.$$('.place.near')).length === 5, 'zaznaczono 5 najbliższych miejsc');
  await page.fill('#sh-q', 'sikorskiego');
  const visible = await page.$$eval('.place', (els) => els.filter((e) => !e.hidden).length);
  check(visible > 0 && visible < 221, `wyszukiwarka ulic: ${visible} wyników`);

  check(errors.length === 0, `brak błędów JS ${errors.join('; ')}`);
} finally {
  await browser.close();
  server.kill();
}
process.exit(fail.length ? 1 : 0);
