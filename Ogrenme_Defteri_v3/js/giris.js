// Kolay giriş biçimi: düz metni içerik paketine (JSON) çevirir. Saf işlev; dosya erişimi yoktur (komut satırı ve MCP sunucusu aynı kodu kullanır).
// Biçimin anlatımı: docs/KOLAY_GIRIS.md
//
//   @paket ad                                  çıktı paketinin adı (icerik/<ad>.json)
//   @kelimeler grup=yiyecek sv=6-24           kelime satırları:  en | tr | örnek en | örnek tr | 🍎 | sv=12 | kabul=a/b
//                                              sv=12 (hepsi aynı) | sv=6-24 (grup içi sıklığa göre yayılır) | sv=auto (salt sıklık; konu zorluğunu yansıtmaz)
//   @okuma / @dinleme                          üstte "anahtar: değer" satırları, boş satır, paragraflar, "? soru | doğru | yanlış … -> açıklama"
//   @hafiza                                    hafıza havuzu: virgül ya da satır ile ayrılmış sözcükler
//
// Hatalar satır numarasıyla döner; hata varsa paket üretilmez.

/** Sıklık sırasından (1 = en sık) 1–100 seviyeye: log-sıra üzerinde parçalı doğrusal. Çapalar docs/SEVIYE_SISTEMI.md'de. */
export const SIKLIK_CAPALARI = [[50, 1], [200, 8], [500, 16], [1000, 26], [2000, 38], [3000, 46], [5000, 60], [8000, 75], [10000, 85]];

export function svSiklik(sira) {
  if (!(sira >= 1)) return null;
  const c = SIKLIK_CAPALARI;
  if (sira <= c[0][0]) return c[0][1];
  for (let i = 1; i < c.length; i++) {
    if (sira <= c[i][0]) {
      const [r0, s0] = c[i - 1], [r1, s1] = c[i];
      return Math.round(s0 + ((Math.log(sira) - Math.log(r0)) / (Math.log(r1) - Math.log(r0))) * (s1 - s0));
    }
  }
  return Math.min(100, c.at(-1)[1] + Math.round(Math.log2(sira / c.at(-1)[0]) * 10));
}

const TR = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
export const slug = (s) => String(s).replace(/İ/g, 'i').toLowerCase().replace(/[çğıöşüâîû]|i̇/g, (c) => TR[c]).replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const IZ_AD = { okuma: 'Okuma', dinleme: 'Dinleme' };

function ozellikler(metin) {
  const o = {};
  for (const t of metin.split(/\s+/).filter(Boolean)) { const i = t.indexOf('='); if (i > 0) o[t.slice(0, i)] = t.slice(i + 1); }
  return o;
}

/**
 * @param {string} metin giriş dosyasının içeriği
 * @param {object} secenek { dosya: varsayılan paket adı, siklik: Map<kelime, sıra> (sv=auto için) }
 * @returns {{ paketAd: string, paket: object, hatalar: string[], uyarilar: string[], ozet: object }}
 */
export function girisCoz(metin, { dosya = 'giris', siklik = null } = {}) {
  const hatalar = [], uyarilar = [];
  const H = (no, m) => hatalar.push(`satır ${no}: ${m}`);
  const U = (no, m) => uyarilar.push(`satır ${no}: ${m}`);
  const satirlar = String(metin).replace(/^﻿/, '').split(/\r?\n/);
  let paketAd = slug(dosya) || 'giris';
  const kelimeler = [], dersler = [], havuz = [];
  const bloklar = []; // { tur, ayar, no, satirlar: [{no, s}] }
  let simdiki = null;
  satirlar.forEach((ham, i) => {
    const no = i + 1, s = ham.trim();
    if (s.startsWith('@')) {
      const [ad, ...kalan] = s.slice(1).split(/\s+/);
      if (ad === 'paket') { paketAd = slug(kalan.join(' ')) || paketAd; simdiki = null; return; }
      if (!['kelimeler', 'okuma', 'dinleme', 'hafiza'].includes(ad)) { H(no, `bilinmeyen blok "@${ad}" (@paket, @kelimeler, @okuma, @dinleme, @hafiza)`); simdiki = null; return; }
      simdiki = { tur: ad, ayar: ozellikler(kalan.join(' ')), no, satirlar: [] };
      bloklar.push(simdiki);
      return;
    }
    if (!simdiki) { if (s && !s.startsWith('#')) H(no, 'önce bir blok başlat (@kelimeler, @okuma, @dinleme, @hafiza)'); return; }
    simdiki.satirlar.push({ no, s, ham });
  });

  for (const b of bloklar) {
    if (b.tur === 'kelimeler') kelimeBlogu(b, kelimeler, siklik, H, U);
    else if (b.tur === 'hafiza') hafizaBlogu(b, havuz, H);
    else dersBlogu(b, dersler, H, U);
  }

  const paket = { paket: paketAd, ad: paketAd, surum: 1 };
  if (kelimeler.length) paket.kelimeler = kelimeler;
  if (dersler.length) paket.dersler = dersler;
  if (havuz.length) paket.hafizaHavuzu = havuz;
  if (!kelimeler.length && !dersler.length && !havuz.length && !hatalar.length) H(1, 'dosyada içerik yok');
  return { paketAd, paket, hatalar, uyarilar, ozet: { kelime: kelimeler.length, ders: dersler.length, hafiza: havuz.length } };
}

function kelimeBlogu(b, cikti, siklik, H, U) {
  const { grup = null, sv: blokSv = null } = b.ayar;
  const aralik = String(blokSv ?? '').match(/^(\d+)-(\d+)$/); // sv=6-24: grup içi sıklık sırasına göre bu aralığa yayılır
  const [lo, hi] = aralik ? [Number(aralik[1]), Number(aralik[2])] : [0, 0];
  if (aralik && !(lo >= 1 && hi <= 100 && lo <= hi)) { H(b.no, `sv aralığı 1–100 içinde ve küçük-büyük olmalı (${blokSv})`); return; }
  if (aralik && !siklik) { H(b.no, 'sv=A-B için sıklık listesi gerekir (--siklik); yoksa her satıra sv= yaz'); return; }
  const baslangic = cikti.length;
  const yayilacak = []; // aralığa yayılacak kelimeler
  for (const { no, s } of b.satirlar) {
    if (!s || s.startsWith('#')) continue;
    const parcalar = s.split('|').map((x) => x.trim());
    const alanlar = parcalar.filter((p) => !/^(sv|kabul|id|grup)=/.test(p));
    const ek = ozellikler(parcalar.filter((p) => /^(sv|kabul|id|grup)=/.test(p)).join(' '));
    const [en, tr, oen, otr, emoji] = alanlar;
    if (!en || !tr) { H(no, 'en ve tr gerekli:  en | tr | örnek en | örnek tr | emoji'); continue; }
    if ((oen && !otr) || (!oen && otr)) { H(no, 'örnek cümlenin hem İngilizcesi hem Türkçesi olmalı'); continue; }
    if (alanlar.length > 5) { H(no, 'en fazla 5 alan (en | tr | örnek en | örnek tr | emoji); fazlası için sv=, kabul=, id= kullan'); continue; }
    const k = { id: ek.id || slug(en), en, tr };
    if (!k.id) { H(no, `"${en}" için kimlik üretilemedi (id= ile ver)`); continue; }
    if (emoji) k.emoji = emoji;
    const g = ek.grup || grup; if (g) k.grup = g;
    if (oen) k.ornek = { en: oen, tr: otr };
    if (ek.kabul) k.kabul = ek.kabul.split('/').map((x) => x.trim()).filter(Boolean);
    const sira = siklik?.get(en.toLowerCase());
    if (sira) k.siklik = sira;
    const istenen = ek.sv ?? (aralik ? null : blokSv);
    if (istenen === 'auto' || (istenen == null && !aralik && siklik)) {
      if (!sira) { H(no, `"${en}" sıklık listesinde yok; sv= ile elle ver`); continue; }
      k.sv = svSiklik(sira);
    } else if (istenen != null) {
      k.sv = Number(istenen);
      if (!Number.isInteger(k.sv) || k.sv < 1 || k.sv > 100) { H(no, `sv 1–100 arasında tam sayı olmalı (${istenen})`); continue; }
    } else if (aralik) {
      if (!sira) { H(no, `"${en}" sıklık listesinde yok; bu satıra sv= ile elle seviye ver`); continue; }
      yayilacak.push(k);
    } else { H(no, `"${en}" için seviye (sv) yok: satıra sv=12 ekle ya da bloğa sv=12 / sv=6-24 / sv=auto yaz`); continue; }
    if (cikti.some((x) => x.id === k.id) || yayilacak.filter((x) => x.id === k.id).length > 1) { H(no, `"${k.id}" bu dosyada iki kez`); continue; }
    cikti.push(k);
  }
  // sıklığı yüksek (sırası küçük) kelime aralığın altına, seyrek olan üstüne
  yayilacak.sort((x, y) => x.siklik - y.siklik || x.id.localeCompare(y.id));
  yayilacak.forEach((k, i) => { k.sv = yayilacak.length > 1 ? lo + Math.round(((hi - lo) * i) / (yayilacak.length - 1)) : lo; });
  void baslangic; void U;
}

function hafizaBlogu(b, cikti, H) {
  const goruldu = new Set(cikti.map((x) => x.toLowerCase()));
  for (const { no, s } of b.satirlar) {
    if (!s || s.startsWith('#')) continue;
    for (const kelime of s.split(',').map((x) => x.trim()).filter(Boolean)) {
      const a = kelime.toLowerCase();
      if (goruldu.has(a)) { H(no, `"${kelime}" havuzda iki kez`); continue; }
      goruldu.add(a); cikti.push(kelime);
    }
  }
  if (!b.satirlar.some((x) => x.s && !x.s.startsWith('#'))) H(b.no, '@hafiza boş');
}

function dersBlogu(b, dersler, H, U) {
  const iz = b.tur; // okuma | dinleme
  const ust = {}; // anahtar: değer
  let i = 0;
  const sat = b.satirlar;
  while (i < sat.length && (!sat[i].s || sat[i].s.startsWith('#'))) i++; // baştaki boşluk/yorum
  while (i < sat.length && sat[i].s) { // başlık satırları: boş satıra kadar
    const { no, s } = sat[i++];
    if (s.startsWith('#')) continue;
    const m = s.match(/^([a-zçğıöşü]+)\s*:\s*(.*)$/i);
    if (!m) { H(no, 'başlık satırı "anahtar: değer" olmalı (id, sv, baslik, emoji, hedef, neden…) — paragraflardan önce bir boş satır bırak'); continue; }
    ust[m[1].toLowerCase()] = m[2].trim();
  }
  const paragraflar = [], sorular = [];
  let simdiki = [];
  const paragrafBitir = () => { if (simdiki.length) paragraflar.push(simdiki.join(' ')); simdiki = []; };
  for (; i < sat.length; i++) {
    const { no, s } = sat[i];
    if (s.startsWith('#')) continue;
    if (s.startsWith('?')) {
      paragrafBitir();
      const [govde, aciklama] = s.slice(1).split(/\s+->\s+/);
      const p = govde.split('|').map((x) => x.trim());
      if (p.length < 3 || p.length > 7 || p.some((x) => !x)) { H(no, 'soru biçimi:  ? soru | doğru cevap | yanlış 1 | yanlış 2 [| yanlış 3] [-> açıklama]  (2–6 seçenek)'); continue; }
      sorular.push({ soru: p[0], secenekler: p.slice(1), ...(aciklama ? { aciklama: aciklama.trim() } : {}), no });
    } else if (!s) paragrafBitir();
    else if (sorular.length) H(no, 'sorulardan sonra paragraf olmaz; paragrafları sorulardan önce yaz');
    else simdiki.push(s);
  }
  paragrafBitir();
  const y = `@${iz} (satır ${b.no})`;
  const sv = Number(ust.sv);
  if (!ust.baslik) H(b.no, `${y}: "baslik:" gerekli`);
  if (!Number.isInteger(sv) || sv < 1 || sv > 100) H(b.no, `${y}: "sv:" 1–100 arasında tam sayı olmalı`);
  if (!paragraflar.length) H(b.no, `${y}: metin yok (başlık satırlarından sonra boş satır, sonra paragraflar)`);
  if (sorular.length < 3) U(b.no, `${y}: ${sorular.length} soru var; seviye oturumunda sayılması için en az 3 gerekir`);
  if (!ust.baslik || !Number.isInteger(sv) || !paragraflar.length) return;
  const kimlik = ust.id || `${iz === 'okuma' ? 'oku' : 'dinle'}-sv${sv}-${slug(ust.baslik)}`;
  const sorularSon = sorular.map(({ no, ...q }) => q);
  let adim;
  if (iz === 'okuma') {
    adim = { tur: 'oku', id: 'metin', baslik: ust.baslik, kilavuz: 'parmak', metin: paragraflar, sorular: sorularSon };
    if (ust.sozluk) adim.sozluk = ust.sozluk.split(';').map((x) => x.trim()).filter(Boolean).map((x) => { const [k, ...a] = x.split('='); return { k: k.trim(), a: a.join('=').trim() }; });
  } else {
    adim = {
      tur: 'dinle', id: 'kayit', baslik: ust.baslik, yonerge: ust.yonerge || 'Dinle ve soruları yanıtla.', sinir: Number(ust.sinir) || 3,
      ses: { metin: paragraflar.join(' '), ses: ust.ses || 'kadin', hiz: Number(ust.hiz) || 0.9 }, sorular: sorularSon, metin: paragraflar,
    };
    if (ust.tr) adim.metinTr = ust.tr;
  }
  dersler.push({
    id: kimlik, iz, sv, emoji: ust.emoji || (iz === 'okuma' ? '📖' : '🎧'), baslik: ust.baslik,
    hedef: ust.hedef || (iz === 'okuma' ? 'Metni okuyup ne anlattığını doğru anlamak.' : 'Kaydı dinleyip ne anlatıldığını doğru anlamak.'),
    ...(ust.neden ? { neden: ust.neden } : {}), adimlar: [adim],
  });
}

/** Sıklık listesi metninden (her satırda bir sözcük, en sık olan en üstte) Map<sözcük, sıra> kurar. */
export function siklikHaritasi(metin) {
  const m = new Map();
  String(metin).split(/\r?\n/).forEach((s, i) => { const w = s.trim().toLowerCase(); if (w && !m.has(w)) m.set(w, i + 1); });
  return m;
}

export { IZ_AD };
