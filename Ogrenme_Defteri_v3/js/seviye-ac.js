// Seviye oturumlarını ve yoklamalarını tarayıcıda açar: saf kurucuları (seviye-oturum.js) depoya ve oynatıcıya bağlar.

import { bildir } from './ui.js';
import * as store from './store.js';
import * as icerik from './icerik.js';
import * as oyuncu from './oyuncu.js';
import { bugun, gunFarki } from './zaman.js';
import { kuralKur, seviyeler } from './seviye.js';
import { hazirla, sayfalar, olayVerisi, sonucMetni, yerlestirmeKapatOlayi } from './seviye-oturum.js';
import { gunPlani, gorevAdresi } from './plan.js';

export const kural = () => kuralKur(icerik.ic());

/** Bugünün program günü numarası (program başlamadıysa null). */
export function gunNo() {
  const b = store.al().baslangic;
  return b ? gunFarki(b, bugun()) + 1 : null;
}

/** Tüm becerilerin güncel seviyesi. */
export function seviyeDurumu() {
  return seviyeler(store.al().olaylar, kural(), { programGunu: gunNo() });
}

/** Bugünün planı (gün gün yazılmış görevler + yoklamalar + seviye oturumları). */
export function bugunPlani() {
  const no = gunNo();
  if (no == null) return null;
  return gunPlani({ no, ic: icerik.ic(), idx: icerik.idx(), durum: store.al(), kural: kural(), bugun: bugun() });
}

/** Bugünün planında, verilen görevden sonra yapılacak ilk bitmemiş görev: { etiket, href } ya da null. */
export function sonrakiGorev(anahtar) {
  const plan = bugunPlani();
  const g = plan?.gorevler.find((x) => !x.bitti && !x.istege && x.anahtar !== anahtar);
  if (!g) return null;
  const ad = g.tur === 'yoklama' ? 'Sıradaki yoklama' : g.tur === 'oturum' ? 'Sıradaki oturum' : 'Sıradaki görev';
  return { etiket: ad, href: gorevAdresi(g) };
}

/**
 * Bir beceri için yoklama ya da seviye oturumu açar.
 * iz: ingilizce | okuma | dinleme | hafiza | spor;  tur: 'yoklama' | 'oturum'
 */
export function oturumAc(iz, tur, { donus = '#/bugun' } = {}) {
  const k = kural();
  const durum = store.al();
  const B = { ic: icerik.ic(), idx: icerik.idx(), durum, kural: k, bugun: bugun(), programGunu: gunNo() };
  const hazir = hazirla(B, { iz, tur });
  if (hazir.yok === 'araliksiz') { // bilinen aralıkta yoklanacak içerik kalmadı: yerleştirme burada biter
    const k2 = yerlestirmeKapatOlayi(iz, hazir.ayrinti);
    store.olay(k2.tur, k2.veri, { iz });
    store.kaydetHemen();
    const son = seviyeler(store.al().olaylar, k, { programGunu: B.programGunu })[iz];
    bildir(`${son.ad} yoklaması tamamlandı. Başlangıç seviyen: ${son.sv}.`, 4200);
    location.replace(donus);
    return;
  }
  if (hazir.yok) {
    bildir(hazir.yok === 'icerik' ? `Şimdilik içerik yok: ${hazir.ayrinti}` : (hazir.ayrinti || 'Bu oturum açılamadı'), 4200);
    location.replace(donus);
    return;
  }
  const once = seviyeler(durum.olaylar, k, { programGunu: B.programGunu })[iz];
  const anahtar = `${tur}:${iz}`;
  const oturumKimligi = hazir.yazili ? (tur === 'yoklama' ? `yoklama:${hazir.dersId}` : hazir.dersId) : hazir.ders.id; // soru kayıtlarındaki ders kimliğiyle aynı: rapor bunlarla birleştirir
  const bitir = (S) => {
    const o = olayVerisi(hazir, { dogru: S.puan.dogru, toplam: S.puan.toplam, spor: S.sonuc || null }, k);
    if (iz !== 'spor' && !(o.veri.toplam > 0)) return; // hiçbir soru puanlanmadıysa seviyeye etki etmez
    store.olay(o.tur, { ...o.veri, oturum: oturumKimligi }, { dersAd: hazir.baslik, iz, seviyeTur: tur });
    if (tur === 'oturum') for (const id of hazir.yeniKelimeler || []) store.maddeEkle('k:' + id);
    const sonra = seviyeler(store.al().olaylar, k, { programGunu: B.programGunu })[iz];
    S.seviyeSonucu = sonucMetni(hazir, once, sonra, k, o.veri);
    store.kaydetHemen();
  };
  const sonraki = () => sonrakiGorev(anahtar);
  if (hazir.yazili && tur === 'oturum') { // yazılı dersin kendisi: ders olarak işaretlenir, sonuç seviyeye de yazılır
    oyuncu.dersAc(hazir.dersId, { donus, sonraki, oturumBitti: bitir });
    return;
  }
  const ctx = oyuncu.ctxOlustur(0);
  oyuncu.oynat({
    id: hazir.yazili ? `yoklama:${hazir.dersId}` : hazir.ders.id, baslik: hazir.baslik, iz, sayfalar: sayfalar(hazir, ctx), ctx, donus, sonraki,
    dersMi: false, kaydetme: true, tekrarYok: tur === 'yoklama', oturumBitti: bitir, emoji: hazir.emoji, hedef: hazir.hedef,
  });
}
