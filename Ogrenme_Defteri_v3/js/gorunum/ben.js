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
  return store.olaylar((o) => o.tur === 'soru' && o.ilk);
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

  kok.append(h('div.kart.duz', h('h3', 'Rapor'), h('p.alt-yazi', 'Tüm sonuçlarını, yazdıklarını ve ölçümlerini tek bir yazı dosyası olarak al; öğretmenine ya da bir yapay zekâya göstererek değerlendirme isteyebilirsin.'),
    h('div.esnek', h('button.dugme.cizgili', { type: 'button', onclick: raporIndir }, simge('indir'), 'Raporu indir (.md)'), h('button.dugme.cizgili', { type: 'button', onclick: raporKopyala }, 'Kopyala'))));
  return kok;
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
export function raporMetni() {
  const d = store.al();
  const satir = [];
  const L = (s = '') => satir.push(s);
  L(`# Öğrenme Defteri raporu`); L();
  L(`- Kullanıcı: ${d.ad || '(adsız)'}`); L(`- Başlangıç: ${d.baslangic || '-'}`); L(`- Rapor tarihi: ${bugun()}`); L(`- Çalışılan gün sayısı: ${store.gunSayisi()}`); L();
  const qs = sorular();
  const dogru = qs.filter((o) => o.dogru).length;
  L(`## Genel`); L(`- Soru (ilk deneme): ${dogru}/${qs.length}${qs.length ? ` (%${yuzde(dogru, qs.length)})` : ''}`);
  const anlama = qs.filter((o) => /^(Sahne|Dinleme):/.test(o.bolum || ''));
  if (anlama.length) L(`- Dinleyip anlama: ${anlama.filter((o) => o.dogru).length}/${anlama.length} (%${yuzde(anlama.filter((o) => o.dogru).length, anlama.length)})`);
  L(); L(`## Dersler`);
  for (const [id, v] of Object.entries(d.dersler)) { const ders = icerik.ders(id); L(`- ${ders?.baslik || id}: ${v.toplam ? `${v.dogru}/${v.toplam} (%${v.yuzde})` : 'tamamlandı'} · ${v.deneme} deneme · son ${v.son}`); }
  const ser = store.olaylar((o) => o.tur === 'serbest');
  if (ser.length) { L(); L(`## Yazdıkların / konuşmaların`); for (const o of ser) L(`- [${o.g}] ${o.soru || o.id}: ${o.kip === 'ses' ? `(ses kaydı ${Math.round((o.sureMs || 0) / 1000)} sn)` : o.yanit}`); }
  const dis = store.olaylar((o) => o.tur === 'dis');
  if (dis.length) { L(); L(`## Dış uygulamalar`); for (const o of dis) L(`- [${o.g}] ${o.ad}: ${o.yapilmadi ? 'yapılmadı' : `${o.dogru ?? '?'}/${o.toplam ?? '?'}`}${o.not ? ' — ' + o.not : ''}`); }
  const spor = store.olaylar((o) => o.tur === 'spor');
  if (spor.length) { L(); L(`## Spor`); for (const o of spor) L(`- [${o.g}] zorlanma ${o.zorlanma ?? '-'}/10${o.destek ? ', destekli' : ''}${o.kismi ? ', kısmen' : ''}${o.not ? ' — ' + o.not : ''}`); }
  const olcek = store.olaylar((o) => o.tur === 'olcek');
  if (olcek.length) { L(); L(`## Ölçekler`); for (const o of olcek) L(`- [${o.g}] ${o.id}: ${o.deger}`); }
  const gec = store.olaylar((o) => o.tur === 'gecikmeli-yanit');
  if (gec.length) { L(); L(`## Gecikmeli hatırlama`); for (const o of gec) L(`- [${o.g}] ${o.kontrol}: ${o.dogru ? 'hatırladı' : 'hatırlamadı'}${o.yenidenBaktim ? ' (arada baktı)' : ''}${o.ayrinti ? ' — ' + o.ayrinti : ''}`); }
  return satir.join('\n');
}
function raporIndir() {
  const url = URL.createObjectURL(new Blob([raporMetni()], { type: 'text/markdown;charset=utf-8' }));
  const a = h('a', { href: url, download: `ogrenme-defteri-rapor-${bugun()}.md` });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
}
async function raporKopyala() {
  try { await navigator.clipboard.writeText(raporMetni()); bildir('Rapor panoya kopyalandı'); } catch { bildir('Kopyalanamadı; “indir” düğmesini kullan'); }
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
    secenekSatiri('Günlük tekrar adedi', [[10, '10'], [20, '20'], [30, '30']], a.gunlukTekrar, (v) => { a.gunlukTekrar = v; ayarKaydet(); }),
    onay('Sesleri varsayılan olarak yavaş çal', a.yavas, (v) => { a.yavas = v; ayarKaydet(); }),
    onay('Yeni kelime açılınca sesi kendiliğinden çal', a.otoSes, (v) => { a.otoSes = v; ayarKaydet(); })));

  const cd = h('div.kart', h('h3', 'Çevrimdışı kullanım'), h('p.alt-yazi', 'Ders sesleri internetsiz de çalsın istiyorsan bir kez indir. (Uygulama dosyaları zaten otomatik saklanır.)'));
  const durum = h('p.alt-yazi', { 'aria-live': 'polite' }, 'Durum denetleniyor…');
  const dugme = h('button.dugme.cizgili', { type: 'button' }, simge('indir'), 'Tüm sesleri indir');
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
  kok.append(h('div.kart', h('h3', 'Yedek'), h('p.alt-yazi', 'Verilerin yalnız bu cihazın tarayıcısında saklanır. Düzenli yedek almanı öneririz; yedeği başka cihaza yükleyebilirsin (kayıtlar birleştirilir, hiçbiri silinmez).'),
    h('div.esnek', h('button.dugme.birincil', { type: 'button', onclick: () => yedekIndir(false) }, simge('indir'), 'Yedek indir'), h('button.dugme.cizgili', { type: 'button', onclick: () => yedekIndir(true) }, 'Ses kayıtlarıyla indir'), h('button.dugme.cizgili', { type: 'button', onclick: () => dosya.click() }, simge('yukle'), 'Yedekten yükle')), dosya));

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
