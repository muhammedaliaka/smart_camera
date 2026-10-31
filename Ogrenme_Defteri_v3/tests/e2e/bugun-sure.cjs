// Bugün ekranı: dakika tahminleri, "Başla" tek tuşu, odak kesimi (şimdi / mola sonrası), mola sayfası, "sure" kaydı ve spor kartındaki video.
//   NODE_PATH=$(npm root -g) node tests/e2e/bugun-sure.cjs
// Ortam: ADRES (varsayılan http://localhost:8812), CIKTI (ekran görüntüsü klasörü)
const { chromium } = require('playwright');
const { gez } = require('./gezgin.cjs');
const fs = require('fs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const tarih = (n) => new Date(Date.UTC(2026, 10, 2 + n)).toISOString().slice(0, 10); // gün 1 = 2026-11-02
const U = (n, hash) => `${ADRES}/?sw0=1&t=${tarih(n - 1)}${hash || ''}`;
fs.mkdirSync(CIKTI, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const sorunlar = [], hatalar = [], sonuc = [];
  // Test hızlı gezdiği için Date.now 60 kat hızlı akar: oturum "gerçekten" birkaç dakika sürmüş görünür (süre kaydı en az 20 sn ister).
  await p.addInitScript(() => { const o = Date.now.bind(Date), t0 = o(); Date.now = () => t0 + (o() - t0) * 60; });
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));

  await p.goto(U(8), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
  // Program 1. günden başlamış gibi: başlangıç = gün 1
  await p.evaluate((t) => { const d = JSON.parse(localStorage.getItem('od3.durum')); d.baslangic = t; localStorage.setItem('od3.durum', JSON.stringify(d)); }, tarih(0));

  // ---- Gün 8 (yoklama haftası bitti; desen: İngilizce + okuma + spor): Bugün ----
  await p.goto(U(8, '#/bugun')); await p.reload(); await p.waitForTimeout(500);
  const basla = p.locator('a.basla');
  if (!(await basla.count())) sorunlar.push('Bugün: "Başla" düğmesi yok');
  else {
    const metin = await basla.innerText();
    if (!/Başla/.test(metin) || !/≈ \d+ dk/.test(metin) || !/odak süren 30 dk/.test(metin)) sorunlar.push(`Bugün: Başla düğmesinde süre bilgisi eksik: ${JSON.stringify(metin)}`);
  }
  const satirlar = await p.evaluate(() => [...document.querySelectorAll('a.gorev')].filter((a) => !a.closest('details')).map((a) => ({ href: a.getAttribute('href'), alt: a.querySelector('.alt')?.textContent || '' })));
  const eksik = satirlar.filter((s) => /^#\/(seviye|yoklama|ders)\//.test(s.href) && !/≈ \d+ dk/.test(s.alt));
  if (eksik.length) sorunlar.push(`Bugün: dakika bilgisi olmayan görevler: ${eksik.map((s) => s.href).join(', ')}`);
  const baslik = (await p.locator('.bolum-baslik h2').allInnerTexts()).join('|');
  if (!/Şimdi/.test(baslik)) sorunlar.push(`Bugün: "Şimdi" bölümü yok (${baslik})`);
  if (!/Hareket/.test(baslik)) sorunlar.push(`Bugün: "Hareket" bölümü (spor) yok (${baslik})`);
  await p.screenshot({ path: `${CIKTI}/bugun-sure.png`, fullPage: true });

  // ---- Odak süresi 20 dk: kesim değişir (mola sonrası bölümü görünür) ----
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('od3.durum')); d.ayar.odakDk = 20; localStorage.setItem('od3.durum', JSON.stringify(d)); });
  await p.goto(U(8, '#/bugun')); await p.reload(); await p.waitForTimeout(500);
  const baslik20 = (await p.locator('.bolum-baslik h2').allInnerTexts()).join('|');
  const toplamOdak = await p.evaluate(() => [...document.querySelectorAll('a.gorev')].filter((a) => !/spor/.test(a.getAttribute('href'))).length);
  console.log('odak 20 dk bölümleri:', baslik20, '· görev:', toplamOdak);
  if (!/Hareket/.test(baslik20)) sorunlar.push(`odak 20 dk: "Hareket" bölümü kayboldu (${baslik20})`);

  // ---- Başla → ilk görev → bitiş: "Sıradaki" düğmesi dakika gösterir ya da mola önerir; "sure" kaydı yazılır ----
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('od3.durum')); d.ayar.odakDk = 30; localStorage.setItem('od3.durum', JSON.stringify(d)); });
  await p.goto(U(8, '#/bugun')); await p.reload(); await p.waitForTimeout(500);
  const hedef = await p.locator('a.basla').getAttribute('href');
  await p.goto(U(8, hedef)); await p.waitForTimeout(400);
  if (!(await p.locator('.oyuncu').count())) sorunlar.push(`Başla (${hedef}) oynatıcıyı açmadı`);
  else {
    const r = await gez(p, { ad: 'basla-ilk', klasor: CIKTI, sonuc, dogru: 0.8, ekran: false, azami: 200 });
    if (!r.bitti) sorunlar.push('ilk görev sonuna kadar oynanamadı');
    const sonraki = await p.locator('.oyuncu a.dugme.birincil').first().innerText().catch(() => '');
    if (!/(≈ \d+ dk|mola)/i.test(sonraki)) sorunlar.push(`sonuç ekranındaki "sıradaki" düğmesinde süre/mola yok: ${JSON.stringify(sonraki)}`);
  }
  const olaylar = await p.evaluate(() => JSON.parse(localStorage.getItem('od3.durum')).olaylar.filter((o) => o.tur === 'sure'));
  if (!olaylar.length) sorunlar.push('"sure" kaydı yazılmadı');
  else if (!(olaylar[0].sn >= 0 && olaylar[0].ders)) sorunlar.push(`"sure" kaydı eksik: ${JSON.stringify(olaylar[0])}`);

  // ---- Mola sayfası ----
  await p.goto(U(8, '#/mola')); await p.waitForTimeout(300);
  if (!(await p.locator('text=Kısa mola').count())) sorunlar.push('Mola sayfası açılmadı');
  await p.screenshot({ path: `${CIKTI}/mola.png` });
  await p.click('text=Molayı atla'); await p.waitForTimeout(200);
  if (!(await p.locator('text=Mola tamam').count())) sorunlar.push('Mola tamam ekranı yok');
  const molaIsaret = await p.evaluate((t) => !!JSON.parse(localStorage.getItem('od3.durum')).notlar['mola:' + t], tarih(7)); // gün 8 = tarih(7)
  if (!molaIsaret) sorunlar.push('mola işaretlenmedi');

  // ---- Ayarlar: odak süresi ----
  await p.goto(U(8, '#/ben?s=ayar')); await p.waitForTimeout(300);
  if (!(await p.locator('text=Odak süresi').count())) sorunlar.push('Ayarlar: "Odak süresi" yok');

  // ---- Spor kartı: video + ayrıntılar ----
  await p.goto(U(8, '#/seviye/spor')); await p.waitForTimeout(500);
  const gec = async () => { for (let i = 0; i < 8; i++) { if (await p.locator('.hareket-kart').count()) return true; const d = p.locator('.oyuncu .alt a, .oyuncu .alt button').last(); if (!(await d.count())) return false; await d.click().catch(() => {}); await p.waitForTimeout(250); } return !!(await p.locator('.hareket-kart').count()); };
  if (!(await gec())) sorunlar.push('spor kartına ulaşılamadı');
  else {
    const v = await p.evaluate(() => [...document.querySelectorAll('.hareket-kart')].map((k) => ({ video: k.querySelector('video source')?.getAttribute('src') || null, poster: k.querySelector('video')?.getAttribute('poster') || null, ayrinti: !!k.querySelector('details.ac'), hata: /Sık yapılan hatalar/.test(k.textContent) })));
    const videolu = v.filter((x) => x.video);
    if (videolu.length < 4) sorunlar.push(`spor kartlarında video sayısı az: ${videolu.length}/${v.length}`);
    for (const x of videolu) {
      const r = await p.request.get(`${ADRES}/${x.video}`, { headers: { Range: 'bytes=0-99' } });
      if (r.status() !== 206 || !/video\/mp4/.test(r.headers()['content-type'] || '')) sorunlar.push(`video isteği 206/video-mp4 vermedi: ${x.video} → ${r.status()}`);
      const pr = await p.request.get(`${ADRES}/${x.poster}`);
      if (pr.status() !== 200) sorunlar.push(`poster açılmadı: ${x.poster}`);
    }
    if (!v.some((x) => x.hata)) sorunlar.push('spor kartında "Sık yapılan hatalar" ayrıntısı yok');
    await p.screenshot({ path: `${CIKTI}/spor-kart.png`, fullPage: true });
  }

  await b.close();
  const hepsi = [...sorunlar, ...sonuc.map((s) => 'görünüm: ' + s), ...hatalar.map((h) => 'konsol: ' + h)];
  if (hepsi.length) { console.log('\nSORUNLAR:\n- ' + hepsi.join('\n- ')); process.exit(1); }
  console.log('\n✓ Bugün/süre/mola/spor-video temiz');
})().catch((e) => { console.error(e); process.exit(2); });
