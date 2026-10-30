// Seviye motoru. Saf işlevler: tarayıcıya ve depoya bağlı değildir; uygulama, testler ve MCP sunucusu aynı kodu kullanır.
// Durum, olay defterinden YENİDEN HESAPLANIR (kayıt silinmez, aynı kayıtlar her cihazda aynı seviyeyi verir).
// Olaylar:
//   yerlestirme   { iz, sv, dogru, toplam }          ilk haftadaki yoklama
//   seviye-oturum { iz, sv, dogru, toplam, sonuc? }   gerçek çalışma oturumu (sonuc: 'tam' | 'iyi' | 'zayif' verilirse oran yerine bu kullanılır)
//   yerlestirme-son { iz, neden }                     yoklama, bilinen aralıkta sorulacak içerik kalmadığı için o noktada kapatıldı
//   seviye-ayar   { iz, sv, neden }                   elle ayar (öğretmen, yapay zekâ önerisi, kullanıcı)
// Kurallar icerik/seviye.json içindedir; burada yalnız varsayılanlar ve hesap vardır. Gerekçeler: docs/SEVIYE_SISTEMI.md

export const IZ_SIRASI = ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor'];

export const VARSAYILAN = {
  olcek: { en: 1, ust: 100 },
  yerlestirme: { ilkGun: 1, sonGun: 7, basamaklar: [5, 10, 20, 35, 50], tavan: 50, gecis: 0.8, birYanlisHakki: 4, soru: 7, enCokYoklama: 7, cozunurluk: 2, guvenPayi: 0.8 },
  yukselme: { enAzSoru: 5 },
  dusme: { altinda: 0.6, ardisik: 2 },
  izler: {
    ingilizce: { ad: 'İngilizce', yerlestirme: true, yukselmeSeri: 1 },
    okuma: { ad: 'Okuma', yerlestirme: true, yukselmeSeri: 1 },
    dinleme: { ad: 'Dinleme', yerlestirme: true, yukselmeSeri: 1 },
    hafiza: { ad: 'Hafıza', yerlestirme: true, yukselmeSeri: 1 },
    spor: { ad: 'Spor', yerlestirme: false, yukselmeSeri: 2, enAzSoru: 1 },
  },
};

/** İçerik paketlerinden gelen kuralları varsayılanlarla birleştirir (ic.seviye). */
export function kuralKur(ic = null) {
  const o = ic?.seviye || {};
  const izler = {};
  for (const iz of new Set([...Object.keys(VARSAYILAN.izler), ...Object.keys(o.izler || {})])) izler[iz] = { ...VARSAYILAN.izler[iz], ...(o.izler?.[iz] || {}) };
  return {
    olcek: { ...VARSAYILAN.olcek, ...(o.olcek || {}) },
    yerlestirme: { ...VARSAYILAN.yerlestirme, ...(o.yerlestirme || {}) },
    yukselme: { ...VARSAYILAN.yukselme, ...(o.yukselme || {}) },
    dusme: { ...VARSAYILAN.dusme, ...(o.dusme || {}) },
    izler,
  };
}

export const izlerListesi = (kural) => IZ_SIRASI.filter((iz) => kural.izler[iz]).concat(Object.keys(kural.izler).filter((iz) => !IZ_SIRASI.includes(iz)));

/**
 * Yoklama geçildi mi: en az bir soru olmalı ve doğru oranı geçiş sınırında ya da üstünde olmalı.
 * Küçük örneklem payı: en az `birYanlisHakki` soruluk yoklamada tek yanlış (ör. 3/4) geçmeyi bozmaz; yoksa 4 soruda tek bir dikkatsizlik
 * seviyeyi kalıcı olarak en alta iterdi (5 soruda 4/5 zaten geçer, 4 soruda 3/4 geçmezdi). 0 ya da yoksa pay kapalıdır.
 */
export function yoklamaGecti(dogru, toplam, kural) {
  const y = kural.yerlestirme;
  if (!(toplam > 0)) return false;
  if (dogru / toplam >= y.gecis - 1e-9) return true;
  return !!y.birYanlisHakki && toplam >= y.birYanlisHakki && toplam - dogru <= 1;
}

const sirala = (olaylar) => [...olaylar].sort((a, b) => String(a.t).localeCompare(String(b.t)));

/**
 * Bir becerinin yerleştirme durumu.
 *  gecen   geçilen en yüksek seviye (0 = hiç geçilmedi)
 *  kalan   gecenin üstünde kalınan en düşük seviye (Infinity = henüz başarısız yok)
 *  bitti   yoklama bitti mi (tavan geçildi, aralık çözünürlüğe indi, yoklama sınırı doldu ya da yerleştirme günleri geçti)
 *  sonraki sıradaki yoklamanın hedef seviyesi (bitti ise null)
 *  baslangic gerçek çalışmanın başlayacağı seviye (bitti ise)
 */
export function yerlestirme(olaylar, iz, kural, { gunAsildi = false } = {}) {
  const y = kural.yerlestirme;
  const ys = sirala(olaylar.filter((o) => (o.tur === 'yerlestirme' || o.tur === 'yerlestirme-son') && o.iz === iz));
  let gecen = 0, kalan = Infinity, bitti = false, kullanilan = 0, bittiT = null;
  const yoklamalar = [];
  for (const o of ys) {
    if (bitti) break; // bittikten sonra gelen yoklamalar hesaba katılmaz
    if (o.tur === 'yerlestirme-son') { bitti = true; bittiT = o.t; continue; } // bilinen aralıkta yoklanacak içerik kalmadı
    const gecti = yoklamaGecti(o.dogru, o.toplam, kural);
    yoklamalar.push({ sv: o.sv, dogru: o.dogru, toplam: o.toplam, gecti, g: o.g, i: o.i });
    kullanilan++;
    if (gecti) { gecen = Math.max(gecen, o.sv); if (kalan <= gecen) kalan = Infinity; }
    else if (o.sv > gecen) kalan = Math.min(kalan, o.sv);
    bitti = bitisKontrol(gecen, kalan, kullanilan, y);
    if (bitti) bittiT = o.t;
  }
  if (!bitti && gunAsildi) { bitti = true; bittiT = ''; }
  const tavanGecti = gecen >= y.tavan;
  const sonraki = bitti ? null : sonrakiHedef(gecen, kalan, y);
  return {
    iz, gecen, kalan: kalan === Infinity ? null : kalan, bitti, bittiT, yoklamalar, tavanGecti, sonraki,
    baslangic: bitti ? baslangicSeviyesi(gecen, y) : null,
  };
}

function bitisKontrol(gecen, kalan, kullanilan, y) {
  if (gecen >= y.tavan) return true;
  if (kullanilan >= y.enCokYoklama) return true;
  if (kalan !== Infinity && kalan - gecen <= y.cozunurluk) return true;
  return false;
}

/** Sıradaki yoklama: başarısızlık yoksa basamak merdiveninde bir üst; varsa iki seviye arasının ortası. */
export function sonrakiHedef(gecen, kalan, y) {
  if (kalan === Infinity) {
    const ust = y.basamaklar.find((b) => b > gecen);
    return Math.min(ust ?? y.tavan, y.tavan);
  }
  let orta = Math.round((gecen + kalan) / 2);
  if (orta <= gecen) orta = gecen + 1;
  if (orta >= kalan) orta = kalan - 1;
  return Math.max(1, orta);
}

export function baslangicSeviyesi(gecen, y) {
  return Math.max(1, Math.round(gecen * y.guvenPayi));
}

/** Oturum sonucu: 'tam' (yükselt) | 'iyi' (aynı) | 'zayif' (düşüş sayacına). */
export function oturumSonucu(o, iz, kural) {
  if (o.sonuc === 'tam' || o.sonuc === 'iyi' || o.sonuc === 'zayif') return o.sonuc;
  const ayar = kural.izler[iz] || {};
  const enAz = ayar.enAzSoru ?? kural.yukselme.enAzSoru;
  if (!(o.toplam > 0)) return null;
  if (o.dogru >= o.toplam && o.toplam >= enAz) return 'tam';
  if (o.dogru / o.toplam < kural.dusme.altinda) return 'zayif';
  return 'iyi';
}

/**
 * Tüm becerilerin seviyesi. opts.programGunu verilirse ve yerleştirme günleri geçmişse yarım kalan yoklama kapatılır.
 * Dönen her beceri: { sv, kaynak, yerlestirme, gecmis, tamSeri, zayifSeri, oturum, yoklamaBekliyor }
 *   kaynak: 'yerlestirme' | 'baslangic' (yerleştirme yok ya da sürüyor) | 'ayar'
 *   gecmis: [{ g, t, sv, onceki, neden }]
 * Yerleştirme bitmeden yapılan oturumlar sayılmaz; yerleştirme bittiğinde seviye başlangıç değerine kurulur.
 */
export function seviyeler(olaylar, kural, { programGunu = null } = {}) {
  const sonuc = {};
  const gunAsildi = programGunu != null && programGunu > kural.yerlestirme.sonGun;
  for (const iz of izlerListesi(kural)) {
    const ayar = kural.izler[iz];
    const yer = ayar.yerlestirme ? yerlestirme(olaylar, iz, kural, { gunAsildi }) : null;
    const zaman = sirala(olaylar.filter((o) => o.iz === iz && ['seviye-oturum', 'seviye-ayar'].includes(o.tur)));
    if (yer?.bitti) zaman.unshift({ tur: 'yer-bitti', t: yer.bittiT || '', g: yer.yoklamalar.at(-1)?.g ?? null });
    zaman.sort((a, b) => String(a.t).localeCompare(String(b.t)) || (a.tur === 'yer-bitti' ? -1 : 0));
    const en = kural.olcek.en;
    let sv = yer ? (yer.gecen ? baslangicSeviyesi(yer.gecen, kural.yerlestirme) : en) : en; // yerleştirme sürerken geçici değer
    let kaynak = 'baslangic', tamSeri = 0, zayifSeri = 0, oturum = 0, yerKapandi = !yer;
    const gecmis = [];
    if (!yer) gecmis.push({ g: null, t: null, sv, onceki: null, neden: 'başlangıç' });
    for (const o of zaman) {
      if (o.tur === 'yer-bitti') {
        const onceki = sv; sv = yer.baslangic; kaynak = 'yerlestirme'; yerKapandi = true; tamSeri = 0; zayifSeri = 0;
        gecmis.push({ g: o.g, t: o.t || null, sv, onceki: onceki === sv ? null : onceki, neden: yer.gecen ? `yerleştirme: ${yer.gecen}. seviye geçildi` : 'yerleştirme: ilk basamak geçilemedi, en alttan başlandı' });
        continue;
      }
      if (o.tur === 'seviye-ayar') {
        const yeni = Math.max(en, Math.round(o.sv));
        if (yeni !== sv) gecmis.push({ g: o.g, t: o.t, sv: yeni, onceki: sv, neden: `elle ayar${o.neden ? ': ' + o.neden : ''}` });
        sv = yeni; kaynak = 'ayar'; tamSeri = 0; zayifSeri = 0;
        continue;
      }
      if (!yerKapandi) continue; // yerleştirme bitmeden yapılan oturum sayılmaz
      if (o.tekrar) continue; // aynı metnin tekrarı: kayıtta durur, seviyeyi ne yükseltir ne düşürür
      const r = oturumSonucu(o, iz, kural);
      if (!r) continue;
      oturum++;
      if (r === 'tam') {
        zayifSeri = 0; tamSeri++;
        if (tamSeri >= (ayar.yukselmeSeri || 1)) {
          gecmis.push({ g: o.g, t: o.t, sv: sv + 1, onceki: sv, neden: (ayar.yukselmeSeri || 1) > 1 ? `${tamSeri} oturum üst üste tam` : 'oturumda hepsi ilk denemede doğru' });
          sv += 1; tamSeri = 0;
        }
      } else if (r === 'zayif') {
        tamSeri = 0; zayifSeri++;
        if (zayifSeri >= kural.dusme.ardisik) {
          if (sv > en) { gecmis.push({ g: o.g, t: o.t, sv: sv - 1, onceki: sv, neden: `${zayifSeri} oturum üst üste zor geçti` }); sv -= 1; }
          zayifSeri = 0;
        }
      } else { tamSeri = 0; zayifSeri = 0; }
    }
    sonuc[iz] = { iz, ad: ayar.ad || iz, sv, kaynak, yerlestirme: yer, gecmis, tamSeri, zayifSeri, oturum, yoklamaBekliyor: !!(yer && !yer.bitti) };
  }
  return sonuc;
}

/** Bir oturumun sonucuna göre bu oturumdan SONRAKİ durumun ne olacağını söyler (arayüz "Seviye 12 → 13" göstermek için). */
export function oturumEtkisi(onceki, sonrasi) {
  if (!onceki || !sonrasi) return { degisti: false };
  return { degisti: sonrasi.sv !== onceki.sv, yon: sonrasi.sv > onceki.sv ? 'yukari' : sonrasi.sv < onceki.sv ? 'asagi' : 'ayni', onceki: onceki.sv, yeni: sonrasi.sv, tamSeri: sonrasi.tamSeri };
}

/** Seviye (1–100) için kaba CEFR yaklaşımı; yalnız yorumlamaya yarar. */
export function cefrYaklasim(sv) {
  if (sv <= 10) return 'A1 başı';
  if (sv <= 25) return 'A1';
  if (sv <= 40) return 'A2';
  if (sv <= 60) return 'A2 sonu–B1 başı';
  if (sv <= 80) return 'B1';
  return 'B2';
}

/** Basamaklı değer tablosu: [[eşik, değer], ...] içinden seviyenin geçtiği son eşiğin değeri. */
export function basamakDeger(tablo, sv) {
  let d = tablo[0]?.[1];
  for (const [esik, deger] of tablo) if (sv >= esik) d = deger;
  return d;
}

/** Hafıza oturumu için liste uzunluğu ve dikkat dağıtıcı sayısı (kural tablolarından). */
export function hafizaPlani(sv, kural) {
  const o = kural.izler.hafiza?.oturum || {};
  return { uzunluk: basamakDeger(o.uzunluk || [[1, 3]], sv), dikkat: basamakDeger(o.dikkat || [[1, 0]], sv) };
}

/** Spor oturumu için hacim (kural tablolarından). */
export function sporPlani(sv, kural) {
  const o = kural.izler.spor?.oturum || {};
  const guc = (o.gucBasamak || [[1, 6]]);
  const [set, tekrar] = guc[Math.min(guc.length, sv) - 1];
  const km = Math.min(o.yuruyusKm?.ust ?? 5, Math.round(((o.yuruyusKm?.bas ?? 1.5) + (o.yuruyusKm?.adim ?? 0.1) * (sv - 1)) * 10) / 10);
  const denge = 1 + Math.min(o.dengeTur?.ust ?? 4, Math.floor((sv - 1) / (o.dengeTur?.her ?? 8)));
  const cevik = 1 + Math.min(o.ceviklikTur?.ust ?? 5, Math.floor((sv - 1) / (o.ceviklikTur?.her ?? 6)));
  return { set, tekrar, km, denge, cevik, zorlanmaUst: o.zorlanmaUst ?? 6 };
}
