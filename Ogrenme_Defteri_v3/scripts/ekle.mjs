#!/usr/bin/env node
// Kolay giriş dosyasını içerik paketine çevirir ve doğrular. Biçim: docs/KOLAY_GIRIS.md
//   node scripts/ekle.mjs giris/kelimeler.txt [giris/baska.txt …] [--siklik sozcuk-listesi.txt] [--kuru]
//
// - Her dosya icerik/<paket>.json olarak yazılır (aynı girişi yeniden çalıştırmak aynı dosyayı verir).
// - icerik/index.json'a (program.json'dan önce) eklenir.
// - Tüm içerik doğrulanır; hata çıkarsa yapılan değişiklikler geri alınır, hiçbir şey bozulmaz.
// --siklik: her satırda bir sözcük, en sık olan en üstte (sv=auto için). Liste pakete DAHİL DEĞİLDİR (bkz. docs/SEVIYE_SISTEMI.md).
// --kuru: dosya yazmaz, yalnız kontrol eder.

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { girisCoz, siklikHaritasi } from '../js/giris.js';
import { icerikDogrula } from './dogrula.mjs';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const yaz = (yol, nesne) => writeFileSync(yol, JSON.stringify(nesne, null, 1) + '\n');

/**
 * Giriş metnini içeriğe ekler. Hata varsa değişiklikleri geri alır.
 * @returns {{ tamam: boolean, paketAd?: string, ozet?: object, hatalar: string[], uyarilar: string[], dogrulama?: { hata: string[], uyari: string[] } }}
 */
export function icerikEkle(metin, { klasor = join(kok, 'icerik'), dosya = 'giris', siklik = null, kuru = false } = {}) {
  const r = girisCoz(metin, { dosya, siklik });
  if (r.hatalar.length) return { tamam: false, hatalar: r.hatalar, uyarilar: r.uyarilar };
  return uygula(r, klasor, kuru); // kuru: geçici yaz, doğrula, geri al
}

function uygula(r, klasor, geriAl) {
  const yol = join(klasor, r.paketAd + '.json');
  const indeksYolu = join(klasor, 'index.json');
  const eskiDosya = existsSync(yol) ? readFileSync(yol, 'utf8') : null;
  const eskiIndeks = readFileSync(indeksYolu, 'utf8');
  const geriAlFn = () => {
    if (eskiDosya === null) rmSync(yol, { force: true }); else writeFileSync(yol, eskiDosya);
    writeFileSync(indeksYolu, eskiIndeks);
  };
  yaz(yol, r.paket);
  const dizin = JSON.parse(eskiIndeks);
  if (!dizin.paketler.includes(r.paketAd + '.json')) {
    const p = dizin.paketler.indexOf('program.json');
    dizin.paketler.splice(p >= 0 ? p : dizin.paketler.length, 0, r.paketAd + '.json');
    yaz(indeksYolu, dizin);
  }
  const d = icerikDogrula(klasor);
  const sonuc = { paketAd: r.paketAd, ozet: r.ozet, hatalar: [], uyarilar: r.uyarilar, dogrulama: { hata: d.hata, uyari: d.uyari } };
  if (d.hata.length || geriAl) {
    geriAlFn();
    return { ...sonuc, tamam: !d.hata.length, hatalar: d.hata.map((m) => 'doğrulama: ' + m) };
  }
  return { ...sonuc, tamam: true };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const secenek = (ad) => (a.includes(ad) ? a[a.indexOf(ad) + 1] : null);
  const kuru = a.includes('--kuru');
  const siklikYolu = secenek('--siklik');
  const dosyalar = a.filter((x, i) => !x.startsWith('--') && a[i - 1] !== '--siklik');
  if (!dosyalar.length) { console.log('Kullanım: node scripts/ekle.mjs giris/dosya.txt [--siklik liste.txt] [--kuru]\nBiçim: docs/KOLAY_GIRIS.md'); process.exit(1); }
  const siklik = siklikYolu ? siklikHaritasi(readFileSync(siklikYolu, 'utf8')) : null;
  let kotu = 0;
  for (const d of dosyalar) {
    const r = icerikEkle(readFileSync(d, 'utf8'), { dosya: basename(d).replace(/\.[^.]+$/, ''), siklik, kuru });
    for (const u of r.uyarilar || []) console.log(`  uyarı  ${d}: ${u}`);
    if (!r.tamam) { kotu++; console.log(`✗ ${d}`); for (const h of r.hatalar) console.log('  HATA   ' + h); continue; }
    const o = r.ozet;
    console.log(`✓ ${d} → icerik/${r.paketAd}.json${kuru ? ' (kuru çalıştırma, yazılmadı)' : ''}: ${o.kelime} kelime, ${o.ders} ders, ${o.hafiza} hafıza sözcüğü`);
  }
  if (!kuru && !kotu) console.log('\nSıradaki: node scripts/guncelle.mjs   (ses listesini günceller, eksik sesleri gösterir)');
  process.exit(kotu ? 1 : 0);
}
