#!/usr/bin/env node
// Ses listesi: uygulamanın çalabileceği her konuşmayı bulur.
//   node scripts/ses-liste.mjs [--icerik klasör] [--yaz] [--eksik]
// --yaz    ses/metinler.json (dosya → {metin, ses, hiz}) ve ses/liste.json (yalnız dosya adları) yazar
// --eksik  ses/ klasöründe henüz olmayan dosyaları listeler; eksik varsa çıkış kodu 1
// Üretim betiği (scripts/ses-uret.py) metinler.json'dan okur. Dosya adı js/ses.js'teki sesYolu ile aynıdır.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { derle, satirSesi } from '../js/derle.js';
import { sesYolu } from '../js/ses.js';
import { sayiEn } from '../js/metin.js';
import { icerikDogrula } from './dogrula.mjs';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function sesleriBul(klasor) {
  const r = icerikDogrula(klasor);
  const { ic, idx } = r;
  const ctx = { kelime: (id) => idx.kelime.get(id), tumKelimeler: ic.kelimeler, sesler: ic.sesler, dis: (id) => idx.dis.get(id), hareket: (id) => idx.hareket.get(id), ders: (id) => idx.ders.get(id), deneme: 0 };
  const harita = new Map(); // dosya adı → { metin, ses, hiz }
  const ekle = (k) => {
    if (!k || !k.metin) return;
    const ses = k.ses || ic.sesler.varsayilan;
    if (ses === 'tr') return; // Türkçe satırlar cihazın sesiyle okunur, dosya üretilmez
    const hiz = k.hiz ?? 1;
    const yol = sesYolu(k.metin, ses, hiz).replace(/^ses\//, '');
    if (!harita.has(yol)) harita.set(yol, { metin: k.metin, ses, hiz });
  };
  const gez = (nesne) => {
    if (!nesne || typeof nesne !== 'object') return;
    if (Array.isArray(nesne)) { nesne.forEach(gez); return; }
    for (const [anahtar, deger] of Object.entries(nesne)) {
      if ((anahtar === 'ses' || anahtar === 'ornekSes') && deger && typeof deger === 'object' && deger.metin) ekle(deger);
      else if (anahtar === 'adim' || anahtar === 'sahne' || anahtar === 'k') continue; // sayfa içindeki ham adım/sahne ayrıca ele alınır
      else gez(deger);
    }
  };
  // kelimeler: oyunlar ve alıştırmalar her kelimeyi çalabilir
  for (const k of ic.kelimeler) { ekle({ metin: k.en }); if (k.ornek) ekle({ metin: k.ornek.en }); }
  // 1–100 sayıları (Sayı avı ve sayi-dinle)
  for (let n = 1; n <= 100; n++) ekle({ metin: sayiEn(n) });
  // dersler: derlenen sayfalardaki ses kaynakları + sahne satırları
  for (const ders of ic.dersler) {
    const { sayfalar } = derle(ders, ctx);
    for (const s of sayfalar) {
      gez(s);
      if (s.t === 'sahne-dinle') for (const satir of s.sahne.satirlar) ekle(satirSesi(satir, ctx));
    }
  }
  return { harita, ic };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const klasor = resolve(a.includes('--icerik') ? a[a.indexOf('--icerik') + 1] : join(kok, 'icerik'));
  const sesDizini = join(kok, 'ses');
  const { harita } = sesleriBul(klasor);
  const dosyalar = [...harita.keys()].sort();
  console.log(`${dosyalar.length} farklı konuşma`);
  if (a.includes('--yaz')) {
    mkdirSync(sesDizini, { recursive: true });
    const metinler = Object.fromEntries(dosyalar.map((d) => [d, harita.get(d)]));
    writeFileSync(join(sesDizini, 'metinler.json'), JSON.stringify(metinler, null, 1) + '\n');
    writeFileSync(join(sesDizini, 'liste.json'), JSON.stringify(dosyalar) + '\n');
    console.log('yazıldı: ses/metinler.json, ses/liste.json');
  }
  const eksik = dosyalar.filter((d) => !existsSync(join(sesDizini, d)));
  if (a.includes('--eksik') || a.includes('--yaz')) {
    console.log(eksik.length ? `${eksik.length} ses dosyası henüz yok` : 'tüm ses dosyaları mevcut ✓');
    if (a.includes('--eksik')) { for (const d of eksik.slice(0, 20)) console.log('  ' + d + '  ' + JSON.stringify(harita.get(d).metin).slice(0, 70)); process.exit(eksik.length ? 1 : 0); }
  }
}
