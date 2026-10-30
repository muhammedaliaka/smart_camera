// Bilgisayarla eşitleme: uygulamanın kaydını, uygulamayı sunan yerel sunucuya (scripts/sunucu.mjs) gönderir.
// MCP sunucusu (scripts/mcp.mjs) bu kaydı okur; böylece bir yapay zekâ asistanı raporu ve seviyeleri kendisi alabilir.
// Veri yalnız senin sunucuna gider (aynı adres); üçüncü bir hizmete hiçbir şey gönderilmez. Belirteç yalnız bu cihazda saklanır.

import * as store from './store.js';
import { simdiISO } from './zaman.js';

const ANAHTAR = 'od3.esitle';

/** { belirtec, otomatik, son } — durum kaydından ayrı tutulur (yedeğe girmez). */
export function ayarOku() {
  try { return { belirtec: '', otomatik: false, son: null, ...(JSON.parse(localStorage.getItem(ANAHTAR) || '{}')) }; }
  catch { return { belirtec: '', otomatik: false, son: null }; }
}
export function ayarYaz(a) {
  try { localStorage.setItem(ANAHTAR, JSON.stringify(a)); } catch { /* tarayıcı depolamayı engelliyor olabilir */ }
}

/** Kaydı sunucuya gönderir. Başarılıysa { tarih, olay }; değilse anlaşılır bir hata fırlatır. */
export async function esitle() {
  const a = ayarOku();
  if (!a.belirtec) throw new Error('Önce sunucunun yazdığı eşitleme belirtecini yaz.');
  let r;
  try {
    r = await fetch('/api/durum', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-belirtec': a.belirtec },
      body: JSON.stringify({ tur: 'od3-yedek', surum: store.SURUM, tarih: simdiISO(), durum: store.al() }),
    });
  } catch { throw new Error('Sunucuya ulaşılamadı. Uygulamayı “node scripts/sunucu.mjs” ile açtığından emin ol.'); }
  if (r.status === 401) throw new Error('Belirteç yanlış. Sunucunun açılışta yazdığı belirteci kopyala.');
  if (r.status === 404 || r.status === 405) throw new Error('Bu adreste eşitleme yok. Uygulamayı “node scripts/sunucu.mjs” ile aç (barındırma hizmetlerinde çalışmaz; orada “Yedek indir”i kullan).');
  if (!r.ok) throw new Error(`Eşitlenemedi (${r.status})`);
  const s = await r.json().catch(() => ({}));
  a.son = simdiISO(); ayarYaz(a);
  return { tarih: a.son, olay: s.olay ?? null };
}

let zamanlayici = null;
/** Otomatik eşitleme açıksa, kayıt değiştikten 4 sn sonra (arka arkaya değişiklikler tek gönderimde) gönderir. */
export function otomatikBaslat() {
  store.degisinceDinle(() => {
    const a = ayarOku();
    if (!a.otomatik || !a.belirtec) return;
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => { esitle().catch(() => { /* sessiz: elle eşitle düğmesi hatayı gösterir */ }); }, 4000);
  });
}
