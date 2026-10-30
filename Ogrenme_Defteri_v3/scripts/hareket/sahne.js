// Bir videonun tek karesini oluşturur: arka plan, donanım, figür, başlık, etiket, nefes halkası, altyazı.
import { figurCiz, figurOnCiz } from './figur.js';
import { SAHNELER, ZEMIN } from './sahneler.js';

const W = 540, H = 540;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "font-family=\"Inter, 'DejaVu Sans', sans-serif\"";

/** Altyazıyı genişliğe göre satırlara böler (yaklaşık karakter sayısı). */
function satirlar(metin, en = 34) {
  const kelimeler = String(metin).split(/\s+/), sat = []; let cur = '';
  for (const k of kelimeler) { if ((cur + ' ' + k).trim().length > en) { sat.push(cur); cur = k; } else cur = (cur + ' ' + k).trim(); }
  if (cur) sat.push(cur);
  return sat.slice(0, 4);
}

function nefesHalka(faz, oran) {
  if (!faz) return '';
  const cx = 470, cy = 118;
  const r = faz === 'al' ? 16 + 14 * oran : faz === 'ver' ? 30 - 14 * oran : 30;
  const metin = faz === 'al' ? 'nefes al' : faz === 'ver' ? 'nefes ver' : 'tut';
  const renk = faz === 'al' ? '#2f8f7b' : faz === 'ver' ? '#e08a2e' : '#6b7a89';
  return `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="${renk}" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${renk}" stroke-width="3"/>` +
    `<text x="${cx}" y="${cy + 52}" text-anchor="middle" font-size="15" font-weight="600" fill="${renk}" ${FONT}>${metin}</text>`;
}

/**
 * kare: { sahne, eylem, t, baslik?, altyazi?, sayac?: {n, toplam}, ipucu?: {metin, renk} }
 * Dönen: SVG metni (540×540).
 */
export function kareSvg(k) {
  const s = SAHNELER[k.sahne];
  const ey = s.eylemler[k.eylem];
  const r = ey.kare(k.t);
  const hata = k.eylem === 'hata';
  if (k.eylem === 'kur') r.poz.vurgu = []; // hazırlıkta kas parlaması olmaz; yalnızca hareket sırasında
  const { svg: figur } = r.on ? figurOnCiz(r.on, { hata }) : figurCiz(r.poz, { hata });
  const bg = hata ? ['#fbeeea', '#f4dcd5'] : ['#f3f8f2', '#e2ece3'];
  let o = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>` +
    `<filter id="parla" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  o += r.aksesuarArka || '';
  o += `<ellipse cx="${(r.poz.ayakN[0] + 4).toFixed(0)}" cy="${ZEMIN + 8}" rx="120" ry="8" fill="#000" opacity=".08"/>`;
  o += `<rect x="0" y="${ZEMIN + 10}" width="${W}" height="${H - ZEMIN - 10}" fill="${hata ? '#eac9c0' : '#d3e0d2'}"/>`;
  o += figur;
  o += r.aksesuarOn || '';
  // başlık
  o += `<rect x="0" y="0" width="${W}" height="70" fill="${hata ? '#8f3b2d' : '#244c45'}"/>`;
  o += `<text x="24" y="34" font-size="23" font-weight="700" fill="#fff" ${FONT}>${esc(k.baslik || s.baslik)}</text>`;
  if (k.rozet) o += `<text x="24" y="58" font-size="15" fill="#d9ece6" ${FONT}>${esc(k.rozet)}</text>`;
  if (k.sag) o += `<text x="${W - 24}" y="44" text-anchor="end" font-size="24" font-weight="700" fill="#fff" ${FONT}>${esc(k.sag)}</text>`;
  else if (k.sayac) o += `<text x="${W - 24}" y="44" text-anchor="end" font-size="26" font-weight="700" fill="#fff" ${FONT}>${k.sayac.n}/${k.sayac.toplam}</text>`;
  // etiket (aşama)
  if (r.etiket) o += `<g><rect x="24" y="88" rx="14" width="${Math.max(120, r.etiket.length * 13 + 36)}" height="38" fill="#fff" opacity=".92"/><text x="42" y="114" font-size="20" font-weight="700" fill="${hata ? '#8f3b2d' : '#244c45'}" ${FONT}>${esc(r.etiket)}</text></g>`;
  o += nefesHalka(r.nefes, r.oran ?? 0);
  // altyazı
  if (k.altyazi) {
    const sat = satirlar(k.altyazi);
    const yb = H - 14 - sat.length * 26;
    o += `<rect x="0" y="${yb - 14}" width="${W}" height="${H - yb + 14}" fill="#102a26" opacity=".86"/>`;
    sat.forEach((t, i) => { o += `<text x="${W / 2}" y="${yb + 14 + i * 26}" text-anchor="middle" font-size="21" font-weight="600" fill="#fff" ${FONT}>${esc(t)}</text>`; });
  }
  if (k.ipucu) o += `<g><rect x="${W - 24 - Math.max(120, k.ipucu.metin.length * 11 + 32)}" y="88" rx="14" width="${Math.max(120, k.ipucu.metin.length * 11 + 32)}" height="36" fill="${k.ipucu.renk || '#e08a2e'}"/><text x="${W - 24 - Math.max(120, k.ipucu.metin.length * 11 + 32) / 2}" y="112" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" ${FONT}>${esc(k.ipucu.metin)}</text></g>`;
  return o + '</svg>';
}
