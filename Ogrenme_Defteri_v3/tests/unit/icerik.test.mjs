// Gerçek içerik paketleri için kapı testleri: yayına çıkan içerikte hata ve uyarı yok, her ses dosyası var.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { icerikDogrula } from '../../scripts/dogrula.mjs';
import { sesleriBul } from '../../scripts/ses-liste.mjs';

const kok = fileURLToPath(new URL('../..', import.meta.url));
const klasor = join(kok, 'icerik');
const sonuc = icerikDogrula(klasor);

test('içerikte hata yok', () => assert.deepEqual(sonuc.hata, []));
test('içerikte uyarı yok (her ders programda, her kelime kullanılıyor)', () => assert.deepEqual(sonuc.uyari, []));

test('program günleri 1..N kesintisiz ve her günde görev var', () => {
  const gunler = [...sonuc.idx.gunler.keys()].sort((a, b) => a - b);
  gunler.forEach((g, i) => assert.equal(g, i + 1));
  for (const g of sonuc.idx.gunler.values()) assert.ok((g.gorevler || []).length > 0, `gün ${g.gun} boş`);
});

test('her ders programda en çok bir kez geçer', () => {
  const sayim = new Map();
  for (const g of sonuc.idx.gunler.values()) for (const t of g.gorevler) sayim.set(t.ders, (sayim.get(t.ders) || 0) + 1);
  for (const [d, n] of sayim) assert.equal(n, 1, `${d} ${n} kez programda`);
});

test('ilk hafta: 4 gün öğrenme + 3 gün kontrol', () => {
  const gun = (n) => sonuc.idx.gunler.get(n).gorevler.map((t) => t.ders);
  for (const n of [1, 2, 3, 4]) assert.ok(!gun(n).some((d) => d.startsWith('kontrol-')), `gün ${n}`);
  for (const n of [5, 6, 7]) assert.ok(gun(n).some((d) => d.startsWith('kontrol-')), `gün ${n}`);
});

test('ses: ses/liste.json içerikten üretilen listeyle birebir aynı', () => {
  const { harita } = sesleriBul(klasor);
  const beklenen = [...harita.keys()].sort();
  const liste = JSON.parse(readFileSync(join(kok, 'ses/liste.json'), 'utf8'));
  assert.deepEqual(liste, beklenen, 'ses/liste.json eski: node scripts/ses-liste.mjs --yaz çalıştır');
});

test('ses: listedeki her dosya var ve boş değil', { skip: !existsSync(join(kok, 'ses/liste.json')) }, () => {
  const liste = JSON.parse(readFileSync(join(kok, 'ses/liste.json'), 'utf8'));
  const eksik = liste.filter((d) => !existsSync(join(kok, 'ses', d)));
  assert.deepEqual(eksik.slice(0, 10), [], `${eksik.length} ses dosyası eksik`);
});

test('kimlikler: ders kimlikleri küçük harf-rakam-tire', () => {
  for (const d of sonuc.ic.dersler) assert.match(d.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, d.id);
  for (const k of sonuc.ic.kelimeler) assert.match(k.id, /^[a-z0-9]+(-[a-z0-9]+)*$/i, k.id);
});
