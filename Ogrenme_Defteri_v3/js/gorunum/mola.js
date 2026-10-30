// Mola: ekrandan kalkıp 2 dakika hareket etmek. Odak süresi dolunca "sıradaki" düğmesi buraya getirir; spor yapıldıysa gerekmez.

import { h } from '../ui.js';
import * as store from '../store.js';
import { bugun } from '../zaman.js';
import { sonrakiGorev } from '../seviye-ac.js';

const ADIMLAR = [
  ['🧍', 'Ayağa kalk', 'Omuzlarını geriye doğru on kez çevir; boynunu yavaşça iki yana gevşet.'],
  ['👀', 'Uzağa bak', 'Pencereden ya da odanın en uzak köşesine bak. Gözlerin yakından dinlensin.'],
  ['💧', 'Su iç, nefes al', 'Bir yudum su iç. Bir kez derin nefes al, yavaşça ver.'],
  ['🤸', 'Gevşe', 'Ellerini ve bileklerini silkele; birkaç adım yürü ya da yerinde parmak uçlarında yüksel.'],
];
const SURE_SN = 30; // adım başına

export function molaGorunum() {
  let i = 0, kalan = SURE_SN, saat = null;
  const kok = h('div.mola');
  const ciz = () => {
    kok.replaceChildren();
    if (i >= ADIMLAR.length) {
      const d = store.al(); d.notlar['mola:' + bugun()] = true; store.kaydetHemen();
      const sonra = sonrakiGorev(null);
      kok.append(h('div.kart.vurgulu', h('div.buyuk-emoji', '✨'), h('h2', 'Mola tamam'), h('p', 'Zihnin biraz dinlendi. Hazır olunca devam edelim.')),
        sonra ? h('a.dugme.birincil.tam', { href: sonra.href }, sonra.etiket) : h('a.dugme.birincil.tam', { href: '#/bugun' }, 'Bugün sayfasına dön'));
      return;
    }
    const [emoji, baslik, metin] = ADIMLAR[i];
    kok.append(h('div.kart.vurgulu', { style: 'text-align:center' },
      h('div.alt-yazi', { style: 'color:inherit' }, `Mola · ${i + 1}/${ADIMLAR.length}`),
      h('div.buyuk-emoji', emoji), h('h2', { style: 'color:inherit' }, baslik), h('p', metin),
      h('div', { style: 'font-size:2rem;font-weight:700', 'aria-live': 'off' }, `${kalan} sn`)),
    h('div.esnek',
      h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => { durdur(); i = ADIMLAR.length; ciz(); } }, 'Molayı atla'),
      h('button.dugme.birincil', { type: 'button', style: 'flex:1', onclick: () => { i++; kalan = SURE_SN; ciz(); } }, 'Sonraki')));
  };
  const durdur = () => { if (saat) { clearInterval(saat); saat = null; } };
  saat = setInterval(() => {
    if (!kok.isConnected) { durdur(); return; }
    if (i >= ADIMLAR.length) { durdur(); return; }
    kalan--;
    if (kalan <= 0) { i++; kalan = SURE_SN; ciz(); } else {
      const sayac = kok.querySelector('div[aria-live="off"]'); if (sayac) sayac.textContent = `${kalan} sn`;
    }
  }, 1000);
  ciz();
  return h('div', h('div.ust', h('div', h('h1', 'Kısa mola'), h('p.alt-yazi', { style: 'margin:2px 0 0' }, 'Dinlenen zihin daha iyi hatırlar'))), kok);
}
