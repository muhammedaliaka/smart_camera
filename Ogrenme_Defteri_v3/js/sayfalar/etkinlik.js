// Etkinlik sayfaları: spor kartları ve dış uygulama (Voscreen, Busuu vb.) sonuç girişi.

import { h, simge, karistir, tohumlu, yazidanTohum } from '../ui.js';
import * as ses from '../ses.js';
import * as store from '../store.js';
import { zengin, p } from './ortak.js';

function sayac(baslangic, { min = 0, max = 99, adim = 1, birim = '' } = {}) {
  let v = baslangic;
  const deger = h('span.deger', String(v));
  const art = h('button.dugme.birincil', { type: 'button', 'aria-label': 'Artır' }, '+');
  const eks = h('button.dugme', { type: 'button', 'aria-label': 'Azalt' }, '−');
  const yaz = () => { deger.textContent = (Number.isInteger(v) ? v : v.toFixed(1)) + birim; };
  art.addEventListener('click', () => { v = Math.min(max, Math.round((v + adim) * 10) / 10); yaz(); });
  eks.addEventListener('click', () => { v = Math.max(min, Math.round((v - adim) * 10) / 10); yaz(); });
  yaz();
  const el = h('div.adim-sayac', eks, deger, art);
  el.deger = () => v;
  return el;
}

export const spor = (sayfa, api) => {
  const a = sayfa.adim;
  const sayaclar = {};
  const bolumler = a.bolumler.map((b, bi) => {
    if (b.tur === 'mesafe') {
      const s = sayac(0, { min: 0, max: 30, adim: 0.1, birim: ' km' });
      sayaclar['mesafe:' + b.ad] = s;
      return h('details.ac', { open: true }, h('summary', `🚶 ${b.ad}`),
        h('p', b.hedef), b.not ? h('p.alt-yazi', b.not) : null, h('div.alt-yazi', { style: 'text-align:center' }, 'Yaptığın mesafe (yaklaşık)'), s);
    }
    return h('details.ac', { open: bi === 0 }, h('summary', `${b.simge || '💪'} ${b.ad} · ${b.hedef || ''}`),
      b.not ? h('p.alt-yazi', b.not) : null,
      ...b.hareketler.map((m) => {
        const s = sayac(0, { min: 0, max: m.set || 5, adim: 1 });
        sayaclar['hareket:' + m.id] = s;
        return h('div.kart.duz.hareket-kart', { style: 'margin-top:10px' },
          m.gorsel ? h('img', { src: m.gorsel, alt: m.ad, loading: 'lazy', style: 'width:100%;max-height:180px;object-fit:contain;border-radius:14px;background:var(--yuzey-2)' }) : null,
          h('h3', { style: 'margin:0' }, m.ad), h('div.rozet', m.birim ? `${m.set || 1} ${m.birim}` : `${m.set || 1} set × ${m.tekrar || ''}`),
          h('ol.liste-duz', m.adimlar.map((x) => { const li = h('li'); li.append(zengin(x)); return li; })),
          m.uyari ? h('div.ipucu', m.uyari) : null,
          h('div.alt-yazi', { style: 'text-align:center' }, `Tamamladığın ${m.birim || 'set'}`), s);
      }));
  });
  let zorlanma = null, destek = false;
  const zorSatir = h('div.esnek', { style: 'margin:8px 0' });
  for (let i = 0; i <= 10; i++) { const d = h('button.cip', { type: 'button', 'aria-pressed': 'false', style: 'min-width:44px' }, String(i)); d.addEventListener('click', () => { zorlanma = i; zorSatir.querySelectorAll('.cip').forEach((x, j) => x.setAttribute('aria-pressed', String(j === i))); }); zorSatir.append(d); }
  const destekCb = h('input', { type: 'checkbox' }); destekCb.addEventListener('change', () => { destek = destekCb.checked; });
  const notAlani = h('input.girdi', { type: 'text', placeholder: 'İstersen kısa not (ağrı, yorgunluk, uyku…)', 'aria-label': 'Not' });
  const kaydet = (kismi) => {
    const olcu = {};
    for (const [k, s] of Object.entries(sayaclar)) olcu[k] = s.deger();
    // Okunur özet: hareket adı, yapılan, hedef (olcu anahtarları "hareket:kimlik" gibi kısaltmalardır)
    const yapilanlar = [];
    for (const b of a.bolumler) {
      if (b.tur === 'mesafe') yapilanlar.push({ ad: b.ad, yapilan: olcu['mesafe:' + b.ad], birim: 'km', hedef: b.hedef || null });
      else for (const m of b.hareketler) yapilanlar.push({ ad: m.ad, yapilan: olcu['hareket:' + m.id], birim: m.birim || 'set', hedef: m.birim ? `${m.set || 1} ${m.birim}` : `${m.set || 1} set × ${m.tekrar || ''}`.trim() });
    }
    api.kaydet('spor', { olcu, yapilanlar, zorlanma, destek, kismi, not: notAlani.value.trim() || null }, { baslik: a.baslik });
    api.ilerle();
  };
  api.alt('Spor tamam — kaydet', () => kaydet(false), { ikincil: { etiket: 'Kısmen yaptım', fn: () => kaydet(true) } });
  return h('div',
    h('h2', { style: 'margin-top:12px' }, a.baslik),
    a.giris ? p(a.giris) : null,
    a.guvenlik ? h('div.ipucu', a.guvenlik) : null,
    ...bolumler,
    h('h3', { style: 'margin-top:18px' }, 'Nasıl geçti?'),
    h('p.alt-yazi', 'Zorlanma: 0 çok rahat, 10 çok zor. Puan değildir.'), zorSatir,
    h('label.onay-satir', destekCb, h('span', 'Destek (duvar, sandalye) kullandım')), notAlani,
  );
};

/** Hafıza kartları: çevir, İngilizce–Türkçe çiftleri bul. */
export const kartlar = (sayfa, api) => {
  const kartlar = karistir(sayfa.ciftler.flatMap((c) => [{ c, yuz: c.en, dil: 'en' }, { c, yuz: c.tr, dil: 'tr' }]), tohumlu(yazidanTohum(sayfa.id + Date.now())));
  let acik = [], hamle = 0, bulunan = 0, kilit = false;
  const sayacEl = h('span', 'Hamle: 0'), bulunanEl = h('span', `Bulunan: 0/${sayfa.ciftler.length}`);
  const dugmeler = kartlar.map((k, i) => {
    const d = h('button.kutu.kart-kapali', { type: 'button', 'aria-label': `Kart ${i + 1}, kapalı` }, '❓');
    d.addEventListener('click', () => {
      if (kilit || acik.includes(i) || d.classList.contains('eslesti')) return;
      d.classList.remove('kart-kapali'); d.textContent = k.yuz; d.setAttribute('aria-label', k.yuz);
      acik.push(i);
      if (k.dil === 'en') ses.cal({ metin: k.c.en, ses: api.ctx.sesler.varsayilan });
      if (acik.length === 2) {
        hamle++; sayacEl.textContent = `Hamle: ${hamle}`;
        const [a, b] = acik;
        if (kartlar[a].c.id === kartlar[b].c.id) {
          [a, b].forEach((x) => { dugmeler[x].classList.add('eslesti'); dugmeler[x].disabled = true; });
          acik = []; bulunan++; bulunanEl.textContent = `Bulunan: ${bulunan}/${sayfa.ciftler.length}`;
          if (bulunan === sayfa.ciftler.length) bitti();
        } else {
          kilit = true;
          setTimeout(() => { [a, b].forEach((x) => { dugmeler[x].classList.add('kart-kapali'); dugmeler[x].textContent = '❓'; dugmeler[x].setAttribute('aria-label', `Kart ${x + 1}, kapalı`); }); acik = []; kilit = false; }, 900);
        }
      }
    });
    return d;
  });
  const bitti = () => {
    const dogru = hamle <= sayfa.ciftler.length + 5;
    api.puanla({ dogru, yanit: `${hamle} hamle`, dogruCevap: sayfa.ciftler.map((c) => `${c.en} = ${c.tr}`).join('; '), soru: 'Hafıza kartları', tekrarYok: true });
    api.bildirim({ tip: dogru ? 'dogru' : 'bilgi', baslik: `${hamle} hamlede bitirdin`, metin: dogru ? 'Harika bir hafıza!' : 'Bir daha dene; kartların yerini aklında tutmaya çalış.' });
  };
  api.alt('Devam', () => api.ilerle(), { devre: true });
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum), h('div.soru-metni', 'Çiftleri bul'), h('p.soru-alt', 'İki karta dokun. İngilizce kelime ile Türkçe karşılığı aynı çiftse açık kalır.'),
    h('div.puan-seridi', sayacEl, bulunanEl), h('div.kutu-izgara.dort', dugmeler));
};

export const dis = (sayfa, api) => {
  const a = sayfa.adim;
  const u = sayfa.uygulama;
  const dogru = h('input.girdi', { type: 'number', min: 0, inputmode: 'numeric', 'aria-label': 'Doğru sayısı', placeholder: 'Doğru' });
  const toplam = h('input.girdi', { type: 'number', min: 1, inputmode: 'numeric', 'aria-label': 'Toplam soru', placeholder: 'Toplam' });
  const notAlani = h('input.girdi', { type: 'text', placeholder: 'İstersen not (kaçıncı ders, neyi zorlandın…)', 'aria-label': 'Not' });
  const kaydet = (yapilmadi = false) => {
    const d = dogru.value === '' ? null : +dogru.value, t = toplam.value === '' ? null : +toplam.value;
    api.kaydet('dis', { uygulama: u.id, ad: u.ad, gorev: a.gorev, dogru: d, toplam: t, yuzde: d != null && t ? Math.round((d / t) * 100) : null, yapilmadi, not: notAlani.value.trim() || null });
    if (!yapilmadi && d != null && t) api.dis(d, t);
    api.ilerle();
  };
  api.alt('Sonucu kaydet', () => kaydet(false), { ikincil: { etiket: 'Yapmadım', fn: () => kaydet(true) } });
  return h('div',
    h('div.iz-etiket', { style: 'margin-top:10px' }, 'Dış uygulama'),
    h('h2', `${u.simge || '📱'} ${u.ad}`),
    h('div.kart', h('h3', 'Bugünkü görev'), p(a.gorev), u.aciklama ? p(u.aciklama) : null,
      h('div.esnek', u.play ? h('a.dugme.birincil', { href: u.play, target: '_blank', rel: 'noopener' }, simge('dis'), 'Google Play') : null,
        u.ios ? h('a.dugme.cizgili', { href: u.ios, target: '_blank', rel: 'noopener' }, simge('dis'), 'App Store') : null,
        u.web ? h('a.dugme.cizgili', { href: u.web, target: '_blank', rel: 'noopener' }, simge('dis'), 'Web') : null)),
    h('div.kart.duz', h('h3', 'Bitirince sonucu gir'), h('p.alt-yazi', 'Uygulamanın bize veri vermesi mümkün değil; 10 saniyede kendin gir. Puan uygulamadaki sonucundur.'),
      h('div.satir', dogru, h('span', '/'), toplam), notAlani),
  );
};
