// Dersler: program (hafta → gün → ders), konular ve ders kapağı.

import { h, simge } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import { IZLER } from '../paket.js';
import { derle } from '../derle.js';
import { ctxOlustur } from '../oyuncu.js';
import { programGunu, gorevSatiri, dersOzeti, dersDurumMetni, sayfaBasligi, bosKutu } from './yardimci.js';
import { kisaTarih } from '../zaman.js';

export function derslerGorunum(sorgu) {
  const sekme = sorgu.get('s') || 'program';
  const kok = h('div', sayfaBasligi('Dersler', 'Programın ve tüm konular'));
  kok.append(sekmeler([['program', 'Program'], ['konular', 'Konulara göre']], sekme, (s) => `#/dersler?s=${s}`));
  kok.append(sekme === 'konular' ? konularListesi() : programListesi());
  return kok;
}

function sekmeler(liste, secili, href) {
  return h('div.sekmeler.esit', { role: 'tablist' }, liste.map(([k, ad]) => h('a.sekme', { href: href(k), role: 'tab', 'aria-selected': String(k === secili) }, ad)));
}

function programListesi() {
  const idx = icerik.idx();
  const ic = icerik.ic();
  const pg = programGunu();
  const kok = h('div');
  if (!ic.haftalar.length) return bosKutu('📦', 'Program yok', 'İçerik paketi yüklenince haftalar burada listelenir.');
  for (const hf of ic.haftalar) {
    const mevcutHafta = pg.durum === 'surer' && pg.gun?.hafta === hf.hafta;
    const kap = h('section');
    kap.append(h('div.hafta-baslik', `Hafta ${hf.hafta}${hf.baslik ? ' · ' + hf.baslik : ''}`));
    for (const g of hf.gunler) {
      const zorunlu = (g.gorevler || []).filter((t) => !t.istege);
      const biten = zorunlu.filter((t) => store.dersBitti(t.ders)).length;
      const bugunMu = pg.durum === 'surer' && pg.no === g.gun;
      const d = h('details.ac', { open: bugunMu || null });
      const durum = zorunlu.length && biten === zorunlu.length ? '✅' : bugunMu ? '📍' : '';
      d.append(h('summary', h('span', { style: 'flex:1' }, `${durum ? durum + ' ' : ''}Gün ${g.gun} · ${g.baslik || ''}`), h('span.rozet', `${biten}/${zorunlu.length}`)));
      if (g.hedef) d.append(h('p.alt-yazi', '🎯 ' + g.hedef));
      for (const t of g.gorevler || []) { const s = gorevSatiri(t.ders, { istege: t.istege }); if (s) d.append(s); }
      kap.append(d);
    }
    kok.append(kap);
  }
  return kok;
}

function konularListesi() {
  const ic = icerik.ic();
  const kok = h('div.izgara.iki');
  for (const [iz, bilgi] of Object.entries(IZLER)) {
    const dersler = ic.dersler.filter((d) => d.iz === iz);
    if (!dersler.length) continue;
    const biten = dersler.filter((d) => store.dersBitti(d.id)).length;
    kok.append(h('a.iz-kart', { href: `#/konu/${iz}`, data: { iz } },
      h('span.iz-simge', bilgi.simge),
      h('div', h('h3', bilgi.ad), h('p', bilgi.aciklama), h('p', { style: 'font-weight:700;margin-top:6px' }, `${biten}/${dersler.length} ders tamam`))));
  }
  if (!kok.children.length) return bosKutu('📦', 'Henüz ders yok');
  return kok;
}

export function konuGorunum(iz) {
  const bilgi = IZLER[iz];
  if (!bilgi) return bosKutu('🤷', 'Böyle bir konu yok', null, h('a.dugme.birincil', { href: '#/dersler?s=konular' }, 'Konulara dön'));
  const dersler = icerik.ic().dersler.filter((d) => d.iz === iz);
  const idx = icerik.idx();
  const kok = h('div', { data: { iz } },
    h('a.dugme.hayalet', { href: '#/dersler?s=konular', style: 'margin-left:-12px' }, simge('geri'), 'Konular'),
    sayfaBasligi(`${bilgi.simge} ${bilgi.ad}`, bilgi.aciklama));
  const sirali = dersler.slice().sort((a, b) => (idx.dersGunu.get(a.id) ?? 9999) - (idx.dersGunu.get(b.id) ?? 9999));
  for (const d of sirali) { const gun = idx.dersGunu.get(d.id); const s = gorevSatiri(d.id, { ek: gun ? `Gün ${gun}` : null }); if (s) kok.append(s); }
  return kok;
}

/** Ders kapağı: ne öğrenilecek, neden, nasıl; Başla düğmesi ve geçmiş. */
export function dersGorunum(id) {
  const d = icerik.ders(id);
  if (!d) return bosKutu('🤷', 'Ders bulunamadı', id, h('a.dugme.birincil', { href: '#/dersler' }, 'Derslere dön'));
  const bilgi = IZLER[d.iz] || { ad: d.iz, simge: '•' };
  const dd = store.dersDurumu(id);
  const devam = store.al().notlar['devam:' + id];
  const { liste } = dersOzeti(d);
  const gun = icerik.idx().dersGunu.get(id);
  const sayfaSayisi = derle(d, ctxOlustur(dd?.deneme || 0)).sayfalar.length;
  const bas = devam?.i > 0 ? 'Kaldığın yerden devam et' : dd?.bitti ? 'Dersi yeniden çöz' : 'Başla';

  const kok = h('div', { data: { iz: d.iz } },
    h('a.dugme.hayalet', { href: gun ? '#/dersler' : `#/konu/${d.iz}`, style: 'margin-left:-12px' }, simge('geri'), 'Dersler'),
    h('div.iz-etiket', `${bilgi.simge} ${bilgi.ad}${gun ? ' · Gün ' + gun : ''}`),
    h('h1', { style: 'margin:4px 0 12px' }, d.baslik),
    h('div.kart', h('h3', '🎯 Bu dersin sonunda'), h('p', { style: 'margin:0' }, d.hedef || 'Hedef belirtilmemiş.')),
    d.neden ? h('div.kart.duz', h('h3', 'Neden bu ders?'), h('p', { style: 'margin:0' }, d.neden)) : null,
    liste.length ? h('div.kart.duz', h('h3', 'Derste neler var?'), h('ul.liste-duz', liste.map((x) => h('li', x))), h('p.alt-yazi', { style: 'margin:0' }, `${sayfaSayisi} ekran · istediğin yerde çıkabilirsin, kaldığın yer saklanır.`)) : null,
    dd?.bitti ? h('div.kart.duz', h('strong', `Son sonucun: ${dd.toplam ? `${dd.dogru}/${dd.toplam} (%${dd.yuzde})` : 'tamamlandı'}`), h('div.alt-yazi', `${dd.deneme} kez bitirdin · son: ${kisaTarih(dd.son)}${dd.enIyi != null ? ' · en iyi %' + dd.enIyi : ''}`)) : null,
    h('a.dugme.birincil.tam', { href: `#/oyna/${id}`, style: 'min-height:56px;font-size:1.1rem' }, simge('cal'), bas),
    devam?.i > 0 ? h('button.dugme.cizgili.tam', { type: 'button', style: 'margin-top:10px', onclick: () => { delete store.al().notlar['devam:' + id]; store.kaydetHemen(); location.hash = `#/oyna/${id}`; if (location.hash === `#/oyna/${id}`) window.dispatchEvent(new HashChangeEvent('hashchange')); } }, 'Baştan başla') : null,
  );
  return kok;
}
