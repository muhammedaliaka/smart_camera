// Değerlendirilen sayfalar: çoktan seçmeli, yazma, eşleştirme, cümle kurma, dikte, sayı dinleme.

import { h, simge, bildir } from '../ui.js';
import { karsilastir, sozcukFarki, sayiEn } from '../metin.js';
import * as ses from '../ses.js';
import { zengin, sesDugme, kucukSes, secenekDugmesi } from './ortak.js';

function soruBasi(sayfa) {
  const e = h('div');
  if (sayfa.bolum) e.append(h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum));
  if (sayfa.emoji) e.append(h('div.buyuk-emoji', sayfa.emoji));
  if (sayfa.buyuk) { const w = h('div.buyuk-kelime', sayfa.soru); e.append(w); }
  else { const s = h('div.soru-metni'); s.append(zengin(sayfa.soru)); e.append(s); }
  if (sayfa.ses) e.append(h('div', { style: 'margin:6px 0 4px;text-align:' + (sayfa.buyuk ? 'center' : 'left') }, sesDugme(sayfa.ses, { etiket: 'Dinle', otomatik: sayfa.otoCal })));
  return e;
}

export const mcq = (sayfa, api) => {
  let secili = null, kilitli = false;
  const kap = h('div.secenekler' + (sayfa.kare ? '.kare' : ''));
  const dugmeler = sayfa.secenekler.map((o, i) => {
    const d = secenekDugmesi(o.m, { emoji: o.emoji, harf: 'ABCDEF'[i], kare: sayfa.kare });
    d.addEventListener('click', () => {
      if (kilitli) return;
      secili = i; dugmeler.forEach((x, j) => x.setAttribute('aria-pressed', String(i === j)));
      api.alt('Kontrol et', kontrol);
    });
    kap.append(d); return d;
  });
  const kontrol = () => {
    if (secili == null || kilitli) return;
    kilitli = true;
    const dogru = secili === sayfa.dogru;
    dugmeler.forEach((d, i) => { d.disabled = true; if (i === sayfa.dogru) d.classList.add('dogru'); else if (i === secili) d.classList.add('yanlis'); });
    const dogruCevap = sayfa.secenekler[sayfa.dogru].m;
    api.puanla({ dogru, yanit: sayfa.secenekler[secili].m, dogruCevap, soru: sayfa.soru, baglam: { duyulan: sayfa.ses?.metin && sayfa.ses.metin !== sayfa.soru ? sayfa.ses.metin : null, secenekler: sayfa.secenekler.map((o) => o.m) } });
    api.bildirim({ tip: dogru ? 'dogru' : 'yanlis', baslik: dogru ? 'Doğru!' : 'Doğrusu:', metin: dogru ? (sayfa.aciklama || '') : `${dogruCevap}${sayfa.aciklama ? ' — ' + sayfa.aciklama : ''}` });
  };
  api.alt('Kontrol et', kontrol, { devre: true });
  return h('div', soruBasi(sayfa), sayfa.metinBak ? h('details.ac', h('summary', '📖 Metne bak'), h('div.metin-blok', sayfa.metinBak.map((m) => h('p', m)))) : null, kap);
};

export const yaz = (sayfa, api) => {
  const tr = sayfa.dil === 'tr';
  const girdi = h('input.girdi', { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', lang: tr ? 'tr' : 'en', 'aria-label': 'Yanıtın', placeholder: tr ? 'Türkçe yaz' : 'İngilizce yaz' });
  let kilitli = false;
  const kontrol = (bilmiyorum = false) => {
    if (kilitli) return;
    const y = bilmiyorum ? '' : girdi.value;
    if (!bilmiyorum && !y.trim()) return;
    kilitli = true; girdi.disabled = true;
    const r = bilmiyorum ? { durum: 'yok', eslesen: sayfa.kabul[0] } : karsilastir(y, sayfa.kabul, { tr });
    const dogru = r.durum !== 'yok';
    girdi.classList.add(dogru ? 'dogru' : 'yanlis');
    api.puanla({ dogru, yanit: y || 'bilmiyorum', dogruCevap: sayfa.kabul[0], soru: sayfa.soru });
    let metin = sayfa.aciklama || '';
    if (r.durum === 'yakin') metin = `Küçük bir yazım farkı: doğrusu "${r.eslesen}". ${metin}`;
    if (!dogru) metin = `${sayfa.kabul[0]}${metin ? ' — ' + metin : ''}`;
    api.bildirim({ tip: dogru ? 'dogru' : 'yanlis', baslik: dogru ? (r.durum === 'yakin' ? 'Doğru sayıldı' : 'Doğru!') : 'Doğrusu:', metin });
    if (sayfa.ses) ses.cal(sayfa.ses);
  };
  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter') kontrol(); });
  girdi.addEventListener('input', () => api.alt('Kontrol et', () => kontrol(), { devre: !girdi.value.trim(), ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } }));
  api.alt('Kontrol et', () => kontrol(), { devre: true, ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } });
  setTimeout(() => girdi.focus({ preventScroll: true }), 150);
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum), h('div.soru-alt', { style: 'margin-top:10px' }, 'İngilizcesini yaz'),
    sayfa.emoji ? h('div.buyuk-emoji', sayfa.emoji) : null, h('div.buyuk-kelime', sayfa.soru), girdi);
};

export const eslestir = (sayfa, api) => {
  const cift = Object.fromEntries(sayfa.ciftler.map((c) => [c.id, c]));
  let solSecili = null, sagSecili = null, hata = 0, eslesen = 0;
  const solEl = new Map(), sagEl = new Map();
  const deneme = () => {
    if (solSecili == null || sagSecili == null) return;
    if (solSecili === sagSecili) {
      [solEl.get(solSecili), sagEl.get(sagSecili)].forEach((e) => { e.classList.add('eslesti'); e.disabled = true; e.setAttribute('aria-pressed', 'false'); });
      eslesen++;
      ses.cal({ metin: cift[solSecili].en, ses: api.ctx.sesler.varsayilan });
      if (eslesen === sayfa.ciftler.length) bitti();
    } else {
      hata++;
      const a = solEl.get(solSecili), b = sagEl.get(sagSecili);
      [a, b].forEach((e) => { e.classList.add('hata'); setTimeout(() => e.classList.remove('hata'), 400); e.setAttribute('aria-pressed', 'false'); });
    }
    solSecili = sagSecili = null;
  };
  const kutu = (metin, id, taraf) => {
    const d = h('button.kutu', { type: 'button', 'aria-pressed': 'false' }, metin);
    d.addEventListener('click', () => {
      if (taraf === 'sol') { if (solSecili != null) solEl.get(solSecili).setAttribute('aria-pressed', 'false'); solSecili = id; }
      else { if (sagSecili != null) sagEl.get(sagSecili).setAttribute('aria-pressed', 'false'); sagSecili = id; }
      d.setAttribute('aria-pressed', 'true');
      if (taraf === 'sol') ses.cal({ metin: cift[id].en, ses: api.ctx.sesler.varsayilan });
      deneme();
    });
    (taraf === 'sol' ? solEl : sagEl).set(id, d);
    return d;
  };
  const bitti = () => {
    const dogru = hata <= 1;
    api.puanla({ dogru, yanit: `${hata} yanlış deneme`, dogruCevap: sayfa.ciftler.map((c) => `${c.en} = ${c.tr}`).join('; '), soru: 'Eşleştirme', tekrarYok: true });
    api.bildirim({ tip: dogru ? 'dogru' : 'bilgi', baslik: hata === 0 ? 'Hepsi eşleşti!' : `Eşleşti — ${hata} yanlış deneme`, metin: '' });
  };
  api.alt('Devam', () => api.ilerle(), { devre: true });
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum), h('div.soru-metni', 'Eşleri bul'), h('p.soru-alt', 'Önce İngilizceye, sonra Türkçe karşılığına dokun.'),
    h('div.kutu-izgara', { style: 'grid-template-columns:1fr 1fr;gap:10px 14px' },
      ...sayfa.sol.flatMap((id, i) => [kutu((cift[id].emoji ? cift[id].emoji + ' ' : '') + cift[id].en, id, 'sol'), kutu(cift[sayfa.sag[i]].tr, sayfa.sag[i], 'sag')])));
};

export const cumle = (sayfa, api) => {
  const secilen = [];
  let kilitli = false;
  const cevapAlani = h('div', { style: 'min-height:64px;border-bottom:2px solid var(--cizgi);padding:6px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start' });
  const havuz = h('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;margin-top:18px' });
  const dugmeler = new Map();
  const yenile = () => {
    cevapAlani.replaceChildren(...secilen.map((x) => { const d = h('button.cip', { type: 'button', style: 'font-size:1.05rem' }, x.m); d.addEventListener('click', () => { if (kilitli) return; secilen.splice(secilen.indexOf(x), 1); dugmeler.get(x.i).hidden = false; yenile(); }); return d; }));
    api.alt('Kontrol et', kontrol, { devre: secilen.length === 0 });
  };
  sayfa.kutular.forEach((x) => {
    const d = h('button.cip', { type: 'button', style: 'font-size:1.05rem;min-height:46px' }, x.m);
    d.addEventListener('click', () => { if (kilitli) return; secilen.push(x); d.hidden = true; yenile(); });
    dugmeler.set(x.i, d); havuz.append(d);
  });
  const kontrol = () => {
    if (kilitli || !secilen.length) return;
    kilitli = true;
    const yanit = secilen.map((x) => x.m).join(' ');
    const r = karsilastir(yanit, [sayfa.en.replace(/[.!?]+$/, '')]);
    const dogru = r.durum !== 'yok';
    api.puanla({ dogru, yanit, dogruCevap: sayfa.en, soru: sayfa.tr });
    api.bildirim({ tip: dogru ? 'dogru' : 'yanlis', baslik: dogru ? 'Doğru!' : 'Doğrusu:', metin: sayfa.en });
    ses.cal({ metin: sayfa.en, ses: api.ctx.sesler.varsayilan });
  };
  api.alt('Kontrol et', kontrol, { devre: true });
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum), h('div.soru-alt', { style: 'margin-top:10px' }, 'İngilizcesini kur'), h('div.soru-metni', sayfa.tr), cevapAlani, havuz);
};

function farkGoster(yanit, beklenen, tr) {
  const f = sozcukFarki(yanit, beklenen, { tr });
  return h('div', { style: 'font-size:1.05rem;line-height:1.9' }, ...f.parcalar.map((x) => h('span', { style: x.d === 'var' ? 'color:var(--dogru);font-weight:700;margin-right:6px' : x.d === 'eksik' ? 'color:var(--yanlis);font-weight:700;text-decoration:underline;margin-right:6px' : 'color:var(--yazi-2);text-decoration:line-through;margin-right:6px' }, x.s)));
}

export const dikte = (sayfa, api) => {
  const tr = sayfa.dil === 'tr';
  const girdi = h('input.girdi', { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', lang: tr ? 'tr' : 'en', 'aria-label': 'Duyduğunu yaz', placeholder: 'Duyduğunu yaz' });
  let kilitli = false;
  let calma = 0;
  const kontrol = (bilmiyorum = false) => {
    if (kilitli) return;
    if (!bilmiyorum && !girdi.value.trim()) return;
    kilitli = true; girdi.disabled = true;
    const r = bilmiyorum ? { durum: 'yok' } : karsilastir(girdi.value, sayfa.kabul, { tr });
    const dogru = r.durum !== 'yok';
    girdi.classList.add(dogru ? 'dogru' : 'yanlis');
    const f = sozcukFarki(girdi.value, sayfa.metin, { tr });
    api.puanla({ dogru, yanit: girdi.value || 'bilmiyorum', dogruCevap: sayfa.metin, soru: 'Dikte ' + sayfa.no, tekrarYok: !!sayfa.sinir || sayfa.puan === false ? true : false, ayrinti: { sozcuk: `${f.var}/${f.toplam}`, calma }, baglam: { soru: `${sayfa.etiket || 'Duyduğunu yaz'} (dikte ${sayfa.no}/${sayfa.toplam})`, duyulan: sayfa.metin } });
    const govde = h('div', { style: 'color:var(--yazi)' }, h('div', { style: 'font-weight:700;margin-bottom:4px' }, sayfa.metin), dogru ? null : farkGoster(girdi.value, sayfa.metin, tr), h('p.alt-yazi', { style: 'margin:6px 0 0' }, `Sözcük eşleşmesi: ${f.var}/${f.toplam}`));
    api.bildirim({ tip: dogru ? 'dogru' : 'yanlis', baslik: dogru ? (r.durum === 'yakin' ? 'Doğru sayıldı' : 'Doğru!') : 'Bu kez şöyle yazılırdı:', govde });
  };
  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter') kontrol(); });
  girdi.addEventListener('input', () => api.alt('Kontrol et', () => kontrol(), { devre: !girdi.value.trim(), ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } }));
  api.alt('Kontrol et', () => kontrol(), { devre: true, ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } });
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, `${sayfa.bolum} · ${sayfa.no}/${sayfa.toplam}`), h('div.soru-metni', sayfa.etiket || 'Duyduğunu yaz'),
    h('p.soru-alt', 'Dinle ve duyduğun gibi yaz. İstediğin kadar tekrar dinleyebilirsin; kaç kez dinlediğin kaydedilir.'),
    h('div', { style: 'margin:8px 0 14px' }, sesDugme(sayfa.ses, { etiket: 'Dinle', sinir: sayfa.sinir || null, sayac: (n) => { calma = n; }, otomatik: !sayfa.sinir })),
    girdi);
};

export const sayi = (sayfa, api) => {
  const girdi = h('input.girdi', { type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'Duyduğun sayı', placeholder: 'Rakamla yaz', style: 'font-size:1.6rem;text-align:center' });
  let kilitli = false;
  const kontrol = (bilmiyorum = false) => {
    if (kilitli) return;
    if (!bilmiyorum && !girdi.value.trim()) return;
    kilitli = true; girdi.disabled = true;
    const r = bilmiyorum ? { durum: 'yok' } : karsilastir(girdi.value, [String(sayfa.sayi), sayiEn(sayfa.sayi)]);
    const dogru = r.durum === 'tam';
    girdi.classList.add(dogru ? 'dogru' : 'yanlis');
    api.puanla({ dogru, yanit: girdi.value || 'bilmiyorum', dogruCevap: String(sayfa.sayi), soru: 'Hangi sayıyı duydun?', baglam: { duyulan: sayiEn(sayfa.sayi) } });
    api.bildirim({ tip: dogru ? 'dogru' : 'yanlis', baslik: dogru ? 'Doğru!' : 'Doğrusu:', metin: `${sayfa.sayi} — ${sayiEn(sayfa.sayi)}` });
  };
  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter') kontrol(); });
  girdi.addEventListener('input', () => api.alt('Kontrol et', () => kontrol(), { devre: !girdi.value.trim(), ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } }));
  api.alt('Kontrol et', () => kontrol(), { devre: true, ikincil: { etiket: 'Bilmiyorum', fn: () => kontrol(true) } });
  return h('div', h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum), h('div.soru-metni', 'Hangi sayıyı duydun?'),
    h('div', { style: 'margin:8px 0 14px;text-align:center' }, sesDugme(sayfa.ses, { etiket: 'Dinle', otomatik: true })), girdi);
};
