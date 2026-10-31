// Serbest alan (park, çalışma alanı): kelime seçimi, mekân avı listesi ve tur kaydı. Saf işlevler; arayüz js/gorunum/alan.js içindedir.
//
// Üç etkinlik: gerçek mekânda hafıza sarayı, sesli tur (ellerin serbest yürürken), mekân avı (çevrendeki nesnelerin İngilizcesi).
// Hepsi geri çağırmaya dayanır (önce kendin hatırla, sonra cevabı gör). Sonuçlar öğrencinin kendi bildirimidir; bu yüzden raporda öyle yazılır.



export const YERLER = {
  park: {
    ad: 'Park', emoji: '🌳',
    durakOnerileri: ['Giriş kapısı', 'Bank', 'Büyük ağaç', 'Çeşme', 'Köprü', 'Çocuk parkı', 'Çöp kutusu', 'Lamba direği', 'Patika', 'Göl kenarı'],
    avKelimeleri: ['tree', 'leaf', 'bench', 'bird', 'rain', 'umbrella', 'puddle', 'path', 'fountain', 'bridge', 'bicycle', 'flower', 'grass', 'sky', 'cloud', 'wind', 'dog', 'lamp', 'river', 'mud', 'gate', 'water', 'sun'],
  },
  calisma: {
    ad: 'Çalışma alanı', emoji: '🏢',
    durakOnerileri: ['Kapı', 'Masa', 'Pencere', 'Raf', 'Priz', 'Duvar saati', 'Çöp kutusu', 'Sandalye', 'Lamba', 'Askılık'],
    avKelimeleri: ['desk', 'table', 'chair', 'window', 'door', 'book', 'pen', 'bag', 'clock', 'light', 'computer', 'phone', 'cup', 'bottle', 'paper', 'shelf', 'wall', 'floor', 'lamp'],
  },
};
export const KIPLER = { yalniz: 'Yalnızım', sessiz: 'Sessiz' };

/**
 * Etkinlik için n kelime: önce öğrenilmişlerden, vadesi gelen ve en uzun süredir görülmeyen; eksikse seviyene en yakın yeni kelimeler.
 * srs: { 'k:id': madde }, kelimeler: tüm kelimeler (sv alanlı olanlar yeni kelime adayıdır).
 */
export function kelimeSec({ srs, kelimeler, bugun, hedefSv = 1, n = 6 }) {
  const var_ = new Map(kelimeler.map((k) => [k.id, k]));
  const ogrenilen = Object.entries(srs).filter(([id]) => id.startsWith('k:')).map(([id, m]) => ({ k: var_.get(id.slice(2)), m })).filter((x) => x.k);
  const vadesi = ogrenilen.filter((x) => !x.m.bitti && x.m.s && x.m.s <= bugun).sort((a, b) => a.m.s.localeCompare(b.m.s));
  const digerleri = ogrenilen.filter((x) => !vadesi.includes(x)).sort((a, b) => String(a.m.son).localeCompare(String(b.m.son)));
  const secilen = [...vadesi, ...digerleri].slice(0, n).map((x) => x.k);
  if (secilen.length < n) {
    const gorulen = new Set(secilen.map((k) => k.id));
    const yeni = kelimeler.filter((k) => Number.isFinite(k.sv) && !srs['k:' + k.id] && !gorulen.has(k.id) && k.tr && k.en)
      .sort((a, b) => Math.abs(a.sv - hedefSv) - Math.abs(b.sv - hedefSv) || a.sv - b.sv || a.id.localeCompare(b.id));
    secilen.push(...yeni.slice(0, n - secilen.length));
  }
  return secilen;
}

/** Mekân avı: yerin kelimelerinden bankada olanlar; öğrenilmiş olanlar önde değil, yerin sırası korunur. En çok n. */
export function avKelimeleri({ yer, kelimeBul, n = 8 }) {
  const liste = YERLER[yer]?.avKelimeleri || [];
  return liste.map((id) => kelimeBul(id)).filter((k) => k && k.en && k.tr).slice(0, n);
}

/** Bir türün kayıt verisi (store.olay('alan-tur', …)). Sonuç öğrencinin kendi bildirimidir. */
export function turKaydi({ etkinlik, yer, kip, dogru, toplam, sn, eksikler = [] }) {
  return { ders: `alan:${etkinlik}:${yer}`, etkinlik, yer, kip, dogru, toplam, sn: Math.max(0, Math.round(sn || 0)), ...(eksikler.length ? { eksikler } : {}), kendiBildirimi: true };
}

/** "a/an" + isim; sayılamayan ya da çoğul gibi kullanılan sözcüklerde artikelsiz. */
const SAYILAMAYAN = new Set(['rain', 'grass', 'water', 'wind', 'mud', 'sky', 'sun', 'paper', 'light']);
export function artikelli(en) {
  if (SAYILAMAYAN.has(en)) return en;
  return (/^[aeiou]/i.test(en) ? 'an ' : 'a ') + en;
}


