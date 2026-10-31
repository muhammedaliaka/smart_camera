#!/usr/bin/env node
// Öğrenme Defteri · MCP sunucusu (Model Context Protocol, stdio, bağımlılıksız).
// Bir yapay zekâ asistanının (Claude Desktop, Claude Code, vb.) öğrencinin çalışma raporunu, seviyelerini ve geçmişini
// okumasını; içerikte arama yapmasını, içerik önerisini doğrulatıp eklemesini sağlar. Kurulum ve örnekler: docs/MCP.md
//
//   node scripts/mcp.mjs [--durum veri/durum.json] [--icerik icerik] [--giris giris] [--bugun YYYY-AA-GG]
//
// Öğrencinin kaydı tarayıcıda durur. Sunucuya iki yoldan gelir: (1) uygulama “Yapay zekâ bağlantısı”ndan eşitler
// (scripts/sunucu.mjs veri/durum.json dosyasını yazar), (2) “Yedek indir” ile alınan dosya --durum ile gösterilir.
// Bu sunucu öğrencinin kaydını DEĞİŞTİRMEZ; yalnız okur. Yazan tek araç icerik_ekle'dir ve varsayılanı “yalnız dene”dir.

import { createInterface } from 'node:readline';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icerikDogrula } from './dogrula.mjs';
import { icerikEkle } from './ekle.mjs';
import { raporUret } from '../js/rapor.js';
import { kuralKur, seviyeler, cefrYaklasim } from '../js/seviye.js';
import { gunPlani } from '../js/plan.js';
import { ozet as srsOzet } from '../js/srs.js';
import { gunEkle, gunFarki, tarihMetni } from '../js/zaman.js';
import { slug } from '../js/giris.js';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SURUM = JSON.parse(readFileSync(join(KOK, 'package.json'), 'utf8')).version || '0';
const DESTEKLENEN = ['2025-06-18', '2025-03-26', '2024-11-05'];

const YZ_GOREV = `Aşağıda bir lise öğrencisinin "Öğrenme Defteri" uygulamasından alınmış çalışma raporu var. Önce raporun "Nasıl okunur" bölümünü oku, sonra şunları yap:
1. Öğrencinin neleri iyi yaptığını söyle.
2. En çok karıştırdığı şeyleri ve olası nedenini açıkla.
3. Yazdığı açık uçlu yanıtları değerlendir; İngilizce yazdıklarında hata varsa düzeltip nedenini kısaca anlat.
4. Seviyelerine (Seviyeler bölümü) bakarak önümüzdeki günler için en fazla 3 somut öneri ver.
Türkçe, sade ve 16 yaşındaki bir öğrenciye uygun yaz. "Beyan" etiketli bilgileri doğrulanmış gibi sunma. Raporda olmayan bir şey uydurma. Seviyeleri sen değiştiremezsin; değişiklik öneriyorsan öğrenciye "Ben → İlerleme → Elle ayarla" yolunu söyle.`;

// ---------------- Bağlam: kayıt ve içerik ----------------

/** @param {{ durum: string, icerik: string, giris: string, bugun: string|null }} secenek */
export function baglamKur(secenek = {}) {
  return {
    durumYolu: resolve(secenek.durum || process.env.OD3_DURUM || join(KOK, 'veri', 'durum.json')),
    icerikKlasoru: resolve(secenek.icerik || join(KOK, 'icerik')),
    girisKlasoru: resolve(secenek.giris || join(KOK, 'giris')),
    bugunSabit: secenek.bugun || null,
  };
}
const bugunMetni = (b) => b.bugunSabit || tarihMetni(new Date());

/** Öğrenci kaydını okur (uygulama yedeği ya da çıplak durum). Yoksa kullanıcıya ne yapacağını söyleyen hata fırlatır. */
export function durumOku(b) {
  if (!existsSync(b.durumYolu)) {
    throw new Error(`Öğrenci kaydı bulunamadı (${b.durumYolu}). Uygulamada Ben → Ayarlar → “Yapay zekâ bağlantısı”ndan “Şimdi eşitle”ye bas (uygulama scripts/sunucu.mjs ile açık olmalı) ya da “Yedek indir” ile aldığın dosyayı --durum ile göster. Ayrıntı: docs/MCP.md`);
  }
  let ham;
  try { ham = JSON.parse(readFileSync(b.durumYolu, 'utf8')); } catch (e) { throw new Error(`Öğrenci kaydı okunamadı (${b.durumYolu}): ${e.message}`); }
  const d = ham.tur === 'od3-yedek' ? ham.durum : ham;
  if (!Array.isArray(d?.olaylar)) throw new Error('Bu dosya bir Öğrenme Defteri kaydı değil (olaylar yok).');
  const durum = { ad: '', baslangic: null, bag: {}, srs: {}, gecikmeli: [], dersler: {}, saraylar: {}, ...d };
  return { durum, tarih: ham.tur === 'od3-yedek' ? ham.tarih || null : null, dosyaZamani: statSync(b.durumYolu).mtime.toISOString(), surum: ham.surum || null };
}

function icerikOku(b) {
  const r = icerikDogrula(b.icerikKlasoru);
  return { ic: r.ic, idx: r.idx, hata: r.hata, uyari: r.uyari, kural: kuralKur(r.ic) };
}

const dersBul = (ic) => (id) => ic.dersler.find((d) => d.id === id) || null;
const kelimeBul = (ic) => (id) => ic.kelimeler.find((k) => k.id === id) || null;
const metin = (s) => ({ content: [{ type: 'text', text: s }] });
const json = (o) => metin(JSON.stringify(o, null, 1));
const hataSonuc = (s) => ({ content: [{ type: 'text', text: s }], isError: true });

function programGunu(durum, bugun) {
  return durum.baslangic && bugun >= durum.baslangic ? gunFarki(durum.baslangic, bugun) + 1 : null;
}

// ---------------- Araçlar ----------------

const ARACLAR = [
  {
    ad: 'ogrenci_ozeti',
    aciklama: 'Öğrencinin kısa durumu: kaçıncı gün, becerilerin seviyesi (yoklama sürüyor mu), bugünün görevleri, tekrar bekleyen madde sayısı ve kaydın ne kadar güncel olduğu. Önce bunu çağır.',
    sema: { type: 'object', properties: {}, additionalProperties: false },
    isle(b) {
      const { durum, tarih, dosyaZamani, surum } = durumOku(b);
      const { ic, idx, kural } = icerikOku(b);
      const bugun = bugunMetni(b), no = programGunu(durum, bugun);
      const sv = seviyeler(durum.olaylar, kural, { programGunu: no });
      const plan = no ? gunPlani({ no, ic, idx, durum, kural, bugun }) : null;
      const gunler = [...new Set(durum.olaylar.map((o) => o.g))].sort();
      return json({
        ad: durum.ad || null, bugun, programGunu: no, baslangic: durum.baslangic,
        calisilanGun: gunler.length, sonCalisma: gunler.at(-1) || null,
        seviyeler: Object.values(sv).map((s) => (s.yoklamaBekliyor
          ? { beceri: s.ad, durum: 'yoklama sürüyor', yapilanYoklama: s.yerlestirme.yoklamalar.length }
          : { beceri: s.ad, seviye: s.sv, yaklasikDuzey: cefrYaklasim(s.sv), seviyeOturumu: s.oturum, kaynak: s.kaynak })),
        bugununGorevleri: plan ? plan.gorevler.map(gorevOzeti(ic)) : [],
        tekrar: srsOzet(durum.srs || {}, bugun),
        kayit: { yedekTarihi: tarih, dosyaZamani, uygulamaSurumu: surum, olaySayisi: durum.olaylar.length },
      });
    },
  },
  {
    ad: 'rapor_al',
    aciklama: 'Öğrencinin çalışma raporunu Markdown olarak verir: ne sorulmuş, ne yanıtlamış, doğrusu neydi, seviyeler ve değişimleri. Raporun “Nasıl okunur” bölümü yorum kurallarını anlatır; “Beyan” etiketli bilgiler öğrencinin kendi sözüdür.',
    sema: { type: 'object', properties: {
      aralik: { type: 'string', enum: ['1', '7', '30', '0'], description: 'Kaç günlük: 1 = bugün, 7, 30, 0 = tüm kayıtlar. Varsayılan 7.' },
      ayrinti: { type: 'string', enum: ['kisa', 'tam'], description: 'kisa: ilk denemede doğru bilinenler tek tek yazılmaz (varsayılan); tam: her soru yazılır (uzun).' },
    }, additionalProperties: false },
    isle(b, a) {
      const { durum } = durumOku(b);
      const { ic, kural } = icerikOku(b);
      const bugun = bugunMetni(b), gun = Number(a.aralik ?? 7);
      if (![0, 1, 7, 30].includes(gun)) throw new Error('aralik 1, 7, 30 ya da 0 olmalı');
      const ayrinti = a.ayrinti === 'tam' ? 'tam' : 'kisa';
      const no = programGunu(durum, bugun);
      return metin(raporUret({
        durum, oku: { ders: dersBul(ic), kelime: kelimeBul(ic) }, bas: gun ? gunEkle(bugun, -(gun - 1)) : null,
        son: bugun, bugun, ayrinti, surum: SURUM, seviye: seviyeler(durum.olaylar, kural, { programGunu: no }), seviyeKural: kural,
      }));
    },
  },
  {
    ad: 'seviyeler',
    aciklama: 'Her becerinin (İngilizce, okuma, dinleme, hafıza, spor) ayrıntılı seviyesi: şu anki seviye, yükselme/düşme geçmişi nedenleriyle, yoklama haftasındaki denemeler, yükselmek için gereken seri.',
    sema: { type: 'object', properties: {}, additionalProperties: false },
    isle(b) {
      const { durum } = durumOku(b);
      const { kural } = icerikOku(b);
      const sv = seviyeler(durum.olaylar, kural, { programGunu: programGunu(durum, bugunMetni(b)) });
      return json(Object.values(sv).map((s) => ({
        beceri: s.ad, kod: s.iz, seviye: s.yoklamaBekliyor ? null : s.sv, yaklasikDuzey: s.yoklamaBekliyor ? null : cefrYaklasim(s.sv), kaynak: s.kaynak,
        seviyeOturumu: s.oturum, ustUsteTam: s.tamSeri, ustUsteZayif: s.zayifSeri,
        yukselmekIcinGerekenSeri: kural.izler[s.iz]?.yukselmeSeri ?? 1,
        yoklama: s.yerlestirme ? { bitti: s.yerlestirme.bitti, gecilenSeviye: s.yerlestirme.gecen ?? null, denemeler: s.yerlestirme.yoklamalar.map((y) => ({ gun: y.g, seviye: y.sv, dogru: y.dogru, toplam: y.toplam })) } : null,
        gecmis: s.gecmis.slice(-20).map((e) => ({ gun: e.g, onceki: e.onceki, yeni: e.sv, neden: e.neden })),
      })));
    },
  },
  {
    ad: 'bugunun_plani',
    aciklama: 'Verilen program gününün (varsayılan bugün) görevleri: yoklama, seviye oturumu ya da yazılı ders; hangileri yapıldı, hangileri isteğe bağlı. Plan öğrencinin ŞİMDİKİ durumundan hesaplanır: geçmiş bir gün için, yoklaması sonradan bitmiş becerilerin yoklama görevi artık görünmez.',
    sema: { type: 'object', properties: { gun: { type: 'integer', minimum: 1, description: 'Program günü (1 = ilk gün). Boşsa bugün.' } }, additionalProperties: false },
    isle(b, a) {
      const { durum } = durumOku(b);
      const { ic, idx, kural } = icerikOku(b);
      const bugun = bugunMetni(b), no = a.gun ?? programGunu(durum, bugun);
      if (!no) throw new Error('Program henüz başlamamış ya da başlangıç tarihi yok.');
      const plan = gunPlani({ no, ic, idx, durum, kural, bugun });
      return json({ gun: plan.no, hafta: plan.hafta, tur: plan.tur, baslik: plan.baslik, hedef: plan.hedef, gorevler: plan.gorevler.map(gorevOzeti(ic)) });
    },
  },
  {
    ad: 'gecmis_ara',
    aciklama: 'Soru kayıtlarında arama: hangi soruya ne yanıtlamış, doğrusu neydi. Yanlışları görmek için yalnizYanlis kullan. Açık uçlu yazılar için rapor_al daha uygundur.',
    sema: { type: 'object', properties: {
      beceri: { type: 'string', enum: ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor'], description: 'Yalnız bu beceriden.' },
      ders: { type: 'string', description: 'Ders kodunun başı (örn. en-02 ya da sv:ingilizce).' },
      tarih: { type: 'string', description: 'YYYY-AA-GG; yalnız o gün.' },
      yalnizYanlis: { type: 'boolean', description: 'Yalnız ilk denemede yanlış olanlar.' },
      sozcuk: { type: 'string', description: 'Soru, yanıt ya da doğru yanıtta geçen sözcük.' },
      sinir: { type: 'integer', minimum: 1, maximum: 200, description: 'En çok kaç kayıt (varsayılan 50, en yeniler).' },
    }, additionalProperties: false },
    isle(b, a) {
      const { durum } = durumOku(b);
      const { ic } = icerikOku(b);
      const bul = dersBul(ic);
      const sozcuk = a.sozcuk ? String(a.sozcuk).toLowerCase() : null;
      const satirlar = [];
      for (const o of durum.olaylar) {
        if (o.tur !== 'soru' || !o.ilk || o.puansiz) continue;
        const k = durum.bag[o.b] || {};
        const iz = k.iz || bul(o.ders)?.iz || null;
        if (a.beceri && iz !== a.beceri) continue;
        if (a.ders && !String(o.ders).startsWith(a.ders)) continue;
        if (a.tarih && o.g !== a.tarih) continue;
        if (a.yalnizYanlis && o.dogru) continue;
        if (sozcuk && ![k.soru, o.yanit, k.dogruCevap].some((m) => String(m || '').toLowerCase().includes(sozcuk))) continue;
        satirlar.push({ tarih: o.g, gun: o.gn ?? null, ders: k.dersAd || bul(o.ders)?.baslik || o.ders, beceri: iz, bolum: k.bolum || null, soru: k.soru || null, duyulan: k.duyulan || null, ogrenciYaniti: o.yanit ?? null, dogruCevap: k.dogruCevap || null, dogru: !!o.dogru });
      }
      const sinir = Math.min(200, Math.max(1, a.sinir ?? 50));
      return json({ toplamEslesen: satirlar.length, gosterilen: Math.min(sinir, satirlar.length), kayitlar: satirlar.slice(-sinir) });
    },
  },
  {
    ad: 'icerik_ara',
    aciklama: 'İçerikte (kelime ve dersler) arama. Bir kelimenin seviyesini, hangi derslerin hangi seviyede olduğunu görmek için.',
    sema: { type: 'object', properties: {
      sorgu: { type: 'string', description: 'Kelime (İngilizce ya da Türkçe) ya da ders başlığı/kodundan bir parça. Boşsa seviye aralığına göre listeler.' },
      tur: { type: 'string', enum: ['kelime', 'ders', 'hepsi'], description: 'Varsayılan hepsi.' },
      enAz: { type: 'integer', minimum: 1, maximum: 100 }, enCok: { type: 'integer', minimum: 1, maximum: 100 },
      beceri: { type: 'string', enum: ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor'], description: 'Yalnız dersler için.' },
      sinir: { type: 'integer', minimum: 1, maximum: 100 },
    }, additionalProperties: false },
    isle(b, a) {
      const { ic } = icerikOku(b);
      const q = String(a.sorgu || '').toLowerCase().trim();
      const sv = (x) => (a.enAz == null || x.sv >= a.enAz) && (a.enCok == null || x.sv <= a.enCok) && ((a.enAz == null && a.enCok == null) || Number.isFinite(x.sv));
      const sinir = Math.min(100, a.sinir ?? 30);
      const tur = a.tur || 'hepsi';
      const kelimeler = tur === 'ders' ? [] : ic.kelimeler.filter((k) => sv(k) && (!q || [k.id, k.en, k.tr].some((m) => String(m).toLowerCase().includes(q)))).map((k) => ({ id: k.id, en: k.en, tr: k.tr, sv: k.sv ?? null, siklikSirasi: k.siklik ?? null, grup: k.grup ?? null }));
      const dersler = tur === 'kelime' ? [] : ic.dersler.filter((d) => sv(d) && (!a.beceri || d.iz === a.beceri) && (!q || [d.id, d.baslik].some((m) => String(m).toLowerCase().includes(q)))).map((d) => ({ id: d.id, baslik: d.baslik, beceri: d.iz, sv: d.sv ?? null, kutuphane: !!d.kutuphane }));
      kelimeler.sort((x, y) => (x.sv ?? 999) - (y.sv ?? 999)); dersler.sort((x, y) => (x.sv ?? 999) - (y.sv ?? 999));
      return json({ kelimeSayisi: kelimeler.length, kelimeler: kelimeler.slice(0, sinir), dersSayisi: dersler.length, dersler: dersler.slice(0, sinir) });
    },
  },
  {
    ad: 'icerik_kapsami',
    aciklama: 'Seviye aralıklarına göre içerik sayıları (10’ar seviyelik dilimlerde kaç kelime / hangi beceride kaç ders). Hangi seviyede içerik az, nerede yeni içerik gerekir görmek için.',
    sema: { type: 'object', properties: {}, additionalProperties: false },
    isle(b) {
      const { ic, kural } = icerikOku(b);
      const dilim = (sv) => `${Math.floor((sv - 1) / 10) * 10 + 1}-${Math.floor((sv - 1) / 10) * 10 + 10}`;
      const say = (liste) => { const o = {}; for (const x of liste) if (Number.isFinite(x.sv)) o[dilim(x.sv)] = (o[dilim(x.sv)] || 0) + 1; return o; };
      const dersler = {};
      for (const iz of Object.keys(kural.izler)) { const l = ic.dersler.filter((d) => d.iz === iz); dersler[iz] = { toplam: l.length, seviyeli: l.filter((d) => Number.isFinite(d.sv)).length, enYuksekSv: Math.max(0, ...l.map((d) => d.sv || 0)), dilimler: say(l) }; }
      return json({ kelime: { toplam: ic.kelimeler.length, seviyeli: ic.kelimeler.filter((k) => Number.isFinite(k.sv)).length, enYuksekSv: Math.max(0, ...ic.kelimeler.map((k) => k.sv || 0)), dilimler: say(ic.kelimeler) }, hafizaHavuzuSozcuk: ic.hafizaHavuzu.length, dersler,
        not: 'Yoklama haftasında seviye en çok ' + (kural.yerlestirme.tavan ?? '?') + ' basamağa kadar denenir; çalışma sırasında seviye bunun üstüne çıkabilir, bu yüzden üst dilimlerde içerik bitince oturum “içerik yok” der.' });
    },
  },
  {
    ad: 'icerik_dogrula',
    aciklama: 'Tüm içerik paketlerini doğrular (kimlikler, sorular, seviye alanları, ses listesi dışında). Hata ve uyarıları döndürür.',
    sema: { type: 'object', properties: {}, additionalProperties: false },
    isle(b) {
      const r = icerikOku(b);
      return json({ hata: r.hata, uyari: r.uyari, sayilar: { paket: r.ic.paketler.length, kelime: r.ic.kelimeler.length, ders: r.ic.dersler.length, hafizaHavuzu: r.ic.hafizaHavuzu.length } });
    },
  },
  {
    ad: 'icerik_giris_bicimi',
    aciklama: 'Yeni içerik (kelime, okuma metni, dinleme kaydı, hafıza sözcükleri) yazarken uyulacak düz metin giriş biçiminin tam anlatımı. icerik_ekle’den ÖNCE oku.',
    sema: { type: 'object', properties: {}, additionalProperties: false },
    isle() {
      const yol = join(KOK, 'docs', 'KOLAY_GIRIS.md');
      return metin(existsSync(yol) ? readFileSync(yol, 'utf8') : 'docs/KOLAY_GIRIS.md bulunamadı.');
    },
  },
  {
    ad: 'icerik_ekle',
    aciklama: 'Düz metin giriş biçimindeki içeriği (bkz. icerik_giris_bicimi) içerik paketine çevirir ve doğrular. VARSAYILAN “yalnız dene”dir (kuru: true): hiçbir dosya yazılmaz, hata ve uyarılar döner. Yazmak için kuru: false ver; doğrulama başarısızsa her şey geri alınır. Aynı adlı, giriş dosyasından üretilmemiş bir paketin üzerine yazılmaz.',
    sema: { type: 'object', required: ['metin'], properties: {
      metin: { type: 'string', description: 'Giriş dosyasının tam metni.' },
      dosyaAdi: { type: 'string', description: 'Paket/giriş dosyası adı (örn. okuma-yeni). Metinde @paket varsa o geçerlidir.' },
      kuru: { type: 'boolean', description: 'true (varsayılan): yalnız dene, yazma. false: yaz.' },
    }, additionalProperties: false },
    isle(b, a) {
      const kuru = a.kuru !== false;
      const dosya = slug(a.dosyaAdi || 'giris');
      const r = icerikEkle(String(a.metin), { klasor: b.icerikKlasoru, dosya, kuru });
      const yazilan = !kuru && r.tamam;
      if (yazilan) mkdirSync(b.girisKlasoru, { recursive: true });
      if (yazilan) writeFileSync(join(b.girisKlasoru, `${dosya}.txt`), String(a.metin).replace(/\r\n/g, '\n').replace(/\n*$/, '\n')); // kaynak metin saklanır: ileride yeniden üretilebilsin
      const cikti = {
        tamam: r.tamam, kuru, yazildi: yazilan, paket: r.paketAd || null, ozet: r.ozet || null, hatalar: r.hatalar, uyarilar: [...(r.uyarilar || []), ...(r.dogrulama?.uyari || [])],
        sonraki: yazilan ? 'Ses gerekiyorsa: node scripts/guncelle.mjs (eksik sesleri listeler), sonra scripts/ses-liste.mjs ve scripts/ses-uret.py. Gözden geçirmeden sonra git ile kaydet.' : kuru && r.tamam ? 'Dene başarılı. Yazmak için aynı çağrıyı kuru: false ile tekrarla.' : 'Hataları düzeltip tekrar dene.',
      };
      return r.tamam ? json(cikti) : { ...json(cikti), isError: true };
    },
  },
];

function gorevOzeti(ic) {
  return (g) => {
    const d = g.tur === 'ders' ? dersBul(ic)(g.ders) : null;
    return { tur: g.tur, beceri: g.iz || d?.iz || null, ders: g.ders || null, baslik: d?.baslik || null, seviye: g.sv ?? null, yapildi: !!g.bitti, istegeBagli: !!g.istege, onerilen: !!g.oneri };
  };
}

const ISTEMLER = [{
  ad: 'calisma_degerlendirmesi',
  aciklama: 'Öğrencinin son çalışmalarını değerlendir: iyi yaptıkları, karıştırdıkları, öneriler.',
  argumanlar: [{ name: 'aralik', description: 'Kaç günlük rapor: 1, 7, 30 ya da 0 (tümü). Varsayılan 7.', required: false }],
  isle(b, a) {
    const r = ARACLAR.find((x) => x.ad === 'rapor_al').isle(b, { aralik: String(a.aralik || '7') });
    return { description: 'Çalışma değerlendirmesi', messages: [{ role: 'user', content: { type: 'text', text: `${YZ_GOREV}\n\n---\n\n${r.content[0].text}` } }] };
  },
}];

// ---------------- JSON-RPC ----------------

const KOD = { ayristirma: -32700, istek: -32600, yontem: -32601, parametre: -32602, ic: -32603 };
const rpcHata = (id, kod, mesaj) => ({ jsonrpc: '2.0', id: id ?? null, error: { code: kod, message: mesaj } });

/** Tek bir JSON-RPC iletisini işler. Bildirim ise (id yok) null döner. Saf fonksiyon sayılır; dosya okuma/yazma araçlarda. */
export async function isle(ileti, b) {
  if (!ileti || typeof ileti !== 'object' || ileti.jsonrpc !== '2.0' || typeof ileti.method !== 'string') return rpcHata(ileti?.id, KOD.istek, 'Geçersiz istek');
  const { id, method, params = {} } = ileti;
  const bildirim = id === undefined;
  const ok = (sonuc) => (bildirim ? null : { jsonrpc: '2.0', id, result: sonuc });
  try {
    switch (method) {
      case 'initialize': {
        const v = DESTEKLENEN.includes(params.protocolVersion) ? params.protocolVersion : DESTEKLENEN[0];
        return ok({ protocolVersion: v, capabilities: { tools: { listChanged: false }, prompts: { listChanged: false } }, serverInfo: { name: 'ogrenme-defteri', title: 'Öğrenme Defteri', version: SURUM },
          instructions: 'Önce ogrenci_ozeti çağır. Rapor için rapor_al. Bu sunucu öğrencinin kaydını değiştirmez; seviye değişikliği öneriyorsan öğrenciye “Ben → İlerleme → Elle ayarla” yolunu söyle. İçerik eklemeden önce icerik_giris_bicimi’ni oku ve icerik_ekle’yi önce kuru (varsayılan) dene.' });
      }
      case 'notifications/initialized': case 'notifications/cancelled': return null;
      case 'ping': return ok({});
      case 'tools/list': return ok({ tools: ARACLAR.map((x) => ({ name: x.ad, description: x.aciklama, inputSchema: x.sema })) });
      case 'tools/call': {
        const arac = ARACLAR.find((x) => x.ad === params.name);
        if (!arac) return rpcHata(id, KOD.parametre, `Bilinmeyen araç: ${params.name}`);
        try { return ok(await arac.isle(b, params.arguments || {})); } catch (e) { return ok(hataSonuc(e.message)); }
      }
      case 'prompts/list': return ok({ prompts: ISTEMLER.map((x) => ({ name: x.ad, description: x.aciklama, arguments: x.argumanlar })) });
      case 'prompts/get': {
        const i = ISTEMLER.find((x) => x.ad === params.name);
        if (!i) return rpcHata(id, KOD.parametre, `Bilinmeyen istem: ${params.name}`);
        try { return ok(i.isle(b, params.arguments || {})); } catch (e) { return rpcHata(id, KOD.ic, e.message); }
      }
      default: return bildirim ? null : rpcHata(id, KOD.yontem, `Desteklenmeyen yöntem: ${method}`);
    }
  } catch (e) { return bildirim ? null : rpcHata(id, KOD.ic, e.message); }
}

function secenekler(argv) {
  const al = (ad) => { const i = argv.indexOf('--' + ad); return i >= 0 ? argv[i + 1] : null; };
  return { durum: al('durum'), icerik: al('icerik'), giris: al('giris'), bugun: al('bugun') };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const b = baglamKur(secenekler(process.argv.slice(2)));
  const gonder = (m) => process.stdout.write(JSON.stringify(m) + '\n');
  const okuyucu = createInterface({ input: process.stdin, crlfDelay: Infinity });
  let sira = Promise.resolve(); // iletiler gelme sırasıyla işlenir
  okuyucu.on('line', (satir) => {
    if (!satir.trim()) return;
    sira = sira.then(async () => {
      let ileti;
      try { ileti = JSON.parse(satir); } catch { gonder(rpcHata(null, KOD.ayristirma, 'JSON okunamadı')); return; }
      const yanitlar = Array.isArray(ileti) ? (await Promise.all(ileti.map((x) => isle(x, b)))).filter(Boolean) : [await isle(ileti, b)].filter(Boolean);
      for (const y of yanitlar) gonder(y);
    });
  });
  okuyucu.on('close', () => sira.then(() => process.exit(0)));
  console.error(`Öğrenme Defteri MCP sunucusu hazır (kayıt: ${b.durumYolu})`);
}
