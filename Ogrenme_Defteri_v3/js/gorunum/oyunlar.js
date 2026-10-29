// Oyunlar: öğrendiğin kelimelerle kısa oyunlar + dinleyerek öğreten dış uygulamalar.

import { h, simge, karistir, tohumlu, yazidanTohum, bildir } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import { bugun } from '../zaman.js';
import { kelimeSorusu, eslestirSayfasi, cumleSayfasi, sayiSayfalari } from '../uretici.js';
import { oynat, ctxOlustur } from '../oyuncu.js';
import { sayfaBasligi, bosKutu } from './yardimci.js';

const OYUNLAR = [
  { id: 'eslestir', ad: 'Eşleştirme', emoji: '🧩', aciklama: 'İngilizce kelimeyi Türkçe karşılığıyla eşle. 3 tur.', min: 5,
    uret: (k, c, rng) => [0, 1, 2].map((i) => eslestirSayfasi(karistir(k, rng).slice(0, 5), 'Eşleştirme', rng, `oyun-es-${i}`)) },
  { id: 'dinle-bul', ad: 'Dinle ve bul', emoji: '🎧', aciklama: 'Kelimeyi duy, doğru anlamı seç. 10 soru.', min: 6,
    uret: (k, c, rng) => karistir(k, rng).slice(0, 10).map((x) => kelimeSorusu('dinle-sec', x, { havuz: k, tumu: c.tumKelimeler, ctx: c, rng, bolum: 'Dinle ve bul' })) },
  { id: 'hizli', ad: 'Hızlı tur', emoji: '⚡', aciklama: 'İngilizce ↔ Türkçe karışık 12 hızlı soru.', min: 6,
    uret: (k, c, rng) => karistir(k, rng).slice(0, 12).map((x, i) => kelimeSorusu(i % 2 ? 'kelime-sec' : 'anlam-sec', x, { havuz: k, tumu: c.tumKelimeler, ctx: c, rng, bolum: 'Hızlı tur' })) },
  { id: 'yazim', ad: 'Yazım', emoji: '✍️', aciklama: 'Türkçesini gör, İngilizcesini yaz. 8 kelime.', min: 4,
    uret: (k, c, rng) => karistir(k, rng).slice(0, 8).map((x) => kelimeSorusu('yaz', x, { havuz: k, tumu: c.tumKelimeler, ctx: c, rng, bolum: 'Yazım' })) },
  { id: 'cumle', ad: 'Cümle kur', emoji: '🧱', aciklama: 'Karışık kelimelerden doğru cümleyi kur. 6 cümle.', min: 3,
    uret: (k, c, rng) => karistir(k.filter((x) => x.ornek), rng).slice(0, 6).map((x, i) => cumleSayfasi({ tr: x.ornek.tr, en: x.ornek.en }, { id: `oyun-c-${x.id}`, bolum: 'Cümle kur', tohum: 'oyun' + i })) },
  { id: 'kartlar', ad: 'Hafıza kartları', emoji: '🃏', aciklama: 'Kartları çevir, İngilizce–Türkçe çiftleri bul.', min: 6,
    uret: (k, c, rng) => [{ t: 'kartlar', id: 'oyun-kartlar', bolum: 'Hafıza kartları', puan: true, ciftler: karistir(k, rng).slice(0, 6).map((x) => ({ id: x.id, en: x.en, tr: x.tr })) }] },
  { id: 'sayi', ad: 'Sayı avı', emoji: '🔢', aciklama: 'Duyduğun sayıyı rakamla yaz. 8 sayı.', min: 0, kelimesiz: true,
    uret: (k, c, rng) => sayiSayfalari({ aralik: [1, 100], adet: 8, karisiklik: true, bolum: 'Sayı avı' }, { id: 'oyun-sayi', tohum: 'oyun-' + Math.floor(rng() * 1e6), ctx: c }) },
];

function ogrenilenKelimeler() {
  const ids = Object.keys(store.al().srs).filter((x) => x.startsWith('k:')).map((x) => x.slice(2));
  return ids.map((id) => icerik.kelime(id)).filter(Boolean);
}

export function oyunlarGorunum() {
  const kok = h('div', sayfaBasligi('Oyunlar', 'Öğrendiğin kelimelerle oyna; sonuçların kaydedilir'));
  const bilinen = ogrenilenKelimeler();
  if (bilinen.length < 6) kok.append(h('div.kart.uyari', h('strong', 'Önce birkaç ders bitir'), h('div', 'Oyunlar öğrendiğin kelimelerden kurulur. Şimdilik ' + (bilinen.length ? `${bilinen.length} kelimen var.` : 'hiç kelimen yok.') + ' Çoğu oyun için en az 6 kelime gerekir.')));
  const izgara = h('div.izgara.iki');
  for (const o of OYUNLAR) {
    const hazir = o.kelimesiz || bilinen.length >= o.min;
    const kayit = store.al().oyunlar[o.id];
    izgara.append(h(hazir ? 'a.kart' : 'div.kart.duz', { href: hazir ? `#/oyun/${o.id}` : null, 'aria-disabled': hazir ? null : 'true', style: `margin:0;text-decoration:none;color:inherit;${hazir ? '' : 'opacity:.55'}`, data: { iz: 'oyun' } },
      h('div.satir', h('span.iz-simge', o.emoji), h('div', h('h3', { style: 'margin:0' }, o.ad), h('div.alt-yazi', o.aciklama))),
      h('div.satir', { style: 'margin-top:8px' }, kayit ? h('span.rozet.dogru', `En iyi %${kayit.enIyi}`) : h('span.rozet', hazir ? 'Henüz oynamadın' : `${o.min} kelime gerekir`), h('span.bosluk'), hazir ? h('strong', { style: 'color:var(--iz-oyun)' }, 'Oyna →') : null)));
  }
  kok.append(izgara);

  const dis = icerik.ic().disUygulamalar;
  if (dis.length) {
    kok.append(h('div.bolum-baslik', h('h2', 'Dinleyerek öğreten uygulamalar')));
    kok.append(h('p.alt-yazi', 'Bu uygulamalar telefona ayrıca kurulur. Uygulamalar bize veri göndermez; bitirince sonucunu 10 saniyede buraya girersin ve ilerlemene eklenir.'));
    for (const u of dis) kok.append(disKarti(u));
  }
  return kok;
}

function disKarti(u) {
  const son = store.olaylar((o) => o.tur === 'dis' && o.uygulama === u.id && !o.yapilmadi && o.yuzde != null).slice(-1)[0];
  return h('div.kart', { data: { iz: 'dis' } },
    h('div.satir', h('span.iz-simge', u.simge || '📱'), h('div', h('h3', { style: 'margin:0' }, u.ad), h('div.alt-yazi', u.kisa || ''))),
    u.aciklama ? h('p', { style: 'margin-top:10px' }, u.aciklama) : null,
    u.nasil?.length ? h('details.ac', h('summary', 'Nasıl kullanılır?'), h('ol.liste-duz', u.nasil.map((x) => h('li', x)))) : null,
    u.uyari ? h('div.ipucu', u.uyari) : null,
    h('div.esnek', { style: 'margin-top:6px' },
      u.play ? h('a.dugme.birincil.kucuk', { href: u.play, target: '_blank', rel: 'noopener' }, simge('indir'), 'Google Play') : null,
      u.ios ? h('a.dugme.cizgili.kucuk', { href: u.ios, target: '_blank', rel: 'noopener' }, 'App Store') : null,
      u.web ? h('a.dugme.cizgili.kucuk', { href: u.web, target: '_blank', rel: 'noopener' }, simge('dis'), 'Web sitesi') : null,
      h('a.dugme.cizgili.kucuk', { href: `#/dis/${u.id}` }, simge('kalem'), 'Sonuç gir')),
    son ? h('p.alt-yazi', { style: 'margin:10px 0 0' }, `Son girdiğin sonuç: ${son.dogru}/${son.toplam} (%${son.yuzde})`) : null);
}

export function oyunBaslat(id) {
  const o = OYUNLAR.find((x) => x.id === id);
  if (!o) { bildir('Oyun bulunamadı'); location.replace('#/oyunlar'); return; }
  const ctx = ctxOlustur();
  let k = ogrenilenKelimeler();
  if (!o.kelimesiz && k.length < o.min) { bildir(`Bu oyun için en az ${o.min} kelime öğrenmelisin.`); location.replace('#/oyunlar'); return; }
  const rng = tohumlu(yazidanTohum(`${id}|${Date.now()}`));
  const sayfalar = o.uret(k, ctx, rng);
  oynat({
    id: 'oyun:' + id, baslik: o.ad, iz: 'oyun', sayfalar, ctx, donus: '#/oyunlar', dersMi: false, tekrarYok: true, bitisEtiketi: 'Oyunlara dön', emoji: o.emoji,
    sonraki: () => ({ etiket: 'Yeniden oyna', href: `#/oyun/${id}?x=${Date.now()}` }),
    oturumBitti: (S) => {
      const { dogru, toplam } = S.puan;
      const yuzde = toplam ? Math.round((dogru / toplam) * 100) : 0;
      store.olay('oyun', { oyun: id, dogru, toplam, yuzde });
      const kayit = store.al().oyunlar[id] || { enIyi: 0, oynama: 0 };
      store.al().oyunlar[id] = { enIyi: Math.max(kayit.enIyi, yuzde), oynama: kayit.oynama + 1 };
      store.kaydetHemen();
    },
  });
}

export function disOturumu(id) {
  const u = icerik.ic().disUygulamalar.find((x) => x.id === id);
  if (!u) { bildir('Uygulama bulunamadı'); location.replace('#/oyunlar'); return; }
  oynat({ id: 'dis:' + id, baslik: u.ad, iz: 'dis', sayfalar: [{ t: 'dis', id: 'dis:' + id, adim: { gorev: u.gorev || 'Uygulamada kısa bir oturum yap, sonra sonucu yaz.' }, uygulama: u }], ctx: ctxOlustur(), donus: '#/oyunlar', dersMi: false, bitisEtiketi: 'Tamam', hedef: 'Sonucun kaydedildi.' });
}
