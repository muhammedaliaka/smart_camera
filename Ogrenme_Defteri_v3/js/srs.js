// Aralıklı tekrar. Kural: tekrar 3, 10, 20, 50 gün — her aralık, bir önceki GERÇEKLEŞEN tekrar tarihinden sayılır.
// Yanlış yanıtta kutu korunur, madde ertesi gün yeniden sorulur.

import { gunEkle } from './zaman.js';

export const ARALIK = [3, 10, 20, 50];

export function yeniMadde(ogrenmeGunu) {
  return { k: 0, s: gunEkle(ogrenmeGunu, ARALIK[0]), ogr: ogrenmeGunu, son: ogrenmeGunu, y: 0, d: 0, bitti: false };
}

/** Bir tekrar yanıtını işler; yeni durumu döndürür (girdiyi değiştirmez). */
export function cevapla(m, dogru, bugun) {
  const yeni = { ...m, son: bugun };
  if (!dogru) {
    yeni.y = (m.y || 0) + 1;
    yeni.s = gunEkle(bugun, 1);
    return yeni;
  }
  yeni.d = (m.d || 0) + 1;
  yeni.k = m.k + 1;
  if (yeni.k >= ARALIK.length) { yeni.bitti = true; yeni.s = null; }
  else yeni.s = gunEkle(bugun, ARALIK[yeni.k]);
  return yeni;
}

export function vadesiGeldi(m, bugun) { return !m.bitti && !!m.s && m.s <= bugun; }

/** Gecikme yoksa nominal tekrar günleri (öğrenmeden +3, +13, +33, +83). */
export function nominalGunler(ogrenmeGunu) {
  let toplam = 0;
  return ARALIK.map((a) => gunEkle(ogrenmeGunu, (toplam += a)));
}

/** Kutu başına durum özeti: {yeni, ogreniyor, bitti, vadesi}. */
export function ozet(srs, bugun) {
  const o = { toplam: 0, bitti: 0, vadesi: 0, yarin: 0, hafta: 0 };
  for (const m of Object.values(srs)) {
    o.toplam++;
    if (m.bitti) { o.bitti++; continue; }
    if (m.s <= bugun) o.vadesi++;
    else if (m.s === gunEkle(bugun, 1)) o.yarin++;
    else if (m.s <= gunEkle(bugun, 7)) o.hafta++;
  }
  return o;
}
