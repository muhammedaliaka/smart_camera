// Çalışma raporu: öğrencinin yaptıklarını, bir yapay zekâ ya da öğretmenin karıştırmadan okuyabileceği Markdown'a çevirir.
// Saf bir fonksiyondur (ekrana, depoya ya da tarayıcıya dokunmaz); böylece testle denetlenebilir.
//
// İlke: Rapordaki her satır tek başına anlaşılır olmalı. Yani "hangi ders, ne sorulmuş, öğrenci ne yanıtlamış,
// doğrusu neymiş" ayrıca tahmin edilmez; kayıt anında bağlamıyla birlikte saklanır (bkz. store.olay).

import { IZLER } from './paket.js';
import { ozet as srsOzet } from './srs.js';
import { gunFarki, uzunTarih } from './zaman.js';

/** Raporda ayrı bir biçimi olan kayıt türleri. Yeni bir olay türü eklenirse buraya biçim yazılmalıdır (test denetler). */
export const RAPOR_TURLERI = new Set([
  'ders-bitir', 'soru', 'serbest', 'serbest-kontrol', 'liste-sun', 'liste', 'gecikmeli-kur', 'gecikmeli-yanit',
  'saray', 'saray-hayal', 'dinleme', 'okuma', 'olcek', 'spor', 'dis', 'oyun',
]);
/** Raporda tek tek yazılmayan kayıt türleri ve nedeni. */
export const RAPOR_ATLANAN = {
  'ders-basla': 'Dersin başladığını gösterir; bitiş kaydı ve soru kayıtları zaten yazılır.',
  srs: 'Tekrar sistemindeki kutu hareketidir; yanıtın kendisi soru kaydında vardır, kutu durumu “Tekrar sistemi” başlığında özetlenir.',
};

const YARDIM_AD = {
  A0: 'yardımsız yaptı', A1: 'ipucu ya da araç kullandı', A3: 'kitap, sözlük ya da video kullandı', A4: 'yapay zekâ ya da çeviri aracı kullandı',
};
const KONTROL_AD = { '5dk': '5 dakika sonra', '30dk': '30 dakika sonra', '2sa': '2 saat sonra', '1gun': 'ertesi gün', '7gun': '1 hafta sonra' };
const KIP_ACIKLAMA = {
  Oyun: 'Öğrenilmiş kelimelerle kısa bir oyun; yeni bilgi öğretmez.',
  'Tekrar oturumu': 'Aralıklı tekrar: daha önce öğrenilen kelimeler ve listeler, belirli günler geçtikten sonra yeniden soruluyor.',
  'Gecikmeli hatırlama kontrolü': 'Öğrenciden bir süre önce çalıştığı bilgiyi bakmadan hatırlaması isteniyor.',
  'Dış uygulama': 'Öğrenci uygulama dışındaki bir programda (örneğin Voscreen, Busuu) çalıştı ve sonucu elle girdi.',
};
const IZ_EK = { oyun: 'Oyunlar', dis: 'Dış uygulamalar', diger: 'Diğer' };

const tirnak = (m) => `“${String(m ?? '').replace(/\s+/g, ' ').trim()}”`;
const hucre = (m) => String(m ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const yuzde = (d, t) => (t ? Math.round((d / t) * 100) : null);
const sn = (ms) => `${Math.round((ms || 0) / 1000)} sn`;
const liste = (a) => (a || []).join(', ');
const sayiMetni = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(1));

function izAdi(iz) { return IZLER[iz]?.ad || IZ_EK[iz] || iz || 'Diğer'; }

/**
 * @param {object} p
 * @param {object} p.durum   store durumu (olaylar, bag, srs, gecikmeli, baslangic, ad)
 * @param {object} p.oku     { ders(id) -> {baslik, iz}|null, kelime(id) -> {en, tr}|null } (içerikten; bulunamazsa kayıttaki bilgi kullanılır)
 * @param {string} [p.bas]   ilk gün (YYYY-AA-GG), yoksa en baştan
 * @param {string} [p.son]   son gün, yoksa en sona
 * @param {string} p.bugun   bugünün tarihi
 * @param {'kisa'|'tam'} [p.ayrinti]  kisa: doğru bilinenler tek tek yazılmaz; tam: her soru yazılır
 * @param {string} [p.surum] uygulama sürümü
 */
export function raporUret({ durum, oku = {}, bas = null, son = null, bugun, ayrinti = 'kisa', surum = '' }) {
  const bag = durum.bag || {};
  const B = (o) => (o.b && bag[o.b]) || {};
  const tum = durum.olaylar || [];
  const olaylar = tum.filter((o) => (!bas || o.g >= bas) && (!son || o.g <= son)).sort((a, b) => a.t.localeCompare(b.t));
  const dersBul = (id) => (oku.ders ? oku.ders(id) : null);
  const satir = [];
  const L = (s = '') => satir.push(s);

  const gunNo = (g) => (durum.baslangic && g >= durum.baslangic ? gunFarki(durum.baslangic, g) + 1 : null);
  const gunler = [...new Set(olaylar.map((o) => o.g))];
  const tumGunler = new Set(tum.map((o) => o.g)).size;
  const ilkler = olaylar.filter((o) => o.tur === 'soru' && o.ilk && !o.puansiz);
  const dogruSay = ilkler.filter((o) => o.dogru).length;
  const aralikMetni = bas || son ? `${bas || 'en baştan'} – ${son || 'bugüne kadar'}` : 'tüm kayıtlar';

  // ---------- Başlık ve okuma kılavuzu ----------
  L('# Öğrenme Defteri · Çalışma raporu'); L();
  L('Bu rapor, bir öğrencinin “Öğrenme Defteri” uygulamasında yaptığı çalışmaları anlatır. Uygulama tarafından otomatik hazırlanmıştır; bir öğretmenin ya da yapay zekâ asistanının okuyup değerlendirmesi için yazılmıştır. Öğrenci Türkçe konuşan bir lise öğrencisidir ve İngilizce, hafıza teknikleri, okuma, dinleme ve spor çalışır.'); L();
  L('## Nasıl okunur'); L();
  L('- **Soru satırı:** Her satır tek bir sorudur. Köşeli parantezde öğrenciden ne istendiği yazar. `Soru` uygulamanın sorduğudur; `Duyulan` varsa öğrenci bir ses dinlemiştir (sesin yazısı verilir); `Öğrenci` öğrencinin verdiği yanıttır; `Doğru` uygulamadaki doğru yanıttır.');
  L('- **✔ / ✘:** Yalnız tek doğru yanıtı olan sorular işaretlenir. “İlk deneme”, öğrencinin soruyu ilk gördüğündeki yanıtıdır. Yanlışlar ders sonunda yeniden sorulur; bunlar `(tekrar)` diye yazılır ve yüzdeye katılmaz.');
  L('- **Puanlanmayan kayıtlar:** Yazı, konuşma ve hayal kurma gibi açık uçlu yanıtlar puanlanmaz; öğrencinin yazdığı olduğu gibi aktarılır. Uygulamanın gösterdiği örnek yanıt tek doğru değildir. Ses kayıtlarının içeriği rapora girmez, yalnız süresi yazılır.');
  L('- **Beyan:** `Beyan` etiketli bilgiler (yardım alıp almadığı, zorlanma 0–10, satır sayımı, dış uygulama sonucu) öğrencinin kendi söylediğidir; uygulama bunları doğrulayamaz.');
  L('- **Tarih:** YYYY-AA-GG. “Gün N”, öğrencinin programının N. günüdür; hafta sonu ya da ara verilen günler de sayılır.');
  L('- **Yüzde:** 10’dan az soruya dayanan yüzde kesin bir şey söylemez.');
  L(`- **Kapsam:** ${ayrinti === 'tam' ? 'Bu rapor TAM kiptedir: her soru tek tek yazılmıştır.' : 'Bu rapor KISA kiptedir: ilk denemede doğru bilinen sorular tek tek yazılmaz, yalnız sayılır; yanlışlar, açık uçlu yanıtlar ve diğer tüm kayıtlar eksiksiz yazılır.'}`);
  L();

  // ---------- Öğrenci ve dönem ----------
  L('## Öğrenci ve dönem'); L();
  L(`- Ad: ${durum.ad ? durum.ad : '(belirtilmemiş)'}`);
  L(`- Program başlangıcı: ${durum.baslangic || '(ayarlanmamış)'}${durum.baslangic && bugun >= durum.baslangic ? ` · bugün programın ${gunFarki(durum.baslangic, bugun) + 1}. günü` : ''}`);
  L(`- Rapor aralığı: ${aralikMetni} · Rapor tarihi: ${bugun}${surum ? ` · Uygulama sürümü ${surum}` : ''}`);
  L(`- Aralıkta çalışılan gün: ${gunler.length} · Başlangıçtan beri toplam çalışılan gün: ${tumGunler}`);
  if (!olaylar.length) { L(); L('Bu aralıkta kayıt yok.'); L(); return satir.join('\n'); }
  L();

  // ---------- Özet ----------
  L('## Özet'); L();
  const bitenler = olaylar.filter((o) => o.tur === 'ders-bitir');
  L(`- Tek doğru yanıtlı sorular, ilk denemede: **${dogruSay}/${ilkler.length}**${ilkler.length ? ` (%${yuzde(dogruSay, ilkler.length)})` : ''}`);
  const anlama = ilkler.filter((o) => /^(Sahne|Dinleme|Okuma):/.test(B(o).bolum || o.bolum || ''));
  if (anlama.length) L(`- Dinleyip/okuyup anlama soruları, ilk denemede: ${anlama.filter((o) => o.dogru).length}/${anlama.length} (%${yuzde(anlama.filter((o) => o.dogru).length, anlama.length)})`);
  L(`- Bitirilen ders (aralıkta): ${bitenler.length}${bitenler.length ? ' — ' + [...new Set(bitenler.map((o) => B(o).dersAd || dersBul(o.ders)?.baslik || o.ders))].join('; ') : ''}`);
  const serbestler = olaylar.filter((o) => o.tur === 'serbest');
  if (serbestler.length) L(`- Açık uçlu yanıt: ${serbestler.length} (yazı ${serbestler.filter((o) => o.kip === 'yaz').length}, ses ${serbestler.filter((o) => o.kip === 'ses').length}, “bilmiyorum” ${serbestler.filter((o) => o.kip === 'bilmiyorum').length})`);
  const sporlar = olaylar.filter((o) => o.tur === 'spor').length, disler = olaylar.filter((o) => o.tur === 'dis').length;
  if (sporlar || disler) L(`- Spor kaydı: ${sporlar} · Dış uygulama kaydı: ${disler}`);
  L();

  if (ilkler.length) {
    const iz = {};
    for (const o of ilkler) {
      const k = B(o).iz || dersBul(o.ders)?.iz || (String(o.ders).startsWith('oyun') ? 'oyun' : 'diger');
      const e = iz[k] || (iz[k] = { d: 0, t: 0 });
      e.t++; if (o.dogru) e.d++;
    }
    L('| Konu | Soru (ilk deneme) | Doğru | Yüzde |'); L('|---|---:|---:|---:|');
    for (const [k, e] of Object.entries(iz)) L(`| ${hucre(izAdi(k))} | ${e.t} | ${e.d} | %${yuzde(e.d, e.t)} |`);
    L();
  }

  // En çok karıştırılanlar
  const yanlislar = new Map();
  for (const o of olaylar.filter((x) => x.tur === 'soru' && x.ilk && !x.dogru && !x.puansiz && B(x).tur !== 'liste-hatirla')) {
    const b = B(o);
    const anahtar = `${b.soru || o.id}|${b.duyulan || ''}|${b.dogruCevap || ''}`;
    const e = yanlislar.get(anahtar) || { soru: b.soru || o.id, duyulan: b.duyulan || '', dogru: b.dogruCevap || '', yanitlar: new Map(), sayi: 0, tur: [b.gorev || b.tur, b.bolum].filter(Boolean).join(' · ') };
    e.sayi++; e.yanitlar.set(o.yanit || '(boş)', (e.yanitlar.get(o.yanit || '(boş)') || 0) + 1);
    yanlislar.set(anahtar, e);
  }
  if (yanlislar.size) {
    L('### En çok karıştırılanlar'); L();
    L('Tekrar edilmesi gerekenler (yanlış sayısına göre):'); L();
    [...yanlislar.values()].sort((a, b) => b.sayi - a.sayi).slice(0, 12).forEach((e, i) => {
      const yanitlar = [...e.yanitlar].map(([y, n]) => `${tirnak(y)}${n > 1 ? ` (${n} kez)` : ''}`).join(', ');
      L(`${i + 1}. ${e.tur ? `[${e.tur}] ` : ''}Soru: ${tirnak(e.soru)}${e.duyulan ? ` · Duyulan: ${tirnak(e.duyulan)}` : ''} · Doğru: ${tirnak(e.dogru)} · Öğrencinin yanıtları: ${yanitlar} · ${e.sayi} yanlış`);
    });
    L();
  }

  // Tekrar sistemi
  const oz = srsOzet(durum.srs || {}, bugun);
  if (oz.toplam) {
    L('### Tekrar sistemi (şu anki durum)'); L();
    L(`Aralıklı tekrar kuralı: öğrenildikten 3, sonra 10, 20 ve 50 gün sonra yeniden sorulur. Şu an sistemde ${oz.toplam} madde var; bugün vadesi gelen ${oz.vadesi}, yarın ${oz.yarin}, önümüzdeki 7 günde ${oz.hafta}, tamamen oturan ${oz.bitti}.`);
    L();
  }
  const bekleyen = (durum.gecikmeli || []).flatMap((g) => g.kontroller.filter((k) => !k.yapildi).map((k) => ({ g, k })));
  if (bekleyen.length) { L(`Yanıtlanmayı bekleyen gecikmeli hatırlama kontrolü: ${bekleyen.length} (${[...new Set(bekleyen.map((x) => x.g.baslik))].join('; ')}).`); L(); }

  // ---------- Günlük kayıt ----------
  L('## Günlük kayıt'); L();
  L('Her gün için dersler/etkinlikler sırayla verilmiştir.'); L();

  const kontrolEslesme = new Map(olaylar.filter((o) => o.tur === 'serbest-kontrol').map((o) => [o.olay, o]));
  const gunlukGrup = new Map();
  for (const o of olaylar) {
    if (RAPOR_ATLANAN[o.tur]) continue;
    const g = gunlukGrup.get(o.g) || new Map();
    const anahtar = o.ders || `(${o.tur})`;
    (g.get(anahtar) || g.set(anahtar, []).get(anahtar)).push(o);
    gunlukGrup.set(o.g, g);
  }

  for (const [g, gruplar] of gunlukGrup) {
    const n = olaylar.find((o) => o.g === g && o.gn)?.gn ?? gunNo(g);
    L(`### ${g} · ${n ? `Gün ${n} · ` : ''}${uzunTarih(g)}`); L();
    for (const [dersId, ev] of gruplar) {
      const b0 = B(ev.find((o) => o.b) || {});
      const ders = dersBul(dersId);
      const ad = b0.dersAd || ders?.baslik || dersId;
      const iz = b0.iz || ders?.iz;
      const tur = String(dersId).startsWith('oyun:') ? 'Oyun' : String(dersId).startsWith('tekrar:') ? 'Tekrar oturumu' : String(dersId).startsWith('hatirla:') ? 'Gecikmeli hatırlama kontrolü' : String(dersId).startsWith('dis:') ? 'Dış uygulama' : 'Ders';
      L(`#### ${tur}: ${tirnak(ad)}${iz && tur === 'Ders' ? ` (${izAdi(iz)})` : ''}${tur === 'Ders' ? ` · kod: ${dersId}` : ''}`); L();
      const aciklama = KIP_ACIKLAMA[tur] || (ders?.hedef ? `Dersin amacı: ${String(ders.hedef).replace(/\s+/g, ' ')}` : null);
      if (aciklama) L(`- ${aciklama}`);
      const bitis = ev.find((o) => o.tur === 'ders-bitir');
      if (tur === 'Ders') {
        if (bitis) {
          L(`- Durum: o gün tamamlandı${bitis.toplam ? ` — ilk denemede ${bitis.dogru}/${bitis.toplam} doğru (%${bitis.yuzde})` : ''}.${bitis.bolumler?.length > 1 ? ' Bölümler: ' + bitis.bolumler.map(([a, d, t]) => `${a} ${d}/${t}`).join('; ') + '.' : ''}`);
        } else L('- Durum: o gün tamamlanmadı (yarım kaldı ya da başka gün bitirildi).');
      }
      let dogruAtlanan = 0;
      for (const o of ev) {
        if (o.tur === 'ders-bitir' || o.tur === 'serbest-kontrol') continue;
        if (o.tur === 'soru' && B(o).tur === 'liste-hatirla') continue; // ayrıntısı "liste" kaydında
        if (o.tur === 'soru' && o.ilk && o.dogru && ayrinti !== 'tam') { dogruAtlanan++; continue; }
        const metin = bicimle(o, B(o), kontrolEslesme, oku);
        if (metin) for (const m of metin) L(m);
      }
      if (dogruAtlanan) L(`- ✔ İlk denemede doğru bilinen ${dogruAtlanan} soru tek tek yazılmadı (kısa kip).`);
      L();
    }
  }

  L('## Bu raporun sınırları'); L();
  L('- Uygulamanın dışında yapılan çalışmalar (kitap, ders, dış uygulamalar) yalnız öğrencinin girdiği kadarıyla görünür.');
  L('- Ses kayıtlarının içeriği rapora girmez; konuşma yanıtlarında yalnız süre vardır.');
  L('- Kayıt alanı dolarsa çok eski günlerin bazı ayrıntıları (yanlışta gösterilen seçenekler, doğru yanıtların yazısı) kendiliğinden sadeleşir; soru, doğru/yanlış sonucu ve tarih her zaman kalır.');
  L('- Bu rapor bir değerlendirme değildir; öğretmen ya da yapay zekâ yorumu için ham veridir.');
  return satir.join('\n');
}

/** Bir kaydı rapor satır(lar)ına çevirir. Tanımlı olmayan türler de atlanmaz (ham veri olarak yazılır). */
function bicimle(o, b, kontrolEslesme, oku) {
  const bolum = b.bolum || o.bolum;
  const etiket = (ad) => `[${ad}${bolum ? ` · ${bolum}` : ''}]`;
  switch (o.tur) {
    case 'soru': {
      const ok = o.dogru ? '✔' : '✘';
      const tekrar = o.ilk ? '' : '(tekrar) ';
      const bos = !b.soru && !b.dogruCevap;
      const parca = [];
      const kayitsiz = (b.tur === 'eslestir' || b.tur === 'kartlar');
      if (bos) parca.push('Soru metni bu kayıtta yok (eski sürümden kalma)');
      else if (!kayitsiz) parca.push(`Soru: ${tirnak(b.soru)}`);
      if (b.duyulan && b.duyulan.toLowerCase() !== String(b.dogruCevap || '').toLowerCase()) parca.push(`Duyulan: ${tirnak(b.duyulan)}`); // dikte'de duyulan zaten doğru yanıttır
      parca.push(`Öğrenci: ${tirnak(o.yanit || '(boş)')}`);
      if (b.dogruCevap) parca.push(`${kayitsiz ? 'Çiftler' : 'Doğru'}: ${kayitsiz ? b.dogruCevap : tirnak(b.dogruCevap)}`);
      if (!o.dogru && o.sec?.length) parca.push(`Ekrandaki seçenekler: ${o.sec.join(' / ')}`);
      if (o.ayrinti) parca.push(`Ayrıntı: ${Object.entries(o.ayrinti).map(([k, v]) => `${k === 'sozcuk' ? 'sözcük eşleşmesi' : k === 'calma' ? 'dinleme sayısı' : k} ${v}`).join(', ')}`);
      if (o.puansiz) parca.push('puanlanmadı (ölçüm kaydı)');
      return [`- ${ok} ${tekrar}${etiket(b.gorev || b.tur || 'Soru')} ${parca.join(' · ')}`];
    }
    case 'serbest': {
      const baslik = `- ${etiket('Açık uçlu yanıt')} Soru: ${tirnak(o.soru)}${o.dil ? ` · Dil: ${o.dil}` : ''}`;
      const cikti = [];
      if (o.kip === 'yaz') {
        cikti.push(`${baslik} · Öğrenci yazdı (${o.sozcuk ?? '?'} sözcük):`);
        for (const s of String(o.yanit || '').split(/\n/)) cikti.push(`  > ${s}`);
      } else if (o.kip === 'ses') cikti.push(`${baslik} · Öğrenci sesli yanıt verdi (${sn(o.sureMs)}; kaydın içeriği rapora girmez).`);
      else cikti.push(`${baslik} · Öğrenci “bilmiyorum” dedi.`);
      const k = kontrolEslesme.get(o.i);
      if (k) {
        cikti.push(`  - Beyan: yardım durumu = ${YARDIM_AD[k.yardim] || k.yardim || 'sorulmadı'}`);
        if (k.noktalar) {
          const bul = k.noktalar.secilen || [], yok = (k.noktalar.tumu || []).filter((x) => !bul.includes(x));
          cikti.push(`  - Beyan: öğrenciye göre yanıtında bulunan noktalar ${k.noktalar.var}/${k.noktalar.toplam}${bul.length ? ` — bulunan: ${liste(bul)}` : ''}${yok.length ? `; bulunmayan: ${liste(yok)}` : ''}`);
        }
      }
      if (b.ornek) cikti.push(`  - Uygulamanın gösterdiği örnek yanıt (tek doğru değildir): ${tirnak(b.ornek)}`);
      return cikti;
    }
    case 'liste': {
      const yanit = (o.yanit || []).filter(Boolean);
      return [`- ${etiket('Liste hatırlama')} “${b.baslik || 'Liste'}”${b.rota ? ` (rota: ${b.rota})` : ''} · Listedeki öğeler, sırayla: ${liste(b.anahtar)} · Öğrencinin yazdıkları: ${yanit.length ? liste(yanit) : '(hiçbir şey)'} · Hatırlanan: ${o.var}/${o.toplam}, doğru yerde: ${o.sirali}${o.yenidenBaktim ? ' · Beyan: listeye yeniden baktı' : ''}`];
    }
    case 'liste-sun': return [`- ${etiket('Liste gösterildi')} “${b.baslik || 'Liste'}” · ${b.adet ?? '?'} öğe · öğrenci ${sn(o.sureMs)} baktı${o.tekrar ? ' (tekrar)' : ''}`];
    case 'gecikmeli-kur': return [`- ${etiket('Gecikmeli hatırlama kuruldu')} “${b.baslik || ''}” · Daha sonra sorulacak: ${tirnak(b.soru)} · Kontrol zamanları: ${(o.kontroller || []).map((k) => KONTROL_AD[k] || k).join(', ')}`];
    case 'gecikmeli-yanit': {
      const anahtar = Array.isArray(b.anahtar) ? liste(b.anahtar) : b.anahtar;
      return [`- ${o.dogru ? '✔' : '✘'} [Gecikmeli hatırlama · ${KONTROL_AD[o.kontrol] || o.kontrol}] “${b.baslik || ''}” · Soru: ${tirnak(b.soru)} · Öğrenci: ${tirnak(o.yanit)} · Doğru: ${tirnak(anahtar)}${o.ayrinti ? ` · ${o.ayrinti}` : ''}${o.yenidenBaktim ? ' · Beyan: arada bilgiye yeniden baktı' : ''} · Kontrol zamanından ${o.gecikmeSn >= 60 ? Math.round(o.gecikmeSn / 60) + ' dk' : (o.gecikmeSn || 0) + ' sn'} sonra yanıtladı`];
    }
    case 'saray': return [`- ${etiket('Hafıza sarayı kuruldu')} Rota ${tirnak(b.ad || o.rota)}: ${(o.duraklar || []).join(' → ')}`];
    case 'saray-hayal': return [`- ${etiket('Hafıza sarayı · hayal kurma')} Rota ${tirnak(b.rota || '')} (puanlanmaz; öğrencinin yazdıkları):`, ...(o.hayaller || []).map((h) => `  - ${h.durak} durağı ← ${h.nesne}: ${h.hayal ? tirnak(h.hayal) : '(boş bıraktı)'}`)];
    case 'dinleme': return [`- ${etiket('Dinleme')} ${b.baslik ? tirnak(b.baslik) + ' · ' : ''}Öğrenci ${o.sayi} kez dinledi${o.sinir ? ` (en çok ${o.sinir} hakkı vardı)` : ''}`];
    case 'okuma': return [`- ${etiket('Okuma')}${o.kosul ? ` koşul ${o.kosul}:` : ''} ${tirnak(b.baslik || '')}${o.satirKaybi !== undefined || o.geriDonus !== undefined ? ` · Beyan: satır kaybı ${o.satirKaybi ?? '-'}; geri dönüş ${o.geriDonus ?? '-'}` : ' · okundu olarak işaretlendi'}`];
    case 'olcek': {
      const uc = [b.altEtiket ? `${b.min} = ${b.altEtiket}` : null, b.ustEtiket ? `${b.max} = ${b.ustEtiket}` : null].filter(Boolean);
      return [`- ${etiket('Ölçek')} Soru: ${tirnak(b.soru)} (${b.min}–${b.max}${uc.length ? '; ' + uc.join(', ') : ''}) · Beyan: ${o.deger}`];
    }
    case 'spor': {
      const y = (o.yapilanlar || []).map((x) => `${x.ad}: ${sayiMetni(x.yapilan)} ${x.birim}${x.hedef ? ` (hedef: ${x.hedef})` : ''}`);
      return [`- ${etiket('Spor kaydı')} ${b.baslik ? tirnak(b.baslik) + ' · ' : ''}Yapılanlar: ${y.length ? y.join('; ') : '(ayrıntı yok)'} · Beyan: zorlanma ${o.zorlanma ?? '-'}/10 (0 çok rahat, 10 çok zor)${o.destek ? ', destek kullandı' : ''}${o.kismi ? ', planın bir kısmını yaptı' : ', planı tamamladı'}${o.not ? ` · Not: ${tirnak(o.not)}` : ''}`];
    }
    case 'dis': return [`- ${etiket('Dış uygulama')} ${o.ad || o.uygulama} · Görev: ${tirnak(o.gorev)} · ${o.yapilmadi ? 'Beyan: bugün yapmadı' : o.dogru != null && o.toplam ? `Beyan: ${o.dogru}/${o.toplam} doğru (%${o.yuzde})` : 'Sonuç girilmedi'}${o.not ? ` · Not: ${tirnak(o.not)}` : ''}`];
    case 'oyun': return [`- ${etiket(`Oyun · ${b.oyunAd || o.oyun}`)} İlk denemede ${o.dogru}/${o.toplam} doğru (%${o.yuzde})`];
    default: {
      const { i, t, g, gn, tur, b: _b, ...veri } = o;
      return [`- [Tanımsız kayıt türü: ${tur}] ${JSON.stringify(veri)}`];
    }
  }
}
