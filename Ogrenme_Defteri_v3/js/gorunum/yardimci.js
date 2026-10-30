// Ekranların ortak parçaları: program günü, ders satırı, ders özeti, sonraki ders.

import { h, simge } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import { IZLER } from '../paket.js';
import { bugun, gunFarki } from '../zaman.js';

/** Bugünün program günü. durum: ayarsiz | baslamadi | surer | bitti | programYok */
export function programGunu() {
  const d = store.al();
  const idx = icerik.idx();
  if (!d.baslangic) return { no: 1, durum: 'ayarsiz' };
  const no = gunFarki(d.baslangic, bugun()) + 1;
  if (!idx.gunler.size && !icerik.ic().seviyeli) return { no, durum: 'programYok' };
  if (no < 1) return { no, durum: 'baslamadi' };
  if (no > idx.enSonGun) return { no, durum: 'bitti' };
  return { no, durum: 'surer', gun: idx.gunler.get(no) || null };
}

/** Bir dersin altında kısa, insan dilinde ne yapılacağı. */
export function dersOzeti(ders) {
  const say = {};
  let kelime = 0, soru = 0;
  for (const a of ders.adimlar) {
    say[a.tur] = (say[a.tur] || 0) + 1;
    if (a.tur === 'kelime-ogren') kelime += a.kelimeler.length;
    if (a.tur === 'sahne') soru += a.sorular.length;
    if (a.tur === 'soru') soru++;
    if (a.tur === 'dinle') soru += (a.sorular || []).length;
  }
  const s = [];
  if (kelime) s.push(`${kelime} yeni kelime`);
  if (say.sahne) s.push(`${say.sahne} kısa sahne (dinle + anla)`);
  if (say.alistirma) s.push('kelime alıştırması');
  if (say['cumle-kur']) s.push('cümle kurma');
  if (say.dikte) s.push('dikte (duyduğunu yaz)');
  if (say['sayi-dinle']) s.push('sayı dinleme');
  if (say.dinle) s.push('dinleme');
  if (say.oku) s.push('okuma');
  if (say.soru && !say.sahne) s.push(`${say.soru} soru`);
  if (say['liste-sun']) s.push('liste ezberi');
  if (say['saray-kur'] || say['saray-yerlestir']) s.push('hafıza sarayı');
  if (say.serbest) s.push('kendi cümlenle yanıt');
  if (say.spor) s.push('spor kartı');
  if (say.dis) s.push('dış uygulama görevi');
  if (say['gecikmeli-kur']) s.push('gecikmeli hatırlama testi');
  return { liste: s, soru };
}

export function dersDurumMetni(dersId) {
  const dd = store.dersDurumu(dersId);
  const devam = store.al().notlar['devam:' + dersId];
  if (devam && devam.i > 0) return 'yarım kaldı';
  if (dd?.bitti) return dd.yuzde != null ? `bitti · %${dd.yuzde}` : 'bitti';
  return null;
}

export function gorevSatiri(dersId, { istege = false, ek = null } = {}) {
  const d = icerik.ders(dersId);
  if (!d) return null;
  const bitti = store.dersBitti(dersId);
  const iz = IZLER[d.iz] || { ad: d.iz, simge: '•' };
  const durum = dersDurumMetni(dersId);
  const alt = [iz.ad, istege ? 'isteğe bağlı' : null, durum, ek].filter(Boolean).join(' · ');
  return h('a.gorev' + (bitti ? '.bitti' : ''), { href: `#/ders/${dersId}`, data: { iz: d.iz } },
    h('span.iz-simge', d.emoji || iz.simge),
    h('span.metin', h('span.baslik', d.baslik), h('span.alt', alt)),
    h('span.durum', { 'aria-label': bitti ? 'Tamamlandı' : 'Henüz yapılmadı' }, bitti ? simge('tik') : null));
}

/** Sonuç ekranındaki "Sonraki" düğmesi: aynı günün sıradaki bitmemiş dersi, yoksa Bugün. */
export function sonrakiDers(dersId) {
  const idx = icerik.idx();
  const no = idx.dersGunu.get(dersId);
  if (no) {
    const gorevler = idx.gunler.get(no).gorevler || [];
    const i = gorevler.findIndex((t) => t.ders === dersId);
    for (const t of gorevler.slice(i + 1)) {
      if (!store.dersBitti(t.ders)) return { etiket: `Sıradaki: ${icerik.ders(t.ders).baslik}`, href: `#/ders/${t.ders}` };
    }
  }
  return { etiket: 'Bugün sayfasına dön', href: '#/bugun' };
}

export function sayfaBasligi(baslik, alt, sag) {
  return h('div.ust', h('div', h('h1', baslik), alt ? h('p.alt-yazi', { style: 'margin:2px 0 0' }, alt) : null), sag || null);
}

export function bosKutu(emoji, baslik, aciklama, eylem) {
  return h('div.bos', h('div.buyuk-emoji', emoji), h('h3', baslik), aciklama ? h('p', aciklama) : null, eylem || null);
}

export function toplamDers() {
  const dersler = icerik.ic().dersler;
  return { toplam: dersler.length, biten: dersler.filter((d) => store.dersBitti(d.id)).length };
}
