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

### İlk hafta: yoklama haftası
İlk 7 gün normal ders yok; **seviyeni bulmak için kısa yoklamalar** var (İngilizce, okuma, dinleme, hafıza; spor için yoklama yoktur). Bilmen gerekmez:

- Her yoklama **kolay bir seviyeden** (5. seviye) başlar. Geçersen bir sonraki yoklama biraz daha zor olur (10 → 20 → 35 → 50); geçemezsen uygulama ikisi arasında bir seviye dener. **50'den zorlusu sorulmaz.** Bir yoklamayı geçmek için soruların en az %80'i doğru olmalı; en az 4 soruluk yoklamada tek yanlış da kabul edilir (3/4).
- Beceri başına günde en fazla bir yoklama çıkar; yani hepsini bir günde bitirmek zorunda değilsin.
- Bilmediğin soruda **"Bilmiyorum"**'u seç. Şansa tıklamak seviyeni yanlış gösterir; bu bir not değil.
- Yoklamada yanlış yaptığın sorular **yeniden sorulmaz** (amaç öğretmek değil ölçmek); sonuç ekranında yanlışlarının doğrusunu görürsün.

Bir yoklama bitince **Ben → İlerleme → Seviyelerin** kartında başlangıç seviyen görünür. Başlangıç, bulunan seviyenin biraz altından başlar; çünkü gerçek çalışma başarıyla başlasın istenir.

### İlk haftadan sonra: seviye oturumları
Yedi günlük bir desenle, her gün İngilizce, o günün becerisi (okuma, dinleme ya da hafıza) ve spor için seviyene göre kısa bir **seviye oturumu** çıkar.

- Oturumda puanlanan **bütün soruları ilk denemede doğru** yaparsan seviyen **bir basamak** yükselir. Birini bile yanlış yaparsan seviye aynı kalır (yanlış bir ceza değil; ilerlemeden önce sağlamlaşma). Spor'da üst üste 2 rahat oturum gerekir.
- Oturum **çok zor** geçerse (doğru oranı %60'ın altında, üst üste iki kez) seviye bir basamak iner. Yarım bıraktığın oturum hiçbir şeyi değiştirmez.
- Seviye bir not değil, **bugünkü çalışmanın zorluğunu** belirler. Düşmek başarısızlık değildir.
- Seviyenin yanlış olduğunu düşünüyorsan **Ben → İlerleme → Seviyelerin → Elle ayarla** ile değiştirebilirsin (nedenini yazabilirsin; rapora girer).

## 3. Sonuçları nasıl okursun?

- **Doğru / toplam ve yüzde** yalnızca nesnel sorular için gösterilir (çoktan seçmeli, dinleyip yazma, sayı, eşleştirme…). İlk denemedeki yanıt sayılır; yanlış yaptığın soru sonda bir kez daha sorulur ama sonucu değiştirmez.
- **Açık uçlu sorular** (kendi cümlenle anlat, kısa konuşma) puanlanmaz. Yalnızca kaydedilir. Cevabından sonra "Yanıtında hangileri vardı?" listesi çıkar; hangi noktaları söylediğini kendin işaretlersin (yazıda bulabildiklerimiz önceden işaretlenir).
- **Yoklamalar ve kontrol dersleri** tek seferliktir: yanlışlar tekrar sorulmaz. Amaç not almak değil, neyi tekrar etmen gerektiğini görmektir.

### Çalışma raporu (öğretmene ya da yapay zekâya vermek için)

"Ben → İlerleme" sayfasının altında **Çalışma raporu** kartı var. Rapor, yaptığın çalışmayı bir yapay zekânın ya da öğretmenin karıştırmadan okuyabileceği düz yazıya çevirir. Her satırda şunlar birlikte yazılır: hangi ders ve gün, uygulamanın ne sorduğu (dinlediysen ne duyduğun), senin yanıtın ve doğrusu. Yazdıkların olduğu gibi aktarılır; ses kayıtlarının içeriği girmez, yalnız süresi yazılır.

1. **Hangi günler?** seç (Bugün, Son 7 gün, Son 30 gün, Tümü).
2. **Ayrıntı:** *Kısa* (önerilen) doğru bildiklerini yalnız sayar, yanlışlarını ve yazdıklarını eksiksiz yazar. *Tam* her soruyu tek tek yazar (uzun olur).
3. **Yapay zekâ için kopyala** düğmesi raporun başına kısa bir görev metni ekler (neleri iyi yaptığını, neyi karıştırdığını, 3 öneriyi iste); sonra yapay zekânın sohbet kutusuna yapıştır. **Raporu indir** ise `.md` dosyası verir.

Raporun ilk bölümü ("Nasıl okunur") okuyan kişiye ✔/✘, "ilk deneme", "Beyan" gibi sözleri açıklar; ayrıca yapıştırmana gerek yok. Rapor bir **not değil, ham kayıttır**.

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
- **Yapay zekâ bağlantısı (isteğe bağlı)**: kaydını bilgisayardaki yerel sunucuya gönderir; orada çalışan MCP sunucusu raporunu bir yapay zekâ asistanına açar. Kurulum için bilgisayarı kuran kişiye `docs/MCP.md`'yi göster. Hiçbir şey internete gönderilmez; yine de yapay zekâya verdiklerini o hizmet görür.
- **Tüm verileri sil**: yalnızca bu cihazdaki kayıtları temizler.

**Ben → İlerleme / Geçmiş**: seviyelerin, dersler, doğru oranları, seri, kayıt ve notların. **Ben → İçerik**: yüklü paketler; yeni paket eklemek ya da senin eklediğini kaldırmak (geri dönüş) için.

## 6. Sık sorular

**Ses çıkmıyor.** Telefonun sessiz modunu ve medya sesini kontrol et. Bazı seslerin dosyası yoksa uygulama cihazın kendi sesini kullanır; kalite düşük olabilir. "Ben → Ayarlar → Tüm sesleri indir" ile dosyaları cihaza al.

**Mikrofon çalışmıyor.** Adres `https://` ile başlamıyorsa mikrofon açılmaz. Tarayıcının site izinlerinden mikrofona izin ver. Her kayıt sorusu yazıyla da cevaplanabilir.

**Verilerim kayboldu.** Tarayıcı verilerini temizlemek ya da "gizli sekme" kullanmak kayıtları siler. Bu yüzden yedek almanı öneririz; yedeği "Ayarlar → Yedek"ten geri yükleyebilirsin.

**İki cihazda kullanıyorum.** Her cihaz kendi kayıtlarını tutar. Birinden yedek indirip diğerine yükle; kayıtlar birleşir.

**Yeni içerik nasıl gelir?** Siteyi güncelleyen kişi (ya da sen) yeni dosyaları aynı adrese yükler; uygulama bir sonraki açılışta günceller. Kendi paketini eklemek için "Ben → İçerik". Düz metinle içerik yazmak için `docs/KOLAY_GIRIS.md`.

**"Bu seviyede içerik yok" ya da "Bu metni daha önce çözdün" diyor.** Hazır okuma ve dinleme metinleri belli bir seviyeye kadardır ve her aralıkta birkaç metin vardır (okuma 28, dinleme 23). Yeni metin kalmayınca uygulama en eski metni **pekiştirme** olarak yeniden verir: bu tur kaydedilir ama seviyeni değiştirmez, çünkü cevapları ezberlemiş olabilirsin. Yeni içerik gerekir (`docs/KOLAY_GIRIS.md`, `docs/MCP.md`); seviyen hatalı değildir. Yetkin bir öğrenci için bu durum yaklaşık 3. haftadan sonra görülebilir.

**Seviyem çok yavaş yükseliyor.** Yükselme için oturumdaki bütün puanlanan soruların ilk denemede doğru olması gerekir; bu bilerek sıkı bir kuraldır (`docs/SEVIYE_SISTEMI.md`, bölüm 6). Çok yavaş buluyorsan kuralı ayarlamak için bilgisayarı kuran kişiye söyle.
