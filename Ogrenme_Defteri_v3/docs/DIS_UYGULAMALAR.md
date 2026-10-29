# Dış uygulamalar: Voscreen, Busuu ve "canlı izleme" sorusu

Bu belge üç soruya cevap verir: (1) Başka bir uygulamanın testlerini bu uygulama canlı izleyebilir mi? (2) Voscreen ve Busuu nasıl kullanılıyor? (3) Başka hangi uygulamalara bakılabilir?

## 1. Canlı izleme mümkün mü?

**Kısa cevap: hayır, bu uygulamayla mümkün değil.** Nedenleri:

1. **Bu uygulama bir web sitesidir** (telefonda "Ana ekrana ekle" ile uygulama gibi açılır). Tarayıcı, güvenlik gereği, başka bir uygulamanın içinde ne yapıldığını göremez; telefondaki diğer uygulamalar ayrı "kutularda" çalışır.
2. **Voscreen ve Busuu için herkese açık bir bağlantı (API) bulamadım.** Aradığım yerlerde (kendi siteleri ve genel aramalar) geliştiricilerin kullanıcı sonuçlarını okuyabileceği resmî bir arayüz görmedim. Böyle bir arayüz olsaydı bile, kullanıcının hesabına erişim izni ve şirketle anlaşma gerekirdi. Bu, uygulamanın tek başına çözebileceği bir iş değil.
3. **Başka yollar (ekranı okumak, kullanım verisi toplamak) çalışmaz ya da uygun değil:** Bunlar ancak özel bir Android uygulamasıyla yapılabilir ve ciddi gizlilik/izin sorunları getirir. Bir öğrencinin telefonunda başka uygulamaları izleyen bir program kurmak da istenen şey değildir.

**Bu yüzden yaptığımız şey:** her dış uygulama görevinde (a) Google Play / App Store / web düğmesiyle uygulamayı açarsın, (b) görevi yaparsın, (c) buraya dönüp **kaç tane doğru bildiğini ve toplamı** yazarsın. Uygulama yüzdeyi hesaplar, geçmişe kaydeder ve ilerleme sayfasında gösterir. Sonuç senin beyanındır; uygulama doğrulayamaz. Bu yüzden dış uygulama görevleri **isteğe bağlıdır** ve kontrol günlerindeki "kendi ölçümün" yerine geçmez.

Daha iyi bir yol gerekirse: resmî bir iş ortaklığı/API sunan bir uygulama bulunursa (örneğin bir sınav sitesi), bu uygulamaya yeni bir adım türü eklemek gerekir; bu ayrı bir geliştirme işidir.

## 2. Kullandığımız uygulamalar

Her ikisi de `icerik/genel.json` içindeki `disUygulamalar` listesinde tanımlıdır; bağlantıları oradan değiştirirsin.

### Voscreen
- **Ne yapar:** Film, dizi ve röportajlardan kısa video kesitleri gösterir; kesitte ne söylendiğini seçeneklerden bulursun.
- **Neden seçtik:** Kendi kayıtlarımız bilerek yavaş ve net. Voscreen gerçek konuşma hızını ve vurgusunu gösterir; kulağın buna alışsın diye 1. ve 2. haftada isteğe bağlı birer görev var.
- **Bağlantılar:** Google Play `com.voscreen.voscreenapp`, App Store `id907906083`, web `voscreen.com`.
- **Dikkat:** Android sürümünün son güncellemesi eski görünüyor (2023) ve **Google Play sayfasını doğrudan doğrulayamadım**; bilgi üçüncü taraf sayfalara dayanıyor. Uygulama Play'de bulunamazsa ya da açılmazsa web sitesini kullan. Ücretsiz sürümde günlük kesit sayısı sınırlı olabilir.

### Busuu
- **Ne yapar:** Seviyene göre sıralı kısa dersler: kelime, dinleme, konuşma.
- **Neden seçtik:** Kendi derslerimizin yanında ikinci bir bakış açısı; düzenli, kısa ve başlangıç seviyesinde. Gerekirse kendi dersler dışında ek çalışma alanı.
- **Bağlantılar:** Google Play `com.busuu.android.enc`, App Store `id379968583`, web `busuu.com`.
- **Dikkat:** Bu paket kimliği de **Google'ın kendi sayfasından değil, üçüncü taraf sayfalardan** teyit edildi. Ücretsiz sürümde bazı dersler kilitli olabilir; ücretli plan almak zorunda değilsin.

### Bağlantı yanlışsa ne yaparsın?
`icerik/genel.json` içinde ilgili uygulamanın `play`, `ios` veya `web` değerini düzelt; `node scripts/guncelle.mjs` ile doğrula (bkz. `ICERIK_EKLEME.md`). Kullanıcı hiçbir şeyi yeniden kurmaz.

## 3. Başka uygulamalar (bakılabilir, hiçbiri eklenmedi)

Aşağıdakiler **doğrulanmamış önerilerdir**; kullanmadan önce kendin bak:

- **BBC Learning English** ve **British Council LearnEnglish**: ücretsiz, kurumsal kaynaklar; dinleme ve kısa dersler içerir.
- **Duolingo**: oyunlaştırma sevenler için; çıktısı yine elle yazılır.

Neden eklemedik: iki dış uygulama bu iş için yeterli; her yeni uygulama öğrenciye bir karar daha yükler. "Hafıza sarayı" gibi İngilizce dışındaki konular için de dış uygulama eklemedik: yöntem kişiseldir (kendi evin, kendi tuhaf resimlerin) ve burada kurulan akış (kur → yerleştir → bakmadan hatırla → gecikmeli kontrol) bir uygulamadan daha doğrudan sonuç verir.

## 4. Yeni bir dış uygulama eklemek

1. `icerik/genel.json` → `disUygulamalar` listesine `{id, ad, simge, kisa, aciklama, nasil[], uyari, play, ios, web, gorev}` ekle.
2. Bir `dis` adımı içeren ders yaz (örnek: `icerik/dis.json`) ve programa isteğe bağlı (`"istege": true`) görev olarak bağla.
3. `node scripts/guncelle.mjs` çalıştır.
