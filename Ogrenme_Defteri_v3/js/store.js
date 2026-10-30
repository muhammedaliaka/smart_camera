// Kayıt katmanı. Her şey tek bir "olay defteri" olarak tutulur (silinmez, sadece eklenir);
// ilerleme, tekrar takvimi ve rapor bu defterden ve küçük bir özet durumdan okunur.
// Küçük veriler localStorage'da, ses kayıtları ve içe aktarılan paketler IndexedDB'dedir.

import { bugun, simdiISO, gunEkle, gunFarki } from './zaman.js';
import * as srsModul from './srs.js';
import { esnekSeri, etkinGunler } from './oyunlastir.js';

const ANAHTAR = 'od3.durum';
export const SURUM = '3.3.0';

function bos() {
  return {
    v: 3, ad: '', baslangic: null,
    ayar: { tema: 'oto', yazi: 'orta', yavas: false, gunlukTekrar: 20, otoSes: true, odakDk: 30, haftaHedef: 4 },
    olaylar: [],
    bag: {},          // bağlam kataloğu: olay.b -> { dersAd, soru, dogruCevap, ... } (aynı soru bir kez saklanır)
    dersler: {},      // dersId -> { bitti, deneme, son, dogru, toplam, enIyi }
    srs: {},          // maddeId -> srs.js durum
    gecikmeli: [],    // zamanlı hatırlama kontrolleri
    saraylar: [],     // hafıza sarayı güzergâhları
    oyunlar: {},      // oyunId -> { enIyi, oynama }
    notlar: {},
    oyunlastirma: { rozet: {} }, // kazanılan rozetler: id -> { g: gün, gorulen: bool } (XP/seri olay defterinden türetilir)
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
  try {
    let ham = JSON.stringify(durum);
    if (ham.length > KOTA_SINIR && sadelestir(durum, KOTA_SINIR * 0.85)) ham = JSON.stringify(durum);
    localStorage.setItem(ANAHTAR, ham);
  }
  catch (e) { bellekte = true; console.warn('Kaydedilemedi', e); }
  dinleyiciler.forEach((f) => f());
}

// ---- Kayıt alanı (localStorage ≈ 5 milyon karakter) ----
const KOTA = 5_000_000;
export const KOTA_SINIR = 3_800_000; // bu sınırı aşınca eski kayıtların ayrıntısı sadeleştirilir
/** Kullanılan alan: { karakter, oran (0-1) }. */
export function kullanim() {
  const karakter = JSON.stringify(durum).length;
  return { karakter, oran: Math.min(1, karakter / KOTA) };
}
/**
 * Alan dolarken en eski kayıtların YALNIZ ayrıntısını siler (soru, doğru/yanlış, tarih ve ders kalır):
 *  1) yanlış seçeneklerin listesi, 2) doğru yanıtların yazılı yanıtı, 3) tekrar sistemi hareketleri.
 * Silinen ayrıntı raporun "tam" kipinde görünmez; "özet" ve "yanlışlar" etkilenmez. Hedefin altına inince durur.
 */
export function sadelestir(d, hedef) {
  const uzunluk = () => JSON.stringify(d).length;
  if (uzunluk() <= hedef) return false;
  const eskiden = (a, b) => a.t.localeCompare(b.t);
  const adimlar = [
    (o) => { if (o.tur === 'soru' && (o.sec || o.ayrinti)) { delete o.sec; delete o.ayrinti; return true; } return false; },
    (o) => { if (o.tur === 'soru' && o.dogru && o.yanit) { delete o.yanit; return true; } return false; },
    (o) => o.tur === 'srs' ? (o.silinecek = true) : false,
  ];
  const sirali = [...d.olaylar].sort(eskiden);
  const koruma = Math.floor(sirali.length * 0.2); // en yeni %20'ye dokunma
  for (const adim of adimlar) {
    for (let i = 0; i < sirali.length - koruma; i++) {
      adim(sirali[i]);
      if (i % 200 === 0 && uzunluk() <= hedef) break;
    }
    d.olaylar = d.olaylar.filter((o) => !o.silinecek);
    if (uzunluk() <= hedef) break;
  }
  return true;
}
export function degisinceDinle(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }
export function kayitGuvenli() { return !bellekte; }
export function al() { return durum; }
export function degistir(yeni) { durum = { ...bos(), ...yeni }; kaydetHemen(); }
export function sifirla() { durum = bos(); kaydetHemen(); }

let sayac = 0;
export function yeniId() { return Date.now().toString(36) + (sayac++).toString(36) + Math.random().toString(36).slice(2, 5); }

/**
 * Olay defterine ekler. tur: 'ders-basla' | 'soru' | 'serbest' | 'srs' | 'oyun' | 'dis' | 'spor' | ...
 * baglam (isteğe bağlı): olayı tek başına anlaşılır kılan sabit bilgi (soru metni, doğru yanıt, ders adı...).
 * Aynı bağlam bir kez saklanır, olay yalnız kısa anahtarını (b) taşır; böylece aylarca kayıt tutulabilir.
 */
export function olay(tur, veri = {}, baglam = null) {
  const g = bugun();
  const o = { i: yeniId(), t: simdiISO(), g, tur, ...veri };
  if (durum.baslangic && g >= durum.baslangic) o.gn = gunFarki(durum.baslangic, g) + 1; // programın kaçıncı günü
  if (baglam) o.b = baglamKaydet(baglam);
  durum.olaylar.push(o);
  kaydet();
  return o;
}

/** Aynı içerikli bağlam aynı anahtarı alır (FNV-1a, 8 karakter). */
function baglamKaydet(baglam) {
  const temiz = {};
  for (const [k, v] of Object.entries(baglam)) if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) temiz[k] = v;
  const metin = JSON.stringify(temiz);
  let a = 0x811c9dc5, b = 0x01000193;
  for (let i = 0; i < metin.length; i++) { a = Math.imul(a ^ metin.charCodeAt(i), 0x01000193) >>> 0; b = Math.imul(b + metin.charCodeAt(i), 0x85ebca6b) >>> 0; }
  const anahtar = a.toString(36) + b.toString(36).slice(0, 3);
  if (!durum.bag[anahtar]) durum.bag[anahtar] = temiz;
  return anahtar;
}
/** Olayın bağlamı ({} olabilir). */
export function baglam(o) { return (o.b && durum.bag[o.b]) || {}; }

// ---- Ders durumu ----
export function dersDurumu(id) { return durum.dersler[id] || null; }
export function dersBitti(id) { return !!durum.dersler[id]?.bitti; }
export function dersiBitir(id, { dogru = 0, toplam = 0, bolumler = null } = {}, baglam = null) {
  const e = durum.dersler[id] || { deneme: 0 };
  const yuzde = toplam ? Math.round((dogru / toplam) * 100) : null;
  durum.dersler[id] = {
    bitti: true, deneme: e.deneme + 1, son: bugun(), dogru, toplam, yuzde,
    enIyi: yuzde == null ? null : Math.max(e.enIyi ?? 0, yuzde),
  };
  olay('ders-bitir', { ders: id, dogru, toplam, yuzde, ...(bolumler?.length ? { bolumler } : {}) }, baglam);
}
export function dersiBaslat(id, baglam = null) {
  olay('ders-basla', { ders: id }, baglam);
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
/** Esnek seri (js/oyunlastir.js): 7 günde bir gün ara vermek seriyi bozmaz. */
export function seri(bugunS = bugun()) { return esnekSeri(etkinGunler(durum.olaylar), bugunS); }

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
    durum.bag = { ...(yedek.durum.bag || {}), ...durum.bag };
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
