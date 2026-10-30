// Serbest alan: kelime seçimi, mekân avı listesi, tur kaydı (js/alan.js) ve bankadaki yer kelimeleri.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kelimeSec, avKelimeleri, turKaydi, artikelli, YERLER } from '../../js/alan.js';
import { icerikDogrula } from '../../scripts/dogrula.mjs';

const K = (id, sv) => ({ id, en: id, tr: id + '-tr', ...(sv != null ? { sv } : {}) });
const kelimeler = [K('a', 1), K('b', 5), K('c', 10), K('d', 15), K('e', 20), K('f', 30)];

test('kelime seçimi: önce vadesi gelenler (en eski vade önce), sonra en uzun süredir görülmeyenler', () => {
  const srs = {
    'k:a': { s: '2026-11-05', son: '2026-11-02' }, 'k:b': { s: '2026-11-03', son: '2026-11-01' },
    'k:c': { s: '2026-12-01', son: '2026-10-20' }, 'k:d': { s: '2026-12-01', son: '2026-10-25' },
    'k:e': { bitti: true, s: null, son: '2026-09-01' },
  };
  const s = kelimeSec({ srs, kelimeler, bugun: '2026-11-06', n: 4 }).map((k) => k.id);
  assert.deepEqual(s, ['b', 'a', 'e', 'c'], 'vadesi gelenler b (3 Kas), a (5 Kas); sonra en eski görülen e, c');
});

test('kelime seçimi: öğrenilmiş yetmezse seviyeye en yakın yeni kelimeler; aynı kelime iki kez gelmez', () => {
  const srs = { 'k:a': { s: '2026-11-01', son: '2026-10-29' } };
  const s = kelimeSec({ srs, kelimeler, bugun: '2026-11-06', hedefSv: 14, n: 4 }).map((k) => k.id);
  assert.deepEqual(s, ['a', 'd', 'c', 'e'], 'a öğrenilmiş; yeniler sv 14’e yakınlık sırasıyla d(15), c(10), e(20)');
  assert.equal(new Set(s).size, s.length);
  assert.deepEqual(kelimeSec({ srs: {}, kelimeler: [], bugun: '2026-11-06', n: 5 }), []);
  assert.equal(kelimeSec({ srs: {}, kelimeler: [{ id: 'x', en: 'x', tr: 'y' }], bugun: '2026-11-06', n: 3 }).length, 0, 'sv’si olmayan kelime yeni aday sayılmaz');
});

test('mekân avı: bankada olan yer kelimeleri, yerin sırasıyla, en çok n', () => {
  const bank = new Map(['tree', 'bench', 'rain', 'desk'].map((id) => [id, K(id, 1)]));
  const kb = (id) => bank.get(id);
  assert.deepEqual(avKelimeleri({ yer: 'park', kelimeBul: kb, n: 8 }).map((k) => k.id), ['tree', 'bench', 'rain']);
  assert.deepEqual(avKelimeleri({ yer: 'calisma', kelimeBul: kb }).map((k) => k.id), ['desk']);
  assert.deepEqual(avKelimeleri({ yer: 'park', kelimeBul: kb, n: 2 }).map((k) => k.id), ['tree', 'bench']);
  assert.deepEqual(avKelimeleri({ yer: 'yok', kelimeBul: kb }), []);
});

test('tur kaydı: oturum anahtarı, kendi bildirimi işareti, süre yuvarlanır, eksikler yalnız varsa', () => {
  const k = turKaydi({ etkinlik: 'saray', yer: 'park', kip: 'yalniz', dogru: 4, toplam: 6, sn: 301.6, eksikler: ['tree'] });
  assert.equal(k.ders, 'alan:saray:park'); assert.equal(k.sn, 302); assert.equal(k.kendiBildirimi, true); assert.deepEqual(k.eksikler, ['tree']);
  assert.equal('eksikler' in turKaydi({ etkinlik: 'av', yer: 'calisma', kip: 'sessiz', dogru: 8, toplam: 8, sn: 60 }), false);
});

test('artikel: sesli harfte an, sayılamayanda yok', () => {
  assert.equal(artikelli('tree'), 'a tree'); assert.equal(artikelli('umbrella'), 'an umbrella'); assert.equal(artikelli('rain'), 'rain');
});

test('gerçek içerik: her yerde en az 8 avlanabilir kelime var ve park kelimeleri bankada', () => {
  const { ic } = icerikDogrula(new URL('../../icerik', import.meta.url).pathname);
  const id = new Map(ic.kelimeler.map((k) => [k.id, k]));
  for (const y of Object.keys(YERLER)) {
    const liste = avKelimeleri({ yer: y, kelimeBul: (x) => id.get(x), n: 99 });
    assert.ok(liste.length >= 8, `${y}: yalnız ${liste.length} kelime`);
  }
  for (const w of ['umbrella', 'puddle', 'leaf', 'bench', 'fountain', 'path']) assert.ok(id.has(w), `${w} bankada yok`);
});
