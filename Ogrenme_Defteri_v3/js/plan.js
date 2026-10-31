// Günlük plan: bir program gününde ne yapılacağını söyler. Saf işlev (tarayıcıya bağlı değil); Bugün sayfası, "sıradaki" düğmesi ve MCP sunucusu aynı planı kullanır.
//
// Görev türleri:
//   ders     yazılmış bir ders (gün gün yazılmış günlerde ya da seviyene uygun sıradaki ders önerisi)
//   yoklama  ilk haftadaki seviye yoklaması (beceri başına günde en çok 1; yerleştirme bitince görünmez)
//   oturum   seviye oturumu (gerçek çalışma): seviyene göre kurulan kısa oturum
//
// Gün gün yazılmış günler (program.json haftalar) önceliklidir; bunların dışındaki günler "seviyeli" desenden gelir.

import { seviyeler, izlerListesi } from './seviye.js';

/** Dersin seviyeli havuza girebilmesi: seviye (sv) taşır, gün gün yazılmış bir günde değildir. */
export function havuzDersleri(ic, idx, iz) {
  return ic.dersler.filter((d) => d.iz === iz && Number.isFinite(d.sv) && !idx.dersGunu.has(d.id));
}

/** Seviyene uygun sıradaki yazılmış ders (bitmemiş; seviye penceresinde; en düşük sv önce). Yoksa null. */
export function sonrakiHavuzDersi(ic, idx, durum, iz, sv, pencere = [-6, 3]) {
  const aday = havuzDersleri(ic, idx, iz).filter((d) => !durum.dersler[d.id]?.bitti && d.sv >= sv + pencere[0] && d.sv <= sv + pencere[1]);
  aday.sort((a, b) => a.sv - b.sv || a.id.localeCompare(b.id));
  return aday[0] || null;
}

const bugunMu = (o, bugun) => o.g === bugun;

/**
 * @param {object} p { no, ic, idx, durum, kural, bugun }
 * @returns {{ no, hafta, tur: 'yazili'|'seviyeli'|'bos', baslik, hedef, gorevler: object[], seviye: object }}
 */
export function gunPlani({ no, ic, idx, durum, kural, bugun }) {
  const sv = seviyeler(durum.olaylar, kural, { programGunu: no });
  const hafta = Math.ceil(no / 7);
  const acik = idx.gunler.get(no) || null;
  const gorevler = [];
  const yer = kural.yerlestirme;
  const bugunOlay = durum.olaylar.filter((o) => bugunMu(o, bugun));

  // 1) Yerleştirme günleri: bitmemiş becerilerin yoklaması (en başta, ön-test olarak)
  if (no >= yer.ilkGun && no <= yer.sonGun) {
    for (const iz of izlerListesi(kural)) {
      const s = sv[iz];
      if (!kural.izler[iz].yerlestirme || !s.yoklamaBekliyor) continue;
      const yapildi = bugunOlay.some((o) => o.tur === 'yerlestirme' && o.iz === iz);
      gorevler.push({ tur: 'yoklama', iz, hedefSv: s.yerlestirme.sonraki, bitti: yapildi, istege: false, anahtar: `yoklama:${iz}`, no: s.yerlestirme.yoklamalar.length + 1 });
    }
  }

  // 2) Gün gün yazılmış görevler
  if (acik) for (const t of acik.gorevler || []) gorevler.push({ tur: 'ders', ders: t.ders, istege: !!t.istege, bitti: !!durum.dersler[t.ders]?.bitti, anahtar: `ders:${t.ders}` });

  // 3) Seviyeli desen: her gün için (gün gün yazılmış günlerde de) seviye oturumları. Yerleştirmesi süren becerinin oturumu yoktur; yerine yoklaması vardır.
  let tur = acik ? 'yazili' : 'bos';
  const sd = ic.seviyeli;
  if (sd && no >= (sd.baslangicGunu || 1)) {
    if (!acik) tur = 'seviyeli';
    const desen = sd.desen[(no - (sd.baslangicGunu || 1)) % sd.desen.length] || [];
    for (const g of desen) {
      if (g.oturum) {
        if (!sv[g.oturum] || sv[g.oturum].yoklamaBekliyor) continue;
        const yapildi = bugunOlay.some((o) => o.tur === 'seviye-oturum' && o.iz === g.oturum);
        gorevler.push({ tur: 'oturum', iz: g.oturum, sv: sv[g.oturum].sv, istege: !!g.istege, bitti: yapildi, anahtar: `oturum:${g.oturum}` });
        const ders = sonrakiHavuzDersi(ic, idx, durum, g.oturum, sv[g.oturum].sv, kural.izler[g.oturum]?.oturum?.pencere);
        if (ders && !gorevler.some((x) => x.ders === ders.id)) gorevler.push({ tur: 'ders', ders: ders.id, istege: true, oneri: true, bitti: false, anahtar: `ders:${ders.id}` });
      } else if (g.ders) {
        gorevler.push({ tur: 'ders', ders: g.ders, istege: !!g.istege, bitti: !!durum.dersler[g.ders]?.bitti && bugunOlay.some((o) => o.tur === 'ders-bitir' && o.ders === g.ders), anahtar: `ders:${g.ders}` });
      }
    }
  }
  const yerGunu = no >= yer.ilkGun && no <= yer.sonGun && gorevler.some((g) => g.tur === 'yoklama');
  const baslik = acik?.baslik || (yerGunu ? 'Seviye yoklaması günü' : tur === 'seviyeli' ? 'Seviyene göre bugünün çalışması' : null);
  const hedef = acik?.hedef || (yerGunu ? 'Her beceride kısa yoklama: nereden başlayacağını bulalım. Not değil, yalnız yer bulma; bilmediğine "Bilmiyorum" de.' : tur === 'seviyeli' ? 'Her beceride seviyene uygun kısa oturum; hepsi ilk denemede doğruysa seviye yükselir.' : null);
  return { no, hafta, tur, baslik, hedef, gorevler, seviye: sv };
}

/** Bir görevin açılacağı adres. */
export function gorevAdresi(g) {
  if (g.tur === 'yoklama') return `#/yoklama/${g.iz}`;
  if (g.tur === 'oturum') return `#/seviye/${g.iz}`;
  return `#/ders/${g.ders}`;
}
