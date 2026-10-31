// Oyunlaştırma katmanı: deneyim puanı (XP), rütbe, haftalık hedef, esnek seri, rozetler ve kombo.
// Saf işlevler (tarayıcıya bağlı değil). Her şey olay defterinden TÜRETİLİR: ayrı bir sayaç tutulmaz, bu yüzden yedekten dönünce,
// tarih değişince ya da içerik güncellenince tutarsızlık olmaz. Yalnız "hangi rozeti ne zaman kazandın / gördün" kaydı saklanır.
//
// Ne olduğu konusunda dürüst olalım: XP öğrenmenin ölçüsü DEĞİL, ne kadar çalıştığının sevimli bir göstergesidir. Gerçek ölçü
// seviyendir (Ben → İlerleme) ve tekrarlarda hatırlayıp hatırlamadığındır. Puanlar bilerek "çaba ve çeşit" ödüllendirir:
// aynı dersi yeniden bitirmek ilk seferin üçte biri kadar puan verir, kendi bildirimlerin (park turu) günde en çok iki kez sayılır.

import { gunEkle } from './zaman.js';

// ---- Rütbeler ----
// Eşikler: günde ortalama ≈ 90 XP ile ilk rütbe ≈ 3. gün, "Orman" ≈ 1 ay civarı olacak biçimde seçildi (tahmin; kullanımla ayarlanabilir).
export const RUTBELER = [
  { ad: 'Filiz', emoji: '🌱', xp: 0 },
  { ad: 'Fidan', emoji: '🌿', xp: 250 },
  { ad: 'Genç Ağaç', emoji: '🌳', xp: 700 },
  { ad: 'Çınar', emoji: '🪵', xp: 1400 },
  { ad: 'Orman', emoji: '🌲', xp: 2500 },
  { ad: 'Dağ', emoji: '⛰️', xp: 4200 },
  { ad: 'Zirve', emoji: '🏔️', xp: 6500 },
];

/** Toplam XP için rütbe, sıradaki rütbe ve ilerleme (0–1). */
export function rutbe(xp) {
  let i = 0;
  while (i + 1 < RUTBELER.length && xp >= RUTBELER[i + 1].xp) i++;
  const simdiki = RUTBELER[i], sonraki = RUTBELER[i + 1] || null;
  const oran = sonraki ? (xp - simdiki.xp) / (sonraki.xp - simdiki.xp) : 1;
  return { sira: i, ...simdiki, sonraki, kalan: sonraki ? sonraki.xp - xp : 0, oran: Math.max(0, Math.min(1, oran)) };
}

// ---- XP ----
/** Bir günde etkin sayılan olay türleri (seri ve haftalık hedef bunlara bakar). */
export const ETKIN_TURLER = ['ders-bitir', 'seviye-oturum', 'yerlestirme', 'oyun', 'alan-tur', 'srs', 'gecikmeli-yanit', 'soru'];
const SRS_GUNLUK_SINIR = 30, ALAN_GUNLUK_SINIR = 2;

const oranYuz = (d, t) => (t > 0 ? d / t : 0);

/**
 * Olay defterinden XP: { toplam, gunluk: { 'YYYY-AA-GG': xp }, kalemler: [{ g, tur, xp }] }.
 * Kurallar (bilerek sade): ders bitirme 15–25 (ilk kez; tekrar 5), seviye oturumu 20–30 (tekrar 8), yoklama 12, oyun 6–12,
 * alan turu 12 (günde en çok 2), tekrar sisteminde doğru yanıt 1 (günde en çok 30), gecikmeli hatırlamada doğru yanıt 4.
 */
export function xpHesapla(olaylar) {
  const gorulenDers = new Set(), srsGun = {}, alanGun = {};
  const kalemler = [], gunluk = {};
  let toplam = 0;
  const sirali = [...olaylar].sort((a, b) => String(a.t).localeCompare(String(b.t)));
  for (const o of sirali) {
    let xp = 0;
    if (o.tur === 'ders-bitir') {
      if (gorulenDers.has(o.ders)) xp = 5;
      else { gorulenDers.add(o.ders); xp = 15 + Math.round(10 * (o.yuzde != null ? o.yuzde / 100 : oranYuz(o.dogru, o.toplam))); }
    } else if (o.tur === 'seviye-oturum') {
      if (o.tekrar) xp = 8;
      else if (o.iz === 'spor') xp = o.sonuc === 'tam' ? 25 : 15;
      else xp = 20 + Math.round(10 * oranYuz(o.dogru, o.toplam));
    } else if (o.tur === 'yerlestirme') xp = 12;
    else if (o.tur === 'oyun') xp = 6 + Math.round(6 * (o.yuzde != null ? o.yuzde / 100 : oranYuz(o.dogru, o.toplam)));
    else if (o.tur === 'alan-tur') { alanGun[o.g] = (alanGun[o.g] || 0) + 1; if (alanGun[o.g] <= ALAN_GUNLUK_SINIR) xp = 12; }
    else if (o.tur === 'srs') { if (o.dogru) { srsGun[o.g] = (srsGun[o.g] || 0) + 1; if (srsGun[o.g] <= SRS_GUNLUK_SINIR) xp = 1; } }
    else if (o.tur === 'gecikmeli-yanit') xp = o.dogru ? 4 : 0;
    if (xp > 0) { toplam += xp; gunluk[o.g] = (gunluk[o.g] || 0) + xp; kalemler.push({ g: o.g, tur: o.tur, xp }); }
  }
  return { toplam, gunluk, kalemler };
}

// ---- Etkin günler, seri, hafta ----
export function etkinGunler(olaylar) {
  return new Set(olaylar.filter((o) => ETKIN_TURLER.includes(o.tur) && o.g).map((o) => o.g));
}

/**
 * Esnek seri: art arda etkin günler; ama her 7 günde BİR gün ara vermek seriyi bozmaz ("dinlenme hakkı", sayılmaz ama kırmaz).
 * Bugün henüz çalışılmadıysa seri bozulmaz, dünden sayılır. İki gün üst üste ara vermek seriyi bitirir.
 * Neden: katı seri, bir gün aksayınca "hepsi boşa gitti" duygusu yaratır ve çalışmayı bırakmaya iter.
 */
export function esnekSeri(gunler, bugunS) {
  let n = 0, g = bugunS, uzak = 0, sonAtlama = -99;
  if (!gunler.has(g)) { g = gunEkle(g, -1); uzak = 1; }
  for (let koruma = 0; koruma < 4000; koruma++) {
    if (gunler.has(g)) n++;
    else if (uzak - sonAtlama >= 7 && gunler.has(gunEkle(g, -1))) sonAtlama = uzak;
    else break;
    g = gunEkle(g, -1); uzak++;
  }
  return n;
}

const haftaGunu = (g) => (new Date(g + 'T12:00:00Z').getUTCDay() + 6) % 7; // Pazartesi = 0
export const haftaBasi = (g) => gunEkle(g, -haftaGunu(g));

export const HAFTA_HEDEF_ARALIK = [2, 7], HAFTA_HEDEF_VARSAYILAN = 4;
export function haftaHedefi(ayar) {
  const n = Math.round(Number(ayar?.haftaHedef));
  return Number.isFinite(n) && n >= HAFTA_HEDEF_ARALIK[0] && n <= HAFTA_HEDEF_ARALIK[1] ? n : HAFTA_HEDEF_VARSAYILAN;
}

/** Bu haftanın (Pzt–Paz) özeti: günler, etkin gün sayısı, hedef, hâlâ ulaşılabilir mi. */
export function haftaOzeti(gunler, bugunS, hedef) {
  const bas = haftaBasi(bugunS);
  const gunlerDizi = [];
  for (let i = 0; i < 7; i++) { const g = gunEkle(bas, i); gunlerDizi.push({ g, etkin: gunler.has(g), bugun: g === bugunS, gelecek: g > bugunS }); }
  const n = gunlerDizi.filter((x) => x.etkin).length;
  const kalanGun = gunlerDizi.filter((x) => x.gelecek || (x.bugun && !x.etkin)).length;
  return { gunler: gunlerDizi, n, hedef, tamam: n >= hedef, kalanGun, ulasilabilir: n + kalanGun >= hedef };
}

// ---- İstatistik ve rozetler ----
/** Rozetlerin baktığı sayılar. kelimeSayisi: tekrar sistemine giren kelime sayısı (durum.srs'ten). */
export function istatistik(olaylar, { kelimeSayisi = 0 } = {}) {
  const gunler = etkinGunler(olaylar);
  const sirali = [...gunler].sort();
  let enUzunSeri = 0, geriDonus = 0;
  for (let i = 0; i < sirali.length; i++) {
    enUzunSeri = Math.max(enUzunSeri, esnekSeri(gunler, sirali[i]));
    if (i > 0 && gunFarkiKaba(sirali[i - 1], sirali[i]) >= 4) geriDonus++; // en az 3 gün ara verip döndün
  }
  const haftalar = {};
  for (const g of sirali) { const b = haftaBasi(g); haftalar[b] = (haftalar[b] || 0) + 1; }
  const dersler = new Set(olaylar.filter((o) => o.tur === 'ders-bitir').map((o) => o.ders));
  const oturum = olaylar.filter((o) => o.tur === 'seviye-oturum' && !o.tekrar);
  const dakikalar = {};
  for (const o of olaylar) if (o.tur === 'sure' && o.sn > 0) dakikalar[o.g] = (dakikalar[o.g] || 0) + o.sn / 60;
  const turlar = olaylar.filter((o) => o.tur === 'alan-tur');
  return {
    etkinGun: gunler.size, enUzunSeri, geriDonus,
    enIyiHafta: Math.max(0, ...Object.values(haftalar)),
    ders: dersler.size,
    sporOturum: oturum.filter((o) => o.iz === 'spor').length,
    izCesit: new Set(oturum.map((o) => o.iz)).size,
    kelime: kelimeSayisi,
    saray: turlar.filter((o) => o.etkinlik === 'saray').length,
    yerCesit: new Set(turlar.map((o) => o.yer)).size,
    tamPuan: olaylar.filter((o) => (o.tur === 'ders-bitir' || o.tur === 'seviye-oturum') && o.toplam >= 8 && o.dogru === o.toplam).length,
    oyun: olaylar.filter((o) => o.tur === 'oyun').length,
    hatirlama: olaylar.filter((o) => o.tur === 'gecikmeli-yanit' && o.dogru).length,
    enUzunGunDk: Math.round(Math.max(0, ...Object.values(dakikalar))),
    toplamXp: xpHesapla(olaylar).toplam,
  };
}
function gunFarkiKaba(a, b) { return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 86400000); }

/** deger(istatistik) ≥ hedef olunca kazanılır. Bilerek çeşitli: süreklilik, çeşitlilik, dayanıklılık ve geri dönüş de ödüllendirilir. */
export const ROZETLER = [
  { id: 'ilk-adim', emoji: '🌱', ad: 'İlk adım', aciklama: 'İlk görevini tamamla', deger: (s) => s.etkinGun, hedef: 1 },
  { id: 'uc-gun', emoji: '📅', ad: 'Üç gün', aciklama: '3 farklı günde çalış', deger: (s) => s.etkinGun, hedef: 3 },
  { id: 'saglam-hafta', emoji: '🎯', ad: 'Sağlam hafta', aciklama: 'Bir haftada 4 gün çalış', deger: (s) => s.enIyiHafta, hedef: 4 },
  { id: 'bir-hafta', emoji: '🔥', ad: 'Bir hafta', aciklama: '7 günlük seri (bir dinlenme günü hakkıyla)', deger: (s) => s.enUzunSeri, hedef: 7 },
  { id: 'otuz-gun', emoji: '🏅', ad: 'Otuz gün', aciklama: '30 farklı günde çalış', deger: (s) => s.etkinGun, hedef: 30 },
  { id: 'geri-donus', emoji: '🤝', ad: 'Geri döndün', aciklama: '3 gün ara verip yeniden başla; ara vermek normal', deger: (s) => s.geriDonus, hedef: 1 },
  { id: 'kelime-25', emoji: '📚', ad: '25 kelime', aciklama: 'Tekrar sistemine 25 kelime gir', deger: (s) => s.kelime, hedef: 25 },
  { id: 'kelime-100', emoji: '📖', ad: '100 kelime', aciklama: 'Tekrar sistemine 100 kelime gir', deger: (s) => s.kelime, hedef: 100 },
  { id: 'hareket', emoji: '💪', ad: 'İlk hareket', aciklama: 'Bir spor oturumu yap', deger: (s) => s.sporOturum, hedef: 1 },
  { id: 'hareketli-bes', emoji: '🏃', ad: 'Hareketli beş', aciklama: '5 spor oturumu yap', deger: (s) => s.sporOturum, hedef: 5 },
  { id: 'saray', emoji: '🏛️', ad: 'Saray kurucusu', aciklama: 'Gerçek bir yerde hafıza sarayı turu yap', deger: (s) => s.saray, hedef: 1 },
  { id: 'iki-yer', emoji: '🌦️', ad: 'Her yerde öğrenirim', aciklama: 'Serbest alanda hem parkta hem çalışma alanında tur yap', deger: (s) => s.yerCesit, hedef: 2 },
  { id: 'cok-yonlu', emoji: '🧩', ad: 'Çok yönlü', aciklama: '4 farklı beceride seviye oturumu yap', deger: (s) => s.izCesit, hedef: 4 },
  { id: 'tam-puan', emoji: '💯', ad: 'Tam puan', aciklama: 'En az 8 soruluk bir çalışmayı hatasız bitir', deger: (s) => s.tamPuan, hedef: 1 },
  { id: 'oyuncu', emoji: '🎮', ad: 'Oyuncu', aciklama: '10 oyun oyna', deger: (s) => s.oyun, hedef: 10 },
  { id: 'aklimda', emoji: '🧠', ad: 'Aklımda kalıyor', aciklama: 'Gecikmeli hatırlamada 5 doğru yanıt', deger: (s) => s.hatirlama, hedef: 5 },
  { id: 'kirk-dk', emoji: '⏱️', ad: 'Kırk dakika', aciklama: 'Bir günde toplam 40 dakika çalış', deger: (s) => s.enUzunGunDk, hedef: 40 },
  { id: 'elli-dk', emoji: '🚀', ad: 'Elli dakika', aciklama: 'Bir günde toplam 50 dakika çalış', deger: (s) => s.enUzunGunDk, hedef: 50 },
];

/** Her rozet için { …rozet, n, hedef, kazandi } (n hedefe kırpılır; kilitli rozetlerde ilerleme göstermek için). */
export function rozetDurumu(s) {
  return ROZETLER.map((r) => { const n = Math.min(r.hedef, Math.max(0, r.deger(s))); return { id: r.id, emoji: r.emoji, ad: r.ad, aciklama: r.aciklama, n, hedef: r.hedef, kazandi: n >= r.hedef }; });
}

/**
 * Kayıtlı rozetleri günceller. kayit: { id: { g: kazanılan gün, gorulen: bool } }.
 * Yeni kazanılanlar gorulen:false ile eklenir; bir kez kazanılan rozet geri alınmaz (olaylar sonradan sadeleşse de).
 * Döner: { kayit, yeni: [rozet] }.
 */
export function rozetleriIsle(s, kayit = {}, bugunS) {
  const sonuc = { ...kayit }, yeni = [];
  for (const r of rozetDurumu(s)) {
    if (r.kazandi && !sonuc[r.id]) { sonuc[r.id] = { g: bugunS, gorulen: false }; yeni.push(r); }
  }
  return { kayit: sonuc, yeni };
}

// ---- Kombo ----
/** Art arda ilk denemede doğru sayısı: doğruysa artar, yanlışta sıfırlanır. Tekrar (ikinci deneme) sayfaları kombo'yu etkilemez. */
export function komboGuncelle(kombo, { ilk, dogru }) {
  if (!ilk) return kombo;
  return dogru ? kombo + 1 : 0;
}
/** Ekranda gösterilecek kısa kombo metni ('' = gösterme). */
export function komboMetni(kombo) {
  if (kombo < 3) return '';
  return `🔥 ${kombo}`;
}
/** Kombo eşiklerinde kısa bir takdir cümlesi (her eşikte bir kez), yoksa ''. */
export function komboTakdiri(kombo) {
  return { 3: 'Isınıyorsun!', 5: 'Alev aldın!', 8: 'Durdurulamıyorsun!', 12: 'Efsane seri!' }[kombo] || '';
}
