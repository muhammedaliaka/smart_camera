// Süre tahmini, kalibrasyon, odak kesimi ve +5 dakika önerisi (js/sure.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { sayfaSn, sayfalarSn, kalibrasyon, odakKesimi, odakOnerisi, odakSuresi, bugunOdakDk, dakika, SAYFA_SN } from '../../js/sure.js';

const sure = (g, sn, tahmin = 600) => ({ tur: 'sure', g, sn, tahmin });

test('sayfa süresi: bilinen türler tablodan, bilinmeyen 20 sn, liste-hatırlama liste uzunluğuyla büyür', () => {
  assert.equal(sayfaSn({ t: 'mcq' }), SAYFA_SN.mcq);
  assert.equal(sayfaSn({ t: 'bilinmeyen-tur' }), 20);
  assert.ok(sayfaSn({ t: 'liste-hatirla', liste: Array(10).fill('x') }) > sayfaSn({ t: 'liste-hatirla', liste: Array(4).fill('x') }));
  assert.equal(sayfalarSn([{ t: 'mcq' }, { t: 'mcq' }, { t: 'yaz' }]), 2 * SAYFA_SN.mcq + SAYFA_SN.yaz);
  assert.equal(sayfalarSn(null), 0);
  assert.equal(dakika(10), 1); assert.equal(dakika(150), 3); assert.equal(dakika(0), 1);
});

test('kalibrasyon: 3 ölçümden azsa 1; ortanca oran; 0,6–2 sınırı; geçersiz ölçümler sayılmaz', () => {
  assert.equal(kalibrasyon([]), 1);
  assert.equal(kalibrasyon([sure('2026-11-02', 900), sure('2026-11-03', 900)]), 1, 'yalnız iki ölçüm');
  const yavas = [sure('2026-11-02', 900), sure('2026-11-03', 900), sure('2026-11-04', 900)]; // 1,5 kat
  assert.equal(kalibrasyon(yavas), 1.5);
  assert.equal(kalibrasyon(Array(5).fill(sure('2026-11-02', 6000))), 2, 'en çok 2 kat');
  assert.equal(kalibrasyon(Array(5).fill(sure('2026-11-02', 100))), 0.6, 'en az 0,6');
  const gecersiz = [{ tur: 'sure', g: 'x', sn: 5, tahmin: 600 }, { tur: 'sure', g: 'x', sn: 9000, tahmin: 600 }, { tur: 'sure', g: 'x', sn: 600, tahmin: null }, { tur: 'ders-bitir', sn: 600, tahmin: 600 }];
  assert.equal(kalibrasyon(gecersiz), 1, 'çok kısa, çok uzun, tahminsiz ve başka türden kayıtlar yok sayılır');
  assert.equal(kalibrasyon([sure('a', 300), sure('b', 600), sure('c', 6000)]), 1, 'aykırı büyük değer ortancayı bozmaz');
});

test('odak kesimi: odak süresine sığanlar "şimdi", fazlası "mola sonrası"; ilk görev her zaman şimdi', () => {
  const G = (ad, dk, ek = {}) => ({ ad, dk, ...ek });
  const k = odakKesimi([G('a', 12), G('b', 12), G('c', 12)], 30);
  assert.deepEqual(k.simdi.map((g) => g.ad), ['a', 'b']);
  assert.deepEqual(k.sonra.map((g) => g.ad), ['c']);
  assert.equal(k.simdiDk, 24); assert.equal(k.sonraDk, 12);
  const uzun = odakKesimi([G('a', 60), G('b', 5)], 30);
  assert.deepEqual(uzun.simdi.map((g) => g.ad), ['a'], 'tek görev odak süresinden uzun olsa da ilk görev şimdidir');
  assert.deepEqual(uzun.sonra.map((g) => g.ad), ['b']);
  const tolerans = odakKesimi([G('a', 15), G('b', 17)], 30); // 32 dk = 30 + 3 dk toleransın içinde
  assert.equal(tolerans.sonra.length, 0);
  const sinirda = odakKesimi([G('a', 15), G('b', 19)], 30); // 34 dk > 33
  assert.equal(sinirda.sonra.length, 1);
});

test('odak kesimi: spor odağa sayılmaz (hareket), isteğe bağlılar bonus; kalan süre bitenleri düşer', () => {
  const k = odakKesimi([
    { ad: 'a', dk: 10, bitti: true }, { ad: 'spor', dk: 10, odak: false }, { ad: 'b', dk: 10 },
    { ad: 'c', dk: 10 }, { ad: 'bonus', dk: 8, istege: true }, { ad: 'd', dk: 10 },
  ], 30);
  assert.deepEqual(k.hareket.map((g) => g.ad), ['spor']);
  assert.deepEqual(k.bonus.map((g) => g.ad), ['bonus']);
  assert.deepEqual(k.simdi.map((g) => g.ad), ['a', 'b', 'c'], 'spor 10 dk odak süresinden düşmedi');
  assert.deepEqual(k.sonra.map((g) => g.ad), ['d']);
  assert.equal(k.kalanDk, 10 + 10 + 10, 'biten "a" kalandan düşer; b, c ve mola sonrası d kalır');
});

test('odak süresi ayarı: geçerli aralıkta olanı verir, değilse 30', () => {
  assert.equal(odakSuresi({ odakDk: 45 }), 45);
  assert.equal(odakSuresi({ odakDk: 5 }), 30);
  assert.equal(odakSuresi({ odakDk: 90 }), 30);
  assert.equal(odakSuresi({}), 30);
  assert.equal(odakSuresi(undefined), 30);
});

test('+5 dakika önerisi: son üç etkin günde odak süresinin ≥%85’i çalışıldıysa; kısa ya da seyrek çalışmada yok', () => {
  const dolu = (g) => sure(g, 28 * 60);
  const U = (extra = {}) => odakOnerisi({ olaylar: [dolu('2026-11-02'), dolu('2026-11-03'), dolu('2026-11-05')], odakDk: 30, bugun: '2026-11-06', ayar: {}, ...extra });
  assert.equal(U()?.yeni, 35, 'üç etkin gün (aralarda boş gün olsa da) dolduysa öner');
  assert.equal(U({ odakDk: 50 }), null, 'en çok 50');
  assert.equal(U({ olaylar: [dolu('2026-11-03'), dolu('2026-11-05')] }), null, 'iki gün yetmez');
  assert.equal(U({ olaylar: [dolu('2026-11-02'), sure('2026-11-03', 20 * 60), dolu('2026-11-05')] }), null, 'bir gün %85’in altında (20/30 dk)');
  assert.equal(U({ olaylar: [dolu('2026-11-02'), dolu('2026-11-03'), dolu('2026-11-05'), sure('2026-11-06', 100)] })?.yeni, 35, 'bugünün kayıtları sayılmaz');
  assert.equal(U({ ayar: { odakErtele: '2026-11-10' } }), null, '“şimdi değil” bir hafta susturur');
  assert.equal(U({ ayar: { odakErtele: '2026-11-04' } })?.yeni, 35, 'erteleme süresi dolduysa tekrar sorulur');
  assert.equal(U({ ayar: { odakDegisim: '2026-11-03' } }), null, 'son değişikliğin üzerinden bir hafta geçmedi');
  assert.equal(U({ olaylar: [dolu('2026-10-01'), dolu('2026-10-02'), dolu('2026-10-03')] }), null, 'eski günler (10 günden eski) sayılmaz');
  assert.equal(U({ odakDk: 40 })?.yeni, undefined, '40 dk için 28 dk yetmez (≥34 gerekir)');
  const iki = odakOnerisi({ olaylar: [dolu('2026-11-02'), { tur: 'sure', g: '2026-11-02', sn: 600 }, dolu('2026-11-03'), dolu('2026-11-05')], odakDk: 30, bugun: '2026-11-06', ayar: {} });
  assert.equal(iki.yeni, 35, 'aynı günün kayıtları toplanır');
});

test('bugünün odak süresi: yalnız bugünkü kayıtlar, spor sayılmaz', () => {
  const o = [sure('2026-11-06', 600), { ...sure('2026-11-06', 1200), iz: 'spor' }, sure('2026-11-05', 900), { tur: 'ders-bitir', g: '2026-11-06', sn: 99999 }];
  assert.equal(bugunOdakDk(o, '2026-11-06'), 10);
  assert.equal(bugunOdakDk([], '2026-11-06'), 0);
});

test('+5 önerisi: spor süreleri günün odak toplamına katılmaz', () => {
  const gun = (g) => [sure(g, 10 * 60), { ...sure(g, 40 * 60), iz: 'spor' }];
  const olaylar = [...gun('2026-11-02'), ...gun('2026-11-03'), ...gun('2026-11-05')];
  assert.equal(odakOnerisi({ olaylar, odakDk: 30, bugun: '2026-11-06', ayar: {} }), null, 'oturan çalışma 10 dk; spor 40 dk sayılmamalı');
});
