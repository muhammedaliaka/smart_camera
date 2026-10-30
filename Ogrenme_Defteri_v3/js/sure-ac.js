// Süre tahminini tarayıcı durumuna bağlar: günün planındaki her göreve dakika ve odak grubu ekler.

import * as store from './store.js';
import * as icerik from './icerik.js';
import { derle } from './derle.js';
import { ctxOlustur } from './oyuncu.js';
import { hazirla, sayfalar as oturumSayfalari } from './seviye-oturum.js';
import { kuralKur } from './seviye.js';
import { bugun } from './zaman.js';
import { sayfalarSn, kalibrasyon, dakika, odakKesimi, odakSuresi } from './sure.js';

const VARSAYILAN_DK = { ingilizce: 8, okuma: 6, dinleme: 6, hafiza: 6, spor: 10 };
const onbellek = new Map();

/** Bir görevin ham (kalibre edilmemiş) saniyesi; kurulamazsa null. */
function hamSn(g, no) {
  const d = store.al();
  const anahtar = `${bugun()}|${g.anahtar}|${g.sv ?? ''}|${d.olaylar.length}`;
  if (onbellek.has(anahtar)) return onbellek.get(anahtar);
  let sn = null;
  try {
    const ctx = ctxOlustur(0);
    if (g.tur === 'ders') { const ders = icerik.ders(g.ders); if (ders) sn = sayfalarSn(derle(ders, ctx).sayfalar); }
    else {
      const B = { ic: icerik.ic(), idx: icerik.idx(), durum: d, kural: kuralKur(icerik.ic()), bugun: bugun(), programGunu: no };
      const hazir = hazirla(B, { iz: g.iz, tur: g.tur });
      if (!hazir.yok) sn = sayfalarSn(oturumSayfalari(hazir, ctx));
    }
  } catch { /* kurulamayan görev varsayılan süreyle gösterilir */ }
  onbellek.set(anahtar, sn);
  return sn;
}

/** Planın görevlerine { sn, dk, odak } ekler ve odak kesimini hesaplar. */
export function sureEkle(plan) {
  const k = kalibrasyon(store.al().olaylar);
  const odakDk = odakSuresi(store.al().ayar);
  const gorevler = plan.gorevler.map((g) => {
    const spor = g.iz === 'spor';
    const ham = spor ? null : hamSn(g, plan.no);
    const dk = ham == null ? (VARSAYILAN_DK[g.iz] ?? 6) : dakika(ham * k);
    return { ...g, dk: spor ? VARSAYILAN_DK.spor : dk, odak: !spor };
  });
  return { ...plan, gorevler, odakDk, kesim: odakKesimi(gorevler, odakDk), katsayi: k };
}
