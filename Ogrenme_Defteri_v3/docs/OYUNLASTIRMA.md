# Oyunlaştırma: ne var, nasıl hesaplanır, neye dayanır?

Amaç: çalışmayı **daha az sıkıcı** yapmak ve **sürekliliği** desteklemek; baskı kurmak ya da "puan avcılığı" yaratmak değil. Kod: `js/oyunlastir.js` (saf işlevler, testli), arayüz köprüsü `js/oyun-ac.js`, görünüm `js/gorunum/oyun-kart.js`.

## Ne var?

| Parça | Nerede görünür | Kısaca |
|---|---|---|
| **XP ve rütbe** | Bugün (Başla düğmesinin altı), ders sonu, Ben | 7 rütbe: Filiz 🌱 → Fidan → Genç Ağaç → Çınar → Orman → Dağ → Zirve 🏔️ |
| **Haftalık hedef** | Bugün, ders sonu; ayar: Ben → Ayarlar | "Bu hafta ● ● ○ … 3/4 gün". Varsayılan 4 gün; 2–7 arası seçilir |
| **Esnek seri** 🔥 | Bugün, Ben | Art arda çalışılan gün. **Her 7 günde bir gün ara vermek seriyi bozmaz.** İki gün üst üste ara bozar |
| **Kombo** 🔥 | Ders sırasında, üst çubukta | Art arda ilk denemede doğru. 3'ten itibaren görünür; yanlışta sessizce sıfırlanır |
| **Rozetler** (18) | Ben → İlerleme; Bugün'de "Yeni rozet" kartı | Süreklilik, çeşitlilik, dayanıklılık, geri dönüş ve hareket de ödüllendirilir |

## XP kuralları

XP **olay defterinden türetilir**; ayrı bir sayaç yoktur (yedekten dönünce, tarih değişince tutarsızlık olmaz). Yalnız "hangi rozeti ne zaman kazandın / gördün" kaydı saklanır.

| Olay | XP |
|---|---|
| Ders bitirme, ilk kez | 15 + 0–10 (doğru oranı) |
| Aynı dersi yeniden bitirme | 5 |
| Seviye oturumu | 20 + 0–10 (doğru oranı); tekrar oturumu 8 |
| Spor oturumu | tam 25, kısmi 15 |
| Yoklama (ilk hafta) | 12 |
| Oyun | 6 + 0–6 |
| Serbest alan turu | 12 (günde en çok 2) |
| Tekrar sisteminde doğru yanıt | 1 (günde en çok 30) |
| Gecikmeli hatırlamada doğru yanıt | 4 |

Neden böyle: **çeşit ve süreklilik ödüllendirilir, aynı şeyi tekrar tekrar yapmak değil** (puan avcılığına karşı). Kendi bildirdiğin sonuçlar (park turu) sınırlıdır. Tek tek sorular XP vermez; "ders bitirme" verir, böylece çifte sayım olmaz.

Rütbe eşikleri 0 / 250 / 700 / 1400 / 2500 / 4200 / 6500'dür. Günde ortalama ≈ 90 XP varsayımıyla "Fidan" ≈ 3. gün, "Orman" ≈ 1 ay civarı olacak biçimde **tahmin edildi**; gerçek kullanımla ayarlanmalıdır.

## Rozetler

`js/oyunlastir.js` içindeki `ROZETLER` listesi: ilk adım, üç gün, sağlam hafta (bir haftada 4 gün), bir hafta (7 günlük seri), otuz gün, **geri döndün** (3 gün ara verip yeniden başlamak), 25 / 100 kelime, ilk hareket, hareketli beş, saray kurucusu, her yerde öğrenirim (park + çalışma alanı), çok yönlü (4 beceri), tam puan, oyuncu, aklımda kalıyor, kırk dakika, elli dakika.

- Bir kez kazanılan rozet **geri alınmaz** (kayıtlar sadeleşse bile).
- Eski kayıtlı bir kullanıcı ilk açışta geçmişi için kazandığı rozetleri tek seferde görür.
- Yeni rozet ders sonunda gösterilirse "görüldü" sayılır; Bugün'de yeniden çıkmaz.

## Kanıt: ne biliniyor, ne bilinmiyor?

- Oyunlaştırmanın öğrenme ve katılım üzerindeki etkisi, derlemelerde **küçük–orta ve tasarıma bağlı** bulunur; her oyun öğesi işe yaramaz, kötü tasarlanan (ör. sadece liderlik tablosu, katı seri) ters tepebilir. Bu yüzden burada **sayı vermiyoruz**.
- Bu uygulamadaki seçimler **kanıttan çok tasarım gerekçesidir**: katı seri yerine esnek seri (kaçırılan günde "hepsi boşa gitti" duygusunu önlemek), haftalık hedef (gün sayısı, süre baskısı yok), cezasız kombo, rakipsiz ve karşılaştırmasız yapı.
- **XP öğrenmenin ölçüsü değildir.** Ne kadar çalıştığının sevimli bir göstergesidir. Öğrenmenin ölçüsü seviyen (Ben → İlerleme) ve tekrarlarda hatırlayıp hatırlamadığındır. Rapor (yapay zekâya verilen) XP içermez; ham kayıttır.
- Rütbe/XP/rozet sayıları bu öğrenci üzerinde sınanmadı. Sıkıcı geliyorsa ya da baskı yapıyorsa söyle; kapatılabilir/azaltılabilir.

## Bilerek yapılmayanlar

Liderlik tablosu, arkadaşlarla yarış, günlük "seriyi kaybedeceksin" bildirimi, ödül kutusu/rastgele ödül (bağımlılık yapıcı kalıplar), puan kaybı. Uygulama bildirim göndermez.

## Ayar ve sınama

- Ayar: Ben → Ayarlar → "Haftalık hedef (çalışılan gün)".
- Birim testleri: `tests/unit/oyunlastir.test.mjs` (XP, rütbe, esnek seri, hafta, rozet, kombo).
- Tarayıcı testi: `tests/e2e/oyun.cjs` (gerçek derste kombo ve ders sonu kartı, Bugün şeridi, "Yeni rozet" kartı, rozet ızgarası, haftalık hedef ayarı, koyu tema).
- Not: kota dolunca eski `srs` hareketleri sadeleştirilir (`store.sadelestir`); bu, çok eski günlerin tekrar-XP'sini az miktarda düşürebilir. Kazanılmış rozetler etkilenmez.
