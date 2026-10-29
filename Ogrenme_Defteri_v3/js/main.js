// Uygulama girişi: ayarlar, içerik yükleme, yönlendirme ve alt menü.

import { h, simge, temizle, bildir } from './ui.js';
import * as store from './store.js';
import * as icerik from './icerik.js';
import * as oyuncu from './oyuncu.js';
import { bugun } from './zaman.js';
import { bugunGorunum } from './gorunum/bugun.js';
import { derslerGorunum, konuGorunum, dersGorunum } from './gorunum/dersler.js';
import { tekrarGorunum, tekrarOturumu, hatirlaOturumu, srsOzet } from './gorunum/tekrar.js';
import { oyunlarGorunum, oyunBaslat, disOturumu } from './gorunum/oyunlar.js';
import { benGorunum, ayarlariUygula } from './gorunum/ben.js';
import { sonrakiDers } from './gorunum/yardimci.js';

const KOK = document.getElementById('uygulama');
const MENU = [
  ['bugun', 'Bugün', 'bugun'], ['dersler', 'Dersler', 'dersler'], ['tekrar', 'Tekrar', 'tekrar'], ['oyunlar', 'Oyunlar', 'oyun'], ['ben', 'Ben', 'ben'],
];
let sayfaEl = null, menuEl = null;

function iskeleKur() {
  temizle(KOK);
  menuEl = h('nav.menu', { 'aria-label': 'Ana menü' },
    h('div.marka', simge('dersler'), 'Öğrenme Defteri'),
    MENU.map(([rota, ad, ikon]) => h('a', { href: `#/${rota}`, data: { rota } }, simge(ikon), h('span', ad), rota === 'tekrar' ? h('span.sayi', { hidden: true, id: 'tekrar-sayi' }) : null)));
  sayfaEl = h('main.sayfa#icerik', { tabindex: '-1' });
  KOK.append(h('a.atla', { href: '#icerik', onclick: (e) => { e.preventDefault(); sayfaEl.focus(); } }, 'İçeriğe geç'), h('div.uygulama', menuEl, sayfaEl));
}

function rozetGuncelle() {
  const n = srsOzet().vadesi + store.gecikmeliVadesi().length;
  const el = document.getElementById('tekrar-sayi');
  if (el) { el.hidden = !n; el.textContent = String(n); el.setAttribute('aria-label', `${n} tekrar bekliyor`); }
}

function rotaCoz() {
  const ham = (location.hash || '#/bugun').replace(/^#\/?/, '');
  const [yol, sorguMetni = ''] = ham.split('?');
  return { parcalar: yol.split('/').filter(Boolean).map(decodeURIComponent), sorgu: new URLSearchParams(sorguMetni) };
}

function goster(el, menuRota, genis = false) {
  temizle(sayfaEl);
  sayfaEl.classList.toggle('genis', genis);
  sayfaEl.append(el);
  menuEl.querySelectorAll('a').forEach((a) => { if (a.dataset.rota === menuRota) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  window.scrollTo(0, 0);
  rozetGuncelle();
}

function yonlendir() {
  const { parcalar, sorgu } = rotaCoz();
  const [ilk = 'bugun', ikinci, ucuncu] = parcalar;
  const oyunRotasi = ['oyna', 'oyun', 'hatirla', 'dis'].includes(ilk) || (ilk === 'tekrar' && ikinci === 'oturum');
  if (!oyunRotasi) oyuncu.kapat();
  try {
    if (!store.al().baslangic) { baslangicEkrani(); return; }
    if (!menuEl || !KOK.contains(menuEl)) iskeleKur();
    switch (ilk) {
      case 'bugun': goster(bugunGorunum(), 'bugun'); break;
      case 'dersler': goster(derslerGorunum(sorgu), 'dersler'); break;
      case 'konu': goster(konuGorunum(ikinci), 'dersler'); break;
      case 'ders': goster(dersGorunum(ikinci), 'dersler'); break;
      case 'tekrar':
        if (ikinci === 'oturum') { arkaPlan('tekrar', tekrarGorunum); tekrarOturumu(); } else goster(tekrarGorunum(), 'tekrar');
        break;
      case 'hatirla': arkaPlan('bugun', bugunGorunum); hatirlaOturumu(ikinci, ucuncu); break;
      case 'oyunlar': goster(oyunlarGorunum(), 'oyunlar'); break;
      case 'oyun': arkaPlan('oyunlar', oyunlarGorunum); oyunBaslat(ikinci); break;
      case 'dis': arkaPlan('oyunlar', oyunlarGorunum); disOturumu(ikinci); break;
      case 'ben': goster(benGorunum(sorgu), 'ben'); break;
      case 'oyna': {
        const d = icerik.ders(ikinci);
        arkaPlan('dersler', () => dersGorunum(ikinci));
        if (d) oyuncu.dersAc(ikinci, { donus: `#/ders/${ikinci}`, sonraki: () => sonrakiDers(ikinci) });
        else { bildir('Ders bulunamadı'); location.replace('#/dersler'); }
        break;
      }
      default: location.replace('#/bugun');
    }
  } catch (e) {
    console.error(e);
    temizle(KOK);
    KOK.append(h('div.baslangic', h('div.hata-kutu', h('strong', 'Bir şey ters gitti'), h('p', e.message)), h('a.dugme.birincil', { href: '#/bugun', onclick: () => location.reload() }, 'Yeniden dene')));
  }
}

/** Oyuncu açılırken arkada ilgili ekranı hazır tut (doğrudan bağlantı ya da geri tuşu için). */
function arkaPlan(menuRota, gorunum) {
  if (!sayfaEl || !sayfaEl.firstChild) goster(gorunum(), menuRota);
}

function baslangicEkrani() {
  temizle(KOK); menuEl = null; sayfaEl = null;
  const ad = h('input.girdi', { type: 'text', 'aria-label': 'Adın', placeholder: 'Adın (isteğe bağlı)', maxlength: 30, autocomplete: 'given-name' });
  const basla = () => {
    const d = store.al();
    d.ad = ad.value.trim(); d.baslangic = bugun();
    store.kaydetHemen();
    location.hash = '#/bugun';
    yonlendir();
  };
  ad.addEventListener('keydown', (e) => { if (e.key === 'Enter') basla(); });
  KOK.append(h('div.baslangic',
    h('div.buyuk-emoji', '📒'),
    h('h1', { style: 'text-align:center' }, 'Öğrenme Defteri'),
    h('p', { style: 'text-align:center;font-size:1.1rem' }, 'Her gün birkaç kısa görev: İngilizce, hafıza, okuma, dinleme ve spor. Ne kadar öğrendiğini sen de görürsün.'),
    h('ul.sade-liste', { style: 'margin:12px 0 18px' },
      h('li', '🎧 Dinle, anla, söyle'), h('li', '🔁 Öğrendiğin şeyler unutulmadan önce tekrar sorulur'), h('li', '📊 Her sonuç kaydedilir; ilerlemeni görürsün')),
    h('label.alan', 'Adın nedir?'), ad,
    h('button.dugme.birincil.tam', { type: 'button', style: 'margin-top:18px;min-height:56px;font-size:1.1rem', onclick: basla }, 'Başlayalım')));
}

function hataEkrani(e) {
  temizle(KOK);
  KOK.append(h('div.baslangic', h('div.buyuk-emoji', '😕'), h('h2', { style: 'text-align:center' }, 'İçerik yüklenemedi'), h('div.hata-kutu', e.message),
    h('p.alt-yazi', 'Uygulamayı bir web sunucusundan açmalısın (dosyaya çift tıklamak çalışmaz). Başlatma yolları için KULLANIM.md dosyasına bak.'),
    h('button.dugme.birincil.tam', { type: 'button', onclick: () => location.reload() }, 'Yeniden dene')));
}

async function basla() {
  store.yukle();
  ayarlariUygula();
  try { await icerik.yukle(); } catch (e) { hataEkrani(e); return; }
  window.addEventListener('hashchange', yonlendir);
  store.degisinceDinle(rozetGuncelle);
  setInterval(rozetGuncelle, 60000);
  yonlendir();
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !new URLSearchParams(location.search).has('sw0')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* çevrimdışı olmadan da çalışır */ });
  }
}
basla();
