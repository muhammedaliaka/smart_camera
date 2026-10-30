# Serbest alan: parkta ve çalışma alanında çalışmak

Bugün ekranının altında **"Dışarıda mısın?"** kartı (ya da `#/alan`). Yağmurlu sonbahar günlerinde ya da sakin çalışma alanında, masaya bağlı olmadan çalışmak için.

## Seçimler
- **Yer:** Park 🌳 ya da Çalışma alanı 🏢 (her yerin kendi durak önerileri ve çevre kelimeleri var).
- **Kip:** *Yalnızım* (sesli tur açık) ya da *Sessiz* (sesli tur kapalı; çevrendekileri rahatsız etmezsin, diğer iki etkinlik sessiz de yapılır).

## Üç etkinlik
| Etkinlik | Ne yapar |
|---|---|
| 🏛️ **Gerçek yerde hafıza sarayı** | Bulunduğun yerdeki gerçek duraklardan (kapı, bank, büyük ağaç…) 4–8 duraklık bir rota kurarsın; yürürken her durağa bir kelimeyi canlı bir imgeyle "bırakırsın"; sonra durak adını görüp kelimeyi **bakmadan** hatırlarsın. Unutulanlar **👾 Canavar turu**nda bir daha gösterilir; sonuca ilk denemen yazılır. Rota kaydedilir, sonra yeniden kullanılır |
| 🔎 **Mekân avı** | Çevrendeki nesneyi bul, İngilizcesini söyle, sonra cevabı gör (önce hatırla, sonra bak) |
| 🎧 **Sesli tur** | Telefon cebinde: kelimeyi duy, anlamını söyle, cevabı duy. Eller serbest yürürken |

Kelimeler önce **öğrendiklerinden** (vadesi gelen, en uzun süredir görmediğin), eksikse seviyene uygun yenilerden seçilir (`js/alan.js: kelimeSec`). Çevre kelimeleri `icerik/park-kelimeleri.json`'dadır (kaynak: `giris/park.txt`; yeni kelime eklemek için `docs/KOLAY_GIRIS.md`).

## Dürüst notlar
- Hafıza sarayı (loci) yönteminin geri çağırmaya yardım ettiği **iyi bilinir**; ama bunun **bu uygulamadaki gerçek mekân sürümünün** sana ne kadar fayda vereceği ölçülmedi.
- Sonuçlar **senin kendi bildirimindir** (raporda öyle yazılır; sesli tur puansızdır); seviye hesabına girmez. XP: günde en çok 2 tur sayılır.
- Hava/yer algılanmaz; yer ve kipi sen seçersin. Park ve çalışma alanı dışında bir yer eklemek için `js/alan.js` içindeki `YERLER`'e bir kayıt yeterlidir.
- Sınama: `tests/unit/alan.test.mjs`, `tests/e2e/alan.cjs`.
