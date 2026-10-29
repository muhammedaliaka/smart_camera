// Çevrimdışı ses önbelleği: ses/liste.json'daki tüm dosyaları 'od3-ses' önbelleğine indirir.

const ONBELLEK = 'od3-ses';

export async function cevrimdisiDurum() {
  if (!('caches' in globalThis)) return 'Bu tarayıcı çevrimdışı saklamayı desteklemiyor.';
  try {
    const liste = await (await fetch('ses/liste.json', { cache: 'no-cache' })).json();
    const c = await caches.open(ONBELLEK);
    const var_ = (await c.keys()).length;
    return var_ >= liste.length && liste.length ? `${liste.length} ses dosyasının hepsi cihazda ✓` : `${var_}/${liste.length} ses dosyası cihazda`;
  } catch { return 'Ses listesi okunamadı.'; }
}

export async function cevrimdisiIndir(ilerleme) {
  if (!('caches' in globalThis)) throw new Error('tarayıcı desteklemiyor (https ya da localhost gerekir)');
  const liste = await (await fetch('ses/liste.json', { cache: 'no-cache' })).json();
  const c = await caches.open(ONBELLEK);
  let n = 0;
  for (const dosya of liste) {
    const yol = 'ses/' + dosya;
    if (!(await c.match(yol))) {
      const r = await fetch(yol);
      if (r.ok) await c.put(yol, r);
    }
    ilerleme?.(++n, liste.length);
  }
}
