// Hareket sahneleri: her hareket için eylemler (kur / tekrar / hata) ve donanım (sandalye, duvar, minder, masa…).
// Bir eylem: { sure, kare(t) -> { poz, aksesuarArka, aksesuarOn, etiket, nefes: 'al'|'ver'|'tut'|null, oran, on? } }.
// "kur": hazırlık duruşu (hareketsiz); "tekrar": doğru formla bir tekrar; "hata": sık yapılan yanlışla bir tekrar.
import { lerp, yumusak } from './figur.js';

export const ZEMIN = 430;
const D = Math.PI / 180;
const sinir = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ara = (t, t0, t1) => sinir((t - t0) / (t1 - t0));
const yy = (x) => yumusak(sinir(x));

const rect = (x, y, w, h, fill, rx = 0, ek = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${ek}/>`;
const cizgi = (x1, y1, x2, y2, w, renk) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${renk}" stroke-width="${w}" stroke-linecap="round"/>`;
const duvar = (x, taraf = 'sol') => taraf === 'sol'
  ? rect(0, 70, x, 372, '#e3e9ee') + rect(x - 6, 70, 6, 372, '#c9d2da') + rect(0, ZEMIN - 14, x, 14, '#cdd6de')
  : rect(x, 70, 540 - x, 372, '#e3e9ee') + rect(x, 70, 6, 372, '#c9d2da') + rect(x, ZEMIN - 14, 540 - x, 14, '#cdd6de');
const AHSAP = '#c19a6b', KOYU = '#8f6b42';

// ------------------------------------------------------------------ SANDALYE
const S_AYAK = [318, ZEMIN - 10];
const sandalyeAks = (koltukY) => duvar(186) + cizgi(198, koltukY - 120, 198, ZEMIN, 9, KOYU) + cizgi(278, koltukY, 278, ZEMIN, 9, KOYU) +
  rect(190, koltukY - 2, 98, 12, AHSAP, 5) + rect(192, koltukY - 112, 12, 82, AHSAP, 5);
function sandalyePoz(t, hata = false) {
  const AYAKTA = [322, 281], OTUR = [254, 347];
  let u, govde, nefes, etiket, oran;
  if (t < 0.8) { u = 0; govde = 0; nefes = 'al'; etiket = 'Ayakta dur'; oran = 0; }
  else if (t < 3.0) { const a = (t - 0.8) / 2.2; u = yy(a); govde = 4 + 30 * Math.sin(Math.PI * a) * (hata ? 0.2 : 1) + (hata ? 14 * a : 0); nefes = 'al'; etiket = hata ? 'Kendini bırakıyor!' : `Otur · ${Math.min(2, Math.floor(a * 2) + 1)}`; oran = a; }
  else if (t < 3.8) { u = 1; govde = hata ? 28 : 14; nefes = 'tut'; etiket = hata ? 'Çöktü, sertçe oturdu' : 'Hafifçe dokun'; oran = 1; }
  else if (t < 6.0) { const a = (t - 3.8) / 2.2; u = 1 - yy(a); govde = (hata ? 28 : 14) + (hata ? 0 : 22) * Math.sin(Math.PI * Math.min(1, a * 1.15)) * (1 - a * 0.5) - (hata ? 28 : 14) * a; nefes = 'ver'; etiket = `Kalk · ${Math.min(2, Math.floor(a * 2) + 1)}`; oran = 1 - a; }
  else { u = 0; govde = 0; nefes = 'al'; etiket = 'Dik dur'; oran = 0; }
  // hata: kontrolsüz iner (ilk yarıda hızlı düşer) ve topuklar kalkar
  const uu = hata && t >= 0.8 && t < 3.0 ? Math.pow(yy((t - 0.8) / 1.0), 1) : u;
  const hx = lerp(AYAKTA[0], OTUR[0], yumusak(sinir(uu * 1.15)));
  const hy = lerp(AYAKTA[1], OTUR[1], yumusak(sinir((uu - 0.08) / 0.92)));
  const g = govde * D, omuz = [hx + Math.sin(g) * 86, hy - Math.cos(g) * 86];
  return {
    poz: {
      kalca: [hx, hy], govde, bas: -4, ayakN: S_AYAK, ayakU: S_AYAK, diz: 1,
      elN: [omuz[0] + 70 + 8 * u, omuz[1] + 22 - 6 * u], elU: [omuz[0] + 66 + 8 * u, omuz[1] + 26 - 6 * u],
      topukKalkN: hata && t >= 0.8 && t < 3.8 ? 7 : 0,
      vurgu: [{ ne: 'uyluk', yon: 1, v: nefes === 'tut' ? 0.55 : Math.sin(Math.PI * sinir(oran)), kalin: 18, kayma: 7 }],
    },
    aksesuarArka: sandalyeAks(357), nefes, etiket, oran,
  };
}
export const sandalye = { baslik: 'Sandalyeye otur-kalk', eylemler: {
  kur: { sure: 5, kare() { const r = sandalyePoz(0.2); r.etiket = 'Sandalye duvara dayalı'; r.nefes = null; return r; } },
  tekrar: { sure: 8, kare: (t) => sandalyePoz(t) },
  hata: { sure: 8, kare: (t) => sandalyePoz(t, true) },
} };

// ------------------------------------------------------------------ DUVAR ŞINAVI
const DW = 440, DA = [286, ZEMIN - 10];
function duvarPoz(t, hata = false) {
  // 0–.8 hazır · .8–2.8 yaklaş (nefes al) · 2.8–3.3 bekle · 3.3–5.0 it (nefes ver) · 5.0–6.4 dur
  const th0 = 14, th1 = 30;
  let a, nefes, etiket;
  if (t < 0.8) { a = 0; nefes = 'al'; etiket = 'Kollar düz'; }
  else if (t < 2.8) { a = yy((t - 0.8) / 2.0); nefes = 'al'; etiket = 'Göğsünü yaklaştır'; }
  else if (t < 3.3) { a = 1; nefes = 'tut'; etiket = 'Bir an bekle'; }
  else if (t < 5.0) { a = 1 - yy((t - 3.3) / 1.7); nefes = 'ver'; etiket = 'Geri it'; }
  else { a = 0; nefes = 'al'; etiket = 'Dur'; }
  if (hata && a > 0.25) etiket = a >= 1 ? 'Kalça geride, bel kırıldı!' : 'Kalçan geride kalıyor!';
  const th = lerp(th0, th1, a);
  const bacakU = 145.5, govde = 86;
  const kirik = hata ? 18 * Math.sin(Math.PI * 0.5 * Math.min(1, a * 1.4)) : 0; // kalça geride kalır (belden kırılma)
  const tb = (th - kirik) * D;
  const kalca = [DA[0] + Math.sin(tb) * bacakU, DA[1] - Math.cos(tb) * bacakU];
  const omuz = [kalca[0] + Math.sin(th * D) * govde, kalca[1] - Math.cos(th * D) * govde];
  const sabitEl = [DW - 8, 192];
  return {
    poz: { kalca, govde: th, bas: 2, ayakN: DA, ayakU: DA, diz: 1, dirsek: -1, elN: sabitEl, elU: [sabitEl[0] - 4, sabitEl[1] + 3], uzakKayma: [-4, 0],
      vurgu: [{ ne: 'govde', yon: -1, v: Math.sin(Math.PI * Math.min(1, a)) * 0.9, kesit: [0.55, 1], kalin: 22, kayma: 8 }, { ne: 'ustKol', yon: -1, v: Math.sin(Math.PI * Math.min(1, a)) * 0.8, kalin: 12, kayma: 3 }] },
    aksesuarArka: duvar(DW, 'sag'), nefes, etiket, oran: a,
  };
}
export const duvarSinav = { baslik: 'Duvar şınavı', eylemler: {
  kur: { sure: 5, kare() { const r = duvarPoz(0.2); r.etiket = 'Eller omuz hizasında'; r.nefes = null; return r; } },
  tekrar: { sure: 6.4, kare: (t) => duvarPoz(t) },
  hata: { sure: 6.4, kare: (t) => duvarPoz(t, true) },
} };

// ------------------------------------------------------------------ KALÇA KÖPRÜSÜ
const KOPRU_OMUZ = [150, ZEMIN - 26];
function kopruPoz(t, hata = false) {
  // 0–.8 hazır · .8–2.6 kaldır (nefes ver) · 2.6–3.8 bir saniye bekle · 3.8–5.8 indir (nefes al) · 5.8–6.6 dinlen
  const phi1 = hata ? 44 : 29;
  let a, nefes, etiket;
  if (t < 0.8) { a = 0; nefes = 'al'; etiket = 'Sırtüstü, dizler bükük'; }
  else if (t < 2.6) { a = yy((t - 0.8) / 1.8); nefes = 'ver'; etiket = hata ? 'Çok yükseldi, bel çukur!' : 'Kalçayı kaldır'; }
  else if (t < 3.8) { a = 1; nefes = 'tut'; etiket = hata ? 'Bel çukurlaşıyor' : 'Bir saniye bekle'; }
  else if (t < 5.8) { a = 1 - yy((t - 3.8) / 2.0); nefes = 'al'; etiket = 'Yavaşça indir'; }
  else { a = 0; nefes = 'al'; etiket = 'Dinlen'; }
  const phi = phi1 * a;
  const kalca = [KOPRU_OMUZ[0] + 86 * Math.cos(phi * D), KOPRU_OMUZ[1] - 86 * Math.sin(phi * D)];
  const ayak = [KOPRU_OMUZ[0] + 86 + 104, ZEMIN - 8 - 17];
  return {
    poz: { kalca, govde: -90 - phi, bas: phi * 0.9, ayakN: ayak, ayakU: ayak, diz: 1, dirsek: 1,
      elN: [KOPRU_OMUZ[0] + 110, ZEMIN - 8 - 12], elU: [KOPRU_OMUZ[0] + 104, ZEMIN - 8 - 12], uzakKayma: [-5, 0],
      vurgu: [{ ne: 'uyluk', yon: -1, v: Math.sin(Math.PI * 0.5 * a) , kalin: 18, kayma: 7 }, { ne: 'govde', yon: 1, v: Math.sin(Math.PI * 0.5 * a) * 0.5, kesit: [0, 0.3], kalin: 24, kayma: 4 }] },
    aksesuarArka: rect(60, ZEMIN - 8, 420, 14, '#3f9c8a', 7) , nefes, etiket, oran: a, zeminSatiri: false,
  };
}
export const kalcaKopru = { baslik: 'Kalça köprüsü', eylemler: {
  kur: { sure: 5, kare() { const r = kopruPoz(0.2); r.etiket = 'Minder üzerinde, sırtüstü'; r.nefes = null; return r; } },
  tekrar: { sure: 6.6, kare: (t) => kopruPoz(t) },
  hata: { sure: 6.6, kare: (t) => kopruPoz(t, true) },
} };

// ------------------------------------------------------------------ ÇEKİŞ PROVASI
const CP_OMUZ_X = 262;
function cekisPoz(t, hata = false) {
  // 0–.8 hazır · .8–1.8 kollar önde · 1.8–3.8 çek (nefes ver) · 3.8–4.4 sıkıştır · 4.4–6.4 bırak (nefes al)
  const hx = 262, hy = 340; // kalça
  let a, nefes, etiket;
  if (t < 0.8) { a = 0; nefes = 'al'; etiket = 'Dik otur, kollar önde'; }
  else if (t < 1.8) { a = 0; nefes = 'al'; etiket = 'Kollar önde'; }
  else if (t < 3.8) { a = yy((t - 1.8) / 2.0); nefes = 'ver'; etiket = 'Dirsekleri geriye çek'; }
  else if (t < 4.4) { a = 1; nefes = 'tut'; etiket = 'Kürek kemiklerini sıkıştır'; }
  else if (t < 6.4) { a = 1 - yy((t - 4.4) / 2.0); nefes = 'al'; etiket = 'Yavaşça bırak'; }
  else { a = 0; nefes = 'al'; etiket = 'Hazır'; }
  if (hata && a > 0.2) etiket = 'Gövde geriye yaslandı!';
  const govde = hata ? -16 * a : 0; // hata: gövdeyi geriye atarak çekmek
  const g = govde * D, omuz = [hx + Math.sin(g) * 86, hy - Math.cos(g) * 86];
  const el = [lerp(omuz[0] + 86, omuz[0] + 26, a), lerp(omuz[1] + 8, omuz[1] + 34, a)];
  const omuzYuksek = hata ? 0 : 0;
  return {
    poz: { kalca: [hx, hy], govde, bas: 0, ayakN: [hx + 62, ZEMIN - 10], ayakU: [hx + 62, ZEMIN - 10], diz: 1, dirsek: -1, elN: el, elU: [el[0] - 3, el[1] + 4], uzakKayma: [-5, 0],
      vurgu: [{ ne: 'govde', yon: 1, v: Math.sin(Math.PI * 0.5 * a) * 0.9, kesit: [0.45, 1], kalin: 22, kayma: 9 }] },
    aksesuarArka: rect(150, 392 - 52 + 28, 0, 0, 'none') + cizgi(190, 270, 190, ZEMIN, 9, KOYU) + cizgi(318, 352, 318, ZEMIN, 9, KOYU) + rect(184, 352, 148, 12, AHSAP, 5) + rect(184, 262, 12, 96, AHSAP, 5), nefes, etiket, oran: a,
  };
}
export const cekisProvasi = { baslik: 'Çekiş provası', eylemler: {
  kur: { sure: 5, kare() { const r = cekisPoz(0.2); r.etiket = 'Dik bir sandalyede otur'; r.nefes = null; return r; } },
  tekrar: { sure: 6.4, kare: (t) => cekisPoz(t) },
  hata: { sure: 6.4, kare: (t) => cekisPoz(t, true) },
} };

// ------------------------------------------------------------------ DENGE TURU
const MASA_Y = ZEMIN - 150;
const masa = () => rect(404, MASA_Y, 136, 10, AHSAP, 4) + cizgi(430, MASA_Y + 10, 430, ZEMIN, 9, KOYU) + cizgi(520, MASA_Y + 10, 520, ZEMIN, 9, KOYU);
function dengePoz(t, hata = false) {
  // 0–.8 hazır · .8–8.0 tandem (3 nefes) · 8–9.2 ayak değiştir · 9.2–16.4 tandem (ters) · 16.4–17.4 tek ayak · 17.4–24.6 tek ayakta (3 nefes)
  // Uzun bir eylemi kısaltmak için: tandem 1 (3 nefes, 2.4 sn) · değiştir · tandem 2 · tek ayak (3 nefes)
  const nef = (x, ps) => { const c = (x % ps) / ps; return c < 0.5 ? ['al', c * 2] : ['ver', (c - 0.5) * 2]; };
  let faz, nefes, etiket, oran, ayN, ayU, kaldirN = 0, sal = 0;
  const ON = [350, ZEMIN - 10], ARKA = [350 - 28, ZEMIN - 10];
  if (t < 0.8) { faz = 'hazir'; [nefes, oran] = ['al', t / 0.8]; etiket = 'Desteğin yanında dur'; ayN = [338, ZEMIN - 10]; ayU = [320, ZEMIN - 10]; }
  else if (t < 8.0) { faz = 'tandem1'; [nefes, oran] = nef(t - 0.8, 2.4); etiket = `Topuk–parmak · nefes ${Math.min(3, Math.floor((t - 0.8) / 2.4) + 1)}/3`; ayN = ON; ayU = ARKA; sal = Math.sin((t - 0.8) * 3) * 1.2; }
  else if (t < 9.2) { faz = 'degis'; const a = yy((t - 8.0) / 1.2); nefes = null; oran = 0; etiket = 'Ayak değiştir'; ayN = [lerp(ON[0], ARKA[0], a), ON[1] - Math.sin(Math.PI * a) * 18]; ayU = [lerp(ARKA[0], ON[0], a), ON[1]]; }
  else if (t < 16.4) { faz = 'tandem2'; [nefes, oran] = nef(t - 9.2, 2.4); etiket = `Ters ayak · nefes ${Math.min(3, Math.floor((t - 9.2) / 2.4) + 1)}/3`; ayN = ARKA; ayU = ON; sal = Math.sin((t - 9.2) * 3) * 1.2; }
  else if (t < 17.4) { faz = 'kaldir'; const a = yy((t - 16.4) / 1.0); nefes = null; oran = 0; etiket = 'Bir ayağını kaldır'; ayN = [lerp(ARKA[0], 296, a), lerp(ARKA[1], ZEMIN - 96, a)]; ayU = ON; kaldirN = a; }
  else { faz = 'tek'; [nefes, oran] = nef(t - 17.4, 2.4); etiket = `Tek ayak · nefes ${Math.min(3, Math.floor((t - 17.4) / 2.4) + 1)}/3`; ayN = [296, ZEMIN - 96]; ayU = ON; kaldirN = 1; sal = Math.sin((t - 17.4) * 3.2) * 1.5; }
  if (hata && t >= 0) etiket = 'Eğilmiş, yere bakıyor!';
  const dur = faz === 'tek' || faz === 'kaldir' ? ayU : (ayN[0] > ayU[0] ? ayN : ayU);
  const kalcaX = (faz === 'tek' || faz === 'kaldir') ? ON[0] - 4 : (ayN[0] + ayU[0]) / 2 - 2;
  const kalcaY = ZEMIN - 10 - 143;
  const govde = hata ? 16 : sal;
  const omuz = [kalcaX + Math.sin(govde * D) * 86, kalcaY - Math.cos(govde * D) * 86];
  const el = [412, MASA_Y - 6], tut = Math.hypot(el[0] - omuz[0], el[1] - omuz[1]);
  return {
    poz: { kalca: [kalcaX, kalcaY], govde, bas: hata ? 34 : 0, ayakN: ayN, ayakU: ayU, diz: 1, dirsek: -1, elN: el, elU: [el[0] - 2, el[1] + 2], uzakKayma: [-4, 0],
      vurgu: [{ ne: 'bacak', yon: 1, v: 0.55 + 0.25 * Math.sin(t * 4), kalin: 14, kayma: 5 }, { ne: 'govde', yon: -1, v: 0.35, kesit: [0, 0.5], kalin: 22, kayma: 6 }] },
    aksesuarArka: masa(), nefes, etiket, oran,
  };
}
export const dengeTuru = { baslik: 'Denge turu', eylemler: {
  kur: { sure: 5, kare() { const r = dengePoz(0.2); r.etiket = 'Masa ya da duvarın yanında'; r.nefes = null; return r; } },
  tekrar: { sure: 24.6, kare: (t) => dengePoz(t) },
  hata: { sure: 8, kare: (t) => dengePoz(0.8 + t) },
} };

// ------------------------------------------------------------------ ÇEVİKLİK TURU (önden)
function ceviklikPoz(t, hata = false) {
  // 5 yan adım sağa, 5 yan adım sola; her adım 0.7 sn.
  const ADIM = 0.7, TOPLAM = 10 * ADIM;
  let x = 270, solX = 252, sagX = 288, kS = 0, kR = 0, etiket = 'Çizginin yanında hazır', nefes = null;
  const tt = Math.min(t, TOPLAM + 0.5);
  if (t >= 0.5) {
    const n = Math.min(9, Math.floor((tt - 0.5) / ADIM)), f = ((tt - 0.5) % ADIM) / ADIM;
    const yon = n < 5 ? 1 : -1, sira = n < 5 ? n : n - 5;
    const baslangic = n < 5 ? 270 : 270 + 5 * 34;
    const kat = (yon === 1 ? sira : sira) * 34 * yon;
    const mevcut = baslangic + kat + (t < 0.5 + 10 * ADIM ? yy(f) * 34 * yon : 0);
    x = mevcut;
    const lead = yy(f);
    const ileriSag = yon === 1;
    if (ileriSag) { sagX = x + 18 + (1 - lead) * -10; solX = x - 18; kR = Math.sin(Math.PI * f) * 16; }
    else { solX = x - 18 + (1 - lead) * 10; sagX = x + 18; kS = Math.sin(Math.PI * f) * 16; }
    etiket = n < 5 ? `Sağa yan adım ${n + 1}/5` : `Sola yan adım ${n - 4}/5`;
  } else { solX = 252; sagX = 288; }
  if (hata && t >= 1.2 && t < 3.0) { const a = Math.sin(Math.PI * ((t - 1.2) / 1.8)); solX = lerp(solX, x + 24, a); sagX = lerp(sagX, x - 24, a); etiket = 'Ayaklar çaprazlandı!'; }
  const cizgiAks = `<polygon points="268,${ZEMIN + 6} 272,${ZEMIN + 6} 270,${ZEMIN - 60}" fill="#fff" opacity=".9"/>` + rect(0, 70, 540, 300, 'none');
  return {
    on: { x, kalcaY: ZEMIN - 10 - 140, ayakSolX: solX, ayakSagX: sagX, kaldirSol: kS, kaldirSag: kR, kolSol: 18 + kR, kolSag: 18 + kS, govdeEgim: 0, zemin: ZEMIN },
    poz: { ayakN: [270, 420], on: true }, aksesuarOn: '',
    aksesuarArka: `<polygon points="266,${ZEMIN + 44} 274,${ZEMIN + 44} 271,${ZEMIN - 40} 269,${ZEMIN - 40}" fill="#ffffff" opacity=".95"/><polygon points="262,${ZEMIN + 100} 278,${ZEMIN + 100} 273,${ZEMIN + 44} 267,${ZEMIN + 44}" fill="#ffffff" opacity=".95"/>`,
    nefes, etiket, oran: 0,
  };
}
export const ceviklikTuru = { baslik: 'Çeviklik turu', eylemler: {
  kur: { sure: 5, kare() { const r = ceviklikPoz(0); r.etiket = 'Yerde hayalî bir çizgi'; return r; } },
  tekrar: { sure: 8, kare: (t) => ceviklikPoz(t) },
  hata: { sure: 4, kare: (t) => ceviklikPoz(1 + t, true) },
} };

export const SAHNELER = { sandalye, 'duvar-sinav': duvarSinav, 'kalca-kopru': kalcaKopru, 'cekis-prova': cekisProvasi, 'denge-turu': dengeTuru, 'ceviklik-turu': ceviklikTuru };
