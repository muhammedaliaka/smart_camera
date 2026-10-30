import test from 'node:test';
import assert from 'node:assert/strict';
import { kuralKur, yoklamaGecti, yerlestirme, sonrakiHedef, baslangicSeviyesi, oturumSonucu, seviyeler, hafizaPlani, sporPlani, cefrYaklasim, basamakDeger } from '../../js/seviye.js';
import { readFileSync } from 'node:fs';

const paket = JSON.parse(readFileSync(new URL('../../icerik/seviye.json', import.meta.url), 'utf8'));
const K = kuralKur({ seviye: paket.seviye });

let sayac = 0;
const gun = (n) => `2026-11-${String(n).padStart(2, '0')}`;
const yok = (iz, sv, dogru, toplam, n = 1) => ({ i: 'y' + ++sayac, tur: 'yerlestirme', iz, sv, dogru, toplam, g: gun(n), t: `${gun(n)}T10:00:00.000Z` });
const otu = (iz, dogru, toplam, n = 10, ek = {}) => ({ i: 'o' + ++sayac, tur: 'seviye-oturum', iz, sv: 0, dogru, toplam, g: gun(n), t: `${gun(n)}T1${sayac % 10}:00:00.000Z`, ...ek });
const ayar = (iz, sv, n = 12) => ({ i: 'a' + ++sayac, tur: 'seviye-ayar', iz, sv, g: gun(n), t: `${gun(n)}T09:00:00.000Z` });

test('kurallar JSON dosyasından gelir ve tavan 50, ilk basamak 5', () => {
  assert.deepEqual(K.yerlestirme.basamaklar, [5, 10, 20, 35, 50]);
  assert.equal(K.yerlestirme.tavan, 50);
  assert.equal(Math.max(...K.yerlestirme.basamaklar), K.yerlestirme.tavan, 'hiçbir yoklama basamağı tavanı geçmemeli');
  assert.equal(K.izler.spor.yerlestirme, false);
});

test('yoklama geçme ölçütü: %80 ve en az bir soru', () => {
  assert.equal(yoklamaGecti(6, 7, K), true);
  assert.equal(yoklamaGecti(5, 7, K), false);
  assert.equal(yoklamaGecti(4, 5, K), true);
  assert.equal(yoklamaGecti(3, 4, K), false);
  assert.equal(yoklamaGecti(0, 0, K), false);
});

test('yerleştirme: her yoklama geçilirse 5 → 10 → 20 → 35 → 50 ve 50\'de biter (tavan)', () => {
  const ev = [];
  let y = yerlestirme(ev, 'ingilizce', K);
  assert.equal(y.sonraki, 5);
  const gidis = [];
  let n = 1;
  while (!y.bitti && n < 10) { gidis.push(y.sonraki); ev.push(yok('ingilizce', y.sonraki, 7, 7, n++)); y = yerlestirme(ev, 'ingilizce', K); }
  assert.deepEqual(gidis, [5, 10, 20, 35, 50]);
  assert.equal(y.bitti, true); assert.equal(y.tavanGecti, true); assert.equal(y.gecen, 50);
  assert.equal(y.baslangic, 40, '50 × 0,8');
  assert.ok(gidis.every((s) => s <= 50), 'yoklama hiçbir zaman 50\'yi geçmez');
});

test('yerleştirme: başarısız yoklamadan sonra iki seviye arası ikiye bölünür', () => {
  const ev = [yok('okuma', 5, 7, 7, 1), yok('okuma', 10, 4, 7, 2)];
  let y = yerlestirme(ev, 'okuma', K);
  assert.equal(y.gecen, 5); assert.equal(y.kalan, 10); assert.equal(y.sonraki, 8, 'orta nokta (5+10)/2 → 8');
  ev.push(yok('okuma', 8, 7, 7, 3));
  y = yerlestirme(ev, 'okuma', K);
  assert.equal(y.bitti, true, '10 − 8 = 2 ≤ çözünürlük');
  assert.equal(y.gecen, 8);
  assert.equal(y.baslangic, 6, '8 × 0,8 yuvarlanır');
});

test('yerleştirme: ilk yoklama (5) geçilemezse aşağı aranır ve en alttan başlanır', () => {
  const ev = [yok('dinleme', 5, 2, 7, 1)];
  let y = yerlestirme(ev, 'dinleme', K);
  assert.equal(y.sonraki, 3);
  ev.push(yok('dinleme', 3, 7, 7, 2));
  y = yerlestirme(ev, 'dinleme', K);
  assert.equal(y.bitti, true, '5 − 3 = 2');
  assert.equal(y.baslangic, 2);
  const sifir = yerlestirme([yok('dinleme', 5, 1, 7, 1), yok('dinleme', 3, 0, 7, 2), yok('dinleme', 2, 0, 7, 3)], 'dinleme', K);
  assert.equal(sifir.bitti, true);
  assert.equal(sifir.gecen, 0);
  assert.equal(sifir.baslangic, 1, 'hiçbir şey geçilmediyse seviye 1');
});

test('yerleştirme: sonraki hedef daima geçilen ile kalan arasındadır ve sonlanır', () => {
  for (let g = 0; g < 50; g++) for (let k = g + 3; k <= 50; k++) {
    const h = sonrakiHedef(g, k, K.yerlestirme);
    assert.ok(h > g && h < k, `g=${g} k=${k} h=${h}`);
  }
  // en kötü durumda bile en çok 7 yoklamada biter
  let ev = [], sayi = 0;
  for (let hedefGercek = 1; hedefGercek <= 100; hedefGercek++) {
    ev = []; sayi = 0;
    let y = yerlestirme(ev, 'ingilizce', K);
    while (!y.bitti && sayi < 20) { ev.push(yok('ingilizce', y.sonraki, y.sonraki <= hedefGercek ? 7 : 2, 7, 1 + (sayi++ % 28))); y = yerlestirme(ev, 'ingilizce', K); }
    assert.ok(y.bitti && sayi <= K.yerlestirme.enCokYoklama, `gerçek ${hedefGercek}: ${sayi} yoklama`);
    assert.ok(Math.abs(y.gecen - Math.min(hedefGercek, 50)) <= K.yerlestirme.cozunurluk + 1 || y.gecen === 0, `gerçek ${hedefGercek} → bulunan ${y.gecen} (en kötü durumda 7 yoklama sınırı yüzünden ±3)`);
  }
});

test('yerleştirme bittikten sonra gelen yoklamalar sayılmaz; yerleştirme günleri geçince yarım kalan kapatılır', () => {
  const ev = [yok('ingilizce', 5, 7, 7, 1), yok('ingilizce', 10, 0, 7, 2), yok('ingilizce', 8, 7, 7, 3), yok('ingilizce', 9, 7, 7, 4)];
  assert.equal(yerlestirme(ev, 'ingilizce', K).gecen, 8, '9 yoklaması bittikten sonra geldi');
  const yarim = [yok('hafiza', 5, 7, 7, 1), yok('hafiza', 10, 7, 7, 2)];
  assert.equal(yerlestirme(yarim, 'hafiza', K).bitti, false);
  const kapali = yerlestirme(yarim, 'hafiza', K, { gunAsildi: true });
  assert.equal(kapali.bitti, true); assert.equal(kapali.gecen, 10); assert.equal(kapali.baslangic, 8);
});

test('oturum sonucu: tam, iyi, zayıf', () => {
  assert.equal(oturumSonucu({ dogru: 10, toplam: 10 }, 'ingilizce', K), 'tam');
  assert.equal(oturumSonucu({ dogru: 4, toplam: 4 }, 'ingilizce', K), 'iyi', 'en az 5 soru yoksa yükselme yok');
  assert.equal(oturumSonucu({ dogru: 9, toplam: 10 }, 'ingilizce', K), 'iyi');
  assert.equal(oturumSonucu({ dogru: 5, toplam: 10 }, 'ingilizce', K), 'zayif');
  assert.equal(oturumSonucu({ dogru: 1, toplam: 1 }, 'spor', K), 'tam', 'spor için en az 1');
  assert.equal(oturumSonucu({ dogru: 1, toplam: 1, sonuc: 'iyi' }, 'spor', K), 'iyi', 'açık sonuç oranı ezer');
  assert.equal(oturumSonucu({ dogru: 0, toplam: 0 }, 'ingilizce', K), null);
});

function yerlesmis(iz, gecen) { // iz için yerleştirmeyi bitirmiş olay listesi
  const a = [yok(iz, 5, 7, 7, 1)];
  if (gecen >= 10) a.push(yok(iz, 10, 7, 7, 2));
  return [...a, yok(iz, gecen + 3 > 50 ? 50 : gecen + 3, 0, 7, 3), ...(gecen >= 10 ? [] : [])];
}

test('seviye: yerleştirme sonrası tam doğru +1, %60 altı iki kez −1, arası aynı', () => {
  const ev = [yok('ingilizce', 5, 7, 7, 1), yok('ingilizce', 10, 7, 7, 2), yok('ingilizce', 20, 2, 7, 3), yok('ingilizce', 15, 7, 7, 4)];
  // gecen 15, kalan 20 → 20−15=5>2 → 17 ya da 18 gerekir; yerleştirme sürüyor
  assert.equal(seviyeler(ev, K).ingilizce.yoklamaBekliyor, true);
  const bitis = [...ev, yok('ingilizce', 18, 7, 7, 5)]; // 18 geçildi, 20−18=2 → biter
  let s = seviyeler(bitis, K).ingilizce;
  assert.equal(s.yerlestirme.bitti, true);
  assert.equal(s.yerlestirme.gecen, 18);
  assert.equal(s.sv, 14, '18 × 0,8 = 14,4 → 14');
  assert.equal(s.kaynak, 'yerlestirme');
  s = seviyeler([...bitis, otu('ingilizce', 10, 10, 8)], K).ingilizce;
  assert.equal(s.sv, 15);
  s = seviyeler([...bitis, otu('ingilizce', 9, 10, 8)], K).ingilizce;
  assert.equal(s.sv, 14);
  s = seviyeler([...bitis, otu('ingilizce', 3, 10, 8), otu('ingilizce', 4, 10, 9)], K).ingilizce;
  assert.equal(s.sv, 13, 'iki zayıf oturum → −1');
  s = seviyeler([...bitis, otu('ingilizce', 3, 10, 8), otu('ingilizce', 8, 10, 9), otu('ingilizce', 3, 10, 10)], K).ingilizce;
  assert.equal(s.sv, 14, 'araya iyi oturum girerse düşüş sayacı sıfırlanır');
  assert.equal(s.gecmis.at(-1).neden.startsWith('yerleştirme'), true);
});

test('seviye: yerleştirme bitmeden yapılan oturum sayılmaz', () => {
  const ev = [yok('okuma', 5, 7, 7, 1), otu('okuma', 10, 10, 2)];
  const s = seviyeler(ev, K).okuma;
  assert.equal(s.oturum, 0);
  assert.equal(s.yoklamaBekliyor, true);
});

test('seviye: spor için yerleştirme yok, 1\'den başlar ve üst üste 2 tam oturumda yükselir', () => {
  let s = seviyeler([], K).spor;
  assert.equal(s.sv, 1); assert.equal(s.yoklamaBekliyor, false); assert.equal(s.kaynak, 'baslangic');
  s = seviyeler([otu('spor', 1, 1, 8)], K).spor;
  assert.equal(s.sv, 1, 'tek tam oturum yetmez'); assert.equal(s.tamSeri, 1);
  s = seviyeler([otu('spor', 1, 1, 8), otu('spor', 1, 1, 9)], K).spor;
  assert.equal(s.sv, 2);
  s = seviyeler([otu('spor', 1, 1, 8), otu('spor', 1, 1, 9, { sonuc: 'iyi' }), otu('spor', 1, 1, 10)], K).spor;
  assert.equal(s.sv, 1, 'araya iyi (zorlanmış) oturum girerse seri sıfırlanır');
  s = seviyeler([otu('spor', 0, 1, 8), otu('spor', 0, 1, 9)], K).spor;
  assert.equal(s.sv, 1, 'en alttan aşağı inilmez');
});

test('seviye: elle ayar uygulanır ve geçmişe yazılır; en az 1', () => {
  const s = seviyeler([ayar('spor', 7), otu('spor', 1, 1, 13)], K).spor;
  assert.equal(s.sv, 7); assert.equal(s.kaynak, 'ayar');
  assert.ok(s.gecmis.some((g) => g.neden.startsWith('elle ayar')));
  assert.equal(seviyeler([ayar('spor', -4)], K).spor.sv, 1);
});

test('seviye: sıra ve geçmiş zamana göre hesaplanır (olay sırası karışık gelse de)', () => {
  const e1 = [yok('ingilizce', 5, 7, 7, 1), yok('ingilizce', 10, 7, 7, 2), yok('ingilizce', 20, 0, 7, 3), yok('ingilizce', 15, 7, 7, 4), yok('ingilizce', 18, 7, 7, 5)];
  const ek = [otu('ingilizce', 10, 10, 8), otu('ingilizce', 10, 10, 9)];
  const a = seviyeler([...e1, ...ek], K).ingilizce;
  const b = seviyeler([...ek.slice().reverse(), ...e1.slice().reverse()], K).ingilizce;
  assert.equal(a.sv, b.sv);
  assert.equal(a.sv, 14 + 2, '18 geçildi → başlangıç 14, iki tam oturum → 16');
});

test('hafıza planı: üç öğeyle başlar, liste uzunluğu seviyeyle yavaşça artar ve hiç azalmaz', () => {
  assert.equal(hafizaPlani(1, K).uzunluk, 3);
  assert.equal(hafizaPlani(1, K).dikkat, 0);
  let onceki = 0;
  for (let sv = 1; sv <= 100; sv++) {
    const p = hafizaPlani(sv, K);
    assert.ok(p.uzunluk >= onceki, `sv ${sv}`);
    assert.ok(p.uzunluk - onceki <= 4, `sv ${sv}: tek basamakta en çok 4 öğe artar`);
    onceki = p.uzunluk;
  }
  assert.equal(hafizaPlani(50, K).uzunluk, 20);
});

test('spor planı: hacim artar, sınırlar aşılmaz', () => {
  const p1 = sporPlani(1, K), p20 = sporPlani(20, K), p99 = sporPlani(99, K);
  assert.deepEqual([p1.set, p1.tekrar, p1.km], [1, 6, 1.5]);
  assert.ok(p20.km > p1.km && p20.set >= p1.set);
  assert.ok(p99.km <= 5 && p99.set <= 3 && p99.tekrar <= 12 && p99.denge <= 5 && p99.cevik <= 6);
});

test('yardımcılar: başlangıç seviyesi, CEFR yaklaşımı, basamak değeri', () => {
  assert.equal(baslangicSeviyesi(0, K.yerlestirme), 1);
  assert.equal(baslangicSeviyesi(5, K.yerlestirme), 4);
  assert.equal(cefrYaklasim(5), 'A1 başı'); assert.equal(cefrYaklasim(30), 'A2'); assert.equal(cefrYaklasim(70), 'B1');
  assert.equal(basamakDeger([[1, 3], [10, 6]], 9), 3); assert.equal(basamakDeger([[1, 3], [10, 6]], 10), 6);
});
