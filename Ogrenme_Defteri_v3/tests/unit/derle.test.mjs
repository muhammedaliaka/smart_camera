import test from 'node:test';
import assert from 'node:assert/strict';
import { derle, listeBul } from '../../js/derle.js';
import { icerikDogrula } from '../../scripts/dogrula.mjs';
import { fileURLToPath } from 'node:url';
import { ctxOlustur } from './yardimci.mjs';

const klasor = fileURLToPath(new URL('../../icerik', import.meta.url));
const { ic, idx } = icerikDogrula(klasor);
const ctx = (d = 0) => ctxOlustur(ic, idx, d);

test('aynı ders + aynı deneme → aynı sayfalar (devam edebilmek için)', () => {
  const d = idx.ders.get('en-02-sayilar');
  assert.equal(JSON.stringify(derle(d, ctx(0)).sayfalar), JSON.stringify(derle(d, ctx(0)).sayfalar));
});

test('farklı denemede alıştırma soruları değişir', () => {
  const d = idx.ders.get('en-02-sayilar');
  assert.notEqual(JSON.stringify(derle(d, ctx(0)).sayfalar), JSON.stringify(derle(d, ctx(1)).sayfalar));
});

test('her çoktan seçmeli sayfada tam olarak bir doğru seçenek var ve anahtar sorunun kaynağıyla aynı', () => {
  let say = 0;
  for (const d of ic.dersler) {
    const { sayfalar } = derle(d, ctx());
    for (const s of sayfalar) {
      if (s.t !== 'mcq') continue;
      say++;
      assert.equal(s.secenekler.filter((o) => o.dogru).length, 1, `${d.id} ${s.id}`);
      assert.equal(s.secenekler[s.dogru].dogru, true, `${d.id} ${s.id}`);
      const metinler = s.secenekler.map((o) => o.m);
      assert.equal(new Set(metinler).size, metinler.length, `${d.id} ${s.id}: tekrarlı seçenek`);
    }
  }
  assert.ok(say > 150, 'çok az soru üretildi: ' + say);
});

test('yazılı soruda doğru cevap = ilk seçenek (tek kaynak)', () => {
  const d = idx.ders.get('oku-02-gokyuzu');
  const oku = d.adimlar.find((a) => a.tur === 'oku');
  const sayfalar = derle(d, ctx()).sayfalar.filter((s) => s.t === 'mcq');
  oku.sorular.forEach((s, i) => assert.equal(sayfalar[i].secenekler[sayfalar[i].dogru].m, s.secenekler[0]));
});

test('okuma soruları metne bakma bağlantısı taşır; kapalı okumada taşımaz', () => {
  const acik = derle(idx.ders.get('oku-01-uzay-suyu'), ctx()).sayfalar.filter((s) => s.t === 'mcq');
  assert.ok(acik.every((s) => Array.isArray(s.metinBak)));
  const kapali = derle(idx.ders.get('kontrol-03-okuma-dinleme'), ctx()).sayfalar.filter((s) => s.t === 'mcq' && s.bolum.startsWith('Okuma:'));
  assert.ok(kapali.length >= 5 && kapali.every((s) => !s.metinBak));
});

test('çapraz liste başvurusu: ders/adım biçimi çözülür', () => {
  const d = idx.ders.get('kontrol-02-hafiza');
  const adim = d.adimlar.find((a) => a.tur === 'liste-hatirla');
  const liste = listeBul(d, adim.ref, ctx());
  assert.ok(liste && liste.liste.length >= 5);
  const sayfa = derle(d, ctx()).sayfalar.find((s) => s.t === 'liste-hatirla');
  assert.deepEqual(sayfa.liste, liste.liste);
});

test('spor kartları kitaplıktan birleşir', () => {
  const sayfa = derle(idx.ders.get('spor-g01'), ctx()).sayfalar.find((s) => s.t === 'spor');
  const m = sayfa.adim.bolumler[1].hareketler[0];
  assert.ok(m.ad && m.adimlar.length >= 3 && m.id);
});

test('sabit sıralı sorular karışmaz', () => {
  const d = { id: 'x', adimlar: [{ tur: 'soru', soru: 'q', secenekler: ['b', 'a', 'c'], sabit: true, dogru: 'a' }] };
  const s = derle(d, ctx()).sayfalar[0];
  assert.deepEqual(s.secenekler.map((o) => o.m), ['b', 'a', 'c']);
  assert.equal(s.dogru, 1);
});

test('uzun kelime sunumu bölünür: ≤7 kelimelik parçalar, her parçadan sonra o parçanın alıştırması; kısa olanlar ve kimlikler korunur', async () => {
  const { kelimeBloklariniBol } = await import('../../js/derle.js');
  const kel = (n) => Array.from({ length: n }, (_, i) => 'k' + i);
  const adimlar = [{ tur: 'anlat', id: 'a1' }, { tur: 'kelime-ogren', id: 'ogren', kelimeler: kel(13) }, { tur: 'alistirma', id: 'al', kelimeler: kel(13), adet: 13 }, { tur: 'soru', id: 's' }];
  const s = kelimeBloklariniBol(adimlar);
  assert.deepEqual(s.map((x) => x.id), ['a1', 'ogren-1', 'al-1', 'ogren-2', 'al-2', 's']);
  assert.deepEqual(s.map((x) => x.tur), ['anlat', 'kelime-ogren', 'alistirma', 'kelime-ogren', 'alistirma', 'soru']);
  assert.ok(s[1].kelimeler.length <= 7 && s[3].kelimeler.length <= 7);
  assert.deepEqual([...s[1].kelimeler, ...s[3].kelimeler], kel(13), 'kelimeler eksiksiz ve sıralı');
  assert.deepEqual(s[2].kelimeler, s[1].kelimeler); assert.deepEqual(s[4].kelimeler, s[3].kelimeler);
  assert.equal(s[2].adet + s[4].adet >= 12 && s[2].adet >= 5, true, 'alıştırma adedi parçalara orantılı paylaşılır');
  // kısa blok değişmez
  const kisa = kelimeBloklariniBol([{ tur: 'kelime-ogren', id: 'o', kelimeler: kel(6) }, { tur: 'alistirma', id: 'a', kelimeler: kel(6), adet: 6 }]);
  assert.deepEqual(kisa.map((x) => x.id), ['o', 'a']);
  // alıştırma farklı kelimeler içeriyorsa dokunma (hatırlama ile sunum eşleşmiyor)
  const farkli = kelimeBloklariniBol([{ tur: 'kelime-ogren', id: 'o', kelimeler: kel(10) }, { tur: 'alistirma', id: 'a', kelimeler: kel(9), adet: 9 }]);
  assert.deepEqual(farkli.map((x) => x.id), ['o', 'a']);
  // kimliksiz adımlar özgün sıra numarasıyla adlandırılır
  assert.equal(kelimeBloklariniBol([{ tur: 'anlat' }, { tur: 'anlat' }])[1].id, 'a2');
});
