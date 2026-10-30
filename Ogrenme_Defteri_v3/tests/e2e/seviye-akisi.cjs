// Seviye akışı: yoklama haftası → seviye oturumları → Ben / rapor, gerçek tarayıcıda (telefon boyutu).
//   - Gün 1: Bugün sayfası beş görevi (4 yoklama + spor oturumu) ve "İlk hafta" açıklamasını gösteriyor mu,
//   - her gün, o günün yoklamaları sonuna kadar oynanıyor mu (rastgele yanıtla; hata/çökme/ekran taşması aranır),
//   - yoklama haftası bitince (gün 8) yoklama görevi kalıyor mu, kalmamalı; seviye oturumları çıkıyor mu,
//   - Ben → İlerleme "Seviyelerin" kartı ve rapordaki "Seviyeler" bölümü var mı, raporda undefined/NaN yok mu.
// Not: yanıtlar rastgele olduğu için seviye sayıları sabit değildir; burada doğrulanan şey bağlantıların çalışmasıdır
// (seviyenin doğru hesaplanması tests/unit/seviye*.test.mjs içinde sabit senaryolarla denetlenir).
//   NODE_PATH=$(npm root -g) node tests/e2e/seviye-akisi.cjs
// Ortam: ADRES (varsayılan http://localhost:8812), CIKTI (ekran görüntüsü klasörü), GUN_SAYISI (varsayılan 8)
const { chromium } = require('playwright');
const { gez } = require('./gezgin.cjs');
const fs = require('fs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const GUN_SAYISI = +(process.env.GUN_SAYISI || 8);
const tarih = (n) => { const d = new Date(Date.UTC(2026, 10, 2 + n)); return d.toISOString().slice(0, 10); }; // gün 1 = 2026-11-02
const U = (n, hash) => `${ADRES}/?sw0=1&t=${tarih(n - 1)}${hash || ''}`;
fs.mkdirSync(CIKTI, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const sorunlar = [], hatalar = [], sonuc = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));

  await p.goto(U(1), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }

  const gorevler = async () => p.evaluate(() => [...document.querySelectorAll('a.gorev')].map((a) => ({ ad: a.querySelector('.baslik')?.textContent.trim(), href: a.getAttribute('href'), bitti: a.classList.contains('bitti') })));
  const yoklamaIzleri = ['ingilizce', 'okuma', 'dinleme', 'hafiza'];

  // ---- Gün 1: plan ----
  await p.goto(U(1, '#/bugun')); await p.waitForTimeout(400);
  const g1 = await gorevler();
  for (const iz of yoklamaIzleri) if (!g1.some((g) => g.href === `#/yoklama/${iz}`)) sorunlar.push(`gün 1: #/yoklama/${iz} görevi yok`);
  if (!g1.some((g) => g.href === '#/seviye/spor')) sorunlar.push('gün 1: spor seviye oturumu görevi yok');
  if (g1.some((g) => /^#\/seviye\/(ingilizce|okuma|dinleme|hafiza)/.test(g.href))) sorunlar.push('gün 1: yoklaması süren becerinin seviye oturumu görünmemeli');
  if (!(await p.locator('text=İlk hafta').count())) sorunlar.push('gün 1: "İlk hafta" açıklaması yok');
  await p.screenshot({ path: `${CIKTI}/seviye-gun1-bugun.png` });

  // ---- Günler: o günün yoklamaları ve oturumları ----
  const gunKaydi = [];
  for (let n = 1; n <= GUN_SAYISI; n++) {
    await p.goto(U(n, '#/bugun')); await p.waitForTimeout(250);
    const liste = (await gorevler()).filter((g) => /^#\/(yoklama|seviye)\//.test(g.href) && !g.bitti);
    gunKaydi.push(`gün ${n}: ${liste.map((g) => g.href.slice(2)).join(', ') || '(yok)'}`);
    for (const g of liste) {
      await p.goto(U(n, g.href)); await p.waitForTimeout(350);
      if (!(await p.locator('.oyuncu').count())) { // içerik yok / yoklama kapandı: Bugün'e döndü
        continue;
      }
      const r = await gez(p, { ad: `g${n}-${g.href.slice(2).replace('/', '-')}`, klasor: CIKTI, sonuc, dogru: 0.8, ekran: false, azami: 200 });
      if (!r.bitti) sorunlar.push(`gün ${n}: ${g.href} sonuna gelinemedi`);
      else if (!(await p.locator('.oyuncu .sonuc').innerText()).trim()) sorunlar.push(`gün ${n}: ${g.href} sonuç ekranı boş`);
      await p.goto(U(n, '#/bugun')); await p.waitForTimeout(150);
    }
  }

  // ---- Yoklama haftası sonrası ----
  if (GUN_SAYISI >= 8) {
    await p.goto(U(8, '#/bugun')); await p.waitForTimeout(400);
    const g8 = await gorevler();
    const kalan = g8.filter((g) => g.href.startsWith('#/yoklama/') && !g.bitti);
    if (kalan.length) sorunlar.push(`gün 8: hâlâ yoklama görevi var: ${kalan.map((g) => g.href).join(', ')}`);
    if (!g8.some((g) => /^#\/seviye\//.test(g.href))) sorunlar.push('gün 8: seviye oturumu görevi yok');
    await p.screenshot({ path: `${CIKTI}/seviye-gun8-bugun.png` });
  }

  // ---- Ben ve rapor ----
  await p.goto(U(GUN_SAYISI, '#/ben')); await p.waitForTimeout(400);
  if (!(await p.locator('h3:has-text("Seviyelerin")').count())) sorunlar.push('Ben → İlerleme: "Seviyelerin" kartı yok');
  await p.screenshot({ path: `${CIKTI}/seviye-ben.png`, fullPage: true });
  const veri = await p.evaluate(async () => {
    const ben = await import('/js/gorunum/ben.js');
    const d = JSON.parse(localStorage.getItem('od3.durum'));
    return { tam: ben.raporMetni({ aralik: '0', ayrinti: 'tam' }), kisa: ben.raporMetni({ aralik: '0', ayrinti: 'kisa' }), turler: [...new Set(d.olaylar.map((o) => o.tur))] };
  });
  fs.writeFileSync(`${CIKTI}/seviye-rapor.md`, veri.tam);
  if (!/## Seviyeler/.test(veri.tam)) sorunlar.push('rapor: "Seviyeler" bölümü yok');
  if (!/\[Yoklama sonucu/.test(veri.tam)) sorunlar.push('rapor: yoklama sonucu satırı yok');
  const kotu = (veri.tam + veri.kisa).match(/undefined|\bnull\b|NaN|\[object|Tanımsız kayıt türü/g);
  if (kotu) sorunlar.push(`rapor: kötü ifade: ${[...new Set(kotu)].join(', ')}`);
  for (const t of ['yerlestirme']) if (!veri.turler.includes(t)) sorunlar.push(`olay türü hiç yazılmadı: ${t}`);

  console.log(gunKaydi.join('\n'));
  console.log('Olay türleri:', veri.turler.join(', '));
  await b.close();
  const hepsi = [...sorunlar, ...sonuc.map((s) => 'görünüm: ' + s), ...hatalar.map((h) => 'konsol: ' + h)];
  if (hepsi.length) { console.log('\nSORUNLAR:\n- ' + hepsi.join('\n- ')); process.exit(1); }
  console.log('\n✓ Seviye akışı temiz');
})().catch((e) => { console.error(e); process.exit(2); });
