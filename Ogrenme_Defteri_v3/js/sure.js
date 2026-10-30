// Süre tahmini ve odak penceresi. Saf işlevler (tarayıcıya bağlı değil): Bugün sayfası, "sıradaki" düğmesi ve testler aynı kuralı kullanır.
//
// Neden: "bugün ne kadar sürecek?" bilinmezse başlamak zor olur. Tahmin, sayfa türüne göre kaba saniyelerden gelir; öğrencinin gerçek
// hızı (olay günlüğündeki "sure" kayıtları) biriktikçe tahmin ona göre ayarlanır (kalibrasyon).
// Odak süresi (varsayılan 30 dk, en çok 50): günün zorunlu görevleri bu pencereye sığacak kadarı "şimdi", kalanı "mola sonrası" olur.
// Spor oturup çalışma değildir: odak süresine sayılmaz, mola yerine geçer.

import { gunFarki } from './zaman.js';

export const ODAK = { varsayilan: 30, enAz: 20, enCok: 50, adim: 5 };

/** Sayfa türü başına kaba saniye (ölçülmüş değil; kalibrasyon düzeltir). */
export const SAYFA_SN = {
  anlat: 20, kelime: 12, 'sahne-dinle': 35, 'sahne-metin': 25, dinle: 30, 'dinle-metin': 20, oku: 40, olcek: 8,
  mcq: 15, yaz: 20, eslestir: 40, cumle: 28, dikte: 35, sayi: 18, serbest: 60,
  'liste-sun': 50, 'liste-hatirla': 45, gecikmeli: 10, 'gecikmeli-kontrol': 30, 'saray-kur': 100, 'saray-yerlestir': 80,
  kartlar: 90, spor: 600, dis: 180,
};
const BILINMEYEN_SN = 20;

export function sayfaSn(s) {
  let sn = SAYFA_SN[s.t] ?? BILINMEYEN_SN;
  if (s.t === 'liste-hatirla' && Array.isArray(s.liste)) sn = 15 + 6 * s.liste.length;
  return sn;
}
export const sayfalarSn = (sayfalar) => (sayfalar || []).reduce((t, s) => t + sayfaSn(s), 0);
export const dakika = (sn) => Math.max(1, Math.round(sn / 60));

/** Gerçek/tahmin oranının ortancası (son 12 ölçüm; en az 3 ölçüm yoksa 1). 0,6–2 aralığına sıkıştırılır. */
export function kalibrasyon(olaylar) {
  const oranlar = olaylar.filter((o) => o.tur === 'sure' && o.tahmin > 0 && o.sn >= 20 && o.sn <= 7200).slice(-12).map((o) => o.sn / o.tahmin).sort((a, b) => a - b);
  if (oranlar.length < 3) return 1;
  const orta = oranlar.length % 2 ? oranlar[(oranlar.length - 1) / 2] : (oranlar[oranlar.length / 2 - 1] + oranlar[oranlar.length / 2]) / 2;
  return Math.min(2, Math.max(0.6, orta));
}

/**
 * Görevleri odak penceresine böler. Her görev { istege, bitti, dk, odak } taşır (odak:false → hareket/spor).
 * İlk odak görevi her zaman "simdi"dedir; sonrakiler toplam süre odak süresini 3 dakikadan fazla aşıyorsa "sonra"ya (mola sonrası) geçer.
 * Dönüş: { simdi, sonra, hareket, bonus, simdiDk, sonraDk, kalanDk } — yalnız zorunlu görevler simdi/sonra/hareket'e girer.
 */
export function odakKesimi(gorevler, odakDk, tolerans = 3) {
  const k = { simdi: [], sonra: [], hareket: [], bonus: [] };
  let top = 0, tasti = false;
  for (const g of gorevler) {
    if (g.istege) { k.bonus.push(g); continue; }
    if (g.odak === false) { k.hareket.push(g); continue; }
    top += g.dk || 0;
    if (!tasti && k.simdi.length && top > odakDk + tolerans) tasti = true;
    (tasti ? k.sonra : k.simdi).push(g);
  }
  const topla = (l) => l.reduce((t, g) => t + (g.dk || 0), 0);
  const bitmemis = (l) => l.filter((g) => !g.bitti);
  return { ...k, simdiDk: topla(k.simdi), sonraDk: topla(k.sonra), kalanDk: topla(bitmemis(k.simdi)) + topla(bitmemis(k.sonra)) };
}

/** Bugünün etkin günlerinden bir önceki üçü odak süresini dolduruyorsa 5 dakikalık artış önerir; yoksa null. */
export function odakOnerisi({ olaylar, odakDk, bugun, ayar = {} }) {
  if (odakDk >= ODAK.enCok) return null;
  if (ayar.odakErtele && ayar.odakErtele > bugun) return null;
  if (ayar.odakDegisim && gunFarki(ayar.odakDegisim, bugun) < 7) return null;
  const gunSn = new Map();
  for (const o of olaylar) if (o.tur === 'sure' && o.iz !== 'spor' && o.sn > 0 && o.g < bugun && gunFarki(o.g, bugun) <= 10) gunSn.set(o.g, (gunSn.get(o.g) || 0) + o.sn);
  const gunler = [...gunSn.keys()].sort().slice(-3);
  if (gunler.length < 3) return null;
  if (!gunler.every((g) => gunSn.get(g) >= 0.85 * odakDk * 60)) return null;
  return { yeni: Math.min(ODAK.enCok, odakDk + ODAK.adim), gunler };
}

/** Bugün oturup çalışarak geçen süre (dakika; spor sayılmaz). */
export function bugunOdakDk(olaylar, bugun) {
  return olaylar.filter((o) => o.tur === 'sure' && o.g === bugun && o.iz !== 'spor').reduce((t, o) => t + (o.sn || 0), 0) / 60;
}

/** Ayardan odak süresi (geçersiz değerde varsayılan). */
export function odakSuresi(ayar) {
  const v = Number(ayar?.odakDk);
  return Number.isFinite(v) && v >= ODAK.enAz && v <= ODAK.enCok ? v : ODAK.varsayilan;
}
