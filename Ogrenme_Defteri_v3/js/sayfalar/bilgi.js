// Bilgi sayfaları: anlatım, kelime kartı, sahne dinleme/metin, dinleme klibi, okuma.

import { h, simge } from '../ui.js';
import * as ses from '../ses.js';
import { zengin, p, sesDugme, kucukSes, etiketSatiri } from './ortak.js';
import { satirSesi, sesKaynak } from '../derle.js';
import * as store from '../store.js';

function blok(b) {
  if (b.baslik) return h('h3', b.baslik);
  if (b.p) return p(b.p);
  if (b.liste) { const e = h(b.sirali ? 'ol.liste-duz' : 'ul.liste-duz'); for (const x of b.liste) { const li = h('li'); li.append(zengin(x)); e.append(li); } return e; }
  if (b.ipucu) { const e = h('div.ipucu'); e.append(zengin(b.ipucu)); return e; }
  if (b.kutu) { const e = h('div.bilgi-kutu'); e.append(zengin(b.kutu)); return e; }
  if (b.emoji) return h('div', h('div.buyuk-emoji', b.emoji), b.altyazi ? h('p.alt-yazi', { style: 'text-align:center' }, b.altyazi) : null);
  if (b.resim) return h('img', { src: b.resim, alt: b.alt || '', style: 'width:100%;border-radius:14px;margin:8px 0' });
  if (b.ornek) return h('div.kart.duz', { style: 'padding:12px 14px' }, h('div.satir', h('div', h('div', { style: 'font-weight:800;font-size:1.1rem' }, b.ornek.en), h('div.alt-yazi', b.ornek.tr)), h('div.bosluk'), kucukSes({ metin: b.ornek.en, ses: b.ornek.ses })));
  if (b.tablo) {
    const t = h('table.tablo');
    if (b.tablo.baslik) t.append(h('thead', h('tr', b.tablo.baslik.map((x) => h('th', x)))));
    t.append(h('tbody', b.tablo.satirlar.map((s) => h('tr', s.map((x) => { const td = h('td'); td.append(zengin(x)); return td; })))));
    return h('div', { style: 'overflow-x:auto' }, t);
  }
  return null;
}

export const anlat = (sayfa, api) => {
  const a = sayfa.adim;
  const el = h('div', a.baslik ? h('h2', { style: 'margin-top:12px' }, a.baslik) : null, a.bloklar.map(blok));
  api.alt(a.dugme || 'Devam', () => api.ilerle());
  return el;
};

export const kelime = (sayfa, api) => {
  const k = sayfa.k;
  const kart = h('div.kelime-karti',
    k.emoji ? h('div.buyuk-emoji', k.emoji) : null,
    h('div.en', k.en),
    h('div.tr', k.tr),
    h('div', { style: 'margin-top:12px' }, sesDugme(sayfa.ses, { etiket: 'Dinle', otomatik: store.al().ayar.otoSes })),
    k.ornek ? h('div.ornek', h('div.en2', k.ornek.en), h('div.tr2', k.ornek.tr), h('div', { style: 'margin-top:8px' }, sesDugme(sayfa.ornekSes, { etiket: 'Cümleyi dinle', yavas: true }))) : null,
    k.not ? h('div.ipucu', k.not) : null,
  );
  api.alt(sayfa.no === sayfa.toplam ? 'Alıştırmaya geç' : 'Sonraki kelime', () => api.ilerle());
  return h('div', h('div.alt-yazi', { style: 'text-align:center;margin-top:8px' }, `Yeni kelime ${sayfa.no}/${sayfa.toplam}`), kart);
};

// ---- Sahne ----
function sahneBalonlari(sahne, api, { tr = false, sesli = false } = {}) {
  const kim1 = sahne.satirlar[0].kim;
  const kap = h('div.sohbet');
  sahne.satirlar.forEach((s) => {
    const b = h('div.balon' + (s.kim !== kim1 ? '.sag' : ''));
    b.append(h('div.kim', s.kim));
    if (tr) {
      b.append(h('div.en', s.en));
      const trEl = h('div.tr.gizli-tr', { role: 'button', tabindex: '0', 'aria-label': 'Türkçesini göster' }, s.tr);
      const ac = () => trEl.classList.add('acik');
      trEl.addEventListener('click', ac); trEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') ac(); });
      b.append(trEl);
    }
    if (sesli) b.append(h('div.satir-ses', kucukSes(satirSesi(s, api.ctx))));
    kap.append(b);
  });
  return kap;
}

export const sahneDinle = (sayfa, api) => {
  const sahne = sayfa.sahne;
  const kisiler = [...new Set(sahne.satirlar.map((s) => s.kim))];
  let calindi = 0;
  const durum = h('p.alt-yazi', { 'aria-live': 'polite' }, 'Önce yazıya bakmadan dinle. Sonra soruları yanıtla.');
  const calDugme = h('button.dugme.birincil.tam', { type: 'button' }, simge('cal'), 'Sahneyi dinle');
  const yavasDugme = h('button.dugme.cizgili.tam', { type: 'button', style: 'margin-top:8px' }, '🐢 Yavaş dinle');
  const oynat = async (yavas) => {
    calindi++;
    calDugme.disabled = yavasDugme.disabled = true;
    for (const [i, s] of sahne.satirlar.entries()) {
      durum.textContent = `${s.kim} konuşuyor… (${i + 1}/${sahne.satirlar.length})`;
      const tamam = await ses.cal(satirSesi(s, api.ctx), { yavas });
      if (!document.body.contains(calDugme)) return; // sayfa kapandı
      await new Promise((r) => setTimeout(r, 250));
    }
    calDugme.disabled = yavasDugme.disabled = false;
    durum.textContent = `${calindi} kez dinledin. Hazırsan sorulara geç, istersen yine dinle.`;
    api.alt('Sorulara geç', () => { api.kaydet('dinleme', { sayi: calindi }, { baslik: sahne.baslik }); api.ilerle(); });
  };
  calDugme.addEventListener('click', () => oynat(false));
  yavasDugme.addEventListener('click', () => oynat(true));
  api.alt('Sorulara geç', () => { api.kaydet('dinleme', { sayi: calindi }, { baslik: sahne.baslik }); api.ilerle(); }, { ikincil: null });
  return h('div',
    h('div.iz-etiket', { style: 'margin-top:10px' }, 'Kısa sahne'),
    h('h2', sahne.baslik),
    sahne.ortam ? h('p.alt-yazi', sahne.ortam) : null,
    h('div.esnek', { style: 'margin:6px 0 14px' }, kisiler.map((k) => h('span.rozet', '🗣️ ' + k))),
    calDugme, yavasDugme, durum,
  );
};

export const sahneMetin = (sayfa, api) => {
  const sahne = sayfa.sahne;
  api.alt('Devam', () => api.ilerle());
  return h('div',
    h('h2', { style: 'margin-top:12px' }, 'Şimdi yazıya bak'),
    h('p.alt-yazi', 'Türkçesini görmek için bulanık satıra dokun. 🔊 ile satırı yeniden dinle.'),
    sahneBalonlari(sahne, api, { tr: true, sesli: true }),
    sahne.not ? h('div.ipucu', sahne.not) : null,
  );
};

// ---- Dinleme klibi (ölçüm / dinleme dersleri) ----
export const dinle = (sayfa, api) => {
  const a = sayfa.adim;
  let sayi = 0;
  const kaydet = () => { if (sayi) api.kaydet('dinleme', { sayi, sinir: a.sinir || null }, { baslik: a.baslik || null }); };
  const dugme = sesDugme(sayfa.ses, { etiket: a.dugme || 'Dinle', sinir: a.sinir || null, yavas: !a.sinir && a.yavasIzin !== false, buyuk: true, sayac: (n) => { sayi = n; if (n > 0) api.alt(a.devam || 'Devam', () => { kaydet(); api.ilerle(); }); } });
  api.alt(a.devam || 'Devam', () => { kaydet(); api.ilerle(); }, { devre: true });
  return h('div',
    h('div.iz-etiket', { style: 'margin-top:10px' }, 'Dinleme'),
    h('h2', a.baslik || 'Dinle'),
    a.yonerge ? p(a.yonerge) : null,
    a.sinir ? h('div.ipucu', `Bu kaydı en çok ${a.sinir} kez dinleyebilirsin.`) : null,
    h('div', { style: 'margin:16px 0' }, dugme),
    a.kural ? h('p.alt-yazi', a.kural) : null,
  );
};

export const dinleMetin = (sayfa, api) => {
  const a = sayfa.adim;
  api.alt('Devam', () => api.ilerle());
  const parcalar = Array.isArray(a.metin) ? a.metin : [a.metin];
  return h('div',
    h('h2', { style: 'margin-top:12px' }, 'Konuşmanın yazısı'),
    h('div.kart.duz', parcalar.map((m) => p(m))),
    a.metinTr ? h('details.ac', h('summary', 'Türkçesi'), p(a.metinTr)) : null,
    h('div', sesDugme(sayfa.ses, { etiket: 'Yeniden dinle', yavas: true })),
  );
};

// ---- Okuma ----
export const oku = (sayfa, api) => {
  const a = sayfa.adim;
  const kap = h('div');
  const okuma = h('div',
    h('div.iz-etiket', { style: 'margin-top:10px' }, a.kosul ? `Okuma · koşul ${a.kosul}` : 'Okuma'),
    h('h2', a.baslik),
    a.kilavuz ? h('div.ipucu', a.kilavuz === 'parmak' ? 'Okurken parmağını ya da bir cetveli satırın altında gezdir.' : a.kilavuz) : null,
    h('div.metin-blok', a.metin.map((m) => p(m))),
    a.sozluk?.length ? h('details.ac', h('summary', 'Sözlük'), h('ul.sade-liste', a.sozluk.map((s) => h('li', h('strong', s.k), ' — ', s.a)))) : null,
    a.kaynak ? h('p.alt-yazi', 'Kaynak: ', a.kaynak.url ? h('a', { href: a.kaynak.url, target: '_blank', rel: 'noopener' }, a.kaynak.ad) : a.kaynak.ad) : null,
  );
  kap.append(okuma);
  const bitir = () => {
    if (!a.sayim) { api.kaydet('okuma', { kosul: a.kosul || null }, { baslik: a.baslik }); api.ilerle(); return; }
    kap.replaceChildren(sayimFormu());
    api.alt('Devam', gonder);
  };
  let kayip, geri, sayamadim;
  const sayimFormu = () => {
    kayip = h('input.girdi', { type: 'number', min: 0, inputmode: 'numeric', 'aria-label': 'Satır kaybı sayısı' });
    geri = h('input.girdi', { type: 'number', min: 0, inputmode: 'numeric', 'aria-label': 'Geri dönüş sayısı' });
    sayamadim = h('input', { type: 'checkbox', id: 'sayamadim' });
    return h('div',
      h('h2', { style: 'margin-top:12px' }, 'Okurken ne oldu?'),
      p('Kendi sayımını yaz. Bu bir göz ölçümü değil, senin beyanındır. Sayamadıysan kutuyu işaretle.'),
      h('label.alan', 'Satırı kaybettiğin sayı'), kayip,
      h('label.alan', 'Geri döndüğün sayı'), geri,
      h('label.onay-satir', sayamadim, h('span', 'Sayamadım')),
    );
  };
  const gonder = () => {
    api.kaydet('okuma', { kosul: a.kosul || null, satirKaybi: sayamadim.checked ? 'sayamadim' : (kayip.value === '' ? null : +kayip.value), geriDonus: sayamadim.checked ? 'sayamadim' : (geri.value === '' ? null : +geri.value) }, { baslik: a.baslik });
    api.ilerle();
  };
  api.alt(a.dugme || 'Okudum', bitir);
  return kap;
};

export const olcek = (sayfa, api) => {
  const a = sayfa.adim;
  const min = a.min ?? 0, max = a.max ?? 10;
  let deger = null;
  const dugmeler = [];
  const satir = h('div.esnek', { style: 'margin:14px 0;justify-content:center' });
  for (let i = min; i <= max; i++) {
    const d = h('button.cip', { type: 'button', 'aria-pressed': 'false', style: 'min-width:48px;min-height:48px' }, String(i));
    d.addEventListener('click', () => { deger = i; dugmeler.forEach((x, j) => x.setAttribute('aria-pressed', String(j + min === i))); api.alt('Kaydet', kaydet); });
    dugmeler.push(d); satir.append(d);
  }
  const kaydet = () => { api.kaydet('olcek', { deger }, { soru: a.soru, min, max, altEtiket: a.altEtiket || null, ustEtiket: a.ustEtiket || null }); api.ilerle(); };
  api.alt('Kaydet', kaydet, { devre: true });
  return h('div', h('h2', { style: 'margin-top:12px' }, a.soru), a.aciklama ? h('p.alt-yazi', a.aciklama) : null, satir,
    h('div.satir', { style: 'justify-content:space-between' }, h('span.alt-yazi', a.altEtiket || ''), h('span.alt-yazi', a.ustEtiket || '')));
};
