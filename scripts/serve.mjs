#!/usr/bin/env node
// Podgląd zbudowanej strony: http://localhost:8080 (npm run build && npm run serve)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
const DIST = new URL('../dist/', import.meta.url).pathname;
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = +process.env.PORT || 8080;
http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try { const body = await readFile(join(DIST, p)); res.writeHead(200, { 'content-type': T[extname(p)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404, { 'content-type': T['.html'] }); res.end(await readFile(join(DIST, '404.html'))); }
}).listen(port, () => console.log(`Podgląd: http://localhost:${port}`));
