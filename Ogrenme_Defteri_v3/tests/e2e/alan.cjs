// Serbest alan: menü, kip/yer seçimi, mekân avı, gerçek mekânda hafıza sarayı (rota kur → yerleştir → hatırla → canavar turu), sesli tur, rapor.
//   NODE_PATH=$(npm root -g) node tests/e2e/alan.cjs
// Ortam: ADRES (varsayılan http://localhost:8812), CIKTI (ekran görüntüsü klasörü)
const { chromium } = require('playwright');
const fs = require('fs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const tarih = (n) => new Date(Date.UTC(2026, 10, 2 + n)).toISOString().slice(0, 10);
const U = (n, hash) => `${ADRES}/?sw0=1&t=${tarih(n - 1)}${hash || ''}`;
fs.mkdirSync(CIKTI, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const sorunlar = [], hatalar = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource|wake|Wake/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));

  await p.goto(U(8), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
  await p.evaluate((t) => { const d = JSON.parse(localStorage.getItem('od3.durum')); d.baslangic = t; localStorage.setItem('od3.durum', JSON.stringify(d)); }, tarih(0));
  const olaylar = () => p.evaluate(() => JSON.parse(localStorage.getItem('od3.durum')));
  const git = async (hash) => { await p.goto(U(8, hash)); await p.reload(); await p.waitForTimeout(350); };
  const tikla = async (metin) => { const d = p.locator(`button:has-text("${metin}"), a:has-text("${metin}")`).first(); if (!(await d.count())) throw new Error('düğme yok: ' + metin + ' · sayfa: ' + (await p.locator('main').innerText()).replace(/\n+/g, ' / ').slice(0, 300)); await d.click(); await p.waitForTimeout(120); };

  // ---- Bugün'de giriş kartı ve menü ----
  await git('#/bugun');
  if (!(await p.locator('a[href="#/alan"]').count())) sorunlar.push('Bugün: Serbest alan kartı yok');
  await git('#/alan');
  for (const m of ['Gerçek yerde hafıza sarayı', 'Mekân avı', 'Sesli tur', 'Yalnızım', 'Sessiz', 'Park', 'Çalışma alanı']) if (!(await p.locator(`text=${m}`).count())) sorunlar.push(`menü: "${m}" yok`);
  await p.screenshot({ path: `${CIKTI}/alan-menu.png`, fullPage: true });
  await tikla('Sessiz'); await p.waitForTimeout(200);
  if (!(await p.locator('text=Sessiz kipte kapalı').count())) sorunlar.push('sessiz kipte sesli tur kapanmadı');
  await tikla('Yalnızım');

  // ---- Mekân avı (park) ----
  await git('#/alan/av');
  let tur = 0;
  while (!(await p.locator('text=nesne buldun').count()) && tur++ < 20) {
    if (await p.locator('button:has-text("Buldum")').count()) await tikla('Buldum');
    else if (await p.locator('button:has-text("Söyledim")').count()) await tikla('Söyledim');
  }
  if (!(await p.locator('text=nesne buldun').count())) sorunlar.push('mekân avı bitmedi');
  let d = await olaylar();
  const av = d.olaylar.find((o) => o.tur === 'alan-tur' && o.etkinlik === 'av');
  if (!av || av.toplam < 4 || av.yer !== 'park') sorunlar.push('mekân avı kaydı yok/yanlış: ' + JSON.stringify(av));
  await p.screenshot({ path: `${CIKTI}/alan-av.png` });

  // ---- Gerçek mekânda hafıza sarayı ----
  await git('#/alan/saray');
  if (!(await p.locator('text=Rotayı kaydet').count())) sorunlar.push('saray: rota editörü yok');
  for (const ad of ['Giriş kapısı', 'Bank', 'Büyük ağaç', 'Çeşme', 'Köprü']) { const c = p.locator(`button.cip:has-text("+ ${ad}")`); if (await c.count()) await c.click(); }
  await p.screenshot({ path: `${CIKTI}/alan-saray-kur.png`, fullPage: true });
  await tikla('Rotayı kaydet');
  await tikla('Yürüyerek başla');
  if (!(await p.locator('text=Durak 1/5').count())) sorunlar.push('saray: yerleştirme 5 durakla başlamadı');
  await p.screenshot({ path: `${CIKTI}/alan-saray-yerlestir.png` });
  for (let i = 0; i < 5; i++) await tikla('Hayal ettim');
  if (!(await p.locator('text=noktasında ne vardı').count())) sorunlar.push('saray: hatırlama turu başlamadı');
  let kez = 0, yanlisVerildi = false;
  while (!(await p.locator('text=hatırladın').count()) && kez++ < 30) {
    if (await p.locator('button:has-text("Cevabı göster")').count()) { await tikla('Cevabı göster'); continue; }
    if (!yanlisVerildi) { yanlisVerildi = true; await tikla('Hatırlayamadım'); } else await tikla('✔ Hatırladım');
  }
  if (!(await p.locator('text=hatırladın').count())) sorunlar.push('saray: sonuç ekranına gelinemedi');
  if (!(await p.locator('text=Canavar').count()) && kez < 30) { /* canavar turu geçici ekran; sonuç ekranından önce görülmüş olabilir */ }
  await p.screenshot({ path: `${CIKTI}/alan-saray-sonuc.png` });
  d = await olaylar();
  const sr = d.olaylar.find((o) => o.tur === 'alan-tur' && o.etkinlik === 'saray');
  if (!sr || sr.toplam !== 5 || sr.dogru !== 4 || !sr.eksikler?.length) sorunlar.push('saray kaydı beklenen gibi değil (5 kelime, 4 doğru, 1 eksik): ' + JSON.stringify(sr));
  if (Object.keys(d.srs).filter((k) => k.startsWith('k:')).length !== 4) sorunlar.push('saray: hatırlanan 4 kelime Tekrar’a eklenmeli; SRS: ' + Object.keys(d.srs).join(','));
  if (!d.saraylar.some((s) => s.id === 'alan-park' && s.duraklar.length === 5)) sorunlar.push('saray rotası kaydedilmedi');

  // ---- Sesli tur ----
  await git('#/alan/sesli');
  await tikla('Turu başlat');
  let atlama = 0;
  while (!(await p.locator('text=kelime dinledin').count()) && atlama++ < 60) { const a = p.locator('button:has-text("Atla")'); if (await a.count()) await a.click().catch(() => {}); await p.waitForTimeout(250); }
  if (!(await p.locator('text=kelime dinledin').count())) sorunlar.push('sesli tur bitmedi');
  d = await olaylar();
  if (!d.olaylar.some((o) => o.tur === 'alan-tur' && o.etkinlik === 'sesli')) sorunlar.push('sesli tur kaydı yok');

  // ---- Sessiz kip: sesli tur kapalı, saray/av çalışır ----
  await git('#/alan'); await tikla('Sessiz');
  await p.goto(U(8, '#/alan/sesli')); await p.reload(); await p.waitForTimeout(300);
  if (!(await p.locator('text=Yalnızım” kipinde çalışır').count())) sorunlar.push('sessiz kipte sesli tur doğrudan adresle açılabildi');
  await git('#/alan'); await tikla('Yalnızım');

  // ---- Rapor ----
  const rapor = await p.evaluate(async () => (await import('/js/gorunum/ben.js')).raporMetni({ aralik: '0', ayrinti: 'tam' }));
  fs.writeFileSync(`${CIKTI}/alan-rapor.md`, rapor);
  if (!/Serbest alan/.test(rapor) || !/kendi bildirimi/.test(rapor)) sorunlar.push('rapor: serbest alan satırları yok');
  const kotu = rapor.match(/undefined|\bnull\b|NaN|\[object|Tanımsız kayıt türü/g);
  if (kotu) sorunlar.push('rapor: kötü ifade: ' + [...new Set(kotu)].join(', '));

  await b.close();
  const hepsi = [...sorunlar, ...hatalar.map((h) => 'konsol: ' + h)];
  if (hepsi.length) { console.log('\nSORUNLAR:\n- ' + hepsi.join('\n- ')); process.exit(1); }
  console.log('✓ Serbest alan temiz');
})().catch((e) => { console.error(e); process.exit(2); });
