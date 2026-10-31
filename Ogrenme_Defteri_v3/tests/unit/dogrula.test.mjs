import test from 'node:test';
import assert from 'node:assert/strict';
import { dogrulaPaketler, kelime, ders, var_mi } from './yardimci.mjs';

const iyi = { kelimeler: [kelime('a', 'apple', 'elma'), kelime('b', 'bread', 'ekmek')], dersler: [ders('d1', [{ tur: 'kelime-ogren', kelimeler: ['a', 'b'] }])] };

test('temiz içerik hatasız', () => {
  const r = dogrulaPaketler(iyi);
  assert.deepEqual(r.hata, []);
});

test('aynı İngilizce sözcük iki farklı karşılıkla → hata', () => {
  const r = dogrulaPaketler({ kelimeler: [kelime('a', 'bank', 'banka'), kelime('b', 'Bank', 'kıyı')], dersler: [] });
  assert.ok(var_mi(r.hata, 'iki farklı karşılıkla'));
});

test('derste olmayan kelime kimliği → hata', () => {
  const r = dogrulaPaketler({ kelimeler: [], dersler: [ders('d1', [{ tur: 'kelime-ogren', kelimeler: ['yok'] }])] });
  assert.ok(var_mi(r.hata, '"yok" tanımlı değil'));
});

test('iki pakette aynı ders kimliği → hata', () => {
  const r = dogrulaPaketler(iyi, { dersler: [ders('d1', [])] });
  assert.ok(var_mi(r.hata, 'd1'));
});

test('program günü hafta aralığı dışında → hata', () => {
  const r = dogrulaPaketler({ ...iyi, haftalar: [{ hafta: 1, gunler: [{ gun: 9, gorevler: [{ ders: 'd1' }] }] }] });
  assert.ok(var_mi(r.hata, 'aralığında değil'));
});

test('programda olmayan ders kimliği → hata', () => {
  const r = dogrulaPaketler({ ...iyi, haftalar: [{ hafta: 1, gunler: [{ gun: 1, gorevler: [{ ders: 'yok' }] }] }] });
  assert.ok(r.hata.length > 0);
});

test('çoktan seçmeli: "dogru" yazmak yasak, sabit olmadıkça ilk seçenek doğrudur', () => {
  const soru = { tur: 'soru', soru: 'Hangisi?', secenekler: ['a', 'b'], dogru: 'a' };
  const r = dogrulaPaketler({ dersler: [ders('d1', [soru])] });
  assert.ok(var_mi(r.hata, 'her zaman ilk seçenektir'));
  const sabit = dogrulaPaketler({ dersler: [ders('d1', [{ ...soru, sabit: true }])] });
  assert.equal(sabit.hata.length, 0);
});

test('iki seçenek aynıysa → hata', () => {
  const r = dogrulaPaketler({ dersler: [ders('d1', [{ tur: 'soru', soru: 'x?', secenekler: ['Aynı', 'aynı'] }])] });
  assert.ok(var_mi(r.hata, 'iki seçenek aynı'));
});

test('aynı soru farklı cevapla → uyarı', () => {
  const r = dogrulaPaketler({ dersler: [ders('d1', [{ tur: 'soru', soru: 'Hangi gün?', secenekler: ['Salı', 'Cuma'] }]), ders('d2', [{ tur: 'soru', soru: 'Hangi gün?', secenekler: ['Cuma', 'Salı'] }])] });
  assert.ok(var_mi(r.uyari, 'aynı soru metni'));
});

test('liste-hatirla: tanımsız rota → hata; aynı derste ve başka dersteki liste çözülür', () => {
  const liste = ders('l1', [{ tur: 'liste-sun', id: 'a', liste: ['x', 'y', 'z'] }, { tur: 'saray-kur', id: 'ev', ad: 'Ev' }]);
  const kotu = ders('k1', [{ tur: 'liste-hatirla', ref: 'l1/a', saray: 'okul' }]);
  assert.ok(var_mi(dogrulaPaketler({ dersler: [liste, kotu] }).hata, 'rota "okul"'));
  const iyiRef = ders('k2', [{ tur: 'liste-hatirla', ref: 'l1/a', saray: 'ev' }]);
  assert.deepEqual(dogrulaPaketler({ dersler: [liste, iyiRef] }).hata, []);
  const yokRef = ders('k3', [{ tur: 'liste-hatirla', ref: 'l1/yok', saray: 'ev' }]);
  assert.ok(var_mi(dogrulaPaketler({ dersler: [liste, yokRef] }).hata, 'eşleşen liste-sun'));
});

test('gecikmeli-kur yalnız aynı dersteki listeye bağlanır', () => {
  const liste = ders('l1', [{ tur: 'liste-sun', id: 'a', liste: ['x', 'y', 'z'] }]);
  const g = ders('g1', [{ tur: 'gecikmeli-kur', ref: 'l1/a', kontroller: ['1gun'], soru: 'x?' }]);
  assert.ok(var_mi(dogrulaPaketler({ dersler: [liste, g] }).hata, 'aynı dersteki'));
});

test('spor: kitaplıkta olmayan hareket → hata; kullanılmayan hareket → uyarı', () => {
  const spor = (ref) => ders('s1', [{ tur: 'spor', bolumler: [{ ad: 'B', hareketler: [{ ref, set: 1, tekrar: '5' }] }] }], { iz: 'spor' });
  const hareket = { id: 'sq', ad: 'Squat', adimlar: ['dur'] };
  assert.ok(var_mi(dogrulaPaketler({ hareketler: [hareket], dersler: [spor('yok')] }).hata, '"yok" kitaplıkta yok'));
  assert.equal(dogrulaPaketler({ hareketler: [hareket], dersler: [spor('sq')] }).hata.length, 0);
  assert.ok(var_mi(dogrulaPaketler({ hareketler: [hareket], dersler: [] }).uyari, 'hiçbir spor dersinde'));
});

test('dış uygulama tanımsızsa → hata', () => {
  const r = dogrulaPaketler({ dersler: [ders('d1', [{ tur: 'dis', uygulama: 'yok' }])] });
  assert.ok(var_mi(r.hata, 'tanımlı değil'));
});

test('bilinmeyen adım türü → hata', () => {
  const r = dogrulaPaketler({ dersler: [ders('d1', [{ tur: 'uydurma' }])] });
  assert.ok(var_mi(r.hata, 'bilinmeyen adım türü'));
});

test('oku: sorusu olmayan okuma uyarı verir', () => {
  const r = dogrulaPaketler({ dersler: [ders('d1', [{ tur: 'oku', id: 'o', baslik: 'B', metin: ['Metin.'] }])] });
  assert.ok(r.uyari.length > 0);
});
