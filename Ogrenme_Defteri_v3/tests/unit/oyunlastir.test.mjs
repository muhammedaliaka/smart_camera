import test from 'node:test';
import assert from 'node:assert/strict';
import { rutbe, RUTBELER, xpHesapla, esnekSeri, haftaBasi, haftaOzeti, haftaHedefi, istatistik, rozetDurumu, rozetleriIsle, ROZETLER, komboGuncelle, komboMetni, komboTakdiri, etkinGunler } from '../../js/oyunlastir.js';
import { gunEkle } from '../../js/zaman.js';

let sayi = 0;
const o = (g, tur, veri = {}) => ({ i: 'e' + ++sayi, t: `${g}T10:00:${String(sayi % 60).padStart(2, '0')}.000Z`, g, tur, ...veri });
const gunSet = (...gunler) => new Set(gunler);

test('rütbe: eşikler, sıradaki rütbe ve ilerleme oranı', () => {
  assert.equal(rutbe(0).ad, 'Filiz');
  assert.equal(rutbe(249).ad, 'Filiz');
  assert.equal(rutbe(250).ad, 'Fidan');
  const r = rutbe(475);
  assert.equal(r.ad, 'Fidan'); assert.equal(r.sonraki.ad, 'Genç Ağaç'); assert.equal(r.kalan, 700 - 475);
  assert.ok(Math.abs(r.oran - (475 - 250) / (700 - 250)) < 1e-9);
  const son = rutbe(99999);
  assert.equal(son.ad, RUTBELER.at(-1).ad); assert.equal(son.sonraki, null); assert.equal(son.oran, 1);
  assert.deepEqual(RUTBELER.map((x) => x.xp), [...RUTBELER.map((x) => x.xp)].sort((a, b) => a - b), 'eşikler artan olmalı');
});

test('XP: ders ilk kez 15–25, tekrar 5; seviye oturumu 20–30, tekrar oturumu 8, spor tam 25 / kısmi 15', () => {
  const x = (olaylar) => xpHesapla(olaylar).toplam;
  assert.equal(x([o('2026-11-02', 'ders-bitir', { ders: 'a', dogru: 10, toplam: 10, yuzde: 100 })]), 25);
  assert.equal(x([o('2026-11-02', 'ders-bitir', { ders: 'a', dogru: 0, toplam: 10, yuzde: 0 })]), 15);
  assert.equal(x([o('2026-11-02', 'ders-bitir', { ders: 'a', yuzde: 100 }), o('2026-11-03', 'ders-bitir', { ders: 'a', yuzde: 100 })]), 25 + 5, 'aynı dersi yeniden bitirmek az puan verir');
  assert.equal(x([o('2026-11-02', 'seviye-oturum', { iz: 'okuma', dogru: 5, toplam: 10 })]), 25);
  assert.equal(x([o('2026-11-02', 'seviye-oturum', { iz: 'okuma', dogru: 5, toplam: 10, tekrar: true })]), 8);
  assert.equal(x([o('2026-11-02', 'seviye-oturum', { iz: 'spor', sonuc: 'tam' })]), 25);
  assert.equal(x([o('2026-11-02', 'seviye-oturum', { iz: 'spor', sonuc: 'kismi' })]), 15);
  assert.equal(x([o('2026-11-02', 'yerlestirme', { iz: 'okuma', dogru: 3, toplam: 6 })]), 12);
  assert.equal(x([o('2026-11-02', 'soru', { dogru: true })]), 0, 'tek tek soru XP vermez (ders bitirme verir)');
});

test('XP: sınırlar — alan turu günde en çok 2, tekrar sistemi günde en çok 30, yanlış tekrar yanıtı 0', () => {
  const g = '2026-11-02';
  const turlar = Array.from({ length: 5 }, () => o(g, 'alan-tur', { etkinlik: 'saray', yer: 'park' }));
  assert.equal(xpHesapla(turlar).toplam, 24);
  const srs = Array.from({ length: 50 }, () => o(g, 'srs', { dogru: true }));
  assert.equal(xpHesapla(srs).toplam, 30);
  assert.equal(xpHesapla([o(g, 'srs', { dogru: false })]).toplam, 0);
  assert.equal(xpHesapla([o(g, 'gecikmeli-yanit', { dogru: true }), o(g, 'gecikmeli-yanit', { dogru: false })]).toplam, 4);
  const r = xpHesapla([o(g, 'oyun', { yuzde: 100 }), o('2026-11-03', 'oyun', { yuzde: 0 })]);
  assert.equal(r.toplam, 12 + 6); assert.deepEqual(r.gunluk, { [g]: 12, '2026-11-03': 6 });
});

test('XP: sıralama olayların dizilişinden bağımsız (ilk bitiren tam puanı alır)', () => {
  const a = o('2026-11-02', 'ders-bitir', { ders: 'a', yuzde: 100 }), b = o('2026-11-03', 'ders-bitir', { ders: 'a', yuzde: 100 });
  assert.equal(xpHesapla([b, a]).toplam, xpHesapla([a, b]).toplam);
});

test('esnek seri: kesintisiz günler sayılır, bugün henüz çalışılmadıysa seri bozulmaz', () => {
  const b = '2026-11-10';
  assert.equal(esnekSeri(gunSet(), b), 0);
  assert.equal(esnekSeri(gunSet(b), b), 1);
  assert.equal(esnekSeri(gunSet('2026-11-09', '2026-11-08'), b), 2, 'bugün yapılmadı → dünden say');
  assert.equal(esnekSeri(gunSet(b, '2026-11-09', '2026-11-08', '2026-11-07'), b), 4);
});

test('esnek seri: 7 günde bir gün ara vermek bozmaz (sayılmaz); iki gün üst üste ara bozar; ikinci ara 7 gün içinde bozar', () => {
  const b = '2026-11-10';
  // 6 çalışılan gün, tek boşluk (11-07)
  const tek = gunSet('2026-11-10', '2026-11-09', '2026-11-08', '2026-11-06', '2026-11-05', '2026-11-04');
  assert.equal(esnekSeri(tek, b), 6);
  // iki gün üst üste boşluk
  const iki = gunSet('2026-11-10', '2026-11-09', '2026-11-08', '2026-11-05', '2026-11-04');
  assert.equal(esnekSeri(iki, b), 3);
  // 7 gün içinde ikinci boşluk (11-07 ve 11-04): ikincisi seriyi keser
  const ikinci = gunSet('2026-11-10', '2026-11-09', '2026-11-08', '2026-11-06', '2026-11-05', '2026-11-03', '2026-11-02');
  assert.equal(esnekSeri(ikinci, b), 5);
  // 7 gün geçtikten sonra yeni boşluk serbest
  const uzun = new Set(); for (let i = 0; i < 20; i++) if (i !== 3 && i !== 12) uzun.add(gunEkle(b, -i));
  assert.equal(esnekSeri(uzun, b), 18);
});

test('hafta: Pazartesi başlangıçlı; özet etkin günleri, hedefi ve ulaşılabilirliği verir', () => {
  assert.equal(haftaBasi('2026-11-02'), '2026-11-02'); // Pazartesi
  assert.equal(haftaBasi('2026-11-08'), '2026-11-02'); // Pazar
  assert.equal(haftaBasi('2026-11-04'), '2026-11-02'); // Çarşamba
  const gunler = gunSet('2026-11-02', '2026-11-03');
  const h = haftaOzeti(gunler, '2026-11-04', 4);
  assert.equal(h.gunler.length, 7); assert.equal(h.n, 2); assert.equal(h.hedef, 4);
  assert.equal(h.kalanGun, 5, 'çarşamba (bugün, yapılmadı) + 4 gün'); assert.equal(h.ulasilabilir, true); assert.equal(h.tamam, false);
  assert.deepEqual(h.gunler.map((x) => x.bugun), [false, false, true, false, false, false, false]);
  const gec = haftaOzeti(gunSet('2026-11-02'), '2026-11-08', 4); // pazar, yalnız 1 gün yapılmış
  assert.equal(gec.ulasilabilir, false); assert.equal(gec.kalanGun, 1);
  assert.equal(haftaOzeti(gunSet('2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05'), '2026-11-05', 4).tamam, true);
});

test('hafta hedefi: ayardan okunur, 2–7 dışı ya da bozuk değer varsayılana döner', () => {
  assert.equal(haftaHedefi({}), 4); assert.equal(haftaHedefi(undefined), 4);
  assert.equal(haftaHedefi({ haftaHedef: 6 }), 6); assert.equal(haftaHedefi({ haftaHedef: 1 }), 4);
  assert.equal(haftaHedefi({ haftaHedef: 9 }), 4); assert.equal(haftaHedefi({ haftaHedef: 'x' }), 4);
});

test('etkin gün: yalnız etkinlik olayları; sure/seviye-ayar/rapor gibi olaylar günü etkin yapmaz', () => {
  const g = etkinGunler([o('2026-11-02', 'sure', { sn: 600 }), o('2026-11-03', 'seviye-ayar', {}), o('2026-11-04', 'srs', { dogru: true }), o('2026-11-05', 'alan-tur', {})]);
  assert.deepEqual([...g].sort(), ['2026-11-04', '2026-11-05']);
});

test('rozetler: tanımlar tutarlı (benzersiz kimlik, emoji, hedef > 0) ve sıfır istatistikte hiçbiri kazanılmaz', () => {
  assert.equal(new Set(ROZETLER.map((r) => r.id)).size, ROZETLER.length);
  assert.equal(new Set(ROZETLER.map((r) => r.emoji)).size, ROZETLER.length, 'emojiler farklı olmalı');
  for (const r of ROZETLER) { assert.ok(r.hedef > 0 && r.ad && r.aciklama, r.id); }
  const bos = rozetDurumu(istatistik([]));
  assert.ok(bos.every((r) => !r.kazandi && r.n === 0));
});

test('rozetler: istatistikten kazanma — seri, hafta, kelime, spor, alan, çeşit, tam puan, geri dönüş, süre', () => {
  const g = (i) => gunEkle('2026-11-02', i);
  const olaylar = [];
  for (let i = 0; i < 7; i++) olaylar.push(o(g(i), 'ders-bitir', { ders: 'd' + i, dogru: 9, toplam: 9, yuzde: 100 }));
  olaylar.push(o(g(0), 'seviye-oturum', { iz: 'spor', sonuc: 'tam' }), o(g(1), 'seviye-oturum', { iz: 'okuma', dogru: 4, toplam: 5 }), o(g(2), 'seviye-oturum', { iz: 'dinleme', dogru: 4, toplam: 5 }), o(g(3), 'seviye-oturum', { iz: 'hafiza', dogru: 4, toplam: 5 }));
  olaylar.push(o(g(1), 'alan-tur', { etkinlik: 'saray', yer: 'park' }), o(g(2), 'alan-tur', { etkinlik: 'av', yer: 'calisma' }));
  olaylar.push(o(g(3), 'sure', { sn: 2700 }));
  const d = Object.fromEntries(rozetDurumu(istatistik(olaylar, { kelimeSayisi: 30 })).map((r) => [r.id, r]));
  for (const id of ['ilk-adim', 'uc-gun', 'saglam-hafta', 'bir-hafta', 'kelime-25', 'hareket', 'saray', 'iki-yer', 'cok-yonlu', 'tam-puan', 'kirk-dk']) assert.equal(d[id].kazandi, true, id);
  for (const id of ['otuz-gun', 'kelime-100', 'hareketli-bes', 'oyuncu', 'aklimda', 'elli-dk', 'geri-donus']) assert.equal(d[id].kazandi, false, id);
  assert.equal(d['kelime-100'].n, 30, 'kilitli rozette ilerleme (30/100)');
  // geri dönüş: 4+ gün sonra ilk etkin gün
  const ara = [o('2026-11-02', 'srs', { dogru: true }), o('2026-11-06', 'srs', { dogru: true })];
  assert.equal(rozetDurumu(istatistik(ara)).find((r) => r.id === 'geri-donus').kazandi, true);
  assert.equal(rozetDurumu(istatistik([o('2026-11-02', 'srs', {}), o('2026-11-05', 'srs', {})])).find((r) => r.id === 'geri-donus').kazandi, false, '2 gün ara yetmez');
});

test('rozetleriIsle: yeni kazanılanlar gorulen:false ile eklenir, bir kez kazanılan geri alınmaz, ikinci çağrıda yeni yok', () => {
  const s = istatistik([o('2026-11-02', 'ders-bitir', { ders: 'a', yuzde: 100 })]);
  const a = rozetleriIsle(s, {}, '2026-11-02');
  assert.deepEqual(a.yeni.map((r) => r.id), ['ilk-adim']);
  assert.deepEqual(a.kayit['ilk-adim'], { g: '2026-11-02', gorulen: false });
  const b = rozetleriIsle(s, a.kayit, '2026-11-03');
  assert.equal(b.yeni.length, 0); assert.equal(b.kayit['ilk-adim'].g, '2026-11-02');
  // olaylar sadeleşse/silinse bile kazanılan rozet kalır
  const c = rozetleriIsle(istatistik([]), a.kayit, '2026-11-09');
  assert.ok(c.kayit['ilk-adim']);
});

test('kombo: doğruda artar, yanlışta sıfırlanır, ikinci deneme (tekrar) etkilemez; metin 3 ve üstünde görünür', () => {
  let k = 0;
  for (let i = 0; i < 4; i++) k = komboGuncelle(k, { ilk: true, dogru: true });
  assert.equal(k, 4);
  assert.equal(komboGuncelle(k, { ilk: false, dogru: false }), 4);
  assert.equal(komboGuncelle(k, { ilk: false, dogru: true }), 4);
  assert.equal(komboGuncelle(k, { ilk: true, dogru: false }), 0);
  assert.equal(komboMetni(2), ''); assert.equal(komboMetni(3), '🔥 3'); assert.equal(komboMetni(12), '🔥 12');
  assert.equal(komboTakdiri(5), 'Alev aldın!'); assert.equal(komboTakdiri(4), '');
});
