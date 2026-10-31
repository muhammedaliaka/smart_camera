// Yandan görünen, eklemli bir insan figürü: iki kemikli ters kinematik (diz/dirsek), pantolon/gömlek/ten renkleri,
// ön-arka (uzak) uzuv gölgesi ve kas vurgusu. Tarayıcıda çalışır (SVG metni üretir); hareket-video.mjs bunu kare kare çizer.
// Koordinatlar 540×540; y aşağı doğru artar; figür SAĞA bakar.

export const OLCU = { uyluk: 74, bacak: 72, govde: 86, ustKol: 48, onKol: 44, boyun: 12, bas: 21, ayak: 34, topukY: 10 };
export const RENK = { gomlek: '#2f8f7b', gomlekGolge: '#24705f', pantolon: '#34506b', pantolonGolge: '#27394c', ten: '#f0b98d', tenGolge: '#d79e72', sac: '#3b2a20', ayakkabi: '#23303b', taban: '#f3f6f4', vurgu: '#ff5a36' };

const rad = (d) => (d * Math.PI) / 180;
export const lerp = (a, b, t) => a + (b - a) * t;
export const yumusak = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
export const nokta = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** İki kemikli ters kinematik. kok A, hedef T; kemik uzunlukları l1, l2. yon=+1: eklem, A→T doğrusunun "sağ-ön" (y aşağıyken +x) tarafına çıkar. */
export function ik(A, T, l1, l2, yon = 1) {
  let dx = T[0] - A[0], dy = T[1] - A[1];
  let d = Math.hypot(dx, dy) || 1e-6;
  const dMax = l1 + l2 - 0.01, dMin = Math.abs(l1 - l2) + 0.01;
  const dk = Math.min(dMax, Math.max(dMin, d));
  const ux = dx / d, uy = dy / d;
  const a = (l1 * l1 - l2 * l2 + dk * dk) / (2 * dk);
  const hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const e = [A[0] + ux * a + yon * uy * hh, A[1] + uy * a - yon * ux * hh];
  const hedef = [A[0] + ux * dk, A[1] + uy * dk]; // ulaşılamıyorsa en uzağa uzanır
  return { eklem: e, uc: hedef };
}

const kalin = (p, q, w, renk, ek = '') => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${renk}" stroke-width="${w}" stroke-linecap="round" ${ek}/>`;
const daire = (p, r, renk, ek = '') => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${renk}" ${ek}/>`;

/** p→q doğrusunun yanına (yon * normal * kayma) kaydırılmış, kalın bir vurgu çizgisi. */
function vurguCizgisi(p, q, w, kayma, yon, v) {
  if (!(v > 0.02)) return '';
  const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1;
  const nx = (dy / d) * yon * kayma, ny = (-dx / d) * yon * kayma;
  const a = [p[0] + nx, p[1] + ny], b = [q[0] + nx, q[1] + ny];
  return kalin(a, b, w, RENK.vurgu, `opacity="${(0.12 + 0.55 * v).toFixed(2)}" filter="url(#parla)"`);
}

/**
 * Figürü çizer. poz alanları:
 *  kalca [x,y]; govde (derece, dikeyden öne +); bas (gövdeye göre, +: aşağı bakış);
 *  ayakN, ayakU [x,y] yakın ve uzak ayak bileği; diz (+1 ileri / -1 geri);
 *  elN, elU [x,y] el hedefleri (yoksa kolSalla); dirsek (+1: dirsek hedef doğrultusunun sağ-ön yanına, -1: arka/alt yanına);
 *  topukKalkN (px), ayakAci; vurgu: [{ne:'uyluk'|'bacak'|'govde'|'ustKol'|'onKol', yon, v, kayma?}]; renk: 'hata' ise kırmızımsı ton.
 */
export function figurCiz(poz, { hata = false } = {}) {
  const O = OLCU;
  const kalca = poz.kalca;
  const govdeAci = rad(poz.govde ?? 0);
  const omuz = [kalca[0] + Math.sin(govdeAci) * O.govde, kalca[1] - Math.cos(govdeAci) * O.govde];
  const basAci = govdeAci + rad(poz.bas ?? 0);
  const boyunUc = [omuz[0] + Math.sin(basAci) * O.boyun, omuz[1] - Math.cos(basAci) * O.boyun];
  const basMerkez = [boyunUc[0] + Math.sin(basAci) * O.bas * 0.9, boyunUc[1] - Math.cos(basAci) * O.bas * 0.9];
  const diz = poz.diz ?? 1;

  const bacakHesap = (ayak) => {
    const r = ik(kalca, ayak, O.uyluk, O.bacak, diz);
    return { diz: r.eklem, ayak: r.uc };
  };
  const bN = bacakHesap(poz.ayakN), bU = bacakHesap(poz.ayakU || poz.ayakN);
  const gu = poz.govdeYanki ?? 0;
  const kolHesap = (el, kolSalla) => {
    if (el) { const r = ik(omuz, el, O.ustKol, O.onKol, poz.dirsek ?? -1); return { dirsek: r.eklem, el: r.uc }; }
    const a1 = rad(kolSalla?.[0] ?? 8), a2 = a1 + rad(kolSalla?.[1] ?? 10); // omuzdan aşağı doğru; + öne
    const dirsek = [omuz[0] + Math.sin(a1) * O.ustKol, omuz[1] + Math.cos(a1) * O.ustKol];
    return { dirsek, el: [dirsek[0] + Math.sin(a2) * O.onKol, dirsek[1] + Math.cos(a2) * O.onKol] };
  };
  const kN = kolHesap(poz.elN, poz.kolSalla), kU = kolHesap(poz.elU || poz.elN, poz.kolSalla);

  const gom = hata ? '#b8503f' : RENK.gomlek, gomG = hata ? '#8f3b2d' : RENK.gomlekGolge;
  const pan = RENK.pantolon, panG = RENK.pantolonGolge;
  const zemin = poz.zemin ?? 430;

  const ayakCiz = (b, topuk, renk) => {
    const a = b.ayak, ayakY = a[1] + O.topukY, k = topuk || 0;
    const topuk0 = [a[0] - 9, ayakY - k], ucu = [a[0] + O.ayak - 9, ayakY];
    return kalin(topuk0, ucu, 14, renk) + kalin([topuk0[0], topuk0[1] + 6], [ucu[0], ucu[1] + 6], 3, RENK.taban);
  };
  const ofs = poz.uzakKayma ?? [-7, 0];
  const kayik = (p) => [p[0] + ofs[0], p[1] + ofs[1]];

  let s = '';
  // uzak uzuvlar
  s += kalin(kalca, kayik(bU.diz), 19, panG) + kalin(kayik(bU.diz), kayik(bU.ayak), 16, panG);
  s += `<g transform="translate(${ofs[0]},${ofs[1]})">${ayakCiz(bU, poz.topukKalkU, '#17222b')}</g>`;
  s += kalin(omuz, kU.dirsek, 13, gomG) + kalin(kU.dirsek, kU.el, 11, RENK.tenGolge) + daire(kU.el, 7, RENK.tenGolge);
  // gövde
  s += kalin(kalca, omuz, 34, gom);
  s += daire(kalca, 17, pan);
  // yakın bacak
  s += kalin(kalca, bN.diz, 21, pan) + kalin(bN.diz, bN.ayak, 17, pan);
  s += ayakCiz(bN, poz.topukKalkN, RENK.ayakkabi);
  // yakın kol
  s += kalin(omuz, kN.dirsek, 14, gom) + kalin(kN.dirsek, kN.el, 12, RENK.ten) + daire(kN.el, 8, RENK.ten);
  // boyun ve baş (yüz sağa bakar)
  s += kalin(omuz, boyunUc, 11, RENK.ten);
  s += daire([basMerkez[0] - Math.cos(basAci) * 4, basMerkez[1] - Math.sin(basAci) * 4], O.bas + 1.5, RENK.sac);
  s += daire([basMerkez[0] + Math.cos(basAci) * 2.5, basMerkez[1] + Math.sin(basAci) * 2.5 + 1], O.bas - 1, RENK.ten);
  s += daire([basMerkez[0] + Math.cos(basAci) * 11, basMerkez[1] + Math.sin(basAci) * 11 - 3], 2.4, '#2a1d17');
  // kas vurgusu
  const seg = { uyluk: [kalca, bN.diz], bacak: [bN.diz, bN.ayak], govde: [kalca, omuz], ustKol: [omuz, kN.dirsek], onKol: [kN.dirsek, kN.el] };
  for (const v of poz.vurgu || []) {
    const [p, q] = seg[v.ne] || []; if (!p) continue;
    const [a, b] = v.kesit || [0, 1];
    s += vurguCizgisi([lerp(p[0], q[0], a), lerp(p[1], q[1], a)], [lerp(p[0], q[0], b), lerp(p[1], q[1], b)], v.kalin ?? 16, v.kayma ?? 6, v.yon ?? 1, v.v ?? 0);
  }
  return { svg: s, eklemler: { kalca, omuz, basMerkez, dizN: bN.diz, ayakN: bN.ayak, dirsekN: kN.dirsek, elN: kN.el, zemin } };
}


/**
 * Önden görünüm (çeviklik turu gibi yana hareketler). poz: { x (gövde merkezi), kalcaY, ayakSolX, ayakSagX, kaldirSol, kaldirSag (px),
 *  kolSol, kolSag (derece, dışa +), govdeEgim (derece), zemin }. "Sol/sağ" izleyicinin gözünden.
 */
export function figurOnCiz(poz, { hata = false } = {}) {
  const O = OLCU, z = poz.zemin ?? 430, x = poz.x, kalcaY = poz.kalcaY ?? 290;
  const egim = rad(poz.govdeEgim ?? 0);
  const omuzM = [x + Math.sin(egim) * O.govde, kalcaY - Math.cos(egim) * O.govde];
  const omuzG = 30, kalcaG = 15;
  const omuzS = [omuzM[0] - omuzG, omuzM[1]], omuzR = [omuzM[0] + omuzG, omuzM[1]];
  const kalcaS = [x - kalcaG, kalcaY], kalcaR = [x + kalcaG, kalcaY];
  const gom = hata ? '#b8503f' : RENK.gomlek, pan = RENK.pantolon;
  const ayak = (kalca, ax, kaldir) => {
    const a = [ax, z - O.topukY - 7 - kaldir];
    const r = ik(kalca, a, O.uyluk, O.bacak, kalca[0] < x ? -1 : 1); // diz hafifçe dışa
    return { diz: r.eklem, ayak: r.uc };
  };
  const bS = ayak(kalcaS, poz.ayakSolX, poz.kaldirSol ?? 0), bR = ayak(kalcaR, poz.ayakSagX, poz.kaldirSag ?? 0);
  const kol = (omuz, aci, yon) => {
    const a1 = rad(aci * yon), a2 = rad((aci + 18) * yon);
    const dirsek = [omuz[0] + Math.sin(a1) * O.ustKol, omuz[1] + Math.cos(a1) * O.ustKol];
    return { dirsek, el: [dirsek[0] + Math.sin(a2) * O.onKol, dirsek[1] + Math.cos(a2) * O.onKol] };
  };
  const kS = kol(omuzS, poz.kolSol ?? 14, -1), kR = kol(omuzR, poz.kolSag ?? 14, 1);
  const ayakkabi = (b) => kalin([b.ayak[0] - 12, b.ayak[1] + O.topukY], [b.ayak[0] + 12, b.ayak[1] + O.topukY], 14, RENK.ayakkabi);
  let s = '';
  s += kalin(kalcaS, bS.diz, 20, pan) + kalin(bS.diz, bS.ayak, 17, pan) + ayakkabi(bS);
  s += kalin(kalcaR, bR.diz, 20, pan) + kalin(bR.diz, bR.ayak, 17, pan) + ayakkabi(bR);
  s += kalin([x, kalcaY], omuzM, 46, gom);
  s += kalin(omuzS, kS.dirsek, 13, gom) + kalin(kS.dirsek, kS.el, 11, RENK.ten) + daire(kS.el, 8, RENK.ten);
  s += kalin(omuzR, kR.dirsek, 13, gom) + kalin(kR.dirsek, kR.el, 11, RENK.ten) + daire(kR.el, 8, RENK.ten);
  const basM = [omuzM[0] + Math.sin(egim) * (O.boyun + O.bas * 0.9), omuzM[1] - Math.cos(egim) * (O.boyun + O.bas * 0.9)];
  s += kalin(omuzM, basM, 11, RENK.ten);
  s += daire(basM, O.bas + 1.5, RENK.sac) + daire([basM[0], basM[1] + 2.5], O.bas - 1, RENK.ten);
  s += daire([basM[0] - 7, basM[1] + 1], 2.3, '#2a1d17') + daire([basM[0] + 7, basM[1] + 1], 2.3, '#2a1d17');
  return { svg: s, eklemler: { x, omuzM, basM } };
}
