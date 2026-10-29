// Sayfa türlerinin ortak parçaları.

import { h, simge, ekle } from '../ui.js';
import * as ses from '../ses.js';

/** **kalın** işaretli metni güvenle DOM'a çevirir. */
export function zengin(metin) {
  const parca = document.createDocumentFragment();
  String(metin ?? '').split(/(\*\*[^*]+\*\*)/g).forEach((p) => {
    if (!p) return;
    if (p.startsWith('**') && p.endsWith('**')) parca.append(h('strong', p.slice(2, -2)));
    else parca.append(document.createTextNode(p));
  });
  return parca;
}
export function p(metin, sinif) { const e = h('p', sinif ? { class: sinif } : null); e.append(zengin(metin)); return e; }

/**
 * Ses düğmesi. kaynak: { url } | { metin, ses, hiz }.
 * sinir verilirse en çok o kadar çalınır. sayac(n) her çalışta güncel sayıyı bildirir.
 */
export function sesDugme(kaynak, { etiket = 'Dinle', sinir = null, sayac = null, yavas = true, buyuk = false, otomatik = false } = {}) {
  let n = 0;
  const kap = h('div.esnek', { style: 'align-items:center' });
  const dugme = h('button.dugme.ses-dugme' + (buyuk ? '' : '.kucuk'), { type: 'button', 'aria-label': etiket }, simge('ses'), etiket);
  const yavasDugme = yavas ? h('button.dugme.cizgili.kucuk', { type: 'button', 'aria-label': 'Yavaş dinle', title: 'Yavaş dinle' }, '🐢 Yavaş') : null;
  const durumEl = h('span.alt-yazi', { 'aria-live': 'polite' });
  const guncelle = () => {
    if (sinir != null) {
      const kalan = sinir - n;
      durumEl.textContent = kalan > 0 ? `Dinleme hakkı: ${kalan}` : 'Dinleme hakkın bitti';
      if (kalan <= 0) { dugme.disabled = true; if (yavasDugme) yavasDugme.disabled = true; }
    } else if (n > 0) durumEl.textContent = `${n} kez dinledin`;
    sayac?.(n);
  };
  const cal = async (yavasMi) => {
    if (sinir != null && n >= sinir) return;
    n++; guncelle();
    dugme.classList.add('caliyor');
    await ses.cal(kaynak, { yavas: yavasMi });
    dugme.classList.remove('caliyor');
  };
  dugme.addEventListener('click', () => cal(false));
  yavasDugme?.addEventListener('click', () => cal(true));
  ekle(kap, [dugme, yavasDugme, durumEl]);
  guncelle();
  if (otomatik) setTimeout(() => { if (kap.isConnected) cal(false); }, 350);
  kap.say = () => n;
  kap.cal = cal;
  return kap;
}

export function kucukSes(kaynak, etiket = 'Dinle') {
  const d = h('button.dugme.ses-dugme.ikon-dugme', { type: 'button', 'aria-label': etiket, title: etiket, style: 'width:40px;height:40px' }, simge('ses'));
  d.addEventListener('click', async () => { d.classList.add('caliyor'); await ses.cal(kaynak); d.classList.remove('caliyor'); });
  return d;
}

/** Çoktan seçmeli seçenek listesi için ortak düğme. */
export function secenekDugmesi(metin, { emoji, harf, kare } = {}) {
  const d = h('button.secenek', { type: 'button', 'aria-pressed': 'false' });
  if (emoji) d.append(h('span.emoji', emoji));
  else if (harf && !kare) d.append(h('span.harf', harf));
  d.append(h('span', metin));
  return d;
}

export function etiketSatiri(bolum) {
  return bolum ? h('div.iz-etiket', { style: 'margin-top:4px' }, bolum) : null;
}
