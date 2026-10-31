/** Betikten zaman çizelgesi: her parçanın süresi = max(anlatım süresi + payı, eylem süresi × tekrar sayısı). */
export function cizelge(hareket, eylemSureleri, sesSureleri) {
  const par = []; let t0 = 0;
  hareket.anlatim.forEach((a, i) => {
    const es = eylemSureleri[a.eylem], kez = a.kez || 1;
    const dur = Math.max(kez * es, (sesSureleri[i] || 0) + 0.7);
    par.push({ ...a, kez, es, t0, dur, i }); t0 += dur;
  });
  return { par, toplam: t0 };
}
