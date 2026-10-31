import test from 'node:test';
import assert from 'node:assert/strict';
import { ARALIK, yeniMadde, cevapla, vadesiGeldi, nominalGunler, ozet } from '../../js/srs.js';

test('aralıklar 3-10-20-50 gün', () => assert.deepEqual(ARALIK, [3, 10, 20, 50]));

test('yeni madde öğrenmeden 3 gün sonra vadesi gelir', () => {
  const m = yeniMadde('2026-11-02');
  assert.equal(m.s, '2026-11-05');
  assert.equal(vadesiGeldi(m, '2026-11-04'), false);
  assert.equal(vadesiGeldi(m, '2026-11-05'), true);
});

test('doğru yanıt kutuyu ilerletir, aralık gerçekleşen tarihten sayılır', () => {
  let m = yeniMadde('2026-11-02');
  m = cevapla(m, true, '2026-11-08'); // 3 yerine 6. gün (geç) cevaplandı
  assert.equal(m.k, 1);
  assert.equal(m.s, '2026-11-18'); // 8 Kasım + 10
});

test('yanlış yanıt kutuyu korur, ertesi gün yeniden sorulur', () => {
  let m = cevapla(yeniMadde('2026-11-02'), true, '2026-11-05');
  const k = m.k;
  m = cevapla(m, false, '2026-11-15');
  assert.equal(m.k, k);
  assert.equal(m.s, '2026-11-16');
  assert.equal(m.y, 1);
});

test('dördüncü doğru yanıttan sonra madde biter', () => {
  let m = yeniMadde('2026-01-01');
  for (let i = 0; i < 4; i++) m = cevapla(m, true, m.s);
  assert.equal(m.bitti, true);
  assert.equal(m.s, null);
  assert.equal(vadesiGeldi(m, '2030-01-01'), false);
});

test('cevapla girdi nesnesini değiştirmez', () => {
  const m = yeniMadde('2026-11-02');
  const kopya = JSON.stringify(m);
  cevapla(m, true, '2026-11-05');
  assert.equal(JSON.stringify(m), kopya);
});

test('nominal günler +3, +13, +33, +83', () => {
  assert.deepEqual(nominalGunler('2026-11-02'), ['2026-11-05', '2026-11-15', '2026-12-05', '2027-01-24']);
});

test('özet vadesi gelen, yarın ve bu hafta sayar', () => {
  const srs = { a: { s: '2026-11-02', bitti: false }, b: { s: '2026-11-03', bitti: false }, c: { s: '2026-11-07', bitti: false }, d: { s: null, bitti: true } };
  assert.deepEqual(ozet(srs, '2026-11-02'), { toplam: 4, bitti: 1, vadesi: 1, yarin: 1, hafta: 1 });
});
