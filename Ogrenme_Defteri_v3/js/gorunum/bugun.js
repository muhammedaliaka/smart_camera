// Bugün: bugünün hedefi, görevler, vadesi gelen tekrarlar ve geride kalanlar.

import { h, simge, halka, bildir } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import { bugun, gunEkle, uzunTarih, saatMetni } from '../zaman.js';
import { srsOzet } from './tekrar.js';
import { programGunu, gorevSatiri, bosKutu } from './yardimci.js';
import { IZLER } from '../paket.js';
import { bugunSureli, sonrakiGorev, kural } from '../seviye-ac.js';
import { odakOnerisi, odakSuresi } from '../sure.js';
import { gorevAdresi } from '../plan.js';
import { cefrYaklasim } from '../seviye.js';
import { ozet as oyunOzeti, gorulmemisRozetler, gorulduIsaretle } from '../oyun-ac.js';
import { oyunSeridi, yeniRozetKarti } from './oyun-kart.js';

export function bugunGorunum() {
  const d = store.al();
  const idx = icerik.idx();
  const pg = programGunu();
  const kok = h('div');
  const adi = d.ad ? `, ${d.ad}` : '';

  kok.append(h('div.selam',
    h('h1', `Merhaba${adi} 👋`),
    h('p.alt-yazi', { style: 'margin:0' }, uzunTarih(bugun()))));


  if (pg.durum === 'baslamadi') {
    kok.append(h('div.kart', h('h2', 'Program henüz başlamadı'), h('p', `Başlangıç tarihin ${uzunTarih(d.baslangic)}. İstersen programı hemen şimdi başlatabilirsin.`),
      h('button.dugme.birincil', { type: 'button', onclick: () => { d.baslangic = bugun(); store.kaydetHemen(); bugunYenile(); } }, 'Programı bugün başlat')));
  } else if (pg.durum === 'programYok') {
    kok.append(bosKutu('📦', 'Henüz bir program yok', 'İçerik paketi yüklenince günlük görevlerin burada görünür. Ben → İçerik bölümünden paket ekleyebilirsin.'));
  } else if (pg.durum === 'bitti') {
    kok.append(h('div.kart.vurgulu', h('h2', '🎉 Programın sonuna geldin'), h('p', `${idx.enSonGun} günlük programı tamamladın. Şimdi Tekrar ve Oyunlar ile bilgileri taze tut; yeni haftalar eklemek için Ben → İçerik bölümüne bak.`)));
  } else {
    gunKarti(kok, pg);
  }

  if (!kok.dataset.oyun) oyunKartlari(kok); // plan kartı yoksa (dinlenme günü, program başlamadı…) yine de göster
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

/** Rütbe şeridi ve “Yeni rozet” kartı: Başla düğmesinin hemen altında (ana eylemi aşağı itmesin, ama ödül görünür olsun). */
function oyunKartlari(kok) {
  kok.dataset.oyun = '1';
  if (!store.al().olaylar.length) return;
  const yeni = yeniRozetKarti(gorulmemisRozetler(), gorulduIsaretle);
  if (yeni) kok.append(yeni);
  kok.append(oyunSeridi(oyunOzeti()));
}

function bugunYenile() { window.dispatchEvent(new HashChangeEvent('hashchange')); }

function gunKarti(kok, pg) {
  const plan = bugunSureli();
  if (!plan || !plan.gorevler.length) {
    kok.append(bosKutu('😴', 'Bugün dinlenme günü', 'Bugüne görev konmamış. İstersen Tekrar ya da Oyunlar bölümüne bakabilirsin.'));
    return;
  }
  const zorunlu = plan.gorevler.filter((t) => !t.istege);
  const biten = zorunlu.filter((t) => t.bitti).length;
  const yuzde = zorunlu.length ? Math.round((biten / zorunlu.length) * 100) : 100;
  const tamam = zorunlu.length > 0 && biten === zorunlu.length;
  const yoklamada = Object.values(plan.seviye).some((s) => s.yoklamaBekliyor) && plan.no <= kural().yerlestirme.sonGun;
  const k = plan.kesim;

  kok.append(h('div.kart.vurgulu',
    h('div.gunluk',
      halka(yuzde, `${biten}/${zorunlu.length}`, 72),
      h('div', h('div.alt-yazi', `Gün ${plan.no} · Hafta ${plan.hafta}`), h('h2', { style: 'margin:2px 0 4px;color:inherit' }, plan.baslik || 'Bugünün programı'),
        plan.hedef ? h('div', { style: 'font-size:.95rem' }, '🎯 ', plan.hedef) : null)),
  ));

  const sirada = sonrakiGorev(null);
  if (sirada) {
    kok.append(h('a.dugme.birincil.tam.basla', { href: sirada.href },
      h('span.basla-ana', sirada.bonus ? '🎁 Hâlâ enerjin var mı?' : biten ? '▶ Devam et' : '▶ Başla'),
      h('span.basla-alt', sirada.bonus ? sirada.etiket : `kalan ≈ ${k.kalanDk} dk · odak süren ${plan.odakDk} dk`)));
  }
  odakOneriKarti(kok);
  oyunKartlari(kok);

  if (yoklamada) {
    kok.append(h('div.kart.duz', h('h3', 'İlk hafta: nereden başlayacağını bulalım'),
      h('p', { style: 'margin:0' }, 'Her beceri için kısa bir yoklama var. Sorular kolaydan zora doğru gider; bilmediğine “Bilmiyorum” de, tahmin etme. Sonuç not değil, yalnızca başlangıç seviyeni belirler; yoklama bitince gerçek çalışma başlar.')));
  }
  if (tamam) kok.append(h('div.kart.duz', { style: 'background:var(--dogru-zemin);border-color:transparent;color:var(--dogru)' }, h('strong', '✅ Bugünkü görevlerin tamam. Eline sağlık!'), h('div.alt-yazi', { style: 'color:inherit' }, 'Hâlâ enerjin varsa aşağıdaki bonuslara, Tekrar’a ya da Oyunlar’a bakabilirsin. Durmak da tamamen yeterli.')));

  const bolum = (baslik, alt, liste) => {
    if (!liste.length) return;
    kok.append(h('div.bolum-baslik', h('h2', baslik), alt ? h('span.alt-yazi', alt) : null));
    for (const t of liste) { const sat = planSatiri(t); if (sat) kok.append(sat); }
  };
  bolum('Şimdi', `≈ ${k.simdiDk} dk`, k.simdi);
  bolum('Hareket', 'oturmadan; mola yerine geçer', k.hareket);
  bolum('Mola sonrası', `≈ ${k.sonraDk} dk · odak süreni aşıyor`, k.sonra);
  bolum('Bonus', 'istersen · zorunlu değil', k.bonus);
  kok.append(h('div.bolum-baslik', h('h2', 'Dışarıda mısın?')), h('a.gorev', { href: '#/alan', data: { iz: 'hafiza' } }, h('span.iz-simge', '🌳'), h('span.metin', h('span.baslik', 'Serbest alan'), h('span.alt', 'Park ya da çalışma alanı: gerçek yerde hafıza sarayı, mekân avı, sesli tur')), simge('ok')));
  seviyeSeridi(kok, plan);
}

/** Son üç etkin gün odak süresini doldurduysa +5 dakika öner (tek dokunuşla kabul; "Şimdi değil" bir hafta susar). */
function odakOneriKarti(kok) {
  const d = store.al();
  const oner = odakOnerisi({ olaylar: d.olaylar, odakDk: odakSuresi(d.ayar), bugun: bugun(), ayar: d.ayar });
  if (!oner) return;
  const kapat = (kart) => kart.remove();
  const kart = h('div.kart.duz', { style: 'border-color:var(--vurgu)' },
    h('strong', '🌱 Dayanıklılığın artıyor'),
    h('p', { style: 'margin:6px 0 10px' }, `Son üç etkin günde odak süreni (${odakSuresi(d.ayar)} dk) doldurdun. ${oner.yeni} dakikayı deneyelim mi? İstediğin zaman Ben → Ayarlar’dan geri alabilirsin.`),
    h('div.esnek',
      h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => { d.ayar.odakErtele = gunEkle(bugun(), 7); store.kaydetHemen(); kapat(kart); } }, 'Şimdi değil'),
      h('button.dugme.birincil', { type: 'button', style: 'flex:1', onclick: () => { d.ayar.odakDk = oner.yeni; d.ayar.odakDegisim = bugun(); store.kaydetHemen(); bugunYenile(); } }, `${oner.yeni} dk yap`)));
  kok.append(kart);
}

/** Planın bir görevi: yoklama ve seviye oturumu burada, yazılı dersler ortak satırla gösterilir. */
function planSatiri(t) {
  const dk = t.dk ? `≈ ${t.dk} dk` : null;
  if (t.tur === 'ders') return gorevSatiri(t.ders, { istege: t.istege, ek: [t.oneri ? 'önerilen · seviyene uygun' : null, dk].filter(Boolean).join(' · ') || null });
  const iz = IZLER[t.iz] || { ad: t.iz, simge: '•' };
  const ad = kural().izler[t.iz]?.ad || iz.ad;
  const baslik = t.tur === 'yoklama' ? `${ad} yoklaması` : `${ad} oturumu`;
  const alt = (t.tur === 'yoklama' ? [`${t.no}. yoklama`, 'sınav değil, yer bulma', dk] : [`Seviye ${t.sv}`, t.istege ? 'isteğe bağlı' : null, t.iz === 'spor' ? `≈ ${t.dk} dk hareket + yürüyüş` : dk]).filter(Boolean).join(' · ');
  return h('a.gorev' + (t.bitti ? '.bitti' : ''), { href: gorevAdresi(t), data: { iz: t.iz } },
    h('span.iz-simge', iz.simge),
    h('span.metin', h('span.baslik', baslik), h('span.alt', alt)),
    h('span.durum', { 'aria-label': t.bitti ? 'Tamamlandı' : 'Henüz yapılmadı' }, t.bitti ? simge('tik') : null));
}

/** Becerilerin güncel seviyesi (yoklama sürüyorsa “yoklamada”). */
function seviyeSeridi(kok, plan) {
  const sat = Object.values(plan.seviye);
  if (!sat.length) return;
  kok.append(h('div.bolum-baslik', h('h2', 'Seviyelerin'), h('a', { href: '#/ben' }, 'Ayrıntı')));
  const izgara = h('div.izgara', { style: 'grid-template-columns:repeat(auto-fit,minmax(150px,1fr))' });
  for (const s of sat) {
    const iz = IZLER[s.iz] || { simge: '•' };
    izgara.append(h('div.kart.duz', { style: 'padding:10px 12px' },
      h('div.alt-yazi', iz.simge, ' ', s.ad),
      s.yoklamaBekliyor ? h('strong', 'yoklamada') : h('strong', `Seviye ${s.sv}`),
      s.yoklamaBekliyor ? null : h('div.alt-yazi', cefrYaklasim(s.sv))));
  }
  kok.append(izgara);
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
