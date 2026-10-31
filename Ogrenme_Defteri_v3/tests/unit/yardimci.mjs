// Testlerin ortak yardımcıları: içerik paketlerinden hızlıca doğrulayıcı sonucu üretir.
import { birlestir, indeksle } from '../../js/paket.js';
import { dogrula } from '../../js/dogrula.js';

export const kelime = (id, en, tr, ek = {}) => ({ id, en, tr, ...ek });
export const ders = (id, adimlar, ek = {}) => ({ id, iz: 'ingilizce', baslik: id, hedef: 'hedef', adimlar, ...ek });

/** paketler: paket nesneleri dizisi. Dönüş: { ic, idx, hata, uyari } */
export function dogrulaPaketler(...paketler) {
  const ic = birlestir(paketler.map((p, i) => ({ paket: 'p' + i, ...p })));
  const idx = indeksle(ic);
  return { ic, idx, ...dogrula(ic, idx) };
}

export const var_mi = (liste, parca) => liste.some((m) => m.includes(parca));

export function ctxOlustur(ic, idx, deneme = 0) {
  return {
    kelime: (id) => idx.kelime.get(id), tumKelimeler: ic.kelimeler, sesler: ic.sesler,
    dis: (id) => idx.dis.get(id), hareket: (id) => idx.hareket.get(id), ders: (id) => idx.ders.get(id), deneme,
  };
}
