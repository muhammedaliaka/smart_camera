// Kelime bankasından alıştırma sayfaları üretir. Cevap anahtarı yoktur: doğru cevap her zaman bankadaki kelimenin kendisidir.

import { karistir, tohumlu, yazidanTohum } from './ui.js';
import { sadelestir, sayiEn } from './metin.js';

const ses = (ctx, metin, kim) => ({ metin, ses: kim ? (ctx.sesler?.konusmacilar?.[kim] || ctx.sesler?.varsayilan) : ctx.sesler?.varsayilan });

/** Çeldirici seç: önce aynı gruptan, sonra herhangi kelimeden; karşılık metni aynı olanlar elenir. */
function celdiriciler(dogru, havuz, tumu, alan, n, rng) {
  const dogruNorm = sadelestir(dogru[alan]);
  const uygun = (k) => k.id !== dogru.id && sadelestir(k[alan]) !== dogruNorm;
  const secilen = [];
  const goruldu = new Set([dogruNorm]);
  const ekle = (liste) => {
    for (const k of karistir(liste.filter(uygun), rng)) {
      const n2 = sadelestir(k[alan]);
      if (goruldu.has(n2)) continue;
      goruldu.add(n2); secilen.push(k);
      if (secilen.length >= n) return;
    }
  };
  ekle(havuz);
  if (secilen.length < n) ekle(tumu.filter((k) => k.grup && k.grup === dogru.grup));
  if (secilen.length < n) ekle(tumu);
  return secilen;
}

function mcqKur({ id, soru, sesKaynagi, emoji, dogruKelime, alan, celdirici, rng, aciklama, bolum, kare, emojiSecenek, maddeId, gorev }) {
  const secenekler = karistir([{ k: dogruKelime, dogru: true }, ...celdirici.map((k) => ({ k, dogru: false }))], rng)
    .map((o) => ({ m: o.k[alan], emoji: emojiSecenek ? o.k.emoji : undefined, dogru: o.dogru }));
  return {
    t: 'mcq', id, soru, ses: sesKaynagi, emoji, secenekler, dogru: secenekler.findIndex((s) => s.dogru), aciklama, bolum, kare,
    puan: true, maddeId, gorev,
  };
}

export function kelimeSorusu(tur, k, { havuz, tumu, ctx, rng, bolum, maddeId }) {
  const id = `${tur}:${k.id}`;
  const maddeKimlik = maddeId ?? `k:${k.id}`;
  const ornekAciklama = k.ornek ? `${k.ornek.en} — ${k.ornek.tr}` : undefined;
  if (tur === 'dinle-sec') {
    const c = celdiriciler(k, havuz, tumu, 'tr', 3, rng);
    return mcqKur({ id, soru: 'Ne duydun?', sesKaynagi: ses(ctx, k.en), dogruKelime: k, alan: 'tr', celdirici: c, rng, bolum, aciklama: `${k.en} = ${k.tr}. ${ornekAciklama || ''}`.trim(), emojiSecenek: true, kare: c.every((x) => x.emoji) && !!k.emoji, maddeId: maddeKimlik, gorev: 'Duyduğun İngilizce kelimenin Türkçesini seç' });
  }
  if (tur === 'anlam-sec') {
    const c = celdiriciler(k, havuz, tumu, 'tr', 3, rng);
    return mcqKur({ id, soru: k.en, sesKaynagi: ses(ctx, k.en), emoji: k.emoji, dogruKelime: k, alan: 'tr', celdirici: c, rng, bolum, aciklama: ornekAciklama, maddeId: maddeKimlik, gorev: 'İngilizce kelimenin Türkçesini seç' });
  }
  if (tur === 'kelime-sec') {
    const c = celdiriciler(k, havuz, tumu, 'en', 3, rng);
    return mcqKur({ id, soru: k.tr, emoji: k.emoji, dogruKelime: k, alan: 'en', celdirici: c, rng, bolum, aciklama: ornekAciklama, maddeId: maddeKimlik, gorev: 'Türkçesi verilen kelimenin İngilizcesini seç' });
  }
  // yaz
  return { t: 'yaz', id, soru: k.tr, emoji: k.emoji, ses: ses(ctx, k.en), kabul: [k.en, ...(k.kabul || [])], dil: 'en', aciklama: ornekAciklama, bolum, puan: true, maddeId: maddeKimlik, gorev: 'Türkçesi verilen kelimenin İngilizcesini yaz' };
}

/** Bir "alistirma" adımını sayfalara çevirir. */
export function alistirmaUret(adim, ctx, tohum) {
  const rng = tohumlu(yazidanTohum(`${tohum}|${adim.kelimeler.join(',')}`));
  const kelimeler = adim.kelimeler.map((id) => ctx.kelime(id)).filter(Boolean);
  const turler = (adim.turler && adim.turler.length ? adim.turler : ['dinle-sec', 'anlam-sec', 'kelime-sec', 'yaz']).filter((t) => t !== 'eslestir');
  const eslestirVar = !adim.turler || adim.turler.includes('eslestir');
  const adet = adim.adet || Math.max(8, kelimeler.length);
  const bolum = adim.bolum || 'Kelime alıştırması';
  const sirali = [];
  let i = 0;
  const karisik = karistir(kelimeler, rng);
  while (sirali.length < adet && karisik.length) {
    const k = karisik[i % karisik.length];
    const tur = turler[Math.floor(i / karisik.length + i) % turler.length];
    sirali.push(kelimeSorusu(tur, k, { havuz: kelimeler, tumu: ctx.tumKelimeler, ctx, rng, bolum }));
    i++;
  }
  // aynı kelimenin ardışık gelmesini azalt
  for (let a = 1; a < sirali.length; a++) {
    if (sirali[a].maddeId === sirali[a - 1].maddeId) {
      const b = sirali.findIndex((x, j) => j > a && x.maddeId !== sirali[a].maddeId && x.maddeId !== sirali[a - 1]?.maddeId);
      if (b > 0) [sirali[a], sirali[b]] = [sirali[b], sirali[a]];
    }
  }
  if (eslestirVar && kelimeler.length >= 4) {
    const secim = karistir(kelimeler, rng).slice(0, 5);
    sirali.splice(Math.min(sirali.length, Math.ceil(sirali.length / 2)), 0, eslestirSayfasi(secim, `${adim.bolum || 'Eşleştir'}`, rng, 'es:' + secim.map((k) => k.id).join('+')));
  }
  return sirali;
}

export function eslestirSayfasi(kelimeler, bolum, rng, id = 'es') {
  return {
    t: 'eslestir', id, bolum, puan: true,
    ciftler: kelimeler.map((k) => ({ id: k.id, en: k.en, tr: k.tr, emoji: k.emoji })),
    sol: karistir(kelimeler.map((k) => k.id), rng), sag: karistir(kelimeler.map((k) => k.id), rng),
    maddeIds: kelimeler.map((k) => `k:${k.id}`),
  };
}

/** Yazılı çoktan seçmeli adımı ("soru", sahne ve dinleme soruları) sayfaya çevirir. İlk seçenek doğrudur, sıra karıştırılır. */
export function soruSayfasi(s, { id, bolum, tohum, ses: sesKaynagi }) {
  const rng = tohumlu(yazidanTohum(`${tohum}|${id}`));
  const tum = s.secenekler.map((m, i) => ({ m: typeof m === 'string' ? m : m.m, emoji: m.emoji, dogru: s.sabit ? (typeof m === 'string' ? m : m.m) === s.dogru : i === 0 }));
  const secenekler = s.sabit ? tum : karistir(tum, rng);
  return {
    t: 'mcq', id, soru: s.soru, ses: sesKaynagi, emoji: s.emoji, secenekler, dogru: secenekler.findIndex((o) => o.dogru),
    aciklama: s.aciklama, bolum, puan: true, kare: false,
  };
}

/** Cümle kurma: sözcük kutuları (+ varsa çeldirici sözcükler). */
export function cumleSayfasi(o, { id, bolum, tohum }) {
  const rng = tohumlu(yazidanTohum(`${tohum}|${id}`));
  const sozcukler = o.en.replace(/[.!?]+$/, '').split(/\s+/);
  const kutular = karistir([...sozcukler, ...(o.ek || [])].map((m, i) => ({ m, i })), rng);
  return { t: 'cumle', id, bolum, tr: o.tr, en: o.en, sozcukler, kutular, ses: undefined, puan: true };
}

/** Sayı dikte öğeleri */
export function sayiSayfalari(adim, { id, tohum, ctx }) {
  const rng = tohumlu(yazidanTohum(`${tohum}|${id}`));
  const [a, b] = adim.aralik;
  const adet = adim.adet || 8;
  const secilen = new Set();
  const cift = [];
  // -teen / -ty karışıklığı için çiftleri öne al: 13/30 gibi
  if (adim.karisiklik) for (let n = 13; n <= 19 && cift.length < 4; n++) if (n >= a && n * 10 % 100 <= b && n % 10 !== 0) cift.push(n, (n % 10) * 10);
  for (const n of cift) if (n >= a && n <= b && secilen.size < adet) secilen.add(n);
  let guvence = 0;
  while (secilen.size < adet && guvence++ < 500) secilen.add(a + Math.floor(rng() * (b - a + 1)));
  return karistir([...secilen], rng).map((n, i) => ({
    t: 'sayi', id: `${id}:${n}`, bolum: adim.bolum || 'Sayı dinleme', sayi: n, ses: ses(ctx, sayiEn(n)), puan: true,
    maddeId: undefined,
  }));
}
