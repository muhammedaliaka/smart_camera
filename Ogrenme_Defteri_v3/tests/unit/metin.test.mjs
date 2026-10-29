import test from 'node:test';
import assert from 'node:assert/strict';
import { sayiEn, sayiTr, sadelestir, karsilastir, noktaVar, listeKarsilastir, listeyeAyir, mesafe } from '../../js/metin.js';

test('sayiEn', () => {
  assert.equal(sayiEn(13), 'thirteen');
  assert.equal(sayiEn(30), 'thirty');
  assert.equal(sayiEn(64), 'sixty four');
  assert.equal(sayiEn(100), 'one hundred');
});

test('sayiTr', () => { assert.equal(sayiTr(23), 'yirmi üç'); });

test('sadeleştirme: büyük/küçük harf, noktalama, rakam ve kısaltma', () => {
  assert.equal(sadelestir('Nice to meet you!'), 'nice to meet you');
  assert.equal(sadelestir('I am 16.'), sadelestir('I am sixteen'));
});

test('karşılaştırma: tam, yakın, yok', () => {
  assert.equal(karsilastir('Hello', ['hello']).durum, 'tam');
  assert.equal(karsilastir('thursdey', ['Thursday']).durum, 'yakin'); // tek harflik yazım hatası
  assert.equal(karsilastir('friday', ['Thursday']).durum, 'yok');
  assert.equal(karsilastir('', ['hello']).durum, 'yok');
});

test('13 ile 30 karıştırılmaz', () => {
  assert.equal(karsilastir('13', [String(13), sayiEn(13)]).durum, 'tam');
  assert.equal(karsilastir('30', [String(13), sayiEn(13)]).durum, 'yok');
});

test('Türkçe: c/ç farkı yakın sayılır', () => {
  assert.equal(karsilastir('cay', ['çay'], { tr: true }).durum, 'yakin');
});

test('anahtar nokta: İngilizcede tam sözcük, Türkçede ek alan biçim', () => {
  assert.equal(noktaVar('this is a pen', { ad: 'x', kabul: ['is'] }, { tr: false }), true);
  assert.equal(noktaVar('this pen', { ad: 'x', kabul: ['is'] }, { tr: false }), false); // "this" içinde "is" sayılmaz
  assert.equal(noktaVar('okyanuslarda su var', { ad: 'x', kabul: ['okyanus'] }), true);
});

test('liste karşılaştırma: var olan ve yerindeki öğeler', () => {
  const r = listeKarsilastir(['limon', 'kitap', 'saat'], ['limon', 'saat', 'kitap']);
  assert.equal(r.var, 3);
  assert.equal(r.sirali, 1);
});

test('liste ayırma', () => { assert.deepEqual(listeyeAyir('a, b\nc;d'), ['a', 'b', 'c', 'd']); });
test('düzenleme uzaklığı', () => { assert.equal(mesafe('kitten', 'sitting'), 3); });
