// İçerik doğrulayıcı. Tarayıcıda (paket içe aktarırken) ve komut satırında (scripts/dogrula.mjs) aynı kod çalışır.
// Amaç: cevap anahtarı, kelime, ders ve program arasındaki çelişkileri ve eksik bağlantıları yayına çıkmadan yakalamak.

import { sadelestir, asciiKatla, mesafe, atesman } from './metin.js';
import { IZLER } from './paket.js';

export const ADIM_TURLERI = [
  'anlat', 'kelime-ogren', 'alistirma', 'soru', 'sahne', 'cumle-kur', 'dikte', 'sayi-dinle', 'oku', 'serbest', 'dinle',
  'liste-sun', 'liste-hatirla', 'gecikmeli-kur', 'saray-kur', 'saray-yerlestir', 'spor', 'dis', 'olcek',
];
export const ALISTIRMA_TURLERI = ['dinle-sec', 'anlam-sec', 'kelime-sec', 'yaz', 'eslestir'];
export const KONTROL_SURELERI = { '5dk': 5 * 60e3, '30dk': 30 * 60e3, '2sa': 2 * 3600e3, '1gun': 24 * 3600e3, '7gun': 7 * 24 * 3600e3 };

export function dogrula(ic, idx) {
  const hata = [], uyari = [];
  const H = (yer, m) => hata.push(`${yer}: ${m}`);
  const U = (yer, m) => uyari.push(`${yer}: ${m}`);
  for (const c of ic.cakismalar || []) hata.push(`Çakışma: ${c}`);

  // ---- kelimeler ----
  const enGorulen = new Map(), emojiGorulen = new Map(), trGorulen = new Map();
  for (const k of ic.kelimeler) {
    const y = `kelime:${k.id}`;
    if (!k.en || !String(k.en).trim()) H(y, 'İngilizce metin (en) boş');
    if (!k.tr || !String(k.tr).trim()) H(y, 'Türkçe karşılık (tr) boş');
    if (k.ornek && (!k.ornek.en || !k.ornek.tr)) H(y, 'örnek cümlenin hem en hem tr alanı olmalı');
    if (k.ornek?.en && k.en && !/\d/.test(k.en) && !sadelestir(k.ornek.en).includes(sadelestir(k.en).split(' ')[0])) U(y, 'örnek cümlede kelime/kalıp geçmiyor');
    const anahtar = sadelestir(k.en || '');
    if (enGorulen.has(anahtar)) {
      const d = enGorulen.get(anahtar);
      H(y, d.tr === k.tr ? `"${k.en}" iki kez tanımlı (${d.id})` : `"${k.en}" iki farklı karşılıkla tanımlı: "${d.tr}" ve "${k.tr}" (${d.id})`);
    } else enGorulen.set(anahtar, k);
    bosluk(k.en, y, 'en', U); bosluk(k.tr, y, 'tr', U);
    if (k.sv !== undefined && !svGecerli(k.sv)) H(y, `sv 1–100 arasında tam sayı olmalı (${k.sv})`);
    if (k.siklik !== undefined && !(Number.isInteger(k.siklik) && k.siklik >= 1)) H(y, `siklik pozitif tam sayı olmalı (${k.siklik})`);
    const trAnahtar = sadelestir(k.tr || '', { tr: true });
    if (trAnahtar && trGorulen.has(trAnahtar)) U(y, `"${k.tr}" karşılığı "${trGorulen.get(trAnahtar)}" ile aynı: "Türkçesi verilen kelimenin İngilizcesini seç/yaz" sorusunda iki doğru cevap olur`);
    else if (trAnahtar) trGorulen.set(trAnahtar, k.id);
    if (k.emoji) {
      if (emojiGorulen.has(k.emoji)) U(y, `emoji ${k.emoji} "${emojiGorulen.get(k.emoji)}" ile aynı: resimli seçeneklerde ikisi ayırt edilemez`);
      else emojiGorulen.set(k.emoji, k.id);
    }
  }

  // ---- dersler ----
  const sorular = new Map(); // normalize soru -> {dogru, yer}
  const kullanilanKelime = new Set(), kullanilanHareket = new Set();
  const rotalar = new Set(['ev']);
  for (const d of ic.dersler) for (const a of d.adimlar || []) if (a.tur === 'saray-kur') rotalar.add(a.id || 'ev');
  for (const d of ic.dersler) {
    const y = `ders:${d.id}`;
    if (!IZLER[d.iz]) H(y, `iz "${d.iz}" geçersiz (${Object.keys(IZLER).join(', ')})`);
    if (!d.baslik) H(y, 'başlık yok');
    if (!d.hedef) U(y, 'hedef cümlesi yok');
    if (d.sv !== undefined) {
      if (!svGecerli(d.sv)) H(y, `sv 1–100 arasında tam sayı olmalı (${d.sv})`);
      const enAz = (ic.seviye?.izler?.[d.iz]?.enAzSoru) ?? (ic.seviye?.yukselme?.enAzSoru) ?? 5;
      const n = puanliSoru(d);
      if (['okuma', 'dinleme'].includes(d.iz) && n < enAz) U(y, `seviye oturumunda sayılması için en az ${enAz} soru gerekir (${n} var)`);
    }
    if (!Array.isArray(d.adimlar) || !d.adimlar.length) { H(y, 'adımlar yok'); continue; }
    const adimIds = new Set(), listeSunIds = new Set();
    d.adimlar.forEach((a, i) => {
      const ay = `${y} > adım ${i + 1} (${a.tur})`;
      if (!ADIM_TURLERI.includes(a.tur)) { H(ay, `bilinmeyen adım türü "${a.tur}"`); return; }
      if (a.id) { if (adimIds.has(a.id)) H(ay, `adım kimliği "${a.id}" bu derste iki kez`); adimIds.add(a.id); }
      adimDogrula(a, ay, d, ic, idx, { H, U, sorular, kullanilanKelime, kullanilanHareket, listeSunIds, rotalar });
    });
    for (const a of d.adimlar) if (a.tur === 'liste-sun' && a.id) listeSunIds.add(a.id);
    for (const a of d.adimlar) {
      if (a.tur !== 'liste-hatirla' && a.tur !== 'gecikmeli-kur') continue;
      const [dId, aId] = String(a.ref).includes('/') ? String(a.ref).split('/') : [d.id, a.ref];
      if (a.tur === 'gecikmeli-kur' && dId !== d.id) { H(`${y} > ${a.tur}`, 'gecikmeli-kur yalnız aynı dersteki listeye bağlanabilir'); continue; }
      const kaynakDers = dId === d.id ? d : ic.dersler.find((x) => x.id === dId);
      if (!kaynakDers?.adimlar.some((b) => b.tur === 'liste-sun' && b.id === aId)) H(`${y} > ${a.tur}`, `ref "${a.ref}" ile eşleşen liste-sun adımı yok`);
    }
  }
  for (const k of ic.kelimeler) if (!kullanilanKelime.has(k.id) && !Number.isFinite(k.sv)) U(`kelime:${k.id}`, 'hiçbir derste kullanılmıyor (seviye sv= verilirse seviye oturumlarında kullanılır)');
  for (const m of ic.hareketler) {
    if (!m.ad || !m.adimlar?.length) H(`hareket:${m.id}`, 'ad ve adimlar gerekli');
    if (!kullanilanHareket.has(m.id)) U(`hareket:${m.id}`, 'hiçbir spor dersinde kullanılmıyor');
  }

  // ---- program ----
  const gunGorulen = new Set();
  for (const h of ic.haftalar) {
    for (const g of h.gunler) {
      const y = `program: hafta ${h.hafta} gün ${g.gun}`;
      if (gunGorulen.has(g.gun)) H(y, 'gün numarası iki kez'); gunGorulen.add(g.gun);
      if (g.gun < (h.hafta - 1) * 7 + 1 || g.gun > h.hafta * 7) H(y, `gün numarası hafta ${h.hafta} aralığında değil (${(h.hafta - 1) * 7 + 1}–${h.hafta * 7})`);
      if (!g.baslik) U(y, 'gün başlığı yok');
      const gor = new Set();
      for (const t of g.gorevler || []) {
        if (!idx.ders.has(t.ders)) H(y, `ders "${t.ders}" tanımlı değil`);
        if (gor.has(t.ders)) H(y, `ders "${t.ders}" aynı güne iki kez eklenmiş`); gor.add(t.ders);
      }
      if (!(g.gorevler || []).length) U(y, 'görev yok');
    }
  }
  const programda = new Set(); for (const g of idx.gunler.values()) for (const t of g.gorevler || []) programda.add(t.ders);
  const desenDersleri = new Set();
  for (const gun of ic.seviyeli?.desen || []) for (const g of gun) if (g.ders) desenDersleri.add(g.ders);
  for (const d of ic.dersler) if (!programda.has(d.id) && !desenDersleri.has(d.id) && !Number.isFinite(d.sv) && !d.kutuphane) U(`ders:${d.id}`, 'programdaki hiçbir güne bağlı değil (yalnız Dersler sayfasında görünür; seviye oturumlarına girmesi için sv, kasıtlıysa kutuphane: true ekle)');
  seviyeDogrula(ic, idx, H, U);

  // ---- dış uygulamalar ----
  for (const o of ic.disUygulamalar) {
    if (!o.ad) H(`dış:${o.id}`, 'ad yok');
    if (!/^https:\/\//.test(o.web || o.link || '')) H(`dış:${o.id}`, 'https bağlantı (web) yok');
  }
  return { hata, uyari };
}

const svGecerli = (v) => Number.isInteger(v) && v >= 1 && v <= 100;

/** Bir dersteki puanlanan soru sayısı (dinle/oku/sahne soruları + soru adımları). */
function puanliSoru(d) {
  let n = 0;
  for (const a of d.adimlar || []) {
    if (['dinle', 'oku', 'sahne'].includes(a.tur)) n += (a.sorular || []).length;
    else if (a.tur === 'soru') n++;
  }
  return n;
}

/** Seviye kuralları, seviyeli program deseni, hafıza havuzu ve içerik kapsamı. */
function seviyeDogrula(ic, idx, H, U) {
  const s = ic.seviye || {};
  const y = s.yerlestirme;
  if (y) {
    const b = y.basamaklar || [];
    if (b.some((x, i) => i && x <= b[i - 1])) H('seviye', 'yerleştirme basamakları artan olmalı');
    if (y.tavan !== undefined && b.length && b.at(-1) > y.tavan) H('seviye', 'son basamak tavanı aşıyor');
    if (y.gecis !== undefined && !(y.gecis > 0 && y.gecis <= 1)) H('seviye', 'gecis 0–1 arasında olmalı');
    if (y.birYanlisHakki !== undefined && !(Number.isInteger(y.birYanlisHakki) && y.birYanlisHakki >= 0)) H('seviye', 'birYanlisHakki 0 (kapalı) ya da pozitif tam sayı olmalı');
  }
  const izAdlari = Object.keys(s.izler || {});
  const sd = ic.seviyeli;
  if (sd) {
    if (!Number.isInteger(sd.baslangicGunu) || sd.baslangicGunu < 1) H('program: seviyeli', 'baslangicGunu pozitif tam sayı olmalı');
    if (!Array.isArray(sd.desen) || !sd.desen.length) H('program: seviyeli', 'desen en az 1 günlük olmalı');
    for (const [i, gun] of (sd.desen || []).entries()) {
      if (!Array.isArray(gun)) { H('program: seviyeli', `desen ${i + 1}. gün liste olmalı`); continue; }
      for (const g of gun) {
        if (g.oturum && !izAdlari.includes(g.oturum)) H('program: seviyeli', `desen ${i + 1}. gün: "${g.oturum}" seviye kurallarında tanımlı değil`);
        else if (g.ders && !idx.ders.has(g.ders)) H('program: seviyeli', `desen ${i + 1}. gün: ders "${g.ders}" tanımlı değil`);
        else if (!g.oturum && !g.ders) H('program: seviyeli', `desen ${i + 1}. gün: oturum ya da ders gerekli`);
      }
    }
  }
  // hafıza havuzu: karıştırılabilecek (ascii katlanınca eşit ya da 1 harf farkı) sözcükler olmamalı
  const havuz = ic.hafizaHavuzu || [];
  const norm = havuz.map((w) => asciiKatla(sadelestir(w, { tr: true })));
  for (let i = 0; i < norm.length; i++) {
    if (!norm[i]) H('hafizaHavuzu', `boş sözcük (${i + 1}. sıra)`);
    for (let j = i + 1; j < norm.length; j++) {
      if (norm[i] === norm[j] || (norm[i].length >= 4 && norm[j].length >= 4 && mesafe(norm[i], norm[j]) <= 1)) U('hafizaHavuzu', `"${havuz[i]}" ile "${havuz[j]}" birbirine çok benziyor; cevap kontrolünde karışabilir`);
    }
  }
  if (sd && havuz.length < 60) U('hafizaHavuzu', `${havuz.length} sözcük var; yüksek seviyeli listeler için en az 60 gerekir`);
  // kapsam: yerleştirme basamakları çevresinde yeterli içerik var mı
  if (sd && y) {
    const kel = ic.kelimeler.filter((k) => Number.isFinite(k.sv));
    for (const b of y.basamaklar || []) {
      const n = kel.filter((k) => Math.abs(k.sv - b) <= 4).length;
      if (n < 8) U(`seviye: kelime kapsamı`, `${b}. seviye çevresinde (±4) yalnız ${n} kelime var; yoklama için en az 8 önerilir`);
    }
    for (const iz of ['okuma', 'dinleme']) {
      const ls = ic.dersler.filter((d) => d.iz === iz && Number.isFinite(d.sv));
      for (const b of y.basamaklar || []) if (!ls.some((d) => Math.abs(d.sv - b) <= 5)) U(`seviye: ${iz} kapsamı`, `${b}. seviye çevresinde (±5) ${iz === 'okuma' ? 'metin' : 'kayıt'} yok; yoklama o noktada kapanır`);
    }
  }
  // okuma sırası: seviye sırası ile Ateşman okunabilirliği ters düşüyorsa uyar (metin uzunluğu ve karmaşıklığı seviyeyle artmalı)
  const okumalar = ic.dersler.filter((d) => d.iz === 'okuma' && Number.isFinite(d.sv)).map((d) => ({ d, a: atesman(d.adimlar.filter((x) => x.tur === 'oku').flatMap((x) => x.metin).join(' ')) })).filter((x) => x.a != null);
  for (const p of okumalar) for (const q of okumalar) if (q.d.sv - p.d.sv >= 10 && q.a - p.a > 12) U(`ders:${q.d.id}`, `seviyesi ${q.d.sv} ama okunabilirliği (${q.a}) ${p.d.id} (sv ${p.d.sv}, ${p.a}) metninden daha kolay; seviye sırasını gözden geçir`);
}

function bosluk(v, y, alan, U) {
  if (typeof v === 'string' && (v !== v.trim() || /\s{2,}/.test(v))) U(y, `${alan} alanında baştaki/sondaki ya da çift boşluk var`);
}

function seceneklerDogrula(s, ay, H, U) {
  if (!Array.isArray(s.secenekler) || s.secenekler.length < 2 || s.secenekler.length > 6) { H(ay, 'secenekler 2–6 öğe olmalı'); return false; }
  const norm = s.secenekler.map((x) => sadelestir(String(x)));
  if (norm.some((x) => !x)) H(ay, 'boş seçenek var');
  if (new Set(norm).size !== norm.length) H(ay, 'iki seçenek aynı');
  if (s.sabit) { if (!s.secenekler.includes(s.dogru)) H(ay, `sabit sırada "dogru" seçeneklerden biri olmalı (${s.dogru})`); }
  else if (s.dogru !== undefined) H(ay, 'karışık sırada doğru cevap her zaman ilk seçenektir; "dogru" yazma (ya da "sabit": true kullan)');
  if (s.secenekler.some((x) => String(x).length > 90)) U(ay, 'çok uzun seçenek (90+ karakter) telefonda zor okunur');
  return true;
}

// Aynı soru metni iki yerde farklı doğru cevapla yazılmışsa uyarır (bilinçli olabilir: "Ne zaman?" iki ayrı sahnede).
function soruKaydi(s, ay, ders, sorular, U) {
  const cevap = s.sabit ? s.dogru : s.secenekler?.[0];
  const anahtar = sadelestir(s.soru || '');
  const onceki = sorular.get(anahtar);
  if (onceki && sadelestir(onceki.dogru) !== sadelestir(cevap)) U(ay, `aynı soru metni başka yerde farklı cevapla var: "${onceki.dogru}" (${onceki.yer}) ≠ "${cevap}" — bilinçli değilse düzelt`);
  else if (!onceki) sorular.set(anahtar, { dogru: cevap, yer: ay });
}

function adimDogrula(a, ay, ders, ic, idx, { H, U, sorular, kullanilanKelime, kullanilanHareket, rotalar }) {
  const kelimeKontrol = (ids) => {
    if (!Array.isArray(ids) || !ids.length) { H(ay, 'kelimeler listesi boş'); return; }
    for (const id of ids) { if (!idx.kelime.has(id)) H(ay, `kelime "${id}" tanımlı değil`); else kullanilanKelime.add(id); }
    if (new Set(ids).size !== ids.length) H(ay, 'kelimeler listesinde tekrar var');
  };
  switch (a.tur) {
    case 'anlat':
      if (!Array.isArray(a.bloklar) || !a.bloklar.length) H(ay, 'bloklar boş');
      for (const b of a.bloklar || []) if (!['p', 'liste', 'ipucu', 'kutu', 'tablo', 'emoji', 'ornek', 'baslik', 'resim'].some((k) => k in b)) H(ay, `bilinmeyen blok: ${JSON.stringify(b).slice(0, 60)}`);
      break;
    case 'kelime-ogren': kelimeKontrol(a.kelimeler); break;
    case 'alistirma':
      kelimeKontrol(a.kelimeler);
      for (const t of a.turler || []) if (!ALISTIRMA_TURLERI.includes(t)) H(ay, `alıştırma türü "${t}" geçersiz`);
      if ((a.kelimeler || []).length < 4 && (a.turler || ALISTIRMA_TURLERI).some((t) => t !== 'yaz')) U(ay, 'seçenek üretmek için en az 4 kelime önerilir');
      break;
    case 'soru':
      if (!a.soru) H(ay, 'soru metni yok');
      if (seceneklerDogrula(a, ay, H, U)) soruKaydi(a, ay, ders, sorular, U);
      break;
    case 'sahne': {
      if (!a.id) H(ay, 'sahne kimliği (id) gerekli');
      if (!Array.isArray(a.satirlar) || a.satirlar.length < 2) H(ay, 'sahne en az 2 satır olmalı');
      for (const [i, s] of (a.satirlar || []).entries()) if (!s.kim || !s.en || !s.tr) H(ay, `satır ${i + 1}: kim, en ve tr gerekli`);
      if (!Array.isArray(a.sorular) || !a.sorular.length) H(ay, 'sahne için en az 1 anlama sorusu gerekli');
      for (const [i, s] of (a.sorular || []).entries()) { if (!s.soru) H(ay, `soru ${i + 1}: metin yok`); if (seceneklerDogrula(s, `${ay} soru ${i + 1}`, H, U)) soruKaydi(s, `${ay} soru ${i + 1}`, ders, sorular, U); }
      for (const k of a.kelimeler || []) if (!idx.kelime.has(k)) H(ay, `kelime "${k}" tanımlı değil`); else kullanilanKelime.add(k);
      break;
    }
    case 'cumle-kur':
      if (!Array.isArray(a.ogeler) || !a.ogeler.length) H(ay, 'ogeler boş');
      for (const [i, o] of (a.ogeler || []).entries()) if (!o.tr || !o.en) H(ay, `öğe ${i + 1}: tr ve en gerekli`);
      break;
    case 'dikte':
      if (!Array.isArray(a.ogeler) || !a.ogeler.length) H(ay, 'ogeler boş');
      if (a.dil && !['en', 'tr'].includes(a.dil)) H(ay, 'dil en ya da tr olmalı');
      for (const [i, o] of (a.ogeler || []).entries()) if (!(o.metin || o.en || o.tr)) H(ay, `öğe ${i + 1}: metin yok`);
      break;
    case 'sayi-dinle':
      if (!Array.isArray(a.aralik) || a.aralik.length !== 2 || a.aralik[0] >= a.aralik[1] || a.aralik[1] > 999) H(ay, 'aralik [küçük, büyük] ve en çok 999 olmalı');
      break;
    case 'oku':
      if (!a.id) H(ay, 'okuma kimliği (id) gerekli');
      if (!Array.isArray(a.metin) || !a.metin.length) H(ay, 'metin paragraf listesi olmalı');
      for (const [i, s] of (a.sorular || []).entries()) { if (!s.soru) H(ay, `soru ${i + 1}: metin yok`); if (seceneklerDogrula(s, `${ay} soru ${i + 1}`, H, U)) soruKaydi(s, `${ay} soru ${i + 1}`, ders, sorular, U); }
      if (!(a.sorular || []).length && !a.serbest) U(ay, 'okuma sonrası soru ya da serbest anlatım yok');
      break;
    case 'serbest':
      if (!a.id) H(ay, 'serbest yanıt kimliği (id) gerekli');
      if (!a.soru) H(ay, 'soru metni yok');
      if (a.kip && !['yaz', 'ses', 'ikisi'].includes(a.kip)) H(ay, 'kip yaz | ses | ikisi olmalı');
      for (const n of a.noktalar || []) if (!n.ad) H(ay, 'noktalarda ad gerekli');
      break;
    case 'dinle': {
      if (!a.id) H(ay, 'dinleme kimliği (id) gerekli');
      if (!a.ses) H(ay, 'ses yok (dosya yolu ya da {metin, ses, hiz})');
      if (typeof a.ses === 'object' && !a.ses.metin) H(ay, 'ses.metin gerekli');
      if (a.sinir !== undefined && !(a.sinir >= 1)) H(ay, 'sinir 1 ya da daha büyük olmalı');
      for (const [i, s] of (a.sorular || []).entries()) { if (seceneklerDogrula(s, `${ay} soru ${i + 1}`, H, U)) soruKaydi(s, `${ay} soru ${i + 1}`, ders, sorular, U); }
      if (!(a.sorular || []).length && !a.serbest) U(ay, 'dinleme sonrası ne yapılacağı belli değil (sorular ya da serbest ekle)');
      break;
    }
    case 'liste-sun':
      if (!a.id) H(ay, 'liste kimliği (id) gerekli');
      if (!Array.isArray(a.liste) || a.liste.length < 1) H(ay, 'liste en az 1 öğe olmalı');
      else if (a.liste.length < 3 && !a.tekAmac) U(ay, 'liste 3 öğeden kısa; gecikmeli hatırlama testi için olabilir');
      break;
    case 'liste-hatirla':
      if (!a.ref) H(ay, 'ref (liste-sun kimliği) gerekli');
      if (typeof a.saray === 'string' && !rotalar.has(a.saray)) H(ay, `rota "${a.saray}" hiçbir saray-kur adımında kurulmuyor`);
      break;
    case 'gecikmeli-kur':
      if (!a.ref) H(ay, 'ref gerekli');
      for (const k of a.kontroller || []) if (!KONTROL_SURELERI[k]) H(ay, `kontrol süresi "${k}" geçersiz (${Object.keys(KONTROL_SURELERI).join(', ')})`);
      if (!a.soru) H(ay, 'kontrol sorusu (soru) gerekli');
      break;
    case 'saray-kur': break;
    case 'saray-yerlestir':
      if (!Array.isArray(a.liste) || !a.liste.length) H(ay, 'liste boş');
      if (typeof a.saray === 'string' && !rotalar.has(a.saray)) H(ay, `rota "${a.saray}" hiçbir saray-kur adımında kurulmuyor`);
      break;
    case 'spor':
      if (!Array.isArray(a.bolumler) || !a.bolumler.length) H(ay, 'bolumler boş');
      for (const [bi, b] of (a.bolumler || []).entries()) {
        if (!b.ad) H(ay, `bölüm ${bi + 1}: ad gerekli`);
        if (b.tur === 'mesafe') continue;
        if (!Array.isArray(b.hareketler) || !b.hareketler.length) H(ay, `bölüm "${b.ad}": hareketler boş`);
        for (const [i, m] of (b.hareketler || []).entries()) {
          if (m.ref) { if (!idx.hareket.has(m.ref)) H(ay, `bölüm "${b.ad}": hareket "${m.ref}" kitaplıkta yok`); else kullanilanHareket.add(m.ref); }
          else if (!m.id || !m.ad || !m.adimlar?.length) H(ay, `bölüm "${b.ad}" hareket ${i + 1}: ref ya da (id, ad, adimlar) gerekli`);
        }
      }
      break;
    case 'dis':
      if (!idx.dis.has(a.uygulama)) H(ay, `dış uygulama "${a.uygulama}" tanımlı değil`);
      break;
    case 'olcek': if (!a.id || !a.soru) H(ay, 'id ve soru gerekli'); break;
    default: break;
  }
}
