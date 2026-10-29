#!/usr/bin/env node
// İçerik ekledikten ya da değiştirdikten sonra tek komut: hiçbir şey unutulmasın.
//   node scripts/guncelle.mjs                    kontrol listesini çalıştırır ve ne yapman gerektiğini söyler
//   node scripts/guncelle.mjs --ses <klasör>     eksik sesleri de üretir (Kokoro model dosyalarının klasörü gerekir; bkz. scripts/ses-uret.py)
//
// Adımlar: 1) içeriği doğrula  2) ses listesini güncelle  3) eksik ses dosyalarını göster/üret  4) özet

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icerikDogrula } from './dogrula.mjs';
import { sesleriBul } from './ses-liste.mjs';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const a = process.argv.slice(2);
const sesKlasoru = a.includes('--ses') ? a[a.indexOf('--ses') + 1] : null;
const icerikKlasoru = join(kok, 'icerik');
const sesDizini = join(kok, 'ses');

const adim = (n, ad) => console.log(`\n${n}. ${ad}`);
let sorun = 0;

adim(1, 'İçerik doğrulanıyor');
const r = icerikDogrula(icerikKlasoru);
console.log(`   ${r.ic.paketler.length} paket · ${r.ic.kelimeler.length} kelime · ${r.ic.dersler.length} ders · ${r.idx.gunler.size} gün · ${r.ic.hareketler.length} hareket`);
for (const u of r.uyari) console.log('   uyarı  ' + u);
for (const h of r.hata) console.log('   HATA   ' + h);
if (r.hata.length) { console.log(`\n✗ ${r.hata.length} hata var. Önce bunları düzelt; sonra bu komutu yeniden çalıştır.`); process.exit(1); }
if (r.uyari.length) { sorun += r.uyari.length; console.log(`   ${r.uyari.length} uyarı: kullanılmayan kelime/ders ya da programa bağlanmamış içerik olabilir.`); }
else console.log('   hata yok, uyarı yok ✓');

adim(2, 'Ses listesi güncelleniyor');
const { harita } = sesleriBul(icerikKlasoru);
const dosyalar = [...harita.keys()].sort();
mkdirSync(sesDizini, { recursive: true });
writeFileSync(join(sesDizini, 'metinler.json'), JSON.stringify(Object.fromEntries(dosyalar.map((d) => [d, harita.get(d)])), null, 1) + '\n');
writeFileSync(join(sesDizini, 'liste.json'), JSON.stringify(dosyalar) + '\n');
console.log(`   ${dosyalar.length} farklı konuşma (ses/metinler.json, ses/liste.json yazıldı)`);

adim(3, 'Ses dosyaları');
let eksik = dosyalar.filter((d) => !existsSync(join(sesDizini, d)));
if (eksik.length && sesKlasoru) {
  console.log(`   ${eksik.length} eksik dosya üretiliyor…`);
  const py = spawnSync('python3', [join(kok, 'scripts/ses-uret.py'), '--model', resolve(sesKlasoru)], { stdio: 'inherit' });
  if (py.status !== 0) { console.log('   ses üretimi tamamlanamadı'); process.exit(1); }
  eksik = dosyalar.filter((d) => !existsSync(join(sesDizini, d)));
}
if (eksik.length) {
  sorun += eksik.length;
  console.log(`   ${eksik.length} ses dosyası eksik (uygulama bunlar için cihazın sesini kullanır; kalite düşer).`);
  for (const d of eksik.slice(0, 8)) console.log(`     ${d}  ${JSON.stringify(harita.get(d).metin).slice(0, 60)}`);
  if (eksik.length > 8) console.log(`     … ve ${eksik.length - 8} tane daha`);
  console.log('   Üretmek için: node scripts/guncelle.mjs --ses <Kokoro model klasörü>   (bkz. docs/ICERIK_EKLEME.md, "Ses")');
} else console.log('   tüm ses dosyaları var ✓');

// metinler.json'da artık kullanılmayan (eski) mp3 dosyaları: bilgi olarak göster
const kullanilan = new Set(dosyalar);
let yetim = [];
try {
  const { readdirSync } = await import('node:fs');
  yetim = readdirSync(sesDizini).filter((f) => f.endsWith('.mp3') && !kullanilan.has(f));
} catch { /* ses klasörü yok */ }
if (yetim.length) console.log(`   bilgi: ${yetim.length} ses dosyası artık hiçbir yerde kullanılmıyor (silinebilir)`);

adim(4, 'Program özeti');
for (const h of r.ic.haftalar) {
  const dersSayisi = h.gunler.reduce((t, g) => t + (g.gorevler || []).length, 0);
  console.log(`   Hafta ${h.hafta}: ${h.baslik || ''} — ${h.gunler.length} gün, ${dersSayisi} görev`);
}
console.log(`   Toplam: ${r.idx.enSonGun} gün`);

console.log(sorun ? `\nTamamlandı; ${sorun} noktaya bakmak gerekebilir (yukarıya bak).` : '\n✓ Her şey tamam: içerik doğru, program eksiksiz, sesler hazır.');
process.exit(0);
