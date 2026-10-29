// Bugün: bugünün hedefi, görevler, vadesi gelen tekrarlar ve geride kalanlar.

import { h, simge, halka, bildir } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import { bugun, gunEkle, uzunTarih, saatMetni } from '../zaman.js';
import { srsOzet } from './tekrar.js';
import { programGunu, gorevSatiri, bosKutu } from './yardimci.js';

export function bugunGorunum() {
  const d = store.al();
  const idx = icerik.idx();
  const pg = programGunu();
  const kok = h('div');
  const adi = d.ad ? `, ${d.ad}` : '';
  const seri = store.seri();

  kok.append(h('div.selam',
    h('h1', `Merhaba${adi} 👋`),
    h('p.alt-yazi', { style: 'margin:0' }, uzunTarih(bugun()), seri >= 2 ? ` · 🔥 ${seri} gün üst üste` : '')));

  if (pg.durum === 'baslamadi') {
    kok.append(h('div.kart', h('h2', 'Program henüz başlamadı'), h('p', `Başlangıç tarihin ${uzunTarih(d.baslangic)}. İstersen programı hemen şimdi başlatabilirsin.`),
      h('button.dugme.birincil', { type: 'button', onclick: () => { d.baslangic = bugun(); store.kaydetHemen(); bugunYenile(); } }, 'Programı bugün başlat')));
  } else if (pg.durum === 'programYok') {
    kok.append(bosKutu('📦', 'Henüz bir program yok', 'İçerik paketi yüklenince günlük görevlerin burada görünür. Ben → İçerik bölümünden paket ekleyebilirsin.'));
  } else if (pg.durum === 'bitti') {
    kok.append(h('div.kart.vurgulu', h('h2', '🎉 Programın sonuna geldin'), h('p', `${idx.enSonGun} günlük programı tamamladın. Şimdi Tekrar ve Oyunlar ile bilgileri taze tut; yeni haftalar eklemek için Ben → İçerik bölümüne bak.`)));
  } else {
    gunKarti(kok, pg, idx);
  }

  tekrarKartlari(kok);
  geridekiler(kok, pg, idx);

  if (!d.olaylar.length) {
    kok.append(h('div.kart.duz', h('h3', 'Nasıl çalışır?'), h('ol.liste-duz',
      h('li', 'Yukarıdaki görevlere dokun, ders açılır.'),
      h('li', 'Her ders kısa adımlardan oluşur: anlat → dinle → alıştır.'),
      h('li', 'Bildiklerin 3, 10, 20 ve 50 gün sonra Tekrar bölümünde karşına çıkar.'),
      h('li', 'Ne kadar öğrendiğini Ben bölümünde görürsün.'))));
  }
  return kok;
}

function bugunYenile() { window.dispatchEvent(new HashChangeEvent('hashchange')); }

function gunKarti(kok, pg, idx) {
  const gun = pg.gun;
  if (!gun) {
    kok.append(bosKutu('😴', 'Bugün dinlenme günü', 'Bu güne görev konmamış. İstersen Tekrar ya da Oyunlar bölümüne bakabilirsin.'));
    return;
  }
  const gorevler = gun.gorevler || [];
  const zorunlu = gorevler.filter((t) => !t.istege);
  const bitenZorunlu = zorunlu.filter((t) => store.dersBitti(t.ders)).length;
  const yuzde = zorunlu.length ? Math.round((bitenZorunlu / zorunlu.length) * 100) : 100;
  const tamam = zorunlu.length > 0 && bitenZorunlu === zorunlu.length;

  kok.append(h('div.kart.vurgulu',
    h('div.gunluk',
      halka(yuzde, `${bitenZorunlu}/${zorunlu.length}`, 72),
      h('div', h('div.alt-yazi', `Gün ${gun.gun} · Hafta ${gun.hafta}`), h('h2', { style: 'margin:2px 0 4px;color:inherit' }, gun.baslik || 'Bugünün programı'),
        gun.hedef ? h('div', { style: 'font-size:.95rem' }, '🎯 ', gun.hedef) : null)),
  ));
  if (tamam) kok.append(h('div.kart.duz', { style: 'background:var(--dogru-zemin);border-color:transparent;color:var(--dogru)' }, h('strong', '✅ Bugünkü görevlerin tamam. Eline sağlık!'), h('div.alt-yazi', { style: 'color:inherit' }, 'İstersen Tekrar, Oyunlar ya da isteğe bağlı görevlere bakabilirsin.')));

  kok.append(h('div.bolum-baslik', h('h2', 'Bugünün görevleri')));
  for (const t of gorevler) { const s = gorevSatiri(t.ders, { istege: t.istege }); if (s) kok.append(s); }
}

function tekrarKartlari(kok) {
  const oz = srsOzet();
  const gecikmeli = store.gecikmeliVadesi();
  const bekleyen = store.gecikmeliBekleyen().filter((x) => !gecikmeli.includes(x));
  if (!oz.vadesi && !gecikmeli.length && !bekleyen.length) return;
  kok.append(h('div.bolum-baslik', h('h2', 'Hatırlama zamanı')));
  for (const { g, k } of gecikmeli) {
    kok.append(h('a.gorev', { href: `#/hatirla/${g.id}/${k.ad}`, data: { iz: 'hafiza' } },
      h('span.iz-simge', '⏰'), h('span.metin', h('span.baslik', `Hatırlama kontrolü: ${g.baslik}`), h('span.alt', 'Bilgiye bakmadan yanıtla')), simge('ok')));
  }
  if (oz.vadesi) {
    kok.append(h('a.gorev', { href: '#/tekrar', data: { iz: 'ingilizce' } },
      h('span.iz-simge', '🔁'), h('span.metin', h('span.baslik', `${oz.vadesi} madde tekrar bekliyor`), h('span.alt', 'Kelimeler ve listeler · kısa oturum')), simge('ok')));
  }
  for (const { g, k } of bekleyen.slice(0, 2)) {
    kok.append(h('div.gorev', { style: 'opacity:.8', data: { iz: 'hafiza' } },
      h('span.iz-simge', '⏳'), h('span.metin', h('span.baslik', `Sıradaki kontrol: ${g.baslik}`), h('span.alt', `${saatMetni(new Date(k.vade).toISOString())} civarı · bilgiye bakma`))));
  }
}

function geridekiler(kok, pg, idx) {
  if (pg.durum !== 'surer' && pg.durum !== 'bitti') return;
  const kalan = [];
  for (const [no, g] of idx.gunler) {
    if (no >= pg.no) continue;
    for (const t of g.gorevler || []) if (!t.istege && !store.dersBitti(t.ders)) kalan.push({ no, ders: t.ders });
  }
  if (!kalan.length) return;
  const ilk = Math.min(...kalan.map((x) => x.no));
  const d = store.al();
  const kap = h('details.ac', h('summary', `Geride kalanlar (${kalan.length} ders)`));
  kap.append(h('p.alt-yazi', 'Sorun değil; istediğin sırayla yapabilirsin. Programı da kaydırabilirsin.'));
  for (const x of kalan.slice(0, 8)) { const s = gorevSatiri(x.ders, { ek: `Gün ${x.no}` }); if (s) kap.append(s); }
  kap.append(h('button.dugme.cizgili.tam', { type: 'button', style: 'margin:8px 0', onclick: () => {
    d.baslangic = gunEkle(bugun(), -(ilk - 1)); store.kaydetHemen(); bildir(`Program kaydırıldı: bugün Gün ${ilk}`); bugunYenile();
  } }, simge('yenile'), `Programı kaydır: bugün Gün ${ilk} olsun`));
  kok.append(kap);
}
