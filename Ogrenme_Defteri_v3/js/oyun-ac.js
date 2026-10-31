// Oyunlaştırma ile uygulama durumu arasındaki köprü: XP, rütbe, hafta, rozet kaydı. Hesaplar js/oyunlastir.js'tedir (saf, testli).

import * as store from './store.js';
import { bugun } from './zaman.js';
import { xpHesapla, rutbe, etkinGunler, esnekSeri, haftaOzeti, haftaHedefi, istatistik, rozetDurumu, rozetleriIsle } from './oyunlastir.js';

const kayitAlani = () => { const d = store.al(); return (d.oyunlastirma ||= { rozet: {} }); };
const kelimeSayisi = () => Object.keys(store.al().srs).filter((k) => k.startsWith('k:')).length;

export const xpToplami = () => xpHesapla(store.al().olaylar).toplam;

/** Bugün ekranı için: toplam XP, rütbe, bugünkü XP, seri ve bu haftanın özeti. */
export function ozet() {
  const d = store.al(), b = bugun();
  const xp = xpHesapla(d.olaylar), gunler = etkinGunler(d.olaylar);
  return { xp: xp.toplam, bugunXp: xp.gunluk[b] || 0, rutbe: rutbe(xp.toplam), seri: esnekSeri(gunler, b), hafta: haftaOzeti(gunler, b, haftaHedefi(d.ayar)) };
}

/** Yeni kazanılan rozetleri deftere işler (bir kez kazanılan geri alınmaz); yeni kazanılanları döner. */
export function rozetleriGuncelle() {
  const d = store.al();
  const { kayit, yeni } = rozetleriIsle(istatistik(d.olaylar, { kelimeSayisi: kelimeSayisi() }), kayitAlani().rozet, bugun());
  if (yeni.length) { kayitAlani().rozet = kayit; store.kaydet(); }
  return yeni;
}

/** Tüm rozetler: kazanılanlar (kazanılan gün ve görülme durumuyla) ve kilitli olanlar (ilerlemeyle). */
export function rozetler() {
  const d = store.al(), kayit = kayitAlani().rozet;
  return rozetDurumu(istatistik(d.olaylar, { kelimeSayisi: kelimeSayisi() })).map((r) => ({ ...r, kazandi: !!kayit[r.id] || r.kazandi, gun: kayit[r.id]?.g || null, gorulen: !!kayit[r.id]?.gorulen }));
}

/** Henüz "Yeni rozet" kartında gösterilmemiş, kazanılmış rozetler. */
export function gorulmemisRozetler() {
  rozetleriGuncelle();
  const kayit = kayitAlani().rozet;
  return rozetler().filter((r) => kayit[r.id] && !kayit[r.id].gorulen);
}
export function gorulduIsaretle(idler) {
  const kayit = kayitAlani().rozet;
  for (const id of idler) if (kayit[id]) kayit[id].gorulen = true;
  store.kaydetHemen();
}

/**
 * Bir oturum bitince: kazanılan XP, rütbe atladı mı, yeni rozetler (görüldü sayılır), bu haftanın durumu.
 * xpOnce: oturum başında xpToplami() değeri.
 */
export function oturumSonucu(xpOnce) {
  const yeni = rozetleriGuncelle();
  gorulduIsaretle(yeni.map((r) => r.id));
  const oz = ozet();
  return { kazanilan: Math.max(0, oz.xp - xpOnce), toplam: oz.xp, rutbe: oz.rutbe, rutbeAtladi: rutbe(xpOnce).sira < oz.rutbe.sira, yeniRozetler: yeni, hafta: oz.hafta, seri: oz.seri };
}
