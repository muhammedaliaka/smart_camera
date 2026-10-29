// Kayıt katmanı. Her şey tek bir "olay defteri" olarak tutulur (silinmez, sadece eklenir);
// ilerleme, tekrar takvimi ve rapor bu defterden ve küçük bir özet durumdan okunur.
// Küçük veriler localStorage'da, ses kayıtları ve içe aktarılan paketler IndexedDB'dedir.

import { bugun, simdiISO, gunEkle } from './zaman.js';
import * as srsModul from './srs.js';

const ANAHTAR = 'od3.durum';
export const SURUM = '3.0.0';

function bos() {
  return {
    v: 3, ad: '', baslangic: null,
    ayar: { tema: 'oto', yazi: 'orta', yavas: false, gunlukTekrar: 20, otoSes: true },
    olaylar: [],
    dersler: {},      // dersId -> { bitti, deneme, son, dogru, toplam, enIyi }
    srs: {},          // maddeId -> srs.js durum
    gecikmeli: [],    // zamanlı hatırlama kontrolleri
    saraylar: [],     // hafıza sarayı güzergâhları
    oyunlar: {},      // oyunId -> { enIyi, oynama }
    notlar: {},
  };
}

let durum = bos();
let bellekte = false;
const dinleyiciler = new Set();

export function yukle() {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    if (ham) durum = { ...bos(), ...JSON.parse(ham) };
  } catch (e) { bellekte = true; console.warn('localStorage okunamadı; bellekte çalışılıyor', e); }
  return durum;
}

let bekleyenKayit = 0;
export function kaydet() {
  clearTimeout(bekleyenKayit);
  bekleyenKayit = setTimeout(kaydetHemen, 120);
}
export function kaydetHemen() {
  clearTimeout(bekleyenKayit);
  try { localStorage.setItem(ANAHTAR, JSON.stringify(durum)); }
  catch (e) { bellekte = true; console.warn('Kaydedilemedi', e); }
  dinleyiciler.forEach((f) => f());
}
export function degisinceDinle(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }
export function kayitGuvenli() { return !bellekte; }
export function al() { return durum; }
export function degistir(yeni) { durum = { ...bos(), ...yeni }; kaydetHemen(); }
export function sifirla() { durum = bos(); kaydetHemen(); }

let sayac = 0;
export function yeniId() { return Date.now().toString(36) + (sayac++).toString(36) + Math.random().toString(36).slice(2, 5); }

/** Olay defterine ekler. tur: 'ders-basla' | 'soru' | 'serbest' | 'srs' | 'oyun' | 'dis' | 'spor' | ... */
export function olay(tur, veri = {}) {
  const o = { i: yeniId(), t: simdiISO(), g: bugun(), tur, ...veri };
  durum.olaylar.push(o);
  kaydet();
  return o;
}

// ---- Ders durumu ----
export function dersDurumu(id) { return durum.dersler[id] || null; }
export function dersBitti(id) { return !!durum.dersler[id]?.bitti; }
export function dersiBitir(id, { dogru = 0, toplam = 0 } = {}) {
  const e = durum.dersler[id] || { deneme: 0 };
  const yuzde = toplam ? Math.round((dogru / toplam) * 100) : null;
  durum.dersler[id] = {
    bitti: true, deneme: e.deneme + 1, son: bugun(), dogru, toplam, yuzde,
    enIyi: yuzde == null ? null : Math.max(e.enIyi ?? 0, yuzde),
  };
  olay('ders-bitir', { ders: id, dogru, toplam, yuzde });
}
export function dersiBaslat(id) {
  olay('ders-basla', { ders: id });
}

// ---- Tekrar kuyruğu ----
export function maddeEkle(id, ogrenmeGunu = bugun()) {
  if (durum.srs[id]) return false;
  durum.srs[id] = srsModul.yeniMadde(ogrenmeGunu);
  kaydet();
  return true;
}
export function maddeCevapla(id, dogru) {
  const m = durum.srs[id];
  if (!m) return null;
  durum.srs[id] = srsModul.cevapla(m, dogru, bugun());
  olay('srs', { madde: id, dogru, kutu: durum.srs[id].k, sonraki: durum.srs[id].s });
  return durum.srs[id];
}
export function vadesiGelenler(bugunS = bugun()) {
  return Object.entries(durum.srs).filter(([, m]) => srsModul.vadesiGeldi(m, bugunS)).sort((a, b) => a[1].s.localeCompare(b[1].s)).map(([id]) => id);
}

// ---- Gecikmeli hatırlama (5 dk / 30 dk / 2 saat / ertesi gün / 1 hafta) ----
export function gecikmeliKur(kayit) { durum.gecikmeli.push(kayit); kaydet(); return kayit; }
export function gecikmeliVadesi(simdiMs = Date.now()) {
  const sonuc = [];
  for (const g of durum.gecikmeli) for (const k of g.kontroller) if (!k.yapildi && k.vade <= simdiMs) sonuc.push({ g, k });
  return sonuc.sort((a, b) => a.k.vade - b.k.vade);
}
export function gecikmeliBekleyen() {
  const s = [];
  for (const g of durum.gecikmeli) for (const k of g.kontroller) if (!k.yapildi) s.push({ g, k });
  return s.sort((a, b) => a.k.vade - b.k.vade);
}

// ---- Genel yardımcılar ----
export function olaylar(filtre = () => true) { return durum.olaylar.filter(filtre); }
export function gunSayisi() { return new Set(durum.olaylar.map((o) => o.g)).size; }
export function seri(bugunS = bugun()) {
  const gunler = new Set(durum.olaylar.filter((o) => ['ders-bitir', 'srs', 'oyun', 'soru'].includes(o.tur)).map((o) => o.g));
  let n = 0, g = bugunS;
  if (!gunler.has(g)) g = gunEkle(g, -1);
  while (gunler.has(g)) { n++; g = gunEkle(g, -1); }
  return n;
}

// ---- IndexedDB: ses kayıtları + içe aktarılan paketler ----
let dbSoz = null;
function dbAc() {
  if (dbSoz) return dbSoz;
  dbSoz = new Promise((coz, red) => {
    if (typeof indexedDB === 'undefined') return red(new Error('IndexedDB yok'));
    const istek = indexedDB.open('od3', 1);
    istek.onupgradeneeded = () => { const d = istek.result; d.createObjectStore('kayitlar'); d.createObjectStore('paketler'); };
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => red(istek.error);
  });
  return dbSoz;
}
async function islem(depo, mod, f) {
  const db = await dbAc();
  return new Promise((coz, red) => {
    const t = db.transaction(depo, mod);
    const r = f(t.objectStore(depo));
    t.oncomplete = () => coz(r?.result);
    t.onerror = () => red(t.error);
  });
}
export const depo = {
  koy: (ad, anahtar, deger) => islem(ad, 'readwrite', (s) => s.put(deger, anahtar)),
  al: (ad, anahtar) => islem(ad, 'readonly', (s) => s.get(anahtar)),
  sil: (ad, anahtar) => islem(ad, 'readwrite', (s) => s.delete(anahtar)),
  anahtarlar: (ad) => islem(ad, 'readonly', (s) => s.getAllKeys()),
  hepsi: async (ad) => {
    const ks = await islem(ad, 'readonly', (s) => s.getAllKeys());
    const out = [];
    for (const k of ks) out.push([k, await islem(ad, 'readonly', (s) => s.get(k))]);
    return out;
  },
};

// ---- Yedek ----
export async function yedekOlustur({ sesler = false } = {}) {
  const paket = { tur: 'od3-yedek', surum: SURUM, tarih: simdiISO(), durum, paketler: [], kayitlar: {} };
  try { paket.paketler = (await depo.hepsi('paketler')).map(([, v]) => v); } catch { /* IDB yoksa */ }
  if (sesler) {
    try {
      for (const [k, blob] of await depo.hepsi('kayitlar')) paket.kayitlar[k] = await blobToDataUrl(blob);
    } catch { /* yok */ }
  }
  return paket;
}
function blobToDataUrl(blob) {
  return new Promise((coz, red) => { const r = new FileReader(); r.onload = () => coz(r.result); r.onerror = red; r.readAsDataURL(blob); });
}
async function dataUrlToBlob(u) { const r = await fetch(u); return r.blob(); }

/** Yedeği birleştirerek yükler: var olan kayıtlar silinmez, olay kimliği aynıysa tekrar eklenmez. */
export async function yedekYukle(yedek, { degistirme = false } = {}) {
  if (!yedek || yedek.tur !== 'od3-yedek' || !yedek.durum) throw new Error('Bu dosya bir Öğrenme Defteri yedeği değil.');
  if (degistirme) { durum = { ...bos(), ...yedek.durum }; }
  else {
    const var_ = new Set(durum.olaylar.map((o) => o.i));
    for (const o of yedek.durum.olaylar || []) if (!var_.has(o.i)) durum.olaylar.push(o);
    durum.olaylar.sort((a, b) => a.t.localeCompare(b.t));
    for (const [id, d] of Object.entries(yedek.durum.dersler || {})) {
      const e = durum.dersler[id];
      if (!e || (d.deneme || 0) > (e.deneme || 0)) durum.dersler[id] = d;
    }
    for (const [id, m] of Object.entries(yedek.durum.srs || {})) {
      const e = durum.srs[id];
      if (!e || (m.son || '') > (e.son || '')) durum.srs[id] = m;
    }
    const gid = new Set(durum.gecikmeli.map((g) => g.id));
    for (const g of yedek.durum.gecikmeli || []) if (!gid.has(g.id)) durum.gecikmeli.push(g);
    const sid = new Set(durum.saraylar.map((s) => s.id));
    for (const s of yedek.durum.saraylar || []) if (!sid.has(s.id)) durum.saraylar.push(s);
    durum.baslangic = durum.baslangic || yedek.durum.baslangic;
    durum.ad = durum.ad || yedek.durum.ad;
  }
  for (const p of yedek.paketler || []) await depo.koy('paketler', p.paket, p);
  for (const [k, u] of Object.entries(yedek.kayitlar || {})) await depo.koy('kayitlar', k, await dataUrlToBlob(u));
  kaydetHemen();
  return { olay: durum.olaylar.length };
}
