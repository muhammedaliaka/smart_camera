// Çevrimdışı önbellek: ses/liste.json'daki sesleri 'od3-ses', gorsel/spor/video/liste.json'daki hareket videolarını 'od3-video' önbelleğine indirir.

const ONBELLEK = 'od3-ses';
const VIDEO = 'od3-video';
const videoListesi = async () => { try { const r = await fetch('gorsel/spor/video/liste.json', { cache: 'no-cache' }); return r.ok ? await r.json() : []; } catch { return []; } };

export async function cevrimdisiDurum() {
  if (!('caches' in globalThis)) return 'Bu tarayıcı çevrimdışı saklamayı desteklemiyor.';
  try {
    const liste = await (await fetch('ses/liste.json', { cache: 'no-cache' })).json();
    const c = await caches.open(ONBELLEK);
    const var_ = (await c.keys()).length;
    const vl = await videoListesi(), vc = await caches.open(VIDEO), vvar = (await vc.keys()).length;
    const sesMetni = var_ >= liste.length && liste.length ? `${liste.length} ses dosyasının hepsi cihazda ✓` : `${var_}/${liste.length} ses dosyası cihazda`;
    const videoMetni = vl.length ? (vvar >= vl.length ? ` · ${vl.length} hareket videosu cihazda ✓` : ` · ${vvar}/${vl.length} hareket videosu cihazda`) : '';
    return sesMetni + videoMetni;
  } catch { return 'Ses listesi okunamadı.'; }
}

export async function cevrimdisiIndir(ilerleme) {
  if (!('caches' in globalThis)) throw new Error('tarayıcı desteklemiyor (https ya da localhost gerekir)');
  const liste = await (await fetch('ses/liste.json', { cache: 'no-cache' })).json();
  const c = await caches.open(ONBELLEK);
  const vl = await videoListesi(), vc = await caches.open(VIDEO);
  const toplam = liste.length + vl.length;
  let n = 0;
  for (const dosya of liste) {
    const yol = 'ses/' + dosya;
    if (!(await c.match(yol))) {
      const r = await fetch(yol);
      if (r.ok) await c.put(yol, r);
    }
    ilerleme?.(++n, toplam);
  }
  for (const dosya of vl) {
    const yol = 'gorsel/spor/video/' + dosya;
    if (!(await vc.match(yol))) {
      const r = await fetch(yol);
      if (r.ok) await vc.put(yol, r);
    }
    ilerleme?.(++n, toplam);
  }
}
