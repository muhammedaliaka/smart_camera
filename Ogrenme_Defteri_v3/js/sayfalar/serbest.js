// Açık uçlu sayfalar: serbest yanıt (yazı/ses), listeler, gecikmeli hatırlama, hafıza sarayı.

import { h, simge, bildir, ekle } from '../ui.js';
import * as store from '../store.js';
import * as kayit from '../kaydedici.js';
import { karsilastir, listeKarsilastir, listeyeAyir, noktaVar, sozcukSayisi } from '../metin.js';
import { KONTROL_SURELERI } from '../dogrula.js';
import { zengin, p, sesDugme } from './ortak.js';
import { saatMetni } from '../zaman.js';

const YARDIM = [
  ['A0', 'Yardımsız'], ['A1', 'İpucu / araç'], ['A3', 'Kitap, sözlük, video'], ['A4', 'Yapay zekâ / çeviri aracı'],
];

function yardimSecici() {
  let secili = 'A0';
  const kap = h('div.yardim-cip', { role: 'group', 'aria-label': 'Yardım aldın mı?' });
  YARDIM.forEach(([kod, ad]) => {
    const c = h('button.cip', { type: 'button', 'aria-pressed': String(kod === secili) }, ad);
    c.addEventListener('click', () => { secili = kod; kap.querySelectorAll('.cip').forEach((x, i) => x.setAttribute('aria-pressed', String(YARDIM[i][0] === kod))); });
    kap.append(c);
  });
  kap.deger = () => secili;
  return kap;
}

function kayitKutusu() {
  const kap = h('div');
  let oturum = null, blob = null, sureMs = 0, sayac = null, url = null;
  const durum = h('span.alt-yazi', 'Kayda başlamak için düğmeye dokun.');
  const dugme = h('button.dugme.birincil', { type: 'button' }, simge('mikrofon'), 'Kaydı başlat');
  const oynat = h('audio', { controls: true, style: 'width:100%;margin-top:10px', hidden: true });
  const hata = h('div.hata-kutu', { hidden: true });
  dugme.addEventListener('click', async () => {
    hata.hidden = true;
    if (!oturum) {
      try { oturum = await kayit.baslat(); } catch (e) { hata.textContent = e.message; hata.hidden = false; return; }
      dugme.replaceChildren(simge('durdur'), 'Durdur');
      kap.classList.add('kaydediyor');
      sayac = setInterval(() => { durum.textContent = `● Kayıt sürüyor ${Math.floor(oturum.sure() / 1000)} sn`; }, 300);
    } else {
      clearInterval(sayac);
      const r = await oturum.durdur(); oturum = null;
      blob = r.blob; sureMs = r.sureMs;
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob); oynat.src = url; oynat.hidden = false;
      dugme.replaceChildren(simge('mikrofon'), 'Yeniden kaydet');
      durum.textContent = `Kayıt hazır (${Math.round(sureMs / 1000)} sn). Dinleyip kaydedebilir ya da yeniden kaydedebilirsin.`;
      kap.dispatchEvent(new CustomEvent('hazir'));
    }
  });
  kap.append(h('div.kayit-kutu', dugme, durum), oynat, hata);
  kap.al = () => (blob ? { blob, sureMs } : null);
  kap.birak = () => { clearInterval(sayac); try { oturum?.durdur(); } catch { /* */ } };
  return kap;
}

export const serbest = (sayfa, api) => {
  const a = sayfa.adim;
  const kip = a.kip || 'yaz';
  let mod = kip === 'ses' ? 'ses' : 'yaz';
  const kapsayici = h('div');
  const metinAlani = h('textarea.metin-alani', { 'aria-label': 'Yanıtın', placeholder: a.yerTutucu || 'Buraya yaz…', lang: a.dil === 'en' ? 'en' : 'tr', spellcheck: 'false' });
  const kutu = kip !== 'yaz' ? kayitKutusu() : null;
  const sayac = h('span.alt-yazi');
  let dil = a.dil || null;
  const dilSecici = a.dilSor ? (() => { const k = h('div.yardim-cip'); ['Türkçe', 'İngilizce', 'Karışık'].forEach((d) => { const c = h('button.cip', { type: 'button', 'aria-pressed': 'false' }, d); c.addEventListener('click', () => { dil = d; k.querySelectorAll('.cip').forEach((x) => x.setAttribute('aria-pressed', String(x === c))); }); k.append(c); }); return h('div', h('label.alan', 'Hangi dilde yanıtlıyorsun?'), k); })() : null;

  const sekmeler = kip === 'ikisi' ? h('div.sekmeler', { role: 'tablist' },
    ...[['yaz', '✍️ Yaz'], ['ses', '🎙️ Konuş']].map(([m, ad]) => { const s = h('button.sekme', { type: 'button', role: 'tab', 'aria-selected': String(m === mod) }, ad); s.addEventListener('click', () => { mod = m; sekmeler.querySelectorAll('.sekme').forEach((x, i) => x.setAttribute('aria-selected', String(['yaz', 'ses'][i] === m))); goster(); guncelle(); }); return s; })) : null;

  const goster = () => { metinAlani.hidden = mod !== 'yaz'; if (kutu) kutu.hidden = mod !== 'ses'; sayac.hidden = mod !== 'yaz'; };
  const hazirMi = () => (mod === 'yaz' ? metinAlani.value.trim().length > 0 : !!kutu?.al());
  const guncelle = () => {
    if (mod === 'yaz') sayac.textContent = metinAlani.value.trim() ? `${sozcukSayisi(metinAlani.value)} sözcük` : '';
    api.alt('Kaydet', kaydet, { devre: !hazirMi(), ikincil: { etiket: 'Bilmiyorum', fn: () => kaydet(true) } });
  };
  metinAlani.addEventListener('input', guncelle);
  kutu?.addEventListener('hazir', guncelle);

  let kaydedildi = false;
  const kaydet = async (bilmiyorum = false) => {
    if (kaydedildi) return;
    kaydedildi = true;
    kutu?.birak();
    const ev = { ders: api.dersId, id: sayfa.id, soru: a.soru, kip: bilmiyorum ? 'bilmiyorum' : mod, dil };
    let yanit = '';
    if (bilmiyorum) { ev.yanit = 'bilmiyorum'; }
    else if (mod === 'yaz') { yanit = metinAlani.value.trim(); ev.yanit = yanit; ev.sozcuk = sozcukSayisi(yanit); }
    else { const k = kutu.al(); ev.sureMs = k.sureMs; }
    const e = store.olay('serbest', ev);
    if (!bilmiyorum && mod === 'ses') {
      try { await store.depo.koy('kayitlar', e.i, kutu.al().blob); } catch { bildir('Ses kaydı cihazda saklanamadı; yazı ile de not düşebilirsin.'); }
    }
    kontrolEkrani({ bilmiyorum, yanit, olayId: e.i });
  };

  const kontrolEkrani = ({ bilmiyorum, yanit, olayId }) => {
    const yardim = yardimSecici();
    const secimler = [];
    const liste = h('div');
    (a.noktalar || []).forEach((n) => {
      const otomatik = yanit && noktaVar(yanit, n, { tr: a.dil !== 'en' });
      const cb = h('input', { type: 'checkbox', checked: otomatik ? true : null });
      secimler.push({ n, cb });
      liste.append(h('label.onay-satir', cb, h('span', n.ad)));
    });
    const govde = h('div',
      h('div.kart.uyari', { style: 'margin-top:14px' }, h('strong', bilmiyorum ? 'Bilmiyorum kaydedildi. ' : 'Yanıtın kaydedildi ✓ '), 'İlk yanıtın olduğu gibi saklanır.'),
      a.ornek ? h('div.kart.duz', h('h3', 'Örnek yanıt'), p(a.ornek), h('p.alt-yazi', 'Aynısını yazman gerekmez; başka yanıtlar da doğru olabilir.')) : null,
      a.noktalar?.length ? h('div', h('h3', { style: 'margin-top:14px' }, 'Yanıtında hangileri vardı?'), h('p.alt-yazi', 'Kendin işaretle; yazıda bulduklarımız önceden işaretlendi.'), liste) : null,
      a.yardimSor === false ? null : h('div', h('label.alan', 'Yardım aldın mı?'), yardim),
    );
    kapsayici.replaceChildren(govde);
    api.alt('Devam', () => {
      const var_ = secimler.filter((x) => x.cb.checked).length;
      if (secimler.length) api.nokta(var_, secimler.length);
      store.olay('serbest-kontrol', { ders: api.dersId, id: sayfa.id, olay: olayId, yardim: yardim.deger(), noktalar: secimler.length ? { var: var_, toplam: secimler.length, secilen: secimler.filter((x) => x.cb.checked).map((x) => x.n.ad) } : null, anahtarAcildi: a.ornek || a.noktalar ? 'elle' : null });
      api.ilerle();
    });
  };

  ekle(kapsayici, [
    sayfa.bolum ? h('div.iz-etiket', { style: 'margin-top:8px' }, sayfa.bolum) : null,
    h('div.soru-metni', zengin(a.soru)),
    a.ipucu ? h('div.ipucu', a.ipucu) : null,
    dilSecici, sekmeler, metinAlani, kutu, sayac,
  ]);
  goster(); guncelle();
  kapsayici.kapat = () => kutu?.birak();
  return kapsayici;
};

// ---- Liste sunma / hatırlama ----
export const listeSun = (sayfa, api) => {
  const a = sayfa.adim;
  const t0 = Date.now();
  api.alt(a.dugme || 'Hazırım — gizle', () => { store.olay('liste-sun', { ders: api.dersId, id: sayfa.id, sureMs: Date.now() - t0, tekrar: !!a.tekrar }); api.ilerle(); });
  return h('div',
    h('div.iz-etiket', { style: 'margin-top:10px' }, 'Sun ve ezberle'),
    h('h2', a.baslik || 'Listeyi oku'),
    a.yonerge ? p(a.yonerge) : p('Listeyi sırayla oku. Hazır olunca gizle; sonra bakmadan yazacaksın.'),
    a.liste.length === 1
      ? h('div.kelime-karti', h('div.en', a.liste[0]))
      : h('ol', { style: 'padding-left:0;list-style:none;display:grid;gap:8px;margin:12px 0' }, a.liste.map((x, i) => h('li.kart', { style: 'margin:0;padding:12px 16px;display:flex;gap:12px;align-items:center;font-weight:700;font-size:1.15rem' }, h('span.rozet', String(i + 1)), x))),
  );
};

export const listeHatirla = (sayfa, api) => {
  const a = sayfa.adim;
  const rota = sayfa.saray ? sarayBul(sayfa.saray) : null;
  const duraklar = rota?.duraklar || null;
  const girdiler = [];
  let alan;
  let yenidenBaktim = false;
  if (duraklar && duraklar.length >= sayfa.liste.length) {
    alan = h('div', duraklar.slice(0, sayfa.liste.length).map((d, i) => { const g = h('input.girdi', { type: 'text', autocomplete: 'off', 'aria-label': `${i + 1}. durak ${d}`, placeholder: 'Nesne' }); girdiler.push(g); return h('div', h('label.alan', `${i + 1}. durak: ${d}`), g); }));
  } else {
    const g = h('textarea.metin-alani', { 'aria-label': 'Hatırladığın öğeler', placeholder: 'Her satıra bir öğe yaz (sırayla)…' });
    girdiler.push(g); alan = g;
  }
  const al = () => (girdiler.length === 1 && girdiler[0].tagName === 'TEXTAREA' ? listeyeAyir(girdiler[0].value) : girdiler.map((g) => g.value.trim()));
  let kilitli = false;
  const kontrol = (bilmiyorum = false) => {
    if (kilitli) return; kilitli = true;
    const yanit = bilmiyorum ? [] : al();
    const r = listeKarsilastir(yanit, sayfa.liste);
    api.puanla({ adet: r.toplam, dogruAdet: r.var, yanit: yanit.join(', ') || 'bilmiyorum', dogruCevap: sayfa.liste.join(', '), soru: a.baslik || 'Liste', tekrarYok: true });
    store.olay('liste', { ders: api.dersId, id: sayfa.id, var: r.var, sirali: r.sirali, toplam: r.toplam, yanit, yenidenBaktim });
    girdiler.forEach((g) => { g.disabled = true; });
    alan.after(h('div.kart.duz', { style: 'margin-top:14px' }, h('h3', `${r.var}/${r.toplam} öğeyi hatırladın · ${r.sirali} tanesi doğru yerde`),
      h('ul.sade-liste', r.durumlar.map((d, i) => h('li', `${i + 1}. ${d.ad} `, d.var ? (d.yerinde ? h('span.rozet.dogru', 'doğru yerde') : h('span.rozet.uyari', 'var, yeri farklı')) : h('span.rozet.yanlis', 'hatırlanmadı'))))));
    api.alt('Devam', () => api.ilerle());
  };
  api.alt('Kontrol et', () => kontrol(), { ikincil: { etiket: 'Hatırlayamıyorum', fn: () => kontrol(true) } });
  const cb = h('input', { type: 'checkbox' });
  cb.addEventListener('change', () => { yenidenBaktim = cb.checked; });
  return h('div', h('div.iz-etiket', { style: 'margin-top:10px' }, sayfa.bolum),
    h('h2', sayfa.baslik || 'Listeyi hatırla'), rota && duraklar.length >= sayfa.liste.length ? h('p.alt-yazi', `Rota: ${rota.ad}`) : null, p(a.yonerge || 'Listeye bakmadan, hatırladığın kadarını sırayla yaz.'), alan,
    h('label.onay-satir', cb, h('span', 'Listeye yeniden baktım')));
};

// ---- Gecikmeli hatırlama ----
const KONTROL_AD = { '5dk': '5 dakika sonra', '30dk': '30 dakika sonra', '2sa': '2 saat sonra', '1gun': 'Yarın', '7gun': '1 hafta sonra' };
export const gecikmeli = (sayfa, api) => {
  const a = sayfa.adim;
  const simdi = Date.now();
  const satirlar = a.kontroller.map((k) => h('li', h('strong', KONTROL_AD[k]), ' ', h('span.alt-yazi', `(≈ ${saatMetni(new Date(simdi + KONTROL_SURELERI[k]).toISOString())}${KONTROL_SURELERI[k] >= 86400e3 ? ', ' + new Date(simdi + KONTROL_SURELERI[k]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''})`)));
  api.alt('Kapattım — hatırlatma kur', () => {
    store.gecikmeliKur({ id: store.yeniId(), ders: api.dersId, ref: a.ref, baslik: sayfa.baslik, soru: a.soru, anahtar: sayfa.liste, kontroller: a.kontroller.map((ad) => ({ ad, vade: Date.now() + KONTROL_SURELERI[ad], yapildi: false })) });
    store.olay('gecikmeli-kur', { ders: api.dersId, id: sayfa.id });
    bildir('Hatırlatmalar Bugün sayfasında görünecek.');
    api.ilerle();
  });
  return h('div',
    h('h2', { style: 'margin-top:12px' }, 'Şimdi bilgiyi unutmaya bırak'),
    p(a.yonerge || 'Bilgiye bir daha bakma. Aşağıdaki zamanlarda sana yalnız bir soru soracağım: ' + a.soru),
    h('div.kart.duz', h('ul.sade-liste', satirlar)),
    h('div.ipucu', 'Uygulama kapalıyken bildirim gönderemez. İstersen telefonun saatine bu zamanlar için alarm kur; uygulamayı açtığında hatırlatma Bugün sayfasında beklemeye devam eder.'),
  );
};

export const gecikmeliKontrol = (sayfa, api) => {
  const { g, k } = sayfa;
  const tekil = g.anahtar.length === 1;
  const girdi = tekil ? h('input.girdi', { type: 'text', autocomplete: 'off', 'aria-label': 'Yanıtın' }) : h('textarea.metin-alani', { placeholder: 'Her satıra bir öğe (sırayla)…', 'aria-label': 'Yanıtın' });
  let yenidenBaktim = false, kilitli = false;
  const kontrol = (bilmiyorum = false) => {
    if (kilitli) return; kilitli = true; girdi.disabled = true;
    let dogru, ayrinti = '';
    const yanit = bilmiyorum ? '' : girdi.value.trim();
    if (tekil) { dogru = !bilmiyorum && karsilastir(yanit, g.anahtar, { tr: true }).durum !== 'yok'; }
    else { const r = listeKarsilastir(listeyeAyir(yanit), g.anahtar); dogru = r.var === r.toplam; ayrinti = `${r.var}/${r.toplam} öğe, ${r.sirali} doğru yerde`; }
    k.yapildi = true; k.yanit = yanit || 'bilmiyorum'; k.dogru = dogru; k.zaman = Date.now(); k.yenidenBaktim = yenidenBaktim;
    store.olay('gecikmeli-yanit', { ders: g.ders, kontrol: k.ad, id: g.id, dogru, yanit: k.yanit, yenidenBaktim, ayrinti, gecikmeSn: Math.round((Date.now() - k.vade) / 1000) });
    store.kaydet();
    api.bildirim({ tip: dogru ? 'dogru' : 'bilgi', baslik: dogru ? 'Hatırladın!' : 'Kaydedildi', metin: `Doğru yanıt: ${g.anahtar.join(', ')}${ayrinti ? ' · ' + ayrinti : ''}` });
  };
  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter' && tekil) kontrol(); });
  api.alt('Kontrol et', () => kontrol(), { ikincil: { etiket: 'Hatırlayamıyorum', fn: () => kontrol(true) } });
  const cb = h('input', { type: 'checkbox' }); cb.addEventListener('change', () => { yenidenBaktim = cb.checked; });
  return h('div', h('div.iz-etiket', { style: 'margin-top:10px' }, `Hatırlama · ${KONTROL_AD[k.ad] || k.ad}`), h('h2', g.soru),
    p('Bilgiye bakmadan yanıtla. Hatırlayamazsan bunu da kaydedebilirsin.'), girdi,
    h('label.onay-satir', cb, h('span', 'Bu arada bilgiye yeniden baktım')));
};

// ---- Hafıza sarayı ----
const ONERI_DURAK = ['Kapı', 'Ayakkabılık', 'Portmanto', 'Mutfak masası', 'Buzdolabı', 'Lavabo', 'Pencere', 'Koltuk', 'Yatak', 'Dolap', 'Balkon', 'Masa'];

/** Kayıtlı rotayı bulur. kimlik: true / boş → ilk rota; metin → o kimlikteki rota. */
export function sarayBul(kimlik) {
  const liste = store.al().saraylar;
  return typeof kimlik === 'string' ? liste.find((s) => s.id === kimlik) || null : liste[0] || null;
}
function sarayKaydet(kimlik, ad, duraklar) {
  const liste = store.al().saraylar;
  const kayit = { id: kimlik, ad, duraklar, t: new Date().toISOString() };
  const i = liste.findIndex((s) => s.id === kimlik);
  if (i >= 0) liste[i] = kayit; else liste.push(kayit);
  store.kaydet();
}

function sarayEditoru(a, kapat, mevcut = []) {
  const duraklar = mevcut.length ? [...mevcut] : [];
  const min = a.min || 6, max = a.max || 10;
  const liste = h('ol', { style: 'padding-left:0;list-style:none;margin:12px 0;display:grid;gap:8px' });
  const girdi = h('input.girdi', { type: 'text', placeholder: 'Duraklardan birini yaz (ör. Kapı)', 'aria-label': 'Yeni durak' });
  const ekleDugme = h('button.dugme.birincil', { type: 'button' }, 'Ekle');
  const durum = h('p.alt-yazi');
  const oneriKap = h('div.esnek', { style: 'margin:8px 0' });
  const ciz = () => {
    liste.replaceChildren(...duraklar.map((d, i) => h('li.kart', { style: 'margin:0;padding:8px 12px' }, h('div.satir',
      h('span.rozet', String(i + 1)), h('span', { style: 'flex:1;font-weight:700' }, d),
      h('button.dugme.kucuk.hayalet', { type: 'button', 'aria-label': 'Yukarı taşı', disabled: i === 0, onclick: () => { [duraklar[i - 1], duraklar[i]] = [duraklar[i], duraklar[i - 1]]; ciz(); } }, '↑'),
      h('button.dugme.kucuk.hayalet', { type: 'button', 'aria-label': 'Sil', onclick: () => { duraklar.splice(i, 1); ciz(); } }, '✕')))));
    durum.textContent = `${duraklar.length} durak. En az ${min}, en çok ${max} durak seç.`;
    oneriKap.replaceChildren(...(a.oneriler || ONERI_DURAK).filter((o) => !duraklar.includes(o)).slice(0, 8).map((o) => { const c = h('button.cip', { type: 'button' }, '+ ' + o); c.addEventListener('click', () => { if (duraklar.length < max) { duraklar.push(o); ciz(); } }); return c; }));
    kapat.ayarla(duraklar.length >= min && duraklar.length <= max);
  };
  const ekle = () => { const v = girdi.value.trim(); if (v && duraklar.length < max && !duraklar.some((d) => d.toLowerCase() === v.toLowerCase())) { duraklar.push(v); girdi.value = ''; ciz(); } };
  ekleDugme.addEventListener('click', ekle);
  girdi.addEventListener('keydown', (e) => { if (e.key === 'Enter') ekle(); });
  ciz();
  const el = h('div', h('div.satir', girdi, ekleDugme), oneriKap, liste, durum);
  el.deger = () => duraklar;
  return el;
}

export const sarayKur = (sayfa, api) => {
  const a = sayfa.adim;
  let editor;
  const kimlik = a.id || 'ev', ad = a.ad || 'Evim';
  const kaydet = () => {
    const d = editor.deger();
    sarayKaydet(kimlik, ad, d);
    store.olay('saray', { ders: api.dersId, rota: kimlik, duraklar: d });
    api.ilerle();
  };
  editor = sarayEditoru(a, { ayarla: (ok) => api.alt('Rotayı kaydet', kaydet, { devre: !ok }) }, sarayBul(kimlik)?.duraklar);
  return h('div', h('h2', { style: 'margin-top:12px' }, a.baslik || 'Rotanı kur'), h('p.alt-yazi', `Rota: ${ad}`),
    p(a.yonerge || 'Çok iyi bildiğin bir yerde (evinde) birbirine benzemeyen durakları, her zaman aynı yönde yürüyormuş gibi sırala.'), editor);
};

export const sarayYerlestir = (sayfa, api) => {
  const a = sayfa.adim;
  const saray = sarayBul(a.saray);
  if (!saray) {
    let editor;
    const sonra = () => { sarayKaydet(typeof a.saray === 'string' ? a.saray : 'ev', 'Evim', editor.deger()); api.yenile(); };
    editor = sarayEditoru({ min: Math.min(a.liste.length, 6) }, { ayarla: (ok) => api.alt('Rotayı kaydet', sonra, { devre: !ok }) });
    return h('div', h('h2', { style: 'margin-top:12px' }, 'Önce rotanı kur'), p('Bu alıştırma için duraklara ihtiyacın var.'), editor);
  }
  const alanlar = [];
  const satirlar = a.liste.map((nesne, i) => {
    const durak = saray.duraklar[i % saray.duraklar.length];
    const t = h('textarea.metin-alani', { style: 'min-height:84px', 'aria-label': `${durak} durağında ${nesne}`, placeholder: `${durak}: ${nesne} ile ne oluyor?` });
    alanlar.push(t);
    return h('div.kart', h('div.satir', h('span.rozet', String(i + 1)), h('strong', durak), h('span', '→'), h('strong', { style: 'color:var(--iz)' }, nesne)), t);
  });
  api.alt('Kaydet ve devam', () => {
    store.olay('saray-hayal', { ders: api.dersId, id: sayfa.id, hayaller: a.liste.map((n, i) => ({ nesne: n, durak: saray.duraklar[i % saray.duraklar.length], hayal: alanlar[i].value.trim() })) });
    api.ilerle();
  });
  return h('div', h('h2', { style: 'margin-top:12px' }, a.baslik || 'Nesneleri duraklara yerleştir'), h('p.alt-yazi', `Rota: ${saray.ad}`),
    p(a.yonerge || 'Her durakta nesneyle tuhaf, büyük ve hareketli bir olay hayal et; bir cümleyle yaz.'),
    h('details.ac', h('summary', 'İyi bir hayal nasıl olur?'), h('ul.liste-duz', [h('li', 'Büyük ya da abartılı (dev bir limon)'), h('li', 'Hareketli (zıplıyor, dönüyor, akıyor)'), h('li', 'Komik ya da tuhaf'), h('li', 'Duyularla (ses, koku, dokunma)')])),
    ...satirlar);
};
