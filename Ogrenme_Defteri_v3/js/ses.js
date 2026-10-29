// Ses: önceden üretilmiş mp3 (dosya adı metinden türetilir) → yoksa cihazın konuşma sentezi.
// Dosya adı = metin + ses adı + hızın özeti. Aynı özet scripts/ses-liste.mjs içinde de kullanılır; üretim betiği adı oradan alır.

/** 53 bitlik cyrb53 özeti → 14 haneli onaltılık. Tarayıcı ve Node'da aynı sonucu verir. */
export function ozet(s) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return n.toString(16).padStart(14, '0');
}

export function sesYolu(metin, ses = 'anlatici', hiz = 1) {
  return `ses/${ozet(`${ses}|${hiz}|${metin}`)}.mp3`;
}

/** Bir konuşmacı adından ses modelini seçer. */
export function sesSec(sesler, kim) {
  return (kim && sesler?.konusmacilar?.[kim]) || sesler?.varsayilan || 'anlatici';
}

let ses = null;
let aktif = null;       // { bitir() }
let yavasVarsayilan = false;
export function yavasAyarla(v) { yavasVarsayilan = !!v; }

export function durdur() {
  if (aktif) { aktif.bitir(false); aktif = null; }
  try { speechSynthesis?.cancel(); } catch { /* yok */ }
}

/**
 * Sesi çalar. kaynak: { url } | { metin, ses?, hiz? } | { metin } (yalnız sentez)
 * seçenekler: { yavas, bitince, hata }
 * dönüş: Promise<boolean> — sonuna kadar çalındıysa true
 */
export function cal(kaynak, { yavas = yavasVarsayilan, ilerleme } = {}) {
  durdur();
  return new Promise((coz) => {
    let bitti = false;
    const bitir = (tamam) => { if (bitti) return; bitti = true; aktif = null; ilerleme?.(false); coz(tamam); };
    aktif = { bitir };
    const url = kaynak.url || (kaynak.metin ? sesYolu(kaynak.metin, kaynak.ses, kaynak.hiz) : null);
    const sentez = () => {
      if (!kaynak.metin || typeof speechSynthesis === 'undefined') return bitir(false);
      try {
        const u = new SpeechSynthesisUtterance(kaynak.metin);
        u.lang = kaynak.dil || 'en-US';
        u.rate = yavas ? 0.7 : 0.95;
        const v = speechSynthesis.getVoices().find((x) => x.lang?.replace('_', '-').startsWith(u.lang.slice(0, 2)));
        if (v) u.voice = v;
        u.onend = () => bitir(true); u.onerror = () => bitir(false);
        ilerleme?.(true);
        speechSynthesis.speak(u);
      } catch { bitir(false); }
    };
    if (!url) return sentez();
    ses = new Audio(url);
    ses.playbackRate = yavas ? 0.75 : 1;
    ses.preservesPitch = true;
    ses.onended = () => bitir(true);
    ses.onerror = () => { if (!bitti) { aktif = { bitir }; sentez(); } };
    ses.play().then(() => ilerleme?.(true)).catch(() => { if (!bitti) sentez(); });
  });
}
