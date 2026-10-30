// Paket birleştirme. İçeriğin tamamı "paket" JSON dosyalarından gelir (icerik/ klasörü ve uygulamadan içe aktarılanlar).
// Aynı kimlik iki pakette varsa HATA verilir; kullanıcı paketi bir kimliği bilerek değiştirecekse "degistir": true yazar.

export const IZLER = {
  ingilizce: { ad: 'İngilizce', simge: '🇬🇧', aciklama: 'Kelime, kalıp, sahne ve dikte' },
  hafiza: { ad: 'Hafıza sarayı', simge: '🏛️', aciklama: 'Yerlere bağlayarak hatırla' },
  okuma: { ad: 'Okuma', simge: '📖', aciklama: 'Gerçek konularda kısa metinler' },
  dinleme: { ad: 'Dinleme', simge: '🎧', aciklama: 'Duyduğunu yakala, anla, hatırla' },
  spor: { ad: 'Spor', simge: '🏃', aciklama: 'Yürüyüş, güç, denge, çeviklik' },
  olcum: { ad: 'Ölçüm günleri', simge: '📝', aciklama: 'Başlangıç kayıtların' },
};

export function bosIcerik() {
  return { paketler: [], kelimeler: [], hareketler: [], dersler: [], haftalar: [], disUygulamalar: [], sesler: { varsayilan: 'anlatici', konusmacilar: {} }, seviye: {}, seviyeli: null, hafizaHavuzu: [], cakismalar: [] };
}

/** paketler: [{ paket, ad, surum, kelimeler?, hareketler?, dersler?, haftalar?, disUygulamalar?, sesler?, kaynak? }] */
export function birlestir(paketler) {
  const ic = bosIcerik();
  const kelimeYeri = new Map(), dersYeri = new Map(), disYeri = new Map(), hareketYeri = new Map();
  const ekleKoleksiyon = (liste, hedef, yer, paketAd, tur) => {
    for (const oge of liste || []) {
      if (!oge || !oge.id) { ic.cakismalar.push(`${paketAd}: kimliksiz ${tur}`); continue; }
      if (yer.has(oge.id)) {
        if (oge.degistir) {
          hedef[hedef.findIndex((x) => x.id === oge.id)] = { ...oge, _paket: paketAd };
          yer.set(oge.id, paketAd);
        } else ic.cakismalar.push(`${tur} kimliği iki yerde: "${oge.id}" (${yer.get(oge.id)} ve ${paketAd})`);
        continue;
      }
      yer.set(oge.id, paketAd);
      hedef.push({ ...oge, _paket: paketAd });
    }
  };
  for (const p of paketler) {
    const ad = p.paket || p.kaynak || '?';
    ic.paketler.push({ paket: ad, ad: p.ad || ad, surum: p.surum || 1, kaynak: p.kaynak || 'yerel' });
    ekleKoleksiyon(p.kelimeler, ic.kelimeler, kelimeYeri, ad, 'kelime');
    ekleKoleksiyon(p.hareketler, ic.hareketler, hareketYeri, ad, 'hareket');
    ekleKoleksiyon(p.dersler, ic.dersler, dersYeri, ad, 'ders');
    ekleKoleksiyon(p.disUygulamalar, ic.disUygulamalar, disYeri, ad, 'dış uygulama');
    for (const h of p.haftalar || []) {
      const var_ = ic.haftalar.find((x) => x.hafta === h.hafta);
      if (!var_) ic.haftalar.push({ ...h, gunler: (h.gunler || []).map((g) => ({ ...g, _paket: ad })) });
      else {
        for (const g of h.gunler || []) {
          const e = var_.gunler.find((x) => x.gun === g.gun);
          if (!e) var_.gunler.push({ ...g, _paket: ad });
          else if (g.degistir) Object.assign(e, g, { _paket: ad });
          else e.gorevler = [...(e.gorevler || []), ...(g.gorevler || [])]; // aynı güne başka paketten görev eklenebilir
        }
      }
    }
    if (p.seviye) ic.seviye = seviyeBirlestir(ic.seviye, p.seviye);
    if (p.seviyeli) ic.seviyeli = p.seviyeli; // gün gün yazılmamış günler için hafta deseni (program.json)
    if (Array.isArray(p.hafizaHavuzu)) for (const k of p.hafizaHavuzu) if (!ic.hafizaHavuzu.includes(k)) ic.hafizaHavuzu.push(k);
    if (p.sesler) {
      if (p.sesler.varsayilan) ic.sesler.varsayilan = p.sesler.varsayilan;
      Object.assign(ic.sesler.konusmacilar, p.sesler.konusmacilar || {});
    }
  }
  ic.haftalar.sort((a, b) => a.hafta - b.hafta);
  for (const h of ic.haftalar) h.gunler.sort((a, b) => a.gun - b.gun);
  return ic;
}

/** Seviye kuralları: üst düzey bölümler (yerlestirme, izler…) alan alan birleşir, sonraki paket önceliklidir. */
function seviyeBirlestir(a, b) {
  const sonuc = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') sonuc[k] = seviyeBirlestir(a[k], v);
    else sonuc[k] = v;
  }
  return sonuc;
}

export function indeksle(ic) {
  const kelime = new Map(ic.kelimeler.map((k) => [k.id, k]));
  const ders = new Map(ic.dersler.map((d) => [d.id, d]));
  const dis = new Map(ic.disUygulamalar.map((d) => [d.id, d]));
  const hareket = new Map(ic.hareketler.map((m) => [m.id, m]));
  const gunler = new Map();
  for (const h of ic.haftalar) for (const g of h.gunler) gunler.set(g.gun, { ...g, hafta: h.hafta, haftaBaslik: h.baslik });
  const dersGunu = new Map();
  for (const [no, g] of gunler) for (const t of g.gorevler || []) if (!dersGunu.has(t.ders)) dersGunu.set(t.ders, no);
  const enSonGun = ic.seviyeli ? Infinity : Math.max(0, ...gunler.keys()); // gün deseni varsa program bitmez
  return { kelime, ders, dis, hareket, gunler, dersGunu, enSonGun, acikSonGun: Math.max(0, ...gunler.keys()) };
}
