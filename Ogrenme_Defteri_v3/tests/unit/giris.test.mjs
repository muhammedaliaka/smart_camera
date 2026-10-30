// Kolay giriş biçimi (js/giris.js) ve içe aktarıcı (scripts/ekle.mjs): ayrıştırma, hata satırları, tekrar çalıştırılabilirlik, geri alma.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { girisCoz, siklikHaritasi, slug, svSiklik, SIKLIK_CAPALARI } from '../../js/giris.js';
import { icerikEkle } from '../../scripts/ekle.mjs';

const kok = fileURLToPath(new URL('../..', import.meta.url));

test('slug: Türkçe harfler ASCII olur, kimlik kuralına uyar', () => {
  assert.equal(slug('Dört mevsim'), 'dort-mevsim');
  assert.equal(slug('İstanbul ışık'), 'istanbul-isik');
  assert.equal(slug("Maya'nın günü"), 'mayanin-gunu');
  assert.equal(slug('  --Çok   Şey!  '), 'cok-sey');
  assert.match(slug('Çağrı Öğüt'), /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('svSiklik: çapalarda tam değer, sıra büyüdükçe seviye azalmaz, 100\'ü aşmaz', () => {
  for (const [sira, sv] of SIKLIK_CAPALARI) assert.equal(svSiklik(sira), sv, `sıra ${sira}`);
  let onceki = 0;
  for (const sira of [1, 10, 50, 100, 300, 800, 1500, 2500, 4000, 6000, 9000, 10000, 20000, 100000, 1e7]) { const sv = svSiklik(sira); assert.ok(sv >= onceki && sv <= 100, `sıra ${sira}: ${sv}`); onceki = sv; }
  assert.equal(svSiklik(0), null);
  assert.equal(svSiklik(NaN), null);
});

test('siklikHaritasi: sıra = dosyadaki satır numarası (boş satır da sayılır), tekrarlar ilk sırayı korur, büyük/küçük harf farkı yok', () => {
  const m = siklikHaritasi('The\r\nof\n\nAND\nthe\n');
  assert.equal(m.get('the'), 1); assert.equal(m.get('of'), 2); assert.equal(m.get('and'), 4); assert.equal(m.size, 3);
});

const KELIME = `# yorum
@paket test
@kelimeler grup=yiyecek sv=6
apple | elma | I eat an apple. | Bir elma yerim. | 🍎
bread | ekmek | | | 🍞 | sv=7 | kabul=somun/ekmek
water | su | I drink water. | Su içerim. | 💧 | id=su-icmek
`;

test('giris: kelime satırı alanları, sv/kabul/id/grup özellikleri', () => {
  const r = girisCoz(KELIME);
  assert.deepEqual(r.hatalar, []);
  const [a, b, c] = r.paket.kelimeler;
  assert.deepEqual(a, { id: 'apple', en: 'apple', tr: 'elma', emoji: '🍎', grup: 'yiyecek', ornek: { en: 'I eat an apple.', tr: 'Bir elma yerim.' }, sv: 6 });
  assert.equal(b.sv, 7, 'satır sv=, blok sv=\'nin önüne geçer'); assert.deepEqual(b.kabul, ['somun', 'ekmek']); assert.equal(b.ornek, undefined);
  assert.equal(c.id, 'su-icmek');
  assert.equal(r.paketAd, 'test'); assert.equal(r.paket.paket, 'test');
  assert.deepEqual(r.ozet, { kelime: 3, ders: 0, hafiza: 0 });
});

test('giris: sv aralığı (sv=A-B) sıklık sırasına göre yayılır; sıklık yoksa açık hata verir', () => {
  const metin = '@kelimeler sv=10-30\ncommon | yaygın\nmiddle | orta\nrare | nadir\n';
  const hata = girisCoz(metin);
  assert.match(hata.hatalar[0], /^satır 1: .*sıklık listesi/);
  const r = girisCoz(metin, { siklik: new Map([['common', 10], ['middle', 500], ['rare', 4000]]) });
  assert.deepEqual(r.hatalar, []);
  assert.deepEqual(r.paket.kelimeler.map((k) => [k.en, k.sv]), [['common', 10], ['middle', 20], ['rare', 30]]);
  assert.deepEqual(r.paket.kelimeler.map((k) => k.siklik), [10, 500, 4000]);
  const eksik = girisCoz(metin, { siklik: new Map([['common', 10], ['middle', 500]]) });
  assert.match(eksik.hatalar.join('|'), /satır 4: "rare" sıklık listesinde yok/);
  assert.match(girisCoz('@kelimeler sv=30-10\na | b', { siklik: new Map() }).hatalar[0], /küçük-büyük/);
});

test('giris: sv=auto sıklıktan hesaplar', () => {
  const r = girisCoz('@kelimeler sv=auto\nthe | belirteç\n', { siklik: new Map([['the', 1]]) });
  assert.equal(r.paket.kelimeler[0].sv, svSiklik(1));
});

test('giris: kelime hataları satır numarasıyla gelir', () => {
  const hatalar = (m) => girisCoz(m).hatalar;
  assert.match(hatalar('@kelimeler\na | b')[0], /^satır 2: "a" için seviye \(sv\) yok/);
  assert.match(hatalar('@kelimeler sv=5\na')[0], /^satır 2: en ve tr gerekli/);
  assert.match(hatalar('@kelimeler sv=5\na | b | örnek')[0], /^satır 2: örnek cümlenin hem İngilizcesi hem Türkçesi/);
  assert.match(hatalar('@kelimeler sv=5\na | b | c | d | e | f')[0], /^satır 2: en fazla 5 alan/);
  assert.match(hatalar('@kelimeler sv=500\na | b')[0], /^satır 2: sv 1–100/);
  assert.match(hatalar('@kelimeler sv=5\na | b\na | c')[0], /^satır 3: "a" bu dosyada iki kez/);
  assert.match(hatalar('masa | table')[0], /^satır 1: önce bir blok başlat/);
  assert.match(hatalar('@kelimler\na | b')[0], /^satır 1: bilinmeyen blok "@kelimler"/);
  assert.match(hatalar('# yalnız yorum\n')[0], /dosyada içerik yok/);
});

const OKUMA = `@okuma
id: oku-deneme
sv: 12
baslik: Deneme
emoji: 🌧️
hedef: Hedef cümlesi.
sozluk: bulut = su damlacıkları; yağmur = yere düşen su

Birinci paragraf
iki satıra yayılmış.

İkinci paragraf.

? Soru bir? | Doğru | Yanlış 1 | Yanlış 2 -> Açıklama burada.
? Soru iki? | Evet | Hayır
? Soru üç? | A | B | C | D
`;

test('giris: okuma dersi; paragraflar birleşir, ilk seçenek doğru, açıklama ayrılır, sözlük çözülür', () => {
  const r = girisCoz(OKUMA, { dosya: 'okuma-deneme' });
  assert.deepEqual(r.hatalar, []); assert.deepEqual(r.uyarilar, []);
  const d = r.paket.dersler[0], a = d.adimlar[0];
  assert.equal(d.id, 'oku-deneme'); assert.equal(d.iz, 'okuma'); assert.equal(d.sv, 12); assert.equal(d.emoji, '🌧️');
  assert.deepEqual(a.metin, ['Birinci paragraf iki satıra yayılmış.', 'İkinci paragraf.']);
  assert.deepEqual(a.sorular[0], { soru: 'Soru bir?', secenekler: ['Doğru', 'Yanlış 1', 'Yanlış 2'], aciklama: 'Açıklama burada.' });
  assert.equal(a.sorular[1].aciklama, undefined);
  assert.deepEqual(a.sozluk, [{ k: 'bulut', a: 'su damlacıkları' }, { k: 'yağmur', a: 'yere düşen su' }]);
  assert.equal(a.tur, 'oku');
});

test('giris: kimlik verilmezse seviye ve başlıktan üretilir (Türkçe harfler ASCII)', () => {
  const r = girisCoz(OKUMA.replace('id: oku-deneme\n', '').replace('baslik: Deneme', 'baslik: Çiğ süt'));
  assert.equal(r.paket.dersler[0].id, 'oku-sv12-cig-sut');
});

test('giris: dinleme dersi ses, hız, sınır, tr ve metin alanlarını kurar', () => {
  const r = girisCoz(`@dinleme\nsv: 5\nbaslik: Selam\nses: erkek\nhiz: 0.85\nsinir: 2\ntr: Merhaba dünya.\n\nHello world.\nSecond sentence.\n\n? Ne denildi? | Merhaba | Güle güle | Teşekkürler\n? İkinci? | A | B\n? Üçüncü? | C | D\n`);
  assert.deepEqual(r.hatalar, []);
  const a = r.paket.dersler[0].adimlar[0];
  assert.equal(a.tur, 'dinle'); assert.deepEqual(a.ses, { metin: 'Hello world. Second sentence.', ses: 'erkek', hiz: 0.85 });
  assert.equal(a.sinir, 2); assert.equal(a.metinTr, 'Merhaba dünya.'); assert.deepEqual(a.metin, ['Hello world. Second sentence.']);
});

test('giris: ders hataları ve uyarıları satır numarasıyla', () => {
  const hata = (m) => girisCoz(m).hatalar.join('|');
  assert.match(hata('@okuma\nsv: x\nbaslik: B\n\nMetin.\n? S? | a | b | c'), /satır 1: .*"sv:" 1–100/);
  assert.match(hata('@okuma\nsv: 5\n\nMetin.\n? S? | a | b | c'), /"baslik:" gerekli/);
  assert.match(hata('@okuma\nsv: 5\nbaslik: B\n'), /metin yok/);
  assert.match(hata('@okuma\nsv: 5\nbaslik B\n\nMetin.'), /^satır 3: başlık satırı "anahtar: değer" olmalı/);
  assert.match(hata('@okuma\nsv: 5\nbaslik: B\n\nMetin.\n? Tek seçenek? | a'), /^satır 6: soru biçimi/);
  assert.match(hata('@okuma\nsv: 5\nbaslik: B\n\n? S? | a | b\nSorudan sonra paragraf.'), /^satır 6: sorulardan sonra paragraf olmaz/);
  assert.match(hata('@okuma\nsv: 5\nbaslik: B\n\nMetin.\n? S? | a | | c'), /soru biçimi/);
  const u = girisCoz('@okuma\nsv: 5\nbaslik: B\n\nMetin.\n? S? | a | b');
  assert.deepEqual(u.hatalar, []); assert.match(u.uyarilar[0], /1 soru var; seviye oturumunda sayılması için en az 3/);
});

test('giris: hafıza havuzu; virgül ya da satırla ayrılır, yinelenen sözcük hata', () => {
  const r = girisCoz('@hafiza\n# yorum\nmasa, kapı\npencere\n');
  assert.deepEqual(r.paket.hafizaHavuzu, ['masa', 'kapı', 'pencere']);
  assert.match(girisCoz('@hafiza\nmasa, Masa').hatalar[0], /^satır 2: "Masa" havuzda iki kez/);
  assert.match(girisCoz('@hafiza\n# yalnız yorum').hatalar.join('|'), /@hafiza boş/);
});

test('giris: BOM ve CRLF kabul edilir; aynı girdi aynı çıktıyı verir', () => {
  const a = girisCoz(KELIME);
  const b = girisCoz('﻿' + KELIME.replace(/\n/g, '\r\n'));
  assert.deepEqual(b.paket, a.paket);
  assert.deepEqual(girisCoz(KELIME).paket, a.paket);
});

test('giris: bir dosyada birden çok blok birleşir; paket işareti vardır', () => {
  const r = girisCoz(KELIME + '\n' + OKUMA + '\n@hafiza\nmasa\n');
  assert.deepEqual(r.hatalar, []);
  assert.equal(r.paket.kelimeler.length, 3); assert.equal(r.paket.dersler.length, 1); assert.deepEqual(r.paket.hafizaHavuzu, ['masa']);
  assert.equal(r.paket.uretim.kaynak, 'giris');
});

// ---- içe aktarıcı ----
function gecici() {
  const d = mkdtempSync(join(tmpdir(), 'od3-giris-'));
  cpSync(join(kok, 'icerik'), join(d, 'icerik'), { recursive: true });
  return { klasor: join(d, 'icerik'), temizle: () => rmSync(d, { recursive: true, force: true }) };
}
const DERS = `@paket ekle-testi\n@okuma\nsv: 9\nbaslik: Ekle testi\n\nKediler süt içer.\n\n? Kediler ne içer? | Süt | Su | Çay\n? Kim süt içer? | Kediler | Balıklar | Taşlar\n? Süt nedir? | İçecek | Taş | Kitap\n`;

test('ekle: tekrar çalıştırmak aynı dosyayı verir, indekste tek kayıt kalır, program.json\'dan önce eklenir', () => {
  const g = gecici();
  const a = icerikEkle(DERS, { klasor: g.klasor, dosya: 'x' });
  assert.equal(a.tamam, true, a.hatalar.join('|'));
  const ilk = readFileSync(join(g.klasor, 'ekle-testi.json'), 'utf8');
  assert.equal(icerikEkle(DERS, { klasor: g.klasor, dosya: 'x' }).tamam, true);
  assert.equal(readFileSync(join(g.klasor, 'ekle-testi.json'), 'utf8'), ilk);
  const dizin = JSON.parse(readFileSync(join(g.klasor, 'index.json'), 'utf8')).paketler;
  assert.equal(dizin.filter((p) => p === 'ekle-testi.json').length, 1);
  assert.ok(dizin.indexOf('ekle-testi.json') < dizin.indexOf('program.json'));
  g.temizle();
});

test('ekle: kuru çalıştırma hiçbir şey bırakmaz', () => {
  const g = gecici();
  const once = readdirSync(g.klasor).sort(), indeks = readFileSync(join(g.klasor, 'index.json'), 'utf8');
  const r = icerikEkle(DERS, { klasor: g.klasor, dosya: 'x', kuru: true });
  assert.equal(r.tamam, true);
  assert.deepEqual(readdirSync(g.klasor).sort(), once); assert.equal(readFileSync(join(g.klasor, 'index.json'), 'utf8'), indeks);
  g.temizle();
});

test('ekle: ayrıştırma hatasında hiçbir dosya değişmez; doğrulama hatasında yazılanlar geri alınır', () => {
  const g = gecici();
  const indeks = readFileSync(join(g.klasor, 'index.json'), 'utf8');
  const kotuBicim = icerikEkle(DERS.replace('sv: 9', 'sv: yok'), { klasor: g.klasor, dosya: 'x' });
  assert.equal(kotuBicim.tamam, false); assert.match(kotuBicim.hatalar[0], /satır/);
  assert.ok(!existsSync(join(g.klasor, 'ekle-testi.json')));
  // biçimi doğru ama içerik doğrulayıcıda hata veren: aynı kimlikli iki kelime (başka paketle çakışma)
  const cakisma = `@paket ekle-cakisma\n@kelimeler sv=5\n${JSON.parse(readFileSync(join(g.klasor, 'kelimeler.json'), 'utf8')).kelimeler[0].en} | çakışan\n`;
  const r = icerikEkle(cakisma, { klasor: g.klasor, dosya: 'x' });
  assert.equal(r.tamam, false, 'var olan bir kimlikle çakışan kelime reddedilir');
  assert.match(r.hatalar.join('|'), /doğrulama:/);
  assert.ok(!existsSync(join(g.klasor, 'ekle-cakisma.json')), 'yazılan dosya silindi');
  assert.equal(readFileSync(join(g.klasor, 'index.json'), 'utf8'), indeks, 'indeks eski haline döndü');
  g.temizle();
});

test('ekle: elle yazılmış pakete dokunmaz; --ustune-yaz ile izin verilir; üretilmiş paketin üzerine yazılır', () => {
  const g = gecici();
  const once = readFileSync(join(g.klasor, 'okuma.json'), 'utf8');
  const r = icerikEkle(DERS.replace('@paket ekle-testi', '@paket okuma'), { klasor: g.klasor, dosya: 'x' });
  assert.equal(r.tamam, false); assert.match(r.hatalar[0], /üzerine yazılmadı/);
  assert.equal(readFileSync(join(g.klasor, 'okuma.json'), 'utf8'), once);
  assert.equal(icerikEkle(DERS, { klasor: g.klasor, dosya: 'x' }).tamam, true);
  assert.equal(icerikEkle(DERS.replace('Kediler süt içer.', 'Kediler süt içer, balık yer.'), { klasor: g.klasor, dosya: 'x' }).tamam, true, 'üretilmiş paket güncellenebilir');
  assert.match(readFileSync(join(g.klasor, 'ekle-testi.json'), 'utf8'), /balık yer/);
  g.temizle();
});

test('giriş dosyaları: giris/*.txt hatasız çözülür ve icerik/ ile aynı paketleri üretir (kaynak ile çıktı birbirinden kopmamış)', () => {
  const siklikYolu = process.env.SIKLIK_LISTESI; // kelime bankası sıklık listesi gerektirir; liste pakete dahil olmadığından yoksa atlanır
  for (const f of readdirSync(join(kok, 'giris')).filter((x) => x.endsWith('.txt'))) {
    if (f.startsWith('kelime-bankasi') && !siklikYolu) continue;
    const r = girisCoz(readFileSync(join(kok, 'giris', f), 'utf8'), { dosya: f.replace('.txt', ''), siklik: siklikYolu ? siklikHaritasi(readFileSync(siklikYolu, 'utf8')) : null });
    assert.deepEqual(r.hatalar, [], f);
    const uretilmis = JSON.parse(readFileSync(join(kok, 'icerik', r.paketAd + '.json'), 'utf8'));
    assert.deepEqual(JSON.parse(JSON.stringify(r.paket)), uretilmis, `${f} → icerik/${r.paketAd}.json: giriş dosyası değişmiş ama paket yeniden üretilmemiş (node scripts/ekle.mjs giris/${f} --ustune-yaz)`);
  }
});
