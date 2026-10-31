// Küçük DOM yardımcıları, simgeler ve bildirim.

const SVGNS = 'http://www.w3.org/2000/svg';

/** h('div.kart#x', {onclick}, 'metin', altEleman) */
export function h(etiket, ozellik, ...cocuklar) {
  const eslesme = /^([a-z0-9-]*)((?:[.#][^.#]+)*)$/i.exec(etiket);
  const el = document.createElement((eslesme && eslesme[1]) || 'div');
  for (const parca of (eslesme ? eslesme[2] : '').match(/[.#][^.#]+/g) || []) {
    if (parca[0] === '#') el.id = parca.slice(1); else el.classList.add(parca.slice(1));
  }
  if (ozellik && (typeof ozellik !== 'object' || ozellik instanceof Node || Array.isArray(ozellik) )) {
    cocuklar.unshift(ozellik); ozellik = null;
  }
  for (const [k, v] of Object.entries(ozellik || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else if (k === 'data') for (const [dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  ekle(el, cocuklar);
  return el;
}

export function ekle(el, cocuklar) {
  for (const c of cocuklar.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function temizle(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

const YOLLAR = {
  bugun: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  dersler: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6M9 11h6"/>',
  tekrar: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  oyun: '<rect x="2" y="7" width="20" height="12" rx="5"/><path d="M7 10v6M4 13h6M16 11h.01M19 14h.01"/>',
  ben: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  cal: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  durdur: '<rect x="6" y="5" width="12" height="14" rx="2" fill="currentColor"/>',
  ses: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mikrofon: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  tik: '<path d="M4 12.5 9.5 18 20 6.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  geri: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  dis: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  indir: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  yukle: '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
  ayar: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  kilit: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  yildiz: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  ates: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  liste: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  ara: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  yenile: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  uyari: '<path d="M12 3 2 20h20zM12 10v4M12 17h.01"/>',
  bilgi: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  kutu: '<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  kalem: '<path d="M4 20l1-5L16 4l4 4L9 19z"/>',
  sil: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
};

export function simge(ad, sinif = '') {
  const s = document.createElementNS(SVGNS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', ('ikon ' + sinif).trim());
  s.innerHTML = YOLLAR[ad] || YOLLAR.bilgi;
  return s;
}

/** Halka ilerleme göstergesi. yuzde 0..100 */
export function halka(yuzde, etiket, boyut = 64) {
  const r = 28, c = 2 * Math.PI * r;
  const kap = h('div.halka', { style: `width:${boyut}px;height:${boyut}px`, role: 'img', 'aria-label': `%${Math.round(yuzde)}` });
  kap.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="arka" cx="32" cy="32" r="${r}"/><circle class="on" cx="32" cy="32" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(100, yuzde)) / 100)}"/></svg>`;
  kap.append(h('b', etiket ?? `%${Math.round(yuzde)}`));
  return kap;
}

export function cubuk(yuzde) {
  return h('div.cubuk', { role: 'progressbar', 'aria-valuenow': Math.round(yuzde), 'aria-valuemin': 0, 'aria-valuemax': 100 },
    h('i', { style: `width:${Math.max(0, Math.min(100, yuzde))}%` }));
}

let toastZamani = 0;
export function bildir(mesaj, sure = 2600) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = h('div.toast', { role: 'status' }, mesaj);
  document.body.append(t);
  clearTimeout(toastZamani);
  toastZamani = setTimeout(() => t.remove(), sure);
}

/** Karıştır (Fisher-Yates), tohumlu rastgele kullanılabilir. */
export function karistir(dizi, rastgele = Math.random) {
  const a = dizi.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** mulberry32 — tohumdan tekrarlanabilir rastgele. */
export function tohumlu(tohum) {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function yazidanTohum(s) {
  let h32 = 2166136261;
  for (let i = 0; i < s.length; i++) { h32 ^= s.charCodeAt(i); h32 = Math.imul(h32, 16777619); }
  return h32 >>> 0;
}

export function kacis(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
