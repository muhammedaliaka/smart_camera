// Serbest alan: park ya da çalışma alanında, yağmurlu havada bile çalışmak için. Gerçek mekânda hafıza sarayı, sesli tur, mekân avı.
// "Yalnızım" kipi sesli ve hareketlidir; "Sessiz" kipinde (yakında başkaları varsa) konuşma ve ses çalma gerekmez.

import { h, simge, bildir } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import * as ses from '../ses.js';
import { bugun } from '../zaman.js';
import { sayfaBasligi } from './yardimci.js';
import { sarayBul, sarayKaydet, sarayEditoru } from '../sayfalar/serbest.js';
import { YERLER, KIPLER, kelimeSec, avKelimeleri, turKaydi, artikelli } from '../alan.js';
import { seviyeDurumu } from '../seviye-ac.js';

const ayarlar = () => store.al().ayar;
const kip = () => (ayarlar().alanKip === 'sessiz' ? 'sessiz' : 'yalniz');
const yer = () => (YERLER[ayarlar().alanYer] ? ayarlar().alanYer : 'park');
const sesli = () => kip() === 'yalniz';

let durdurucu = null; // çalışan sesli tur varsa onu durdurur
export function alanDurdur() { durdurucu?.(); durdurucu = null; }

export function alanGorunum(alt) {
  alanDurdur();
  if (alt === 'saray') return saraySayfasi();
  if (alt === 'sesli') return sesliSayfasi();
  if (alt === 'av') return avSayfasi();
  return menuSayfasi();
}

function secenek(etiket, secimler, mevcut, degisti) {
  const kap = h('div.yardim-cip', { role: 'group', 'aria-label': etiket });
  for (const [k, ad] of secimler) {
    const c = h('button.cip', { type: 'button', 'aria-pressed': String(k === mevcut) }, ad);
    c.addEventListener('click', () => degisti(k));
    kap.append(c);
  }
  return h('div', h('label.alan', etiket), kap);
}
const yenile = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
const dakikaMetni = (sn) => (sn < 90 ? `${Math.round(sn)} sn` : `${Math.round(sn / 60)} dk`);
function kayit(etkinlik, veri) {
  store.olay('alan-tur', turKaydi({ etkinlik, yer: yer(), kip: kip(), ...veri }), { dersAd: `${{ saray: 'Mekân sarayı', sesli: 'Sesli tur', av: 'Mekân avı' }[etkinlik]} · ${YERLER[yer()].ad}` });
  store.kaydetHemen();
}
function ingilizceSesDugme(k, ek = '🔊 Dinle') {
  return h('button.dugme.cizgili', { type: 'button', onclick: () => ses.cal({ metin: k.en }) }, ek);
}
function hedefSv() { try { return seviyeDurumu().ingilizce?.sv ?? 1; } catch { return 1; } }
function kelimeler(n) {
  return kelimeSec({ srs: store.al().srs, kelimeler: icerik.ic().kelimeler, bugun: bugun(), hedefSv: hedefSv(), n });
}
const geri = h0 => h('a.dugme.cizgili', { href: '#/alan', style: 'margin-top:8px' }, h0 || '← Serbest alan');

// ---------------------------------------------------------------- menü
function menuSayfasi() {
  const kok = h('div', sayfaBasligi('🌳 Serbest alan', 'Park ya da çalışma alanında, yağmurlu havada bile'));
  kok.append(h('div.kart.duz',
    secenek('Şu an', Object.entries(KIPLER).map(([k, ad]) => [k, k === 'yalniz' ? '🗣️ Yalnızım' : '🤫 Sessiz']), kip(), (v) => { ayarlar().alanKip = v; store.kaydetHemen(); yenile(); }),
    h('p.alt-yazi', { style: 'margin:4px 0 10px' }, sesli() ? 'Yalnızsan: yüksek sesle söyle, yürü, sesli turu aç.' : 'Yakında başkaları varsa: her şeyi içinden yap; ses çalmaz, sesli tur kapalıdır.'),
    secenek('Nerede?', Object.entries(YERLER).map(([k, y]) => [k, `${y.emoji} ${y.ad}`]), yer(), (v) => { ayarlar().alanYer = v; store.kaydetHemen(); yenile(); })));
  const kart = (adres, emoji, ad, sure, aciklama, kapali) => h(kapali ? 'div.gorev' : 'a.gorev', { href: kapali ? null : adres, style: kapali ? 'opacity:.55' : null, data: { iz: 'hafiza' } },
    h('span.iz-simge', emoji), h('span.metin', h('span.baslik', ad), h('span.alt', `≈ ${sure} dk · ${kapali || aciklama}`)), kapali ? null : simge('ok'));
  kok.append(
    kart('#/alan/saray', '🏛️', 'Gerçek yerde hafıza sarayı', 8, 'rotanı yürü, 6 kelimeyi duraklara koy, sonra aynı yoldan hatırla'),
    kart('#/alan/av', '🔎', 'Mekân avı', 6, 'çevrendeki nesneleri bul ve İngilizcesini söyle'),
    kart('#/alan/sesli', '🎧', 'Sesli tur', 7, 'telefon cebinde: kelimeyi duy, anlamını söyle, cevabı duy', sesli() ? null : 'Sessiz kipte kapalı; “Yalnızım” seçilince açılır.'));
  kok.append(h('details.ac', h('summary', '☔ Yağmurda ya da soğukta'),
    h('p', 'Rotayı kısa tut: 4–5 durak yeter, çatı altı ya da sundurmalı yerleri seç. Hava çok kötüyse “Çalışma alanı”nı seç; aynı etkinlikler kapalı alanda da çalışır.'),
    h('p.alt-yazi', 'Telefonu su geçirmez bir poşette ya da cepte tut; sesli tur ekranı açmadan da çalışır (kulaklıkla).')));
  kok.append(h('p.alt-yazi', { style: 'margin-top:14px' }, 'Bu etkinliklerde “hatırladım” kendi bildirimindir; puan değil, hatırlama denemesidir. Hatırladığın yeni kelimeler Tekrar’a eklenir.'));
  return kok;
}

// ---------------------------------------------------------------- gerçek mekânda hafıza sarayı
function saraySayfasi() {
  const y = YERLER[yer()], kimlik = 'alan-' + yer();
  const kok = h('div', sayfaBasligi(`🏛️ ${y.ad} sarayı`, 'Rotanı yürü; kelimeleri durakların yanına “koy”'));
  const t0 = Date.now();
  let faz = sarayBul(kimlik) ? 'hazir' : 'kur', sira = [], i = 0, sonuc = [], gizli = true, eksikTur = false, ilk = null;

  const ciz = () => { kok.replaceChildren(sayfaBasligi(`🏛️ ${y.ad} sarayı`, 'Rotanı yürü; kelimeleri durakların yanına “koy”'), ...({ kur, hazir, yerlestir, geri: geriCagir, bitis })[faz]().flat(Infinity).filter(Boolean)); };

  function kur() {
    let editor;
    const kaydet = h('button.dugme.birincil.tam', { type: 'button', disabled: true, onclick: () => { sarayKaydet(kimlik, y.ad, editor.deger()); store.olay('saray', { rota: kimlik, duraklar: editor.deger() }, { ad: y.ad }); store.kaydetHemen(); faz = 'hazir'; ciz(); } }, 'Rotayı kaydet');
    editor = sarayEditoru({ min: 4, max: 8, oneriler: y.durakOnerileri }, { ayarla: (ok) => { kaydet.disabled = !ok; } }, sarayBul(kimlik)?.duraklar);
    return [h('p', `${y.ad} içinde bir tur at. Yürüme sırasına göre 4–8 belirgin nokta seç (ör. kapı, bank, büyük ağaç). Her seferinde aynı sırayla yürüyeceksin; sıra hafızanın iskeletidir.`),
      h('p.alt-yazi', 'Birbirine benzemeyen, kolay ayırt edilen noktalar seç. Yağmurlu günlerde çatı altı olanları öne al.'), editor, kaydet, geri()];
  }
  function hazir() {
    const s = sarayBul(kimlik);
    return [h('div.kart.duz', h('strong', `${s.ad} rotan`), h('ol', { style: 'margin:8px 0 0;padding-left:20px' }, s.duraklar.map((d) => h('li', d)))),
      h('p', sesli() ? 'Rotanın başına git. Her durakta duracak, kelimeyi yüksek sesle söyleyecek ve orada tuhaf bir sahne hayal edeceksin.' : 'Rotanın başına git. Her durakta duracak ve kelimeyi içinden söyleyerek orada tuhaf bir sahne hayal edeceksin.'),
      h('button.dugme.birincil.tam', { type: 'button', onclick: () => {
        const n = Math.min(6, s.duraklar.length);
        sira = kelimeler(n).map((k, j) => ({ k, durak: s.duraklar[j] }));
        if (sira.length < 3) { bildir('Yeterli kelime yok; önce birkaç ders bitir.', 4000); return; }
        i = 0; sonuc = []; faz = 'yerlestir'; ciz();
      } }, '▶ Yürüyerek başla'),
      h('button.dugme.cizgili.tam', { type: 'button', style: 'margin-top:8px', onclick: () => { faz = 'kur'; ciz(); } }, 'Rotayı değiştir'), geri()];
  }
  function yerlestir() {
    const { k, durak } = sira[i];
    return [h('div.kart.vurgulu', { style: 'text-align:center' },
      h('div.alt-yazi', { style: 'color:inherit' }, `Durak ${i + 1}/${sira.length}`), h('h2', { style: 'color:inherit;margin:4px 0' }, `📍 ${durak}`),
      h('div.buyuk-emoji', k.emoji || '💭'), h('h3', { style: 'color:inherit;margin:0' }, k.en), h('p', { style: 'margin:2px 0 10px' }, k.tr)),
      h('p', `${durak} noktasına git (ya da gözünün önüne getir). ${sesli() ? `“${k.en}” kelimesini yüksek sesle söyle.` : `“${k.en}” kelimesini içinden söyle.`} Sonra orada kocaman, komik, hareket eden bir “${k.tr}” hayal et: ses çıkarsın, renkli olsun.`),
      sesli() ? ingilizceSesDugme(k) : null,
      h('button.dugme.birincil.tam', { type: 'button', style: 'margin-top:10px', onclick: () => { i++; if (i >= sira.length) { i = 0; faz = 'geri'; gizli = true; ilk = null; } ciz(); } }, i + 1 >= sira.length ? 'Hayal ettim — hatırlama turuna geç' : 'Hayal ettim — sıradaki durak')];
  }
  function geriCagir() {
    const liste = eksikTur ? sira.filter((x) => sonuc.find((s) => s.id === x.k.id && !s.dogru)) : sira;
    const { k, durak } = liste[i];
    const cevapla = (dogru) => {
      if (!eksikTur) sonuc.push({ id: k.id, dogru }); // ilk denemenin sonucu kayda girer; canavar turu yalnız pekiştirir
      i++; gizli = true;
      if (i >= liste.length) {
        const yanlis = !eksikTur && sonuc.some((s) => !s.dogru);
        if (yanlis) { eksikTur = true; i = 0; } else { faz = 'bitis'; }
      }
      ciz();
    };
    return [h('div.kart.vurgulu', { style: 'text-align:center' },
      h('div.alt-yazi', { style: 'color:inherit' }, `${eksikTur ? '👾 Canavar turu · ' : ''}Durak ${i + 1}/${liste.length}`), h('h2', { style: 'color:inherit;margin:4px 0' }, `📍 ${durak}`),
      gizli ? h('p', { style: 'font-size:1.2rem' }, `${durak} noktasında ne vardı?`) : [h('div.buyuk-emoji', k.emoji || '💭'), h('h3', { style: 'color:inherit;margin:0' }, k.en), h('p', k.tr)]),
      gizli
        ? [h('p.alt-yazi', 'Önce kendin hatırla: sahneyi gözünün önüne getir. Sonra cevabı gör.'), h('button.dugme.birincil.tam', { type: 'button', onclick: () => { gizli = false; ciz(); if (sesli()) ses.cal({ metin: k.en }); } }, 'Cevabı göster')]
        : h('div.esnek', h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => cevapla(false) }, '✘ Hatırlayamadım'), h('button.dugme.birincil', { type: 'button', style: 'flex:1', onclick: () => cevapla(true) }, '✔ Hatırladım')),
      eksikTur ? h('p.alt-yazi', 'Canavar turu: unuttuklarını bir daha gör; sonuca ilk denemen yazılır.') : null];
  }
  function bitis() {
    const dogru = sonuc.filter((s) => s.dogru).length, eksik = sonuc.filter((s) => !s.dogru).map((s) => s.id);
    if (!ilk) {
      ilk = true;
      kayit('saray', { dogru, toplam: sonuc.length, sn: (Date.now() - t0) / 1000, eksikler: eksik });
      for (const s of sonuc) if (s.dogru) store.maddeEkle('k:' + s.id);
    }
    return [h('div.kart.vurgulu', { style: 'text-align:center' }, h('div.buyuk-emoji', dogru === sonuc.length ? '🏆' : '🌟'), h('h2', { style: 'color:inherit' }, `${dogru}/${sonuc.length} hatırladın`),
      h('p', 'İlk denemedeki sonuç. Süre: ' + dakikaMetni((Date.now() - t0) / 1000) + '. Hatırladığın yeni kelimeler Tekrar’a eklendi.')),
      eksik.length ? h('p.alt-yazi', `Unutulanlar: ${eksik.map((id) => icerik.kelime(id)?.en).join(', ')} — yarın aynı rotada bir kez daha yürü.`) : h('p.alt-yazi', 'Yarın aynı rotada kelimeleri değiştirip yeniden yürüyebilirsin; rota aynı kalır, sahneler yenilenir.'),
      h('a.dugme.birincil.tam', { href: '#/alan' }, 'Tamam')];
  }
  ciz();
  return kok;
}

// ---------------------------------------------------------------- mekân avı
function avSayfasi() {
  const y = YERLER[yer()];
  const liste = avKelimeleri({ yer: yer(), kelimeBul: icerik.kelime, n: 8 });
  const kok = h('div', sayfaBasligi(`🔎 Mekân avı · ${y.ad}`, 'Gördüğün nesnenin İngilizcesini söyle'));
  if (liste.length < 4) { kok.append(h('p', 'Bu yer için yeterli kelime yok.'), geri()); return kok; }
  const t0 = Date.now();
  let i = 0, faz = 'bul', bulunan = [];
  const ciz = () => {
    kok.replaceChildren(sayfaBasligi(`🔎 Mekân avı · ${y.ad}`, 'Gördüğün nesnenin İngilizcesini söyle'));
    if (i >= liste.length) {
      kayit('av', { dogru: bulunan.length, toplam: liste.length, sn: (Date.now() - t0) / 1000, eksikler: liste.filter((k) => !bulunan.includes(k.id)).map((k) => k.id) });
      kok.append(h('div.kart.vurgulu', { style: 'text-align:center' }, h('div.buyuk-emoji', bulunan.length === liste.length ? '🏆' : '🌟'), h('h2', { style: 'color:inherit' }, `${bulunan.length}/${liste.length} nesne buldun`), h('p', `Süre: ${dakikaMetni((Date.now() - t0) / 1000)}.`)), h('a.dugme.birincil.tam', { href: '#/alan' }, 'Tamam'));
      return;
    }
    const k = liste[i];
    const ilerle = (buldum) => { if (buldum) bulunan.push(k.id); i++; faz = 'bul'; ciz(); };
    kok.append(h('div.kart.vurgulu', { style: 'text-align:center' }, h('div.alt-yazi', { style: 'color:inherit' }, `${i + 1}/${liste.length}`),
      h('div.buyuk-emoji', k.emoji || '🔎'), h('h2', { style: 'color:inherit;margin:4px 0' }, faz === 'bul' ? `“${k.tr}” bul` : k.en),
      faz === 'bul' ? h('p', 'Çevrende bir tane bul, ona bak ve İngilizcesini ' + (sesli() ? 'yüksek sesle söyle.' : 'içinden söyle.')) : h('p', k.tr)));
    if (faz === 'bul') kok.append(h('button.dugme.birincil.tam', { type: 'button', onclick: () => { faz = 'cevap'; ciz(); if (sesli()) ses.cal({ metin: k.en }); } }, 'Buldum — cevabı göster'), h('button.dugme.cizgili.tam', { type: 'button', style: 'margin-top:8px', onclick: () => ilerle(false) }, 'Burada yok — geç'));
    else kok.append(h('p', `Şimdi cümleyi ${sesli() ? 'yüksek sesle' : 'içinden'} söyle: ${k.ornek?.en ? `“${k.ornek.en}”` : `“I see ${artikelli(k.en)}.”`}`),
      sesli() ? ingilizceSesDugme(k.ornek?.en ? { en: k.ornek.en } : k, '🔊 Cümleyi dinle') : null, h('button.dugme.birincil.tam', { type: 'button', style: 'margin-top:10px', onclick: () => ilerle(true) }, '✔ Söyledim — sıradaki'));
  };
  ciz();
  return kok;
}

// ---------------------------------------------------------------- sesli tur
function sesliSayfasi() {
  const kok = h('div', sayfaBasligi('🎧 Sesli tur', 'Telefon cebinde: duy, söyle, kontrol et'));
  if (!sesli()) { kok.append(h('p', 'Sesli tur “Yalnızım” kipinde çalışır.'), geri()); return kok; }
  const liste = kelimeler(8);
  if (liste.length < 3) { kok.append(h('p', 'Yeterli kelime yok; önce birkaç ders bitir.'), geri()); return kok; }
  const t0 = Date.now();
  let iptal = false, duraklat = false, atla = false, kilit = null, gorulen = 0;
  const durum = h('div.kart.vurgulu', { style: 'text-align:center;min-height:210px' });
  const ciz = (i, adim) => {
    const k = liste[i];
    durum.replaceChildren(h('div.alt-yazi', { style: 'color:inherit' }, `${i + 1}/${liste.length}`),
      adim === 'dinle' ? [h('div.buyuk-emoji', '🔊'), h('h2', { style: 'color:inherit' }, k.en)]
        : adim === 'dus' ? [h('div.buyuk-emoji', '💭'), h('h2', { style: 'color:inherit' }, k.en), h('p', 'Türkçesini söyle…')]
          : [h('div.buyuk-emoji', k.emoji || '✅'), h('h2', { style: 'color:inherit' }, k.en), h('p', { style: 'font-size:1.3rem' }, k.tr), k.ornek?.en ? h('p.alt-yazi', { style: 'color:inherit' }, k.ornek.en) : null]);
  };
  const bekle = async (ms) => { let gecen = 0; while (gecen < ms && !iptal && !atla) { await new Promise((r) => setTimeout(r, 100)); if (!duraklat) gecen += 100; } };
  const bitir = (tamam) => {
    iptal = true; ses.durdur(); kilit?.release?.().catch(() => {}); kilit = null; durdurucu = null;
    kok.replaceChildren(sayfaBasligi('🎧 Sesli tur', ''), h('div.kart.vurgulu', { style: 'text-align:center' }, h('div.buyuk-emoji', '🌟'), h('h2', { style: 'color:inherit' }, `${gorulen} kelime dinledin`), h('p', `Süre: ${dakikaMetni((Date.now() - t0) / 1000)}. Her kelimede önce kendin hatırlamaya çalıştın; bu hatırlama denemesidir, puan değildir.`)), h('a.dugme.birincil.tam', { href: '#/alan' }, 'Tamam'));
    if (gorulen) kayit('sesli', { dogru: gorulen, toplam: liste.length, sn: (Date.now() - t0) / 1000 });
    return tamam;
  };
  durdurucu = () => { iptal = true; ses.durdur(); kilit?.release?.().catch(() => {}); kilit = null; };
  const baslat = async () => {
    try { kilit = await navigator.wakeLock?.request('screen'); } catch { kilit = null; }
    for (let i = 0; i < liste.length && !iptal; i++) {
      const k = liste[i]; atla = false;
      ciz(i, 'dinle'); await ses.cal({ metin: k.en });
      if (iptal) return; if (atla) { gorulen++; continue; }
      ciz(i, 'dus'); await bekle(4500);
      if (iptal) return;
      ciz(i, 'cevap'); if (!atla) await ses.cal({ metin: k.tr, dil: 'tr-TR' });
      if (!iptal && !atla && k.ornek?.en) { await bekle(500); await ses.cal({ metin: k.ornek.en }); }
      gorulen++;
      await bekle(1200);
    }
    if (!iptal) bitir(true);
  };
  const kontrol = h('div.esnek', { style: 'margin-top:10px' },
    h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: (e) => { duraklat = !duraklat; e.currentTarget.textContent = duraklat ? '▶ Sürdür' : '⏸ Duraklat'; } }, '⏸ Duraklat'),
    h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => { atla = true; ses.durdur(); } }, '⏭ Atla'),
    h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => bitir(false) }, '✕ Bitir'));
  kok.append(h('p', 'Kulaklığını tak, telefonu cebine koy ya da elinde tut. Ekran açık kalır. Her kelimede: İngilizcesini duyarsın, 4–5 saniye Türkçesini söylemeye çalışırsın, sonra cevabı duyarsın.'),
    h('button.dugme.birincil.tam', { type: 'button', id: 'sesli-basla', onclick: (e) => { e.currentTarget.replaceWith(durum, kontrol); baslat(); } }, '▶ Turu başlat'), geri());
  window.addEventListener('hashchange', alanDurdur, { once: true });
  return kok;
}
