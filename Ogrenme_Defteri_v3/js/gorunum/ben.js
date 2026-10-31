// Ben: ilerleme, geçmiş, ayarlar ve içerik yönetimi.

import { h, simge, bildir, cubuk } from '../ui.js';
import * as store from '../store.js';
import * as icerik from '../icerik.js';
import * as ses from '../ses.js';
import { IZLER } from '../paket.js';
import { bugun, gunEkle, kisaTarih, uzunTarih, saatMetni, goreceli } from '../zaman.js';
import { sayfaBasligi, bosKutu, toplamDers } from './yardimci.js';
import { srsOzet } from './tekrar.js';
import { cevrimdisiIndir, cevrimdisiDurum } from '../cevrimdisi.js';
import { raporUret } from '../rapor.js';
import { seviyeDurumu, kural } from '../seviye-ac.js';
import { cefrYaklasim } from '../seviye.js';
import { odakSuresi } from '../sure.js';
import { rozetler } from '../oyun-ac.js';
import { haftaHedefi } from '../oyunlastir.js';
import { rozetIzgarasi } from './oyun-kart.js';
import * as esitleme from '../esitle.js';

const SEKMELER = [['ilerleme', 'İlerleme'], ['gecmis', 'Geçmiş'], ['ayar', 'Ayarlar'], ['icerik', 'İçerik']];

export function benGorunum(sorgu) {
  const sekme = SEKMELER.some(([k]) => k === sorgu.get('s')) ? sorgu.get('s') : 'ilerleme';
  const kok = h('div', sayfaBasligi('Ben', store.al().ad ? store.al().ad : 'İlerlemen, geçmişin ve ayarların'));
  kok.append(h('div.sekmeler.esit', { role: 'tablist' }, SEKMELER.map(([k, ad]) => h('a.sekme', { href: `#/ben?s=${k}`, role: 'tab', 'aria-selected': String(k === sekme) }, ad))));
  kok.append(({ ilerleme, gecmis, ayar, icerik: icerikSekmesi })[sekme](sorgu));
  return kok;
}

// ---------------- İlerleme ----------------
const yuzde = (d, t) => (t ? Math.round((d / t) * 100) : null);

export function sorular() {
  return store.olaylar((o) => o.tur === 'soru' && o.ilk && !o.puansiz);
}
function gruplaIz(olaylar) {
  const g = {};
  for (const o of olaylar) {
    const d = icerik.ders(o.ders);
    const iz = d?.iz || (o.ders?.startsWith('tekrar') ? 'ingilizce' : o.ders?.startsWith('oyun') ? 'oyun' : 'diger');
    const e = g[iz] || (g[iz] = { d: 0, t: 0 });
    e.t++; if (o.dogru) e.d++;
  }
  return g;
}

function ilerleme() {
  const d = store.al();
  const kok = h('div');
  const { toplam, biten } = toplamDers();
  const oz = srsOzet();
  const qs = sorular();
  const dogru = qs.filter((o) => o.dogru).length;
  const anlama = qs.filter((o) => /^(Sahne|Dinleme):/.test(o.bolum || ''));
  const anlamaDogru = anlama.filter((o) => o.dogru).length;

  kok.append(h('div.izgara.iki', { style: 'margin-bottom:14px' },
    ozetKutu('📅', String(store.gunSayisi()), 'gün çalıştın'),
    ozetKutu('🔥', String(store.seri()), 'gün üst üste'),
    ozetKutu('✅', `${biten}/${toplam}`, 'ders tamam'),
    ozetKutu('🧠', String(oz.toplam), 'madde tekrar sistemine girdi')));

  kok.append(seviyeKarti());
  kok.append(rozetIzgarasi(rozetler()));
  if (!qs.length) {
    kok.append(bosKutu('📊', 'Henüz sonuç yok', 'İlk dersi bitirince doğru sayın ve yüzden burada görünür.', h('a.dugme.birincil', { href: '#/bugun' }, 'Bugün sayfasına git')));
  } else {
    kok.append(h('div.kart', h('h3', 'Genel başarın'), h('div.satir', { style: 'gap:16px' },
      h('div', { style: 'width:96px;height:96px;flex:none;position:relative', role: 'img', 'aria-label': `%${yuzde(dogru, qs.length)}`, html: halkaSvg(yuzde(dogru, qs.length)) }, h('b', { style: 'position:absolute;inset:0;display:grid;place-items:center;font-size:1.4rem' }, `%${yuzde(dogru, qs.length)}`)),
      h('div', h('strong', { style: 'font-size:1.2rem' }, `${dogru} / ${qs.length} soru`), h('p.alt-yazi', { style: 'margin:2px 0 0' }, 'Sadece ilk denemeler sayılır; yanlışı sonradan düzeltmen puanı değiştirmez.')))));
    if (anlama.length) kok.append(h('div.kart', { data: { iz: 'dinleme' } }, h('h3', '🎧 Dinleyip anlama'), h('div.satir', h('strong', { style: 'font-size:1.6rem;color:var(--iz)' }, `%${yuzde(anlamaDogru, anlama.length)}`), h('span.alt-yazi', `${anlamaDogru}/${anlama.length} anlama sorusunu ilk seferde bildin`)), cubuk(yuzde(anlamaDogru, anlama.length))));
    const iz = gruplaIz(qs);
    kok.append(h('div.kart.duz', h('h3', 'Konulara göre'), ...Object.entries(iz).map(([k, v]) => h('div', { style: 'margin:10px 0', data: { iz: k } }, h('div.satir', h('span', `${(IZLER[k]?.simge || '🎮')} ${IZLER[k]?.ad || (k === 'oyun' ? 'Oyunlar' : 'Diğer')}`), h('span.bosluk'), h('strong', `%${yuzde(v.d, v.t)}`), h('span.alt-yazi', `${v.d}/${v.t}`)), cubuk(yuzde(v.d, v.t))))));
    kok.append(h('div.kart.duz', h('h3', 'Son 14 gün'), gunlukGrafik(qs)));
  }

  const dis = store.olaylar((o) => o.tur === 'dis' && !o.yapilmadi && o.yuzde != null).slice(-5).reverse();
  if (dis.length) kok.append(h('div.kart.duz', h('h3', '📱 Dış uygulama sonuçların'), ...dis.map((o) => h('div.satir', { style: 'padding:6px 0' }, h('span', `${o.ad}`), h('span.alt-yazi', kisaTarih(o.g)), h('span.bosluk'), h('strong', `${o.dogru}/${o.toplam} (%${o.yuzde})`)))));

  kok.append(raporKarti());
  return kok;
}

/** Her becerinin güncel seviyesi, son değişikliği ve elle ayarlama (yoklama bittikten sonra). */
function seviyeKarti() {
  const sv = seviyeDurumu();
  const k = kural();
  const kart = h('div.kart', h('h3', 'Seviyelerin'),
    h('p.alt-yazi', 'Her beceride 1’den başlayan açık uçlu bir merdiven. Oturumdaki her soruyu ilk denemede doğru yaparsan bir basamak çıkarsın; zor geçerse kendiliğinden bir basamak iner. Seviye bir not değildir, bugünkü çalışmanın zorluğunu belirler.'));
  for (const s of Object.values(sv)) {
    const iz = IZLER[s.iz] || { simge: '•' };
    const son = s.gecmis.at(-1);
    const ayar = k.izler[s.iz] || {};
    const alt = s.yoklamaBekliyor
      ? `Yoklama sürüyor (${s.yerlestirme.yoklamalar.length} yoklama yapıldı). Bitince başlangıç seviyen burada görünür.`
      : [cefrYaklasim(s.sv), `${s.oturum} oturum`, ayar.yukselmeSeri > 1 ? `yükselmek için ${ayar.yukselmeSeri - s.tamSeri} oturum daha tam` : null, son?.neden ? `son değişiklik: ${son.neden}` : null].filter(Boolean).join(' · ');
    const satir = h('div', { style: 'margin:14px 0', data: { iz: s.iz } },
      h('div.satir', h('span', `${iz.simge} ${s.ad}`), h('span.bosluk'), s.yoklamaBekliyor ? h('strong', 'yoklamada') : h('strong', `Seviye ${s.sv}`)),
      h('div.alt-yazi', alt));
    if (!s.yoklamaBekliyor) {
      const giris = h('input.girdi', { type: 'number', min: '1', max: '100', value: String(s.sv), 'aria-label': `${s.ad} seviyesi`, style: 'width:84px' });
      const neden = h('input.girdi', { type: 'text', placeholder: 'Neden? (isteğe bağlı)', 'aria-label': 'Neden', style: 'flex:1;min-width:0;width:auto' });
      satir.append(h('details.ac', h('summary', 'Elle ayarla'),
        h('div.satir', { style: 'gap:8px;margin:8px 0' }, giris, neden,
          h('button.dugme.cizgili', { type: 'button', onclick: () => {
            const yeni = Math.round(+giris.value);
            if (!(yeni >= 1 && yeni <= 100) || yeni === s.sv) { bildir('1–100 arasında, şimdikinden farklı bir seviye yaz'); return; }
            store.olay('seviye-ayar', { iz: s.iz, sv: yeni, neden: neden.value.trim() || undefined }, { iz: s.iz });
            store.kaydetHemen(); bildir(`${s.ad} seviyesi ${yeni} yapıldı`); window.dispatchEvent(new HashChangeEvent('hashchange'));
          } }, 'Kaydet'))));
    }
    kart.append(satir);
  }
  return kart;
}

function halkaSvg(y) {
  const r = 54, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 128 128" aria-hidden="true" style="width:100%;height:100%;transform:rotate(-90deg)"><circle cx="64" cy="64" r="${r}" fill="none" stroke="var(--yuzey-2)" stroke-width="12"/><circle cx="64" cy="64" r="${r}" fill="none" stroke="var(--vurgu)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - y / 100)}"/></svg>`;
}

function ozetKutu(emoji, buyuk, kucuk) {
  return h('div.kart.duz', { style: 'margin:0;display:flex;gap:12px;align-items:center' }, h('span', { style: 'font-size:1.8rem' }, emoji), h('div', h('div', { style: 'font-size:1.5rem;font-weight:800;line-height:1.1' }, buyuk), h('div.alt-yazi', kucuk)));
}

function gunlukGrafik(qs) {
  const bugunS = bugun();
  const gunler = Array.from({ length: 14 }, (_, i) => gunEkle(bugunS, i - 13));
  const say = Object.fromEntries(gunler.map((g) => [g, 0]));
  for (const o of qs) if (o.g in say) say[o.g]++;
  const en = Math.max(1, ...Object.values(say));
  return h('div', { role: 'img', 'aria-label': 'Son 14 günde çözülen soru sayısı' },
    h('div.grafik', gunler.map((g) => h('div', { style: `height:${Math.max(4, (say[g] / en) * 100)}%`, title: `${kisaTarih(g)}: ${say[g]} soru` }, say[g] ? h('span', String(say[g])) : null))),
    h('div.grafik-etiket', gunler.map((g, i) => h('span', i % 2 === 0 ? g.slice(8) : ''))), h('p.alt-yazi', { style: 'margin:6px 0 0' }, 'Her çubuk o gün çözdüğün soru sayısı (ayın günü altta).'));
}

// ---------------- Rapor ----------------
// Rapor, bir yapay zekâya ya da öğretmene verilebilecek kadar açık yazılır (js/rapor.js). Burada yalnız seçim ve dışa aktarma var.
const raporSecim = { aralik: '7', ayrinti: 'kisa' };
const ARALIKLAR = [['1', 'Bugün'], ['7', 'Son 7 gün'], ['30', 'Son 30 gün'], ['0', 'Tümü']];

export function raporMetni({ aralik = raporSecim.aralik, ayrinti = raporSecim.ayrinti } = {}) {
  const b = bugun();
  const gun = +aralik;
  return raporUret({
    durum: store.al(),
    oku: { ders: (id) => icerik.ders(id), kelime: (id) => icerik.kelime(id) },
    bas: gun ? gunEkle(b, -(gun - 1)) : null, son: b, bugun: b, ayrinti, surum: store.SURUM,
    seviye: seviyeDurumu(), seviyeKural: kural(),
  });
}

const YZ_GOREV = `Aşağıda bir lise öğrencisinin "Öğrenme Defteri" uygulamasından alınmış çalışma raporu var. Önce raporun "Nasıl okunur" bölümünü oku, sonra şunları yap:
1. Öğrencinin neleri iyi yaptığını söyle.
2. En çok karıştırdığı şeyleri ve olası nedenini açıkla.
3. Yazdığı açık uçlu yanıtları değerlendir; İngilizce yazdıklarında hata varsa düzeltip nedenini kısaca anlat.
4. Önümüzdeki günler için en fazla 3 somut öneri ver.
Türkçe, sade ve 16 yaşındaki bir öğrenciye uygun yaz. "Beyan" etiketli bilgileri doğrulanmış gibi sunma. Raporda olmayan bir şey uydurma.

---

`;

function raporKarti() {
  const kart = h('div.kart.duz', h('h3', 'Çalışma raporu'),
    h('p.alt-yazi', 'Yaptığın çalışmaların ayrıntılı kaydı: hangi derste ne sorulmuş, sen ne yanıtlamışsın, doğrusu neymiş. Bir yapay zekâya ya da öğretmenine verirsen karıştırmadan okuyabilir.'));
  const bilgi = h('p.alt-yazi', { 'aria-live': 'polite' });
  const onizleme = h('pre', { style: 'white-space:pre-wrap;word-break:break-word;font-size:.85rem;max-height:50vh;overflow:auto;margin:0' });
  const ac = h('details.ac', h('summary', 'Raporu önizle'), onizleme);
  const yenile = () => {
    const m = raporMetni();
    bilgi.textContent = `Bu seçimle rapor yaklaşık ${Math.max(1, Math.round(m.length / 1000))} bin karakter.`;
    if (ac.open) onizleme.textContent = m;
  };
  ac.addEventListener('toggle', yenile);
  const secici = (etiket, secimler, anahtar) => {
    const kap = h('div.yardim-cip', { role: 'group', 'aria-label': etiket });
    secimler.forEach(([k, ad]) => {
      const c = h('button.cip', { type: 'button', 'aria-pressed': String(raporSecim[anahtar] === k) }, ad);
      c.addEventListener('click', () => { raporSecim[anahtar] = k; kap.querySelectorAll('.cip').forEach((x, i) => x.setAttribute('aria-pressed', String(secimler[i][0] === k))); yenile(); });
      kap.append(c);
    });
    return h('div', h('label.alan', etiket), kap);
  };
  kart.append(secici('Hangi günler?', ARALIKLAR, 'aralik'),
    secici('Ayrıntı', [['kisa', 'Kısa (önerilen)'], ['tam', 'Tam']], 'ayrinti'),
    h('p.alt-yazi', 'Kısa: doğru bildiklerin yalnız sayılır; yanlışların, yazdıkların ve diğer tüm kayıtların eksiksiz yazılır. Tam: her soru tek tek yazılır.'),
    bilgi,
    h('div', { style: 'display:grid;gap:8px;margin-top:8px' },
      h('button.dugme.birincil.tam', { type: 'button', onclick: raporIndir }, simge('indir'), 'Raporu indir (.md)'),
      h('button.dugme.cizgili.tam', { type: 'button', onclick: () => raporKopyala(false) }, 'Raporu kopyala'),
      h('button.dugme.cizgili.tam', { type: 'button', onclick: () => raporKopyala(true) }, 'Yapay zekâ için kopyala')),
    h('p.alt-yazi', '“Yapay zekâ için kopyala”, raporun başına ne yapması gerektiğini anlatan kısa bir görev metni de ekler.'),
    ac);
  yenile();
  return kart;
}

function raporIndir() {
  const url = URL.createObjectURL(new Blob([raporMetni()], { type: 'text/markdown;charset=utf-8' }));
  const a = h('a', { href: url, download: `ogrenme-defteri-rapor-${bugun()}.md` });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
}
async function raporKopyala(yapayZekaIcin) {
  try { await navigator.clipboard.writeText((yapayZekaIcin ? YZ_GOREV : '') + raporMetni()); bildir(yapayZekaIcin ? 'Görev metniyle birlikte panoya kopyalandı' : 'Rapor panoya kopyalandı'); }
  catch { bildir('Kopyalanamadı; “indir” düğmesini kullan'); }
}

// ---------------- Geçmiş ----------------
function olayOzeti(o) {
  const dersAd = (id) => icerik.ders(id)?.baslik || id;
  switch (o.tur) {
    case 'ders-bitir': return ['✅', `${dersAd(o.ders)} bitti${o.toplam ? ` — ${o.dogru}/${o.toplam} (%${o.yuzde})` : ''}`, 'ders'];
    case 'serbest': return [o.kip === 'ses' ? '🎙️' : '✍️', String(o.soru || 'Serbest yanıt').replace(/\*\*/g, ''), 'yazi', o];
    case 'dis': return ['📱', `${o.ad}: ${o.yapilmadi ? 'bugün yapılmadı' : `${o.dogru ?? '?'}/${o.toplam ?? '?'}${o.yuzde != null ? ` (%${o.yuzde})` : ''}`}`, 'dis'];
    case 'spor': return ['🏃', `Spor kaydı · zorlanma ${o.zorlanma ?? '-'}/10${o.kismi ? ' · kısmen' : ''}`, 'spor'];
    case 'oyun': return ['🎮', `Oyun: ${o.oyun} — ${o.dogru}/${o.toplam} (%${o.yuzde})`, 'oyun'];
    case 'olcek': return ['📏', `${o.id}: ${o.deger}`, 'ders'];
    case 'liste': return ['🧠', `Liste hatırlama: ${o.var}/${o.toplam}`, 'ders'];
    case 'gecikmeli-yanit': return ['⏰', `Gecikmeli hatırlama (${o.kontrol}): ${o.dogru ? 'hatırladı' : 'hatırlayamadı'}`, 'ders'];
    case 'saray': return ['🏛️', `Hafıza sarayı kuruldu (${o.duraklar?.length || 0} durak)`, 'ders'];
    case 'dinleme': return ['🎧', `Dinleme: ${o.sayi} kez`, 'ders'];
    case 'yerlestirme': return ['🧭', `Yoklama (${o.iz}) · seviye ${o.sv}: ${o.dogru}/${o.toplam}`, 'ders'];
    case 'yerlestirme-son': return ['🧭', `Yoklama bitti (${o.iz})`, 'ders'];
    case 'seviye-oturum': return ['📶', `Seviye oturumu (${o.iz}) · seviye ${o.sv}: ${o.dogru ?? '-'}/${o.toplam ?? '-'}${o.sonuc ? ` · ${o.sonuc}` : ''}`, 'ders'];
    case 'alan-tur': return ['🌳', `Serbest alan · ${{ saray: 'mekân sarayı', sesli: 'sesli tur', av: 'mekân avı' }[o.etkinlik] || o.etkinlik}: ${o.dogru}/${o.toplam}`, 'ders'];
    case 'sure': return null;
    case 'seviye-ayar': return ['🎚️', `Seviye elle ayarlandı (${o.iz}): ${o.sv}`, 'ders'];
    default: return null;
  }
}

function gecmis(sorgu) {
  const filtre = sorgu.get('f') || 'hepsi';
  const kok = h('div');
  const F = [['hepsi', 'Hepsi'], ['ders', 'Dersler'], ['yazi', 'Yazdıklarım'], ['dis', 'Dış uygulama'], ['oyun', 'Oyunlar'], ['spor', 'Spor']];
  kok.append(h('div.sekmeler.sar', F.map(([k, ad]) => h('a.sekme', { href: `#/ben?s=gecmis&f=${k}`, 'aria-selected': String(k === filtre) }, ad))));
  const satirlar = store.olaylar().map((o) => ({ o, s: olayOzeti(o) })).filter((x) => x.s && (filtre === 'hepsi' || x.s[2] === filtre)).reverse();
  if (!satirlar.length) { kok.append(bosKutu('🗒️', 'Burada henüz kayıt yok', 'Bir ders bitirince ya da bir şey yazınca kayıtların burada sıralanır.')); return kok; }
  const sinir = +(sorgu.get('n') || 40);
  const liste = h('ul.zaman-cizgisi');
  let sonGun = null;
  for (const { o, s } of satirlar.slice(0, sinir)) {
    if (o.g !== sonGun) { sonGun = o.g; liste.append(h('li', { style: 'display:block;border:0;padding:14px 0 2px' }, h('strong', `${uzunTarih(o.g)}`), h('span.alt-yazi', ` · ${goreceli(o.g)}`))); }
    const govde = h('div', { style: 'flex:1;min-width:0' }, h('div', s[0] + ' ' + s[1]));
    if (s[2] === 'yazi') yaziDetayi(govde, o);
    if (o.tur === 'ders-bitir' && icerik.ders(o.ders)) govde.append(h('a.alt-yazi', { href: `#/ders/${o.ders}` }, 'Dersi aç'));
    liste.append(h('li', h('time', saatMetni(o.t)), govde));
  }
  kok.append(liste);
  if (satirlar.length > sinir) kok.append(h('a.dugme.cizgili.tam', { href: `#/ben?s=gecmis&f=${filtre}&n=${sinir + 40}`, style: 'margin-top:12px' }, 'Daha eski kayıtlar'));
  return kok;
}

function yaziDetayi(govde, o) {
  if (o.kip === 'ses') {
    const d = h('button.dugme.kucuk.cizgili', { type: 'button' }, simge('cal'), `Kaydı dinle (${Math.round((o.sureMs || 0) / 1000)} sn)`);
    d.addEventListener('click', async () => {
      try { const blob = await store.depo.al('kayitlar', o.i); if (!blob) return bildir('Bu kayıt cihazda bulunamadı'); const a = new Audio(URL.createObjectURL(blob)); a.play(); } catch { bildir('Kayıt açılamadı'); }
    });
    govde.append(d);
  } else if (o.yanit) {
    govde.append(h('p.alt-yazi', { style: 'margin:4px 0 0;white-space:pre-wrap' }, o.yanit));
  }
}

// ---------------- Ayarlar ----------------
function secenekSatiri(etiket, secimler, mevcut, degisti) {
  const kap = h('div.yardim-cip', { role: 'group', 'aria-label': etiket });
  secimler.forEach(([k, ad]) => {
    const c = h('button.cip', { type: 'button', 'aria-pressed': String(k === mevcut) }, ad);
    c.addEventListener('click', () => { degisti(k); kap.querySelectorAll('.cip').forEach((x, i) => x.setAttribute('aria-pressed', String(secimler[i][0] === k))); });
    kap.append(c);
  });
  return h('div', h('label.alan', etiket), kap);
}

export function ayarlariUygula() {
  const a = store.al().ayar;
  const k = document.documentElement;
  if (a.tema === 'oto') k.removeAttribute('data-tema'); else k.setAttribute('data-tema', a.tema);
  k.setAttribute('data-yazi', a.yazi);
  ses.yavasAyarla(a.yavas);
}

function ayar() {
  const d = store.al();
  const a = d.ayar;
  const kok = h('div');
  const ad = h('input.girdi', { type: 'text', value: d.ad, 'aria-label': 'Adın', placeholder: 'Adın (isteğe bağlı)', maxlength: 30 });
  ad.addEventListener('change', () => { d.ad = ad.value.trim(); store.kaydetHemen(); bildir('Kaydedildi'); });
  const bas = h('input.girdi', { type: 'date', value: d.baslangic || bugun(), 'aria-label': 'Program başlangıç tarihi' });
  bas.addEventListener('change', () => { if (bas.value) { d.baslangic = bas.value; store.kaydetHemen(); bildir('Başlangıç tarihi güncellendi'); } });
  kok.append(h('div.kart', h('label.alan', { style: 'margin-top:0' }, 'Adın'), ad, h('label.alan', 'Program başlangıç tarihi (Gün 1)'), bas,
    h('p.alt-yazi', 'Bugünkü görevler bu tarihe göre belirlenir. Geriye ya da ileriye alırsan hiçbir kaydın silinmez.')));
  const ayarKaydet = () => { store.kaydetHemen(); ayarlariUygula(); };
  kok.append(h('div.kart',
    secenekSatiri('Görünüm', [['oto', 'Otomatik'], ['acik', 'Açık'], ['koyu', 'Koyu']], a.tema, (v) => { a.tema = v; ayarKaydet(); }),
    secenekSatiri('Yazı boyutu', [['kucuk', 'Küçük'], ['orta', 'Orta'], ['buyuk', 'Büyük']], a.yazi, (v) => { a.yazi = v; ayarKaydet(); }),
    secenekSatiri('Odak süresi (dakika)', [20, 25, 30, 35, 40, 45, 50].map((n) => [n, String(n)]), odakSuresi(a), (v) => { a.odakDk = v; a.odakDegisim = bugun(); ayarKaydet(); }),
    h('p.alt-yazi', { style: 'margin:-4px 0 8px' }, 'Bugünün zorunlu görevleri bu süreye sığacak kadarı “Şimdi” olur; fazlası “Mola sonrası”na geçer. Dayanıklılığın arttıkça uygulama +5 dakika önerir; sen karar verirsin.'),
    secenekSatiri('Haftalık hedef (çalışılan gün)', [2, 3, 4, 5, 6, 7].map((n) => [n, String(n)]), haftaHedefi(a), (v) => { a.haftaHedef = v; ayarKaydet(); }),
    h('p.alt-yazi', { style: 'margin:-4px 0 8px' }, 'Bugün ekranındaki hafta noktaları bu hedefe göre dolar. Gerçekçi bir sayı seç; tutturamadığın hafta ceza değildir. Her 7 günde bir gün ara vermek “gün üst üste” sayını bozmaz.'),
    secenekSatiri('Günlük tekrar adedi', [[10, '10'], [20, '20'], [30, '30']], a.gunlukTekrar, (v) => { a.gunlukTekrar = v; ayarKaydet(); }),
    onay('Sesleri varsayılan olarak yavaş çal', a.yavas, (v) => { a.yavas = v; ayarKaydet(); }),
    onay('Yeni kelime açılınca sesi kendiliğinden çal', a.otoSes, (v) => { a.otoSes = v; ayarKaydet(); })));

  const cd = h('div.kart', h('h3', 'Çevrimdışı kullanım'), h('p.alt-yazi', 'Ders sesleri ve hareket videoları internetsiz de çalışsın istiyorsan bir kez indir. (Uygulama dosyaları zaten otomatik saklanır.)'));
  const durum = h('p.alt-yazi', { 'aria-live': 'polite' }, 'Durum denetleniyor…');
  const dugme = h('button.dugme.cizgili', { type: 'button' }, simge('indir'), 'Sesleri ve videoları indir');
  dugme.addEventListener('click', async () => {
    dugme.disabled = true;
    try { await cevrimdisiIndir((n, t) => { durum.textContent = `İndiriliyor… ${n}/${t}`; }); durum.textContent = 'Sesler indirildi ✓'; }
    catch (e) { durum.textContent = 'İndirilemedi: ' + e.message; } finally { dugme.disabled = false; }
  });
  cevrimdisiDurum().then((s) => { durum.textContent = s; });
  cd.append(dugme, durum);
  kok.append(cd);

  const dosya = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  dosya.addEventListener('change', async () => {
    const f = dosya.files[0]; if (!f) return;
    try {
      const yedek = JSON.parse(await f.text());
      const sonuc = await store.yedekYukle(yedek);
      bildir(`Yedek birleştirildi (${sonuc.olay} kayıt)`);
      await icerik.yukle(); ayarlariUygula(); window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (e) { bildir('Yedek yüklenemedi: ' + e.message, 5000); }
  });
  const kul = store.kullanim();
  kok.append(h('div.kart', h('h3', 'Yedek'), h('p.alt-yazi', `Kayıt alanı: %${Math.round(kul.oran * 100)} dolu${kul.oran > 0.7 ? ' — yedek indirip raporunu da kaydetmeni öneririz; alan dolarken eski günlerin yalnız ayrıntısı sadeleşir.' : '.'}`), h('p.alt-yazi', 'Verilerin yalnız bu cihazın tarayıcısında saklanır. Düzenli yedek almanı öneririz; yedeği başka cihaza yükleyebilirsin (kayıtlar birleştirilir, hiçbiri silinmez).'),
    h('div.esnek', h('button.dugme.birincil', { type: 'button', onclick: () => yedekIndir(false) }, simge('indir'), 'Yedek indir'), h('button.dugme.cizgili', { type: 'button', onclick: () => yedekIndir(true) }, 'Ses kayıtlarıyla indir'), h('button.dugme.cizgili', { type: 'button', onclick: () => dosya.click() }, simge('yukle'), 'Yedekten yükle')), dosya));

  kok.append(esitleKarti());

  kok.append(h('div.kart.duz', h('h3', 'Tüm verileri sil'), h('p.alt-yazi', 'Bu cihazdaki tüm kayıtlar silinir. Önce yedek indirmeni öneririz.'),
    h('button.dugme.tehlike', { type: 'button', onclick: async () => {
      if (!confirm('Bu cihazdaki TÜM kayıtlar silinecek. Emin misin?')) return;
      store.sifirla(); try { for (const k of await store.depo.anahtarlar('kayitlar')) await store.depo.sil('kayitlar', k); } catch { /* */ }
      location.hash = '#/bugun'; location.reload();
    } }, simge('sil'), 'Her şeyi sil')));
  kok.append(h('p.alt-yazi', { style: 'text-align:center' }, `Öğrenme Defteri ${store.SURUM}`));
  return kok;
}

function onay(etiket, deger, degisti) {
  const cb = h('input', { type: 'checkbox', checked: deger ? true : null });
  cb.addEventListener('change', () => degisti(cb.checked));
  return h('label.onay-satir', cb, h('span', etiket));
}

async function yedekIndir(sesli) {
  try {
    const yedek = await store.yedekOlustur({ sesler: sesli });
    const url = URL.createObjectURL(new Blob([JSON.stringify(yedek)], { type: 'application/json' }));
    const a = h('a', { href: url, download: `ogrenme-defteri-yedek-${bugun()}.json` });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (e) { bildir('Yedek alınamadı: ' + e.message); }
}

// ---------------- İçerik ----------------
function icerikSekmesi() {
  const ic = icerik.ic();
  const sonuc = icerik.durum.sonuc;
  const kok = h('div');
  kok.append(h('div.kart', h('h3', 'Yüklü içerik'),
    h('p.alt-yazi', `${ic.dersler.length} ders · ${ic.kelimeler.length} kelime · ${ic.haftalar.length} hafta · ${Math.max(0, ...ic.haftalar.flatMap((x) => x.gunler.map((g) => g.gun)))} gün`),
    h('ul.sade-liste', ic.paketler.map((p) => h('li', h('div.satir', h('div', h('strong', p.ad), h('div.alt-yazi', `${p.paket} · sürüm ${p.surum} · ${p.kaynak === 'kullanici' ? 'senin eklediğin' : 'uygulamayla gelen'}`)), h('span.bosluk'),
      p.kaynak === 'kullanici' ? h('button.dugme.kucuk.tehlike', { type: 'button', onclick: async () => { if (confirm(`"${p.ad}" paketi kaldırılsın mı? (İlerleme kayıtların silinmez.)`)) { await icerik.paketSil(p.paket); window.dispatchEvent(new HashChangeEvent('hashchange')); } } }, 'Kaldır') : null))))));
  kok.append(h('div.kart' + (sonuc.hata.length ? '.uyari' : '.duz'), h('h3', sonuc.hata.length ? `⚠️ ${sonuc.hata.length} içerik hatası` : '✅ İçerik tutarlı'),
    h('p.alt-yazi', sonuc.hata.length ? 'Aşağıdaki sorunlar giderilmeden bazı dersler yanlış çalışabilir.' : `Doğrulama temiz${sonuc.uyari.length ? `; ${sonuc.uyari.length} uyarı var` : ''}.`),
    sonuc.hata.length ? h('ul.liste-duz', sonuc.hata.slice(0, 20).map((x) => h('li', x))) : null,
    sonuc.uyari.length ? h('details.ac', h('summary', `${sonuc.uyari.length} uyarı`), h('ul.liste-duz', sonuc.uyari.slice(0, 40).map((x) => h('li', x)))) : null));

  const sonucAlani = h('div');
  const dosya = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  dosya.addEventListener('change', async () => {
    const f = dosya.files[0]; if (!f) return;
    sonucAlani.replaceChildren(h('p.alt-yazi', 'Denetleniyor…'));
    try {
      const r = await icerik.paketIceAktar(await f.text());
      sonucAlani.replaceChildren(h('div.kart', { style: 'background:var(--dogru-zemin)' }, h('strong', `✅ "${r.paket}" eklendi`), r.uyari.length ? h('ul.liste-duz', r.uyari.slice(0, 10).map((x) => h('li', x))) : null));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (e) {
      sonucAlani.replaceChildren(h('div.hata-kutu', h('strong', e.message), e.liste ? h('ul.liste-duz', e.liste.slice(0, 15).map((x) => h('li', x))) : null));
    }
  });
  kok.append(h('div.kart', h('h3', 'Yeni içerik paketi ekle'), h('p.alt-yazi', 'Yeni hafta, ders ya da kelime eklemek için hazır bir paket (.json) seç. Yüklemeden önce tutarlılığı denetlenir; hatalıysa hiçbir şey eklenmez. Mevcut ilerlemen etkilenmez.'),
    h('button.dugme.birincil', { type: 'button', onclick: () => dosya.click() }, simge('yukle'), 'Paket dosyası seç'), dosya, sonucAlani,
    h('details.ac', { style: 'margin-top:12px' }, h('summary', 'Paket nasıl hazırlanır?'), h('ol.liste-duz', h('li', 'Paket bir JSON dosyasıdır: kelimeler, dersler ve haftalar tek yerde yazılır.'), h('li', 'Cevap anahtarı yoktur: soruların doğru şıkkı her zaman ilk yazılan şıktır, uygulama karıştırır.'), h('li', 'Kelime bir kez tanımlanır; her derste kimliğiyle kullanılır.'), h('li', 'Ayrıntılı rehber: docs/ICERIK_EKLEME.md')))));
  return kok;
}

/** Bilgisayarla eşitleme (yapay zekâ asistanının MCP sunucusu için). Yalnız scripts/sunucu.mjs ile açılan uygulamada çalışır. */
function esitleKarti() {
  const a = esitleme.ayarOku();
  const belirtec = h('input.girdi', { type: 'password', value: a.belirtec, placeholder: 'Sunucunun yazdığı belirteç', 'aria-label': 'Eşitleme belirteci', autocomplete: 'off' });
  const durum = h('p.alt-yazi', { 'aria-live': 'polite' }, a.son ? `Son eşitleme: ${saatMetni(a.son)} (${goreceli(a.son.slice(0, 10))})` : 'Henüz eşitlenmedi.');
  const kaydet = () => { const y = esitleme.ayarOku(); y.belirtec = belirtec.value.trim(); esitleme.ayarYaz(y); };
  belirtec.addEventListener('change', kaydet);
  const dugme = h('button.dugme.cizgili', { type: 'button' }, 'Şimdi eşitle');
  dugme.addEventListener('click', async () => {
    kaydet(); dugme.disabled = true; durum.textContent = 'Gönderiliyor…';
    try { const r = await esitleme.esitle(); durum.textContent = `Eşitlendi ✓ (${saatMetni(r.tarih)})`; }
    catch (e) { durum.textContent = e.message; } finally { dugme.disabled = false; }
  });
  return h('div.kart.duz', h('h3', 'Yapay zekâ bağlantısı (isteğe bağlı)'),
    h('p.alt-yazi', 'Kaydını bilgisayarındaki yerel sunucuya gönderirsin; orada çalışan MCP sunucusu (scripts/mcp.mjs) raporunu ve seviyelerini bir yapay zekâ asistanına açar. Veri yalnız kendi sunucuna gider. Kurulum: docs/MCP.md'),
    belirtec, onay('Her değişiklikten sonra kendiliğinden eşitle', a.otomatik, (v) => { const y = esitleme.ayarOku(); y.otomatik = v; esitleme.ayarYaz(y); }), dugme, durum);
}
