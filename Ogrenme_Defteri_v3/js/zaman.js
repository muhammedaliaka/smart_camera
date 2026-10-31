// Tarih/saat yardımcıları. Tüm günler yerel saat dilimindeki YYYY-MM-DD metnidir.
// Test için ?t=2026-11-03 adres parametresi (yalnız oturum boyunca) "bugün"ü değiştirir.

let sabit = null;
try {
  const p = new URLSearchParams(globalThis.location?.search || '');
  const t = p.get('t');
  if (t && /^\d{4}-\d{2}-\d{2}$/.test(t)) sabit = t;
} catch { /* tarayıcı dışı */ }

const iki = (n) => String(n).padStart(2, '0');

export function simdi() {
  if (sabit) { const d = new Date(); return new Date(`${sabit}T${iki(d.getHours())}:${iki(d.getMinutes())}:${iki(d.getSeconds())}`); }
  return new Date();
}
export function tarihMetni(d) { return `${d.getFullYear()}-${iki(d.getMonth() + 1)}-${iki(d.getDate())}`; }
export function bugun() { return tarihMetni(simdi()); }
export function tarihtenDate(s) { const [y, m, g] = s.split('-').map(Number); return new Date(y, m - 1, g, 12); }
export function gunEkle(s, n) { const d = tarihtenDate(s); d.setDate(d.getDate() + n); return tarihMetni(d); }
export function gunFarki(a, b) { return Math.round((tarihtenDate(b) - tarihtenDate(a)) / 86400000); } // b - a

const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export function uzunTarih(s) { const d = tarihtenDate(s); return `${d.getDate()} ${AYLAR[d.getMonth()]} ${GUNLER[d.getDay()]}`; }
export function kisaTarih(s) { const d = tarihtenDate(s); return `${d.getDate()} ${AYLAR[d.getMonth()].slice(0, 3)}`; }
export function saatMetni(iso) { const d = new Date(iso); return `${iki(d.getHours())}:${iki(d.getMinutes())}`; }
export function goreceli(s, bugunS = bugun()) {
  const f = gunFarki(bugunS, s);
  if (f === 0) return 'bugün';
  if (f === 1) return 'yarın';
  if (f === -1) return 'dün';
  if (f > 0) return `${f} gün sonra`;
  return `${-f} gün önce`;
}
export function sureMetni(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${iki(s % 60)}`;
}
export function simdiISO() { return simdi().toISOString(); }
