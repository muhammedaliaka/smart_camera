// Her dersi tarayıcıda (telefon boyutunda) sonuna kadar gezer: takılma, konsol hatası, taşma, küçük hedef arar.
//   NODE_PATH=$(npm root -g) node tests/e2e/dersleri-gez.cjs
// Ortam değişkenleri: ADRES (varsayılan http://localhost:8812), DERSLER (virgülle ders kimlikleri; boşsa hepsi),
//   W/H (görünüm, varsayılan 390x844), EKRAN=1 (ekran görüntüleri), CIKTI (görüntü klasörü, varsayılan ./e2e-cikti)
// Önce başka bir terminalde sunucuyu aç:  node scripts/sunucu.mjs --port 8812
const { chromium } = require('playwright');
const { gez } = require('./gezgin.cjs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const U = (hash) => `${ADRES}/?sw0=1&t=2026-11-02${hash || ''}`;
require('fs').mkdirSync(CIKTI, { recursive: true });

(async () => {
  let ids = (process.env.DERSLER || '').split(',').filter(Boolean);
  if (!ids.length) {
    const idx = await (await fetch(`${ADRES}/icerik/index.json`)).json();
    for (const f of idx.paketler) { const d = await (await fetch(`${ADRES}/icerik/${f}`)).json(); for (const l of d.dersler || []) ids.push(l.id); }
  }
  const b = await chromium.launch({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: +(process.env.W || 390), height: +(process.env.H || 844) }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, permissions: ['microphone'] });
  const p = await ctx.newPage();
  const hatalar = [], sonuc = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));
  await p.goto(U(), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
  let tamam = 0;
  for (const id of ids) {
    await p.goto(U(`#/oyna/${id}`)); await p.waitForTimeout(250);
    const r = await gez(p, { ad: id, klasor: CIKTI, sonuc, dogru: 0.8, ekran: !!process.env.EKRAN, azami: 300 });
    if (r.bitti) tamam++;
    console.log(r.bitti ? 'ok ' : 'XX ', id, r.adim ?? '');
    await p.goto(U('#/bugun')); await p.waitForTimeout(120);
  }
  console.log(`--- ${tamam}/${ids.length} ders sonuna kadar gezildi`);
  console.log('--- sorunlar'); console.log(sonuc.join('\n') || 'yok');
  console.log('--- konsol'); console.log(hatalar.join('\n') || 'yok');
  await b.close();
  process.exit(tamam === ids.length && !sonuc.length && !hatalar.length ? 0 : 1);
})();
