// MCP sunucusu ve eşitleme uç noktası. Gerçek bir yapay zekâ istemcisi kullanılmaz: sunucu alt süreç olarak
// başlatılır, stdio üzerinden JSON-RPC satırları gönderilir (bir MCP istemcisinin yaptığı gibi). Kayıt olarak,
// gerçek uygulamanın tarayıcıda ürettiği tests/fixtures/ornek-durum.json kullanılır (tests/e2e/seviye-akisi.cjs).
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = fileURLToPath(new URL('../..', import.meta.url));
const KAYIT = join(kok, 'tests/fixtures/ornek-durum.json');
const BUGUN = '2026-11-09'; // fixture'ın 8. günü

const acik = new Set(); // bir doğrulama başarısız olsa bile alt süreçler kapanır, test dosyası takılı kalmaz
after(() => { for (const s of acik) s.kill(); });

/** MCP sunucusunu başlatır; her çağrı bir JSON-RPC isteği gönderip yanıtını bekler. */
function istemci(args = []) {
  const s = spawn(process.execPath, [join(kok, 'scripts/mcp.mjs'), ...args], { stdio: ['pipe', 'pipe', 'pipe'] });
  acik.add(s); s.on('close', () => acik.delete(s));
  let tampon = '', hata = '';
  const bekleyen = new Map(), tumu = [];
  s.stdout.setEncoding('utf8'); s.stderr.setEncoding('utf8');
  s.stderr.on('data', (d) => { hata += d; });
  s.stdout.on('data', (d) => {
    tampon += d;
    let i;
    while ((i = tampon.indexOf('\n')) >= 0) {
      const satir = tampon.slice(0, i); tampon = tampon.slice(i + 1);
      const m = JSON.parse(satir); tumu.push(m); // stdout'a protokol dışı bir şey yazılırsa burada JSON hatası verir
      bekleyen.get(m.id)?.(m);
    }
  });
  let n = 0;
  const istek = (method, params) => new Promise((coz, red) => {
    const id = ++n; const t = setTimeout(() => red(new Error(`yanıt gelmedi: ${method}\n${hata}`)), 20000);
    bekleyen.set(id, (m) => { clearTimeout(t); coz(m); });
    s.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
  return {
    istek, tumu, ham: (satir) => s.stdin.write(satir + '\n'),
    arac: async (ad, arguments_ = {}) => { const m = await istek('tools/call', { name: ad, arguments: arguments_ }); return { ...m.result, metin: m.result?.content?.[0]?.text ?? '', veri() { return JSON.parse(this.metin); } }; },
    kapat: () => new Promise((coz) => { s.on('close', coz); s.stdin.end(); }),
    hata: () => hata,
  };
}
const SECENEK = ['--durum', KAYIT, '--bugun', BUGUN];

test('mcp: initialize sürüm anlaşması, bildirim yanıtsız, ping, bilinmeyen yöntem', async () => {
  const c = istemci(SECENEK);
  const a = await c.istek('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
  assert.equal(a.result.protocolVersion, '2025-03-26');
  assert.equal(a.result.serverInfo.name, 'ogrenme-defteri');
  assert.ok(a.result.capabilities.tools && a.result.capabilities.prompts);
  const b = await c.istek('initialize', { protocolVersion: '1999-01-01' });
  assert.equal(b.result.protocolVersion, '2025-06-18', 'bilinmeyen sürümde en yenisi önerilir');
  c.ham(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }));
  assert.deepEqual((await c.istek('ping')).result, {});
  assert.equal((await c.istek('yok/boyle')).error.code, -32601);
  assert.equal((await c.istek('tools/call', { name: 'olmayan' })).error.code, -32602);
  c.ham('bu json degil');
  c.ham(JSON.stringify([{ jsonrpc: '2.0', id: 900, method: 'ping' }, { jsonrpc: '2.0', id: 901, method: 'ping' }])); // toplu istek
  await new Promise((r) => setTimeout(r, 400));
  assert.ok(c.tumu.some((m) => m.error?.code === -32700), 'bozuk JSON için ayrıştırma hatası');
  assert.deepEqual(c.tumu.filter((m) => [900, 901].includes(m.id)).map((m) => m.id).sort(), [900, 901]);
  assert.equal(c.tumu.filter((m) => m.id == null && !m.error).length, 0, 'bildirime yanıt verilmemeli');
  await c.kapat();
});

test('mcp: araç listesi ve şemalar', async () => {
  const c = istemci(SECENEK);
  const { tools } = (await c.istek('tools/list')).result;
  const adlar = tools.map((t) => t.name);
  for (const ad of ['ogrenci_ozeti', 'rapor_al', 'seviyeler', 'bugunun_plani', 'gecmis_ara', 'icerik_ara', 'icerik_kapsami', 'icerik_dogrula', 'icerik_giris_bicimi', 'icerik_ekle']) assert.ok(adlar.includes(ad), ad);
  for (const t of tools) { assert.ok(t.description.length > 20, t.name); assert.equal(t.inputSchema.type, 'object', t.name); assert.match(t.name, /^[a-z_]+$/); }
  assert.deepEqual(tools.find((t) => t.name === 'icerik_ekle').inputSchema.required, ['metin']);
  await c.kapat();
});

test('mcp: ogrenci_ozeti, seviyeler ve bugunun_plani gerçek kayıttan okunur', async () => {
  const c = istemci(SECENEK);
  const o = (await c.arac('ogrenci_ozeti')).veri();
  assert.equal(o.programGunu, 8); assert.equal(o.ad, 'Test'); assert.equal(o.bugun, BUGUN);
  assert.equal(o.seviyeler.length, 5);
  assert.ok(o.seviyeler.every((s) => s.seviye >= 1 || s.durum === 'yoklama sürüyor'));
  assert.ok(o.bugununGorevleri.some((g) => g.tur === 'oturum'), 'yoklama haftası bitmiş: seviye oturumu görevleri var');
  assert.ok(!o.bugununGorevleri.some((g) => g.tur === 'yoklama'));
  assert.equal(o.kayit.olaySayisi, 229);
  const sv = (await c.arac('seviyeler')).veri();
  assert.deepEqual(sv.map((s) => s.kod), ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor']);
  const ing = sv[0];
  assert.ok(ing.yoklama.denemeler.length >= 1, 'yoklama denemeleri görünür');
  assert.equal(ing.yukselmekIcinGerekenSeri, 1); assert.equal(sv[4].yukselmekIcinGerekenSeri, 2);
  const gun1 = (await c.arac('bugunun_plani', { gun: 1 })).veri();
  assert.equal(gun1.gun, 1);
  assert.ok(gun1.gorevler.some((g) => g.ders === 'haf-01-saray'), 'ilk gün yazılı hafıza dersi');
  assert.ok(gun1.gorevler.every((g) => typeof g.yapildi === 'boolean'));
  const bugunPlan = (await c.arac('bugunun_plani')).veri();
  assert.equal(bugunPlan.gun, 8);
  assert.ok(bugunPlan.gorevler.some((g) => g.tur === 'oturum' && g.beceri === 'ingilizce'));
  await c.kapat();
});

test('mcp: rapor_al uygulamadaki raporla aynı içeriği (seviyeler dahil) verir', async () => {
  const c = istemci(SECENEK);
  const tam = await c.arac('rapor_al', { aralik: '0', ayrinti: 'tam' });
  assert.ok(!tam.isError);
  for (const parca of ['# Öğrenme Defteri · Çalışma raporu', '## Nasıl okunur', '## Seviyeler', '| Beceri | Seviye |', '[Yoklama sonucu', '### 2026-11-02 · Gün 1']) assert.ok(tam.metin.includes(parca), parca);
  assert.doesNotMatch(tam.metin, /undefined|\bnull\b|NaN|\[object|Tanımsız kayıt türü/);
  const kisa = await c.arac('rapor_al', { aralik: '1' });
  assert.ok(kisa.metin.length < tam.metin.length);
  assert.ok(kisa.metin.includes('2026-11-09') && !kisa.metin.includes('### 2026-11-02'), 'bugün aralığı yalnız bugünü içerir');
  assert.equal((await c.arac('rapor_al', { aralik: '3' })).isError, true);
  await c.kapat();
});

test('mcp: gecmis_ara yanlışları bağlamıyla verir ve süzer', async () => {
  const c = istemci(SECENEK);
  const hepsi = (await c.arac('gecmis_ara', { sinir: 200 })).veri();
  const yanlis = (await c.arac('gecmis_ara', { yalnizYanlis: true, sinir: 200 })).veri();
  assert.ok(hepsi.toplamEslesen > yanlis.toplamEslesen && yanlis.toplamEslesen > 0);
  assert.ok(yanlis.kayitlar.every((k) => k.dogru === false && k.soru && k.dogruCevap), 'her satır soru ve doğru yanıtı taşır');
  const ing = (await c.arac('gecmis_ara', { beceri: 'ingilizce', sinir: 200 })).veri();
  assert.ok(ing.kayitlar.every((k) => k.beceri === 'ingilizce'));
  assert.equal((await c.arac('gecmis_ara', { tarih: '1999-01-01' })).veri().toplamEslesen, 0);
  const az = (await c.arac('gecmis_ara', { sinir: 3 })).veri();
  assert.equal(az.kayitlar.length, 3);
  await c.kapat();
});

test('mcp: icerik_ara, icerik_kapsami, icerik_dogrula', async () => {
  const c = istemci(SECENEK);
  const k = (await c.arac('icerik_ara', { sorgu: 'apple', tur: 'kelime' })).veri();
  assert.ok(k.kelimeler.some((x) => x.en === 'apple' && Number.isFinite(x.sv)));
  const d = (await c.arac('icerik_ara', { tur: 'ders', beceri: 'okuma', enAz: 40 })).veri();
  assert.ok(d.dersler.length >= 3 && d.dersler.every((x) => x.sv >= 40 && x.beceri === 'okuma'));
  assert.ok(d.dersler.every((x, i, a) => !i || a[i - 1].sv <= x.sv), 'seviyeye göre sıralı');
  const kap = (await c.arac('icerik_kapsami')).veri();
  assert.ok(kap.kelime.toplam >= 500 && kap.kelime.dilimler['1-10'] > 20);
  assert.ok(kap.dersler.okuma.enYuksekSv >= 60 && kap.dersler.dinleme.enYuksekSv >= 60);
  const dg = (await c.arac('icerik_dogrula')).veri();
  assert.deepEqual(dg.hata, []);
  await c.kapat();
});

test('mcp: kayıt yoksa ya da bozuksa araç hatası anlaşılır bir yönerge verir (sunucu çökmez)', async () => {
  const c = istemci(['--durum', join(tmpdir(), 'olmayan-od3-kayit.json')]);
  const r = await c.arac('ogrenci_ozeti');
  assert.equal(r.isError, true);
  assert.match(r.metin, /Yapay zekâ bağlantısı|Yedek indir/);
  assert.ok((await c.arac('icerik_dogrula')).veri().hata.length === 0, 'kayıt gerektirmeyen araçlar çalışır');
  await c.kapat();
  const d = mkdtempSync(join(tmpdir(), 'od3-mcp-'));
  writeFileSync(join(d, 'bozuk.json'), '{"tur":"baska"}');
  const c2 = istemci(['--durum', join(d, 'bozuk.json')]);
  assert.match((await c2.arac('ogrenci_ozeti')).metin, /kaydı değil/);
  await c2.kapat(); rmSync(d, { recursive: true });
});

test('mcp: istem (prompt) görev metnini ve raporu birleştirir', async () => {
  const c = istemci(SECENEK);
  assert.equal((await c.istek('prompts/list')).result.prompts[0].name, 'calisma_degerlendirmesi');
  const m = (await c.istek('prompts/get', { name: 'calisma_degerlendirmesi', arguments: { aralik: '7' } })).result.messages[0];
  assert.equal(m.role, 'user');
  assert.ok(m.content.text.includes('Önce raporun "Nasıl okunur"') && m.content.text.includes('# Öğrenme Defteri · Çalışma raporu'));
  await c.kapat();
});

// ---- içerik ekleme: geçici içerik klasöründe ----
function gecici() {
  const d = mkdtempSync(join(tmpdir(), 'od3-ekle-'));
  cpSync(join(kok, 'icerik'), join(d, 'icerik'), { recursive: true });
  return { d, icerik: join(d, 'icerik'), giris: join(d, 'giris'), temizle: () => rmSync(d, { recursive: true, force: true }) };
}
const OKUMA = `@paket deneme-okuma
@okuma
sv: 9
baslik: Deneme metni
hedef: Deneme.

Kediler süt içer. Köpekler kemik sever. Kuşlar uçar.

? Kediler ne içer? | Süt | Su | Çay
? Köpekler ne sever? | Kemik | Süt | Ot
? Kuşlar ne yapar? | Uçar | Yüzer | Koşar
`;

test('mcp: icerik_ekle varsayılan olarak yalnız dener (hiçbir şey yazmaz)', async () => {
  const g = gecici();
  const once = readdirSync(g.icerik).sort();
  const c = istemci([...SECENEK, '--icerik', g.icerik, '--giris', g.giris]);
  const r = (await c.arac('icerik_ekle', { metin: OKUMA })).veri();
  assert.equal(r.tamam, true); assert.equal(r.kuru, true); assert.equal(r.yazildi, false);
  assert.deepEqual(readdirSync(g.icerik).sort(), once, 'dosya eklenmemeli');
  assert.ok(!existsSync(g.giris));
  await c.kapat(); g.temizle();
});

test('mcp: icerik_ekle kuru:false yazar, doğrulatır; kaynak metni saklar; yeniden çalıştırmak aynı sonucu verir', async () => {
  const g = gecici();
  const c = istemci([...SECENEK, '--icerik', g.icerik, '--giris', g.giris]);
  const r = (await c.arac('icerik_ekle', { metin: OKUMA, kuru: false })).veri();
  assert.equal(r.yazildi, true); assert.equal(r.paket, 'deneme-okuma');
  const paket = JSON.parse(readFileSync(join(g.icerik, 'deneme-okuma.json'), 'utf8'));
  assert.equal(paket.dersler[0].sv, 9); assert.equal(paket.uretim.kaynak, 'giris');
  assert.ok(JSON.parse(readFileSync(join(g.icerik, 'index.json'), 'utf8')).paketler.includes('deneme-okuma.json'));
  assert.equal(readFileSync(join(g.giris, 'giris.txt'), 'utf8'), OKUMA);
  const yeni = (await c.arac('icerik_ara', { sorgu: 'Deneme', tur: 'ders' })).veri();
  assert.equal(yeni.dersSayisi, 1, 'yeni ders hemen aranabilir');
  const tekrar = (await c.arac('icerik_ekle', { metin: OKUMA, kuru: false })).veri();
  assert.equal(tekrar.tamam, true);
  assert.equal(JSON.parse(readFileSync(join(g.icerik, 'index.json'), 'utf8')).paketler.filter((p) => p === 'deneme-okuma.json').length, 1, 'indekste tek kez');
  await c.kapat(); g.temizle();
});

test('mcp: icerik_ekle hataları satır numarasıyla döner; hata varsa hiçbir şey değişmez', async () => {
  const g = gecici();
  const c = istemci([...SECENEK, '--icerik', g.icerik, '--giris', g.giris]);
  const once = readFileSync(join(g.icerik, 'index.json'), 'utf8');
  const kotu = OKUMA.replace('sv: 9', 'sv: 900').replace('? Kuşlar ne yapar? | Uçar | Yüzer | Koşar', '? Kuşlar ne yapar? | Uçar');
  const r = await c.arac('icerik_ekle', { metin: kotu, kuru: false });
  assert.equal(r.isError, true);
  const v = r.veri();
  assert.equal(v.tamam, false); assert.equal(v.yazildi, false);
  assert.ok(v.hatalar.some((h) => /satır \d+/.test(h)), v.hatalar.join('|'));
  assert.equal(readFileSync(join(g.icerik, 'index.json'), 'utf8'), once);
  assert.ok(!existsSync(join(g.icerik, 'deneme-okuma.json')));
  // doğrulayıcıda yakalanan hata: yazılan dosya geri alınır
  const kotu2 = OKUMA.replace('? Kediler ne içer? | Süt | Su | Çay', '? Kediler ne içer? | Süt | Süt | Çay');
  const r2 = (await c.arac('icerik_ekle', { metin: kotu2, kuru: false })).veri();
  if (!r2.tamam) assert.ok(!existsSync(join(g.icerik, 'deneme-okuma.json')) && readFileSync(join(g.icerik, 'index.json'), 'utf8') === once, 'geri alındı');
  await c.kapat(); g.temizle();
});

test('mcp: icerik_ekle elle yazılmış paketin (kelimeler, program…) üzerine yazmaz', async () => {
  const g = gecici();
  const c = istemci([...SECENEK, '--icerik', g.icerik, '--giris', g.giris]);
  const once = readFileSync(join(g.icerik, 'kelimeler.json'), 'utf8');
  const r = await c.arac('icerik_ekle', { metin: '@paket kelimeler\n@hafiza\nmasa, kapı, pencere\n', kuru: false });
  assert.equal(r.isError, true);
  assert.match(r.veri().hatalar.join(' '), /zaten var/);
  assert.equal(readFileSync(join(g.icerik, 'kelimeler.json'), 'utf8'), once);
  await c.kapat(); g.temizle();
});

// ---- eşitleme uç noktası ----
test('eşitleme: belirteç zorunlu, kayıt doğrulanır, veri/ klasörü dışarı sunulmaz, MCP yazılan kaydı okur', async () => {
  const g = mkdtempSync(join(tmpdir(), 'od3-sunucu-'));
  const port = 20000 + Math.floor(Math.random() * 20000);
  const s = spawn(process.execPath, [join(kok, 'scripts/sunucu.mjs'), '--port', String(port), '--veri', join(g, 'veri')], { stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((coz, red) => { const t = setTimeout(() => red(new Error('sunucu açılmadı')), 8000); s.stdout.on('data', (d) => { if (String(d).includes('belirteci')) { clearTimeout(t); coz(); } }); });
  try {
    const belirtec = readFileSync(join(g, 'veri', 'belirtec.txt'), 'utf8').trim();
    assert.match(belirtec, /^[0-9a-f]{36}$/);
    const url = `http://127.0.0.1:${port}/api/durum`;
    const gonder = (basliklar, govde) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...basliklar }, body: govde });
    const kayit = readFileSync(KAYIT, 'utf8');
    assert.equal((await gonder({}, kayit)).status, 401, 'belirteçsiz');
    assert.equal((await gonder({ 'x-belirtec': 'yanlis' }, kayit)).status, 401, 'yanlış belirteç');
    assert.equal((await gonder({ 'x-belirtec': belirtec }, '{"a":1}')).status, 400, 'kayıt biçimi doğrulanır');
    assert.equal((await gonder({ 'x-belirtec': belirtec }, 'json degil')).status, 400);
    assert.equal((await fetch(url)).status, 405, 'GET yok');
    assert.ok(!existsSync(join(g, 'veri', 'durum.json')), 'reddedilenler yazılmaz');
    const iyi = await gonder({ 'x-belirtec': belirtec }, kayit);
    assert.equal(iyi.status, 200); assert.deepEqual(await iyi.json(), { tamam: true, olay: 229 });
    assert.equal(readFileSync(join(g, 'veri', 'durum.json'), 'utf8'), kayit);
    assert.ok(!readdirSync(join(g, 'veri')).some((f) => f.endsWith('.tmp')), 'geçici dosya kalmaz');
    if (process.platform !== 'win32') for (const f of ['durum.json', 'belirtec.txt']) assert.equal(statSync(join(g, 'veri', f)).mode & 0o077, 0, `${f} yalnız sahibine açık (0600)`);
    // MCP sunucusu eşitlenen kaydı okur
    const c = istemci(['--durum', join(g, 'veri', 'durum.json'), '--bugun', BUGUN]);
    assert.equal((await c.arac('ogrenci_ozeti')).veri().kayit.olaySayisi, 229);
    await c.kapat();
  } finally { s.kill(); rmSync(g, { recursive: true, force: true }); }
});

test('eşitleme: varsayılan veri/ klasörü statik sunucudan okunamaz (kayıt ve belirteç sızmaz)', async () => {
  const port = 20000 + Math.floor(Math.random() * 20000);
  const g = mkdtempSync(join(tmpdir(), 'od3-sunucu2-'));
  const s = spawn(process.execPath, [join(kok, 'scripts/sunucu.mjs'), '--port', String(port), '--veri', join(kok, 'veri')], { stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((coz, red) => { const t = setTimeout(() => red(new Error('sunucu açılmadı')), 8000); s.stdout.on('data', (d) => { if (String(d).includes('belirteci')) { clearTimeout(t); coz(); } }); });
  try {
    for (const yol of ['/veri/belirtec.txt', '/veri/durum.json', '/veri', '/%76eri/belirtec.txt', '/js/../veri/belirtec.txt', '/%2e%2e/veri/belirtec.txt']) {
      const r = await fetch(`http://127.0.0.1:${port}${yol}`);
      assert.ok([403, 404].includes(r.status), `${yol} → ${r.status}`);
      assert.doesNotMatch(await r.text(), /^[0-9a-f]{36}\s*$/, `${yol} belirteci sızdırıyor`);
    }
    assert.equal((await fetch(`http://127.0.0.1:${port}/index.html`)).status, 200);
  } finally { s.kill(); rmSync(g, { recursive: true, force: true }); }
});
