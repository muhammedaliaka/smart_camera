// Oyunlaştırma arayüz parçaları: rütbe şeridi, hafta noktaları, rozet kartları. Bugün, Ben ve ders sonu ekranı ortak kullanır.

import { h } from '../ui.js';
import { kisaTarih } from '../zaman.js';

const GUN_ADLARI = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/** Rütbe, XP çubuğu, seri ve hafta noktaları tek kartta (Bugün ekranının üstü). */
export function oyunSeridi(oz) {
  const r = oz.rutbe;
  return h('div.kart.duz.oyun-seridi',
    h('div.rutbe-satir',
      h('span.rutbe-emoji', { 'aria-hidden': 'true' }, r.emoji),
      h('div.rutbe-metin', h('strong', r.ad), h('span.alt-yazi', `${oz.xp} XP`, oz.bugunXp ? ` · bugün +${oz.bugunXp}` : '')),
      oz.seri >= 2 ? h('span.seri-cip', { title: 'Her 7 günde bir gün ara vermek seriyi bozmaz' }, `🔥 ${oz.seri} gün`) : null),
    r.sonraki
      ? [h('div.cubuk.ince', { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(r.oran * 100), 'aria-label': `${r.sonraki.ad} rütbesine ilerleme` }, h('i', { style: `width:${Math.round(r.oran * 100)}%` })),
        h('div.alt-yazi', `${r.sonraki.emoji} ${r.sonraki.ad} için ${r.kalan} XP`)]
      : h('div.alt-yazi', 'En üst rütbedesin 🏔️'),
    haftaSatiri(oz.hafta));
}

/** “Bu hafta ● ● ○ …  3/4 gün”: dolu nokta = çalışılan gün; halkalı nokta = bugün. Hedefe ulaşılamıyorsa suçlayıcı değil, yönlendirici metin. */
export function haftaSatiri(hf) {
  const noktalar = hf.gunler.map((g, i) => h('span.nokta' + (g.etkin ? '.dolu' : '') + (g.bugun ? '.bugun' : '') + (g.gelecek ? '.gelecek' : ''),
    { title: `${GUN_ADLARI[i]}${g.etkin ? ' · çalıştın' : ''}`, 'aria-label': `${GUN_ADLARI[i]}: ${g.etkin ? 'çalıştın' : g.gelecek ? 'henüz gelmedi' : g.bugun ? 'bugün' : 'çalışmadın'}` }, g.etkin ? '✓' : ''));
  let not;
  if (hf.tamam) not = 'Haftalık hedefi tamamladın 🎉';
  else if (hf.ulasilabilir) not = hf.kalanGun === hf.hedef - hf.n ? 'Hedef için kalan her gün gerekli' : `${hf.hedef - hf.n} gün daha yeter`;
  else not = 'Bu hafta hedef kaçtı; sorun değil, yeni hafta yeni başlangıç';
  return h('div.hafta-kutu', h('div.hafta-ust', h('span', 'Bu hafta'), h('strong', `${hf.n}/${hf.hedef} gün`)), h('div.hafta-noktalar', noktalar), h('div.alt-yazi', not));
}

/** Bugün ekranında “Yeni rozet” kartı; Tamam ile görüldü sayılır. */
export function yeniRozetKarti(liste, tamam) {
  if (!liste.length) return null;
  const goster = liste.slice(0, 3);
  const kart = h('div.kart.duz.yeni-rozet', { role: 'status' },
    h('strong', liste.length === 1 ? '🎖️ Yeni rozet!' : `🎖️ ${liste.length} yeni rozet!`),
    ...goster.map((r) => h('div.rozet-satir', h('span.rozet-emoji', { 'aria-hidden': 'true' }, r.emoji), h('div', h('strong', r.ad), h('div.alt-yazi', r.aciklama)))),
    liste.length > goster.length ? h('div.alt-yazi', `ve ${liste.length - goster.length} rozet daha: Ben → İlerleme`) : null,
    h('button.dugme.cizgili', { type: 'button', style: 'margin-top:8px', onclick: () => { tamam(liste.map((r) => r.id)); kart.remove(); } }, 'Tamam'));
  return kart;
}

/** Ben → İlerleme: tüm rozetler. Kazanılanlar renkli, kilitli olanlar soluk ve ilerlemeli. */
export function rozetIzgarasi(liste) {
  const kazanilan = liste.filter((r) => r.kazandi).length;
  return h('div.kart.duz', h('h3', `Rozetler · ${kazanilan}/${liste.length}`),
    h('div.rozet-izgara', liste.map((r) => h('div.rozet-kutu' + (r.kazandi ? '.kazanildi' : '.kilitli'), { title: r.aciklama },
      h('span.rozet-emoji', { 'aria-hidden': 'true' }, r.emoji),
      h('strong', r.ad),
      h('span.alt-yazi', r.kazandi ? (r.gun ? kisaTarih(r.gun) : 'kazanıldı') : `${r.n}/${r.hedef}`),
      h('span.sr-only', `${r.aciklama}. ${r.kazandi ? 'Kazanıldı' : `İlerleme ${r.n}/${r.hedef}`}`)))),
    h('p.alt-yazi', { style: 'margin:10px 0 0' }, 'XP ve rozetler ne kadar çalıştığının göstergesidir; öğrenmenin ölçüsü değildir. Gerçek ölçün seviyen ve tekrarlarda hatırlamandır.'));
}

/** Ders sonu ekranı: kazanılan XP, rütbe, hafta ve yeni rozetler. */
export function sonucOyunKarti(o, enUzunKombo = 0) {
  if (!o) return null;
  const r = o.rutbe;
  return h('div.kart.duz.sonuc-oyun', { style: 'text-align:left' },
    h('div.rutbe-satir',
      h('span.rutbe-emoji', { 'aria-hidden': 'true' }, r.emoji),
      h('div.rutbe-metin', h('strong', o.kazanilan ? `+${o.kazanilan} XP` : r.ad), h('span.alt-yazi', o.rutbeAtladi ? `Yeni rütbe: ${r.ad}! 🎉` : `${r.ad} · toplam ${o.toplam} XP`)),
      enUzunKombo >= 3 ? h('span.seri-cip', { title: 'Bu çalışmadaki en uzun ilk-deneme doğru serisi' }, `🔥 ${enUzunKombo}`) : null),
    r.sonraki ? [h('div.cubuk.ince', { 'aria-hidden': 'true' }, h('i', { style: `width:${Math.round(r.oran * 100)}%` })), h('div.alt-yazi', `${r.sonraki.emoji} ${r.sonraki.ad} için ${r.kalan} XP`)] : null,
    haftaSatiri(o.hafta),
    ...o.yeniRozetler.slice(0, 3).map((b) => h('div.rozet-satir', h('span.rozet-emoji', { 'aria-hidden': 'true' }, b.emoji), h('div', h('strong', `Yeni rozet: ${b.ad}`), h('div.alt-yazi', b.aciklama)))));
}
