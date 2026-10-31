#!/usr/bin/env node
// Hareket videoları: icerik/spor.json içindeki her hareketin "anlatim" betiğinden anlatımlı, altyazılı mp4 üretir.
//   node scripts/hareket-video.mjs --model <tr_TR-dfki-medium.onnx> [--python <python>] [--hareket sandalye] [--fps 20] [--poster-yalniz]
// Gerekenler: ffmpeg, ffprobe, playwright (Chromium) ve Piper (pip install piper-tts). Çıktı: gorsel/spor/video/<id>.mp4 ve <id>.jpg
// Yeni hareket eklemek: scripts/hareket/sahneler.js içine sahne yaz, icerik/spor.json'a "anlatim" ekle, bu betiği çalıştır.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { cizelge } from './hareket/cizelge.js';
import { tmpdir } from 'node:os';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (ad, varsayilan) => { const i = process.argv.indexOf('--' + ad); return i < 0 ? varsayilan : (process.argv[i + 1]?.startsWith('--') || process.argv[i + 1] === undefined ? true : process.argv[i + 1]); };
const MODEL = arg('model'), PYTHON = arg('python', 'python3'), FPS = +arg('fps', 20), TEK = arg('hareket'), OLCEK = +arg('olcek', 4 / 3);
const CIKTI = join(KOK, 'gorsel/spor/video'), IS = arg('is', join(tmpdir(), 'hareket-video'));
if (!MODEL) { console.error('--model <piper-onnx> gerekli'); process.exit(1); }

const sure = (dosya) => +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dosya], { encoding: 'utf8' }).stdout;
const ETIKET = { kur: 'Hazırlık', tekrar: 'Doğru form', hata: 'Sık yapılan hata' };
const SAG = { kur: 'Hazırlık', hata: '✗ Yanlış' };

const ic = JSON.parse(readFileSync(join(KOK, 'icerik/spor.json'), 'utf8'));
const hareketler = ic.hareketler.filter((h) => h.anlatim && (!TEK || h.id === TEK));
mkdirSync(CIKTI, { recursive: true }); mkdirSync(IS, { recursive: true });

// 1) anlatım sesleri (metne göre önbellek: metin değişmedikçe yeniden üretilmez)
const istek = [];
for (const h of hareketler) h.anlatim.forEach((a, i) => { a.sesDosya = `${h.id}-${i}-${createHash('sha1').update(a.ses).digest('hex').slice(0, 8)}.wav`; istek.push({ dosya: a.sesDosya, metin: a.ses }); });
writeFileSync(join(IS, 'istek.json'), JSON.stringify(istek));
const s = spawnSync(PYTHON, [join(KOK, 'scripts/hareket/seslendir.py'), MODEL, join(IS, 'istek.json'), join(IS, 'ses')], { stdio: 'inherit' });
if (s.status) { console.error('Seslendirme başarısız'); process.exit(1); }

// 2) tarayıcı ve küçük statik sunucu
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const tur = { '.js': 'text/javascript', '.html': 'text/html' };
const sunucu = createServer((q, r) => { try { const f = join(KOK, 'scripts/hareket', q.url.split('?')[0]); r.setHeader('content-type', tur[extname(f)] || 'text/plain'); r.end(readFileSync(f)); } catch { r.statusCode = 404; r.end(); } });
await new Promise((ok) => sunucu.listen(0, ok));
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 540, height: 540 }, deviceScaleFactor: OLCEK });
sayfa.on('pageerror', (e) => { console.error('Sayfa hatası:', e.message); process.exit(1); });
await sayfa.goto(`http://localhost:${sunucu.address().port}/sahne.html`); await sayfa.waitForFunction('window.hazir');
const { SAHNELER } = await import(join(KOK, 'scripts/hareket/sahneler.js'));

for (const h of hareketler) {
  const sahne = SAHNELER[h.id]; if (!sahne) { console.error(`sahne yok: ${h.id}`); process.exit(1); }
  const esure = Object.fromEntries(Object.entries(sahne.eylemler).map(([k, v]) => [k, v.sure]));
  const ses = h.anlatim.map((a) => sure(join(IS, 'ses', a.sesDosya)));
  const { par, toplam } = cizelge(h, esure, ses);
  const kareSayisi = Math.ceil(toplam * FPS);
  console.log(`${h.id}: ${toplam.toFixed(1)} sn, ${kareSayisi} kare`);

  // 3) ses izi: her anlatım kendi parçasının başında başlar, parça süresine kadar sessizlikle doldurulur
  const liste = []; 
  for (const p of par) {
    const o = join(IS, `${h.id}-${p.i}.pad.wav`);
    const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', join(IS, 'ses', p.sesDosya), '-af', `aresample=22050,apad=whole_dur=${p.dur.toFixed(3)}`, '-ac', '1', o]);
    if (r.status) { console.error(r.stderr.toString()); process.exit(1); }
    liste.push(`file '${o}'`);
  }
  writeFileSync(join(IS, `${h.id}.txt`), liste.join('\n'));
  const sesIzi = join(IS, `${h.id}-iz.wav`);
  spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', join(IS, `${h.id}.txt`), '-c', 'copy', sesIzi]);

  const kare = (t) => {
    const p = par.find((x) => t < x.t0 + x.dur) || par[par.length - 1];
    const yt = t - p.t0, hareketli = Math.min(yt, p.kez * p.es - 1e-3);
    const n = Math.min(p.kez, Math.floor(hareketli / p.es) + 1);
    return { sahne: h.id, eylem: p.eylem, t: hareketli % p.es, altyazi: p.altyazi, rozet: `${ETIKET[p.eylem]} · ${h.kas}`, sag: SAG[p.eylem], sayac: p.eylem === 'tekrar' ? { n, toplam: p.kez } : null };
  };

  // poster: ilk "tekrar" parçasında, hareketin ortasındaki kare
  const ilkTekrar = par.find((p) => p.eylem === 'tekrar');
  const poster = join(CIKTI, `${h.id}.jpg`);
  await sayfa.evaluate((k) => window.kareCiz(k), { ...kare(ilkTekrar.t0 + ilkTekrar.es * 0.45), altyazi: h.anlatim[1]?.altyazi || null });
  await sayfa.screenshot({ path: poster, type: 'jpeg', quality: 82 });
  if (arg('poster-yalniz', false)) continue;

  // 4) kareler → ffmpeg
  const mp4 = join(CIKTI, `${h.id}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', sesIzi,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '56k', '-ar', '22050', '-t', toplam.toFixed(3), mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const bitti = new Promise((ok) => ff.on('close', ok));
  for (let i = 0; i < kareSayisi; i++) {
    await sayfa.evaluate((k) => window.kareCiz(k), kare(i / FPS));
    const buf = await sayfa.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((ok) => ff.stdin.once('drain', ok));
  }
  ff.stdin.end(); const kod = await bitti;
  if (kod) { console.error('ffmpeg hata kodu', kod); process.exit(1); }
  console.log(`  → ${mp4} (${(statSync(mp4).size / 1024).toFixed(0)} KB)`);
}
await tarayici.close(); sunucu.close();
// Çevrimdışı indirme listesi (js/cevrimdisi.js okur): klasördeki tüm mp4 dosyaları
writeFileSync(join(CIKTI, 'liste.json'), JSON.stringify(readdirSync(CIKTI).filter((f) => f.endsWith('.mp4')).sort()) + '\n');
