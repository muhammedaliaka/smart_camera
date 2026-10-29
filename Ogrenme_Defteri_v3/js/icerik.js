// İçerik yükleyici: icerik/index.json'da listelenen paketleri ve (varsa) içe aktarılmış kullanıcı paketlerini birleştirir.

import { birlestir, indeksle } from './paket.js';
import { dogrula } from './dogrula.js';
import { depo } from './store.js';

export const durum = { ic: null, idx: null, sonuc: null, hata: null };

export async function yukle() {
  const dizin = await getir('icerik/index.json');
  const paketler = [];
  for (const dosya of dizin.paketler) {
    const p = await getir('icerik/' + dosya);
    p.kaynak = dosya;
    paketler.push(p);
  }
  try {
    const kullanici = await depo.hepsi('paketler');
    for (const [, p] of kullanici) paketler.push({ ...p, kaynak: 'kullanici' });
  } catch { /* IndexedDB yoksa yalnız yerleşik paketler */ }
  durum.ic = birlestir(paketler);
  durum.idx = indeksle(durum.ic);
  durum.sonuc = dogrula(durum.ic, durum.idx);
  return durum;
}

async function getir(yol) {
  const r = await fetch(yol, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${yol} açılamadı (${r.status})`);
  return r.json();
}

export const ic = () => durum.ic;
export const idx = () => durum.idx;
export const kelime = (id) => durum.idx.kelime.get(id);
export const ders = (id) => durum.idx.ders.get(id);

/** Kullanıcı paketi içe aktar: önce doğrula, hata varsa kaydetme. */
export async function paketIceAktar(metin) {
  let p;
  try { p = JSON.parse(metin); } catch (e) { throw new Error('Dosya geçerli bir JSON değil: ' + e.message); }
  if (!p.paket || typeof p.paket !== 'string') throw new Error('Paketin "paket" adı (kimlik) yok.');
  // Denemeli birleştirme: yerleşik + bu paket (aynı adlı kullanıcı paketi yenisiyle değişir)
  const dizin = await getir('icerik/index.json');
  const hepsi = [];
  for (const d of dizin.paketler) hepsi.push(await getir('icerik/' + d));
  const digerleri = (await depo.hepsi('paketler')).map(([, v]) => v).filter((v) => v.paket !== p.paket);
  const dene = birlestir([...hepsi, ...digerleri, p]);
  const sonuc = dogrula(dene, indeksle(dene));
  if (sonuc.hata.length) { const e = new Error(`Paket reddedildi: ${sonuc.hata.length} hata`); e.liste = sonuc.hata; throw e; }
  await depo.koy('paketler', p.paket, p);
  await yukle();
  return { uyari: sonuc.uyari, paket: p.paket };
}
export async function paketSil(ad) { await depo.sil('paketler', ad); await yukle(); }
