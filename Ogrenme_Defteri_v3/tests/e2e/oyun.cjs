// Oyunlaştırma: gerçek bir ders (kombo 🔥, ders sonu XP kartı), Bugün'de rütbe şeridi + hafta noktaları + "Yeni rozet" kartı,
// Ben → İlerleme rozet ızgarası, Ayarlar → haftalık hedef.
//   NODE_PATH=$(npm root -g) node tests/e2e/oyun.cjs
// Ortam: ADRES (varsayılan http://localhost:8812), CIKTI (ekran görüntüsü klasörü)
const { chromium } = require('playwright');
const { gez } = require('./gezgin.cjs');
const fs = require('fs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const tarih = (n) => new Date(Date.UTC(2026, 10, 2 + n)).toISOString().slice(0, 10); // 2026-11-02 Pazartesi
const U = (gun, hash) => `${ADRES}/?sw0=1&t=${tarih(gun)}${hash || ''}`;
fs.mkdirSync(CIKTI, { recursive: true });

(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const sorunlar = [], hatalar = [], sonuc = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));
  const durum = () => p.evaluate(() => JSON.parse(localStorage.getItem('od3.durum')));
  const durumYaz = (f) => p.evaluate((fn) => { const d = JSON.parse(localStorage.getItem('od3.durum')); new Function('d', fn)(d); localStorage.setItem('od3.durum', JSON.stringify(d)); }, f.toString().replace(/^[^{]*\{|\}$/g, ''));
  const git = async (gun, hash) => { await p.goto(U(gun, hash)); await p.reload(); await p.waitForTimeout(350); };

  // ---- Yeni kullanıcı: Bugün'de oyun şeridi yok (henüz hiçbir şey yapılmadı) ----
  await p.goto(U(0), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
  await durumYaz(() => { d.baslangic = '2026-11-02'; });
  await git(0, '#/bugun');
  if (await p.locator('.oyun-seridi').count()) sorunlar.push('olay yokken oyun şeridi görünüyor');

  // ---- Gerçek ders: kombo + ders sonu XP kartı ----
  await p.goto(U(0, '#/oyna/en-02-sayilar')); await p.waitForTimeout(300);
  // “Küçük kontrol” üç sorusu art arda gelir; üçünü de ilk denemede doğru bil → kombo 🔥 görünmeli
  let komboGoruldu = '';
  const izle = setInterval(async () => { try { const k = p.locator('.kombo:not([hidden])'); if (await k.count()) komboGoruldu = (await k.first().innerText()) || komboGoruldu; } catch { /* sayfa değişiyor */ } }, 40);
  const r = await gez(p, { ad: 'en-02-sayilar', klasor: CIKTI, sonuc, dogru: 0.8, ekran: false, azami: 300, bilinenCevaplar: [['“thirteen” hangisi?', '13'], ['“fifty” hangisi?', '50'], ['“twenty-one” hangisi?', '21']] });
  clearInterval(izle);
  if (!/🔥\s*[3-9]/.test(komboGoruldu)) sorunlar.push('üç doğru art arda → kombo görünmedi: "' + komboGoruldu + '"');
  if (!r.bitti) sorunlar.push('ders sonuna kadar gezilemedi');
  const kart = p.locator('.sonuc-oyun');
  if (!(await kart.count())) sorunlar.push('ders sonu XP kartı yok');
  else {
    const metin = await kart.innerText();
    if (!/\+\d+ XP/.test(metin)) sorunlar.push('XP kazancı yazmıyor: ' + metin.replace(/\n+/g, ' / '));
    if (!/Bu hafta/.test(metin) || !/1\/4 gün/.test(metin)) sorunlar.push('hafta özeti yanlış: ' + metin.replace(/\n+/g, ' / '));
    if (!/Yeni rozet: İlk adım/.test(metin)) sorunlar.push('ilk rozet ders sonunda görünmedi: ' + metin.replace(/\n+/g, ' / '));
    await p.screenshot({ path: `${CIKTI}/oyun-sonuc.png` });
  }
  let d = await durum();
  if (!d.oyunlastirma?.rozet?.['ilk-adim']?.gorulen) sorunlar.push('ders sonunda gösterilen rozet "görüldü" işaretlenmedi');
  await git(0, '#/bugun');
  if (await p.locator('.yeni-rozet').count()) sorunlar.push('ders sonunda görülen rozet Bugün ekranında yeniden çıktı');
  if (!(await p.locator('.oyun-seridi').count())) sorunlar.push('ders sonrası Bugün\'de oyun şeridi yok');

  // ---- Sentetik geçmiş: 4 etkin gün (bir gün ara: esnek seri bozulmaz), 18 gün sonra bakılır ----
  await durumYaz(() => {
    d.olaylar = []; d.oyunlastirma = { rozet: {} };
    const ek = (g, tur, v) => d.olaylar.push({ i: 'x' + d.olaylar.length, t: g + 'T10:00:' + String(d.olaylar.length % 60).padStart(2, '0') + '.000Z', g, tur, ...v });
    ek('2026-11-02', 'ders-bitir', { ders: 'en-01-tanisma', dogru: 9, toplam: 9, yuzde: 100 });
    ek('2026-11-03', 'ders-bitir', { ders: 'en-02-sayilar', dogru: 9, toplam: 9, yuzde: 100 });
    ek('2026-11-05', 'ders-bitir', { ders: 'en-03-esyalar', dogru: 9, toplam: 9, yuzde: 100 });
    ek('2026-11-06', 'ders-bitir', { ders: 'en-04-gunler', dogru: 9, toplam: 9, yuzde: 100 });
  });
  await git(4, '#/bugun'); // 2026-11-06 Cuma
  const seridi = p.locator('.oyun-seridi');
  if (!(await seridi.count())) sorunlar.push('Bugün: oyun şeridi yok');
  else {
    const m = await seridi.innerText();
    if (!/Filiz/.test(m) || !/100 XP/.test(m)) sorunlar.push('rütbe/XP yanlış: ' + m.replace(/\n+/g, ' / '));
    if (!/Fidan için 150 XP/.test(m)) sorunlar.push('sıradaki rütbe yazmıyor: ' + m.replace(/\n+/g, ' / '));
    if (!/🔥 4 gün/.test(m)) sorunlar.push('esnek seri 4 olmalı (11-04 boşluğu bozmaz): ' + m.replace(/\n+/g, ' / '));
    if (!/4\/4 gün/.test(m) || !/tamamladın/.test(m)) sorunlar.push('hafta hedefi 4/4 olmalı: ' + m.replace(/\n+/g, ' / '));
  }
  const dolu = await p.locator('.hafta-noktalar .nokta.dolu').count(), bugunNokta = await p.locator('.hafta-noktalar .nokta.bugun').count();
  if (dolu !== 3 + 0 && dolu !== 4) sorunlar.push('dolu nokta sayısı beklenmedik: ' + dolu);
  if (dolu !== 4) sorunlar.push('4 etkin gün için 4 dolu nokta bekleniyordu: ' + dolu);
  if (bugunNokta !== 1) sorunlar.push('bugün noktası tek olmalı: ' + bugunNokta);
  const yeni = p.locator('.yeni-rozet');
  if (!(await yeni.count())) sorunlar.push('Yeni rozet kartı yok');
  else {
    const t = await yeni.innerText();
    for (const ad of ['İlk adım', 'Üç gün', 'Sağlam hafta']) if (!t.includes(ad)) sorunlar.push('yeni rozet kartında yok: ' + ad);
    await p.screenshot({ path: `${CIKTI}/oyun-bugun.png`, fullPage: true });
    await yeni.locator('button:has-text("Tamam")').click(); await p.waitForTimeout(200);
    if (await p.locator('.yeni-rozet').count()) sorunlar.push('Tamam kartı kapatmadı');
    await git(4, '#/bugun');
    if (await p.locator('.yeni-rozet').count()) sorunlar.push('görülen rozet yeniden çıktı');
  }

  // ---- Ben → İlerleme: rozet ızgarası ----
  await git(4, '#/ben?s=ilerleme');
  const kaz = await p.locator('.rozet-kutu.kazanildi').count(), kilit = await p.locator('.rozet-kutu.kilitli').count();
  if (kaz < 3 || kilit < 5) sorunlar.push(`rozet ızgarası: kazanılan ${kaz}, kilitli ${kilit}`);
  if (!(await p.locator('text=öğrenmenin ölçüsü değildir').count())) sorunlar.push('XP dürüstlük notu yok');
  await p.screenshot({ path: `${CIKTI}/oyun-rozetler.png`, fullPage: true });

  // ---- Ayarlar: haftalık hedef ----
  await git(4, '#/ben?s=ayar');
  await p.locator('[aria-label="Haftalık hedef (çalışılan gün)"] button:has-text("6")').click(); await p.waitForTimeout(150);
  d = await durum();
  if (d.ayar.haftaHedef !== 6) sorunlar.push('haftalık hedef kaydedilmedi: ' + d.ayar.haftaHedef);
  await git(4, '#/bugun');
  if (!(await p.locator('.hafta-kutu:has-text("4/6 gün")').count())) sorunlar.push('Bugün: hafta hedefi 6 görünmüyor');
  if (!(await p.locator('.hafta-kutu:has-text("Hedef için kalan her gün gerekli")').count())) sorunlar.push('Bugün: hafta hedefi uyarısı yok');

  // ---- Koyu tema + dar ekranda taşma yok ----
  await p.emulateMedia({ colorScheme: 'dark' }); await git(4, '#/bugun');
  const tasma = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (tasma > 0) sorunlar.push('yatay taşma: ' + tasma + 'px');
  await p.screenshot({ path: `${CIKTI}/oyun-bugun-koyu.png`, fullPage: true });

  console.log('--- sorunlar'); console.log([...sorunlar, ...sonuc].join('\n') || 'yok');
  console.log('--- konsol'); console.log(hatalar.join('\n') || 'yok');
  await b.close();
  process.exit(sorunlar.length || sonuc.length || hatalar.length ? 1 : 0);
})();
