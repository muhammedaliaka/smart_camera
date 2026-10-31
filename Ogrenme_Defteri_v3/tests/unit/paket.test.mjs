import test from 'node:test';
import assert from 'node:assert/strict';
import { birlestir, indeksle } from '../../js/paket.js';

const p1 = { paket: 'a', kelimeler: [{ id: 'x', en: 'x', tr: 'x' }], dersler: [{ id: 'd1', adimlar: [] }] };

test('aynı kimlik iki pakette → çakışma', () => {
  const ic = birlestir([p1, { paket: 'b', dersler: [{ id: 'd1', adimlar: [] }] }]);
  assert.equal(ic.cakismalar.length, 1);
  assert.match(ic.cakismalar[0], /d1/);
});

test('degistir:true çakışma sayılmaz ve öğeyi değiştirir', () => {
  const ic = birlestir([p1, { paket: 'b', dersler: [{ id: 'd1', baslik: 'yeni', degistir: true, adimlar: [] }] }]);
  assert.equal(ic.cakismalar.length, 0);
  assert.equal(ic.dersler.find((d) => d.id === 'd1').baslik, 'yeni');
});

test('kimliksiz öğe çakışma olarak raporlanır', () => {
  const ic = birlestir([{ paket: 'a', kelimeler: [{ en: 'a', tr: 'b' }] }]);
  assert.equal(ic.cakismalar.length, 1);
});

test('aynı güne başka paketten görev eklenebilir', () => {
  const ic = birlestir([
    { paket: 'a', haftalar: [{ hafta: 1, gunler: [{ gun: 1, gorevler: [{ ders: 'a' }] }] }] },
    { paket: 'b', haftalar: [{ hafta: 1, gunler: [{ gun: 1, gorevler: [{ ders: 'b' }] }, { gun: 2, gorevler: [{ ders: 'c' }] }] }] },
  ]);
  assert.deepEqual(ic.haftalar[0].gunler[0].gorevler.map((g) => g.ders), ['a', 'b']);
  assert.equal(ic.haftalar[0].gunler.length, 2);
});

test('indeks: ders → program günü', () => {
  const ic = birlestir([{ paket: 'a', dersler: [{ id: 'd1', adimlar: [] }], haftalar: [{ hafta: 1, gunler: [{ gun: 3, gorevler: [{ ders: 'd1' }] }] }] }]);
  const idx = indeksle(ic);
  assert.equal(idx.dersGunu.get('d1'), 3);
  assert.equal(idx.enSonGun, 3);
});

test('ses ayarları paketlerden birleşir', () => {
  const ic = birlestir([{ paket: 'a', sesler: { varsayilan: 'erkek', konusmacilar: { Ece: 'kadin' } } }, { paket: 'b', sesler: { konusmacilar: { Sam: 'erkek' } } }]);
  assert.equal(ic.sesler.varsayilan, 'erkek');
  assert.deepEqual(ic.sesler.konusmacilar, { Ece: 'kadin', Sam: 'erkek' });
});
