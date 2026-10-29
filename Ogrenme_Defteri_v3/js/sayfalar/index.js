import * as bilgi from './bilgi.js';
import * as soru from './soru.js';
import * as serbest from './serbest.js';
import * as etkinlik from './etkinlik.js';

export const CIZ = {
  anlat: bilgi.anlat,
  kelime: bilgi.kelime,
  'sahne-dinle': bilgi.sahneDinle,
  'sahne-metin': bilgi.sahneMetin,
  dinle: bilgi.dinle,
  'dinle-metin': bilgi.dinleMetin,
  oku: bilgi.oku,
  olcek: bilgi.olcek,
  mcq: soru.mcq,
  yaz: soru.yaz,
  eslestir: soru.eslestir,
  cumle: soru.cumle,
  dikte: soru.dikte,
  sayi: soru.sayi,
  serbest: serbest.serbest,
  'liste-sun': serbest.listeSun,
  'liste-hatirla': serbest.listeHatirla,
  gecikmeli: serbest.gecikmeli,
  'gecikmeli-kontrol': serbest.gecikmeliKontrol,
  'saray-kur': serbest.sarayKur,
  'saray-yerlestir': serbest.sarayYerlestir,
  kartlar: etkinlik.kartlar,
  spor: etkinlik.spor,
  dis: etkinlik.dis,
};
