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

test('program: açık günler yalnız ilk yoklama haftasındadır; sonrası seviyeli desenle yürür', () => {
  const sd = sonuc.ic.seviyeli;
  assert.ok(sd && sd.baslangicGunu === 1, 'seviyeli desen yok');
  assert.ok(sonuc.idx.acikSonGun <= 7, 'açık günler ilk haftadan uzun');
  assert.equal(sonuc.idx.enSonGun, Infinity, 'seviyeli programın son günü olmaz');
  assert.equal(sd.desen.length, 7, 'desen 7 günlük olmalı');
});

test('desen: her gün İngilizce var; okuma, dinleme, hafıza ve spor haftada en az 2 gün zorunlu', () => {
  const sd = sonuc.ic.seviyeli;
  sd.desen.forEach((gun, i) => assert.ok(gun.some((g) => g.oturum === 'ingilizce' && !g.istege), `gün ${i + 1}: İngilizce yok`));
  for (const iz of ['okuma', 'dinleme', 'hafiza', 'spor']) {
    const gunSayisi = sd.desen.filter((gun) => gun.some((g) => g.oturum === iz && !g.istege)).length;
    assert.ok(gunSayisi >= 2 && gunSayisi <= 4, `${iz}: haftada ${gunSayisi} gün zorunlu`);
  }
  assert.ok(sd.desen.at(-1).every((g) => g.istege || g.oturum === 'ingilizce'), 'son gün hafif olmalı (yalnız İngilizce zorunlu)');
});

test('havuz: her beceride seviye aralığını kapsayan dersler var (okuma ve dinleme 2–70 arası)', () => {
  for (const iz of ['okuma', 'dinleme']) {
    const sv = sonuc.ic.dersler.filter((d) => d.iz === iz && Number.isFinite(d.sv)).map((d) => d.sv).sort((x, y) => x - y);
    assert.ok(sv[0] <= 5, `${iz}: en düşük ders sv ${sv[0]}`);
    assert.ok(sv.at(-1) >= 60, `${iz}: en yüksek ders sv ${sv.at(-1)}`);
    sv.forEach((x, i) => i && assert.ok(x - sv[i - 1] <= 12, `${iz}: sv ${sv[i - 1]} ile ${x} arasında büyük boşluk`));
  }
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
