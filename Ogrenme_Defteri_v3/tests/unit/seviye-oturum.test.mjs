import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { birlestir, indeksle } from '../../js/paket.js';
import { kuralKur, seviyeler } from '../../js/seviye.js';
import { hazirla, sayfalar, olayVerisi, sonucMetni, puanliSoruSayisi, yerlestirmeKapatOlayi, BOLUM } from '../../js/seviye-oturum.js';
import { gunPlani } from '../../js/plan.js';
import { ctxOlustur } from './yardimci.mjs';

const seviyePaketi = JSON.parse(readFileSync(fileURLToPath(new URL('../../icerik/seviye.json', import.meta.url)), 'utf8'));

// ---- yapay içerik: her seviyede 2 kelime, 4 sorulu okuma/dinleme metinleri, hafıza havuzu, spor hareketleri ----
const kelimeler = [];
for (let sv = 1; sv <= 80; sv++) for (const x of ['a', 'b']) kelimeler.push({ id: `w${sv}${x}`, en: `word${sv}${x}`, tr: `kelime${sv}${x}`, sv, ornek: { en: `This is word ${sv}${x}.`, tr: `Bu kelime ${sv}${x}.` } });
const yazili = (iz, sv) => ({
  id: `${iz}-${sv}`, iz, sv, baslik: `${iz} ${sv}`, hedef: 'h',
  adimlar: [iz === 'okuma'
    ? { tur: 'oku', id: 't', baslik: 'Metin', metin: ['Bir iki üç.'], sorular: [1, 2, 3, 4].map((n) => ({ soru: `Soru ${n}`, secenekler: ['doğru', 'x', 'y', 'z'] })) }
    : { tur: 'dinle', id: 'd', baslik: 'Kayıt', ses: { metin: 'One two three.' }, metin: 'One two three.', sorular: [1, 2, 3, 4].map((n) => ({ soru: `Soru ${n}`, secenekler: ['doğru', 'x', 'y', 'z'] })) }],
});
const okuma = [2, 6, 10, 14, 18, 22, 26, 30, 36, 42, 48, 55, 62, 70, 80].map((sv) => yazili('okuma', sv));
const dinleme = [3, 7, 11, 15, 19, 23, 27, 31, 37, 43, 49, 56, 63, 71].map((sv) => yazili('dinleme', sv));
const hafizaHavuzu = Array.from({ length: 120 }, (_, i) => `esya${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + Math.floor(i / 26))}xyz`);
const hareketler = ['sandalye', 'duvar-sinav', 'kalca-kopru', 'cekis-prova', 'denge-turu', 'ceviklik-turu'].map((id) => ({ id, ad: id, adimlar: ['bir'], birim: id.endsWith('turu') ? 'tur' : undefined }));

const ic = birlestir([seviyePaketi, { paket: 'x', kelimeler, dersler: [...okuma, ...dinleme], hafizaHavuzu, hareketler, sesler: { varsayilan: 'a' }, haftalar: [{ hafta: 1, gunler: [{ gun: 1, baslik: 'g', hedef: 'h', gorevler: [] }] }], seviyeli: { baslangicGunu: 8, desen: [[{ oturum: 'ingilizce' }, { oturum: 'spor' }]] } }]);
const idx = indeksle(ic);
const kural = kuralKur(ic);
const ctx = () => ctxOlustur(ic, idx);
const taze = () => ({ olaylar: [], srs: {}, dersler: {} });
const B = (durum, bugun = '2026-05-01') => ({ ic, idx, durum, kural, bugun });

let sayac = 0;
function olayEkle(durum, tur, veri, g = '2026-05-01') {
  sayac++;
  durum.olaylar.push({ i: 'e' + sayac, t: `${g}T10:${String(sayac % 60).padStart(2, '0')}:${String(Math.floor(sayac / 60)).padStart(2, '0')}.000Z`, g, tur, ...veri });
}

test('puanliSoruSayisi: dinle/oku/sahne soruları + soru adımları', () => {
  assert.equal(puanliSoruSayisi(okuma[0]), 4);
  assert.equal(puanliSoruSayisi({ adimlar: [{ tur: 'soru' }, { tur: 'anlat' }, { tur: 'sahne', sorular: [{}, {}] }] }), 3);
});

test('İngilizce yoklaması: 7 soru, hedef çevresinden, mcq’lara "Bilmiyorum", belirleyici', () => {
  const d = taze();
  const h = hazirla(B(d), { iz: 'ingilizce', tur: 'yoklama' });
  assert.ok(!h.yok, JSON.stringify(h));
  assert.equal(h.sv, 5); // ilk basamak
  const s = sayfalar(h, ctx());
  assert.equal(s.length, 7);
  for (const p of s) {
    assert.ok(['mcq', 'yaz'].includes(p.t));
    assert.equal(p.puan, true);
    if (p.t === 'mcq') {
      assert.equal(p.secenekler.at(-1).m, 'Bilmiyorum');
      assert.equal(p.secenekler.filter((o) => o.dogru).length, 1);
      assert.equal(p.secenekler[p.dogru].dogru, true);
    }
  }
  assert.ok(Math.abs(h.etkinSv - 5) <= 2, `etkin ${h.etkinSv}`);
  assert.equal(JSON.stringify(sayfalar(hazirla(B(d), { iz: 'ingilizce', tur: 'yoklama' }), ctx())), JSON.stringify(s)); // belirleyici
  const o = olayVerisi(h, { dogru: 6, toplam: 7 }, kural);
  assert.equal(o.tur, 'yerlestirme');
  assert.deepEqual([o.veri.iz, o.veri.dogru, o.veri.toplam, o.veri.sv], ['ingilizce', 6, 7, h.etkinSv]);
});

test('İngilizce oturumu: seviye penceresinden 5 yeni kelime, görülenler tekrar edilmez, kontrol sorusu eski kelimelerden', () => {
  const d = taze();
  const sv0 = seviyeler(d.olaylar, kural)['ingilizce'].sv; // 1
  assert.equal(sv0, 1);
  olayEkle(d, 'seviye-ayar', { iz: 'ingilizce', sv: 12, neden: 'test' });
  const h = hazirla(B(d), { iz: 'ingilizce', tur: 'oturum' });
  assert.ok(!h.yok, JSON.stringify(h));
  assert.equal(h.sv, 12);
  assert.equal(h.yeniKelimeler.length, 5);
  for (const id of h.yeniKelimeler) { const k = idx.kelime.get(id); assert.ok(k.sv >= 11 && k.sv <= 14, `${id} sv ${k.sv}`); }
  const s = sayfalar(h, ctx());
  assert.ok(s.some((p) => p.t === 'kelime'));
  assert.ok(s.filter((p) => p.puan && p.t === 'mcq').length >= 5);
  // yeni kelimeler öğrenildi sayılsın → ikinci oturum başka kelimeler getirir, kontrol sorusu çıkar
  for (const id of h.yeniKelimeler) d.srs['k:' + id] = { k: 0, s: '2026-05-04', ogr: '2026-05-01', son: '2026-05-01' };
  const h2 = hazirla(B(d, '2026-05-02'), { iz: 'ingilizce', tur: 'oturum' });
  assert.equal(h2.yeniKelimeler.filter((id) => h.yeniKelimeler.includes(id)).length, 0);
  const s2 = sayfalar(h2, ctx());
  assert.ok(s2.some((p) => p.bolum === BOLUM.kontrol), 'hatırlama kontrolü yok');
  assert.ok(s2.some((p) => p.t === 'dikte'));
});

test('okuma/dinleme yoklaması: yalnız (geçilen, başarısız) aralığından, sorulmuş metin tekrar gelmez', () => {
  const d = taze();
  let h = hazirla(B(d), { iz: 'okuma', tur: 'yoklama' });
  assert.ok(!h.yok, JSON.stringify(h));
  assert.equal(h.dersId, 'okuma-6'); // hedef 5: en yakın 6 (2 daha uzak)
  olayEkle(d, 'yerlestirme', { iz: 'okuma', sv: 6, dogru: 4, toplam: 4, ders: h.dersId });
  h = hazirla(B(d), { iz: 'okuma', tur: 'yoklama' });
  assert.equal(h.dersId, 'okuma-10'); // basamak 10, geçilen 6'nın üstünde
  olayEkle(d, 'yerlestirme', { iz: 'okuma', sv: 10, dogru: 4, toplam: 4, ders: h.dersId });
  h = hazirla(B(d), { iz: 'okuma', tur: 'yoklama' });
  assert.equal(h.dersId, 'okuma-18'); // basamak 20: 18 (−2) ile 22 (+2) eşit uzaklıkta; üst yön hafif cezalı, alt yön tercih edilir
  olayEkle(d, 'yerlestirme', { iz: 'okuma', sv: h.etkinSv, dogru: 1, toplam: 4, ders: h.dersId }); // başarısız
  h = hazirla(B(d), { iz: 'okuma', tur: 'yoklama' }); // aralık (10, 18): yalnız 14
  assert.equal(h.dersId, 'okuma-14');
  const s = sayfalar(h, ctx());
  assert.ok(s.filter((p) => p.t === 'mcq').every((p) => p.secenekler.at(-1).m === 'Bilmiyorum'));
  assert.ok(!s.some((p) => p.t === 'serbest'));
});

test('aralıkta içerik yok → "araliksiz"; kapatma olayı yerleştirmeyi o noktada bitirir', () => {
  const d = taze();
  olayEkle(d, 'yerlestirme', { iz: 'okuma', sv: 6, dogru: 4, toplam: 4, ders: 'okuma-6' });
  olayEkle(d, 'yerlestirme', { iz: 'okuma', sv: 10, dogru: 0, toplam: 4, ders: 'okuma-10' }); // aralık (6, 10): içerik yok
  const h = hazirla(B(d), { iz: 'okuma', tur: 'yoklama' });
  assert.equal(h.yok, 'araliksiz');
  const k = yerlestirmeKapatOlayi('okuma', h.ayrinti);
  olayEkle(d, k.tur, k.veri);
  const s = seviyeler(d.olaylar, kural)['okuma'];
  assert.equal(s.yerlestirme.bitti, true);
  assert.equal(s.yerlestirme.gecen, 6);
  assert.equal(s.sv, 5); // 6 × 0.8 → 5
  assert.equal(hazirla(B(d), { iz: 'okuma', tur: 'yoklama' }).yok, 'yoklamaBitti');
});

test('okuma oturumu: pencere içindeki bitmemiş en yakın metin; yoksa en eski bitmiş olan', () => {
  const d = taze();
  olayEkle(d, 'seviye-ayar', { iz: 'okuma', sv: 20, neden: 'test' });
  let h = hazirla(B(d), { iz: 'okuma', tur: 'oturum' });
  assert.equal(h.dersId, 'okuma-18'); // 20 → 18 (−2) ile 22 (+2, üst yön cezalı): 18
  assert.equal(h.yazili, true);
  d.dersler['okuma-18'] = { bitti: true, son: '2026-05-01' };
  h = hazirla(B(d), { iz: 'okuma', tur: 'oturum' });
  assert.equal(h.dersId, 'okuma-22');
  for (const sv of [14, 22, 26, 30]) d.dersler[`okuma-${sv}`] = { bitti: true, son: `2026-05-0${sv % 9 || 1}` };
  d.dersler['okuma-18'].son = '2026-04-01';
  h = hazirla(B(d), { iz: 'okuma', tur: 'oturum' });
  assert.equal(h.tekrar, true);
  assert.equal(h.dersId, 'okuma-18'); // en eskisi
});

test('yeterli içerik yoksa: "icerik" nedeni ve açıklama (çökmez)', () => {
  const d = taze();
  olayEkle(d, 'seviye-ayar', { iz: 'okuma', sv: 95, neden: 'test' });
  const h = hazirla(B(d), { iz: 'okuma', tur: 'oturum' });
  assert.equal(h.yok, 'icerik');
  assert.match(h.ayrinti, /95/);
  const kucuk = { ...ic, hafizaHavuzu: ['a', 'b'] };
  olayEkle(d, 'seviye-ayar', { iz: 'hafiza', sv: 10, neden: 'test' });
  assert.equal(hazirla({ ...B(d), ic: kucuk }, { iz: 'hafiza', tur: 'oturum' }).yok, 'icerik');
});

test('hafıza: liste uzunluğu seviye tablosundan; toplama soruları puansız; hatırlama sıralı puan', () => {
  const d = taze();
  olayEkle(d, 'seviye-ayar', { iz: 'hafiza', sv: 25, neden: 'test' });
  const h = hazirla(B(d), { iz: 'hafiza', tur: 'oturum' });
  assert.ok(!h.yok, JSON.stringify(h));
  assert.equal(h.liste.length, 11); // tablo: 25 → 11
  assert.equal(new Set(h.liste).size, 11);
  const s = sayfalar(h, ctx());
  const dikkat = s.filter((p) => p.bolum === BOLUM.dikkat);
  assert.equal(dikkat.length, 4);
  assert.ok(dikkat.every((p) => p.puan === false && p.secenekler.filter((o) => o.dogru).length === 1));
  assert.equal(s[0].t, 'liste-sun');
  const son = s.at(-1);
  assert.equal(son.t, 'liste-hatirla');
  assert.equal(son.siraliPuan, true);
  assert.deepEqual(son.liste, h.liste);
  assert.ok(s.indexOf(son) > s.indexOf(dikkat.at(-1)) && s.indexOf(dikkat[0]) > 0, 'dikkat dağıtma liste ile hatırlama arasında olmalı');
});

test('hafıza yoklaması aynı kurucudan, "tekrar edilmez"; ardışık oturum farklı liste', () => {
  const d = taze();
  const a = hazirla(B(d), { iz: 'hafiza', tur: 'yoklama' });
  assert.equal(a.sv, 5);
  assert.equal(a.liste.length, 4);
  olayEkle(d, 'yerlestirme', { iz: 'hafiza', sv: 5, dogru: 4, toplam: 4 });
  const b = hazirla(B(d), { iz: 'hafiza', tur: 'yoklama' });
  assert.notDeepEqual(a.liste, b.liste);
  assert.equal(b.sv, 10);
});

test('spor: seviye planı hareketlere çevrilir; sonuç zorlanmaya göre', () => {
  const d = taze();
  const h = hazirla(B(d), { iz: 'spor', tur: 'oturum' });
  assert.ok(!h.yok, JSON.stringify(h));
  assert.equal(h.sv, 1);
  const s = sayfalar(h, ctx());
  assert.equal(s.length, 1);
  assert.equal(s[0].t, 'spor');
  const guc = s[0].adim.bolumler.find((b) => b.ad === 'Güç ve teknik');
  assert.equal(guc.hareketler.length, 4);
  assert.ok(guc.hareketler.every((m) => m.adimlar?.length && m.set === 1));
  // yerleştirme yok → yoklama açılamaz
  assert.equal(hazirla(B(d), { iz: 'spor', tur: 'yoklama' }).yok, 'yoklamaYok');
  const tam = olayVerisi(h, { spor: { kismi: false, zorlanma: 4 } }, kural);
  assert.equal(tam.veri.sonuc, 'tam');
  assert.equal(olayVerisi(h, { spor: { kismi: false, zorlanma: 8 } }, kural).veri.sonuc, 'iyi');
  assert.equal(olayVerisi(h, { spor: { kismi: true, zorlanma: 3 } }, kural).veri.sonuc, 'zayif');
  assert.equal(olayVerisi(h, { spor: { kismi: false, zorlanma: 9 } }, kural).veri.sonuc, 'zayif');
  assert.equal(olayVerisi(h, { spor: null }, kural).veri.sonuc, 'iyi'); // zorlanma işaretlenmediyse yükseltme yok
});

test('spor: 2 tam oturum üst üste → seviye +1; sonuç kartı seriyi anlatır', () => {
  const d = taze();
  const sonuclar = [];
  for (let n = 0; n < 2; n++) {
    const once = seviyeler(d.olaylar, kural)['spor'];
    const h = hazirla(B(d, `2026-05-0${n + 1}`), { iz: 'spor', tur: 'oturum' });
    const o = olayVerisi(h, { spor: { kismi: false, zorlanma: 3 } }, kural);
    olayEkle(d, o.tur, o.veri, `2026-05-0${n + 1}`);
    const sonra = seviyeler(d.olaylar, kural)['spor'];
    sonuclar.push(sonucMetni(h, once, sonra, kural, o.veri));
  }
  assert.equal(sonuclar[0].tur, 'seri');
  assert.equal(sonuclar[1].tur, 'yukari');
  assert.match(sonuclar[1].baslik, /1 → 2/);
});

/** Bir beceriyi "yetenek" düzeyindeki öğrenci olarak yerleştirir: yetenekten kolay yoklamalar tam, zor olanlar çok yanlış. */
function yerlestir(iz, yetenek) {
  const d = taze();
  let n = 0;
  for (; n < 12; n++) {
    const s = seviyeler(d.olaylar, kural, { programGunu: n + 1 })[iz];
    if (!s.yoklamaBekliyor) break;
    const h = hazirla({ ...B(d, `2026-05-${String(n + 1).padStart(2, '0')}`), programGunu: n + 1 }, { iz, tur: 'yoklama' });
    if (h.yok === 'araliksiz') { const k = yerlestirmeKapatOlayi(iz, h.ayrinti); olayEkle(d, k.tur, k.veri, `2026-05-${String(n + 1).padStart(2, '0')}`); break; }
    assert.ok(!h.yok, `${iz} ${yetenek}: ${JSON.stringify(h)}`);
    const toplam = iz === 'hafiza' ? h.liste.length : 7;
    const o = olayVerisi(h, h.etkinSv <= yetenek ? { dogru: toplam, toplam } : { dogru: Math.floor(toplam / 3), toplam }, kural);
    olayEkle(d, o.tur, o.veri, `2026-05-${String(n + 1).padStart(2, '0')}`);
  }
  return { sv: seviyeler(d.olaylar, kural)[iz], yoklama: n };
}

test('yerleştirme simülasyonu: her beceride ≤ 7 yoklama, başlangıç yeteneğin biraz altında', () => {
  for (const iz of ['ingilizce', 'okuma', 'dinleme', 'hafiza']) {
    for (const yetenek of [0, 3, 12, 27, 44, 70]) {
      const { sv, yoklama } = yerlestir(iz, yetenek);
      assert.ok(yoklama <= 7, `${iz} ${yetenek}: ${yoklama} yoklama`);
      assert.ok(sv.yerlestirme.bitti, `${iz} ${yetenek} bitmedi`);
      assert.ok(sv.sv >= 1 && sv.sv <= 50, `${iz} ${yetenek}: sv ${sv.sv}`);
      if (yetenek >= 10) assert.ok(sv.sv <= yetenek + 1, `${iz} ${yetenek} → ${sv.sv}: yetenekten yüksek başlamamalı`);
      if (yetenek >= 10 && yetenek <= 50) assert.ok(sv.sv >= yetenek * 0.4, `${iz} ${yetenek} → ${sv.sv}: çok düşük`);
    }
  }
});

test('gunPlani: yerleştirme haftasında yoklamalar, 8. günden itibaren seviyeli oturumlar', () => {
  const d = taze();
  const k = (no) => gunPlani({ no, ic, idx, durum: d, kural, bugun: '2026-05-01' });
  const p1 = k(1);
  const yoklamalar = p1.gorevler.filter((g) => g.tur === 'yoklama');
  assert.deepEqual(yoklamalar.map((g) => g.iz).sort(), ['dinleme', 'hafiza', 'ingilizce', 'okuma']);
  assert.ok(yoklamalar.every((g) => !g.bitti && g.hedefSv === 5));
  assert.equal(p1.tur, 'yazili');
  const p8 = k(8);
  assert.equal(p8.tur, 'seviyeli');
  assert.ok(p8.gorevler.some((g) => g.tur === 'oturum' && g.iz === 'ingilizce'));
  assert.ok(p8.gorevler.some((g) => g.tur === 'oturum' && g.iz === 'spor'));
  assert.ok(!p8.gorevler.some((g) => g.tur === 'yoklama'));
});

test('sonuç kartı: yoklama bitti / devam, oturum aynı / zayıf', () => {
  const d = taze();
  const once = seviyeler(d.olaylar, kural)['ingilizce'];
  const h = hazirla(B(d), { iz: 'ingilizce', tur: 'yoklama' });
  const o = olayVerisi(h, { dogru: 7, toplam: 7 }, kural);
  olayEkle(d, o.tur, o.veri);
  const sonra = seviyeler(d.olaylar, kural)['ingilizce'];
  const m = sonucMetni(h, once, sonra, kural, o.veri);
  assert.equal(m.tur, 'yoklama-devam');
  assert.match(m.satirlar.join(' '), /geçildi/);
  assert.match(m.satirlar.join(' '), /10\. seviye/);
});
