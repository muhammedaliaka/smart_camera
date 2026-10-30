// Bağımlılıksız yerel sunucu. Kullanım: node scripts/sunucu.mjs [--port 8080] [--icerik klasör] [--veri klasör]
// --icerik verilirse /icerik/ yolu o klasörden sunulur (test içerikleri için).
//
// Eşitleme (MCP için): uygulama kaydını POST /api/durum ile gönderir (Ben → Ayarlar → Yapay zekâ bağlantısı).
//   - Kayıt veri/durum.json dosyasına yazılır; scripts/mcp.mjs bu dosyayı okur.
//   - Belirteç (x-belirtec başlığı) veri/belirtec.txt içindedir; ilk açılışta üretilir ve konsola yazılır.
//   - veri/ klasörü dışarıya SUNULMAZ (aynı ağdaki başkaları kaydı okuyamaz).
import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const KOK = resolve(fileURLToPath(new URL('..', import.meta.url)));
const arg = (ad, varsayilan) => { const i = process.argv.indexOf('--' + ad); return i > 0 ? process.argv[i + 1] : varsayilan; };
const PORT = +arg('port', process.env.PORT || 8080);
const ICERIK = arg('icerik', null) ? resolve(arg('icerik')) : null;
const VERI = arg('veri', null) ? resolve(arg('veri')) : join(KOK, 'veri'); // --veri: eşitleme kaydının ve belirtecin klasörü (test için)
const ESITLEME_SINIRI = 40 * 1024 * 1024; // bayt; kayıt alanı zaten ~5 MB ile sınırlıdır
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.md': 'text/plain; charset=utf-8' };

function belirtecAl() {
  mkdirSync(VERI, { recursive: true });
  const yol = join(VERI, 'belirtec.txt');
  if (!existsSync(yol)) writeFileSync(yol, randomBytes(18).toString('hex') + '\n', { mode: 0o600 });
  return readFileSync(yol, 'utf8').trim();
}
const BELIRTEC = belirtecAl();
const esit = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };

/** POST /api/durum: kaydı alır, doğrular ve veri/durum.json olarak (atomik) yazar. */
async function esitlemeAl(istek, yanit) {
  const cevap = (kod, nesne) => { yanit.writeHead(kod, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }).end(JSON.stringify(nesne)); };
  if (istek.method !== 'POST') return cevap(405, { hata: 'yalnız POST' });
  if (!esit(istek.headers['x-belirtec'] || '', BELIRTEC)) return cevap(401, { hata: 'belirteç yanlış' });
  const parcalar = []; let boyut = 0;
  for await (const p of istek) { boyut += p.length; if (boyut > ESITLEME_SINIRI) return cevap(413, { hata: 'çok büyük' }); parcalar.push(p); }
  let veri;
  try { veri = JSON.parse(Buffer.concat(parcalar).toString('utf8')); } catch { return cevap(400, { hata: 'geçerli JSON değil' }); }
  if (veri?.tur !== 'od3-yedek' || !Array.isArray(veri.durum?.olaylar)) return cevap(400, { hata: 'Öğrenme Defteri kaydı değil' });
  mkdirSync(VERI, { recursive: true });
  const gecici = join(VERI, `durum.${process.pid}.tmp`);
  writeFileSync(gecici, JSON.stringify(veri), { mode: 0o600 }); // öğrenci kaydı: yalnız sahibi okuyabilsin (belirteçle aynı)
  renameSync(gecici, join(VERI, 'durum.json'));
  cevap(200, { tamam: true, olay: veri.durum.olaylar.length });
}

const sunucu = http.createServer(async (istek, yanit) => {
  try {
    let yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
    if (yol === '/api/durum') return await esitlemeAl(istek, yanit);
    if (/^\/veri(\/|$)/.test(normalize(yol).replace(/\\/g, '/'))) { yanit.writeHead(403).end('yasak'); return; }
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
  console.log(`  Yapay zekâ bağlantısı (MCP) için eşitleme belirteci: ${BELIRTEC}   (Ben → Ayarlar → Yapay zekâ bağlantısı; bkz. docs/MCP.md)`);
  for (const liste of Object.values(networkInterfaces())) for (const a of liste || []) if (a.family === 'IPv4' && !a.internal) console.log(`  Aynı Wi-Fi'deki telefon için: http://${a.address}:${PORT}/  (mikrofon ve kurulum için https gerekir; bkz. KULLANIM.md)`);
});
