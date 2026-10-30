// Servis çalışanı: uygulama çevrimdışı da açılsın.
//  • Uygulama dosyaları ve içerik (js, css, json): önce ağ, olmazsa önbellek → güncelleme otomatik gelir, sürüm numarası değiştirmek gerekmez.
//  • Ses dosyaları (ses/*.mp3) ve hareket videoları (gorsel/spor/video/*.mp4): önce önbellek (indirme düğmesiyle ya da ilk açılışta dolar), yoksa ağ.
// Yalnız https ya da localhost'ta çalışır; dosyadan açılınca (file://) kaydedilmez.

const KABUK = 'od3-kabuk';
const SES = 'od3-ses';
const VIDEO = 'od3-video';
const ILK = ['./', 'index.html', 'css/app.css', 'js/main.js', 'manifest.webmanifest', 'gorsel/simge.svg'];
const AG_ZAMAN_ASIMI = 4000;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(KABUK).then((c) => c.addAll(ILK)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((adlar) => Promise.all(adlar.filter((a) => a !== KABUK && a !== SES && a !== VIDEO).map((a) => caches.delete(a))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const istek = e.request;
  if (istek.method !== 'GET') return;
  const url = new URL(istek.url);
  if (url.origin !== location.origin) return;
  if (/\/ses\/[^/]+\.mp3$/.test(url.pathname)) e.respondWith(medyaYaniti(istek, SES, 'audio/mpeg'));
  else if (/\/gorsel\/spor\/video\/[^/]+\.mp4$/.test(url.pathname)) e.respondWith(medyaYaniti(istek, VIDEO, 'video/mp4'));
  else e.respondWith(agOnce(istek));
});

async function agOnce(istek) {
  const onbellek = await caches.open(KABUK);
  try {
    const yanit = await Promise.race([
      fetch(istek, { cache: 'no-cache' }),
      new Promise((_, red) => setTimeout(() => red(new Error('zaman aşımı')), AG_ZAMAN_ASIMI)),
    ]);
    if (yanit.ok) onbellek.put(istek, yanit.clone());
    return yanit;
  } catch {
    const kayit = (await onbellek.match(istek, { ignoreSearch: true })) || (istek.mode === 'navigate' ? await onbellek.match('index.html') : null);
    return kayit || new Response('Çevrimdışısın ve bu dosya cihazda yok.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function medyaYaniti(istek, onbellekAdi, tur) {
  const onbellek = await caches.open(onbellekAdi);
  const url = new URL(istek.url);
  const anahtar = url.origin + url.pathname;
  let kayit = await onbellek.match(anahtar);
  if (!kayit) {
    try {
      const yanit = await fetch(anahtar);
      if (yanit.ok) { onbellek.put(anahtar, yanit.clone()); kayit = yanit; } else return yanit;
    } catch { return new Response('', { status: 504 }); }
  }
  return aralikYaniti(istek, kayit, tur);
}

// Safari ses ve video oynatırken "Range" ister; tam yanıtı istenen parçaya kesip 206 olarak ver.
async function aralikYaniti(istek, yanit, tur) {
  const aralik = istek.headers.get('range');
  if (!aralik) return yanit;
  const m = /bytes=(\d+)-(\d*)/.exec(aralik);
  if (!m) return yanit;
  const tampon = await yanit.clone().arrayBuffer();
  const bas = +m[1], son = m[2] ? Math.min(+m[2], tampon.byteLength - 1) : tampon.byteLength - 1;
  return new Response(tampon.slice(bas, son + 1), {
    status: 206,
    headers: { 'Content-Type': tur, 'Content-Range': `bytes ${bas}-${son}/${tampon.byteLength}`, 'Content-Length': String(son - bas + 1), 'Accept-Ranges': 'bytes' },
  });
}
