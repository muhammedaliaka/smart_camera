#!/usr/bin/env node
// İçerik doğrulama: node scripts/dogrula.mjs [--icerik klasör] [--sessiz]
// icerik/index.json'daki tüm paketleri tarayıcıdaki gibi birleştirir ve js/dogrula.js kurallarından geçirir.
// Hata varsa çıkış kodu 1; uyarılar bilgi içindir.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { birlestir, indeksle } from '../js/paket.js';
import { dogrula } from '../js/dogrula.js';

const kok = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function paketleriOku(klasor) {
  const dizin = JSON.parse(readFileSync(join(klasor, 'index.json'), 'utf8'));
  const kayitli = new Set(dizin.paketler);
  const paketler = dizin.paketler.map((d) => ({ ...JSON.parse(readFileSync(join(klasor, d), 'utf8')), kaynak: d }));
  const ekstra = readdirSync(klasor).filter((f) => f.endsWith('.json') && f !== 'index.json' && !kayitli.has(f));
  return { paketler, ekstra };
}

export function icerikDogrula(klasor) {
  const { paketler, ekstra } = paketleriOku(klasor);
  const ic = birlestir(paketler);
  const idx = indeksle(ic);
  const sonuc = dogrula(ic, idx);
  // Hareket videosu/posteri: uygulama kökü (icerik'in yanında gorsel/ varsa) denetlenir; geçici kopyalarda atlanır.
  const uygulamaKoku = join(klasor, '..');
  if (existsSync(join(uygulamaKoku, 'gorsel'))) {
    for (const m of ic.hareketler) for (const k of ['video', 'poster', 'gorsel']) if (m[k] && !existsSync(join(uygulamaKoku, m[k]))) sonuc.hata.push(`hareket:${m.id}: "${k}" dosyası yok (${m[k]})`);
  }
  for (const f of ekstra) sonuc.uyari.unshift(`${f}: icerik/index.json'da listelenmemiş, uygulama bu dosyayı yüklemez`);
  return { ic, idx, ...sonuc };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const klasor = resolve(a.includes('--icerik') ? a[a.indexOf('--icerik') + 1] : join(kok, 'icerik'));
  const r = icerikDogrula(klasor);
  const sayilar = `${r.ic.paketler.length} paket · ${r.ic.kelimeler.length} kelime · ${r.ic.dersler.length} ders · ${r.idx.gunler.size} gün · ${r.ic.hareketler.length} hareket`;
  console.log(sayilar);
  if (!a.includes('--sessiz')) for (const u of r.uyari) console.log('  uyarı  ' + u);
  for (const h of r.hata) console.log('  HATA   ' + h);
  console.log(r.hata.length ? `\n✗ ${r.hata.length} hata, ${r.uyari.length} uyarı` : `\n✓ hata yok (${r.uyari.length} uyarı)`);
  process.exit(r.hata.length ? 1 : 0);
}
