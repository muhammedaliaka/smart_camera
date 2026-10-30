// Gerçek içerikle öğrenci benzetimi: gerçek seviyesi T olan bir öğrenci her gün planın istediği yoklama/oturumları yapar.
// Motor, oturum kurucu, plan ve içerik GERÇEKTİR; yalnız öğrencinin yanıtları üretilir: içerik seviyesi T'nin altında ya da eşitse
// her soru %97, üstündeyse %25 olasılıkla doğru (tohumlu rastgele; aynı tohum aynı sonuç). Kullanım:
//   node tests/benzetim.mjs '{"ingilizce":55,"okuma":40,"dinleme":35,"hafiza":45,"spor":10}' 40
// Gerçek öğrenci değildir: motorun ve içerik havuzunun davranışını gösterir, öğrenme hakkında bir şey söylemez.
import { fileURLToPath } from 'node:url';
import { icerikDogrula } from '../scripts/dogrula.mjs';
import { kuralKur, seviyeler } from '../js/seviye.js';
import { hazirla, sayfalar, olayVerisi, yerlestirmeKapatOlayi } from '../js/seviye-oturum.js';
import { gunPlani } from '../js/plan.js';
import { gunEkle } from '../js/zaman.js';
import { ctxOlustur } from './unit/yardimci.mjs';

export function benzet({ T, gunler = 60, tohum = 7, dogruBilinen = 0.97, dogruBilinmeyen = 0.25, baslangic = '2026-11-02', sessiz = true }) {
  const { ic, idx } = icerikDogrula(fileURLToPath(new URL('../icerik', import.meta.url)));
  const kural = kuralKur(ic);
  const durum = { olaylar: [], srs: {}, dersler: {}, bag: {}, baslangic, ad: 'Sim' };
  let s = tohum >>> 0;
  const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let sira = 0;
  const olay = (bugun, n, tur, veri) => { sira++; durum.olaylar.push({ i: 'e' + sira, t: `${bugun}T10:${String(Math.floor(sira / 60) % 60).padStart(2, '0')}:${String(sira % 60).padStart(2, '0')}.000Z`, g: bugun, gn: n, tur, ...veri }); };
  const kayit = { gunluk: [], yok: {}, tekrar: {}, oturumlar: {}, yoklamaGunleri: {} };
  const beceriler = ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor'];
  for (let n = 1; n <= gunler; n++) {
    const bugun = gunEkle(baslangic, n - 1);
    const plan = gunPlani({ no: n, ic, idx, durum, kural, bugun });
    const gorevler = plan.gorevler.filter((g) => !g.bitti && !g.istege && (g.tur === 'yoklama' || g.tur === 'oturum'));
    for (const g of gorevler) {
      const iz = g.iz, tur = g.tur;
      const B = { ic, idx, durum, kural, bugun, programGunu: n };
      const h = hazirla(B, { iz, tur });
      if (h.yok === 'araliksiz') { const k = yerlestirmeKapatOlayi(iz, h.ayrinti); olay(bugun, n, k.tur, k.veri); (kayit.yok[iz + ':araliksiz'] ??= []).push(n); continue; }
      if (h.yok) { (kayit.yok[iz + ':' + h.yok] ??= []).push(n); continue; }
      let dogru = 0, toplam = 0, sp = null;
      if (iz === 'spor') { toplam = 1; sp = { zorlanma: 4, kismi: false, destek: false }; }
      else {
        const sayf = sayfalar(h, ctxOlustur(ic, idx, 0));
        const p = h.etkinSv <= T[iz] ? dogruBilinen : dogruBilinmeyen;
        for (const pg of sayf.filter((x) => x.puan)) { // liste-hatırla: her öğe ayrı sayılır (oyuncu.js: adet)
          const n = pg.t === 'liste-hatirla' ? (pg.liste?.length || 1) : 1;
          toplam += n;
          for (let i = 0; i < n; i++) if (rnd() < p) dogru++;
        }
      }
      const o = olayVerisi(h, { dogru, toplam, spor: sp }, kural);
      if (iz !== 'spor' && !(o.veri.toplam > 0)) { (kayit.yok[iz + ':puansiz'] ??= []).push(n); continue; }
      const oturum = h.yazili ? (tur === 'yoklama' ? `yoklama:${h.dersId}` : h.dersId) : h.ders.id;
      olay(bugun, n, o.tur, { ...o.veri, oturum });
      if (tur === 'yoklama') (kayit.yoklamaGunleri[iz] ??= []).push(`g${n}:sv${h.etkinSv} ${dogru}/${toplam}`);
      else {
        (kayit.oturumlar[iz] ??= []).push(n);
        if (h.tekrar) (kayit.tekrar[iz] ??= []).push(n);
        for (const id of h.yeniKelimeler || []) durum.srs['k:' + id] = { k: 1, son: bugun };
        if (h.yazili) durum.dersler[h.dersId] = { bitti: true, son: bugun };
      }
    }
    const sv = seviyeler(durum.olaylar, kural, { programGunu: n });
    kayit.gunluk.push({ n, sv: Object.fromEntries(beceriler.map((b) => [b, sv[b].yoklamaBekliyor ? 'Y' : sv[b].sv])) });
  }
  const son = seviyeler(durum.olaylar, kural, { programGunu: gunler });
  return { kayit, son, durum, kural, ic };
}

if (process.argv[1] && process.argv[1].endsWith('benzetim.mjs') && !process.argv[1].includes('unit')) {
  const T = JSON.parse(process.argv[2] || '{"ingilizce":55,"okuma":40,"dinleme":35,"hafiza":45}');
  const gun = +(process.argv[3] || 60);
  const { kayit, son } = benzet({ T, gunler: gun });
  console.log('gerçek seviyeler (T):', JSON.stringify(T));
  for (const b of ['ingilizce', 'okuma', 'dinleme', 'hafiza', 'spor']) {
    const d = son[b];
    console.log(`\n${b.toUpperCase()}  son seviye ${d.sv}  (oturum ${d.oturum})  yerleştirme geçilen ${d.yerlestirme?.gecen ?? '-'}  kaynak ${d.kaynak}`);
    if (kayit.yoklamaGunleri[b]) console.log('  yoklamalar:', kayit.yoklamaGunleri[b].join(' | '));
    console.log('  seviye geçmişi:', d.gecmis.map((e) => `g${e.gn ?? (e.g||'').slice(-2)}:${e.onceki ?? '·'}→${e.sv}`).slice(0, 40).join(' '));
    if (kayit.tekrar[b]) console.log('  tekrar (aynı içerik yeniden) günleri:', kayit.tekrar[b].join(','));
  }
  console.log('\nİÇERİK/OTURUM KURULAMADI (neden: günler):'); for (const [k, v] of Object.entries(kayit.yok)) console.log(' ', k, '→', v.length, 'kez; ilk gün', v[0], '; günler:', v.slice(0, 20).join(','));
  console.log('\nGÜNLÜK SEVİYE (her 5. gün):'); for (const g of kayit.gunluk.filter((x) => x.n % 5 === 0 || x.n <= 9)) console.log(' g' + String(g.n).padStart(2), JSON.stringify(g.sv));
}
