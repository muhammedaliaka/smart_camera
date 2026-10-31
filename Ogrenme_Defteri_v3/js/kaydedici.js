// Ses kaydı (MediaRecorder). Mikrofon izni ve güvenli bağlam (https ya da localhost) gerekir.

export function destekleniyor() {
  return typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

export async function baslat() {
  if (!destekleniyor()) throw new Error('Bu tarayıcıda ses kaydı yok. Yazı ile yanıtlayabilirsin.');
  let akis;
  try { akis = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (e) {
    if (e.name === 'NotAllowedError') throw new Error('Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verebilirsin; ya da yazı ile yanıtla.');
    if (e.name === 'NotFoundError') throw new Error('Mikrofon bulunamadı. Yazı ile yanıtlayabilirsin.');
    throw new Error('Mikrofon açılamadı: ' + (e.message || e.name));
  }
  const tip = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported?.(t));
  const kayit = tip ? new MediaRecorder(akis, { mimeType: tip }) : new MediaRecorder(akis);
  const parcalar = [];
  const t0 = Date.now();
  kayit.ondataavailable = (e) => { if (e.data?.size) parcalar.push(e.data); };
  kayit.start(500);
  return {
    sure: () => Date.now() - t0,
    durdur: () => new Promise((coz) => {
      kayit.onstop = () => {
        akis.getTracks().forEach((t) => t.stop());
        coz({ blob: new Blob(parcalar, { type: kayit.mimeType || tip || 'audio/webm' }), sureMs: Date.now() - t0 });
      };
      if (kayit.state !== 'inactive') kayit.stop(); else kayit.onstop();
    }),
  };
}
