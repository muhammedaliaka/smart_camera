// Bağımlılıksız yerel sunucu. Kullanım: node scripts/sunucu.mjs [--port 8080] [--icerik klasör]
// --icerik verilirse /icerik/ yolu o klasörden sunulur (test içerikleri için).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const KOK = resolve(fileURLToPath(new URL('..', import.meta.url)));
const arg = (ad, varsayilan) => { const i = process.argv.indexOf('--' + ad); return i > 0 ? process.argv[i + 1] : varsayilan; };
const PORT = +arg('port', process.env.PORT || 8080);
const ICERIK = arg('icerik', null) ? resolve(arg('icerik')) : null;
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.md': 'text/plain; charset=utf-8' };

const sunucu = http.createServer(async (istek, yanit) => {
  try {
    let yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
    if (yol.endsWith('/')) yol += 'index.html';
    let dosya;
    if (ICERIK && yol.startsWith('/icerik/')) dosya = join(ICERIK, yol.slice('/icerik/'.length));
    else dosya = join(KOK, yol);
    dosya = normalize(dosya);
    const izinli = [KOK, ICERIK].filter(Boolean).some((k) => dosya === k || dosya.startsWith(k + sep));
    if (!izinli) { yanit.writeHead(403).end('yasak'); return; }
    const s = await stat(dosya);
    if (s.isDirectory()) { yanit.writeHead(302, { Location: yol + '/' }).end(); return; }
    const veri = await readFile(dosya);
    yanit.writeHead(200, { 'Content-Type': TUR[extname(dosya)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    yanit.end(veri);
  } catch { yanit.writeHead(404).end('yok'); }
});
sunucu.listen(PORT, '0.0.0.0', () => {
  console.log(`Öğrenme Defteri: http://localhost:${PORT}/`);
  for (const liste of Object.values(networkInterfaces())) for (const a of liste || []) if (a.family === 'IPv4' && !a.internal) console.log(`  Aynı Wi-Fi'deki telefon için: http://${a.address}:${PORT}/  (mikrofon ve kurulum için https gerekir; bkz. KULLANIM.md)`);
});
