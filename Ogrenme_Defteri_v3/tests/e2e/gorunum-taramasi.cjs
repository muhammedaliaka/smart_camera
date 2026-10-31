// Ana sayfaları üç görünümde (telefon, tablet, dizüstü) açar; yatay taşma ve küçük dokunma hedefi arar, ekran görüntüsü alır.
//   NODE_PATH=$(npm root -g) node tests/e2e/gorunum-taramasi.cjs
// Ortam değişkenleri: ADRES (varsayılan http://localhost:8812), CIKTI (varsayılan ./e2e-cikti)
const { chromium } = require('playwright');
const { kontrolEt } = require('./gezgin.cjs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const GORUNUMLER = [['telefon', 390, 844, true], ['tablet', 820, 1180, true], ['dizustu', 1280, 800, false]];
const SAYFALAR = ['bugun', 'dersler', 'tekrar', 'oyunlar', 'ben?s=ilerleme', 'ben?s=gecmis', 'ben?s=ayar', 'ben?s=icerik'];
const U = (hash) => `${ADRES}/?sw0=1&t=2026-11-03#/${hash}`;
require('fs').mkdirSync(CIKTI, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const sonuc = [], hatalar = [];
  for (const [ad, w, h, dokunmatik] of GORUNUMLER) {
    for (const koyu of [false, true]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: dokunmatik, hasTouch: dokunmatik, colorScheme: koyu ? 'dark' : 'light' });
      const p = await ctx.newPage();
      p.on('pageerror', (e) => hatalar.push(`${ad}: pageerror ${e.message}`));
      await p.goto(U('bugun'), { waitUntil: 'networkidle' });
      if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
      for (const s of SAYFALAR) {
        await p.goto(U(s)); await p.waitForTimeout(250);
        await kontrolEt(p, `${ad}${koyu ? '-koyu' : ''}:${s}`, sonuc);
        await p.screenshot({ path: `${CIKTI}/${ad}${koyu ? '-koyu' : ''}-${s.replace(/\W+/g, '-')}.png`, fullPage: true });
      }
      await ctx.close();
    }
  }
  console.log('--- sorunlar'); console.log(sonuc.join('\n') || 'yok');
  console.log('--- sayfa hataları'); console.log(hatalar.join('\n') || 'yok');
  await b.close();
  process.exit(sonuc.length || hatalar.length ? 1 : 0);
})();
