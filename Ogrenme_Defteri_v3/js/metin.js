// Yazılan yanıtları karşılaştırma: büyük/küçük harf, noktalama, kısaltma ve sayı biçimi farkları hata sayılmaz.
// Saf işlevler — tarayıcıda da Node testlerinde de çalışır.

const BIRLER_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const ONLAR_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const BIRLER_TR = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ONLAR_TR = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

/** 0–999 → İngilizce söylenişi ("forty two", tire yok: karşılaştırmada tire boşluğa çevrilir). */
export function sayiEn(n) {
  if (n < 20) return BIRLER_EN[n];
  if (n < 100) return ONLAR_EN[Math.floor(n / 10)] + (n % 10 ? ' ' + BIRLER_EN[n % 10] : '');
  const y = Math.floor(n / 100), k = n % 100;
  return BIRLER_EN[y] + ' hundred' + (k ? ' ' + sayiEn(k) : '');
}
export function sayiEnYazi(n) { return sayiEn(n).replace(/^(\w+) (\w+)$/, (m, a, b) => (ONLAR_EN.includes(a) && BIRLER_EN.includes(b) && a !== '' ? `${a}-${b}` : m)); }
/** 0–999 → Türkçe söylenişi. */
export function sayiTr(n) {
  if (n < 10) return BIRLER_TR[n];
  if (n < 100) return ONLAR_TR[Math.floor(n / 10)] + (n % 10 ? ' ' + BIRLER_TR[n % 10] : '');
  const y = Math.floor(n / 100), k = n % 100;
  return (y > 1 ? BIRLER_TR[y] + ' ' : '') + 'yüz' + (k ? ' ' + sayiTr(k) : '');
}

const ASCII = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
/** Türkçe harfleri ASCII'ye indirger (yumuşak karşılaştırma için). */
export function asciiKatla(s) { return s.replace(/[çğıöşüâîû]/g, (c) => ASCII[c]); }

export function kucult(s, tr = false) {
  return tr ? s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr') : s.toLowerCase();
}

const KISALTMA = [
  [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\blet's\b/g, 'let us'],
  [/\b(\w+)n't\b/g, '$1 not'], [/\b(\w+)'m\b/g, '$1 am'], [/\b(\w+)'re\b/g, '$1 are'], [/\b(\w+)'ll\b/g, '$1 will'],
  [/\b(\w+)'ve\b/g, '$1 have'], [/\b(\w+)'d\b/g, '$1 would'], [/\b(it|he|she|that|what|where|who|there|here|how)'s\b/g, '$1 is'],
];

/** Ortak sadeleştirme: küçült, tırnak/noktalama at, tireyi boşluk yap, (EN) kısaltmaları aç, rakamları söyleniş yap. */
export function sadelestir(s, { tr = false, sayilar = true } = {}) {
  let t = kucult(String(s ?? ''), tr).replace(/[’‘`´]/g, "'").replace(/[“”«»„]/g, '"');
  t = t.replace(/[-–—_/]/g, ' ');
  if (!tr) for (const [re, yer] of KISALTMA) t = t.replace(re, yer);
  t = t.replace(/[^\p{L}\p{N}'\s]/gu, ' ').replace(/'/g, tr ? '' : "'");
  if (!tr) t = t.replace(/'/g, '');
  if (sayilar) t = t.replace(/\b\d{1,3}\b/g, (d) => (tr ? sayiTr(+d) : sayiEn(+d)));
  return t.replace(/\s+/g, ' ').trim();
}

export function mesafe(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let onceki = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const simdi = [i];
    for (let j = 1; j <= n; j++) {
      simdi[j] = Math.min(onceki[j] + 1, simdi[j - 1] + 1, onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    onceki = simdi;
  }
  return onceki[n];
}

/**
 * Yanıtı kabul edilen yanıtlarla karşılaştırır.
 * dönüş: { durum: 'tam' | 'yakin' | 'yok', eslesen }
 *  - tam: sadeleştirilince birebir aynı
 *  - yakin: Türkçe harf farkı (c/ç) ya da tek harflik yazım hatası (uzun sözcüklerde) — doğru sayılır, düzeltme gösterilir
 */
export function karsilastir(yanit, kabul, { tr = false } = {}) {
  const liste = Array.isArray(kabul) ? kabul : [kabul];
  const y = sadelestir(yanit, { tr });
  if (!y) return { durum: 'yok', eslesen: null };
  for (const k of liste) if (sadelestir(k, { tr }) === y) return { durum: 'tam', eslesen: k };
  for (const k of liste) {
    const kk = sadelestir(k, { tr });
    if (tr && asciiKatla(kk) === asciiKatla(y)) return { durum: 'yakin', eslesen: k };
    const tekSozcuk = !kk.includes(' ');
    if (kk.length >= 5 && mesafe(y, kk) === 1 && (tekSozcuk || Math.abs(y.length - kk.length) <= 1)) return { durum: 'yakin', eslesen: k };
  }
  return { durum: 'yok', eslesen: liste[0] };
}

/** Sözcük düzeyinde hizalama (LCS): beklenen sözcüklerin hangileri yanıtta var? */
export function sozcukFarki(yanit, beklenen, { tr = false } = {}) {
  const a = sadelestir(yanit, { tr }).split(' ').filter(Boolean);
  const b = sadelestir(beklenen, { tr }).split(' ').filter(Boolean);
  const dp = Array.from({ length: b.length + 1 }, () => new Array(a.length + 1).fill(0));
  for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) {
    dp[i][j] = b[i - 1] === a[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  }
  const sonuc = []; let i = b.length, j = a.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && b[i - 1] === a[j - 1]) { sonuc.push({ s: b[i - 1], d: 'var' }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) { sonuc.push({ s: a[j - 1], d: 'fazla' }); j--; }
    else { sonuc.push({ s: b[i - 1], d: 'eksik' }); i--; }
  }
  sonuc.reverse();
  const toplam = b.length, var_ = sonuc.filter((x) => x.d === 'var').length;
  return { parcalar: sonuc, toplam, var: var_ };
}

/** Anahtar nokta yanıtta geçiyor mu? Türkçede ek/çekimli biçimleri de yakalar (alt dize, ASCII'ye katlanmış); İngilizcede tam sözcük/kalıp arar. */
export function noktaVar(yanit, nokta, { tr = true } = {}) {
  const y = ' ' + asciiKatla(sadelestir(yanit, { tr })) + ' ';
  const adaylar = Array.isArray(nokta.kabul) && nokta.kabul.length ? nokta.kabul : [nokta.ad];
  return adaylar.some((k) => {
    const kk = asciiKatla(sadelestir(k, { tr }));
    if (!kk) return false;
    return tr ? y.includes(kk) : y.includes(' ' + kk + ' '); // İngilizce yanıtta tam sözcük/kalıp eşleşmesi ("is", "this" içinde sayılmaz)
  });
}

/** Sıralı liste hatırlama: kaç öğe var, kaçı doğru sırada? (sıralama: en uzun ortak altdizi değil, konum eşleşmesi) */
export function listeKarsilastir(yanitlar, beklenen, { tr = true } = {}) {
  const ys = yanitlar.map((x) => asciiKatla(sadelestir(x, { tr })));
  const bs = beklenen.map((x) => asciiKatla(sadelestir(x, { tr })));
  let var_ = 0, sirali = 0;
  const durumlar = bs.map((b, i) => {
    const hepsi = ys.some((y) => y === b || (b.length >= 4 && mesafe(y, b) <= 1));
    const yerinde = ys[i] === b || (b.length >= 4 && ys[i] && mesafe(ys[i], b) <= 1);
    if (hepsi) var_++;
    if (yerinde) sirali++;
    return { ad: beklenen[i], var: hepsi, yerinde: !!yerinde };
  });
  return { toplam: bs.length, var: var_, sirali, durumlar };
}

/** Serbest metni satırlara / virgülle ayırıp liste yapar. */
export function listeyeAyir(metin) {
  return String(metin || '').split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);
}

/** Basit sözcük sayısı. */
export function sozcukSayisi(metin) { return (String(metin).match(/\p{L}[\p{L}\p{N}'’-]*/gu) || []).length; }
