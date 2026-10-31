// Gerçek içerik + gerçek motor + üretilmiş öğrenci yanıtları: değişmezler (sayıların kendisi değil, kuralların tutması).
// Benzetim: tests/benzetim.mjs. Bu test içerik değişince kırılırsa asıl bilgi şudur: bir kural ya da içerik havuzu beklenmedik davranıyor.
import test from 'node:test';
import assert from 'node:assert/strict';
import { benzet } from '../benzetim.mjs';
import { seviyeler, baslangicSeviyesi } from '../../js/seviye.js';

const IZLER = ['ingilizce', 'okuma', 'dinleme', 'hafiza'];
const yetkin = benzet({ T: { ingilizce: 55, okuma: 40, dinleme: 35, hafiza: 45, spor: 10 }, gunler: 30, tohum: 3 });

test('benzetim (gerçek içerik): yoklama tavanı 50\'yi geçmez, başlangıç geçilen seviyenin %80\'i', () => {
  const { son, kural } = yetkin;
  for (const iz of IZLER) {
    const y = son[iz].yerlestirme;
    assert.equal(y.bitti, true, `${iz}: yerleştirme bitmeli`);
    assert.ok(y.gecen <= kural.yerlestirme.tavan, `${iz}: geçilen ${y.gecen} tavanı aşıyor`);
    assert.equal(y.baslangic, baslangicSeviyesi(y.gecen, kural.yerlestirme));
    assert.ok(y.yoklamalar.length <= kural.yerlestirme.enCokYoklama);
  }
});

test('benzetim (gerçek içerik): hiçbir oturum puansız (sıfır puanlı soruyla) kaydedilmiyor', () => {
  const { kayit } = yetkin;
  assert.deepEqual(Object.keys(kayit.yok).filter((k) => k.endsWith(':puansiz')), [], 'her oturumda en az bir puanlanan soru olmalı');
});

test('benzetim (gerçek içerik): tekrar oturumları seviyeyi değiştirmez; yetkin öğrenci İngilizcede yükselir', () => {
  const { durum, kural } = yetkin;
  const ev = durum.olaylar;
  let tekrarSayisi = 0;
  for (let i = 0; i < ev.length; i++) {
    if (ev[i].tur !== 'seviye-oturum' || !ev[i].tekrar) continue;
    tekrarSayisi++;
    const once = seviyeler(ev.slice(0, i), kural, { programGunu: ev[i].gn })[ev[i].iz].sv;
    const sonra = seviyeler(ev.slice(0, i + 1), kural, { programGunu: ev[i].gn })[ev[i].iz].sv;
    assert.equal(sonra, once, `tekrar oturumu (${ev[i].oturum}) seviyeyi değiştirdi`);
  }
  assert.ok(tekrarSayisi > 0, 'bu profilde okuma/dinleme havuzu 30 günde tükenir; tekrar görülmeli (görülmüyorsa test anlamını yitirdi)');
  assert.ok(yetkin.son.ingilizce.sv > yetkin.son.ingilizce.yerlestirme.baslangic, 'İngilizce: yetkin öğrenci başlangıçtan yükselmeli');
});

test('benzetim (gerçek içerik): yeni başlayan öğrenci en altta kalmaz, tavan dışı seviye üretilmez', () => {
  const { son, kural } = benzet({ T: { ingilizce: 4, okuma: 4, dinleme: 3, hafiza: 5, spor: 2 }, gunler: 25, tohum: 5 });
  for (const iz of IZLER) {
    assert.ok(son[iz].sv >= 1 && son[iz].sv <= 70, `${iz}: seviye ${son[iz].sv} makul aralıkta olmalı`);
    assert.ok(son[iz].yerlestirme.bitti);
    assert.ok(son[iz].yerlestirme.gecen <= kural.yerlestirme.tavan);
  }
  assert.ok(son.ingilizce.sv <= 12, `İngilizce: gerçek seviyesi 4 olan öğrenci 25 günde ${son.ingilizce.sv}'e çıkmamalı (şişirme yok)`);
});
