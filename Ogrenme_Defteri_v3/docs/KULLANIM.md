# Kullanım kılavuzu

Bu belge, uygulamayı **kullanan kişi** (öğrenci) içindir. İçerik eklemek için `ICERIK_EKLEME.md`'ye bak.

## 1. Telefonda ya da tablette açmak

Uygulama bir web sitesidir; kurulum gerektirmez. Tek seferlik şunu yap: klasörü bir yere koy ve linkini telefonda aç.

### En kolay yol: ücretsiz bir adrese koymak
Aşağıdakilerden biri yeterli. Üçü de klasörü olduğu gibi sunar, derleme gerekmez. (Sitelerin menü adları zamanla değişebilir; anahtar kelimeler: "static site", "drag and drop deploy".)

- **GitHub Pages**: klasörü bir GitHub deposuna koy; Settings → Pages → Branch'i seç.
- **Netlify**: netlify.com'da "drop" özelliğiyle klasörü sürükle-bırak.
- **Cloudflare Pages**: "Direct Upload" ile klasörü yükle.

Sonuç `https://…` ile başlayan bir adres olur. **https önemlidir**: mikrofon kaydı, çevrimdışı çalışma ve "Ana ekrana ekle" ancak böyle çalışır.

### Bilgisayarda çalıştırıp aynı Wi-Fi'dan açmak
Bilgisayarında Node.js (20+) varsa klasörde:

```
node scripts/sunucu.mjs
```

Komut bir adres yazar (`http://192.168.x.x:8080/`). Telefon aynı Wi-Fi'daysa bu adresi aç. Sınır: `http` adresinde mikrofon ve çevrimdışı mod çalışmaz; dersler, sorular ve oyunlar çalışır. Node yoksa `python3 -m http.server 8080` da aynı işi görür.

### Ana ekrana eklemek
- **Android (Chrome)**: ⋮ menü → "Ana ekrana ekle" ya da "Uygulamayı yükle".
- **iPhone/iPad (Safari)**: Paylaş → "Ana Ekrana Ekle".

Böylece uygulama tam ekran açılır ve internet olmadan da çalışır.

## 2. Her gün ne yapacaksın?

1. **Bugün** sekmesini aç. O günün görevleri sırayla durur. Birine dokunarak başla.
2. Dersi bitirince sonuç ekranı çıkar: yüzde, doğru sayısı, bölüm bölüm sonuç ve yanlış yaptığın sorular. Dinleme ve okuma bölümlerinde **"% anladın"** görürsün.
3. Ana sayfada **Tekrar** kartı çıkarsa onu da yap. Uygulama eski kelimeleri 3, 10, 20 ve 50 gün sonra yeniden sorar.
4. Satırında "isteğe bağlı" yazan görevler zorunlu değildir; bugünkü görevler yalnız zorunlu olanlarla tamam sayılır.
5. İstediğinde **Oyunlar** sekmesinde kısa oyunlar oynayabilirsin (eşleştirme, dinle ve bul, hızlı tur, yazım, cümle kur, hafıza kartları, sayı avı).

Yarım bıraktığın ders için bir sonraki açılışta "kaldığın yerden devam" önerilir.

## 3. Sonuçları nasıl okursun?

- **Doğru / toplam ve yüzde** yalnızca nesnel sorular için gösterilir (çoktan seçmeli, dinleyip yazma, sayı, eşleştirme…). İlk denemedeki yanıt sayılır; yanlış yaptığın soru sonda bir kez daha sorulur ama sonucu değiştirmez.
- **Açık uçlu sorular** (kendi cümlenle anlat, kısa konuşma) puanlanmaz. Yalnızca kaydedilir. Cevabından sonra "Yanıtında hangileri vardı?" listesi çıkar; hangi noktaları söylediğini kendin işaretlersin (yazıda bulabildiklerimiz önceden işaretlenir).
- **Kontrol günleri** (Hafta 1: gün 5–7) tek seferliktir: yanlışlar tekrar sorulmaz. Amaç not almak değil, neyi tekrar etmen gerektiğini görmektir.

## 4. Dış uygulamalar (Voscreen, Busuu)

Bazı günlerde isteğe bağlı bir görev olarak Voscreen ya da Busuu önerilir. Görev sayfasında:
1. "Google Play" / "App Store" / "Web" düğmesiyle uygulamayı aç.
2. Yönergeyi izle (ör. "10 kesit çöz").
3. Uygulama bitince buraya dön ve **kaç tane doğru bildiğini** yaz. Yüzde ve geçmiş buradan hesaplanır.

Bu uygulamalarla **otomatik bağlantı yoktur**; nedeni `DIS_UYGULAMALAR.md`'de.

## 5. Ayarlar ve geriye dönmek

**Ben → Ayarlar**:
- **Görünüm** (açık/koyu), **yazı boyutu**, günlük tekrar adedi, sesleri yavaş çalma.
- **Program başlangıç tarihi (Gün 1)**: bugünkü görevler bu tarihe göre belirlenir. Tarihi geriye ya da ileriye alabilirsin; **hiçbir kaydın silinmez**. Bir hafta ara verdiysen tarihi ileri alıp programı kaldığın yerden sürdürebilirsin.
- **Çevrimdışı kullanım**: "Tüm sesleri indir" ile ders seslerini cihaza kaydet.
- **Yedek**: kayıtların yalnızca bu cihazın tarayıcısında durur. Düzenli olarak "Yedek indir"i kullan. Yedeği başka bir cihaza yüklersen kayıtlar **birleşir**, hiçbiri silinmez.
- **Tüm verileri sil**: yalnızca bu cihazdaki kayıtları temizler.

**Ben → İlerleme / Geçmiş**: dersler, doğru oranları, seri, kayıt ve notların. **Ben → İçerik**: yüklü paketler; yeni paket eklemek ya da senin eklediğini kaldırmak (geri dönüş) için.

## 6. Sık sorular

**Ses çıkmıyor.** Telefonun sessiz modunu ve medya sesini kontrol et. Bazı seslerin dosyası yoksa uygulama cihazın kendi sesini kullanır; kalite düşük olabilir. "Ben → Ayarlar → Tüm sesleri indir" ile dosyaları cihaza al.

**Mikrofon çalışmıyor.** Adres `https://` ile başlamıyorsa mikrofon açılmaz. Tarayıcının site izinlerinden mikrofona izin ver. Her kayıt sorusu yazıyla da cevaplanabilir.

**Verilerim kayboldu.** Tarayıcı verilerini temizlemek ya da "gizli sekme" kullanmak kayıtları siler. Bu yüzden yedek almanı öneririz; yedeği "Ayarlar → Yedek"ten geri yükleyebilirsin.

**İki cihazda kullanıyorum.** Her cihaz kendi kayıtlarını tutar. Birinden yedek indirip diğerine yükle; kayıtlar birleşir.

**Yeni içerik nasıl gelir?** Siteyi güncelleyen kişi (ya da sen) yeni dosyaları aynı adrese yükler; uygulama bir sonraki açılışta günceller. Kendi paketini eklemek için "Ben → İçerik".
