// Gerçek derslerden sonra çalışma raporunu üretir ve kayıtlarla karşılaştırır:
//   - her soru kaydı raporda soru metni + öğrenci yanıtı + doğru yanıtla yer alıyor mu,
//   - raporda undefined/null/NaN yok mu, tanımsız kayıt türü yok mu,
//   - yürünen her dersin adı raporda geçiyor mu,
//   - bir olay ne kadar yer tutuyor (kayıt alanı için).
//   NODE_PATH=$(npm root -g) node tests/e2e/rapor-kontrol.cjs
// Ortam: ADRES (varsayılan http://localhost:8812), DERSLER (virgülle; "hepsi" = tüm dersler), CIKTI (rapor ve ekran görüntüsü klasörü)
const { chromium } = require('playwright');
const { gez } = require('./gezgin.cjs');
const fs = require('fs');
const ADRES = (process.env.ADRES || 'http://localhost:8812').replace(/\/$/, '');
const CIKTI = process.env.CIKTI || './e2e-cikti';
const U = (hash) => `${ADRES}/?sw0=1&t=2026-11-02${hash || ''}`;
fs.mkdirSync(CIKTI, { recursive: true });

// Her sayfa türünü ve kayıt türünü kapsayan varsayılan ders seti
const VARSAYILAN = ['en-01-tanisma', 'en-02-sayilar', 'en-05-sinif-dili', 'haf-02-liste', 'haf-04-ingilizce-saray', 'oku-01-uzay-suyu', 'dinle-01-duyuru', 'dinle-03-gunum',
  'spor-g01', 'kontrol-01-ingilizce', 'kontrol-02-hafiza', 'dis-01-voscreen'];

(async () => {
  let ids = (process.env.DERSLER || VARSAYILAN.join(',')).split(',').filter(Boolean);
  if (ids[0] === 'hepsi') {
    ids = [];
    const idx = await (await fetch(`${ADRES}/icerik/index.json`)).json();
    for (const f of idx.paketler) { const d = await (await fetch(`${ADRES}/icerik/${f}`)).json(); for (const l of d.dersler || []) ids.push(l.id); }
  }
  const b = await chromium.launch({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, permissions: ['microphone'] });
  const p = await ctx.newPage();
  const sorunlar = [], hatalar = [], sonuc = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/404|Failed to load resource/.test(m.text())) hatalar.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));
  await p.goto(U(), { waitUntil: 'networkidle' });
  if (await p.locator('input').count()) { await p.fill('input', 'Test'); await p.click('text=Başlayalım'); await p.waitForTimeout(300); }
  for (const id of ids) {
    await p.goto(U(`#/oyna/${id}`)); await p.waitForTimeout(250);
    const r = await gez(p, { ad: id, klasor: CIKTI, sonuc, dogru: 0.7, ekran: false, azami: 300 });
    if (!r.bitti) sorunlar.push(`ders sonuna gelinemedi: ${id}`);
    await p.goto(U('#/bugun')); await p.waitForTimeout(120);
  }
  // Günlük tekrar ve bir oyun da kayıt bıraksın
  await p.goto(U('#/oyun/hizli')); await p.waitForTimeout(250);
  await gez(p, { ad: 'oyun-hizli', klasor: CIKTI, sonuc, dogru: 0.6, ekran: false, azami: 60 });
  await p.goto(U('#/bugun')); await p.waitForTimeout(500);

  const veri = await p.evaluate(async () => {
    const ben = await import('/js/gorunum/ben.js');
    const d = JSON.parse(localStorage.getItem('od3.durum'));
    return { tam: ben.raporMetni({ aralik: '0', ayrinti: 'tam' }), kisa: ben.raporMetni({ aralik: '0', ayrinti: 'kisa' }), olaylar: d.olaylar, bag: d.bag, ham: localStorage.getItem('od3.durum').length };
  });
  fs.writeFileSync(`${CIKTI}/rapor-tam.md`, veri.tam); fs.writeFileSync(`${CIKTI}/rapor-kisa.md`, veri.kisa);

  const { tam, kisa, olaylar, bag } = veri;
  const B = (o) => bag[o.b] || {};
  const sorular = olaylar.filter((o) => o.tur === 'soru');
  const gosterilen = sorular.filter((o) => B(o).tur !== 'liste-hatirla');
  const satirlar = tam.split('\n').filter((s) => /^- [✔✘] (\(tekrar\) )?\[/.test(s) && !/\[Gecikmeli/.test(s));
  if (satirlar.length !== gosterilen.length) sorunlar.push(`soru satırı sayısı ${satirlar.length}, kayıt sayısı ${gosterilen.length}`);
  const bagsiz = sorular.filter((o) => !o.b || !bag[o.b] || !(B(o).soru || B(o).dogruCevap));
  if (bagsiz.length) sorunlar.push(`${bagsiz.length} soru kaydında bağlam yok, örnek: ${JSON.stringify(bagsiz[0])}`);
  for (const s of satirlar) {
    if (!/Öğrenci: “/.test(s)) sorunlar.push('satırda öğrenci yanıtı yok: ' + s.slice(0, 120));
    if (!/(Doğru|Çiftler): /.test(s)) sorunlar.push('satırda doğru yanıt yok: ' + s.slice(0, 120));
    if (!/Soru: “|Çiftler: /.test(s)) sorunlar.push('satırda soru metni yok: ' + s.slice(0, 120));
  }
  for (const [ad, m] of [['tam', tam], ['kisa', kisa]]) {
    const kotu = m.match(/undefined|\bnull\b|NaN|\[object|Tanımsız kayıt türü|Soru metni bu kayıtta yok/g);
    if (kotu) sorunlar.push(`${ad} raporda kötü ifade: ${[...new Set(kotu)].join(', ')}`);
  }
  const dersAdlari = [...new Set(olaylar.filter((o) => o.tur === 'ders-bitir').map((o) => B(o).dersAd).filter(Boolean))];
  for (const ad of dersAdlari) if (!tam.includes(`“${ad}”`)) sorunlar.push(`ders adı raporda yok: ${ad}`);
  // Her kayıt türünün raporda izi olsun
  const IZ = { serbest: /Açık uçlu yanıt/, liste: /Liste hatırlama/, spor: /Spor kaydı/, dis: /Dış uygulama\]/, olcek: /\[Ölçek/, okuma: /\[Okuma/, dinleme: /\[Dinleme/, saray: /Hafıza sarayı kuruldu/, 'saray-hayal': /hayal kurma/, oyun: /\[Oyun ·/, 'ders-bitir': /Durum: o gün tamamlandı/ };
  const turler = new Set(olaylar.map((o) => o.tur));
  for (const [t, re] of Object.entries(IZ)) if (turler.has(t) && !re.test(tam)) sorunlar.push(`"${t}" kayıtları raporda görünmüyor`);

  const ortalama = Math.round(JSON.stringify(olaylar).length / olaylar.length);
  console.log(`dersler: ${ids.length} · olay: ${olaylar.length} (soru ${sorular.length}) · katalog: ${Object.keys(bag).length} bağlam · olay başına ~${ortalama} karakter · kayıt alanı ${veri.ham} karakter`);
  console.log(`rapor: tam ${tam.length} karakter, kısa ${kisa.length} karakter · kayıt türleri: ${[...turler].join(', ')}`);

  // Arayüz: rapor kartı telefon ve tablette taşmadan açılıyor mu
  for (const [w, h, ad] of [[390, 844, 'telefon'], [820, 1180, 'tablet']]) {
    await p.setViewportSize({ width: w, height: h });
    await p.goto(U('#/ben?s=ilerleme')); await p.waitForTimeout(400);
    const kart = p.locator('text=Çalışma raporu').first();
    await kart.scrollIntoViewIfNeeded();
    await p.click('text=Raporu önizle'); await p.waitForTimeout(250);
    const tasma = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (tasma) sorunlar.push(`${ad}: rapor kartı yatay taşma yapıyor`);
    const onizleme = await p.locator('details.ac pre').first().textContent();
    if (!onizleme || !onizleme.includes('Nasıl okunur')) sorunlar.push(`${ad}: önizleme boş`);
    await p.screenshot({ path: `${CIKTI}/rapor-karti-${ad}.png` });
  }

  console.log('--- sorunlar'); console.log([...sonuc, ...sorunlar].join('\n') || 'yok');
  console.log('--- konsol'); console.log(hatalar.join('\n') || 'yok');
  await b.close();
  process.exit(!sonuc.length && !sorunlar.length && !hatalar.length ? 0 : 1);
})();
