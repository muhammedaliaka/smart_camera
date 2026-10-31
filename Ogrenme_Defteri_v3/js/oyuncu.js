// Ders oynatıcı: sayfaları sırayla gösterir, cevapları puanlar, yanlışları sona ekler, sonuç ekranını çizer.

import { h, simge, halka, bildir, temizle } from './ui.js';
import * as store from './store.js';
import * as icerik from './icerik.js';
import * as ses from './ses.js';
import { derle } from './derle.js';
import { CIZ } from './sayfalar/index.js';
import { sayfalarSn } from './sure.js';
import { xpToplami, oturumSonucu } from './oyun-ac.js';
import { komboGuncelle, komboMetni, komboTakdiri } from './oyunlastir.js';
import { sonucOyunKarti } from './gorunum/oyun-kart.js';

let aktif = null;

/** Rapora giren kısa, işaretsiz metin. */
const temiz = (m, n = 200) => String(m ?? '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().slice(0, n);

// Sayfanın öğrenciden ne istediği (kayıtta ve raporda "Görev" olarak görünür). Üreticiler sayfa.gorev ile ezebilir.
const GOREV = {
  mcq: 'Çoktan seçmeli soru', yaz: 'Türkçesi verilen kelimenin İngilizcesini yaz', eslestir: 'İngilizce kelimeleri Türkçe karşılıklarıyla eşle',
  cumle: 'Karışık sözcüklerden İngilizce cümleyi kur', dikte: 'Duyduğunu aynen yaz', sayi: 'Duyduğun sayıyı rakamla yaz',
  kartlar: 'Hafıza kartlarında İngilizce–Türkçe çiftleri bul', 'liste-hatirla': 'Listeyi bakmadan sırayla hatırlayıp yaz',
  'gecikmeli-kontrol': 'Bir süre önce öğrenilen bilgiyi bakmadan hatırla',
};

export function ctxOlustur(deneme = 0) {
  return {
    kelime: icerik.kelime,
    tumKelimeler: icerik.ic().kelimeler,
    sesler: icerik.ic().sesler,
    dis: (id) => icerik.idx().dis.get(id),
    hareket: (id) => icerik.idx().hareket.get(id),
    ders: (id) => icerik.ders(id),
    deneme,
  };
}

/** Bir dersi açar. opts: { donus, sonraki: () => ({etiket, href}), oturumBitti: (S) => void } */
export function dersAc(dersId, opts = {}) {
  const ders = icerik.ders(dersId);
  if (!ders) { bildir('Ders bulunamadı: ' + dersId); location.hash = opts.donus || '#/bugun'; return; }
  const dd = store.dersDurumu(dersId);
  const ctx = ctxOlustur(dd?.deneme || 0);
  const { sayfalar, ogrenilenKelimeler, srsListeleri } = derle(ders, ctx);
  oynat({
    id: dersId, baslik: ders.baslik, iz: ders.iz, olcum: ders.iz === 'olcum', sayfalar, ctx, donus: opts.donus || '#/bugun',
    sonraki: opts.sonraki, oturumBitti: opts.oturumBitti, ogrenilenKelimeler, srsListeleri, dersMi: true, hedef: ders.hedef, emoji: ders.emoji,
  });
}

/** Genel oynatıcı (ders, tekrar oturumu ve oyunlar için). */
export function oynat(o) {
  kapat();
  const S = {
    ...o, i: 0, puan: { dogru: 0, toplam: 0, nokta: { var: 0, toplam: 0 }, bolumler: new Map() },
    yanlislar: [], sayfalar: o.sayfalar.slice(), bitti: false, baslangic: Date.now(), disSonuc: [],
    kombo: 0, enUzunKombo: 0, xp0: o.kaydetme ? null : xpToplami(),
  };
  const devamAnahtar = 'devam:' + S.id;
  if (S.dersMi) {
    const kayit = store.al().notlar[devamAnahtar];
    if (kayit && kayit.i > 0 && kayit.i < S.sayfalar.length && kayit.deneme === S.ctx.deneme) { S.i = 0; S.devamTeklif = kayit.i; }
    else store.dersiBaslat(S.id, { dersAd: S.baslik, iz: S.iz || null });
  }
  const kok = h('div.oyuncu', { role: 'dialog', 'aria-modal': 'true', 'aria-label': S.baslik, data: { iz: S.iz || '' } });
  const kapatDugme = h('button.dugme.ikon-dugme', { type: 'button', 'aria-label': 'Dersten çık' }, simge('x'));
  const cubukEl = h('div.cubuk', { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i'));
  const komboEl = h('span.kombo', { hidden: true, 'aria-live': 'polite' });
  const ic = h('div.oyuncu-ic', { id: 'oyuncu-ic', tabindex: '-1' });
  const alt = h('div.oyuncu-alt', h('div.ic'));
  kok.append(h('div.oyuncu-ust', kapatDugme, cubukEl, komboEl), ic, alt);
  document.body.append(kok);
  document.body.style.overflow = 'hidden';
  let onceki = null, sheet = null;

  const ilerlemeCiz = () => {
    const yuzde = S.bitti ? 100 : (S.i / Math.max(1, S.sayfalar.length)) * 100;
    cubukEl.firstChild.style.width = yuzde + '%';
    cubukEl.setAttribute('aria-valuenow', String(Math.round(yuzde)));
  };

  /** Art arda ilk denemede doğru sayısı (🔥). 3'ten itibaren görünür; eşiklerde kısa bir takdir cümlesi çıkar. Yanlışta sessizce sıfırlanır, ceza yok. */
  const komboCiz = (yeni) => {
    const arttı = yeni > S.kombo;
    S.kombo = yeni; S.enUzunKombo = Math.max(S.enUzunKombo, yeni);
    const metin = komboMetni(yeni);
    komboEl.hidden = !metin;
    if (!metin) { komboEl.replaceChildren(); return; }
    const takdir = arttı ? komboTakdiri(yeni) : '';
    komboEl.replaceChildren(metin, ...(takdir ? [h('span.takdir', takdir)] : []));
    komboEl.setAttribute('aria-label', `${yeni} doğru üst üste${takdir ? '. ' + takdir : ''}`);
    komboEl.classList.remove('pop'); void komboEl.offsetWidth; komboEl.classList.add('pop');
  };

  const altYaz = (etiket, fn, { devre = false, ikincil = null } = {}) => {
    const ic2 = alt.firstChild;
    ic2.replaceChildren();
    if (ikincil) ic2.append(h('button.dugme.cizgili.ikincil', { type: 'button', onclick: ikincil.fn }, ikincil.etiket));
    const b = h('button.dugme.birincil', { type: 'button', disabled: devre || null, onclick: fn }, etiket);
    ic2.append(b);
  };

  const sheetKaldir = () => { sheet?.remove(); sheet = null; alt.hidden = false; };
  const bildirimGoster = ({ tip, baslik, metin, govde, etiket }) => {
    sheetKaldir();
    const ikon = tip === 'dogru' ? simge('tik') : tip === 'yanlis' ? simge('x') : simge('bilgi');
    const devam = h('button.dugme', { type: 'button', onclick: () => { sheetKaldir(); api.ilerle(); } }, etiket || 'Devam');
    sheet = h('div.geri-bildirim.' + tip, { role: 'status' }, h('div.ic', h('h3', ikon, baslik), govde || (metin ? h('p', metin) : null), devam));
    document.body.append(sheet);
    alt.hidden = true;
    setTimeout(() => devam.focus({ preventScroll: true }), 50);
  };

  /**
   * Bir yanıtı kaydeder. baglam (isteğe bağlı) rapor için ek bilgi: { soru, duyulan, secenekler } —
   * soru metni, dinlenen ses yazısı ve ekranda gösterilen seçenekler.
   */
  const puanla = ({ dogru, yanit, dogruCevap, soru, adet, dogruAdet, tekrarYok, ayrinti, baglam }) => {
    const sayfa = S.sayfalar[S.i];
    const ilk = !sayfa.tekrar;
    const dogruMu = adet != null ? dogruAdet === adet : !!dogru;
    if (ilk && sayfa.puan) {
      const n = adet != null ? adet : 1, d = adet != null ? dogruAdet : (dogru ? 1 : 0);
      S.puan.toplam += n; S.puan.dogru += d;
      const b = S.puan.bolumler.get(sayfa.bolum || 'Genel') || { dogru: 0, toplam: 0 };
      b.dogru += d; b.toplam += n; S.puan.bolumler.set(sayfa.bolum || 'Genel', b);
    }
    if (sayfa.puan && !S.olcum) komboCiz(komboGuncelle(S.kombo, { ilk, dogru: dogruMu }));
    const bg = baglam || {};
    const secenekler = Array.isArray(bg.secenekler) ? bg.secenekler.slice(0, 6).map((x) => temiz(x, 60)) : null;
    store.olay('soru', {
      ders: S.id, id: sayfa.id, bolum: sayfa.bolum || null, dogru: dogruMu, ilk, yanit: temiz(yanit),
      ...(!sayfa.puan ? { puansiz: true } : {}),
      ...(!dogruMu && secenekler ? { sec: secenekler } : {}),
      ...(ayrinti ? { ayrinti } : {}),
    }, {
      dersAd: S.baslik, iz: S.iz || null, tur: sayfa.t, gorev: sayfa.gorev || GOREV[sayfa.t] || null, bolum: sayfa.bolum || null,
      soru: temiz(bg.soru ?? soru), dogruCevap: temiz(dogruCevap), duyulan: bg.duyulan ? temiz(bg.duyulan, 160) : null,
    });
    if (ilk && !dogruMu && sayfa.puan) S.yanlislar.push({ soru, dogruCevap, yanit, bolum: sayfa.bolum });
    if (S.srsModu && ilk && sayfa.maddeId) store.maddeCevapla(sayfa.maddeId, dogruMu);
    if (ilk && !dogruMu && sayfa.puan && !tekrarYok && !S.olcum && !S.tekrarYok) S.sayfalar.push({ ...sayfa, tekrar: true });
  };

  const api = {
    ctx: S.ctx, dersId: S.id,
    alt: altYaz,
    ilerle: () => ilerle(),
    puanla,
    /** Sayfaya özgü bir kaydı (spor, ölçek, hayal...) ders ve bölüm bilgisiyle birlikte deftere yazar. veri: olayın değişken kısmı; baglam: sabit açıklama. */
    kaydet: (tur, veri = {}, baglam = {}) => {
      const sayfa = S.sayfalar[S.i] || {};
      return store.olay(tur, { ders: S.id, id: sayfa.id, ...veri }, { dersAd: S.baslik, iz: S.iz || null, bolum: sayfa.bolum || null, ...baglam });
    },
    bildirim: bildirimGoster,
    /** Sayfanın oturum sonucuna eklediği bilgi (ör. spor: kısmen, zorlanma); oturumBitti kancası S.sonuc olarak okur. */
    sonuc: (v) => { S.sonuc = { ...(S.sonuc || {}), ...v }; },
    nokta: (v, t) => { S.puan.nokta.var += v; S.puan.nokta.toplam += t; },
    dis: (d, t) => S.disSonuc.push({ d, t }),
    yenile: () => goster(),
  };

  const goster = () => {
    sheetKaldir();
    ses.durdur();
    onceki?.kapat?.();
    temizle(ic);
    ilerlemeCiz();
    const sayfa = S.sayfalar[S.i];
    const ciz = CIZ[sayfa.t];
    const sarmal = h('div.oyuncu-sayfa');
    alt.firstChild.replaceChildren();
    try {
      if (!ciz) throw new Error('Sayfa türü yok: ' + sayfa.t);
      const el = ciz(sayfa, api);
      onceki = el;
      sarmal.append(el);
      if (sayfa.metinRef && S.metinler?.[sayfa.metinRef]) sarmal.append(metinAc(S.metinler[sayfa.metinRef]));
    } catch (e) {
      console.error(e);
      sarmal.append(h('div.hata-kutu', 'Bu sayfa açılamadı: ' + e.message));
      altYaz('Atla', () => ilerle());
    }
    if (!alt.firstChild.firstChild) altYaz('Devam', () => ilerle());
    ic.append(sarmal);
    ic.scrollTop = 0;
    if (S.dersMi) { store.al().notlar[devamAnahtar] = { i: S.i, deneme: S.ctx.deneme }; store.kaydet(); }
  };

  const ilerle = () => {
    S.i++;
    if (S.i >= S.sayfalar.length) return bitir();
    goster();
  };

  const bitir = () => {
    sheetKaldir();
    ses.durdur();
    onceki?.kapat?.();
    S.bitti = true;
    ilerlemeCiz();
    if (S.dersMi && !S.kaydetme) {
      store.dersiBitir(S.id, { dogru: S.puan.dogru, toplam: S.puan.toplam, bolumler: [...S.puan.bolumler.entries()].map(([ad, b]) => [ad, b.dogru, b.toplam]) }, { dersAd: S.baslik, iz: S.iz || null });
      for (const id of S.ogrenilenKelimeler || []) store.maddeEkle('k:' + id);
      for (const id of S.srsListeleri || []) store.maddeEkle(id);
      delete store.al().notlar[devamAnahtar];
      store.kaydetHemen();
    }
    if (S.oturumBitti) S.oturumBitti(S);
    sureKaydet();
    if (S.xp0 != null) { try { S.oyun = oturumSonucu(S.xp0); } catch (e) { console.warn('oyunlaştırma hesaplanamadı', e); } }
    temizle(ic);
    ic.append(h('div.oyuncu-sayfa', sonucEkrani(S, { yanlisTekrar })));
    alt.hidden = false;
    const sonraki = S.sonraki?.();
    alt.firstChild.replaceChildren(
      ...(sonraki ? [h('button.dugme.cizgili.ikincil', { type: 'button', onclick: () => cikis() }, 'Kapat'), h('a.dugme.birincil', { href: sonraki.href }, sonraki.etiket)]
        : [h('button.dugme.birincil', { type: 'button', onclick: () => cikis() }, S.bitisEtiketi || 'Tamam')]));
  };

  /** Oturumun gerçek süresi ("sure" olayı): Bugün ekranındaki dakika tahminini öğrencinin hızına göre ayarlamak ve odak süresini önermek için. */
  const sureKaydet = () => {
    const sn = Math.round((Date.now() - S.baslangic) / 1000);
    if (S.sureYok || sn < 20 || sn > 7200) return;
    store.olay('sure', { ders: S.id, iz: S.iz || null, sn, tahmin: S.devamTeklif ? null : sayfalarSn(o.sayfalar), kaynak: S.dersMi ? 'ders' : 'oturum' });
    store.kaydetHemen();
  };

  const yanlisTekrar = () => {
    const yanlisIds = new Set(S.yanlislar.map((y) => y.soru));
    const sayfalar = o.sayfalar.filter((s) => s.puan && yanlisIds.has(s.soru)).map((s) => ({ ...s, tekrar: true }));
    if (!sayfalar.length) return;
    oynat({ ...o, id: S.id + ':yanlislar', baslik: S.baslik + ' · yanlışlar', sayfalar, dersMi: false, kaydetme: true, srsModu: false, ogrenilenKelimeler: [], srsListeleri: [], oturumBitti: null, bitisEtiketi: 'Tamam' });
  };

  const cikis = () => {
    kapat();
    const hedef = S.donus || '#/bugun';
    if (location.hash !== hedef) location.replace(hedef); else window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  kapatDugme.addEventListener('click', () => {
    if (S.bitti) return cikis();
    sheetKaldir();
    sheet = h('div.geri-bildirim.bilgi', { role: 'alertdialog' }, h('div.ic', h('h3', 'Dersten çıkıyor musun?'), h('p', S.dersMi ? 'Kaldığın yer saklanır; istediğin zaman devam edebilirsin.' : 'Bu oturum yarım kalır.'),
      h('div.esnek', h('button.dugme.cizgili', { type: 'button', style: 'flex:1', onclick: () => { sheetKaldir(); } }, 'Devam et'), h('button.dugme.birincil', { type: 'button', style: 'flex:1;background:var(--yanlis)', onclick: () => cikis() }, 'Çık'))));
    document.body.append(sheet); alt.hidden = true;
  });
  const tus = (e) => { if (e.key === 'Escape' && !S.bitti) kapatDugme.click(); };
  document.addEventListener('keydown', tus);

  aktif = { kapat: () => { document.removeEventListener('keydown', tus); sheetKaldir(); ses.durdur(); onceki?.kapat?.(); kok.remove(); document.body.style.overflow = ''; aktif = null; } };

  if (S.devamTeklif) {
    ic.append(h('div.oyuncu-sayfa', h('div.sonuc', h('div.buyuk-emoji', '📌'), h('h2', 'Kaldığın yerden devam edelim mi?'), h('p.alt-yazi', `${S.baslik} · ${S.devamTeklif}/${S.sayfalar.length}. sayfada kalmıştın.`))));
    alt.firstChild.append(h('button.dugme.cizgili', { type: 'button', onclick: () => { S.i = 0; goster(); } }, 'Baştan başla'), h('button.dugme.birincil', { type: 'button', onclick: () => { S.i = S.devamTeklif; goster(); } }, 'Devam et'));
    ilerlemeCiz();
  } else goster();
  return S;
}

export function kapat() { aktif?.kapat(); }
export const acikMi = () => !!aktif;

function metinAc(adim) {
  return h('details.ac', { style: 'margin-top:16px' }, h('summary', 'Metni göster'), h('div.metin-blok', adim.metin.map((m) => h('p', m))));
}

/** Seviye kartı: oturumun seviyeye etkisi (S.seviyeSonucu, seviye-ac.js kurar). */
function seviyeKarti(r) {
  const renk = r.tur === 'yukari' ? 'vurgulu' : 'duz';
  return h('div.kart.' + renk + '.seviye-karti', { style: 'text-align:left', data: { tur: r.tur } },
    h('h3', { style: 'margin:0 0 6px' }, (r.tur === 'yukari' ? '⬆️ ' : r.tur === 'asagi' ? '⬇️ ' : '📊 ') + r.baslik),
    ...r.satirlar.map((s) => h('p', { style: 'margin:4px 0' }, s)));
}

function sonucEkrani(S, { yanlisTekrar }) {
  const { dogru, toplam, bolumler, nokta } = S.puan;
  const kap = h('div.sonuc');
  if (S.seviyeSonucu) kap.append(seviyeKarti(S.seviyeSonucu));
  const oyunKarti = sonucOyunKarti(S.oyun, S.enUzunKombo); // yüzdenin hemen altında: ödül, ayrıntı listelerinden önce görünsün
  if (toplam > 0) {
    const yuzde = Math.round((dogru / toplam) * 100);
    const r = 54, c = 2 * Math.PI * r;
    const halkaEl = h('div.buyuk-halka', { role: 'img', 'aria-label': `%${yuzde}` });
    halkaEl.innerHTML = `<svg viewBox="0 0 128 128" aria-hidden="true"><circle class="arka" cx="64" cy="64" r="${r}"/><circle class="on" cx="64" cy="64" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}"/></svg>`;
    halkaEl.append(h('b', `%${yuzde}`));
    requestAnimationFrame(() => requestAnimationFrame(() => { const on = halkaEl.querySelector('.on'); if (on) on.style.strokeDashoffset = String(c * (1 - yuzde / 100)); }));
    kap.append(h('div.iz-etiket', S.baslik), h('h2', yuzde >= 80 ? 'Çok iyi gitti!' : yuzde >= 50 ? 'İyi bir ilerleme' : 'Bu kez zordu, tekrar edince oturacak'),
      halkaEl, h('p', { style: 'font-size:1.15rem;font-weight:700' }, `${dogru} / ${toplam} soruyu ilk denemede bildin`),
      h('p.alt-yazi', 'Yanlışlar dersin sonunda yeniden soruldu; yüzde yalnız ilk denemeleri sayar.'));
    if (oyunKarti) kap.append(oyunKarti);
    if (bolumler.size > 1) {
      kap.append(h('div.kart.duz', { style: 'text-align:left' }, h('h3', 'Bölümlere göre'), ...[...bolumler.entries()].map(([ad, b]) => {
        const y = Math.round((b.dogru / b.toplam) * 100);
        const sahne = ad.startsWith('Sahne:') || ad.startsWith('Dinleme:') || ad.startsWith('Okuma:');
        return h('div', { style: 'margin:10px 0' }, h('div.satir', h('span', ad), h('span.bosluk'), h('strong', sahne ? `%${y} anladın · ${b.dogru}/${b.toplam}` : `${b.dogru}/${b.toplam}`)), h('div.cubuk', h('i', { style: `width:${y}%` })));
      })));
    }
  } else {
    kap.append(h('div.buyuk-emoji', S.emoji || '✅'), h('h2', 'Tamamlandı'), h('p.alt-yazi', S.hedef || 'Kaydın saklandı.'));
    if (oyunKarti) kap.append(oyunKarti);
  }
  if (nokta.toplam) kap.append(h('div.kart.duz', { style: 'text-align:left' }, h('strong', `Anahtar noktalar: ${nokta.var}/${nokta.toplam}`), h('p.alt-yazi', { style: 'margin:4px 0 0' }, 'Bunu sen işaretledin; puan değil, kendi kontrolündür.')));
  if (S.disSonuc.length) { const d = S.disSonuc.reduce((a, x) => a + x.d, 0), t = S.disSonuc.reduce((a, x) => a + x.t, 0); kap.append(h('div.kart.duz', h('strong', `Dış uygulama sonucun: ${d}/${t} (%${Math.round(d / t * 100)})`))); }
  if (S.yanlislar.length) {
    kap.append(h('div.hata-listesi', h('h3', 'Tekrar bakılacaklar'), ...S.yanlislar.slice(0, 12).map((y) => h('div.kart', { style: 'padding:10px 14px' }, h('div.alt-yazi', y.soru), h('div', { style: 'font-weight:700' }, '✔ ', y.dogruCevap), y.yanit && y.yanit !== y.dogruCevap ? h('div.alt-yazi', 'Senin yanıtın: ' + y.yanit) : null))));
    kap.append(h('button.dugme.cizgili.tam', { type: 'button', onclick: yanlisTekrar }, simge('yenile'), 'Yanlışları yeniden çöz'));
  }
  return kap;
}
