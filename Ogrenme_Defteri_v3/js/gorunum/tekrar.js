// Tekrar: aralıklı tekrar (3-10-20-50 gün) oturumları ve gecikmeli hatırlama kontrolleri.

import { h, simge, tohumlu, yazidanTohum, karistir, bildir } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import * as srs from '../srs.js';
import { bugun, goreceli, kisaTarih, saatMetni } from '../zaman.js';
import { kelimeSorusu } from '../uretici.js';
import { oynat, ctxOlustur } from '../oyuncu.js';
import { sayfaBasligi, bosKutu } from './yardimci.js';

export function srsOzet() {
  const o = srs.ozet(store.al().srs, bugun());
  return o;
}

const KUTU_AD = ['İlk tekrar (3. gün)', '2. tekrar (10. gün)', '3. tekrar (20. gün)', 'Son tekrar (50. gün)'];
const TUR_KUTU = ['anlam-sec', 'dinle-sec', 'kelime-sec', 'yaz'];

export function tekrarGorunum() {
  const d = store.al();
  const oz = srsOzet();
  const kok = h('div', sayfaBasligi('Tekrar', 'Öğrendiğin şeyler tam unutulmadan önce yeniden sorulur'));

  if (!oz.toplam) {
    kok.append(bosKutu('🌱', 'Henüz tekrar edilecek bir şey yok', 'Bir ders bitirdiğinde öğrendiğin kelimeler burada 3, 10, 20 ve 50. günlerde karşına çıkar.', h('a.dugme.birincil', { href: '#/bugun' }, 'Bugün sayfasına git')));
    return kok;
  }

  const bugunS = bugun();
  const vadeli = store.vadesiGelenler(bugunS);
  const adet = Math.min(vadeli.length, d.ayar.gunlukTekrar || 20);
  kok.append(h('div.kart' + (vadeli.length ? '.vurgulu' : ''),
    h('div.satir', h('div.buyuk-emoji', { style: 'font-size:2.6rem;margin:0' }, vadeli.length ? '🔁' : '✅'),
      h('div', h('h2', { style: 'margin:0;color:inherit' }, vadeli.length ? `${vadeli.length} madde tekrar bekliyor` : 'Bugünlük tekrarın bitti'),
        h('p.alt-yazi', { style: 'margin:2px 0 0' }, vadeli.length ? `Bu oturumda ${adet} tanesi sorulur; bitince kalanlar bir sonraki oturuma kalır.` : `Sıradaki tekrar: ${sonrakiTarih() || '—'}`))),
    vadeli.length ? h('a.dugme.tam', { href: '#/tekrar/oturum', style: 'margin-top:12px;background:#fff;color:var(--vurgu-koyu);min-height:54px;font-size:1.05rem' }, simge('cal'), 'Tekrarı başlat') : null));

  // kutu dağılımı
  const kutular = [0, 0, 0, 0];
  for (const m of Object.values(d.srs)) if (!m.bitti) kutular[m.k]++;
  kok.append(h('div.kart.duz', h('h3', 'Öğrendiklerin nerede?'),
    ...kutular.map((n, i) => h('div.satir', { style: 'padding:6px 0' }, h('span', { style: 'flex:1' }, KUTU_AD[i]), h('strong', String(n)))),
    h('div.satir', { style: 'padding:6px 0' }, h('span', { style: 'flex:1' }, '🏁 Tamamen oturdu (4 tekrar bitti)'), h('strong', String(oz.bitti))),
    h('p.alt-yazi', { style: 'margin:8px 0 0' }, 'Yanlış bildiğin madde bir sonraki gün yeniden sorulur, aynı kutuda kalır.')));

  // bekleyen gecikmeli kontroller
  const bekleyen = store.gecikmeliBekleyen();
  if (bekleyen.length) {
    kok.append(h('div.bolum-baslik', h('h2', 'Hatırlama kontrolleri')));
    const simdi = Date.now();
    for (const { g, k } of bekleyen.slice(0, 6)) {
      const vadesi = k.vade <= simdi;
      kok.append(h(vadesi ? 'a.gorev' : 'div.gorev', { href: vadesi ? `#/hatirla/${g.id}/${k.ad}` : null, data: { iz: 'hafiza' }, style: vadesi ? '' : 'opacity:.75' },
        h('span.iz-simge', vadesi ? '⏰' : '⏳'), h('span.metin', h('span.baslik', g.baslik), h('span.alt', vadesi ? 'Şimdi yanıtla' : `${kisaTarih(new Date(k.vade).toISOString().slice(0, 10))} ${saatMetni(new Date(k.vade).toISOString())}`)), vadesi ? simge('ok') : null));
    }
  }

  kok.append(h('details.ac', h('summary', 'Tekrar nasıl çalışır?'),
    h('ul.liste-duz', h('li', 'Bir şeyi öğrendikten 3 gün sonra, sonra 10, 20 ve 50 gün sonra yeniden sorulur.'), h('li', 'Her aralık, bir önceki gerçek tekrar tarihinden sayılır; geç kalırsan zamanlama kaymaz, sadece o gün yapılır.'), h('li', 'Bildikçe soru zorlaşır: önce seçerek, en sonda yazarak yanıtlarsın.'))));
  return kok;
}

function sonrakiTarih() {
  const t = Object.values(store.al().srs).filter((m) => !m.bitti && m.s).map((m) => m.s).sort()[0];
  return t ? `${kisaTarih(t)} (${goreceli(t)})` : null;
}

/** Vadesi gelen maddelerden oynatıcı sayfaları kurar ve oturumu açar. */
export function tekrarOturumu() {
  const d = store.al();
  const ctx = ctxOlustur();
  const bugunS = bugun();
  const idler = store.vadesiGelenler(bugunS).slice(0, d.ayar.gunlukTekrar || 20);
  const rng = tohumlu(yazidanTohum(`tekrar|${bugunS}|${idler.length}`));
  const tumu = ctx.tumKelimeler;
  const sayfalar = [];
  for (const id of idler) {
    const m = d.srs[id];
    if (id.startsWith('k:')) {
      const k = icerik.kelime(id.slice(2));
      if (!k) continue;
      sayfalar.push(kelimeSorusu(TUR_KUTU[Math.min(m.k, 3)], k, { havuz: tumu, tumu, ctx, rng, bolum: 'Tekrar', maddeId: id }));
    } else if (id.startsWith('l:')) {
      const [dersId, adimId] = id.slice(2).split('/');
      const ders = icerik.ders(dersId);
      const sun = ders?.adimlar.find((a) => a.tur === 'liste-sun' && a.id === adimId);
      if (!sun) continue;
      const hat = ders.adimlar.find((a) => a.tur === 'liste-hatirla' && a.ref === adimId);
      sayfalar.push({ t: 'liste-hatirla', id: `tekrar:${id}`, adim: { baslik: sun.baslik, yonerge: 'Listeye bakmadan, hatırladığın kadarını sırayla yaz.' }, liste: sun.liste, saray: hat?.saray || false, baslik: sun.baslik, bolum: 'Liste tekrarı', puan: true, maddeId: id });
    }
  }
  if (!sayfalar.length) { bildir('Şu an tekrar edilecek bir şey yok.'); location.replace('#/tekrar'); return; }
  oynat({ id: 'tekrar:' + bugunS, baslik: 'Günlük tekrar', iz: 'ingilizce', sayfalar: karistir(sayfalar, rng), ctx, donus: '#/tekrar', srsModu: true, dersMi: false, bitisEtiketi: 'Tamam', hedef: '' });
}

/** Gecikmeli hatırlama kontrolünü açar. */
export function hatirlaOturumu(gId, kAd) {
  const g = store.al().gecikmeli.find((x) => x.id === gId);
  const k = g?.kontroller.find((x) => x.ad === kAd);
  if (!g || !k) { bildir('Bu kontrol bulunamadı.'); location.replace('#/bugun'); return; }
  if (k.yapildi) { bildir('Bu kontrole zaten yanıt verdin.'); location.replace('#/bugun'); return; }
  oynat({ id: `hatirla:${gId}:${kAd}`, baslik: g.baslik, iz: 'hafiza', sayfalar: [{ t: 'gecikmeli-kontrol', id: `${g.id}:${kAd}`, g, k }], ctx: ctxOlustur(), donus: '#/bugun', dersMi: false, bitisEtiketi: 'Tamam', hedef: 'Yanıtın kaydedildi.' });
}
