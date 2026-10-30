// Seviye oturumları ve yoklamaları: seviyeye göre bir "ders" kurar. Saf işlevler; DOM'a ve depoya bağlı değil (testler ve MCP için).
//
//   hazirla(B, { iz, tur, hedefSv })        →  { iz, tur, sv, etkinSv, baslik, ders, ... } | { yok: 'neden', ayrinti }
//   sayfalar(hazir, ctx)                    →  oynatıcıya verilecek sayfa listesi
//   olayVerisi(hazir, sonuc, kural)         →  deftere yazılacak olay { tur, veri }
//   sonucMetni(hazir, once, sonra, kural, veri)  →  sonuç ekranındaki seviye kartı
//
// tur: 'yoklama' (ilk hafta, hedefSv'ye göre) | 'oturum' (gerçek çalışma, seviyene göre)
// B = { ic, idx, durum, kural, bugun }  (durum = depo durumu: olaylar, srs, dersler)
// Kaynaklar: ingilizce → kelime bankası (sv); okuma ve dinleme → seviye (sv) etiketli yazılı dersler;
// hafıza → hafıza havuzundan üretilen liste; spor → seviye tablosundan plan.

import { karistir, tohumlu, yazidanTohum } from './ui.js';
import { derle } from './derle.js';
import { kelimeSorusu } from './uretici.js';
import { hafizaPlani, sporPlani, seviyeler, yoklamaGecti, oturumSonucu, cefrYaklasim } from './seviye.js';
import { havuzDersleri } from './plan.js';

export const BOLUM = { yoklama: 'Seviye yoklaması', yeni: 'Yeni kelimeler', kontrol: 'Hatırlama kontrolü', dikkat: 'Dikkat dağıtma', dikte: 'Dikte' };
const BILMIYORUM = 'Bilmiyorum';
const GUC = ['sandalye', 'duvar-sinav', 'kalca-kopru', 'cekis-prova'];

const ort = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const gorulmus = (durum, k) => !!durum.srs['k:' + k.id];
const yakinlik = (hedef) => (a, b) => Math.abs(a.sv - hedef) - Math.abs(b.sv - hedef) || a.sv - b.sv || a.id.localeCompare(b.id);
const sayi = (B, iz, tur) => B.durum.olaylar.filter((o) => o.iz === iz && o.tur === tur).length;
const km = (x) => String(x).replace('.', ',');

function tohum(B, iz, tur) {
  return `${iz}|${tur}|${B.bugun}|${sayi(B, iz, tur === 'yoklama' ? 'yerlestirme' : 'seviye-oturum')}`;
}

/** Bir dersteki puanlanan soru sayısı: dinle/oku/sahne adımlarının soruları ve soru adımları. */
export function puanliSoruSayisi(d) {
  let n = 0;
  for (const a of d.adimlar || []) {
    if (['dinle', 'oku', 'sahne'].includes(a.tur)) n += (a.sorular || []).length;
    else if (a.tur === 'soru') n++;
  }
  return n;
}

/** Yoklamada yalnız (geçilen, başarısız) aralığındaki içerik bilgi verir; aralığın dışındaki bir soru sonucu değiştirmez. */
const aralikta = (liste, y) => (y ? liste.filter((k) => k.sv > y.gecen && k.sv < (y.kalan ?? Infinity)) : liste);

/** Aralıkta yoklanacak içerik kalmadı: yerleştirme bu noktada kapatılır (kullanıcıya hata değil, "tamamlandı" gösterilir). */
export const yerlestirmeKapatOlayi = (iz, neden) => ({ tur: 'yerlestirme-son', veri: { iz, neden } });

/**
 * girdi: { iz, tur, hedefSv? }. tur 'yoklama' → hedefSv verilmezse yerleştirme durumundaki sıradaki hedef; 'oturum' → beceri seviyesi.
 */
export function hazirla(B, { iz, tur, hedefSv = null }) {
  const durum = seviyeler(B.durum.olaylar, B.kural, { programGunu: B.programGunu ?? null })[iz];
  if (!durum) return { yok: 'beceri', ayrinti: `bilinmeyen beceri: ${iz}` };
  const yoklama = tur === 'yoklama';
  if (yoklama && !durum.yerlestirme) return { yok: 'yoklamaYok', ayrinti: `${durum.ad} için yerleştirme yoklaması yoktur` };
  if (yoklama && durum.yerlestirme.bitti) return { yok: 'yoklamaBitti', ayrinti: `${durum.ad} yerleştirmesi bitti` };
  const hedef = yoklama ? (hedefSv ?? durum.yerlestirme.sonraki) : durum.sv;
  if (!(hedef >= 1)) return { yok: 'hedef', ayrinti: 'hedef seviye yok' };
  const y = yoklama ? { gecen: durum.yerlestirme.gecen, kalan: durum.yerlestirme.kalan } : null;
  let r;
  if (iz === 'ingilizce') r = yoklama ? ingYoklama(B, hedef, y) : ingOturum(B, hedef);
  else if (iz === 'okuma' || iz === 'dinleme') r = dersSec(B, iz, hedef, y);
  else if (iz === 'hafiza') r = hafiza(B, hedef, yoklama);
  else if (iz === 'spor') r = spor(B, hedef);
  else return { yok: 'beceri', ayrinti: `${iz} için oturum kurulamıyor` };
  if (r.yok) return r;
  return { iz, tur, sv: hedef, etkinSv: r.etkinSv ?? hedef, ad: durum.ad, ...r };
}

// ---------------- İngilizce ----------------
function ingYoklama(B, hedef, y) {
  const n = B.kural.yerlestirme.soru;
  const aralik = aralikta(B.ic.kelimeler.filter((k) => Number.isFinite(k.sv)), y);
  if (aralik.length < 5) return { yok: 'araliksiz', ayrinti: `${y.gecen}. ile ${y.kalan ?? 'en üst'}. seviye arasında yoklanacak kelime kalmadı (${aralik.length})` };
  const rng = tohumlu(yazidanTohum(tohum(B, 'ingilizce', 'yoklama')));
  const yakin = [...aralik].sort(yakinlik(hedef)).slice(0, Math.max(n * 2, 10));
  // görülmemiş kelimeler önce: yoklama bir ön-testtir, öğrenilmiş kelime seviyeyi şişirir
  const secim = karistir(yakin, rng).sort((a, b) => Number(gorulmus(B.durum, a)) - Number(gorulmus(B.durum, b))).slice(0, n);
  const turler = ['anlam-sec', 'dinle-sec', 'kelime-sec', 'anlam-sec', 'dinle-sec', 'kelime-sec', 'yaz'];
  const adimlar = secim.map((k, i) => ({ tur: 'kelime-sorusu', id: 'k' + i, kelime: k.id, soruTuru: turler[i % turler.length] }));
  const baslik = `İngilizce · Seviye ${hedef} yoklaması`;
  return {
    baslik, emoji: '🇬🇧', hedef: `${secim.length} kelime sorusu. Bu bir not değil; nereden başlayacağını bulmak için. Bilmediğini "${BILMIYORUM}" diye işaretle.`,
    ders: { id: `sv:ingilizce:yoklama:${hedef}:${B.bugun}:${sayi(B, 'ingilizce', 'yerlestirme')}`, iz: 'ingilizce', baslik, adimlar, uretilen: true },
    etkinSv: Math.round(ort(secim.map((k) => k.sv))), havuz: yakin.map((k) => k.id),
  };
}

function ingOturum(B, sv) {
  const o = B.kural.izler.ingilizce.oturum || {};
  const kelimeler = B.ic.kelimeler.filter((k) => Number.isFinite(k.sv));
  const [a, b] = o.ogrenmePencere || [-1, 2];
  const [h0, h1] = o.hatirlamaPencere || [-8, 0];
  const nYeni = o.yeniKelime || 5;
  let yeni = kelimeler.filter((k) => !gorulmus(B.durum, k) && k.sv >= sv + a && k.sv <= sv + b).sort(yakinlik(sv)).slice(0, nYeni);
  if (yeni.length < 3) { // pencerede az kaldı: altta atlanmış görülmemiş kelimelerle tamamla
    const eksik = kelimeler.filter((k) => !gorulmus(B.durum, k) && k.sv < sv + a && !yeni.includes(k)).sort((x, y) => y.sv - x.sv || x.id.localeCompare(y.id));
    yeni = [...yeni, ...eksik].slice(0, nYeni);
  }
  const yeniIds = new Set(yeni.map((k) => k.id));
  const srs = B.durum.srs;
  const eski = kelimeler.filter((k) => gorulmus(B.durum, k) && !yeniIds.has(k.id) && k.sv >= sv + h0 && k.sv <= sv + h1)
    .sort((x, y) => (srs['k:' + x.id].k - srs['k:' + y.id].k) || String(srs['k:' + x.id].son).localeCompare(String(srs['k:' + y.id].son)) || x.id.localeCompare(y.id))
    .slice(0, o.kontrolSoru || 3);
  if (!yeni.length && !eski.length) return { yok: 'icerik', ayrinti: `${sv}. seviyede yeni kelime kalmadı; içerik eklenince burada görünür` };
  const adimlar = [];
  if (yeni.length) {
    adimlar.push({ tur: 'kelime-ogren', id: 'yeni', kelimeler: yeni.map((k) => k.id) });
    adimlar.push({ tur: 'alistirma', id: 'al', bolum: BOLUM.yeni, kelimeler: yeni.map((k) => k.id), adet: Math.max(6, yeni.length + 1), turler: ['dinle-sec', 'anlam-sec', 'kelime-sec', 'yaz'] });
  }
  if (eski.length) adimlar.push({ tur: 'alistirma', id: 'kt', bolum: BOLUM.kontrol, kelimeler: eski.map((k) => k.id), adet: eski.length, turler: ['kelime-sec', 'yaz', 'anlam-sec'] });
  const dikteKaynak = [...yeni, ...eski].filter((k) => k.ornek?.en).slice(0, o.dikte ?? 1);
  if (dikteKaynak.length) adimlar.push({ tur: 'dikte', id: 'dk', bolum: BOLUM.dikte, dil: 'en', ogeler: dikteKaynak.map((k) => ({ metin: k.ornek.en })) });
  const baslik = `İngilizce · Seviye ${sv} oturumu`;
  return {
    baslik, emoji: '🇬🇧', hedef: `${yeni.length ? `${yeni.length} yeni kelime öğren` : 'Eski kelimeleri hatırla'}${eski.length && yeni.length ? `, ${eski.length} eskisini hatırla` : ''}. Her soru ilk denemede doğruysa seviyen yükselir.`,
    ders: { id: `sv:ingilizce:oturum:${sv}:${B.bugun}:${sayi(B, 'ingilizce', 'seviye-oturum')}`, iz: 'ingilizce', baslik, adimlar, uretilen: true },
    etkinSv: sv, yeniKelimeler: yeni.map((k) => k.id),
  };
}

// ---------------- Okuma ve dinleme: seviye etiketli yazılı dersler ----------------
function dersSec(B, iz, hedef, y) {
  const yoklama = !!y;
  const enAz = B.kural.izler[iz].enAzSoru ?? B.kural.yukselme.enAzSoru;
  const hepsi = havuzDersleri(B.ic, B.idx, iz).filter((d) => puanliSoruSayisi(d) >= enAz);
  const sorulan = new Set(B.durum.olaylar.filter((o) => o.tur === 'yerlestirme' && o.ders).map((o) => o.ders));
  const bitmemis = hepsi.filter((d) => !B.durum.dersler[d.id]?.bitti && !sorulan.has(d.id));
  const [p0, p1] = B.kural.izler[iz].oturum?.pencere || [-6, 3];
  const ad = iz === 'okuma' ? 'Okuma' : 'Dinleme';
  let aday, tekrar = false;
  if (yoklama) { // yoklama: aralığın içinde hedefe en yakın, hiç görülmemiş metin
    aday = aralikta(bitmemis, y);
    if (!aday.length) return { yok: 'araliksiz', ayrinti: `${y.gecen}. ile ${y.kalan ?? 'en üst'}. seviye arasında yoklanacak ${iz === 'okuma' ? 'metin' : 'kayıt'} kalmadı` };
  }
  else {
    aday = bitmemis.filter((d) => d.sv >= hedef + p0 && d.sv <= hedef + p1);
    if (!aday.length) { // yeni içerik kalmadı: penceredeki en eski bitmiş olanı yeniden ver
      aday = hepsi.filter((d) => d.sv >= hedef + p0 && d.sv <= hedef + p1).sort((x, z) => String(B.durum.dersler[x.id]?.son).localeCompare(String(B.durum.dersler[z.id]?.son)) || x.id.localeCompare(z.id));
      tekrar = aday.length > 0;
    }
  }
  if (!aday.length) return { yok: 'icerik', ayrinti: `${hedef}. seviyeye uygun yeni ${iz === 'okuma' ? 'metin' : 'kayıt'} yok; içerik eklenince burada görünür` };
  const sirali = tekrar ? aday : [...aday].sort((x, z) => (Math.abs(x.sv - hedef) + (x.sv > hedef ? 0.5 : 0)) - (Math.abs(z.sv - hedef) + (z.sv > hedef ? 0.5 : 0)) || x.sv - z.sv || x.id.localeCompare(z.id));
  const d = sirali[0];
  return {
    baslik: yoklama ? `${ad} · Seviye ${d.sv} yoklaması` : `${ad} · Seviye ${hedef} oturumu`,
    emoji: d.emoji || (iz === 'okuma' ? '📖' : '🎧'),
    hedef: yoklama ? `Bu bir not değil; nereden başlayacağını bulmak için. Bilmediğini "${BILMIYORUM}" diye işaretle.` : 'Her soru ilk denemede doğruysa seviyen yükselir.',
    ders: d, etkinSv: d.sv, dersId: d.id, tekrar, yazili: true,
  };
}

// ---------------- Hafıza ----------------
function hafiza(B, hedef, yoklama) {
  const plan = hafizaPlani(hedef, B.kural);
  const havuz = B.ic.hafizaHavuzu || [];
  if (havuz.length < plan.uzunluk + 4) return { yok: 'icerik', ayrinti: `hafıza havuzunda ${havuz.length} kelime var; ${plan.uzunluk + 4} gerekir` };
  const rng = tohumlu(yazidanTohum(tohum(B, 'hafiza', yoklama ? 'yoklama' : 'oturum')));
  const liste = karistir(havuz, rng).slice(0, plan.uzunluk);
  const adimlar = [{ tur: 'liste-sun', id: 'liste', baslik: `${plan.uzunluk} kelimelik liste`, liste, dugme: 'Hazırım — gizle', yonerge: 'Kelimeleri sırayla oku; her birini aklında bir yere ya da bir sahneye bağla. Hazır olunca gizle, sonra bakmadan sırayla yazacaksın.' }];
  for (let i = 0; i < plan.dikkat; i++) {
    const a = 10 + Math.floor(rng() * 30), b = 3 + Math.floor(rng() * 9), top = a + b;
    const yanlis = [...new Set([top + 1, top - 1, top + 10, top - 2].filter((x) => x > 0 && x !== top))].slice(0, 3);
    adimlar.push({ tur: 'soru', id: 'dk' + i, bolum: BOLUM.dikkat, soru: `${a} + ${b} = ?`, secenekler: [String(top), ...yanlis.map(String)] });
  }
  adimlar.push({ tur: 'liste-hatirla', id: 'hat', ref: 'liste', bolum: 'Hatırlama', yonerge: 'Listeye bakmadan, sırayla yaz. Her satıra bir kelime.' });
  const baslik = yoklama ? `Hafıza · Seviye ${hedef} yoklaması` : `Hafıza · Seviye ${hedef} oturumu`;
  const olay = yoklama ? 'yerlestirme' : 'seviye-oturum';
  return {
    baslik, emoji: '🏛️', hedef: `${plan.uzunluk} kelimelik liste${plan.dikkat ? `, araya ${plan.dikkat} toplama sorusu` : ''}. ${yoklama ? 'Bu bir not değil; nereden başlayacağını bulmak için.' : 'Hepsi doğru yerdeyse seviyen yükselir.'}`,
    ders: { id: `sv:hafiza:${yoklama ? 'yoklama' : 'oturum'}:${hedef}:${B.bugun}:${sayi(B, 'hafiza', olay)}`, iz: 'hafiza', baslik, adimlar, uretilen: true },
    etkinSv: hedef, liste,
  };
}

// ---------------- Spor ----------------
function spor(B, sv) {
  const p = sporPlani(sv, B.kural);
  if (![...GUC, 'denge-turu'].every((id) => B.idx.hareket.has(id))) return { yok: 'icerik', ayrinti: 'spor hareket kitaplığı eksik' };
  const bolumler = [
    { tur: 'mesafe', ad: 'Yürüyüş', hedef: `${km(p.km)} km`, not: 'Kendi rahat hızında yürü; gerekirse parçalara böl.' },
    { ad: 'Güç ve teknik', simge: '💪', hedef: `her hareket ${p.set} set × ${p.tekrar}`, not: 'Her hareketin ilk setini kolayca yap. Nefesin toparlanınca sonraki sete geç.', hareketler: GUC.map((ref) => ({ ref, set: p.set, tekrar: String(p.tekrar) })) },
    { ad: 'Denge', simge: '⚖️', hedef: `${p.denge} tur`, hareketler: [{ ref: 'denge-turu', set: p.denge }] },
  ];
  if (sv >= 4 && B.idx.hareket.has('ceviklik-turu')) bolumler.push({ ad: 'Çeviklik', simge: '👟', hedef: `${p.cevik} tur`, hareketler: [{ ref: 'ceviklik-turu', set: p.cevik }] });
  const baslik = `Spor · Seviye ${sv}`;
  const seri = B.kural.izler.spor.yukselmeSeri || 1;
  return {
    baslik, emoji: '🏃', hedef: `Yürüyüş ${km(p.km)} km, her hareket ${p.set} set × ${p.tekrar}. Planı tamamlayıp zorlanmayı ${p.zorlanmaUst}/10 ya da altında bulursan${seri > 1 ? `, bunu üst üste ${seri} kez yapınca` : ''} seviyen yükselir.`,
    ders: {
      id: `sv:spor:oturum:${sv}:${B.bugun}:${sayi(B, 'spor', 'seviye-oturum')}`, iz: 'spor', baslik, uretilen: true,
      adimlar: [{ tur: 'spor', id: 'spor', baslik, giris: 'Isınmak için birkaç rahat adım at ve hareketlerin kolay provasını yap. Hedeflere uyku öncesine kadar ulaşman yeterli; süre tutmak zorunda değilsin.', guvenlik: 'Ağrı ya da baş dönmesi olursa hareketi bırak. Hedefi zorlayarak tamamlama; yapılmayan spor ertesi güne eklenmez.', bolumler }],
    },
    etkinSv: sv, plan: p,
  };
}

// ---------------- Sayfalar ----------------
/** Oturumun sayfaları. ctx: oyuncu.ctxOlustur() ile aynı biçim (kelime, tumKelimeler, sesler, hareket, ders, deneme). */
export function sayfalar(hazir, ctx) {
  const d = hazir.ders;
  const yoklama = hazir.tur === 'yoklama';
  let s;
  if (d.adimlar.some((a) => a.tur === 'kelime-sorusu')) { // İngilizce yoklaması: her adım tek bir kelime sorusu
    const rng = tohumlu(yazidanTohum(d.id));
    const havuz = (hazir.havuz || []).map((id) => ctx.kelime(id)).filter(Boolean);
    s = d.adimlar.map((a) => kelimeSorusu(a.soruTuru, ctx.kelime(a.kelime), { havuz, tumu: ctx.tumKelimeler, ctx, rng, bolum: BOLUM.yoklama }));
  } else s = derle(d, ctx).sayfalar;
  s = s.map((p) => {
    if (p.bolum === BOLUM.dikkat) return { ...p, puan: false }; // toplama soruları araya girer, seviyeye sayılmaz
    if (p.t === 'liste-hatirla') return { ...p, siraliPuan: true }; // doğru yerdeki öğe sayılır
    return p;
  });
  if (yoklama) {
    s = s.filter((p) => !['anlat', 'serbest'].includes(p.t));
    s = s.map((p) => (p.t === 'mcq' && p.puan ? { ...p, kare: false, secenekler: [...p.secenekler, { m: BILMIYORUM, dogru: false, bilmiyorum: true }] } : p));
  }
  return s;
}

/**
 * Oturum sonucundan deftere yazılacak olay.
 * sonuc: { dogru, toplam, spor: { kismi, zorlanma, destek } | null }  (dogru/toplam: oynatıcının ilk-deneme puanı)
 */
export function olayVerisi(hazir, { dogru = 0, toplam = 0, spor: sp = null } = {}, kural) {
  if (hazir.iz === 'spor') {
    const zorlanma = sp?.zorlanma ?? null, kismi = !!sp?.kismi;
    const ust = kural?.izler?.spor?.oturum?.zorlanmaUst ?? 6;
    const sonuc = kismi || (zorlanma != null && zorlanma >= 9) ? 'zayif' : (zorlanma != null && zorlanma <= ust ? 'tam' : 'iyi');
    return { tur: 'seviye-oturum', veri: { iz: 'spor', sv: hazir.sv, dogru: sonuc === 'tam' ? 1 : 0, toplam: 1, sonuc, zorlanma, kismi, destek: !!sp?.destek } };
  }
  const ders = hazir.dersId ? { ders: hazir.dersId } : {};
  if (hazir.tur === 'yoklama') return { tur: 'yerlestirme', veri: { iz: hazir.iz, sv: hazir.etkinSv, hedefSv: hazir.sv, dogru, toplam, ...ders } };
  return { tur: 'seviye-oturum', veri: { iz: hazir.iz, sv: hazir.etkinSv, dogru, toplam, ...ders } };
}

/**
 * Sonuç ekranındaki seviye kartı. once/sonra: seviyeler() çıktısındaki o becerinin, olay yazılmadan önceki ve sonraki durumu.
 * veri: olayVerisi().veri. Dönen: { tur, baslik, satirlar[], degisti } — kısa, yargılamayan, ne olacağını söyleyen metin.
 */
export function sonucMetni(hazir, once, sonra, kural, veri) {
  const ad = hazir.ad || sonra?.ad || hazir.iz;
  if (hazir.tur === 'yoklama') {
    const y = sonra.yerlestirme, son = y.yoklamalar.at(-1);
    const gecti = son ? yoklamaGecti(son.dogru, son.toplam, kural) : false;
    const satirlar = [`${ad}: ${son.sv}. seviye ${gecti ? 'geçildi' : 'şimdilik geçilemedi'} (${son.dogru}/${son.toplam}).`];
    if (y.bitti) {
      satirlar.push(y.gecen ? `Yoklama bitti: ${y.gecen}. seviyeyi geçtin. Gerçek çalışma ${sonra.sv}. seviyeden başlayacak; biraz altından başlamak yeni içeriği rahat öğretir.` : `Yoklama bitti: en alttan başlıyoruz (${sonra.sv}. seviye). Bu bir eksiklik değil; temelden sağlam gitmek için.`);
      return { tur: 'yoklama-bitti', baslik: 'Yoklama tamamlandı', satirlar, degisti: true };
    }
    satirlar.push(`Sıradaki yoklama ${y.sonraki}. seviye çevresinde.`);
    return { tur: 'yoklama-devam', baslik: 'Yoklama kaydedildi', satirlar, degisti: false };
  }
  const o = oturumSonucu(veri, hazir.iz, kural);
  const degisti = sonra.sv !== once.sv;
  if (degisti && sonra.sv > once.sv) return { tur: 'yukari', baslik: `Seviye ${once.sv} → ${sonra.sv}`, satirlar: [`${ad}: ${sonra.gecmis.at(-1)?.neden || 'yükseldin'}. Yeni seviye yaklaşık ${cefrYaklasim(sonra.sv)}.`], degisti };
  if (degisti) return { tur: 'asagi', baslik: `Seviye ${once.sv} → ${sonra.sv}`, satirlar: [`${ad}: son oturumlar zor geçti, bir basamak aşağı indik. Bu bir gerileme değil; sağlam zeminden devam etmek için.`], degisti };
  const kalan = Math.max(1, (kural.izler[hazir.iz].yukselmeSeri || 1) - sonra.tamSeri);
  if (o === 'tam') return { tur: 'seri', baslik: `Seviye ${sonra.sv}`, satirlar: [`Tam oturum! Yükselmek için ${kalan} tam oturum daha.`], degisti };
  if (o === 'zayif') return { tur: 'zayif', baslik: `Seviye ${sonra.sv}`, satirlar: ['Bu oturum zordu. Yanlışlar Tekrar bölümünde karşına çıkar; seviyen şimdilik aynı.'], degisti };
  return { tur: 'ayni', baslik: `Seviye ${sonra.sv}`, satirlar: ['Seviyen aynı kaldı. Yükselmek için oturumdaki her soruyu ilk denemede doğru yapman gerekir.'], degisti };
}
