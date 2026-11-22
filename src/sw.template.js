/* Service Worker — Gotowość Brodnica. Generowany przy buildzie (wersja i lista plików).
   Strategia: przy pierwszej wizycie zapisuje CAŁĄ stronę. Strony HTML: najpierw sieć (świeże
   komunikaty), przy braku sieci lub po 4 s — wersja zapisana. Pozostałe pliki: najpierw zapis. */
const VERSION = '__VERSION__';
const BASE = '__BASE__';
const CACHE = 'gb-' + VERSION;
const FILES = __FILES__;

self.addEventListener('install', (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()));
});

async function precache() {
  const cache = await caches.open(CACHE);
  // Pojedynczo, żeby jeden błąd nie przerwał całego zapisu.
  await Promise.all(FILES.map(async (f) => {
    try {
      const res = await fetch(new Request(f, { cache: 'reload' }));
      if (res.ok) await cache.put(f, res);
    } catch (err) { /* spróbujemy przy następnej wizycie */ }
  }));
}

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('gb-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([fetch(req), timeout(4000)]);
        if (res.ok) cache.put(url.pathname, res.clone());
        return res;
      } catch (err) {
        const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
        return (await cache.match(url.pathname)) || (await cache.match(path)) || (await cache.match(BASE + 'offline/')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res.ok && FILES.includes(url.pathname)) (await caches.open(CACHE)).put(url.pathname, res.clone());
      return res;
    } catch (err) { return Response.error(); }
  })());
});

self.addEventListener('message', async (e) => {
  if (!e.data) return;
  if (e.data.type === 'status' && e.ports[0]) {
    const cache = await caches.open(CACHE);
    const hits = await Promise.all(FILES.map((f) => cache.match(f)));
    e.ports[0].postMessage({ version: VERSION, cached: hits.filter(Boolean).length, total: FILES.length });
  }
  if (e.data.type === 'recache') {
    await precache();
    const clients = await self.clients.matchAll();
    clients.forEach((c) => c.postMessage({ type: 'cached' }));
  }
});
