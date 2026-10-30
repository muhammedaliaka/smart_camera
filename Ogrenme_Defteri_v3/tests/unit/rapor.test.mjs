// Çalışma raporu: her kayıt tek başına anlaşılır mı, hiçbir kayıt türü unutuluyor mu, alan dolunca ne oluyor.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Tarayıcı olmadan çalışsın: sabit tarih ve sahte localStorage (modüller yüklenmeden önce kurulmalı).
globalThis.location = { search: '?t=2026-11-03', hash: '' };
const depo = new Map();
globalThis.localStorage = { getItem: (k) => depo.get(k) ?? null, setItem: (k, v) => depo.set(k, v), removeItem: (k) => depo.delete(k) };

const store = await import('../../js/store.js');
const { raporUret, RAPOR_TURLERI, RAPOR_ATLANAN } = await import('../../js/rapor.js');

const kok = fileURLToPath(new URL('../..', import.meta.url));
const BUGUN = '2026-11-03';

function temizDurum() {
  store.sifirla();
  const d = store.al();
  d.ad = 'Deneme'; d.baslangic = '2026-11-01';
  return d;
}
const ders = { dersAd: 'Sayılar', iz: 'ingilizce' };

/** Oyuncunun yazdığı kayıtların aynıları (js/oyuncu.js puanla). */
function soruKaydet({ dogru, yanit, soru, dogruCevap, duyulan = null, sec = null, ilk = true, gorev = 'Çoktan seçmeli soru', bolum = 'Kelimeler', tur = 'mcq', dersId = 'en-02-sayilar' }) {
  return store.olay('soru', { ders: dersId, id: 'q:' + soru, bolum, dogru, ilk, yanit, ...(!dogru && sec ? { sec } : {}) },
    { ...ders, tur, gorev, bolum, soru, dogruCevap, duyulan });
}
const rapor = (secenek = {}) => raporUret({ durum: store.al(), oku: {}, bugun: BUGUN, ...secenek });

test('rapor: soru satırı soruyu, duyulanı, öğrencinin yanıtını ve doğrusunu birlikte taşır', () => {
  temizDurum();
  soruKaydet({ dogru: false, yanit: 'ekmek', soru: 'apple', dogruCevap: 'elma', sec: ['elma', 'ekmek', 'süt'], gorev: 'İngilizce kelimenin Türkçesini seç' });
  soruKaydet({ dogru: false, yanit: '60', soru: 'Hangi sayıyı duydun?', dogruCevap: '16', duyulan: 'sixteen', gorev: 'Duyduğun sayıyı rakamla yaz', tur: 'sayi' });
  const m = rapor();
  assert.match(m, /✘ \[İngilizce kelimenin Türkçesini seç · Kelimeler\] Soru: “apple” · Öğrenci: “ekmek” · Doğru: “elma” · Ekrandaki seçenekler: elma \/ ekmek \/ süt/);
  assert.match(m, /Soru: “Hangi sayıyı duydun\?” · Duyulan: “sixteen” · Öğrenci: “60” · Doğru: “16”/);
  assert.match(m, /#### Ders: “Sayılar” \(İngilizce\) · kod: en-02-sayilar/);
  assert.match(m, /### 2026-11-03 · Gün 3 · /);
});

test('rapor: kısa kipte doğrular yalnız sayılır, tam kipte tek tek yazılır; yanlışlar her zaman yazılır', () => {
  temizDurum();
  soruKaydet({ dogru: true, yanit: 'elma', soru: 'apple', dogruCevap: 'elma' });
  soruKaydet({ dogru: false, yanit: 'süt', soru: 'bread', dogruCevap: 'ekmek' });
  const kisa = rapor({ ayrinti: 'kisa' }), tam = rapor({ ayrinti: 'tam' });
  assert.doesNotMatch(kisa, /Soru: “apple”/);
  assert.match(kisa, /İlk denemede doğru bilinen 1 soru tek tek yazılmadı/);
  assert.match(kisa, /Soru: “bread”/);
  assert.match(tam, /✔ \[Çoktan seçmeli soru · Kelimeler\] Soru: “apple”/);
  assert.match(tam, /Soru: “bread”/);
  assert.match(kisa, /\*\*1\/2\*\* \(%50\)/);
});

test('rapor: yeniden sorulan yanlış "(tekrar)" diye yazılır ve yüzdeye katılmaz', () => {
  temizDurum();
  soruKaydet({ dogru: false, yanit: 'süt', soru: 'bread', dogruCevap: 'ekmek' });
  soruKaydet({ dogru: true, yanit: 'ekmek', soru: 'bread', dogruCevap: 'ekmek', ilk: false });
  const m = rapor();
  assert.match(m, /✔ \(tekrar\) \[/);
  assert.match(m, /\*\*0\/1\*\* \(%0\)/);
});

test('rapor: açık uçlu yanıt, yardım beyanı ve işaretlenen noktalar birlikte yazılır', () => {
  const d = temizDurum();
  const e = store.olay('serbest', { ders: 'en-01-tanisma', id: 's1', soru: 'Kendini tanıt', kip: 'yaz', dil: 'en', yanit: 'My name is Ali.\nI am sixteen.', sozcuk: 7 },
    { dersAd: 'Tanışma', iz: 'ingilizce', ornek: 'Hello, I am Ece.', beklenen: ['ad', 'yaş'] });
  store.olay('serbest-kontrol', { ders: 'en-01-tanisma', id: 's1', olay: e.i, yardim: 'A1', noktalar: { var: 1, toplam: 2, secilen: ['ad'], tumu: ['ad', 'yaş'] } }, { dersAd: 'Tanışma', iz: 'ingilizce' });
  store.olay('serbest', { ders: 'en-01-tanisma', id: 's2', soru: 'Bir şey söyle', kip: 'ses', sureMs: 12000 }, { dersAd: 'Tanışma', iz: 'ingilizce' });
  assert.ok(d);
  const m = rapor();
  assert.match(m, /Soru: “Kendini tanıt” · Dil: en · Öğrenci yazdı \(7 sözcük\):\n {2}> My name is Ali\.\n {2}> I am sixteen\./);
  assert.match(m, /Beyan: yardım durumu = ipucu ya da araç kullandı/);
  assert.match(m, /bulunan: ad; bulunmayan: yaş/);
  assert.match(m, /örnek yanıt \(tek doğru değildir\): “Hello, I am Ece\.”/);
  assert.match(m, /sesli yanıt verdi \(12 sn; kaydın içeriği rapora girmez\)/);
});

test('rapor: liste, spor, dış uygulama, ölçek, okuma, dinleme, hafıza sarayı ve gecikmeli hatırlama okunur biçimde yazılır', () => {
  temizDurum();
  store.olay('liste', { ders: 'haf-02', id: 'l1', var: 4, sirali: 3, toplam: 5, yanit: ['a', 'b', 'c', 'd'], yenidenBaktim: true }, { dersAd: 'Liste', iz: 'hafiza', baslik: 'Market listesi', anahtar: ['a', 'b', 'c', 'd', 'e'] });
  store.olay('spor', { ders: 'spor-g01', id: 'sp', olcu: { 'hareket:squat': 2 }, yapilanlar: [{ ad: 'Squat', yapilan: 2, birim: 'set', hedef: '3 set × 10' }, { ad: 'Yürüyüş', yapilan: 1.5, birim: 'km', hedef: '2 km' }], zorlanma: 6, destek: true, kismi: true, not: 'diz ağrıdı' }, { dersAd: 'Spor 1', iz: 'spor', baslik: 'Güç günü' });
  store.olay('dis', { ders: 'dis-01', id: 'd', uygulama: 'voscreen', ad: 'Voscreen', gorev: '10 klip çöz', dogru: 7, toplam: 10, yuzde: 70, yapilmadi: false, not: null }, { dersAd: 'Voscreen', iz: 'dis' });
  store.olay('olcek', { ders: 'kontrol-01', id: 'o', deger: 7 }, { dersAd: 'Kontrol', iz: 'olcum', soru: 'Bugün ne kadar odaklandın?', min: 0, max: 10, altEtiket: 'hiç', ustEtiket: 'çok' });
  store.olay('okuma', { ders: 'oku-01', id: 'ok', kosul: 'A', satirKaybi: 2, geriDonus: 'sayamadim' }, { dersAd: 'Uzay', iz: 'okuma', baslik: 'Uzayda su' });
  store.olay('dinleme', { ders: 'dinle-01', id: 'dn', sayi: 3, sinir: 2 }, { dersAd: 'Duyuru', iz: 'dinleme', baslik: 'Okul duyurusu' });
  store.olay('saray', { ders: 'haf-01', rota: 'ev', duraklar: ['Kapı', 'Dolap'] }, { dersAd: 'Saray', iz: 'hafiza', ad: 'Evim' });
  store.olay('saray-hayal', { ders: 'haf-01', id: 'sh', hayaller: [{ nesne: 'elma', durak: 'Kapı', hayal: 'dev elma yuvarlanıyor' }, { nesne: 'süt', durak: 'Dolap', hayal: '' }] }, { dersAd: 'Saray', iz: 'hafiza', rota: 'Evim' });
  store.olay('gecikmeli-kur', { ders: 'haf-02', id: 'gk', kontroller: ['5dk', '1gun'] }, { dersAd: 'Liste', iz: 'hafiza', baslik: 'Market', soru: 'Listeyi yaz', anahtar: ['a'] });
  store.olay('gecikmeli-yanit', { ders: 'hatirla:g1:5dk', id: 'g1', kontrol: '5dk', dogru: false, yanit: 'a, c', yenidenBaktim: false, ayrinti: '1/2 öğe', gecikmeSn: 90 }, { dersAd: 'Market', iz: 'hafiza', baslik: 'Market', soru: 'Listeyi yaz', anahtar: ['a', 'b'] });
  store.olay('oyun', { oyun: 'hizli', ders: 'oyun:hizli', dogru: 9, toplam: 12, yuzde: 75 }, { dersAd: 'Hızlı tur', iz: 'oyun', oyunAd: 'Hızlı tur' });
  const m = rapor();
  for (const parca of [
    'Listedeki öğeler, sırayla: a, b, c, d, e · Öğrencinin yazdıkları: a, b, c, d · Hatırlanan: 4/5, doğru yerde: 3 · Beyan: listeye yeniden baktı',
    'Yapılanlar: Squat: 2 set (hedef: 3 set × 10); Yürüyüş: 1.5 km (hedef: 2 km) · Beyan: zorlanma 6/10 (0 çok rahat, 10 çok zor), destek kullandı, planın bir kısmını yaptı · Not: “diz ağrıdı”',
    'Voscreen · Görev: “10 klip çöz” · Beyan: 7/10 doğru (%70)',
    'Soru: “Bugün ne kadar odaklandın?” (0–10; 0 = hiç, 10 = çok) · Beyan: 7',
    'Beyan: satır kaybı 2; geri dönüş sayamadim',
    'Öğrenci 3 kez dinledi (en çok 2 hakkı vardı)',
    'Rota “Evim”: Kapı → Dolap',
    'Dolap durağı ← süt: (boş bıraktı)',
    'Kapı durağı ← elma: “dev elma yuvarlanıyor”',
    'Kontrol zamanları: 5 dakika sonra, ertesi gün',
    '✘ [Gecikmeli hatırlama · 5 dakika sonra] “Market” · Soru: “Listeyi yaz” · Öğrenci: “a, c” · Doğru: “a, b”',
    'Oyun · Hızlı tur] İlk denemede 9/12 doğru (%75)',
  ]) assert.ok(m.includes(parca), `Raporda yok: ${parca}`);
});

test('rapor: hiçbir yerde undefined / null / NaN / [object yok', () => {
  temizDurum();
  soruKaydet({ dogru: false, yanit: '', soru: 'x', dogruCevap: '' });
  store.olay('okuma', { ders: 'oku-01', id: 'ok', kosul: null }, { dersAd: 'Uzay', iz: 'okuma', baslik: 'Uzayda su' });
  store.olay('dis', { ders: 'dis-01', id: 'd', uygulama: 'v', ad: 'V', gorev: 'x', dogru: null, toplam: null, yuzde: null, yapilmadi: false, not: null }, {});
  store.olay('dinleme', { ders: 'd', id: 'x', sayi: 1, sinir: null }, {});
  const m = rapor({ ayrinti: 'tam' });
  assert.doesNotMatch(m, /undefined|\bnull\b|NaN|\[object/);
});

test('rapor: eski (bağlamsız) kayıt hata vermez, eksik olduğunu söyler; tanımsız kayıt türü atlanmaz', () => {
  temizDurum();
  store.olay('soru', { ders: 'eski', id: 'q', dogru: false, ilk: true, yanit: 'x' });
  store.olay('gelecekteki-tur', { ders: 'eski', ayrinti: 5 });
  const m = rapor();
  assert.match(m, /Soru metni bu kayıtta yok/);
  assert.match(m, /Tanımsız kayıt türü: gelecekteki-tur\] \{"ders":"eski","ayrinti":5\}/);
});

test('rapor: tarih aralığı dışındaki kayıtlar girmez; boş aralık açıkça söylenir', () => {
  temizDurum();
  soruKaydet({ dogru: false, yanit: 'a', soru: 'eski soru', dogruCevap: 'b' });
  assert.match(rapor({ bas: '2026-11-04', son: '2026-11-10' }), /Bu aralıkta kayıt yok/);
  assert.doesNotMatch(rapor({ bas: '2026-11-04', son: '2026-11-10' }), /eski soru/);
  assert.match(rapor({ bas: '2026-11-03', son: '2026-11-03' }), /eski soru/);
});

test('bağlam: aynı soru bir kez saklanır, olaylar yalnız kısa anahtar taşır; program günü yazılır', () => {
  temizDurum();
  for (let i = 0; i < 5; i++) soruKaydet({ dogru: i % 2 === 0, yanit: 'a', soru: 'apple', dogruCevap: 'elma' });
  const d = store.al();
  assert.equal(Object.keys(d.bag).length, 1);
  assert.equal(new Set(d.olaylar.map((o) => o.b)).size, 1);
  assert.ok(d.olaylar.every((o) => o.gn === 3), 'baslangic 1 Kasım, bugün 3 Kasım -> Gün 3');
  assert.equal(store.baglam(d.olaylar[0]).soru, 'apple');
  assert.ok(JSON.stringify(d.olaylar[0]).length < 260, 'olay küçük kalmalı');
});

test('yedek: iki cihazın bağlam katalogları birleşir', async () => {
  temizDurum();
  soruKaydet({ dogru: true, yanit: 'a', soru: 'apple', dogruCevap: 'elma' });
  const yedek = JSON.parse(JSON.stringify(store.al()));
  store.sifirla();
  soruKaydet({ dogru: true, yanit: 'b', soru: 'bread', dogruCevap: 'ekmek' });
  await store.yedekYukle({ tur: 'od3-yedek', durum: yedek, paketler: [], kayitlar: {} });
  const d = store.al();
  assert.equal(d.olaylar.length, 2);
  assert.deepEqual(d.olaylar.map((o) => store.baglam(o).soru).sort(), ['apple', 'bread']);
});

test('kota: alan dolunca en eski kayıtların yalnız ayrıntısı silinir; soru, sonuç, tarih ve yeni kayıtlar kalır', () => {
  const d = temizDurum();
  const eski = Date.parse('2026-01-01T10:00:00Z');
  for (let i = 0; i < 9000; i++) {
    d.olaylar.push({ i: 'x' + i, t: new Date(eski + i * 60000).toISOString(), g: '2026-01-01', tur: 'soru', ders: 'en-02', id: 'q' + (i % 40), b: 'abc', dogru: i % 3 === 0, ilk: true, yanit: 'bir yanıt metni', sec: ['elma yeşil', 'ekmek', 'süt bardağı'] });
    if (i % 2) d.olaylar.push({ i: 'y' + i, t: new Date(eski + i * 60000 + 1).toISOString(), g: '2026-01-01', tur: 'srs', madde: 'k:a', dogru: true, kutu: 1, sonraki: '2026-02-01' });
  }
  const once = JSON.stringify(d).length;
  const hedef = Math.floor(once * 0.75);
  assert.equal(store.sadelestir(d, hedef), true);
  assert.ok(JSON.stringify(d).length <= hedef, 'hedefin altına inmeli');
  const sorular = d.olaylar.filter((o) => o.tur === 'soru');
  assert.equal(sorular.length, 9000, 'hiçbir soru kaydı silinmemeli');
  assert.ok(sorular.every((o) => o.g && o.ders && typeof o.dogru === 'boolean' && o.id && o.b));
  const sonlar = [...d.olaylar].sort((a, b) => a.t.localeCompare(b.t)).slice(-1000).filter((o) => o.tur === 'soru');
  assert.ok(sonlar.every((o) => o.sec && o.yanit), 'en yeni kayıtlar sadeleşmemeli');
});

test('kapsam: uygulamanın yazdığı her kayıt türünün raporda biçimi ya da gerekçeli atlama kararı var', () => {
  const dosyalar = [];
  const gez = (d) => { for (const a of readdirSync(d)) { const y = join(d, a); if (statSync(y).isDirectory()) gez(y); else if (y.endsWith('.js')) dosyalar.push(y); } };
  gez(join(kok, 'js'));
  const turler = new Set();
  for (const f of dosyalar) {
    const kaynak = readFileSync(f, 'utf8');
    for (const m of kaynak.matchAll(/(?:store\.olay|api\.kaydet|[^.\w]olay)\(\s*'([a-z-]+)'/g)) turler.add(m[1]);
    // seviye olayları js/seviye-oturum.js içinde { tur: '…' } olarak kurulur, seviye-ac.js store.olay(o.tur, …) ile yazar
    if (f.endsWith('seviye-oturum.js')) for (const m of kaynak.matchAll(/tur:\s*'((?:yerlestirme|seviye)[a-z-]*)'/g)) turler.add(m[1]);
  }
  assert.ok(turler.size >= 15, `beklenenden az kayıt türü bulundu: ${[...turler]}`);
  const eksik = [...turler].filter((t) => !RAPOR_TURLERI.has(t) && !RAPOR_ATLANAN[t]);
  assert.deepEqual(eksik, [], 'Bu kayıt türleri raporda yok: js/rapor.js içinde biçimlendir ya da RAPOR_ATLANAN\'a nedenini yazıp ekle');
  for (const t of RAPOR_TURLERI) assert.ok(turler.has(t) || t === 'ders-bitir', `Raporda biçimi olan "${t}" türünü hiçbir yer yazmıyor (eski kalıntı?)`);
});
