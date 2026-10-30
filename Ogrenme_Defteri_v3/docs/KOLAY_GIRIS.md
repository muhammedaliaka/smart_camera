# Kolay giriş biçimi — içeriği düz metinle ekle

JSON yazmadan içerik eklemenin yolu. Bir metin dosyasına kelimeleri, okuma/dinleme metinlerini ya da hafıza sözcüklerini yazarsın; araç bunu paket dosyasına (`icerik/<ad>.json`) çevirir, doğrular ve `index.json`'a ekler. Hata olursa **hiçbir şey değişmez**.

```
node scripts/ekle.mjs giris/yeni.txt          # ekle
node scripts/ekle.mjs giris/yeni.txt --kuru   # yalnız kontrol et, dosya bırakma
node scripts/guncelle.mjs                     # ardından: doğrulama + ses listesi + özet
```

Aynı komutu tekrar çalıştırmak aynı dosyayı üretir (güvenle tekrarlanabilir). Yapay zekâ ile çalışıyorsan aynısını MCP sunucusu yapar (`docs/MCP.md`, araç `icerik_ekle`).

## Genel kurallar

- Bir dosyada istediğin kadar **blok** olabilir. Blok `@` ile başlayan satırdır: `@paket`, `@kelimeler`, `@okuma`, `@dinleme`, `@hafiza`.
- `#` ile başlayan satırlar yorumdur. Boş satırların çoğu önemsizdir (aşağıdaki "ders" bloğu hariç).
- **`@paket ad`**: çıktı dosyasının adı (`icerik/ad.json`). Yazmazsan dosya adı kullanılır. Türkçe harfler otomatik sadeleşir (`Dört mevsim` → `dort-mevsim`).
- Hata mesajları **satır numarası** verir: `satır 14: "apple" için seviye (sv) yok …`.
- **Seviye (`sv`) zorunludur**: 1–100 arası tam sayı. Seviye sisteminde bu içeriğin hangi basamakta çıkacağını belirler (`docs/SEVIYE_SISTEMI.md`). Küçük = kolay. 100 sınır değildir; sistem açık uçludur ama seviyeler küçük adımlarla yükselir.
- Elle yazdığın bir paketin (örneğin `icerik/okuma.json`) üzerine **yanlışlıkla yazılmaz**. Araç yalnız kendi ürettiği paketlerin üzerine yazar (pakette `"uretim": {"kaynak": "giris"}` işareti vardır). Bilerek yazacaksan komut satırında `--ustune-yaz`.

## Kelimeler

```
@paket yiyecek-sozlugu

@kelimeler grup=yiyecek sv=6
apple | elma | I eat an apple. | Bir elma yerim. | 🍎
bread | ekmek | | | 🍞 | sv=7 | kabul=somun/ekmek
water | su | I drink water. | Su içerim. | 💧 | id=su-icmek
```

Satır biçimi (`|` ile ayrılır, sondaki alanlar boş bırakılabilir):

| Sıra | Alan | Zorunlu |
|---|---|---|
| 1 | İngilizce sözcük/kalıp | evet |
| 2 | Türkçe karşılığı | evet |
| 3–4 | Örnek cümle: İngilizce, Türkçe (ikisi birlikte ya da hiçbiri) | hayır |
| 5 | Emoji | hayır |

Satırın sonuna isteğe bağlı **özellikler** eklenir: `sv=12`, `kabul=a/b` (kabul edilen diğer Türkçe karşılıklar), `id=…` (kimlik; verilmezse İngilizce sözcükten üretilir), `grup=…`.

### Seviyeyi nasıl verirsin? (`sv`)

| Yazış | Anlamı |
|---|---|
| `sv=12` blok başlığında | Bloktaki tüm kelimeler 12 |
| satırda `sv=7` | O satır blok değerinin yerine geçer |
| `sv=6-24` blok başlığında | Gruptaki kelimeler 6–24 arasına **sıklık sırasına göre** yayılır (sık sözcük alta, seyrek olan üste). Sıklık listesi gerekir: `--siklik liste.txt` |
| `sv=auto` blok başlığında | Yalnız sıklıktan hesaplanır. Dikkat: sıklık konunun zorluğunu yansıtmaz, bu yüzden yalnız yardımcı olarak kullan |

Sıklık listesi: her satırda bir sözcük, **en sık olan en üstte**. Sıra = satır numarasıdır. Liste uygulamaya **dahil edilmez** (lisansı kişisel kullanım içindir); yalnız kelimeye türetilmiş `siklik` sırası yazılır. Çapalar `docs/SEVIYE_SISTEMI.md` içindedir. Bu yöntem bir **tahmindir**: "bu sözcük sık geçer" demek "bu kişi için kolaydır" demek değildir. Gerçek seviye, yerleştirme haftasında ve oturumlarda doğru/yanlışlardan görülür.

## Okuma ve dinleme dersleri

```
@okuma
id: oku-mikroplar
sv: 27
baslik: Mikroplar
emoji: 🦠
hedef: Bilgi metninden ayrıntı ve neden bulmak.
neden: Bilimsel metinlerde sebep-sonuç ilişkisini kurmak.
sozluk: bakteri = tek hücreli canlı; bağışıklık = vücudun savunması

Birinci paragraf buraya yazılır. İki satıra
yayılabilir; satırlar birleşir.

İkinci paragraf. (Paragraflar boş satırla ayrılır.)

? Mikroplar neden tehlikeli olabilir? | Hastalık yapabilirler | Hiç görünmezler | Çok büyüktürler -> Metnin ikinci cümlesi.
? Bakteri nedir? | Tek hücreli canlı | Bir ilaç | Bir mevsim
? Savunma görevi neyindir? | Bağışıklığın | Kemiklerin | Saçların
```

Yapı **sırayla** şudur:

1. `@okuma` (ya da `@dinleme`) satırı.
2. **Başlık satırları** `anahtar: değer`: boş satıra kadar sürer.
3. Bir boş satır.
4. **Paragraflar** (aralarında boş satır).
5. **Sorular** `?` ile başlar. Sorulardan sonra paragraf yazılmaz.

Başlık anahtarları:

| Anahtar | Okuma | Dinleme | Not |
|---|---|---|---|
| `sv` | zorunlu | zorunlu | 1–100 |
| `baslik` | zorunlu | zorunlu | |
| `id` | isteğe bağlı | isteğe bağlı | Verilmezse `oku-sv27-mikroplar` gibi üretilir |
| `emoji`, `hedef`, `neden` | isteğe bağlı | isteğe bağlı | `hedef`: dersin sonunda ne yapabileceksin |
| `sozluk` | isteğe bağlı | — | `kelime = anlam; kelime = anlam` |
| `ses` | — | `kadin` / `erkek` / `anlatici` | Varsayılan `kadin` |
| `hiz` | — | örn. `0.85` | Varsayılan `0.9`; yavaş için küçült |
| `sinir` | — | kaç kez dinlenebilir | Varsayılan `3` |
| `tr` | — | Türkçe karşılığı | Sorulardan sonra gösterilir |
| `yonerge` | — | kısa yönerge | |

### Soru biçimi

```
? Soru metni? | Doğru cevap | Yanlış 1 | Yanlış 2 [| Yanlış 3 …] -> Açıklama (isteğe bağlı)
```

- **İlk seçenek her zaman doğrudur.** Uygulama sırayı karıştırır, sen karıştırmazsın.
- En az 2, en çok 6 seçenek (yani soru + 3–7 parça).
- `->` açıklaması yanıttan sonra gösterilir.
- **En az 3 soru** yaz. Seviye oturumunda bir dersin sayılması için gerekir; daha azsa uyarı verilir.

### Neye dikkat edersin? (bu, "gerçekten öğretmek" ile ilgili)

- Sorular **metne dayansın**. Metni görmeden yanıtlanabilen soru (genel kültür) yoklama işe yaramaz; sonuç metin anlamayı değil bilgiyi ölçer.
- Yanlış seçenekler **makul** olsun ama metne göre **kesin yanlış** olsun. "Hepsi" ya da "hiçbiri" seçeneği koyma.
- Aynı soru metnini iki derste kullanma: doğrulayıcı farklı cevap görürse uyarır.
- Dinleme metinleri **uydurma alıştırma metnidir**; gerçek bir kaynak gibi sunulmaz. Sayıları ve adları bilerek yaz; özel adları ses üretiminden önce kontrol et (`docs/ICERIK_EKLEME.md`, bölüm 7).
- Seviyeyi tahminle değil **karşılaştırarak** ver: yeni metni aynı beceride en yakın iki metnin arasına koy (daha uzun mu, daha az somut mu, daha ağır bir söz dizimi mi). Türkçe için Ateşman okunabilirliği sıralamayı **sınamak** için kullanılabilir, seviyeyi tek başına belirlemez.

## Hafıza havuzu

```
@hafiza
masa, kapı, pencere, sandalye
kalem, defter, kitap
```

Virgül ya da satır ayırır; aynı sözcük iki kez yazılırsa hata verir. Havuzdan hafıza sarayı ve liste çalışmalarında rastgele sözcük seçilir. Seçim ölçütü: **somut** (kolay hayal edilen), birbirine **benzemeyen** (`pencere`/`tencere` gibi karışabilecek çiftler uyarı alır) günlük sözcükler.

## Bir hata aldığında

| Mesaj | Ne yapmalı |
|---|---|
| `önce bir blok başlat` | Satırın üstüne `@kelimeler`, `@okuma`, `@dinleme` ya da `@hafiza` yaz |
| `bilinmeyen blok "@…"` | Yazım hatası; beş blok adı yukarıdadır |
| `"x" için seviye (sv) yok` | Satıra `sv=12` ya da bloğa `sv=12` ekle |
| `sv=A-B için sıklık listesi gerekir` | `--siklik liste.txt` ver ya da her satıra `sv=` yaz |
| `"x" sıklık listesinde yok` | O satıra `sv=` ile elle seviye ver |
| `başlık satırı "anahtar: değer" olmalı` | Başlık satırlarından sonra **boş satır** bırakmadıysan paragrafın ilk satırı başlık sanılır |
| `sorulardan sonra paragraf olmaz` | Paragrafları soruların önüne al |
| `soru biçimi` | `? soru \| doğru \| yanlış 1 \| yanlış 2` biçimini kullan |
| `… üzerine yazılmadı` | Aynı adlı elle yazılmış paket var; farklı `@paket` adı seç |
| `doğrulama: …` | Biçim doğru ama içerik doğrulayıcıda takıldı (aynı kimlik, aynı soru farklı cevap …). Mesaj `docs/ICERIK_EKLEME.md` bölüm 9'daki tabloya bakar |

## Mevcut giriş dosyaları

`giris/` klasöründeki dosyalar, aşağıdaki paketleri **üretir**; değiştirmek istersen paketi değil bu dosyayı düzenle ve yeniden içe aktar:

| Dosya | Üretir |
|---|---|
| `giris/okuma.txt` | `icerik/okuma-seviyeli.json` |
| `giris/dinleme.txt` | `icerik/dinleme-seviyeli.json` |
| `giris/hafiza.txt` | `icerik/hafiza-havuzu.json` |
| `giris/kelime-bankasi.txt` | `icerik/kelime-bankasi.json` (sıklık listesi ister) |

Bir birim testi (`tests/unit/giris.test.mjs`), giriş dosyası ile üretilmiş paketin birbirinden kopmadığını denetler: giriş dosyasını değiştirip yeniden içe aktarmazsan test kırmızı olur.
