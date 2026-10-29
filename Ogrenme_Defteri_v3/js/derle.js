// Bir dersin adımlarını oynatıcının göstereceği sayfalara çevirir.
// Aynı ders + aynı deneme numarası her zaman aynı sayfaları üretir (kaldığın yerden devam edebilmek için).

import { alistirmaUret, soruSayfasi, cumleSayfasi, sayiSayfalari } from './uretici.js';
import { sesYolu, sesSec } from './ses.js';

/** liste-sun adımını bulur. ref "adım" (aynı ders) ya da "ders/adım" (başka ders) olabilir. */
export function listeBul(ders, ref, ctx) {
  const [dersId, adimId] = String(ref).includes('/') ? String(ref).split('/') : [null, ref];
  const kaynak = dersId ? ctx.ders?.(dersId) : ders;
  return kaynak?.adimlar.find((b) => b.tur === 'liste-sun' && b.id === adimId);
}

export function derle(ders, ctx) {
  const tohum = `${ders.id}#${ctx.deneme || 0}`;
  const sayfalar = [];
  const ogrenilenKelimeler = [];
  const srsListeleri = [];
  ders.adimlar.forEach((a, n) => {
    const kimlik = a.id || `a${n + 1}`;
    const bolum = a.bolum || null;
    switch (a.tur) {
      case 'anlat':
        sayfalar.push({ t: 'anlat', adim: a, bolum });
        break;
      case 'kelime-ogren': {
        a.kelimeler.forEach((id, i) => {
          const k = ctx.kelime(id);
          if (k) sayfalar.push({ t: 'kelime', k, no: i + 1, toplam: a.kelimeler.length, ses: { metin: k.en, ses: ctx.sesler.varsayilan }, ornekSes: k.ornek ? { metin: k.ornek.en, ses: ctx.sesler.varsayilan } : null, bolum: 'Yeni kelimeler' });
          ogrenilenKelimeler.push(id);
        });
        break;
      }
      case 'alistirma':
        sayfalar.push(...alistirmaUret({ ...a, bolum: a.bolum || 'Alıştırma' }, ctx, tohum));
        break;
      case 'soru':
        sayfalar.push(soruSayfasi(a, { id: `${ders.id}/${kimlik}`, bolum: a.bolum || ders.baslik, tohum, ses: a.ses }));
        break;
      case 'sahne': {
        const bolumAd = `Sahne: ${a.baslik || kimlik}`;
        sayfalar.push({ t: 'sahne-dinle', sahne: a, id: `${ders.id}/${kimlik}`, bolum: bolumAd });
        a.sorular.forEach((s, i) => sayfalar.push(soruSayfasi(s, { id: `${ders.id}/${kimlik}/q${i + 1}`, bolum: bolumAd, tohum })));
        sayfalar.push({ t: 'sahne-metin', sahne: a, id: `${ders.id}/${kimlik}`, bolum: bolumAd });
        for (const id of a.kelimeler || []) ogrenilenKelimeler.push(id);
        break;
      }
      case 'cumle-kur':
        a.ogeler.forEach((o, i) => sayfalar.push(cumleSayfasi(o, { id: `${ders.id}/${kimlik}/${i + 1}`, bolum: a.bolum || 'Cümle kur', tohum })));
        break;
      case 'dikte':
        a.ogeler.forEach((o, i) => {
          const dil = a.dil || 'en';
          const metin = o.metin || o.en || o.tr;
          const sesK = o.ses ? { url: o.ses } : { metin, ses: dil === 'tr' ? 'tr' : sesSec(ctx.sesler, o.kim), hiz: o.hiz, dil: dil === 'tr' ? 'tr-TR' : 'en-US' };
          sayfalar.push({ t: 'dikte', id: `${ders.id}/${kimlik}/${i + 1}`, no: i + 1, toplam: a.ogeler.length, metin, dil, kabul: [metin, ...(o.kabul || [])], ses: sesK, bolum: a.bolum || 'Dikte', puan: a.puan !== false, sinir: a.sinir, etiket: o.etiket });
        });
        break;
      case 'sayi-dinle':
        sayfalar.push(...sayiSayfalari({ ...a, bolum: a.bolum || 'Sayı dinleme' }, { id: `${ders.id}/${kimlik}`, tohum, ctx }));
        break;
      case 'oku': {
        const bolumAd = a.bolum || `Okuma: ${a.baslik || kimlik}`;
        sayfalar.push({ t: 'oku', adim: a, id: `${ders.id}/${kimlik}`, bolum: bolumAd });
        (a.sorular || []).forEach((s, i) => sayfalar.push({ ...soruSayfasi(s, { id: `${ders.id}/${kimlik}/q${i + 1}`, bolum: bolumAd, tohum }), metinBak: a.kapali ? null : a.metin }));
        if (a.serbest) sayfalar.push({ t: 'serbest', adim: { id: `${kimlik}-serbest`, kip: 'ikisi', ...a.serbest }, id: `${ders.id}/${kimlik}-serbest`, bolum: bolumAd });
        break;
      }
      case 'serbest':
        sayfalar.push({ t: 'serbest', adim: a, id: `${ders.id}/${kimlik}`, bolum: a.bolum || null });
        break;
      case 'dinle': {
        const bolumAd = a.bolum || `Dinleme: ${a.baslik || kimlik}`;
        sayfalar.push({ t: 'dinle', adim: a, id: `${ders.id}/${kimlik}`, bolum: bolumAd, ses: sesKaynak(a.ses, ctx) });
        (a.sorular || []).forEach((s, i) => sayfalar.push(soruSayfasi(s, { id: `${ders.id}/${kimlik}/q${i + 1}`, bolum: bolumAd, tohum })));
        if (a.serbest) sayfalar.push({ t: 'serbest', adim: { id: `${kimlik}-serbest`, kip: 'ikisi', ...a.serbest }, id: `${ders.id}/${kimlik}-serbest`, bolum: bolumAd });
        if (a.metin && a.metinGoster !== 'hic') sayfalar.push({ t: 'dinle-metin', adim: a, id: `${ders.id}/${kimlik}`, bolum: bolumAd, ses: sesKaynak(a.ses, ctx) });
        break;
      }
      case 'liste-sun':
        sayfalar.push({ t: 'liste-sun', adim: a, id: `${ders.id}/${kimlik}`, dersId: ders.id });
        if (a.tekrar) srsListeleri.push(`l:${ders.id}/${kimlik}`);
        break;
      case 'liste-hatirla': {
        const kaynak = listeBul(ders, a.ref, ctx);
        sayfalar.push({ t: 'liste-hatirla', adim: a, id: `${ders.id}/${kimlik}`, liste: kaynak.liste, saray: a.saray || false, baslik: a.baslik || kaynak.baslik, bolum: a.bolum || 'Hatırlama', puan: true });
        break;
      }
      case 'gecikmeli-kur': {
        const kaynak = ders.adimlar.find((b) => b.tur === 'liste-sun' && b.id === a.ref);
        sayfalar.push({ t: 'gecikmeli', adim: a, id: `${ders.id}/${kimlik}`, dersId: ders.id, liste: kaynak.liste, baslik: ders.baslik });
        break;
      }
      case 'saray-kur': sayfalar.push({ t: 'saray-kur', adim: a, id: `${ders.id}/${kimlik}` }); break;
      case 'saray-yerlestir': sayfalar.push({ t: 'saray-yerlestir', adim: a, id: `${ders.id}/${kimlik}` }); break;
      case 'spor': sayfalar.push({ t: 'spor', adim: sporCoz(a, ctx), id: `${ders.id}/${kimlik}`, dersId: ders.id }); break;
      case 'dis': sayfalar.push({ t: 'dis', adim: a, id: `${ders.id}/${kimlik}`, uygulama: ctx.dis(a.uygulama) }); break;
      case 'olcek': sayfalar.push({ t: 'olcek', adim: a, id: `${ders.id}/${kimlik}` }); break;
      default: break;
    }
  });
  return { sayfalar, ogrenilenKelimeler: [...new Set(ogrenilenKelimeler)], srsListeleri };
}

/** Spor adımındaki { ref, set, tekrar } girişlerini hareket kitaplığındaki tanımla birleştirir (hareketin anlatımı tek yerde durur). */
export function sporCoz(a, ctx) {
  return {
    ...a,
    bolumler: a.bolumler.map((b) => (b.tur === 'mesafe' ? b : {
      ...b,
      hareketler: b.hareketler.map((m) => (m.ref ? { ...(ctx.hareket?.(m.ref) || { id: m.ref, ad: m.ref, adimlar: [] }), ...m, id: m.ref } : m)),
    })),
  };
}

export function sesKaynak(s, ctx) {
  if (!s) return null;
  if (typeof s === 'string') return { url: s };
  return { metin: s.metin, ses: s.ses || ctx.sesler.varsayilan, hiz: s.hiz };
}

/** Sahne satırının ses kaynağı: konuşmacıya göre ses modeli */
export function satirSesi(satir, ctx) {
  if (satir.ses) return { url: satir.ses };
  return { metin: satir.en, ses: sesSec(ctx.sesler, satir.kim) };
}
export { sesYolu };
