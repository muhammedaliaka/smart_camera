# Kişisel öğrenme, İngilizce, hafıza, odak ve spor sistemi
## Birleşik ana rapor, bağımsız analiz ve değerlendirici talimatı (v11)

**Tarih:** 27 Ekim 2026 · **Sürüm:** v11 (v10 raporu ve ilk hafta paketinin hata analizi, düzeltmeler, yeniden kurulmuş paket)
**Durum:** Araştırma ve kaynak seçimi yapıldı; ilk dört günün çalışma ve son üç günün soru/uygulama materyalleri ayrı pakette hazırlandı. Türkçe ve İngilizce nöral sentetik sesler üretildi; otomatik tanıma ile geri okundu, **insan dinleme kontrolünden geçmedi** ve kullanıcı cihazında denenmedi. Gerçek cihaz doğrulaması eksik. Otomatik kayıt uygulaması geliştirilmedi; eski prototip değiştirilmedi. İçerik hazırlığı ile çalışan ürün ayrıdır.
**Kimin için:** (1) Kullanıcı; (2) bu belgeyi bağımsız değerlendirme için alacak başka bir yapay zekâ veya insan.

---

## 0. Bu belge nasıl okunur

### 0.1. v11'de ne değişti?

27 Ekim 2026'da v10 paketinin 26 dosyası ve bu rapor tek tek okundu; bulgular ve düzeltmeler `09_DEGISIKLIK_VE_HATA_RAPORU.md` dosyasındadır. Bu raporu ilgilendiren başlıca değişiklikler:

1. **Paket yeniden kuruldu (v11):** Gün 5–7 görevleri üç ayrı dosyaya bölündü (bir günün dosyasını açmak sonraki günlerin soru ve hafıza satırlarını göstermesin diye); anahtarlar gün gün ayrıldı; H6 anahtarı Gün 8 dosyasına alındı (kontrol 4'ten önce görünmesin). Okuma görevlerinin soruları metne özgü olmaktan çıkarılıp dört metinde aynı üç genel soru yapıldı (ön bilgi/hazırlanma etkisini azaltmak için).
2. **Sesler yeniden üretildi:** Türkçe ve İngilizce nöral sesler Piper ile üretildi; üretim sırasında birden çok aday sentezlenip otomatik tanıma ile geri okunarak en iyisi seçildi, sonra nihai mp3 dosyaları `medium` boyutlu bir tanıma modeliyle yeniden okundu (dikte dosyalarında bu model seçimde de kullanıldığı için orada kontrol bağımsız sayılmaz). Çok kısa tekil öğeler (sayılar, sıra sözcükleri, gün adları) otomatik tanıma için güvenilmezdir; dikte dosyaları bu yüzden taşıyıcı ifade, dosyadaki gerçek bağlam ve iki modelle yeniden üretildi (bazı tek sözcüklerde ilk İngilizce ses bozuk çıktığı için dikte sesi değiştirildi). **İnsan dinleme kontrolü yoktur.**
3. **İngilizce tekrar takvimi (xlsx) eklendi:** ardışık 3–10–20–50 kuralı ve gecikmede “sonraki aralık gerçekleşen tekrardan başlar” tasarımı formülle işler; planlanan ve gerçekleşen tarih ayrı tutulur. Yalnız LibreOffice ile denendi (Bölüm 8.8).
4. **Numaralama:** Bölüm 8.8 numarası boş kalmıştı (8.7'den 8.9'a atlanıyordu); “İngilizce tekrar kuralı” artık **8.8**'dir ve tüm göndermeler güncellendi.
5. **Hafta 1 tabloları paketle eşlendi:** 13.2 (gün gün hedefler), 7.8 (gecikmeli hatırlama aralıkları: 5 dk · 30 dk · 2 sa · ertesi gün; bir haftalık takip Gün 12–13), 9.3 (H5 sırası sabit, dengelenmedi), 9.5 (8 duraklı güzergâh, 6 öğelik eğitim listesi, 7 öğelik H1), 10.2 (özgün Türkçe ≈155 sözcüklük dört metin, tek ortam), 11.7/11.11/11.13 (Hafta 1'de yüklü direnç çalışması yok; üç basamaklı rampa; duvar şınavı).
6. **Kaynaklar yeniden açıldı (27 Ekim 2026):** USA Learns, VOA, British Council, Stanford, EF SET, NSCA PDF, Anki, Brain Workshop, Nike Training Club. Busuu yardım sayfası 403 verdi ve Melby-Lervåg bağlantısı yeniden açılmadı; bu iki satır işaretlendi (Bölüm 17).
7. **Yeni riskler:** RK28 (sentetik sesin doğrulanmamış kalitesi), RK29 (Hafta 1 paketinde ayrıştırılamayan karışıklıklar). Yeni kaynak: K73–K74.

**v10 değişiklikleri (R9) — korunur:**

R9, önceki raporun açık yorumlarını netleştirdi. Değişiklikler ilgili bölümlere işlendi; önceki kullanıcı alıntıları tarihsel kayıt olarak korundu.

1. **Tekrarlar gün aralıklarıdır:** önceki çalışmadan 3 gün sonra, sonraki tekrardan 10 gün sonra, sonra 20 ve 50 gün. Gecikme yokken öğrenmeye göre 3., 13., 33., 83. gün. Eski mutlak gün varsayımı V1 kapatıldı.
2. **İlk hafta dört gün çalışma, üç gün test:** eğitimde uygun ve iyi dış kaynak varsa o tercih edilir; yetersizse/yoksa özel içerik hazırlanır. Dört günün özel uygulamada geçmesi zorunlu yorum değildir.
3. **Araştırma ve hazırlık başlatıldı:** R9 araştırma, kaynak seçimi ve gereken özel materyalin üretimi talimatıdır. Aynı onay sorusu araştırmanın önüne yeniden konmaz. Bu sürümde çalışan kayıt yazılımı yapılmadı.
4. **Kaynak seçimi:** USA Learns ana İngilizce kaynağı; VOA destek/yedek; Stanford hafıza sarayı rehberi dış yöntem kaynağı. Türkçe kişisel pratikler ve kayıt içerikleri özel hazırlandı. Bu seçim gereksinime uygunluk önerisidir; cihazda veya karşılaştırmalı etkililik deneyinde üstünlük kanıtı değildir.
5. **Yük hesabı düzeltildi:** eski “yük yaklaşık yarıya iner” yorumu yanlıştı. Günde N yeni madde ve madde başına dört tekrar için gecikmesiz kararlı yük yine 4N/gün; büyüme eşikleri değişir.
6. **Kaynak notları düzeltildi:** EF SET'in dört becerilik ücretsiz sürümü ile iki becerilik sürümü ayrıldı; VOA indirme bağlantıları ve NSCA'nın ardışık olmayan direnç günü önerisi resmî sayfalardan doğrulandı.
7. **İlk hafta paketi:** günlük kartlar, dört İngilizce yedek dersi, okuma metinleri, spor başlangıç kartı, üç test gününün özgün soruları, gün gün ayrı anahtarlar, seslendirme metinleri, Türkçe ve İngilizce nöral sentetik sesler (v11'de yeniden üretildi) ve boş kayıt şablonları. Otomatik kayıt uygulaması ve 50 makalelik havuzun tamamı bu teslimde yoktur.

V2–V5 koşullu yorum olarak kalır. Sağlık kontrol tarihi sorulmaz. Son açık kullanıcı talimatı eski yorumdan önce gelir.

### 0.2. Etiketler

Her önemli bilgi şu etiketlerden biriyle okunmalıdır:

| Etiket | Anlamı |
| --- | --- |
| **[Karar]** | Kullanıcının açıkça verdiği veya seçtiği karar. Yeniden sorulmaz. |
| **[Beyan]** | Kullanıcının kendisi hakkındaki sözü. Ölçülmüş / doğrulanmış veri değildir. |
| **[Devredildi]** | Kullanıcının “sen karar ver / önerine göre cevapla” dediği kalem. Varsayılan olarak çalışır; içeriği asistan önerisidir; Bölüm 15'te geri alma koşuluyla listelidir. |
| **[Analiz]** | Rapor yazarının çıkarımı veya önerisi. Kullanıcı kararı değildir. |
| **[Kanıt Kxx]** | Bölüm 17'deki kaynağa dayanan dış bilgi. Genel kanıt, bu kullanıcıda aynı sonucu garanti etmez. |
| **[Açık]** | Bilinmeyen veya karar bekleyen. |
| **[Varsayım]** | Kullanıcının ifadesinden çıkarılmış, doğrulanmamış yorum (V-kodları). İtiraz gelmezse geçerli; Bölüm 16.1b'de listelidir. |

### 0.3. Aşılmaz sınırlar

1. Uygulama **puan, yüzde, doğru / yanlış hükmü, otomatik teşhis** vermez. [Karar]
2. Sağlık yakınmalarından **tanı üretilmez**; eğitim ölçümleri tıbbi test yerine konmaz.
3. Uygulamanın kaydı ile bağımsız değerlendiricinin yorumu **birbirine karıştırılmaz**.
4. R9 ile araştırma, kaynak seçimi ve gerekli özel içerik hazırlığı başlatıldı. Hazırlanmış içerik, kurulmuş veya yayınlanmış uygulama sayılmaz. Önceki prototip (“Odak Atölyesi”) onaylı tasarım değildir ve esas alınmaz.
5. Kullanıcının kararları yeniden sorulmaz; çelişki varsa çelişki gösterilir, sessizce çözülmez.

---

## 1. Yönetici özeti

### 1.1. Projenin özü

Kullanıcı (yaklaşık 16 yaş, Android telefon + Windows bilgisayar, bütçe sıfır), günlük düzeni içinde şu alanlarda gelişmek ve bunu **kanıtlanabilir kayıtla** izlemek istiyor: İngilizce (Amerikan; amaç her türlü network ve AI gerekmeden anlayıp dinleyebilme), gecikmeli hafıza, geniş kapsamlı kombinasyonlu çalışma (dinle + hareket + yaz + konuş), okurken odak, kapsamlı spor ve 25 konu / 50 makalelik bir okuma havuzu. Sistemin üç katmanı vardır:

1. **Eğitim:** Büyük ölçüde dış, ücretsiz kaynaklar; dış kaynağın karşılamadığı alanlarda özel görevler.
2. **Kayıt:** Uygulama hiçbir hüküm vermeden her denemeyi, sesi, zamanı ve olayı korur; tek ZIP üretir.
3. **Yorum:** Yalnızca dışarıdaki bağımsız değerlendirici (insan veya yapay zekâ) yapar.

**Planlama ilkesi (D24):** Günlük yapı dakika değil **hedef (çıktı)** üzerinden kurulur; hedefe gün içinde istediği zamanda, **uyku öncesine (≈23:00) kadar** ulaşmak yeterlidir (D30).

**Büyük resim (D28, D29, D32, D34):** **Hafta 1** hiçbir haftaya benzemez; nerede olduğumuzu tüm alanlarda öğrenmek içindir (başlangıç haritası). **Hafta 2 ve sonrası derin çalışma**dır; Hafta 1'den sonra **“test” kavramı yalnız İngilizce'de kalır** (3-10-20-50 tekrar kuralı), diğer alanlar kesintisiz pratiktir (D34–D36); alanlar beş tipe ayrılır (Bölüm 4.4). Üç aylık hedef **bırakmamak**tır.

### 1.2. Bu sürümün en önemli analiz bulguları

| # | Bulgu | Neden önemli | Bölüm |
| --- | --- | --- | --- |
| 1 | **Dinleme ölçümü tek başına İngilizce düzeyini göstermez.** Kullanıcı sessiz ortamda bile hızlı / yoğun konuşmayı kaçırabildiğini söylüyor; sonuç işitme + işlemleme + dikkat + dil bilgisinin birleşimidir. | Yanlış yorum riski en yüksek ölçüm. | 7, 10 |
| 2 | Çözüm: **konuşma hızını ölçüm değişkeni yap**, aynı yönergeleri **hız değişkenli Türkçe kontrol**le tekrarla. | Dil yükünü hafıza / işlemlemeden ayırmanın ucuz yolu. | 7, 9, 10 |
| 3 | **Kombinasyonlu çalışma geniş bir alan:** dinle + hareket, konuşurken kendi fikrini yazma, konuşmayı yürütürken not / mesaj yazma, hepsini hatırlama. Bunun için **C0–C6 kanal merdiveni** önerildi; her seviyede önce tek görev tabanı, Türkçe önce, hız değişkenli. | Karmaşık kombinasyon hem ölçüm hem güvenlik tasarımı ister; çift görev maliyeti ergenlerde ölçülmüş. | 10.4 |
| 4 | **Hafta 1 = harita, Hafta 2+ = derin çalışma.** Derin çalışma için haftalık dönen “günün derin odağı” + her gün sabit dinleme çekirdeği + küçük bakım hedefi. Hafta 1'den sonra kontrollü yeniden ölçüm **varsayılan olarak yok** (D34); ilerleme İngilizce tekrar kaydı, pratik kayıtları ve haftalık özetle izlenir. | “Yeterli hissettim” yerine kayda dayalı ayna; ancak kontrollü tekrar ölçüm olmadığından “gelişti” iddiası zayıf kalır (RK24). | 7.9, 13.7–13.8 |
| 5 | **Dakika yerine hedef:** spor ve çalışma çıktı birimleriyle (km, set, tur, ders, kart) tanımlanır; dakikalar yalnızca kapasite analizi ve gözlem içindir. | Kullanıcının kalıcı tercihi. | 3.5, 11, 13 |
| 6 | **Sürdürme asıl hedef:** kullanıcı önceki düzeni “yeterli hissettim” diye bıraktı; bu kez “3 ay böyle durmamak” istiyor. Asgari gün, eğer–o zaman planları, planlı mola ve haftalık özet önerildi. | Başarısızlık değil erken yeterlilik hissi ana risk. | 13.9, 14 (RK19) |
| 7 | **Eğitim ile kayıt aracı ayrıldı:** ilk dört gün iyi dış kaynak; yetersiz/yoksa özel materyal. R9 ile araştırma ve hazırlık başladı. | Özel uygulama dış eğitimin ön koşulu değil; otomatik test kayıtları ayrı ürün gereksinimi. | 5.11, 13.6 |
| 8 | **Redmi / HyperOS arka plan kısıtları** ve web uygulamalarında zamanlanmış bildirim sorunu. | Gecikmeli hatırlama testi zamana bağlı; alarm için telefonun Saat uygulaması. | 5 |
| 9 | **Kanıt tavanı:** Çoklu görev antrenmanının günlük hayata aktarımı zayıf; hafıza sarayı sıralı listede etkili ama kanıt kalitesi düşük; göz egzersizinin okumaya faydası gösterilmemiş. | Vaat vermemek, gerçek hayata benzeyen görevleri ölçmek gerekir. | 7, 9, 10 |
| 10 | **Gözetimsiz bar çalışması** en somut güvenlik riski; uyku öncesine kadar uzayan gün ise şiddetli hareketin yatışa yakın yapılması riskini getiriyor. | Kademeli yük; şiddetli çalışmayı yatıştan önce bitirme önerisi. | 11 |
| 11 | **Yedek:** haftalık elle USB-C aktarımı + 3-2-1 mantığı + dışarı çıkan kopyada şifreleme. | Telefon kaybı / sıfırlama ve tarayıcı deposu silinmesi riski. | 6.9 |
| 12 | **Tekrar aralıkları doğrulandı:** önceki çalışmadan 3/10/20/50 gün; nominal günler 3/13/33/83. Kararlı yük 4N/gün. | Eski mutlak gün ve yarım yük yorumları kaldırıldı. | 8.8 |
| 13 | **Alan tipolojisi:** ders (hafıza sarayı gibi), canlı pratik, makale, İngilizce öğrenme, geri kalan hepsi mekanik (beden eğitimi mantığı); her alan sıfırdan anlatılır, analiz ve rapor tipe göre. | Aynı “rapor” her alan için anlamlı değil: antrenman günlüğü ile geri çağırma kaydı farklı okunur. | 4.4 |
| 14 | **Konuşma partneri yok:** gerçek hayattaki kesintilerle (biriyle konuşurken komutu hatasız sürdürmek) çalışma için partnersiz, rızaya dayalı protokol. | Başkasının sesi kaydedilmez; uygulama ortam kaydı almaz (D08). | 10.6 |

### 1.3. Hafta 1 hedefi (dürüst kapsam)

Hafta 1 **hiçbir haftaya benzemez** (D34): tüm alanlarda “test”in bulunduğu tek haftadır. Amacı **nerede olduğumuzu** öğrenmektir: İngilizce, hafıza, dinleme / kombinasyon, odak ve spor için başlangıç haritası, gerçek kapasite ve yöntemlerin uygulanabilirliği. İlk 4 gün yöntem ve kaynak deneyimi, son 3 gün kapsamlı kayıt / test. Hafta 1 kalıcı kazanım, uzun vadeli hafıza değişimi veya günlük hayata aktarım hakkında hüküm vermez (Bölüm 7.8, 13).

### 1.4. Açık kalanların durumu

R9 tekrar aralıklarını ve ilk dört günün kaynak tercih ilkesini açıkladı; araştırma ve gerekli özel içerik hazırlığı talimatı verdi. Bu iş için yeni kişisel soru engeli yok. V2–V5 koşullu yorumdur. Partner yok; sağlık kontrol tarihi sorulmaz. Kayıt-kritik testlerin bütün akışı ve kullanıcı cihazındaki doğrulama tamamlanmadan hazır ilan edilmez; sesler üretildi ama insan dinleme kontrolünden geçmedi.

---

## 2. Kullanıcı profili ve bağlam

| Alan | Bilgi | Etiket | Not |
| --- | --- | --- | --- |
| Yaş | Yaklaşık iki ay sonra 17; şu an 16 | [Beyan] | Doğum tarihi yok. Reşit değil: ses ve sağlık beyanı içeren paketin paylaşımı kişisel karar (Bölüm 6.8). |
| Boy / kilo | 176 cm / 78 kg | [Beyan] | Yağ oranı tahmini %22–24 ölçülmemiş. Kilo verme hedefi yok; eklenmemeli. |
| Spor geçmişi | ~1,5 yıl önce 3 ay aktif spor, sonra bırakmış | [Beyan] | Şu an dövüş sporu yok, sakatlık yok. **Düzenli ilaç yok.** Bilinen tanı / hekim kontrolü bilgisi verilmedi. |
| Telefon | **Redmi Note 13 Pro+ 5G**, HyperOS 3 | [Karar / onaylandı] | HyperOS 3 = Android 16 [K40]. |
| Bilgisayar | **Windows 11 Pro** (“olması lazım”) | [Beyan, kesin değil] | Tarayıcı bilinmiyor. |
| Kulaklık | **USB-C kablolu** | [Beyan] | Mikrofonu olup olmadığı Gün 0'da test edilir. |
| Bütçe | Ücretsiz; açık kaynak tercih | [Karar] | Ücretsiz ≠ açık kaynak ≠ yeniden dağıtılabilir. |
| İngilizce | Tahmini <1000 kelime; cümle kurmakta zorlanıyor; uzun süredir dinlememiş | [Beyan] | Ölçülmedi; A1 / A2 tanısı konmaz. |
| İngilizce amacı | **Her türlü amaç için network gerekli** ve **AI gerekmeden rahatlıkla anlayıp dinleyebilme** | [Karar] | Belirli bir alan yok (genel network). AI'ya ihtiyaç duyulan durumlar belirtilmedi. Alıcı beceriler ve etkileşim ağırlıklı (Bölüm 8). |
| Kombinasyonlu çalışma hedefi | Dinle + hareket yap; klavyede kendi fikrini yazarken biriyle konuşup konuşmayı **hatasız yürütme**; karmaşık kombinasyonlar; “her türlüsü” | [Karar] | Ayrıntı Claude'a devredildi (Bölüm 10.4). “Hatasız” kullanıcının kendi hedefidir; uygulama hata saymaz. **Konuşma partneri yok (D39);** örnek senaryo: yapay zekâya komut yazarken biriyle konuşurken komutu hatasız sürdürmek (Bölüm 10.6). |
| Görme | Gözlük **sürekli** takılı; **gözlük bulanık göstermiyor**; göz / baş ağrısı yok; son kontrol 2024 son aylarında göz hastanesinde | [Beyan] | Çift görme belirtilmedi. Numara ve sonuç bilinmiyor. |
| İşitme | ~2 yıldır zaman zaman duymakta / anlamlandırmakta zorlanma; nadiren çınlama; “çok değişken”; **sessiz ortamda bile hızlı / yoğun konuşmada duyamayabiliyor**; iki kulakta olması muhtemel ama bilgisi yok | [Beyan] | Objektif ölçüm yok, muayene geçmişi bilinmiyor. “17.500 Hz” kullanıcı tarafından geri çekilmiş tahmindir; **veri değildir**. |
| Hafıza | Bazen 5 sn önce söyleneni unutuyor; önemli bir şeyi ~yarım gün tutuyor; orta gecikmede kolay unutuyor; çok sevdiği konuyu 3+ kez düzenli dinleyince kalıp ve bilgi kalıyor; 7 yaş öncesini hatırlamıyor | [Beyan] | Klinik yorum yok. 7 yaş örneği başlangıç tarihi kanıtı değildir. |
| Not alma | Not almıyor; alsa da unutuyor | [Beyan] | Ders başı görevinde not stratejisi isteğe bağlı kalır (Bölüm 9.3). |
| Odak | Okurken dikkat kayıyor; aynı satıra veya 2 satır geriye dönüyor | [Beyan] | **Çelişki:** önceki beyan “ekranda ve kitapta, kitapta daha çok”; son beyan “kitaplarda, PDF'lerde az oluyor”. Nerede en çok olduğu belirtilmedi; test her ortamda yapılır (Bölüm 10.2). |
| Süreklilik geçmişi | Benzer bir düzende “devam edebilirdim ama iyi gitti, yeterli hissettim” deyip bıraktı; mola sonrası doğru anı bekledi | [Beyan] | Başarısızlık değil **erken yeterlilik hissi** (RK19). |
| **3 aylık hedef** | **“3 ay çalışırsam böyle durmamayı gaye edinmek”**; skill temelli yeterlilik onayı şimdilik verilmiyor | [Karar] | D32. Başarı ölçütü: sürdürme (Bölüm 13.9). |
| **Başlangıç** | İlk hafta 4 gün çalışma + 3 gün test; iyi dış eğitim, yetersiz/yoksa özel materyal | [Karar R9] | Hafta 2+ derin çalışma; ilk dört günün özel uygulamada olması zorunlu değil. |
| Planlama tercihi | **Dakika cinsinden yapılandırmayı sevmiyor**; hedef X ise ona ulaşmak yeterli; **“akşam” = uyku öncesi, ≈23:00** | [Karar] | D24, D30. |
| Uyku | Gece hedefi 7–7,5 sa; şekerlemeyle toplam ~8 sa; yatış 23–24, kalkış 6.30–7.15 | [Beyan] | Gerçek uyku kaydı yok. 13–18 yaş için 8–10 sa öneri [K1–K2]. Gün sonu hedef sınırı yatışa bitişik (Bölüm 3.5). |
| Spor erişimi | Hafta içi ağırlıklara her saat; hafta sonu ağırlık yok; güvenlik tutacakları sağlam; yardımcı kişi nadiren | [Beyan] | Envanter Bölüm 11.2. |
| **Sağlık kontrolü planı** | Göz, kulak-burun-boğaz ve diş check-up'ı yaptırmayı planlıyor (“yapılabilirse”); **tarih kesin değil, sorulmaz** | [Beyan; D38] | Sonuç gelirse bağlam notu olarak eklenir; başlamak sonucu beklemez (Bölüm 10.5). |
| **Çalışma ortamı** | Yalnız değil; çevrede başkalarının olduğu, biriyle konuşulan durumlar oluyor; konuşma partneri yok | [Beyan; D39] | Gerçek-hayat kesintili yazma protokolü (Bölüm 10.6). |
| **Alanların doğası** | “Hafıza sarayı gibi” şeyler kendi başına ders; canlı pratik, makale ve İngilizce öğrenme dışındaki her şey mekanik (beden eğitimi mantığı); “galiba / muhtemelen” | [Karar; ifade kesin değil, D37] | Bölüm 4.4. |

---

## 3. Kapasite ve yük analizi

### 3.1. Kullanıcının kapasite beyanı [Karar / Beyan]

- Spor, okul ve TYT **dışında** günlük çalışma: **taban ≈2 saat, uygun günlerde 4 saate kadar.** Zorunlu doldurma süresi değildir; gerçek kapasite denemeyle anlaşılacak.
- Tek oturum: yaklaşık **≤30 dk**; zorlarsa 60 dk.
- Spor: günlük **70–80 dk eşdeğeri iş yükü** (Bölüm 11).
- Uyku: gece 7–7,5 sa + şekerleme ≈ 8 sa.

Bunlar kullanıcının **iş yükünü boyutlandırmak için verdiği** göstergelerdir. Kullanıcı dakika cinsinden yapılandırmayı sevmediği için (D24) plan **çıktı birimleriyle** sunulur; dakikalar yalnızca bu bölümdeki analiz içindir (Bölüm 3.5).

### 3.2. Günlük 24 saat bütçesi [Analiz]

| Kalem | Düşük senaryo | Yüksek senaryo |
| --- | --- | --- |
| Uyku (gece + şekerleme) | 8,0 sa | 8,0 sa |
| Spor (70 / 80 dk eşdeğeri) | 1,17 sa | 1,33 sa |
| Çalışma (2 / 4 sa) | 2,0 sa | 4,0 sa |
| **Toplam bilinen** | **11,2 sa** | **13,3 sa** |
| **Okul + TYT + ulaşım + yemek + hijyen + dinlenme için kalan** | **12,8 sa** | **10,7 sa** |

Kalan 10,7–12,8 saatin yeterli olup olmadığı, **okul ve TYT saatleri verilmediği için** değerlendirilemez; kullanıcı saat bazlı yapılandırma istemediği için bu bilgi artık istenmiyor. Bu bir hüküm değil, eksik veridir; risk kaydında (RK01) izlenir ve gerçekleşen yük Hafta 1'de **gözlemle** öğrenilir.

### 3.3. Haftalık yük [Analiz]

- Spor: 7 gün × 70–80 dk eşdeğeri = **8,2–9,3 sa/hafta**; yalnız zorunlu çekirdek (≈50 dk eşdeğeri) ise 5,8 sa/hafta.
- Çalışma: 7 gün × 2–4 sa = **14–28 sa/hafta.**
- En ağır gün (Hafta 1 test günü; sonrasında test günü yok, D34): 4 sa test + 80 dk spor = **≈5,3 sa**.
- WHO / CDC çerçevesi: 5–17 yaşta günde ≥60 dk orta-şiddetli aktivite, haftada ≥3 gün kas-kemik güçlendirme [K25, K32]. Plan bu eşiğin üstünde; çekirdek-yalnız gün altında, ancak denge / çeviklik / ısınma tam orta-şiddet olmayabilir ve gündelik hareket de katkı yapar. Bu yüzden isteğe bağlı eklenti, ölçütün “tamamlayıcı” kısmıdır.

### 3.4. Koruyucu kurallar [Devredildi G01]

1. **Önce eklenti kesilir.** Yorgunluk, kötü uyku veya yoğun gün varsa isteğe bağlı hedefler (spor eklentisi, isteğe bağlı çalışma kalemleri) düşer; zorunlu çekirdek korunur.
2. Art arda iki gece toplam uyku <7 sa ise (kullanıcı beyanı) ertesi gün eklenti yapılmaz ve bu kayda geçer. Eşik keyfidir; Hafta 1 verisiyle yeniden ayarlanır.
3. AAP'ye göre aşırı antrenman “antrenman–toparlanma dengesizliği”dir; belirtiler: süregiden yorgunluk, kötü uyku, ruh hali değişikliği [K34]. Bu üçü günlük bağlam notlarına eklenir (Bölüm 6.4).

### 3.5. Sunum ilkesi: hedef-temelli, dakika değil [Karar D24, D30 + Analiz]

- **Kullanıcıya görev, çıktı olarak sunulur:** “USA Learns ders 3'ü bitir”, “10 kart”, “1 serbest yazı”, “4 hareket × 2 set”, “≈2,5–3 km tempolu yürüyüş eşdeğeri”. Süre yazılmaz.
- **Süre iki yerde kalır, ikisi de hedef değildir:** (a) bu bölümdeki kapasite analizi; (b) uygulamanın **otomatik gözlem** olarak kaydettiği gerçekleşen süre (ölçüm verisi, kullanıcıya “şu kadar dakika yap” diye gösterilmez).
- **“Akşama kadar” kuralı (D30):** Günün hedeflerine gün içinde istenen zamanda ulaşılır; blok saatleri zorunlu değildir. **Gün sonu sınırı uyku öncesi, yaklaşık 23:00**’tür. Bu sınırdan sonra tamamlanmamış çalışma hedefleri “yarım” sayılır (D04, D05).
- **Uykuyla uyum [Analiz]:** Yatış 23–24 olduğundan gün sonu sınırı yatışa bitişiktir. Ergenlerde yatışa yakın şiddetli egzersizin uykuya etkisi için doğrudan kanıt ince; yetişkin verisi karışık, asıl kaygı yatıştan yaklaşık bir saatten daha az önce biten **şiddetli** egzersiz [K58]. Bu yüzden öneri: **şiddetli hareket ve ağır güç hedefi yatıştan en az ≈1 saat önce biter; 23:00'e doğru kalan hedefler hafif ve sakin olanlardır** (dinleme, okuma, hafif hareketlilik). Karar kullanıcıdadır.
- **Zaman kilitli ölçümler istisnadır:** Gecikmeli hatırlama ölçümü doğası gereği zaman aralığı içerir (“kısa / birkaç saat / ertesi gün / bir hafta” kategorileri). Bunlar **görev planlaması değil ölçüm protokolü**dür; uygulama gerçek gecikmeyi kaydeder (Bölüm 9.4, G04). İngilizce tekrar kuralı (3-10-20-50) de zaman kilitlidir ama **gün biriminde** çalışır (Bölüm 8.8); dakika veya saat görev saati değildir.
- **Birikim ve kaydırma (D04, D05)** gün sonunda “yarım” kalan hedefler için işler; spor için işlemez (D18). Hazırlık → test gününün yerine geçtiği konu ise “yarım” değil **atlanmış** sayılır (D36, T20).

---

## 4. Kesinleşmiş kurallar ve gerilim envanteri

### 4.1. Kullanıcı kararları (D-kodları)

| Kod | Karar | Kaynak (Ek A) |
| --- | --- | --- |
| D01 | Uygulama puan, yüzde, doğru / yanlış hükmü, otomatik teşhis vermez. Yalnız kayıt ve “beklenen / verilen” gösterir. | U8 |
| D02 | Cevap anahtarı kullanıcı istediği anda elle açılır; ayrıca **her maddede 3. gönderimde otomatik açılır** (yanıtın doğruluğuna bakılmadan, gönderim sayısına göre). | U8, R1-1 |
| D03 | Görev tamamlanması: gerekli adımlar bitip her soru için **yanıt ya da “bilmiyorum”** girilmesi. “Anlamadım” işareti isteğe bağlıdır, ilerlemeyi engellemez, tekrar listesine düşürür. | R1-2 |
| D04 | **Takvim kaydırılmaz:** dünkü yarım hedef önce, sonra bugünkü; bugün yarım kalırsa ertesi gün aynı biçimde. | U8 |
| D05 | Birikim kuralı aynı kalır; eşik aşılırsa uygulama “bu görevi bölmek ister misin?” diye sorar; **karar kullanıcıda**, uygulama kendi başına hiçbir hedefi değiştirmez. | R1-3 |
| D06 | Her denemede checkpoint: aynı soruda 5 kez durmak, yanlış denemek, düzeltmek kaydı durdurmaz; **bütün denemeler korunur, üzerine yazılmaz.** | U5 |
| D07 | Raporlar **tek ZIP** dosyasında; soru, tam metin, yanıtlar, anahtar olayları, ses dosyası adı / uzantısı eşlenir. | U8 |
| D08 | Ses kaydı **yalnız sunulan sesli görevlerde**; sürekli ortam kaydı yok. | U10 |
| D09 | Dış eğitim kaynaklarıyla **otomatik veri aktarımı yok**; kullanıcı isterse ders adı, yaptığı çalışma ve dış raporu ekler. | U8 |
| D10 | Hedef aksan **Amerikan İngilizcesi** (öznel tercih). | U7 |
| D11 | Ücretsiz ve tercihen açık kaynak araçlar; ücretli API zorunluluğu yok. | U5 |
| D12 | Cihazlar Android telefon + Windows bilgisayar; dış eğitim araçlarının yalnız telefonda çalışması yeterli; çoğu iş internetsiz yapılabilmeli. | U5, U7 |
| D13 | Hafta 1: ilk 4 gün yöntem / kaynak deneyimi, son 3 gün kapsamlı kayıt ve testler; sonra hedef kurulumu. İyi dış kaynak yoksa eğitim özel hazırlanır. | U4, U7 |
| D14 | Hafta 1'in test seti dört alan: **İngilizce profil, gecikmeli hatırlama, okuma ve satır takibi, kombinasyonlu çalışma (dinle + hareket / başka iş).** İçerik / araç seçimi değerlendiriciye devredildi. | R1-4, R6-3 |
| D15 | Test günleri **süre olarak** esneyebilir (4 saate kadar); spor aynı kalır. Spor için ayrı test yapılıp yapılmayacağı Claude'a bırakıldı. | R2, R3-5 |
| D16 | Günlük spor iş yükü **70–80 dk eşdeğeri**; dağılım **%50 dayanıklılık, %30 güç, %15 denge, %5 çeviklik**; yapı “kesinlikle yapılacak” ve “isteğe bırakılan” olarak ikiye ayrılır; dakika yerine **hedef birimleriyle** sunulur (D24). | R4-0, R6-2 |
| D17 | Spor hafta içi her zaman **gün içine yayılmış (dağınık) parçalar** hâlinde yapılabilir; hedefe akşama kadar ulaşmak yeterlidir (D24). | R2-5, R6-2 |
| D18 | Spor için **kaydırma / telafi kuralı yoktur**; günlük klasik rutin. | R3-6 |
| D19 | Makale havuzu: 5 tema × 5 konu × 2 makale = **50 makale**; kullanıcı kendi seçer; bağlantı + uygulama içi metin; makaleler birbiriyle çelişmemeli; başlangıçta basit, sonra teknik. | U7, U8 |
| D20 | Yabancı kaynak okunamazsa Türkçe çeviri / anlatım sunulur; çeviri, sadeleştirme ve özgün ayrı etiketlenir. | U7 |
| D21 | Gecikmeli hatırlamada unutulan bilgi / görev kaydedilir; yeni bilgi verilip izlenir; karmaşıklık 1 bilgiden 2 bilgiye çıkarılabilir; son hatırlanan ve hatırlanmayan an arasında **tahmini aralık** raporlanır. | U7, U8 |
| D22 | Hafta içi ekipman erişimi serbest; hafta sonu ağırlık yok; güvenlik tutacakları sağlam (kullanıcı beyanı). | U8, U9, R4-3 |
| D23 | Önceki aşamada kod yazılmaması istendi. R9 araştırma, kaynak seçimi ve eksik alanların özel materyalinin hazırlanmasını başlattı. Bu sürümde kayıt yazılımı geliştirilmedi. | Önceki talimat; R9 |
| D24 | **Planlama hedef-temellidir:** kullanıcı dakika cinsinden yapılandırmayı sevmez; hedef X ise **akşama kadar ulaşmak yeterlidir.** | R6-2 |
| D25 | **Dinleme hedefi:** dinleme–algılama testleri → dinlediğini anlama → en sonda **kombinasyonlu çalışma (dinle + hareket yap, duyarak aynı anda iş yap).** “Ses / ritim / nota ayrımı” kullanıcının hedefi **değildir**. | R6-3 |
| D26 | **İngilizce amacı:** network ve AI gerekmeden rahatlıkla anlayıp dinleyebilme. | R6-4 |
| D27 | **Cihazlar:** Redmi Note 13 Pro+ 5G (HyperOS 3); Windows 11 Pro (muhtemel); USB-C kablolu kulaklık. | R6-1 |
| D28 | İlk hafta 4 gün çalışma + 3 gün test. İlk dört gün iyi dış eğitim kullanılır; uygun değilse/yoksa özel içerik hazırlanır. Başlangıcın mutlaka özel uygulamayı beklediği yorumu kaldırıldı. | R7-1; açıklama R9 |
| D29 | **Hafta 1'in amacı** nerede olduğumuzu tüm alanlarda öğrenmektir (başlangıç haritası); **Hafta 2 ve sonrası derin çalışma.** Claude'un önerileri kabul edildi. | R7-1 |
| D30 | **“Akşam” sınırı:** uyku öncesi, yaklaşık **23:00**. | R7-2 |
| D31 | **Network her amaç için gerekli;** belirli bir alan yok. | R7-3 |
| D32 | **Üç aylık hedef: “böyle durmamak” (sürdürme).** Skill temelli yeterlilik onayı şimdilik verilmiyor. | R7-4 |
| D33 | **Kombinasyonlu çalışma çok geniş:** dinle + hareket, klavyede kendi fikrini yazarken biriyle konuşup konuşmayı hatasız yürütme, karmaşık kombinasyonlar, “her türlüsü”; ayrıntı Claude'a devredildi. | R7-5 |
| D34 | **Hafta 1 hiçbir haftaya benzemez:** Hafta 1'den sonra “test” diye bir kavram **muhtemelen yalnız İngilizce'de** olacak. (Hafta 1 = tüm alanlarda başlangıç haritası, D29.) | R8-1 |
| D35 | İngilizce tekrarları önceki çalışmadan 3,10,20,50 gün bekleme aralıklarıyla yapılır. Gecikme yoksa öğrenmeye göre 3.,13.,33.,83. gün. | R8-1; açıklama R9 |
| D36 | **Diğer alanların standardı:** pratik çalışma **kesintisiz** sunulur. Bazı alanlarda ilk adım **hazırlanma / okuma**, ikinci adım **test**tir; bu **tek günde** olur, **eski günün konusu atlanır**, ara sıra tekrar edilebilir. Hangi alanlar olduğu ve birimi belirtilmedi (Bölüm 4.4, 12.4, G24). | R8-2 |
| D37 | **Alan tipolojisi:** hafıza sarayı gibi şeyler **kendi başına derstir** (çalışma ilkeleri: hatırlama / ezber, rahatça akla getirebilme, rahatça sürdürülebilirlik); canlı pratik, makale ve İngilizce öğrenme dışında **hepsi mekanik (beden eğitimi mantığı)**; her şey **baştan (sıfırdan) anlatılır**, analiz ve raporlar tipe göre hazırlanır. Kullanıcı “galiba / muhtemelen” dedi: yaklaşım kabul, sınıflama itirazla düzeltilir (Bölüm 4.4, G22). | R8-3, R8-4 |
| D38 | **Sağlık kontrolü:** göz, kulak-burun-boğaz ve diş check-up'ını, yapılabilirse, yaptıracak. **Tarih kesin değil; sorulmaz.** | R8-5, R8-7 |
| D39 | **Konuşma partneri yok** (R8-6 cevabı). Hedef senaryo gerçek hayattır: “yalnız değilim, olacak durum oluyor” (örn. yapay zekâya komut yazarken biriyle konuşurken komutu hatasız sürdürmek). Gerisi Claude'a devredildi (Bölüm 10.6, G25). | R8-6 |

### 4.2. Devredilen kararlar

Kullanıcı bu kalemleri “sen karar ver / önerine göre cevapla” diyerek bıraktı. Tam liste ve geri alma koşulları **Bölüm 15**'tedir (G01–G26).

### 4.3. Gerilim envanteri ve çözümleri [Analiz]

| # | Gerilim | Çözüm |
| --- | --- | --- |
| T1 | “Hata nedenini söylesin” (ilk istek) ↔ “uygulama hüküm vermez” (son karar) | Neden yalnız dış değerlendiricinin yorum katmanında; uygulama yalnız “beklenen / verilen / zaman” (G05). |
| T2 | “Hatalı 3. denemede aç” ↔ “doğru / yanlış deme” | Kural gönderim sayısına bağlandı (D02): uygulama “hatalı” kavramını hiç taşımaz. |
| T3 | “Takvim kaydırma yok” ↔ saate bağlı hatırlama kontrolleri | Kuyruk kuralı günlük hedefler içindir; zaman kilitli kontrol kaçırılırsa **gerçek gecikmeyle** yapılır, “planlanan / gerçek” kaydedilir (G04). |
| T4 | “Uygulama puan vermez” ↔ dış kaynak (ör. EF SET) puan verir | Dış araç isteğe bağlı çapa; puan dış aracın tahminidir, kullanıcı isterse ZIP'e ekler (G07). |
| T5 | Spor süreleri: 40–50 / 60 dk ↔ blok toplamı ↔ 70–80 dk | Kullanıcı yeni iş yükünü belirledi (D16); eski sayılar geçersiz. |
| T6 | “Hepsi aynı olacak” (spor) ↔ gençte her gün aynı ağır kuvvetin önerilmemesi [K24, K33] | Yapı her gün aynı; güç hedefinin **içeriği** yüklü / hafif günlere ayrılır (G09). Karar kullanıcıda. |
| T7 | Hafta 1'de dört test alanı ↔ günlük ≈2 saat taban | Test günleri 4 saate kadar esner, gerekirse 8. güne taşar (G03). |
| T8 | Tek ZIP ↔ hem yedek hem değerlendirme | Aynı biçim, iki profil: “tam yedek” ve “değerlendirme paketi” (Bölüm 6.6). |
| T9 | Ücretsiz ↔ uzun süreli ses arşivi | Sıkıştırılmış ses ile yerel depolama yeterli (Bölüm 5.6); kullanıcı kontrollü dışa aktarım ve elle USB-C yedeği (Bölüm 6.9). |
| T10 | “Teori” ↔ “gerçekleşebilir teori” isteği | Makalelerde bulgu / kuram / sınanmamış fikir etiketi (Bölüm 12). |
| T11 | Hafıza sarayı ilgisi ↔ günlük unutkanlık (ders başı) | Saray sıralı bilgiyi hedefler; ders başı için ayrı görev (Bölüm 9). |
| T12 | “Sessiz ortam” beklentisi ↔ sessizde de hızlı konuşmada zorlanma | Yalnız gürültü değil **konuşma hızı** değişken (Bölüm 10.3). |
| T13 | **Dakika sevmeme (D24)** ↔ ölçüm protokolündeki gecikme aralıkları ve kullanıcının kendi dakika / saat beyanları (2–4 saat, 70–80 dk) | Kullanıcı beyanları **boyutlandırma göstergesi** sayılır; plan çıktı birimiyle sunulur; zaman aralıkları ölçüm protokolüdür, görev saati değildir (Bölüm 3.5). |
| T14 | **“AI gerekmeden anlamak” (D26)** ↔ raporu yorumlayacak değerlendiricinin yapay zekâ olabilmesi | Çelişki yok: değerlendirici ölçüm sonrası yorumcudur; ancak öğrenme görevlerinde AI / çeviri aracı kullanımı ayrı yardım kategorisi (A4) olarak kaydedilir ki “araçsız anlama” gözlenebilsin (Bölüm 6.2, 8). |
| T15 | **Eğitime başlama** ↔ otomatik kayıt yazılımının hazır olmaması | R9 ayrımı netleştirdi: ilk dört gün iyi dış kaynak/özel materyal; testte istenen otomatik kayıt ayrı iş. Elle yapılan olaylar açıkça beyan/elle kayıt etiketlidir. |
| T16 | **Gün sonu sınırı ≈23:00 (D30)** ↔ yatış 23–24 ve gün içi şiddetli hareket | Şiddetli hareket ve ağır güç yatıştan ≥≈1 sa önce biter; son saatte hafif hedefler (Bölüm 3.5, 11.5) [K58]. |
| T17 | **“Yeterlilik onayı yok, 3 ay durmamak” (D32)** ↔ ilerlemeyi gösterme ihtiyacı | Başarı ölçütü sürdürme; ilerleme **kayda dayalı** (İngilizce tekrar kaydı, pratik kayıtları, haftalık özet) tanımlayıcı olarak gösterilir, puansız; kontrollü yeniden harita yalnız isteğe bağlı (Bölüm 13.8–13.9, T19). |
| T18 | **Geniş kombinasyon hedefi (D33)** ↔ kanıt tavanı (çoklu görev transferi zayıf) ve çift görev maliyeti | Hedef maliyeti sıfırlamak değil, kullanıcının gerçekçi görevlerinde ne olduğunu görmek; “bu görev tipinde” dili (Bölüm 10.4). |
| T19 | **Yeniden harita** (önerim, kabul edilmişti; Hafta 5, 9, 13) ↔ **“Hafta 1'den sonra test yalnız İngilizce'de” (D34)** | Daha yeni ve daha özgül ifade önceliklidir: yeniden harita varsayılan olarak kapatıldı; ilerleme İngilizce tekrar kaydı, pratik kayıtları ve haftalık özetle izlenir; kullanıcı isterse tek bir yeniden harita yapılır (Bölüm 13.8). Bedeli: kontrollü tekrar ölçüm yok (RK24, Bölüm 7.9). |
| T20 | **“Takvim kaydırılmaz, dünkü yarım hedef önce” (D04–D05)** ↔ **“eski günün konusu atlanır” (D36)** | D04 **yarım kalan** günlük hedefler içindir; D36 hazırlık → test gününün **yerine geçtiği** konu içindir (yarım değil, yer değiştirmiş). İkisi çakışmaz. Kullanıcı D36'yı Hafta 2+ için genel “birikim yok” kuralı olarak kastettiyse D04–D05 değişir; belirtmediği için D04 geçerli (16.1b, V3). |
| T21 | **“Test yalnız İngilizce'de” (D34)** ↔ **hazırlık → test ikilisi bazı alanlarda (D36)** | İngilizce'deki test **tekrarlı ve düzenli** (3-10-20-50); ikili ise **tek günlük, tekrarsız** bir uygulama günüdür. İki mekanizma ayrı yazıldı (8.8, 12.4). |
| T22 | **3–10–20–50 gün aralıkları** ↔ H2 kısa gecikme kategorileri | İki ayrı sistemdir. R9 tekrar aralıklarını netleştirdi. İngilizce son planlı tekrar nominal 83. gün; H2 kısa gecikme pratiği ayrı. |
| T23 | **Partner yok (D39)** ↔ **C4–C6'nın gerçek partner varyantı (10.4)** | Gerçek partner varyantı isteğe bağlıya düştü; yerine **kayıtlı replikler** ve **gerçek-hayat kesintili yazma** geldi (10.6). |
| T24 | **Her şeyi sıfırdan anlat (D37)** ↔ **günlük yük ve çıktı birimi (D24)** | Anlatım **tek seferlik kısa başlangıç kartıdır**; görev sayılmaz, “yarım” olmaz, istenirse yeniden açılır (4.4.3, RK26). |

### 4.4. “Test” kavramı ve alan tipolojisi [Karar D34–D37 + Analiz]

**Neden bu bölüm var:** R8'de kullanıcı iki şeyi söyledi: (1) Hafta 1'den sonra “test” kavramı muhtemelen yalnız İngilizce'de kalacak; (2) alanlar aynı biçimde çalışmayacak, her tipin kendi çalışma ve rapor biçimi var. Önceki sürümlerde “test” her alanda tekrarlanan bir ölçüm ailesi gibi yazılmıştı (yeniden harita); bu bölüm onu düzeltir.

**4.4.1. Test nerede var, nerede yok**

| Dönem / alan | “Test” var mı? | Ne var? |
| --- | --- | --- |
| **Hafta 1 (tüm alanlar)** | **Var** (başlangıç haritası) | Gün 5–7 test günleri; kilitli test havuzu; alternatif form kuralları (7.3); test günü yükü ≤4 sa (D15) |
| **Hafta 2+ İngilizce** | **Var** (tek düzenli test alanı) | “3-10-20-50” tekrar kuralıyla madde tekrarları (8.8). Her tekrar hem öğrenme hem ölçüm olayıdır (geri çağırma pratiği) |
| **Hafta 2+ diğer alanlar** | **Yok** (varsayılan) | Kesintisiz pratik; kayıt tutulur ama kontrollü yeniden ölçüm yoktur. İsteğe bağlı tek yeniden harita yalnız kullanıcı isterse (13.8) |
| **Hazırlık → test (HT) ikilisi olan alanlar** | **Tek günlük** | 1. adım hazırlık / okuma, 2. adım test; ikisi tek günde; o gün yerine geçtiği konu atlanır, ara sıra tekrar edilebilir (D36, 12.4) |

**Yorum notu [Analiz]:** İngilizce tekrar kaydı “test” sayılsa da aynı anda öğrenme olayıdır; bu yüzden sonuçlar temiz bir sınav ölçümü değil, **tekrarlı geri çağırma kaydı** olarak okunur (7.2, 7.9).

**4.4.2. Beş alan tipi**

| Tip | Hangi alanlar | Çalışma ilkesi | Hafta 2+ test? | Rapor biçimi (değerlendiriciye gidecek) |
| --- | --- | --- | --- | --- |
| **Tip 1: İngilizce öğrenme** | Dış kaynak dersleri (USA Learns, VOA), kart / madde tekrarı, özel yazı ve ses görevleri, kayıtlı network senaryoları | Önce dış kaynak ve özel görevler; maddeler tekrar kuralına girer | **Var** (3-10-20-50) | **Madde tekrar tablosu:** madde, öğrenme günü, planlanan / gerçek tekrar günü, ilk bağımsız yanıt, yardım kategorisi (A0–A4), anahtar durumu; yanında yazı / ses örnekleri. Yorum dışarıda |
| **Tip 2: Canlı pratik** | Konuşma turları (C4–C6), network konuşmaları, gerçek-hayat kesintili yazma (10.6) | Canlı, değişken, kesintili; tek görev tabanıyla yan yana | Yok | **Oturum kaydı:** kanallar (L / S / T / M / R), dil, konuşma hızı, kesinti türü, yazılı çıktı ve ses; aynı içeriğin tek görev tabanı. Hata sayılmaz |
| **Tip 3: Makale** | 25 konu × 2 makale | Kullanıcı konuyu seçer; bazı günler HT günüdür | Yok (HT günü hariç, tek günlük) | **Okuma kaydı:** hangi makale, hazırlık / test günü, kendi sözleriyle anlatım, “anlamadım” işaretleri; makale kartı etiketleri (bulgu / kuram / fikir) |
| **Tip 4: Ders** | Hafıza sarayı ve benzeri teknikler, ders başı özet stratejisi (H5) | **Kendi başına ders.** İlkeler: hatırlama / ezber, bilgiyi rahatça akla getirebilme, **rahatça sürdürülebilirlik** (zorlaştıkça artırılmaz, sadeleştirilir) | Yok | **Ders ve pratik kaydı:** hangi ders / teknik, kullanıldı mı, kullanıcının kendi sözleriyle ilke anlatımı, geri çağırma pratiği (hüküm yok) |
| **Tip 5: Mekanik (beden eğitimi mantığı)** | Spor; göz ve satır takibi; dinleme algı / anlama antrenmanı (B1–B2); kanal tabanları ve basit kombinasyonlar (C0–C3); hafıza ve çoklu görev tabanları | Antrenman gibi: tekrar, kademeli yük, çıktı birimi; hız ve zorluk kullanıcı bayrağıyla ilerler | Yok | **Antrenman günlüğü:** yapılan küme / set / km sayısı, hız ve zorluk düzeyi, zorlanma, yapıldı / yapılmadı; gün gün değişkenlik. Yorum ve karşılaştırma dışarıda |

**Sınıflama notu [Analiz]:** Kullanıcı “galiba” ve “muhtemelen” dedi. Yukarıdaki eşleme (özellikle C0–C3'ün Tip 5, C4–C6'nın Tip 2 sayılması ve dinleme antrenmanının Tip 5 sayılması) Claude'un uygulamasıdır; yanlışsa tip değişir, kurallar değişmez (G22, V4).

**4.4.3. “Baştan anlatım” kuralı (D37)**
- Her alan, kullanıcıya **ilk kez geldiğinde sıfırdan** anlatılır: ne olduğu, neden yapıldığı, nasıl yapıldığı, neyin kaydedildiği, neyin **kaydedilmediği** (hüküm yok). Sade Türkçe; ön bilgi varsayılmaz.
- Anlatım **tek seferlik kısa bir başlangıç kartıdır**; hedef birimi değildir, “yarım” sayılmaz, kullanıcı istediğinde yeniden açabilir.
- Hafta 1'de her alanın kartı, alanın ilk görev gününde sunulur (13.2). Yeni bir alan veya seviye (örn. yeni C seviyesi) ilk kez gelirse kısa kart yenilenir.
- **Analiz ve rapor tipe göre:** dış değerlendirici 4.4.2'deki rapor biçimini kullanır; tipleri tek ölçekte birleştirmez (örn. antrenman hacmi ile madde tekrar kaydı aynı tabloda toplanmaz).

---

## 5. Platform ve cihaz analizi (Redmi / HyperOS 3 / Windows)

Bu bölüm **geliştirme kararı değil, ön fizibilite analizidir.** Amaç, kullanıcının gerçek cihazında hangi gereksinimlerin risk taşıdığını önceden görmektir.

### 5.1. Cihaz gerçekleri

| Konu | Bulgu | Etiket |
| --- | --- | --- |
| Model | **Redmi Note 13 Pro+ 5G** (kullanıcı “Redmi 13 Pro+” demişti, sorulunca “Evet” dedi) | [Karar / onaylandı] |
| İşletim sistemi | HyperOS 3, Android 16 tabanlı. Redmi Note 13 Pro+ 5G, Xiaomi'nin 3. dalga HyperOS 3 listesinde (Aralık 2025 – Mart 2026); kullanıcı zaten HyperOS 3 kullandığını söylüyor. | [Kanıt K40] |
| Donanım | MediaTek Dimensity 7200 Ultra; 8 / 12 GB RAM; 256 / 512 GB UFS 3.1 depolama; **bellek kartı yok**; 5000 mAh. | [Kanıt K41] |
| Kulaklık girişi | Perakende özelliklerine göre **3,5 mm jak yok**; kullanıcı **USB-C kablolu** kulaklık kullanıyor. | [Kanıt K41, Beyan] |
| Mikrofon | Telefon mikrofonu özellikleri doğrulanamadı; USB-C kulaklığın mikrofonu olup olmadığı bilinmiyor. | [Açık] |
| Bilgisayar | Windows 11 Pro (muhtemel); tarayıcı bilinmiyor. | [Beyan] |

### 5.2. HyperOS arka plan davranışı [Kanıt K42, kısmen ikincil]

Rehber niteliğindeki kaynaklar (çoğu üçüncü taraf, resmî değil) HyperOS'ta uygulamaların arka planda uyutulabildiğini, bildirimlerin ve alarmların gecikebildiğini veya bastırılabildiğini belirtiyor. Önerilen ayarlar tutarlı:

1. Uygulama (veya tarayıcı) için **Pil tasarrufu → “Kısıtlama yok”**.
2. **Otomatik başlatma** açık.
3. Son uygulamalar ekranında uygulamayı **kilitle**.
4. “Kullanılmayan uygulamaların etkinliğini duraklat” özelliğini kapat (HyperOS 3 rehberinde adım olarak geçiyor).
5. Saat (Clock) uygulamasına da “Kısıtlama yok”; gece boyunca agresif pil tasarrufu alarmları geciktirebilir.

**Sınır:** Bir geliştirici forumunda, otomatik başlatma ve kısıtlama kaldırıldığı hâlde uygulamasının yine öldürüldüğünü bildiren bir kullanıcı var; çözüm gösterilmemiş. Yani ayarlar **gerekli ama garanti değil**. Resmî / güncel adımlar için dontkillmyapp.com'a bakılmalıdır (bu turda erişilemedi).

### 5.3. Web uygulaması (PWA) sınırları [Kanıt + Analiz]

| Konu | Bilinen | Sonuç |
| --- | --- | --- |
| **Zamanlanmış yerel bildirim** | Chrome'un Notification Triggers API'si deneme (origin trial) aşamasını bitirmiş, yayına alınma (launch) başlamamış durumda [K43]. Ağ ve pil tasarrufu push'u geciktirebilir. | Gecikmeli hatırlama için **uygulama bildirimine güvenilmemeli.** Birincil mekanizma **telefonun Saat uygulaması alarmı** (G04). |
| **Ekran kilitliyken / arka planda ses** | Mobil tarayıcıların ekran kapanınca veya tarayıcı arka plana alınınca sekmeyi dondurabildiği bildiriliyor; kaynak oynatma üzerine, **kayıt için dolaylı kanıt** [K44]. Pil “Kısıtlama yok” önerisi geçiyor. | Sesli kayıt **ön planda, ekran açıkken** yapılmalı. |
| **Ekranı açık tutma** | Screen Wake Lock API ekranı açık tutar; ekran kilidi / CPU uykusunu garanti etmez; sekme gizlenince bırakılır, yeniden istenmelidir. Chrome belgeleri Chrome 84'ten beri destek diyor; caniuse'un Android sütunu arama özetinde farklı sürüm gösterdi [K47]. | Geliştirme öncesi gerçek cihazda doğrulanmalı. |
| **Kalıcı depolama** | IndexedDB / localStorage verisi düşük depolamada silinebilir; `navigator.storage.persist()` ile kalıcılık istenebilir, kullanıcı izni gerekebilir; Chrome ekibine göre otomatik silme nadir, kullanıcı tarafından elle silme daha olası [K46]. Kurulu PWA'nın otomatik kalıcılık kazanıp kazanmadığı doğrulanamadı. | Veri **tek yerde tutulmamalı**; düzenli dışa aktarım (ZIP) yedeği şart. |
| **ZIP üretimi** | JSZip `generateAsync` sonucu belleğe alır; büyük arşivlerde tarayıcı kararsızlaşır, akış (stream) çözümleri var; Android'in belleği masaüstünden düşük [K48]. | Günlük paketler küçük tutulursa sorun yok; çok aylık tam yedek için akışlı çözüm gerekebilir. |

### 5.4. Ses kaydı ve kulaklık [Kanıt K45 + Analiz]

- Kullanıcı **USB-C kablolu kulaklık** kullanıyor. Bluetooth kulaklıkta mikrofon kullanımı (HFP / SCO) mono ve düşük çözünürlüklü konuşma sesi verir [K45]; kablolu kullanım bu riski ortadan kaldırır. **Bluetooth kayıt için kullanılmaz.**
- Cihazda jak olmadığı için kayıt seçenekleri: telefonun kendi mikrofonu veya USB-C kulaklığın mikrofonu (varsa). Kulaklığın mikrofonu olup olmadığı ve tarayıcının doğru girişi seçip seçmediği **Gün 0'da test edilir** (Bölüm 5.9, test 9–10).
- **Aynı değerlendirme boyunca aynı kayıt kurulumu** kullanılır (karıştırıcı azaltma, Bölüm 7); kurulum her kayıtta kullanıcı beyanı olarak manifestte tutulur.
- Dinleme görevlerinde aynı kulaklık ve ses seviyesi korunur; ses seviyesi kullanıcı ayarlıdır ve beyan edilir.
- Kısa kayıtlar (görev başına ≤2–3 dk) ve parça parça kalıcı yazma (MediaRecorder `timeslice`, K19) kesintide veri kaybını sınırlar.
- Kayıt sırasında gelen arama, bildirim, uygulama değiştirme **olay** olarak kaydedilir (`recording_interrupted`); kayıt sessizce kesilmiş sayılmaz.

### 5.5. Transkripsiyon [Kanıt K49 + K11, Analiz]

- Transkript **özgün sesin yerini tutmaz** ve telaffuz değerlendirmesi değildir; yalnızca ek bir kayıttır.
- Cihaz üstü whisper.cpp için Dimensity sınıfı telefonlarda kesin hız ölçümü bulunamadı; tek anekdot “base” modelini denge noktası olarak gösteriyor, “small” yavaş. Bellek yaklaşık 273 MB (tiny) / 388 MB (base). **Kendi cihazında ölçülmeden hız vaat edilmemeli.**
- Alternatif: sesler ZIP ile Windows'a taşınıp faster-whisper ile yerel çevrilir (K11). Telefonun temel işlevleri **Windows bilgisayarın açık olmasına bağlanmamalı.**
- Whisper veya başka bir araç zorunlu değil (D11); transkript **olmadan** da paket geçerlidir.

### 5.6. Depolama ve ses boyutu hesabı [Analiz, yaklaşık]

| Senaryo | Boyut | Günlük 20 dk ses | Yıllık |
| --- | --- | --- | --- |
| Opus ~32 kbps | ≈0,24 MB/dk | ≈4,8 MB | ≈1,8 GB |
| Opus ~128 kbps | ≈0,96 MB/dk | ≈19 MB | ≈7 GB |
| Sıkıştırılmamış WAV 16 kHz mono 16-bit | ≈1,9 MB/dk | ≈38 MB | ≈14 GB |

Cihazda 256 / 512 GB var ve genişleme yok [K41]. Sıkıştırılmış ses ile **depolama ana kısıt değil**; asıl risk, tarayıcı deposunun silinmesidir. (Tarayıcının varsayılan codec / bitrate değeri doğrulanmadı; tablo aralık verir.)

### 5.7. Windows tarafı

Windows 11 Pro (muhtemel) üzerinde tarayıcıdan kurulabilir web uygulaması olarak çalışabilir; masaüstünde dosya sistemi erişimiyle büyük ZIP akışı ve yerel transkripsiyon daha kolaydır [K48]. Windows 11'in yerleşik sıkıştırma aracı parola / şifreleme desteklemez; şifreli kopya için ücretsiz ve açık kaynak 7-Zip (AES-256) kullanılabilir [K57]. Telefon verisi Windows'a USB-C ile aktarılır; bu **kullanıcının kendi iki cihazı arasındaki bilinçli bir eylemdir** ve D09'daki “dış eğitim araçlarıyla otomatik aktarım yok” kuralıyla karıştırılmamalıdır (Bölüm 6.9).

### 5.8. Platform seçenekleri (karar matrisi) [Analiz]

| Ölçüt | A. Kurulabilir web uygulaması (PWA) | B. PWA + Android sarmalayıcı (ör. Capacitor) | C. Yerel Android uygulaması | D. Windows masaüstü programı |
| --- | --- | --- | --- | --- |
| İlk sürüme hız | Yüksek | Orta | Düşük | Orta |
| Android + Windows tek kod | Evet | Büyük oranda | Hayır | Hayır |
| Arka planda kayıt güvenilirliği | **Düşük** (ön plan şart) | Orta–yüksek (ön plan hizmeti eklenebilir) | Yüksek | Yüksek |
| Zamanlanmış hatırlatma | **Düşük** (Saat alarmına yedek) | Yüksek (yerel alarm) | Yüksek | Orta |
| Çevrimdışı kullanım | İyi (önbellek + IndexedDB) | İyi | İyi | İyi |
| Veri kalıcılığı | Tarayıcıya bağlı (silinebilir) | Daha iyi (uygulama deposu) | İyi | İyi |
| Bakım yükü | Düşük | Orta | Yüksek | Orta |
| Maliyet | Ücretsiz | Ücretsiz (APK ile) | Ücretsiz (APK ile) | Ücretsiz |

**Ön yargısız öneri:** İlk aşamada **A** (en hızlı ve ucuz) ile başlayıp **Bölüm 5.9'daki Gün 0 doğrulama testlerinin sonucuna göre** karar vermek. Ses kesintisi veya alarm sapması eşiği aşarsa **B**'ye geçmek. **C**, yalnızca arka plan kaydı vazgeçilmez olursa. Bu yalnızca öneridir; teknoloji seçimi kullanıcıya veya geliştirme aşamasına aittir (G12).

### 5.9. Gün 0 doğrulama protokolü (geliştirme başladığında cihazda yapılacak)

Aşağıdaki testler **kodlama sonrası ilk iş** olarak Redmi cihazda yapılır; sonuçlar platform kararını belirler.

| # | Test | Başarı ölçütü (öneri) |
| --- | --- | --- |
| 1 | 5 dk kayıt, ekran açık | Kayıtta boşluk yok, dosya çalınıyor |
| 2 | 5 dk kayıt, ekran 60 sn kilitlenir | Kayıt kesintisiz veya kesinti **olay olarak kayıtlı** |
| 3 | Kayıt sırasında bildirim / arama | Kesinti kayda geçer, veri kaybı yok |
| 4 | Pil “Kısıtlama yok” açık / kapalı karşılaştırma | Fark kaydedilir |
| 5 | Telefon Saat alarmı ile “kısa / birkaç saat” gecikme kontrolü, 5 tekrar | Gerçek gecikme kayıtlı; sapma kabul edilebilir (≈1 dk) |
| 6 | `storage.persist()` sonucu ve cihaz yeniden başlatma sonrası veri | Veri duruyor |
| 7 | Uygulama kapatılıp açılınca “kaldığı yerden devam” | Son soru, son deneme geri geliyor |
| 8 | 50 MB ses içeren ZIP dışa aktarımı ve **USB-C ile Windows'a kopyalama** | Dosya açılıyor, manifest ve özet dosyası tutarlı |
| 9 | Telefon mikrofonu / USB-C kulaklık mikrofonu aynı cümle | Hangi girişin seçildiği ve kalite farkı kayda geçer |
| 10 | USB-C kulaklık takılıyken tarayıcının mikrofon girişi | Doğru giriş seçilebiliyor |
| 11 | Uçak modunda dersin, sorunun, kaydın çalışması | Çevrimdışı çalışıyor |
| 12 | Windows 11'de aynı uygulama: kayıt, ZIP içe / dışa aktarım | Çalışıyor |

### 5.10. Önceki prototip

Önceki asistan “Odak Atölyesi” adlı bir prototipi gereksinimler netleşmeden hazırlamış, kullanıcı itiraz etmişti. Prototip: onaylı tasarım değildir; puan / hüküm yasağıyla uyumu doğrulanmadı; bu raporda yeniden incelenmedi; kod incelemesi görevi verilmedikçe çalıştığı iddia edilmemeli.

### 5.11. Kaynak seçimi, özel içerik ve kayıt uygulaması [Analiz]

R9 ile ilk dört gün için iyi dış eğitimleri tercih etme, uygun değilse özel materyal hazırlama ve araştırarak işe başlama talimatı verildi. Bu kapsamda kaynak araştırması ve ilk hafta içerik paketi hazırlandı.

**Seçilen eğitim:** USA Learns ana İngilizce kaynağı; VOA destek/yedek. Hafıza sarayında Stanford rehberi. Türkçe pratikler, İngilizce yedek dersler ve test içeriği özel hazırlanır. Bir kaynağın kayıt raporu sınırlıysa, iyi eğitimini bırakmak gerekmez; eğitim ile kayıt aracı ayrı tutulur.

**Hazırlanan içerik:** Gün 1–4 çıktı kartları; dört İngilizce yedek dersi; ilk makale çifti; kolay spor başlangıç kartı; Gün 5–7 yazılı soruları, anahtarları ve seslendirme metinleri; Türkçe ve İngilizce nöral sentetik sesler (otomatik tanıma ile geri okundu, insan dinleme kontrolü yok); boş kayıt şablonları ve formüllü İngilizce tekrar takvimi (xlsx).

**Hedeflenen kayıt yazılımının gereksinimleri devam ediyor:**
1. Günlük hedef ve tamamlama; yanıt/bilmiyorum; isteğe bağlı anlamadım işareti.
2. Bütün denemeleri koruyan checkpoint; elle ve üçüncü gönderimde otomatik anahtar açma.
3. Yalnız belirli görevlerde ses kaydı; giriş beyanı; kesinti olayları.
4. Planlanan/gerçekleşen gecikme ve ardışık İngilizce tekrar kaydı.
5. Spor, okuma, uyku ve yorgunluk bağlam notları; hüküm yok.
6. Manifest, özgün ses ve eksikler listesiyle tek ZIP; çevrimdışı temel kullanım.
7. Gün 0'da Android/Windows kayıt, kapat-aç, dışa aktarma ve geri yükleme doğrulaması.

Bu teslim yukarıdaki işlevleri otomatik gerçekleştiren uygulama değildir. Kullanıcı cihazındaki doğrulama ve seslerin insan dinleme kontrolü de eksik. Testlerin tüm akışı hazır ilan edilmez; elle yürütülen parçalar 13.6'ya göre etiketlenir. Yazılımın dördüncü güne yetişeceğine ilişkin süre sözü verilmez.

Transkripsiyon isteğe bağlıdır; özgün sesin yerini tutmaz. Tam yedek hedefleniyorsa geri yüklemenin doğrulanması da ürün kabulüne dahil edilmelidir; yalnız ZIP'i açmak tam geri yükleme testi değildir.

---

## 6. Veri modeli ve ZIP şartnamesi (kavramsal, kod değil)

### 6.1. İlkeler

1. **Yalnız ekleme (append-only).** Hiçbir deneme, olay veya ses üzerine yazılmaz; düzeltme yeni kayıttır ve öncekine işaret eder.
2. Her kayda **kimlik, sıra numarası, UTC zamanı ve saat dilimi** eklenir. Cihaz saati değişirse “gerçek gecikme” hesabının bozulmaması için monoton süreyle birlikte tutulur.
3. Ses dosyalarının **özgün adı, uzantısı, boyutu ve SHA-256 özeti** saklanır.
4. Eksik / üretilememiş parça **gizlenmez**, `EKSIKLER.md`'de nedeniyle yazılır.
5. Uygulama kayıtlara **hüküm, puan, neden yorumu** yazmaz.

### 6.2. Soru, deneme ve yardım kategorileri

| Varlık | Başlıca alanlar |
| --- | --- |
| **Soru** | soru_id, gün, görev_id, tür (kısa kesin / serbest / okuma-çeviri / sesli / hatırlama), yönerge metni, soru metni, **ilgili metnin tamamı**, beklenen yanıt (anahtar), kabul edilen karşılıklar (varsa), dil, kaynak (özel / dış), içerik sürümü |
| **Deneme** | deneme_id, soru_id, **gönderim_no**, zaman, kip (yazı / ses), son metin, taslak anlık görüntüleri (ayrı), ses_ref, süre, ilk girdiye kadar süre, anahtar durumu (kapalı / elle açık / otomatik açık), **yardım kategorisi**, bildirilen yardım (ipucu, sözlük, çeviri aracı, dış kaynak), cihaz, kulaklık / mikrofon türü, ortam (sessiz / gürültülü, beyan), ses seviyesi (beyan) |

**Yardım kategorisi (Claude önerisi):**

| Kod | Anlamı |
| --- | --- |
| A0 | İlk bağımsız deneme (anahtar kapalı, yardım yok) |
| A1 | İpucu veya araç yardımıyla |
| A2 | Anahtar açıldıktan sonra |
| A3 | Dış kaynaktan (kitap, sözlük, video) yararlandığını beyan ettiği |
| A4 | AI veya çeviri aracı kullandığını beyan ettiği (D26: AI'sız anlama hedefi) |

Böylece bağımsız ve yardımlı yanıtlar ayrılır. Uygulama notu: yardım kategorileri çakışabilir; örneğin sözlük ve anahtar-sonrası birlikte kaydedilir. Ham yardım alanları tek seçime zorlanmaz. Bağımsız yanıt, her tekrar oturumundaki ilk yardımsız yanıt anlamındadır.

### 6.3. Gönderim ve taslak [Analiz]

D02 “3. gönderimde otomatik aç” kuralının uygulanabilmesi için **gönderim** tanımı gerekir. Öneri: kullanıcı açıkça “gönder / bitir”e bastığı yanıt bir gönderimdir; taslak ve otomatik kayıt gönderim **sayılmaz**; düzeltme için yeniden gönderilen yanıt yeni gönderimdir. Bu tanım kullanıcıya görünür biçimde yazılmalıdır (“Bu 2. gönderim”). Kullanıcının farklı bir sayım isteyip istemediği sorulmadı; ince bir ayrıntı olduğu için varsayılan olarak bu tanım kullanılır ve **ZIP'te sayım ayrıntısı yazılır**, böylece değiştirilirse yeniden hesaplanabilir.

### 6.4. Anahtar olayları ve günlük bağlam notları

**Anahtar olayı:** açıldı (elle / otomatik, hangi gönderimde), ekranda kalma süresi (sekme odağı dikkate alınarak), kullanıcının isteğe bağlı **“okudum / anlamadım”** işareti, anahtardan sonraki ilk deneme. Ekranda görünmek, okunduğu veya anlaşıldığı anlamına gelmez; bu üç alan ayrıdır (G06).

**Günlük bağlam notları (isteğe bağlı, ≈30 sn):** yatış / kalkış saati, şekerleme süresi, gece uyanma sayısı, yorgunluk (0–10), ağrı / sakatlık notu, ruh hali (isteğe bağlı kısa not). Bunlar sonuçların **bağlamıdır**, yorum değildir (G13).

### 6.5. Gecikmeli hatırlama, kombinasyonlu çalışma, spor ve okuma kayıtları

| Kayıt | Alanlar |
| --- | --- |
| **Hafıza tohumu** | tohum_id, içerik (1 veya 2 bilgi), dil (TR / EN), **konuşma hızı (kelime/dk)**, sunum kipi (ses / metin), dinleme sayısı, sunulma zamanı |
| **Kontrol** | planlanan gecikme **kategorisi** (çok kısa / kısa / birkaç saat / ertesi gün / bir hafta), **gerçek gecikme**, yanıt, ipucu kullanıldı mı, **“neyi hatırlayacağını çıkaramadı” işareti**, son hatırlandığı kontrol, ilk hatırlanmadığı kontrol → **aralık** raporu (“10–25 dk arası”) |
| **Dinleme merdiveni** | basamak (B1 algılama / B2 anlama), içerik_id, dil, **konuşma hızı**, tekrar dinleme sayısı, metnin görünür olup olmadığı, kulaklık / ses seviyesi beyanı, yanıt (yazı / ses) |
| **Kombinasyonlu çalışma (C0–C6)** | seviye (C0–C6) ve kanallar (L dinle, S konuş, T yaz, M hareket, R hatırla); her kanal için tek görev taban kaydı ve birlikte kayıt; hareket türü (yerinde / yürüme / sözlü komutlarla hareket) ve alanın güvenli olduğu beyanı; kaynak türü (kayıtlı replik / gerçek-hayat kesintisi) ve varsa izin (gerçek kişinin sesi kaydedilmez, D39, 10.6); yazılı çıktı (not, mesaj taslağı); sıra ve içerik hatırlama yanıtı; konuşma hızı, dil; yardım kategorisi (A0–A4). Yorum yok. |
| **Spor** | gün, hedef kartı (kategori, hedef birimi), çekirdek / eklenti, **yapıldı / yapılmadı**, gerçekleşen miktar (km, set, tur…), zorlanma (0–10), **gerçekleşen süre (otomatik gözlem; hedef değil)**, yük (plaka toplamı, bar hariç; dambıl türü), notlar |
| **Okuma / satır takibi** | metin_id, ortam (kitap / ekran), koşul (kılavuzsuz / parmak / cetvel), sıra, **kullanıcı sayımı** (satır kaybı, geri dönme), kendi sözleriyle anlatım (ses / yazı) |
| **İngilizce madde tekrarı (3-10-20-50)** | madde_id, içerik, dil, **öğrenme günü**, planlanan adım (3 / 10 / 20 / 50), **planlanan gün**, **gerçek gün**, yanıt, anahtar durumu, yardım kategorisi (A0–A4), “vadesi geçti” işareti. Planlanan ve gerçek aralık birlikte yazılır; R9 ile doğrulanan ardışık gün aralıkları ZIP'te belirtilir (8.8) |
| **Gerçek-hayat kesintili yazma** | görev_id, yazılan metin, **kesinti olayları** (başlangıç / bitiş zamanı, kesintinin dili: Türkçe / İngilizce / diğer, türü: soru / anlatma / sohbet; kullanıcı beyanı), yazının kesintisiz sürüp sürmediği (kullanıcı beyanı), taslak anlık görüntüleri (yazı uygulama içinde yazılıyorsa). **Ortam kaydı yok, başkasının sesi yok** (D08, 10.6) |
| **Hazırlık → test günü (HT)** | HT_id, alan (makale / ders), hazırlık adımı (yanıtlar, anlatım), test adımı (yanıtlar, anahtar durumu), **yerine geçilen konu** (“atlandı” olarak), ara sıra tekrar işareti (12.4) |

### 6.6. ZIP yapısı ve iki profil

```
paket_YYYYMMDD_HHMM/
  OKUMA_KILAVUZU.md      Paketin ne olduğu; uygulamanın hüküm / puan vermediği; alanların anlamı; sınırlar
  manifest.json          Tüm kayıtların dizini: gün, görev, soru, deneme, ses, olay ilişkileri
  checksums.sha256       Tüm dosyaların özetleri
  sorular/               Tam soru metni, yönerge, ilgili metnin tamamı, anahtar ve kabul edilen karşılıklar
  denemeler/             Her denemenin yanıtı, taslakları, zamanları, anahtar durumu
  ses/                   Özgün ses dosyaları (özgün ad ve uzantı)
  transkript/            Varsa; hangi sesten, hangi araç ve sürümle
  olaylar.csv            Anahtar olayları, ara verme, gecikme, unutma, uygulama kapanması, mikrofon kesintisi
  gunluk_notlar.csv      Uyku / yorgunluk / spor / okuma kayıtları
  EKSIKLER.md            Üretilememiş veya eksik parçalar ve nedenleri
  yorum/                 YALNIZCA dış değerlendirici yazar; uygulama bu klasöre hiçbir şey yazmaz
```

**İki profil (aynı biçim):** **Tam yedek** (her şey, geri yükleme amaçlı) ve **değerlendirme paketi** (seçilen tarih aralığı, ses dahil / hariç seçimi, G08). Geri yüklemenin ayrıntısı henüz tanımlı değil [Açık]; aynı biçimin ileride içe aktarım için kullanılabilmesi tasarım hedefi olarak korunur.

### 6.7. Bütünlük ve eksiklik

- Çevrimiçi eşitleme veya ek yedek hizmeti seçilmedi. “Veri hiçbir koşulda kaybolmaz” **mühendislik garantisi olarak verilmez**; hedef: yerel kayıt + düzenli dışa aktarılan ZIP + kullanıcının seçtiği ikinci ve üçüncü kopya (Bölüm 6.9).
- Dışa aktarma eylemi hatırlatılır; son dışa aktarım tarihi uygulamada görünür.
- Uygulama kapanması, mikrofon izninin düşmesi, depolama dolması **olay** olarak kaydedilir.

### 6.8. Gizlilik ve paylaşım

- Paket **ham ses ve sağlıkla ilgili kişisel beyan** içerebilir. Bir yapay zekâ hizmetine yüklemeden önce o hizmetin veri saklama / kullanma ayarlarına bakılması önerilir.
- Kullanıcı 18 yaşından küçük; aile ile paylaşım tercihi **kullanıcıya aittir**, bu rapor karar vermez.
- Varsayılan: pakette ad-soyad yok; kullanıcı kimliği takma ad. Her paket oluşturulurken **ses dahil / hariç** seçimi sorulur (G08).
- Şifreli kopya için bkz. Bölüm 6.9 (3. katman).

### 6.9. Yedekleme ve aktarım önerisi [Devredildi G15]

Kullanıcı “yedek ve aktarma önerin olsun” dedi. Kullanıcının donanımı: **Redmi Note 13 Pro+ 5G (USB-C), Windows 11 Pro (muhtemel), USB-C kablolu kulaklık.** Tercihleri: ücretsiz, tercihen açık kaynak, dakika yerine hedef (D24).

**Temel ilke:** 3-2-1 mantığı: üç kopya, iki farklı ortam, biri başka yerde [K56; ikincil kaynaklar, CISA onayı doğrulanamadı]. Telefondaki kopya tek başına yedek sayılmaz.

| Katman | Ne | Ne zaman (hedef olarak) | Araç | Not |
| --- | --- | --- | --- | --- |
| **1. Cihaz içi (otomatik)** | Her deneme anında yerel depoya yazılır (checkpoint, D06) | Sürekli | Uygulama | Tek başına yedek değil; tarayıcı deposu silinebilir [K46] |
| **2. Haftalık elle aktarım (birincil)** | “Tam yedek” ZIP dışa aktarılır → telefon İndirilenler → **USB-C kabloyla Windows'a** (telefonda USB modu “Dosya aktarımı”) → `Belgeler\Ogrenme_Yedek\<yıl>\` | **Hafta bitmeden bir kez**; ayrıca **her test gününden sonra** (Hafta 1: Gün 5–7 sonrası) | Dosya yöneticisi, PowerShell `Get-FileHash` ile `checksums.sha256` doğrulama | Kullanıcı kontrolünde, çevrimdışı, ücretsiz. En kötü durumda kayıp penceresi ≈ son dışa aktarımdan beri geçen süre (haftalık ise ≤ 1 hafta) |
| **3. İkinci ortam / farklı yer** | PC'deki yedeğin kopyası harici USB belleğe veya harici diske; dışarı çıkan (bulut / başkasının cihazı) kopya **şifrelenir** | **Ayda bir** (hedef) | 7-Zip: **7z biçimi, AES-256, “dosya adlarını şifrele”**; zip biçiminde dosya adları görünür kalır [K57] | Parola kaybedilirse veri kaybedilir; parolayı güvenli bir yerde ayrıca sakla. Windows 11'in yerleşik zip'i parola desteklemez |
| **İsteğe bağlı: otomatik eşitleme** | Telefon “yedek” klasörü → PC (bulutsuz) | — | **Syncthing** (açık kaynak): telefon klasörü *Send Only*, PC *Receive Only*, sürümlemeyi PC tarafında aç [K55] | *Send Only* klasör diğer cihazlardaki değişikliği uygulamaz; sürümleme yalnız diğer cihazdan gelen değişiklikleri kapsar, yani **PC tarafında** açılmalı. Android / Windows istemcileri bu turda doğrulanmadı. HyperOS arka planda uygulamayı durdurabilir (Bölüm 5.2), bu yüzden **birincil yöntem değil**, ek güvence |

**Geri yükleme testi:** Ayda bir PC'deki bir paketi açıp `manifest.json` ve özet dosyasını doğrula. “Yedek ancak geri yüklenebildiği kadar yedektir.”

**Ek öneriler [Analiz]:**
- Windows 11 Pro'da BitLocker ile yedek sürücüsünü şifrele (sürüm özelliği doğrulanmadı; kullanıcı “Pro olması lazım” dedi).
- Telefonda ekran kilidi; yedek PC'de oturum parolası.
- Ses dahil paketleri yalnız şifreli kopyayla buluta koy; bulut hesabı kullanıp kullanmayacağı kullanıcıya aittir.
- Hafta 1'de (uygulamasız köprü, Bölüm 13.6) aynı akış klasör / ZIP olarak elle uygulanır.

---

## 7. Ölçüm tasarımı ve yorum sınırları

Bu bölüm, kullanıcının “gerçekçi, güvenilir ölçüm” isteğinin çekirdeğidir. Uygulama hüküm vermediği için ölçümün değeri tamamen **kaydın kalitesine ve yorumun sınırlarına** bağlıdır.

### 7.1. Çıkarım zinciri

| Katman | Kim | Ne üretir | Yasak |
| --- | --- | --- | --- |
| 1. Ham olay kaydı | Uygulama | Zaman damgalı denemeler, ses, anahtar olayları, ara verme, gecikme | Yorum, hüküm |
| 2. Derleme raporu | Uygulama | Sayma, süre, “beklenen / verilen” yan yana, aralık | “Yanlış”, “başarısız”, puan, yüzde, neden |
| 3. Yorum | Dış değerlendirici | Beceri bazında yaklaşık profil, belirsizlikler, öneri; kendi adı / sürümü / tarihi ile | Tanı; tek ölçümden kesin sonuç |

### 7.2. Yapı geçerliliği tablosu [Analiz]

“Ölçülen şey” kaba bir yaklaşımdır; sütun sütun karıştırıcılar ve önlemler verilmiştir.

| Alan | Kayıt | Ölçtüğü şey (yaklaşık) | Başlıca karıştırıcılar | Önlem | Rapor dili |
| --- | --- | --- | --- | --- | --- |
| İngilizce serbest yazı | Metin, süre, düzeltmeler | Üretim: sözcük, cümle kurma | Konuya aşinalık, yazma hızı, çeviri aracı / AI | Yeni komut, araç kullanımı beyanı (A1/A3/A4) | “Şu kadar sözcükle şu yapılar kullanıldı” |
| Sesli okuma / anlatma | Özgün ses | Akıcılık, anlaşılabilirlik (dış değerlendirici) | Mikrofon, ortam, utangaçlık | Aynı kurulum, mikrofon beyanı | Uygulamada anlaşılabilirlik iddiası yok |
| Okuma anlama | Yanıt + kendi sözleriyle anlatım | Okuduğunu anlama | Konu bilgisi, dikkat kayması | Alternatif metin; Türkçe eşdeğer | “Anlatımda şu noktalar yer aldı” |
| **Dinleme – algılama (B1)** | Yakaladığı sözcük / sayı / ifade, hız, tekrar sayısı | Duyulanı yakalama (sesbilgisel kodlama) | İşitme durumu, konuşma hızı, kulaklık / ses seviyesi, dikkat | **Hız kaydı, Türkçe kontrol, ortam / cihaz beyanı** | “Bu hızda şu yanıt”; İngilizce düzeyi çıkarılmaz |
| **Dinleme – anlama (B2)** | Kendi sözleriyle ana fikir / ayrıntı | İşitme + işlemleme + dikkat + dil birleşimi | Aşinalık, dil bilgisi, konuşma hızı | Hız kaydı, Türkçe kontrol, A4 bayrağı | “Anlatımda şu noktalar yer aldı” |
| **Kombinasyonlu çalışma (C0–C6)** | Tek kanal tabanları (L, S, T, M) ve birlikte kayıt | Çift görev altında dinleme / yönerge uygulama, **bu görev tipinde** | Hareketin türü ve zorluğu, uyku, yorgunluk | Önce tek görev tabanları; hareket aşamalı (yerinde → yürüme); güvenli alan | “Birlikte yapıldığında yanıt şöyle değişti” (yorum dışarıda) |
| Çeviri | Yanıt | Anlam aktarımı | Sözlük / AI kullanımı | Yardım beyanı (A1/A4) | Beklenen / verilen |
| Kelime (az) | Kısa yanıt | Ayrı sözcük bilgisi | Tahmin | Az sayıda; dış çapa isteğe bağlı | Yalnız kayıt |
| Gecikmeli hatırlama | Aralıklı kontrol | Belirli gecikmede geri çağırma | İpucu, yeniden gösterme, dikkat, uyku | İpucu / yardım kategorisi, bağlam notu | “10–25 dk arası kontrolde değişti” |
| **İngilizce madde tekrarı (3-10-20-50)** | Madde bazlı tekrar yanıtları | Aralıklı geri çağırma (öğrenme olayı ile ölçüm iç içe) | Tekrarın kendisi öğrenmedir (test etkisi), dış maruz kalma (video, kitap), tahmin, anahtar sonrası yanıt, **kaçırılan tekrar** | A0–A4 ayrı, **planlanan / gerçek gün** birlikte, ilk bağımsız yanıt ayrı sütun | “Bu madde öğrenmeden 3 ve 13 gün sonra bağımsız yanıtlandı; 33. gün anahtar sonrası” (puan yok) |
| Satır takibi | Kullanıcı sayımı + anlatım | Okurken dikkat sürdürme (öznel) | Metin türü, yorgunluk, yazı boyutu | Dengeli sıra, aynı metin uzunluğu | Sayımlar **kullanıcı beyanıdır** |
| Spor gözlemi | Miktar, zorlanma, süre (gözlem) | Başlangıç durumu (gözlem) | Günün formu, uyku, motivasyon | Standart koşul, form notu | Puanlama / standart karşılaştırma yok |

### 7.3. Öğrenme ile performans, sızıntı ve alternatif formlar

- **[Analiz]** Eğitim sırasındaki yüksek performans kalıcı öğrenmeyi abartabilir; bu yüzden değerlendirme için **gecikmeli ve eğitimde görülmemiş** maddeler tutulur. (Bu ayrım öğrenme literatüründe iyi bilinir; bu turda kaynak taranmadı.)
- Test maddeleri eğitim maddelerinden **ayrı havuzda** tutulur. Eğitimde kullanılan içerik teste girmez.
- **Alternatif formlar** tekrar test etkisini (uygulama etkisi) azaltır; ancak formların zorluğu denk olmayabilir ve strateji oluşumu sonucu etkileyebilir [K50]. Bu yüzden formlar **denk olduğu varsayılmadan**, form kimliğiyle kaydedilir.
- Hafıza ve çoklu görev testlerinin bir kısmı **Türkçe** yapılır (G14).
- **Hafta 1'den sonra** kilitli havuzlar ve kontrollü alternatif formlar yalnız isteğe bağlı yeniden haritada (13.8) kullanılır. İngilizce madde tekrarında sızıntı kavramı farklıdır: maddeler zaten tekrar edilir, bu yüzden amaç ayırma değil, **ilk bağımsız yanıtı** ayrı tutmaktır (A0).

### 7.4. Tek olgu (n = 1) tasarım ilkeleri [Kanıt K50 + Analiz]

Bu sistem tek kişilik, tek olgulu bir izleme düzenidir. Literatür, koşullar arasında **en az üç karşılaştırma** içeren tasarımları (çoklu başlangıç, değişimli koşullar, ABAB) ve koşulların **rastgele sıralanmasını** önerir [K50]. Pratikte:

1. Kılavuzlu / kılavuzsuz okuma gibi koşullar **dengelenmiş sırayla** (ör. ABBA) uygulanır.
2. Hafıza sarayı kullanılan / kullanılmayan listeler farklı günlere **rastgele** atanır.
3. Güvenilir değişim indeksi (RCI) bireysel olgularda kullanılabilir ama uygulama etkisini tek başına gidermez [K50]; bu raporda hesaplanmaz, yalnızca ileride kullanılabilecek bir yöntem olarak anılır.
4. Hafta 1 verisi **tanımlayıcıdır**; “anlamlı fark” veya “iyileşti” iddiası yapılmaz.

### 7.5. Zamanla sansürlü hatırlama verisi

Unutma anı doğrudan gözlenmez. İki kontrolde verilen yanıtların farklı olması, arada kesintisiz bir kayıp yaşandığını kanıtlamaz; geri çağırma da değişken olabilir. Bu yüzden yalnız kontrol zamanları ve yanıt farkı raporlanır:

- Rapor: “Son hatırlanan kontrol: 10. dk. İlk hatırlanmayan kontrol: 25. dk. Değişim bu aralıkta.” **Tek bir dakika verilmez.**
- Kullanıcının kendi önerdiği “tahmini dakika” fikri aralık olarak korunur.
- Kontrol kaçırılırsa gerçek gecikme kaydedilir (G04); planlanan ve gerçek gecikme birlikte yazılır.
- “Neyi hatırlayacağını çıkaramadı” durumu ayrı alandır; “bilmiyorum” ile aynı değildir.

### 7.6. Yardım kategorilerinin kullanımı

Rapor, A0 (bağımsız ilk deneme) ile A1–A4'ü **ayrı sütunlarda** gösterir. Anahtar açıldıktan sonraki deneme (A2) hiçbir zaman bağımsız ilk yanıtla birlikte özetlenmez.

### 7.7. Yorum dili sözlüğü

| Kullanılabilir | Kullanılamaz |
| --- | --- |
| “10–25. dk kontrolleri arasında hatırlama durumu değişti.” | “17. dakikada unuttu.” |
| “İlk bağımsız denemede şu yanıt verildi; anahtar 3. gönderimde açıldı.” | “Yanlış yaptı / başarısız.” |
| “Bu hızda ve bu kulaklıkla şu yanıt kaydedildi.” | “İşitme kaybı var / yok.” |
| “Kullanıcı kılavuzsuz okumada 4 satır kaybı bildirdi.” | “Göz kasları zayıf.” |
| “Bu görev tipinde bu gözlem.” | “Çoklu görev yeteneği gelişti.” |
| “İngilizce yazı örneğinde şu yapılar görüldü.” | “Düzeyi A2'dir.” (özel test CEFR sınavı değil) |

### 7.8. Hafta 1 sonunda ne söylenebilir?

| Konuşulabilir | Konuşulamaz |
| --- | --- |
| Eğitim öncesi yazı / ses örnekleri; görev tipi başına gerçekleşen süre; fiili kapasite; dış kaynakların uygulanabilirliği (kullanıcı notu); 5 dk – ertesi gün aralığında ilk hatırlama gözlemleri (Hafta 1 paketi: 5 dk · 30 dk · 2 sa · ertesi gün); satır kayması için öznel sayımlar; sporun fiili uygulanabilirliği | Kalıcı İngilizce kazanımı; kesin CEFR düzeyi; 1 haftalık hatırlama (Gün 12–13'e düşer, Hafta 1 raporunun dışındadır); “hafıza düzeldi”; çoklu görev transferi; işitme veya görme durumu; herhangi bir tanı |

### 7.9. Hafta 1'den sonra ölçümün niteliği [Analiz]

D34 gereği Hafta 1'den sonra kontrollü yeniden ölçüm yoktur (isteğe bağlı olan hariç). Bunun sonuçları:

| Konu | Ne söylenebilir | Ne söylenemez |
| --- | --- | --- |
| İngilizce madde tekrarı | Her madde için bağımsız ve yardımlı yanıtların gün gün tablosu; hangi aralıkta yanıtın değiştiği | “Kelime dağarcığı şu kadar arttı”; tekrarın kendisi öğrenme olduğundan temiz sınav sonucu değildir |
| Diğer alanlar (pratik kayıtları) | Hafta 1 başlangıç kaydı ile sonraki pratik kayıtlarının **yan yana** durması; hacim, süreklilik, hız düzeyi | “Gelişti / geriledi”: pratik görevlerinin zorluğu, biçimi, yardım düzeyi ve günü her seferinde farklıdır; kontrollü eşdeğer form yoktur |
| Sürdürme | Yapılan / atlanan hedef sayısı, haftalık özet | Beceri düzeyi hakkında hüküm |

**Seçenekler:** (1) Hiçbir şey ekleme: “durmamak” hedefiyle uyumlu, ölçüm iddiası zayıf; (2) isteğe bağlı tek yeniden harita (13.8), alternatif formlarla; (3) Hafta 1 başlangıç görevlerinin pratik içinde bilinçli olarak benzer biçimde tekrar edilmesi (kontrolsüz, tanımlayıcı). Karar kullanıcıdadır; varsayılan (1) + haftalık özet.

---

## 8. İngilizce

### 8.1. Başlangıç durumu

Kullanıcı <1000 kelime, cümle kurmada zorlanma, uzun süredir dinleme ve çeviri yok diyor [Beyan]. **Ölçülmedi**; A1 / A2 etiketi konmaz. Gerçek kelime dağarcığı için isteğe bağlı bir dış çapa Bölüm 8.4'te.

### 8.2. Amaç [Karar D26, D31]

**“Her türlü amaçtan dolayı network gerekli; artık AI gerekmeden rahatlıkla anlayıp dinleyebilme.”** Bu iki parça şöyle yorumlanır [Analiz]:

1. **Network (alan özel değil):** tanışma, kendini ve ilgi alanını anlatma, soru sorma, tekrar isteme, takip mesajı yazma; gerçek insanlarla konuşma içeriğini takip etme. Belirli bir sektör veya topluluk seçilmediği için **senaryolar genel** tutulur (tanışma, ortak ilgi bulma, bilgi isteme, teşekkür / takip, kısa sunum dinleme); sonradan alan eklenebilir. Akıcı konuşma değil önce **anlama ve etkileşime girebilme** öne çıkıyor.
2. **AI gerekmeden anlama / dinleme:** canlı konuşmayı, video / podcast / sunumu çeviri ve AI desteği olmadan takip edebilme. Bu, **alıcı beceriler** (dinleme > okuma) ağırlıklı bir hedeftir. AI'ya hangi durumlarda ihtiyaç duyulduğu belirtilmedi; varsayılan: canlı konuşma, video / podcast, yazı yazma.

**Sonuçlar:**
- Müfredat ağırlığı: **dinleme > etkileşimli konuşma > okuma > yazma.**
- Ölçüm: öğrenme görevlerinde **AI / çeviri aracı kullanımı ayrı yardım kategorisi (A4)** olarak kaydedilir; böylece “araçsız anlama” zamanla gözlenebilir (Bölüm 6.2). Bu bir puan değildir.
- Zaman ufku: “rahatlıkla anlama” uzun vadelidir; Hafta 1'den hüküm çıkmaz (Bölüm 7.8). Üç aylık hedef **sürdürmedir**, seviye değil (D32); seviye iddiası yapılmaz; İngilizce tekrar kaydı (Bölüm 8.8) ve isteğe bağlı yeniden harita (13.8) yalnız tanımlayıcı veri verir.

### 8.3. Dış kaynaklar [Devredildi G07]

| Kaynak | Ne sunuyor | Doğrulama durumu | Not |
| --- | --- | --- | --- |
| **USA Learns** | Ücretsiz, ABD Eğitim Bakanlığı fonlu, Amerikan İngilizcesi; telefon ve bilgisayarda tarayıcıdan çalışır; mikrofon izni gerekir | Resmî yardım sayfası okundu [K27, K6] | Bağımsız öğrenci için kayıtlı rapor doğrulanamadı; sınıf anahtarıyla öğretmen puan ve süreyi görür. Eski içerikte Flash notu vardı, güncel sayfada yok; cihazda denenmeli. |
| **VOA Let's Learn English, Seviye 1** | 52 ders, haftada 1; video; konuşma, kelime, yazma; yazdırılabilir çalışma kâğıtları ve değerlendirme materyalleri; Amerikalı öğretmenler | Resmî sayfa okundu [K28, K7] | Ücret / hesap bilgisi sayfada yok (arama sonucu: hesap gerekmez; doğrulanmadı). |
| **VOA Learning English yayınları** | Resmî açıklamada bazı üst-başlangıç/orta programların yavaş okunması; metin/MP3 seçenekleri | Resmî açıklama [K65] | Bütün içeriklere aynı hız genellenmez. Ders 1 indirme bağlantıları doğrulandı; telefonda denenmedi. |
| **AnkiDroid / Anki** | Aralıklı tekrar kartları | Resmî sayfalar [K16] | İsteğe bağlı. Anki kendi aralık algoritmasını kullanır (bu turda ayrıntısı incelenmedi); **3-10-20-50 kuralı (8.8) bu raporun kendi tekrar kuyruğu içindir.** Aynı maddeyi iki sistemde tekrarlamak kaydı karıştırır; hangisinin esas olacağı kullanıcıya bırakılır. |
| **EF SET** | Ücretsiz iki beceri sürümü 50 dk; dört beceri sürümü 90 dk | Resmî ürün sayfaları [K26, K69] | Dört beceri konuşma/yazmayı da kapsar. Dış puan ayrı; zorunlu ek sınav değil; cihazda denenmedi. |
| **Vocabulary Size Test (Nation & Beglar)** | Çoktan seçmeli kelime boyutu testi | Resmî / akademik sayfa [K51] | CEFR eşlemesi yaklaşıktır; tanımlar İngilizce olduğundan çok düşük düzeyde kullanılabilirliği sorgulanmalı. İsteğe bağlı dış çapa. |
| Duolingo vb. | — | Resmî sayfa incelenmedi | Varsayılan listede yok (G07). |

**Seçim mantığı [Analiz]:** İki ana kaynak (USA Learns, VOA L1) Hafta 1'in ilk günlerinde denenir, kullanıcı hangisinin sürdürülebilir geldiğini **puansız bir notla** bildirir, biri birincil olur. Hedef (AI'sız dinleme) için kaynak çeşitliliği önemli; ancak aynı anda çok araç dağınıklık yaratır.

### 8.4. Seviye raporu ve dış çapa

CEFR düzeyleri A1–A2–B1–B2–C1–C2'dir; **“A3” yoktur** [K9]. Özel test standartlaştırılmış CEFR sınavı değildir ve kelime sayısı ölçmez. Bağımsız değerlendirici yeterli veriyle **beceri bazında yaklaşık bir profil** sunabilir; sertifika / kesin düzey iddiası yapılmaz. Bir dış çapa (EF SET, VST) kullanılırsa sonucu **dış aracın tahmini** olarak etiketlenir.

### 8.5. Özel sistemde üretilecek görevler (dış kaynağın karşılamadığı)

Dış kaynaklar serbest yazı / sesli anlatımı **deneme geçmişi, ses dosyası ve tek ZIP** olarak sunmaz (bu turda böyle bir araca rastlanmadı; kapsamlı pazar taraması yapılmadı). Özel sistem şu görev kartlarını taşır; hepsi **çıktı** olarak tanımlıdır:

| Görev | Örnek yönerge | Hedef çıktı | Anahtar türü | Kayıt |
| --- | --- | --- | --- | --- |
| Serbest yazı | “Bir günümü anlat” (Hafta 1: kendini tanıtan ve etkinlik öneren yazı, G05-W1) | 5–8 cümle | Beklenen içerik noktaları + örnek metin | Metin, taslaklar |
| Çeviri EN→TR / TR→EN | 3–4 kısa cümle | 1 küme | Kabul edilen karşılıklar | Yanıt, yardım beyanı |
| Okuma anlama | 120–180 kelimelik başlangıç metni + açık uçlu sorular (Hafta 1: ≈150 sözcük, 6 kısa soru, G05-R1) + kendi sözleriyle anlatım | 1 metin | Beklenen içerik noktaları | Yanıt + anlatım |
| Sesli okuma | Aynı metinden 2–3 cümle | 1 kayıt | — | Özgün ses |
| Kendi sözleriyle anlatma | Okunan metin veya konu | 1 kayıt | Beklenen noktalar | Özgün ses |
| **Dinleme ve kombinasyon merdiveni (B1–B2, C0–C6)** | Bölüm 10.4 | Basamak başına 1 küme | Beklenen noktalar | Yanıt, hız, tekrar sayısı |
| **Network senaryosu (konuşma)** | “Kendini tanıt”, “bir meslektaşa iş / ilgi alanını sor”, “tekrar etmesini iste”, “tanışma sonrası kısa takip mesajı yaz” | 1 kayıt / 1 mesaj | Beklenen noktalar | Ses / metin |
| Boşluk doldurma (az) | 5–8 madde | 1 küme | Kabul edilen karşılıklar | 3. gönderim kuralı |

Serbest yanıtlarda anahtarın sözcüklerini kullanmamak hata sayılmaz; çünkü uygulama hüküm vermiyor (D01). Anahtar, 3. gönderimde yalnızca “beklenen buydu” olarak açılır (D02).

### 8.6. Dinleme ve işitme

İngilizce dinleme görevleri işitme yakınmasıyla karışır (Bölüm 7.2, 10.3). Her dinleme görevinin **hız ve tekrar sayısı** kaydedilir; Türkçe kontrol aynı yapıda uygulanır.

### 8.7. Dinleme becerisini geliştiren yöntemler hakkında kanıt [Kanıt K53]

- **Gölgeleme (shadowing)** — duyduğunu hemen tekrar etme — sınıf çalışmalarında alt-düzey işlemeyi (sesbilgisel) iyileştirdiği bildirilmiş; yararın özellikle düşük düzeydeki dinleyicilerde olduğu iddiası tartışmalı. Çalışmaların çoğu küçük, Japon EFL sınıflarına dayanıyor.
- **Dikte** esas olarak sesbilgisel kodlamayı çalıştırıyor görünüyor; anlamaya doğrudan katkısı kanıtlı değil.
- **Kapsamlı dinleme** için bu turda doğrudan inceleme bulunamadı.
- **Sonuç [Analiz]:** B1 basamağında dikte / gölgeleme **denenebilir araçlardır, vaat değil**; bu kullanıcıda etkisi Hafta 1'den sonraki izleme ile görülür.

### 8.8. İngilizce tekrar kuralı: ardışık 3–10–20–50 gün [Karar D35, R9; G23]

R9: “Günler arasında tekrarlar 3 gün sonra tekrar 10 gün sonra tekrar gibi.” Sayılar önceki çalışmadan itibaren bekleme aralıklarıdır. Eski mutlak gün varsayımı kaldırıldı. Bu özel aralık dizisinin kullanıcıda üstünlüğü kanıtlanmış bir yöntem olduğu iddia edilmez.

| Olay | Önceki olaydan bekleme | Gecikmesiz nominal gün (öğrenme=0) |
| --- | --- | --- |
| Öğrenme | — | 0 |
| Tekrar 1 | 3 gün | 3 |
| Tekrar 2 | 10 gün | 13 |
| Tekrar 3 | 20 gün | 33 |
| Tekrar 4 | 50 gün | 83 |

**Araç:** `kayitlar/INGILIZCE_TEKRAR_TAKVIMI.xlsx` bu kuralı formülle işler: her maddenin beş satırı (öğrenme ve dört tekrar) vardır; bir sonraki planlanan tarih, bir önceki **gerçekleşen** tarih varsa ondan, yoksa bir önceki planlanan tarihten hesaplanır. Nominal tarih (gecikmesiz) ve gecikme günü ayrı sütundadır. Dosya LibreOffice ile yeniden hesaplanarak gecikme, vadesi gelen ve gecikmiş durumları için denendi; Excel ve telefon tablo uygulamalarında **denenmedi**. “Bugün” hücresi elle değiştirilebilir.

**Mekanik önerim:** önce yardımsız yanıt, sonra gerekirse anahtar. Üçüncü gönderim/elle açma kuralları devam eder. Her tekrardaki bağımsız yanıt, maddenin yaşam boyu ilk görülmesi anlamına gelmez. Yardım ve anahtar sonrası yanıtlar ayrıdır.

**Gecikme tercihi:** Sonraki aralığı fiilen gerçekleşen tekrardan başlatmak bu sürümdeki tasarım kararımdır. Kaçan olayın eski planı silinmez; planlanan ve gerçek tarih birlikte tutulur. Aynı gün biriken adımlar arka arkaya yaptırılıp aralıklı tekrar olmuş gibi yazılmaz. Günlük genel hedeflerin önce yarım hedef kuralı bundan ayrıdır.

İkinci haftadan itibaren günlük **N=3 yeni madde** başlangıç önerisidir; kapasite uygun olduğunda 5 olabilir. İlk hafta eğitim maddelerinin kuyruğa girmesi isteğe bağlı, kilitli test maddeleri otomatik eklenmez. Aynı madde Anki ve özel kuyrukta çift planlanmaz.

**Yük hesabı — basit aritmetik:** sürekli günlük N yeni madde ve dört tekrar varsayalım. d, sıfırdan başlayan takvim günü olsun:

| d aralığı | Tekrar/gün | N=3 | N=5 |
| --- | --- | --- | --- |
| d<3 | 0 | 0 | 0 |
| 3≤d<13 | N | 3 | 5 |
| 13≤d<33 | 2N | 6 | 10 |
| 33≤d<83 | 3N | 9 | 15 |
| d≥83 | 4N | 12 | 20 |

İlk günü 1 diye numaralandırırsan eşikler Gün 4,14,34,84 olur. **Eski “yük yaklaşık yarıya iner” yorumu yanlıştı:** büyüme daha geçtir ama dört tekrar ve sürekli yeni girişte kararlı yük yine 4N'dir. Gecikme veya girişin durması gerçek kuyruğu değiştirir. Üç aylık pencerenin sonuna yakın öğrenilen maddeler nominal 83. gün tekrarına bu pencere içinde yetişmez; kayıt devam eder.

Asgari günün yapılmayan tekrarları yok sayılmaz. Kullanıcının bölme/azaltma kararı açık kaydedilir; uygulama beceri hükmü vermez.

---

## 9. Hafıza ve çoklu görev

### 9.1. Gerçek ihtiyaç [Beyan]

Dinlediğini yerleştirmek; çok adımlı yönergenin sırasını korumak; başka iş sürerken duyduğu görevi unutmamak; araya zaman / iş girince devam edebilmek; dersin başını kaybetmemek; bilgiyi kendi sözleriyle anlatmak; hafıza sarayı kullanmak; kısa, orta, uzun gecikmede hatırlamayı geliştirmek. Pilot örneği yalnızca örnektir; meslek hedefi veya pilotluk yeterliliği değildir.

### 9.2. Kanıt ve beklenti [Kanıt]

| Yöntem | Bulgu | Beklenti |
| --- | --- | --- |
| Çalışma belleği / çoklu görev antrenmanı | Eğitilen göreve yarıyor; uzak ölçülerde güvenilir iyileşme gösterilememiş [K20] | “Çoklu görev gelişir” vaadi yok; gerçek hayata benzer görev ve **bu görev tipinde** rapor |
| Hafıza sarayı | Sıralı listelerde anlık geri çağırmada orta-büyük etki; kanıt kalitesi düşük / çok düşük [K21, K22] | Sıralı yönerge / liste için araç; derse aktarımı gösterilmemiş |
| Aralıklı tekrar / geri çağırma | En iyi desteklenen yöntemler arasında; maddeye özgü; ergen-özel kanıt az [K8, K29] | Kelime ve temel bilgi için |
| Sağlık yönlendirmesi | Günlük yaşamı etkileyen unutkanlık hekimle değerlendirilmeli [K14] | Bilgi notu, tanı değil |

### 9.3. Görev aileleri [Analiz]

| Kod | Görev | Yapı | Ölçüm sorusu |
| --- | --- | --- | --- |
| H1 | **Sıralı yönerge** | 3–6 adım dinle → hemen / gecikmeli sırayla aktar | Saray kullanılan ve kullanılmayan listeler (rastgele günlere atanmış) |
| H2 | **Gecikmeli bilgi tohumu** | 1 bilgi, sonra 2 farklı bilgi; kontrol kategorileri: kısa, birkaç saat, ertesi gün, bir hafta | Hangi aralıkta hatırlama değişti |
| H3 | **Kombinasyonlu çalışma** | **C0–C6 kanal merdiveni** (dinle, konuş, yaz, hareket, hatırla kanallarının kombinasyonları); önce tek görev tabanları, sonra birlikte | Bu görev tipinde, birlikte yapıldığında yanıtın tek görevden nasıl farklı olduğu (yorum dışarıda). Ayrıntı ve güvenlik: Bölüm 10.4 |
| H4 | **Çok kısa gecikme** | Talimat → birkaç saniye sayma → tekrar (çok kısa gecikme kategorisi) | Kullanıcının “5 sn önce söylediğini unutuyorum” gözlemi |
| H5 | **Ders başı görevi** | Kısa Türkçe mini anlatı → hemen “başta neyden bahsedildi?” | **A/B strateji karşılaştırması:** A = dinlerken zihinde / tek cümleyle özet tutma (kullanıcı not almıyor ve alsa da unutuyor, bu yüzden yazılı not zorunlu değil; yabancı dilde not almak ek yük getirebilir [K61]); B = serbest dinleme (Hafta 1 paketinde iki farklı mini ders ve sabit sıra A→B kullanıldı; **dengeleme yapılmadı**, bu yüzden Hafta 1 karşılaştırması hüküm vermez; Hafta 2+ pratiğinde sıra farklı günlere yayılabilir) |
| H6 | **Tekrar dinleme etkisi** | Aynı kısa içerik farklı günlerde 1, 2, 3 kez dinlenir → gecikmeli kontrol | Kullanıcının “3+ kez dinleyince kalıyor” gözleminin **kendi verisiyle** sınanması |

H5'teki strateji bu raporda kaynaklanmadı; yalnızca denenebilir bir fikirdir. H6, kullanıcının kendi beyanını sınanabilir hâle getirir.

### 9.4. Gecikme kategorileri [Analiz]

Gecikme kontrolleri **kategori** olarak planlanır (çok kısa · kısa · birkaç saat · ertesi gün · bir hafta); kesin dakika / saat kullanıcıya görev saati olarak sunulmaz (D24). Uygulama **gerçek gecikmeyi** otomatik kaydeder ve raporda aralık olarak yazar (Bölüm 7.5). Hatırlatma, tohumdan hesaplanan göreli süreyle çalışan telefon Saat alarmıyla yapılır (G04). Eğitim etkisini ayırmak için tohumlar eğitimde hiç görülmemiş bilgilerdir; yeniden gösterme, ipucu ve anahtar açma **ayrı kategori** olarak kaydedilir (Bölüm 7.6). **Hafta 1'den sonra (D34)** H2 tohumları ve diğer hafıza görevleri **test değil pratik** olarak sunulur (kontrollü havuz ve alternatif form yok); kayıt biçimi ve yorum sınırları aynı kalır (7.7). İngilizce maddelerinin uzun ölçekli tekrarı ayrı sistemdir (8.8). Hafta 1 paketinde H2 kontrolleri 5 dk · 30 dk · 2 sa · ertesi gün olarak yazılmıştır; bir haftalık kontrol A için Gün 12, B için Gün 13'tür (isteğe bağlı) ve ilk hafta raporunda tamamlanmış gösterilmez.

### 9.5. Hafıza sarayı eğitimi (Gün 1–2)

Kullanıcının kendi evinden 8 duraklı (en az 6; zorlanırsa 4) küçük bir güzergâh; her durağa bir öğe bağlanır. Hafta 1 paketi: Gün 1 kurulum ve 6 öğelik eğitim listesi, Gün 2 yedi nesnelik sıralı yönerge (H1) ile deneme (eğitim, test değil). Saray yalnızca **sıralı** bilgiler için denenir.

**Tip: ders (4.4, D37).** Hafıza sarayı gibi teknikler kendi başına derstir: önce sıfırdan anlatım, sonra çalışma ilkeleri: bilgiyi **hatırlama / ezber** olarak rahatça akla getirebilme ve **rahatça sürdürülebilirlik** (zorlaşırsa artırılmaz, sadeleştirilir; Hafta 1'den sonra test yok). Pratik kaydı: hangi güzergâh / liste, kaç öğe, kullanıldı mı; yorum yok.

### 9.6. Sınırlar

Hafıza sarayı başarısı, bütün günlük unutkanlığın çözüldüğü anlamına gelmez. Duyamama, kelimeyi bilmeme, anlamama, dikkat dağılması ve sonradan hatırlayamama **aynı sonuç gibi** raporlanmaz.

---

## 10. Odak, göz, kulak ve dinleme merdiveni

### 10.1. Göz

| Bilgi | Durum |
| --- | --- |
| Gözlük **sürekli** takılı; gözlük bulanık göstermiyor; göz / baş ağrısı yok [Beyan] | Çift görme belirtilmedi; numara ve muayene sonucu bilinmiyor |
| Son kontrol 2024 son ayları, göz hastanesi [Beyan] | ≈22–24 ay önce. AOA okul çağı ve gözlük kullananlar için yıllık kapsamlı muayene önerir [K30]; bu bir tanı değil, genel kontrol aralığıdır. |
| Göz egzersizleri | Okuma / öğrenmeyi artırdığına dair kanıt yok; belirli durumlar (ör. konverjans yetersizliği) muayene ile ayrılır [K23, K15] |

Satır kaybı bu bilgilerle bir **görme sorunu olarak varsayılmaz**; dikkat kayması, okuma alışkanlığı ve metin düzeni de adaydır. Okurken zihnin dağılması yaygındır (bildirilen oranlar ~%15–30), ancak satır düzeyinde doğrudan kanıt bulunamadı [K39].

### 10.2. Satır takibi protokolü [Analiz]

- **Kullanıcı beyanı çelişkili:** önceden “ekranda ve kitapta, kitapta daha çok”; son olarak “kitaplarda, PDF'lerde az oluyor”. En çok yaşadığı ortam belirtilmedi. Bu yüzden **kitap, PDF / ekran ve (isteğe bağlı) ders dışı metin** hepsinde ölçülmesi hedeflenir; ancak **v11 Hafta 1 paketi dört metni tek ortamda (telefon ekranı) okutur** ve kitap/PDF karşılaştırması Hafta 2+ pratiğine bırakılmıştır (EKSIKLER.md). Kayıtlar kullanıcı sayımıyla karşılaştırılır, varsayım yapılmaz.
- 4 metin (aynı uzunluk): 2 koşul × 2 metin; koşullar **ABBA** sırasıyla. Koşullar: kılavuzsuz / parmak veya cetvel. Hafta 1 paketinde dört özgün Türkçe metin (`07_OKUMA_METINLERI.md`) her biri yaklaşık 155 sözcüktür (v10'daki ≈250–300 hedefinden kısa); zorluk ve uzunluk eşitliği kanıtlanmış değildir, koşul farkı metin farkıyla karışır. Her metinden sonra aynı üç genel soru sorulur.
- Kullanıcı okuma sonunda **kendi sayımını** girer (satır kaybı, geri dönme) ve metni **kendi sözleriyle** anlatır (yazı / ses). Not almak zorunlu değildir (kullanıcı not almıyor).
- Sayımlar kullanıcı beyanıdır; nesnel göz hareketi ölçümü değildir. Uygulama yorum yapmaz.
- Cetvel / parmak, “egzersiz” değil **kolaylaştırıcı**dır; etkisi bu rapor için araştırılmadı.

### 10.3. İşitme ve konuşma hızı [Beyan + Kanıt + Analiz]

- **[Beyan]** İşitme “çok değişken”; sessiz ortam olsa bile konuşma hızlı ve yoğunsa duyamayabiliyor; iki kulakta olması muhtemel ama bilgi yok; ~2 yıldır; nadiren çınlama; muayene geçmişi bilinmiyor.
- **[Kanıt K37]** Hızlı konuşanları takip güçlüğü işitme kaybı, işitsel işlemleme güçlüğü, dikkat, dil veya kaygıyla örtüşebilir; hafif işitme kaybı da benzer güçlük yaratabilir; klinikler önce kapsamlı odyolojik değerlendirme, gerekirse sonra sıkıştırılmış konuşma ve gürültüde dinleme testleri önerir. Bunlar klinik sayfalardır, resmî ölçüt değildir. Bu rapor **tanı koymaz**.
- **[Kanıt K38]** Yabancı dilde dinlemede yavaşlatmanın anlamayı artırdığı her çalışmada görülmemiş; öğrenciler yavaş konuşmayı tercih ediyor. Bu yüzden “yavaş = daha iyi” varsayılmaz.
- **[Analiz]** Konuşma hızı bir **ölçüm değişkenidir.** Sesli her görevde şu alanlar kaydedilir: konuşma hızı (kelime/dk), dil, cihaz (USB-C kulaklık / hoparlör), ses seviyesi (beyan), tekrar dinleme sayısı, metnin görünür olup olmadığı. Aynı yönergeler **yavaş, normal, hızlı** sürümlerle ve Türkçe kontrol olarak sunulur.
- **[Analiz]** Hafta 1 sesli görevleri: yönerge kısa, duraklamalı, sessiz odada; ilk dinlemeden sonra tekrar isteği serbest ve sayılır.
- **[Dikkat]** Frekans ya da ses yükseltme denemeleri üzerinden bir eğitim kurulmaz; uygulama işitme testi olarak sunulmaz. Çınlama için kullanıcıya tanı konmadı [K5].

### 10.4. Dinleme ve kombinasyon merdiveni [Karar D25, D33; ayrıntı Devredildi G17]

Kullanıcı bu alanı şöyle tarif etti: *dinleme–algılama testleri ile dinleme testleri, sonra dinlediğini anlama, en sonda kombinasyonlu çalışma: dinle + hareket yap, duyarak aynı anda iş yap.* Son mesajında kombinasyonun **çok geniş** olduğunu ekledi: *klavyede kendi fikrini yazarken biriyle konuşup yazımda istediğini yazıp konuşmayı da hatasız yürütme; karmaşık kombinasyon, her türlüsü.* Ayrıntıyı Claude'a bıraktı. “Ses / ritim / nota ayrımı” **kullanıcının hedefi değildir** (önceki asistanın soru seçeneğiydi); bu raporda o alan için görev yoktur.

**Önce iki temel basamak:**

| Basamak | Ne | Örnek görev (önerilen) | Kayıt |
| --- | --- | --- | --- |
| **B1 Algılama** | Duyulanı yakalama | Kısa sözcük / sayı / ifadeyi duyup yazma (dikte); isteğe bağlı: benzer sesli sözcükleri ayırt etme | Yanıt, hız, tekrar sayısı |
| **B2 Anlama** | Dinlediğini anlama | Kısa konuşma / diyalog → ana fikir ve ayrıntıyı **kendi sözleriyle** anlatma | Yanıt (yazı / ses) |

**Sonra kombinasyon merdiveni (C0–C6):** beş kanal tanımlanır — **L** dinle, **S** konuş, **T** yaz (klavye), **M** hareket, **R** hatırla / sırayı koru.

| Seviye | Kanallar | Örnek görev | Not |
| --- | --- | --- | --- |
| **C0** | Tek tek: L, S, T, M | Her kanal için ayrı **taban kaydı** | Zorunlu ilk adım; yorum yok |
| **C1** | L + M | Kısa konuşmayı dinlerken basit hareket (yerinde → kapalı güvenli alanda yürüme) → ardından kendi sözleriyle anlatım; sözlü komutlarla hareket (2–5 komut) | Ergenlerde yürürken çift görev maliyeti ölçülmüş, ayakta durmada değil [K54] |
| **C2** | L + T | Dinlerken anahtar sözcük / kısa özet yazma | Not almak yabancı dilde ek bilişsel yük getirebilir, sonuçlar karışık [K61]; **Türkçe önce**, kısa içerik |
| **C3** | S + T | Bir konuyu **kendi fikrinle anlatırken** aynı anda ana noktalarını klavyede yazma | Kullanıcının “klavyede kendi fikrimi yazarken konuşma” örneği |
| **C4** | L + S | **Konuşma turları:** karşıdaki repliği dinle → yanıtla. Önceden kaydedilmiş Amerikan İngilizcesi partner replikleriyle (AI gerekmez); gerçek partner yok (D39), biri çıkarsa izinle isteğe bağlı | Varyant C4-M: konuşurken yerinde / güvenli alanda yürüme |
| **C5** | L + S + T | Konuşma turlarını yürütürken aynı anda **yazılı not veya mesaj taslağı** (ör. tanışma sonrası takip mesajı) | “İstediğimi yazıp konuşmayı da yürütme” hedefi; gerçek-hayat eşleniği **C5-G** (10.6) |
| **C6** | L + S + T + R | Konuşmayı yürütürken istenen noktaları yazıya döküp konuşma sonunda **sırayı ve içeriği hatırlama** (ör. 3 isim / 3 söz / 3 görev) | Kullanıcının “konuşmayı hatasız yürütme” hedefi; uygulama hata saymaz, yan yana kayıt tutar, yorum dış değerlendiricinin |

**Zorluk, seviye içinde şu faktörlerle ölçeklenir:** konuşma hızı (yavaş / normal / hızlı), dil (Türkçe → İngilizce), içerik yükü (1 → 3 bilgi), süre, kesinti, kaynak (kayıtlı replik → gerçek-hayat kesintisi).

**Tasarım ilkeleri [Analiz]:**
1. **Her seviyede önce tek görev tabanı (C0), sonra birlikte.** Aynı içerik yan yana kaydedilir; uygulama “şu kadar düştü” demez (Bölüm 7.1).
2. **Türkçe önce, İngilizce sonra;** her seviyede **hız değişkeni** ve **Türkçe kontrol** (Bölüm 10.3).
3. **İlerleme kullanıcı kararıyla:** “Bu seviye rahat geliyor” bayrağı; geçiş için puan / ölçüt yok.
4. **Güvenlik:** M kanalı yalnız C1 ve C4-M'de; **yazarken ayakta yürümek yok;** ağırlık / bar çalışırken, merdivende, trafikte veya kalabalıkta kombinasyon yok.
5. **Araçsız anlama (D26):** C4–C6'da AI / çeviri aracı kullanılmaz; kullanılırsa A4 işaretlenir. Kayıtlı partner replikleri AI gerektirmez.
6. **Gerçek bir kişinin sesi** (partner ya da gerçek-hayat kesintisinde konuşan biri) kaydedilmez; kaydedilecekse o kişinin **izni** gerekir. İzin yoksa yalnız kullanıcının kendi sesi ve yazısı kaydedilir; uygulama ortam kaydı almaz (D08).
7. **Kanıt tavanı [K20, K54]:** Çoklu görev antrenmanının günlük hayata aktarımı gösterilmemiş; sonuçlar “**bu görev tipinde**” diye raporlanır. Çift görev maliyeti ölçülmüş bir olgudur; hedef bu maliyeti sıfırlamak değil, kullanıcının **kendi gerçekçi görevlerinde** ne olduğunu görmektir.
8. **Dikte / gölgeleme** B1 için denenebilir araçlardır; kanıt sınırlıdır (Bölüm 8.7).
9. **Aşırı yük işareti:** Kullanıcı bir seviyede yorgunluk / sinirlenme bildirirse bir önceki seviyeye dönülür; bu bir hüküm değil, akış kuralıdır.

### 10.5. Sağlık yönlendirmesi: bilgi notları (tanı değil)

| Konu | Bilgi | Kaynak |
| --- | --- | --- |
| Duyma güçlüğü | Aile hekimi / KBB-odyoloji değerlendirmesi; ani değişiklikte acil | K4, K37 |
| Çınlama | Birçok nedeni olabilir | K5 |
| Unutkanlık | Günlük yaşamı etkiliyorsa aile / hekimle paylaşılması | K14 |
| Göz kontrolü | Yıllık kapsamlı muayene önerisi (genel) | K30 |
| Check-up (göz, KBB, diş) | Kullanıcı yaptırmayı planlıyor, tarih belirsiz (D38). Sonuç gelirse işitme / görme ile ilgili **bağlam notu** olarak eklenir; sonuç beklenmeden başlanır; sonuç tahmin edilmez | K4, K30, K37 |

Karar kullanıcıdadır.

**Muayeneye götürülebilecek kısa not (kullanıcının kendi beyanları; tanı değil):** ~2 yıldır zaman zaman duymada / anlamlandırmada güçlük; sessiz ortamda bile hızlı veya yoğun konuşmada kaçırma; belirti çok değişken; nadiren çınlama; iki kulakta olması muhtemel ama bilinmiyor; sürekli gözlük, bulanıklık ve baş ağrısı yok; son göz kontrolü 2024'ün son ayları. Neyin nasıl değerlendirileceği hekimin kararıdır; bu not yalnız hatırlatmadır (klinik sayfalarda hızlı konuşmayı takip güçlüğünde önce kapsamlı odyolojik değerlendirme anılıyor [K37]). Diş kontrolü bu raporun alanı dışındadır ve plana etkisi yoktur.

### 10.6. Gerçek-hayat kesintili yazma (partnersiz) [Karar D39; ayrıntı Devredildi G25]

**Kullanıcının örneği (R8-6):** “Sana komut yazıyorum; yazarken biriyle konuşuyorum; komuta hatasız devam edebilmek.” Konuşma partneri yok, ama kullanıcı yalnız değil ve bu durumlar kendiliğinden oluyor. Bu yüzden hedef bir **laboratuvar partneri** değil, **gerçek hayattaki kesintilerdir.**

**Tasarım [Analiz]:**

| Varyant | Ne | Kayıt |
| --- | --- | --- |
| **C3-G / C5-G (gerçek-hayat)** | Kullanıcı zaten yapacağı bir yazıyı (yapay zekâya komut, mesaj, kendi fikir yazısı) yazarken biri onunla konuşursa görev “kesintili yazma” olarak sonradan işaretlenir | Yazılan metin, her kesinti için başlangıç / bitiş zamanı, kesintinin dili ve türü (soru / anlatma / sohbet), kullanıcının beyanı |
| **Kayıtlı kesinti (planlı)** | Kullanıcı yazarken telefondan önceden kaydedilmiş kısa Türkçe ya da Amerikan İngilizcesi “araya giren” replik çalınır (yazı bilgisayarda olabilir) | Replik kimliği, hız, dil, yazının devamı |
| **İsteğe bağlı: izinli kişi** | Evdeki biri **kendi isteğiyle ve izinle** kısa sorular sorar | Yalnız kullanıcının yazısı ve beyanı; kişinin sesi kaydedilmez |

**Kurallar:**
1. **Kullanıcı bildirmedikçe kesinti kaydı oluşmaz;** ortam kaydı yoktur (D08). Kesinti **sonradan beyan** edilir (“yazarken biri konuştu: evet / hayır, ne zaman, hangi dilde, ne türde”). Zamanlar kullanıcı beyanıdır, nesnel ölçüm değildir.
2. **Başkasının sesi kaydedilmez;** konuşma içeriği alınmaz. Kullanıcı isterse yalnız kendi cümlesiyle özetleyebilir.
3. **“Hatasız sürdürme” hata sayısı değildir:** uygulama yazının kesintiden önceki ve sonraki halini **yan yana** tutar; yazının tutarlı sürüp sürmediği, tekrar / eksik / kopukluk gibi gözlemler **dış değerlendiricinin yorumudur**, uygulamanın değil (D01). Kullanıcının kendi beyanı (“devam ettirdim / yolu kaybettim”) ayrı alandır.
4. **Taban:** aynı tür yazı kesintisiz de yazılır (C0 T tabanı) ve yan yana konur; Türkçe kesinti önce, İngilizce kesinti sonra.
5. **Uygulama sınırı:** yazı başka bir uygulamada (örn. yapay zekâ sohbeti) yazılıyorsa uygulama tuş vuruşunu göremez; kullanıcı yazdığı metni sonradan kayda yapıştırır ve kesinti beyanını girer. Bu kayıt **beyan + son metin**dir; taslak ve zaman damgası içermez.
6. **Güvenlik:** oturarak yazma; yürürken yazma yok; trafikte, kalabalıkta veya ağırlıkla çalışırken yok (10.4 ilke 4).
7. Yapay zekâya yazılan komut gibi içerikler kullanıcının kendi içeriğidir; paylaşılan pakete girerse gizlilik ayarı kontrol edilir (6.8).

---

## 11. Spor

Bu bölüm kişisel antrenman programı değil, **kullanıcı kararlarının ve devredilen ayrıntıların birleşik çerçevesidir.** Hekim değerlendirmesinin yerini tutmaz. Kullanıcı dakika cinsinden yapılandırmayı sevmediği için (D24) iş yükü **çıktı birimleriyle** tanımlanır.

### 11.1. Hedefler ve öncelik [Karar]

Öncelik sırası: **1) dayanıklılık, 2) güç, 3) denge, 4) çeviklik.** Çeviklik en düşük öncelik, çıkarılmış değil.

| Hedef | Kullanıcının kastettiği |
| --- | --- |
| Dayanıklılık | Aynı işi / hareketi uzun süre yapınca daha az zorlanmak; **kapsamlı** düşünülmeli (tek test değil) |
| Güç | Zamanla daha fazla yük kaldırabilmek |
| Denge | Bir şey taşırken / yaparken yamulmadan, kontrollü ve dengeli durabilmek |
| Çeviklik | Dövüş sporlarında hantal olmak yerine kontrollü, hızlı, acele etmeden hareket ve tepki; esneklik de buna dahil |

Şu anda dövüş sporu yok; teknik eğitim veya eğitmen varsayılmaz.

### 11.2. Koşullar ve envanter

| Kalem | Bilgi | Etiket |
| --- | --- | --- |
| Ağırlık erişimi | Hafta içi her saat; **hafta sonu yok** | [Beyan] |
| Dambıllar | **1 sabit (5 kg)**, **1 ayarlanabilir (en fazla 20 kg)**; ayarlanabilirin alt sınırı bilinmiyor; ikisi aynı ağırlıkta olmayabilir | [Beyan] |
| Plakalar | 4 × 2,5 kg + 4 × 5 kg + 4 × 10 kg = **70 kg**; “50 kg” = 4 × 10 + 2 × 5 kg plaka (bar hariç) | [Beyan] |
| Halter barı | Kendi ağırlığı bilinmiyor (kullanıcı tekrar sorulmasını istemedi). Bar yükleri **“plaka toplamı, bar hariç”** yazılır. Plakalar ayarlanabilir dambılla ortak kullanılıyorsa aynı anda yüklenemeyebilir. | [Beyan / Açık] |
| Raf / tutacak | Yatış pozisyonuna göre kafa hizası üstünde bar desteği; güvenlik tutacakları var ve **sağlam** | [Beyan] |
| Yardım / gözetim | **Çoğunlukla yok**, nadiren biri bakabilir (kimliği ve deneyimi bilinmiyor); bar “zorlarsak” 50 kg civarına çıkabilir | [Beyan] |
| Denge çubuğu vb. | Yok varsayılır (örnekti) | [Analiz] |
| Sağlık | Sakatlık yok; **düzenli ilaç yok**; bilinen tanı / hekim kontrolü bilgisi verilmedi | [Beyan / Açık] |

### 11.3. İş yükü ve oranlar [Karar D16, D24; sayısal örnekler Devredildi G16]

Kullanıcı günlük spor için **70–80 dk eşdeğeri** bir iş yükü ve **%50 dayanıklılık, %30 güç, %15 denge, %5 çeviklik** dağılımı verdi; “kesinlikle yapılacak” ve “isteğe bırakılan” ayrımını istedi. Dakikayı sevmediği için aşağıdaki hedefler **çıktı birimiyle** yazılır; oranlar çabanın payıdır.

| Kategori | Pay | Hedef birimi | **Zorunlu çekirdek** | Eklentiyle toplam |
| --- | --- | --- | --- | --- |
| Dayanıklılık | %50 | Orta şiddette sürekli hareket (mesafe) | ≈2,5–3 km tempolu yürüyüş eşdeğeri | ≈3,5–4 km eşdeğeri |
| Güç | %30 | Hareket × set | 4 hareket × 2 set | 5 hareket × 2–3 set |
| Denge | %15 | Hareket × tur | 3 hareket × 2 tur | 4 hareket × 2–3 tur |
| Çeviklik | %5 | Alıştırma × tur | 1 alıştırma × 2 tur + kısa hareketlilik | 2 alıştırma × 2 tur |

**Not [Analiz]:** Sayılar örnek kalibrasyondur: 70–80 dk eşdeğeri iş yükü, tempolu yürüyüş için 5–6 km/sa varsayımı, set başına yaklaşık 2 dk (dinlenme dahil), tur başına yaklaşık 1–1,5 dk. **Hafta 1 başlangıç gözlemi** (Bölüm 11.13) ile kalibre edilir; koşu / bisiklet gibi alternatiflerin eşdeğerliği de oradan belirlenir. Zorunlu çekirdek, kullanıcının eski “40–50 dk” genel hedefiyle uyumlu olacak şekilde seçilmiştir (toplam yükün yaklaşık üçte ikisi).

### 11.4. Çekirdek ve eklenti [Devredildi G09]

- **Zorunlu çekirdek:** Tablodaki çekirdek hedefler; “kesinlikle yapılması lazım”.
- **İsteğe bağlı eklenti:** Toplam sütunundaki fark; yapılmazsa **eksik sayılmaz**.
- Çekirdek yapılmadıysa “yapılmadı” diye kaydedilir; spor için **kaydırma / telafi yoktur** (D18).

### 11.5. Gün içi dağılım ve “akşama kadar” kuralı [Karar D17, D24, D30]

- Hedeflere **gün içinde istenen zamanda, uyku öncesine (≈23:00) kadar** ulaşılır; hafta içi gün içine yayılmış (dağınık) parçalar halinde yapılabilir. Saat veya dakika bloğu zorunlu değildir.
- **Örnek dağılım (bağlayıcı değil):** denge + çeviklik gün başında (ağırlık gerekmez); dayanıklılık gün ortasında; güç akşama doğru (ekipman başında). Isınma, dayanıklılık hedefinin ilk parçası sayılır; soğuma hafif germeden oluşur [K33].
- **Yatışa yakın çalışma [Analiz, K58]:** Gün sonu sınırı yatışa bitişik olduğundan **şiddetli hareket ve ağır güç hedefi yatıştan en az ≈1 saat önce biter;** son saate kalan hedefler hafif olanlardır (hafif hareketlilik, denge, germe). Ergenler için doğrudan kanıt ince, yetişkin verisi karışık; karar kullanıcıdadır.

### 11.6. Dayanıklılık (kapsamlı) [Devredildi G09]

Üç bileşen ayrı izlenir: **aerobik süre / mesafe**, **kas / hareket dayanıklılığı**, **toparlanma**. Hafta 1'de ağırlık aerobikte (orta şiddet: konuşulur ama şarkı söylenmez, CDC talk test; şiddetli: birkaç kelime) [K32]. Kas dayanıklılığı ve toparlanma Hafta 2'de ayrı bileşen olarak eklenir. Zorlanma 0–10 ölçeği (orta 5–6, şiddetli 7–8) kullanıcı beyanıdır [K32].

### 11.7. Güç [Devredildi G09]

**Her gün aynı yapı; içerik yüklü / hafif gün olarak değişir.** Yüklü (dambıl / bar) çalışma haftada 2–3 **ardışık olmayan** günde; aradaki günlerde aynı hedef (hareket × set) vücut ağırlığı veya hafif dambılla, teknik odaklı yapılır. Gerekçe: NSCA resmî metninde bu turda 2–3 ardışık olmayan direnç günü ve gözetim/teknik ilkeleri doğrulandı [K70]. Önceki diğer sayısal örnekler kişisel kapasiteye otomatik reçete değildir [K33]; “günlük hareket” ile “her gün aynı ağır kuvvet” aynı sayılmamalı [K24]. CDC / WHO haftada ≥3 gün kas-kemik güçlendirmeyi öneriyor [K25, K32]. **Hafta 1'de yüklü (dambıl / bar) çalışma yoktur;** güç hedefi vücut ağırlığıyla ve teknik odaklıdır (`04_SPOR_ILK_HAFTA.md`). Bu bölümdeki yüklü gün düzeni Hafta 2+ içindir.

**Hareket menüsü (program değil):**

| Kalıp | Hafif / teknik gün | Yüklü gün (dambıl) | Bar (koşullu, 11.12) |
| --- | --- | --- | --- |
| Çömelme | Vücut ağırlığı çömelme, bölünmüş çömelme | Goblet çömelme (tek dambıl ≤20 kg) | Sırt çömelmesi |
| Kalça menteşesi | Kalça köprüsü | Dambıl Romanya yerden kaldırışı | Yerden kaldırış (hafif, teknik doğrulanınca) |
| İtme | Şınav varyasyonları | Dambıl omuz / göğüs presi | Yatarak bar presi |
| Çekme | Masa altı ters kürek (uygunsa) | Tek kol dambıl kürek | — |
| Gövde | Plank, dead bug | Taşıma (tek dambıl) | — |

Dambıllar eşit olmadığı için ikili hareketlerde ayarlanabilir dambıl sabit olanın ağırlığına (5 kg) eşitlenebilirse eşit çift oluşur; daha ağır çalışma için tek dambıllı hareketler kullanılır.

### 11.8. Denge

Ekipmansız: tek ayak, tandem duruş, yumuşak yüzey, tek ayak menteşe. Denge antrenmanı gençlerde etkili görünüyor; süre ve sıklığın etkisi tutarsız, **zorluk (yoğunluk)** önemli olabilir [K35]. Zorluk zamanla artırılır (destek yüzeyini daraltma); göz kapalı çalışma yalnızca güvenli çevrede.

### 11.9. Çeviklik

Yan adım, kısa yön değiştirme, duvara top atma-yakalama, dinamik kalça / omuz hareketliliği. Çeviklik gençlerde eğitilebilir görünüyor; ancak küçük, kısa bir denemede kullanılan doz haftada 3 × 15–20 dk'ydı [K36] (bu kıyas bir **kanıt dozu** karşılaştırmasıdır, plan süresi değil). Kullanıcının %5'lik payı bundan belirgin düşüktür: bu, öncelik kararıyla tutarlıdır ve gelişim beklentisi buna göre **düşük** tutulmalıdır.

### 11.10. Hafta sonu

Ağırlık yok; güç hedefi vücut ağırlığıyla; dayanıklılık, denge, çeviklik hedefleri aynı kalır.

### 11.11. Hafta 1 rampası ve hafif gün [Devredildi G09, karar kullanıcıda]

- **Rampa:** Kullanıcı 1,5 yıl önceki 3 aylık düzenli sporun ardından yeniden başlıyor; WHO hareketsiz gençlerde küçük miktarla başlayıp kademeli artış önerir [K25]. Hafta 1 paketi (`04_SPOR_ILK_HAFTA.md`) üç basamaklıdır: Gün 1–3 kolay başlangıç (1 set × 6 rahat tekrar, 1,5–2 km yürüyüş), Gün 4–6 bir üst basamak (rahatsa; 2 set × 6–8, 2,5–3 km), Gün 7 hafif gün önerisi (kullanıcı isterse tam çekirdek). Ek yük ve eklenti yoktur; eklenti Hafta 2'den itibaren isteğe bağlıdır.
- **Hafif gün:** AAP'nin 2024 raporu aşırı antrenmanı “antrenman–toparlanma dengesizliği” olarak tanımlıyor; belirtiler arasında süregiden yorgunluk, kötü uyku ve ruh hali değişikliği var. Özetlerde haftalık dinlenme günü sayısı veya %10 kuralı **doğrulanamadı** [K34]. Bu yüzden haftada bir gün (öneri: hafta sonunun bir günü) “hafif gün” düşünülebilir: çekirdek hedefler düşük / orta şiddette, güç vücut ağırlığıyla ve teknik odaklı, eklenti yok. Bu, “hepsi aynı olacak” isteğiyle gerilim taşıyabilir (T6); **karar kullanıcıdadır.**

### 11.12. Güvenlik kuralları

1. Gözetim çoğunlukla yok olduğu için **bar yükü düşük ve kademeli** başlar, teknik doğrulanana kadar artırılmaz [K12–K13, K24].
2. Güvenlik tutacakları kullanıcıya göre sağlam; **bar inebileceği yerin altında** kurulmadan bar işi yapılmaz.
3. Gözetimsizken yatarak veya baş üstü bar hareketlerinde **tükenene kadar ve maksimal deneme yok.**
4. Bar için 50 kg civarına çıkma ihtimali, gözetimsiz bir ortam için **kademeli ilerleme** gerektirir; yük artışı küçük adımlarla olur.
5. Ağrı, baş dönmesi veya süregiden yorgunlukta o gün hedefler hafifletilir (Bölüm 3.4).
6. Bunlar yasak değil, kullanıcıya özgü güvenlik notlarıdır; karar kullanıcıdadır. AAP özetinde direnç çalışmasına başlamadan önce sağlık uzmanına danışma öneriliyor [K33]; kullanıcı düzenli ilaç kullanmadığını söyledi, bilinen bir tanı / hekim kontrolü bilgisi verilmedi.

### 11.13. Spor başlangıç gözlemi [Devredildi G10]

Kullanıcı “spor da test istiyorsan farklı ona göre yaparız” dedi. Hafta 1'e **düşük riskli, isteğe bağlı bir başlangıç gözlemi** eklenir; spor hedeflerinin içinde yapılır, çalışma tabanını tüketmez; uygulama puan veya standartla karşılaştırma yapmaz.

- Gün 1–2'de bir kez; Hafta 2–4'te tekrarlanabilir. Bu gözlemde **ölçülen süre bir kayıttır, hedef değildir.**
- **Menü (kullanıcı çıkarabilir):** aerobik: kendi hızında 1,6 km yürüme / koşma ve aldığı süre; kas dayanıklılığı: kontrollü şınav (Hafta 1 paketinde duvar şınavı) ve karın (curl-up) tekrarı, form bozulunca durarak (pakette en çok 20); esneklik: otur-uzan; denge: tek ayak denge süresi (FITNESSGRAM'da yok, Claude'un eklemesi).
- Çıktı: Bölüm 11.3'teki sayıların kalibrasyonu (örn. tempolu yürüyüş hızı).
- **Yapılmayacaklar:** 1RM veya bar ile yük testi, gözetimsiz maksimal deneme.
- Kaynak ve sınır: gençlere yönelik saha testi bataryasından (FITNESSGRAM tipi) esinlenilmiştir; o batarya sonuçları sağlık standartlarına göre puanlar, burada **puanlama kullanılmaz** [K31].

---

## 12. Makale sistemi

### 12.1. Yapı [Karar]

**5 tema × 5 konu × 2 makale = 50 makale.** Kullanıcı hangi konuyu okuyacağını kendi seçer; 50 makaleyi ilk hafta veya her gün bitirme taahhüdü yok. Bağlantı çalışmayabileceği için metin uygulama içinde de bulunur. Makaleler birbiriyle çelişmemeli. Başlangıçta konu basit anlatılır; kavramlar biliniyorsa daha teknik makalelere geçilir.

### 12.2. Tema ve konu taslağı [Devredildi G11, konu başlığı taslağı]

Önceki asistanın beş teması onaylı değildi; kullanıcının hedefleriyle kesişen bir liste önerildi (kullanıcı değiştirebilir). **Yalnızca başlıktır; 50 makalelik kaynakça henüz seçilmedi ve doğrulanmadı.**

| Tema | 5 konu |
| --- | --- |
| 1. Öğrenme ve hafıza | Aralıklı tekrar ve geri çağırma · Unutma ve zaman · Hafıza sarayı (yer temelli hafıza) · Uyku ve hafızanın pekişmesi · Çalışma belleği ve sınırları |
| 2. Algı, dikkat ve duyular | Okurken gözler ne yapar (göz hareketleri) · Seçici dikkat ve odak · Konuşmayı duymak ve anlamak (hız ve gürültü) · Çoklu görev ve beynin sınırları · Görme: odaklanma ve göz yorgunluğu (genel bilgi) |
| 3. Beden, hareket ve toparlanma | Dayanıklılık fizyolojisi · Kuvvet nasıl artar · Denge ve vücut kontrolü · Ergenlikte antrenman · Toparlanma ve uyku |
| 4. Dil ve iletişim | İkinci dil edinimi · Dinleme anlama · Telaffuz ve Amerikan İngilizcesi ses sistemi · Çeviri ve anlam · Yapay zekâ dili nasıl öğrenir |
| 5. Yapay zekâ, simülasyon ve gelecek sistemler | Makine öğrenmesi temelleri · Simülasyon ve oyun fiziği · Uzay ve kapalı yaşam sistemleri · Enerji depolama ve piller · Bilgi nasıl doğrulanır, bilimsel yöntem |

Sağlıkla ilgili konular genel bilim düzeyinde kalır; tanı koymaz.

### 12.3. Makale kartı (alanlar)

Başlık · bağlantı · metin türü (özgün / çeviri / sadeleştirilmiş anlatım) · lisans durumu · tam metin uygulama içinde var mı · zorluk (giriş / derinleşme) · tahmini okuma süresi (20–30 dk) · bulgu / kuram / sınanmamış fikir etiketi · **bilinenler / tartışmalı olanlar / bilinmeyenler** kutusu · kanıt düzeyi (meta-analiz, RCT, gözlemsel, kuram) · kaynak yılı.

### 12.4. İki makalenin rolü ve hazırlık → test günü [Devredildi G11, G24; Karar D36]

**İçerik rolü (değişmedi):** 1. makale **giriş**, 2. makale **derinleşme**. Derinleşmeye geçiş kullanıcı kararıyla (“ilkini biliyorum”), puanla değil. Zorunlu sıklık yok; **haftada en çok 2–3 isteğe bağlı makale yuvası.**

**Hazırlık → test (HT) günü (R8-2):** Kullanıcı “bazı alanlarda ilk adım hazırlanma / okuma, ikinci adım test; bu tek günde olur ve eski günün konusu atlanır, ara sıra tekrar edilebilir” dedi. Hangi alanların bu ikiliyi taşıdığı belirtilmedi; varsayılan [Varsayım V2]:
- **Makale çifti HT günü olabilir:** aynı konunun 1. makalesi **hazırlık / okuma**, 2. makalesi **test** adımıdır. Test = 1. makaleden hatırlama soruları + 2. makale için kendi sözleriyle anlatım; anahtar kuralları D02–D03; hüküm yok. İki adım **aynı gün** yapılır (iki makale yuvası kullanır).
- **HT günü isteğe bağlıdır** ve haftalık döngüde (13.7) en çok bir gündür (varsayılan: Cumartesi yuvası). **O günün yerine geçtiği konu atlanır:** kuyruğa yazılmaz, telafi edilmez; kullanıcı isterse ara sıra tekrar edilir (V3).
- Aynı mantık ders tipinde de kullanılabilir (hafıza sarayı: ders günü + deneme günü); Hafta 1'deki Gün 1–2 buna benzer (9.5).
- “Test” burada tek günlüktür ve tekrarsızdır; düzenli test yalnız İngilizce'dedir (8.8).

### 12.5. Çelişmezlik ve teori

“Çelişmeme” isteği, bilimsel anlaşmazlığı saklamak olarak okunmaz. Tarih, bağlam, varsayım veya kanıt düzeyi farklıysa açıkça yazılır; terimler tutarlı kullanılır. Kullanıcının “teori” sözcüğü (kuram, hipotez, gelecek fikri, uygulanabilir öneri) çözülmemiş olduğundan kapsam daraltılmaz; her makalede **bulgu / açıklama / sınanmamış fikir** ayrımı yapılır.

### 12.6. Dil, çeviri, lisans

Tam metin ve tam çeviri yalnızca **açık lisanslı veya izinli** kaynaklar için; diğerlerinde bağlantı + asistanın kendi sözleriyle hazırladığı Türkçe anlatım. Türkçe kaynakta da bağlantı ve metin birlikte sunulur.

### 12.7. Üretim sırası [Devredildi G11]

Hedef 25 / 50 değişmez; hazırlık partiler hâlinde yapılır (örn. her temadan 1 konu = 5 konu, 10 makale ilk parti). Bu bir hedef küçültmesi değil, iş sırasıdır. Her makale için kaynak doğrulama: birincil / ikincil kaynak, yıl, lisans, çelişki kontrolü.

---

## 13. Hafta 1, derin çalışma ve sürdürme

### 13.1. Çerçeve

- **Hafta 1 = başlangıç haritası (D29):** İngilizce, hafıza, dinleme / kombinasyon, odak, network ve spor için **nerede olduğumuzu öğrenmek**; gerçek kapasiteyi ve yöntemlerin uygulanabilirliğini görmek. İlk 4 gün yöntem ve kaynak deneyimi, son 3 gün kapsamlı kayıt / testler (D13). **Hafta 1 hiçbir haftaya benzemez (D34):** “test”in tüm alanlarda bulunduğu tek haftadır; Hafta 1'den sonra test yalnız İngilizce'dedir (8.8), diğer alanlar kesintisiz pratiktir (4.4).
- **Hafta 2 ve sonrası = derin çalışma** (Bölüm 13.7); **üç aylık hedef: durmamak** (D32, Bölüm 13.9).
- Plan **çıktı olarak yazılmıştır (D24)**: her gün hedeflere uyku öncesine (≈23:00) kadar ulaşmak yeterlidir (D30); sıra ve saat kullanıcıya kalır. Çalışma boyutu günde ≈2 saatlik taban (analiz göstergesi); test günleri 4 saate kadar esner (D15). Spor ayrı (Bölüm 11).
- **Kaynak ve kayıt durumu:** İlk dört gün iyi dış kaynak veya hazırlanmış özel materyalle yürür (R9). Otomatik test kayıt yazılımı henüz yok; elle yapılanlar ayrı etiketlenir. Eğitim içeriğinin hazır olması bütün kayıt ürününün hazır olduğu anlamına gelmez.

### 13.2. Gün gün hedefler (Hafta 1) [Devredildi G03, G10, G14, G16; Analiz]

| Gün | Çalışma hedefleri | Spor hedefleri (rampa) | Kayıt biçimi / alarm |
| --- | --- | --- | --- |
| **0** | Telefon ayarları: pil “Kısıtlama yok”, otomatik başlatma, Saat alarmı testi; mikrofon izni; **USB-C kulaklık / mikrofon kurulumu** (Bölüm 5.2, 5.9; pakette `calisma/01_GUN_0_HAZIRLIK.md`) | — | Gün 0 doğrulama sonuçları |
| **1** | **Başlangıç anlatım kartları** (alana ilk girişte; görev sayılmaz, 4.4.3). **Eğitim öncesi başlangıç kaydı** (dersten önce): 1 kısa serbest yazı, 1 kısa sesli anlatım, 1 okuma + satır sayımı + kendi sözleriyle anlatım (kılavuzsuz). USA Learns: hesap + 1 video + 2 etkinlik + mikrofon testi. Hafıza sarayı: 8 duraklı güzergâh (en az 6) + 6 öğelik eğitim listesi. | Kolay başlangıç çekirdeği + isteğe bağlı **başlangıç gözlemi** (1,6 km yürüyüş, tek ayak denge, otur-uzan) | Elle / köprü kaydı |
| **2** | VOA Ders 1 + 3 ifade + tanışma kaydı. H1: 7 nesnelik sıralı yönerge (saray; eğitim). C0 tek görev tabanları (dinle, yaz, konuş, yerinde hareket). Dünkü güzergâhı hatırlama. İsteğe bağlı: ilk İngilizce maddeler. | Kolay başlangıç çekirdeği + isteğe bağlı kas dayanıklılığı gözlemi (duvar şınavı, karın) | Elle / köprü kaydı |
| **3** | Ana kaynak notu (üç evet/hayır sorusu, puansız) + bir etkinlik grubu. B1 tanışma (6 öğelik dikte, eğitim). G3 makalesi + **parmak/cetvel kılavuz denemesi** + kendi sözleriyle anlatım. H5 tanışma. **H6 1. dinleme** (ertesi gün için Saat alarmı). | Kolay başlangıç çekirdeği | Elle / köprü kaydı; alarm: H6 kontrol 1 |
| **4** | **H6 kontrol 1 + 2. dinleme.** İngilizce etkinlik grubu + 3 istek cümlesi; Gün 1 maddeleri kuyruğa alındıysa ilk tekrar (Gün 1 + 3). Kesinti sırasında yazma provası. Kayıt ve anahtar provası (P1, P2). Tekrar günü notu. **Test maddeleri eğitimden ayrı kilitli.** | Bir üst basamak (rahatsa) | Elle / köprü kaydı |
| **5 (Test 1)** | Yazılı İngilizce profili: serbest yazı (W1), okuma + 6 soru + anlatım (R1), çeviri (T1), isteğe bağlı kısa dil kullanımı (G1). **H2 bilgi A** (görsel kip; kontroller 5 dk · 30 dk · 2 sa; ertesi gün Gün 6, bir hafta Gün 12). **H4** çok kısa gecikme (3 deneme, ses). | Bir üst basamak | Elle / köprü kaydı; alarm: A için 5 dk, 30 dk, 2 sa |
| **6 (Test 2)** | A'nın ertesi gün kontrolü. Sesli okuma (S1) ve serbest konuşma / network başlangıç kaydı (S2). Dikte B1 (3 İngilizce hız + Türkçe kontrol; 6 öğe/dosya), İngilizce dinleme (yavaş / normal / hızlı), Türkçe dinleme kontrolü. **H2 bilgi B** (iki bilgi; kontroller 5 dk · 30 dk · 2 sa; ertesi gün Gün 7, bir hafta Gün 13 isteğe bağlı). | Bir üst basamak | Elle / köprü kaydı; alarm: B için 5 dk, 30 dk, 2 sa |
| **7 (Test 3)** | B'nin ertesi gün kontrolü. **H6 kontrol 2, 3. dinleme, kontrol 3.** Okuma sırası **A–B–B–A** (dört özgün metin, tek ortam). **H5** ders başı iki deneme (A sonra B; dengelenmedi). Kombinasyon haritası: C0 tabanları + C1 + C2 (+ C3 tanışma notu). Gün sonu paketi (ZIP, yedek). | **Hafif gün önerisi** (kullanıcı isterse tam çekirdek) | Elle / köprü kaydı |
| **8** | **H6 kontrol 4** (açmadan), sonra H6 anahtarı. Taşan test varsa. Hafta paketi: ZIP + USB-C ile Windows'a yedek (Bölüm 6.9). Hafta 1 haritasının dış değerlendiriciye verilmesi; Hafta 2 hedef kurulumu başlar. | Kartta tanımlı değil (04 kartı Gün 1–7'yi kapsar) | Son dışa aktarım tarihi |
| **12** | **A bilgisinin 1 haftalık kontrolü** (Gün 5 + 7). | Çekirdek ± eklenti | Planlanan / gerçek gecikme |
| **13** | B bilgilerinin 1 haftalık kontrolü (isteğe bağlı). | Çekirdek ± eklenti | Planlanan / gerçek gecikme |

Tablo `calisma/02_ILK_DORT_GUN.md` ve `test_gununde_ac/05_GUN5–7_GOREVLER.md` dosyalarıyla eşlenmiştir; bir çelişki görürsen paketteki dosya güncel görev metnidir. Paket dosyalarındaki `G05`, `G06`, `G07` etiketleri **Gün**dür; bu raporun G01–G26 karar kodlarıyla karıştırılmamalıdır.

### 13.3. Test günü yükü

Test günleri **yalnız Hafta 1'e** (ve kullanıcı isterse tek yeniden haritaya, 13.8) aittir (D34). Gün 5–7'de toplam çalışma 2,5–3 saate çıkabilir; test günü üst sınırı kullanıcının kendi beyanı olan 4 saattir. Spor aynı kalır, **yorgunluk ve uyku notları** tutulur. İsteğe bağlı spor eklentisi bu günlerde doğal olarak atlanabilir. Her test gününden sonra ZIP dışa aktarımı yapılır (Bölüm 6.9). Test günlerinde şiddetli hareket ve ağır güç hedefi yatıştan ≥≈1 saat önce biter (Bölüm 3.5).

### 13.4. Hafta 2 hedef kurulumu: karar girdileri (puan eşiği değil)

| Karar | Girdi | Not |
| --- | --- | --- |
| Çalışma boyutu (taban) | Gün 1–7 gerçekleşen çalışma süresi (otomatik gözlem) dağılımı (medyan / aralık) | Tanımlayıcı; “başarı” değil; kullanıcıya dakika görevi olarak sunulmaz |
| Birincil İngilizce kaynak | Kullanıcının sürdürülebilirlik notu | G07 |
| Sürdürülecek hafıza, dinleme ve kombinasyon görevleri (H1–H6, B1–B2, C0–C6) | Kullanıcı tercihi + gecikme aralığı verisi + seviye bayrakları | Hangi görev ne kadar uygulanabilirdi |
| Birikim eşiği kalibrasyonu | Hafta 1'de biriken / yarım kalan hedefler | G02'nin 1,5× ve 2 gün değerleri |
| Spor eklentisi, hafif gün, hedef sayıları | Başlangıç gözlemi, zorlanma, yorgunluk, uyku notları | G09, G16 |
| Derin çalışma döngüsü ve küme sayıları | Hafta 1 kapasitesi + kullanıcı notları | G18 |
| Makale yuvaları | Kullanıcı isteği | G11 |
| İngilizce tekrar kuyruğu (yeni madde sayısı N) | Hafta 1 kapasitesi, tekrar başına gözlenen çaba, kullanıcı notu | G23 (başlangıç N = 3–5) |

### 13.5. Hafta 1'den sonra beklenmeyenler

Kalıcı İngilizce kazanımı, uzun vadeli hafıza değişimi, çoklu görevin günlük hayata aktarımı veya göz / kulak durumu hakkında Hafta 1'den hüküm çıkarılmaz (Bölüm 7.8). Hafta 1'den sonra kontrollü tekrar ölçüm varsayılan değildir (D34): uzun vadeli izleme İngilizce tekrar kaydı, pratik kayıtları ve haftalık özetle **tanımlayıcı** yapılır; isteğe bağlı yeniden harita Bölüm 13.8'dedir.

### 13.6. Köprü protokolü: uygulamasız veya hibrit başlangıç [Analiz]

Kullanıcı bu hafta başlamaya karar verdi (D28); uygulama henüz yok. Uygulama hazır olana kadar (veya Gün 1–4 için) kayıt biçimi baştan doğru kurulmalıdır ki veri **sonradan aynı ZIP yapısına dönüştürülebilsin:**

| Konu | Öneri |
| --- | --- |
| Araçlar | Telefonun yerleşik ses kaydedicisi (USB-C kulaklık veya telefon mikrofonu), bir not / metin dosyası (telefonda not uygulaması, Windows'ta Not Defteri veya tablo), kâğıt-kalem yedek, telefon Saat alarmı |
| Klasör ve adlandırma | `HAFTA1\G05\` altında ses: `G05_T1_S03_D02_20261030-1815.m4a` (gün, görev, soru, deneme, tarih-saat; buradaki `G` **Gün**dür, karar kodu değil); yazılı yanıtlar `yanitlar.md` içinde **satır başına bir deneme** |
| Günlük kayıt alanları | Gün, görev, soru, deneme no, saat, yanıt, anahtar durumu (kapalı / elle / 3. gönderim), yardım kategorisi (A0–A4), kulaklık / mikrofon, ses seviyesi, notlar, uyku / yorgunluk |
| Cevap anahtarı | Ayrı bir dosyada / sayfada **kapalı** tutulur; açıldığında saat ve “elle / 3. gönderim” yazılır |
| Gecikmeli kontroller | Telefon Saat alarmı; gerçek saat elle yazılır (planlanan / gerçek) |
| Haftalık paket | Klasör sıkıştırılır (ZIP), USB-C ile Windows'a kopyalanır, bir kopya daha alınır (Bölüm 6.9); ileride uygulamaya içe aktarılması tasarım hedefidir |
| İngilizce tekrar (Hafta 2+) | Uygulama yoksa **elle tablo**: madde, öğrenme günü, önceki olaydan 3 / 10 / 20 / 50 gün bekleme ve nominal 3 / 13 / 33 / 83. günler, gerçek gün, yanıt, yardım kategorisi; her gün “bugün vadesi gelenler” listesi çıkarılır (Bölüm 8.8); pakette formüllü `kayitlar/INGILIZCE_TEKRAR_TAKVIMI.xlsx` vardır (yalnız LibreOffice ile denendi) |
| **Sınırlar** | “Gönderim sayısı”, “ekranda kalma”, “gerçek gecikme” elle tutulur; kayıt kalitesi uygulamadan düşüktür. Tam otomatik akış bu teslimde yoktur. Elle veri **“elle/köprü kaydı”** olarak etiketlenir; otomatik ölçülmemiş olaylar otomatikmiş gibi yazılmaz. |
| Hazırlık | Hafta 1 materyal paketi (v11) hazır. Türkçe ve İngilizce nöral sesler üretildi ve otomatik tanıma ile geri okundu; insan dinleme kontrolü ve cihaz doğrulaması yoktur; pakette `EKSIKLER.md` esas alınır |

### 13.7. Hafta 2 ve sonrası: derin çalışma mimarisi [Devredildi G18; Analiz]

Kullanıcı Hafta 2+ için “derin çalışma” hedefledi ve önerilerimi kabul etti. Öneri, **her gün üç katmandır;** hepsi çıktı birimiyle yazılır (dakika değil):

1. **Sabit çekirdek (her gün):** 1 dinleme kümesi (B1 veya B2; hız ve dil rotasyonlu) + spor çekirdeği (D16). Dil önceliği (U7) ve D26 gereği dinleme her gün vardır.
2. **Günün derin odağı (haftalık döngü):** O gün **tek bir alanda** daha fazla çıktı hedeflenir.
3. **Bakım (küçük):** Bugün vadesi gelen **İngilizce tekrarlar (3-10-20-50, Bölüm 8.8)**, bekleyen gecikmeli hatırlama pratikleri ve isteğe bağlı kart tekrarı. Makale yuvası isteğe bağlı (haftada ≤2–3; HT günü en çok bir gün, 12.4).

**Haftalık döngü (öneri):**

| Gün | Derin odak | Örnek çıktı hedefi (kalibre edilecek) |
| --- | --- | --- |
| Pazartesi | Dinleme: algılama + anlama (B1–B2), hız artışı | 3 dinleme kümesi (1 algılama + 2 anlama) |
| Salı | Kombinasyon (o fazın C seviyesi) | 2 kombinasyon görevi (tek görev tabanı + birlikte) |
| Çarşamba | Network konuşma (senaryo kartları, ses kaydı) | 2 senaryo kaydı + 1 yazılı takip mesajı |
| Perşembe | Hafıza + odak | 1 sıralı yönerge + 1 tohum + 1 satır takibi metni |
| Cuma | Yazma + çeviri (kendi fikrini yazma, network mesajı) | 1 fikir yazısı + 1 mesaj + 1 çeviri kümesi |
| Cumartesi | Karma kombinasyon + makale (isteğe bağlı); **isteğe bağlı HT günü** (12.4: yerine geçilen konu atlanır) | 1 karma kombinasyon + 1 makale (veya HT günü: 2 makale) |
| Pazar | Haftalık tanımlayıcı özet, yedek, **hafif gün** (spor hafif) | Özet okuma + ZIP yedeği |

**Tip eşlemesi (4.4) [Analiz]:** Pazartesi Tip 5 (dinleme antrenmanı); Salı Tip 5 (C0–C3) ve Tip 2 (C4–C6); Çarşamba Tip 2 ve Tip 1 (network); Perşembe Tip 4 ve Tip 5; Cuma Tip 1; Cumartesi Tip 2 ve Tip 3; Pazar özet ve yedek. Her gün İngilizce tekrar kuyruğu (Tip 1) bakım katmanında yer alır.

**Dayanak [Analiz + K8, K29]:** Haftalık dönüş, konuların aralıklı ve karışık tekrarını sağlar; aralıklı pratik ve geri çağırma en iyi desteklenen yöntemlerdendir (maddeye özgü; ergen-özel kanıt az). Spor ayrıdır (D16–D18).

**Fazlar (öneri):**

| Faz | Hafta | İçerik |
| --- | --- | --- |
| **Faz 1: temel** | 2–5 | Yavaş / normal hız; C0–C3 (Türkçe → İngilizce); network senaryo 1–3 (kendini tanıt, ilgi alanı, soru sor / tekrar iste) |
| **Faz 2: yoğunlaştırma** | 6–9 | Normal / hızlı hız; C4–C5 (kayıtlı replikler + gerçek-hayat kesintili yazma, 10.6); senaryo 4–6 (bilgi isteme, teşekkür / takip mesajı, kısa sunum dinleme) |
| **Faz 3: araçsız anlama** | 10–13 | Hızlı hız; C6; video / podcast gibi gerçek içeriklerde araçsız anlama (A4 bayrağı izlenir); gerçek etkileşim |

Faz geçişi **kullanıcı bayrağıyla** olur (“bu faz rahat geliyor”, 10.4 ilke 3); yeniden harita varsayılan değildir, isteğe bağlıdır (Bölüm 13.8).

### 13.8. Yeniden harita: varsayılan kapalı, isteğe bağlı [Devredildi G19, R8-1 ile revize; Analiz]

**Değişiklik:** v8'de “Hafta 1, 5, 9, 13 sonu yeniden harita” önerilmişti ve kabul edilmişti (R7-1). R8-1'de kullanıcı Hafta 1'den sonra “test” kavramının muhtemelen yalnız İngilizce'de olacağını söyledi. Daha yeni ve daha özgül olan bu ifade önceliklidir; bu yüzden yeniden harita **varsayılan olarak kapatıldı** (T19, V5).

**Yerine ne var:**
1. **İngilizce tekrar kaydı** (8.8): tek düzenli test alanı; gün gün, madde bazlı.
2. **Pratik kayıtları** (4.4.2): tip başına rapor biçimi.
3. **Haftalık tanımlayıcı özet** (13.9): yapılan / atlanan hedef sayısı, yorgunluk ve uyku notları.

**İsteğe bağlı yeniden harita:** Kullanıcı isterse (örn. Hafta 13 sonunda veya herhangi bir zamanda) Hafta 1'deki ölçüm ailesinin **alternatif formları** tekrarlanır [K50]: İngilizce profil, dinleme (hız değişkenli + Türkçe kontrol), kombinasyon haritası, gecikmeli hatırlama, satır takibi, spor gözlemi, network kaydı. Test günü kuralı geçerli (≤4 sa / gün, 3 gün). Çıktı: eski ve yeni kayıtlar **yan yana**, tanımlayıcı; yorum dış değerlendiricinin. Önceki öneri dört haftalık aralıktı (Hafta 5, 9, 13) çünkü çok sık test uygulama etkisi yaratabilir [K50]; yapılırsa bu aralık hâlâ geçerli bir seçenektir.

**Bedeli (RK24, Bölüm 7.9):** Kontrollü yeniden ölçüm olmadığında “başladığım yerden nereye geldim” sorusu yalnız tanımlayıcı cevaplanır; beceri değişimi hakkında hüküm çıkmaz. Bu, “durmamak” hedefiyle (D32) uyumludur ama ilerleme kanıtını zayıflatır; karar kullanıcıdadır.

### 13.9. Sürdürme tasarımı: durmamak [Karar D32; mekanizma Devredildi G20]

Kullanıcının üç aylık hedefi **“böyle durmamak”**; önceki düzeni “iyi gitti, yeterli hissettim” diye bırakmıştı. Skill temelli “yeterlilik” tanımı şimdilik verilmedi ve sorulmaz.

**Dayanak [Kanıt]:** Alışkanlık oluşum süresi kişiden kişiye çok değişken (bir çalışmada 18–254 gün, ortanca 66 gün; küçük örnek, tekrarlanmamış, genel kural değil) [K59]. “Eğer–o zaman” planlarının hedefe ulaşmayı artırdığı meta-analizde orta-büyük etkiyle bildirilmiş (d≈0,65; ikincil kaynaklardan) [K60]. Üç aylık ufuk makul, garanti değil.

**Mekanizmalar [Analiz]:**

| Mekanizma | Açıklama |
| --- | --- |
| **Asgari gün** | En kötü günde bile yapılabilen çok küçük set: 1 dinleme kümesi + spor “hafif gün” hâli. “Sıfır gün” yerine asgari gün sayılır. |
| **Eğer–o zaman planları** | Kullanıcı başlangıçta kendi cümleleriyle yazar. Örnekler: “Eğer ‘yeterli hissediyorum’ dersem, kendi yazdığım 3 aylık taahhüdümü ve son haftalık özeti okuyup bir sonraki haftalık özete kadar sürdürürüm.” “Eğer bir günü kaçırırsam, ertesi gün asgari günle başlarım.” “Eğer 22:00'de çekirdek bitmediyse asgari güne düşerim.” |
| **Planlı mola** | En çok 2–3 gün; dönüş günü mola başlamadan yazılı. **Açık uçlu mola yok** (önceki molada “doğru anı bekledik” yaşandı). |
| **İngilizce tekrar kaydı ve isteğe bağlı yeniden harita** | Kayda dayalı ayna: tekrar kaydı her zaman; kontrollü yeniden harita yalnız kullanıcı isterse (Bölüm 13.8). |
| **Haftalık tanımlayıcı özet** | Yapılan / atlanan hedef sayısı, yorgunluk ve uyku notları. **Puan yok.** |
| **“Yeterli” bayrağı** | Kullanıcı isterse “yeterli hissediyorum” işaretler; uygulama engellemez, yalnızca kullanıcının kendi taahhüt cümlesini ve son özeti gösterir. |

**Sınır:** Bırakma kararı kullanıcınındır. Sistem, kararın bilinçli verilmesi için bilgi sunar; zorlamaz.

---

## 14. Risk kaydı

Olasılık ve etki **nitel** tahmindir (düşük / orta / yüksek); ölçülmüş değil.

| ID | Risk | Olasılık | Etki | Erken gösterge | Önlem |
| --- | --- | --- | --- | --- | --- |
| RK01 | **Aşırı yük:** günlük 2–4 sa çalışma + 70–80 dk eşdeğeri spor + okul / TYT uykuyu kısar | Orta–yüksek | Yüksek | Uyku <7 sa, yorgunluk ≥7/10, kötü uyku, ruh hali düşüşü | Önce eklenti kesilir; uyku eşiği; hafif gün (3.4, 11.11). Okul / TYT saatleri bilinmiyor, yük **gözlemle** öğrenilir |
| RK02 | **Gözetimsiz bar çalışmasında yaralanma** | Orta | Yüksek | Yük artışının teknikten hızlı olması | Kademeli yük, tutacak kurulumu, tükenene kadar yok (11.12) |
| RK03 | **Sağlık yakınmalarından yanlış çıkarım** (işitme / görme / unutkanlık) | Orta | Yüksek | “İşitme kaybı var”, “göz zayıf” gibi cümleler | Tanı yasağı, yorum sözlüğü, bilgi notları (7.7, 10.5) |
| RK04 | **Ses kaydı kesintisi** (HyperOS / tarayıcı dondurması) | Yüksek | Orta | Kayıtta boşluk, `recording_interrupted` olayı | Ön plan, kısa kayıt, parça parça yazma, olay kaydı, Gün 0 (5.4, 5.9) |
| RK05 | **Gecikmeli kontrolün kaçırılması / alarm sapması** | Orta–yüksek | Yüksek (ölçüm kaybı) | Gerçek gecikme ≫ planlanan | Saat alarmı birincil, gerçek gecikme kaydı (G04) |
| RK06 | **Tarayıcı verisinin silinmesi veya telefon kaybı** | Düşük–orta | Yüksek | `persist()` reddi, depolama dolu uyarısı | Kalıcılık isteği, katmanlı yedek, her test gününden sonra dışa aktarım (6.9) |
| RK07 | **Eğitim – test sızıntısı** | Orta | Orta | Test maddesinin eğitimde görülmesi | Ayrı havuz, Gün 4'te kilitleme (7.3, 13.2) |
| RK08 | **Kapsam aşırılığı** (dört alan + kombinasyon + spor + 50 makale) | Yüksek | Yüksek | Hafta 1'de birikim, yarım kalan hedefler | Zorunlu / isteğe bağlı ayrımı, bölme seçeneği, derin çalışma döngüsü, partiler, asgari gün (13.7, 13.9) |
| RK09 | **Aşırı vaat** (hafıza sarayı genellemesi, çoklu görev transferi) | Orta | Orta | “Gelişti” dili | Yorum sözlüğü, kanıt tavanı (9.2) |
| RK10 | **Gizlilik:** ham ses + sağlık beyanının üçüncü taraf yapay zekâya yüklenmesi; gerçek bir kişinin (partner ya da kesinti sırasında konuşan biri) sesinin izinsiz kaydı | Orta | Orta–yüksek | Paketin kontrolsüz paylaşılması | Ses dahil / hariç seçimi, saklama ayarı kontrolü, şifreli dış kopya, kişi izni, ortam kaydı yok (6.8, 6.9, 10.4, 10.6, G08) |
| RK11 | **Dış kaynağın çalışmaması / değişmesi** | Orta | Düşük–orta | Mikrofon etkinliği çalışmıyor | Gün 1'de deneme, iki kaynak (8.3) |
| RK12 | **Dinleme sonucunun İngilizce düzeyi olarak okunması** | Yüksek | Orta | Düşük dinleme + yüksek yazma gibi tutarsızlık | Hız değişkeni, Türkçe kontrol (7.2, 10.3) |
| RK13 | **Bluetooth kulaklıkla düşük kaliteli kayıt** | Düşük (kablolu kulaklık) | Orta | Kayıtta boğuk / düşük bant genişliği | Kayıtta USB-C kablolu kulaklık veya telefon mikrofonu (5.4) |
| RK14 | **Birikim kilitlenmesi** (kaydırma yok kuralı) | Orta | Orta | Kuyruk planlı yükü >1,5× taban | “Bölmek ister misin?” (G02); asgari gün |
| RK15 | **Kural çelişkisi:** “kaydırma yok” ↔ saate bağlı kontrol | Orta | Orta | Kaçırılan birkaç saatlik kontrol | G04 |
| RK16 | **Hafta 1 verisinin aşırı genellenmesi** | Orta | Orta | “Seviyem şu” cümleleri | 7.8; tanımlayıcı dil |
| RK17 | **Windows bilgisayara sessiz bağımlılık** (transkripsiyon vb.) | Düşük–orta | Orta | Telefonun tek başına işlevsiz kalması | Telefon temel işlevleri bağımsız (5.5) |
| RK18 | **İçerik hazırken kayıt uygulamasını da hazır sanma** | Yüksek | Orta | Elle zamanların otomatikmiş gibi yazılması | Materyal/ürün ayrımı, elle kayıt etiketi, insan dinleme kontrolü ve cihaz eksiklerinin açık listesi (EKSIKLER.md) |
| RK19 | **Erken yeterlilik hissiyle bırakma:** kullanıcı önceki düzeni “iyi gitti, yeterli hissettim” diye bıraktı | Orta–yüksek | Yüksek | İlk haftalarda “yeterli” cümleleri, atlanan günler | Asgari gün, eğer–o zaman planları, planlı mola, İngilizce tekrar kaydı, haftalık tanımlayıcı özet (13.9) |
| RK20 | **Kombinasyon görevinde düşme / yaralanma** (ergenlerde yürürken çift görev maliyeti ölçülmüş [K54]) | Düşük–orta | Orta | Hareketin dikkati aşması | M yalnız C1 ve C4-M; önce yerinde, sonra güvenli kapalı alanda yürüme; ağırlık, merdiven, trafik yok; yazarken ayakta yürüme yok (10.4) |
| RK21 | **AI / çeviri aracına bağımlılık** (hedef AI'sız anlamak) | Orta | Orta | A4 oranının azalmaması | A4 bayrağı, “araçsız anlama” gözlemi (6.2, 8.2, Faz 3) |
| RK22 | **Kombinasyon yükü ve motivasyon kaybı:** C5–C6 yüksek bilişsel yük, hata hissi ve sinirlenme | Orta | Orta | Seviyede takılma, atlanan kombinasyon günleri | Önce tek görev tabanı, Türkçe önce, seviye geri dönüşü, “hata” sayılmaması, kısa küme (10.4) |
| RK23 | **Gün sonu sınırı yatışa bitişik:** şiddetli hareket veya yoğun ekran çalışması uykuyu geciktirir | Orta | Orta | Yatış saatinin kayması, uyku <7 sa | Şiddetli çalışmayı yatıştan ≥≈1 sa önce bitirme, son saatte hafif hedefler (3.5, 11.5) [K58] |
| RK24 | **Ölçüm kaybı:** Hafta 1'den sonra kontrollü yeniden ölçüm yok (D34); pratik kayıtları “gelişti / geriledi” diye okunur | Yüksek | Orta | “Gelişti” cümleleri, zorluğu denk olmayan görevlerin karşılaştırılması | Tanımlayıcı dil (7.7, 7.9), isteğe bağlı yeniden harita (13.8), İngilizce tekrar kaydı |
| RK25 | **Aralıkları mutlak gün sanma ve tekrar yükünü küçümseme** | Orta | Orta | Eski takvim, yığılan tekrarlar | R9 düzeltmesi; 3/13/33/83 nominal gün; 4N kararlı yük; N=3 başlangıç önerisi |
| RK26 | **Baştan anlatım yükü ve yanlış tip sınıflaması:** her alan sıfırdan anlatılır; “galiba / muhtemelen” ifadeleri sınıflamayı belirsiz bırakır | Orta | Orta | Hafta 1'de anlatımın görevleri şişirmesi; alanın yanlış tipe konması | Tek seferlik kısa kart, görev sayılmaz; sınıflama etiketi ve itiraz tetikleyicisi (4.4, G22) |
| RK27 | **Check-up belirsizliği:** tarih kesin değil; sonuç gelmeden işitme / görme değişkenliği yorumlanır ya da başlama sonuca bağlanır | Orta | Orta | “Muayeneye gidince başlarım” ya da “işitme şöyle” cümleleri | Sonuç beklenmeden başlama; değişkenlik “açıklanmamış” olarak yazılır; sonuç bağlam notu (10.5, D38) |
| RK28 | **Sentetik sesin doğrulanmamış kalitesi:** sesler otomatik tanıma ile kontrol edildi, bir insan dinlemedi; anlaşılmayan bir kayıt içerik zorluğu ya da işitme sorunu sanılabilir | Orta | Orta | “Anlamadım” kayıtlarının belirli dosyalarda yığılması | “Ses anlaşılmadı” ayrı işaretlenir, içeriği anlamamakla karıştırılmaz; dosya adı kaydedilir; çok kısa tekil öğelerde (sayı, sıra sözcüğü) otomatik tanımanın güvenilmez olduğu bilinir (EKSIKLER.md, 06 ses notu) |
| RK29 | **Hafta 1 paketinde ayrıştırılamayan karışıklıklar:** dikte dosyalarında hız, sıra ve öğe birlikte değişir; H5 sırası sabittir; okuma tek ortamdadır; H6 kontrolleri aynı içeriği tekrar sınar; eğitim ve test aynı haftadadır | Yüksek | Orta | Fark görüldüğünde tek bir nedene bağlanması | Paket dosyalarında her görev için sınır yazılıdır; yorum yalnız tanımlayıcıdır (7.7, 7.8); Hafta 2+ pratiğinde sıra ve ortam yayılır |

---

## 15. Devredilen kararlar ve yeniden gözden geçirme koşulları

Kullanıcı bu kalemleri “önerine göre cevapla / sen karar ver / önerilerini kabul ediyorum” diyerek bıraktı. İçerik Claude'un önerisidir; aşağıdaki **tetikleyici** gerçekleşince veya kullanıcı itiraz edince yeniden ele alınır.

| Kod | Konu | Varsayılan karar | Yeniden gözden geçirme tetikleyicisi |
| --- | --- | --- | --- |
| G01 | Koruyucu kurallar | Önce eklenti kesilir; art arda iki gece <7 sa uyku → ertesi gün eklenti yok | Hafta 1 uyku verisi; kullanıcı itirazı |
| G02 | Birikim eşiği | Planlı yük ≈1,5× günlük taban **veya** aynı görev art arda 2 gün yarım → “bölmek ister misin?”; otomatik değişiklik yok | Hafta 1 birikim verisi |
| G03 | Hafta 1 yoğunluğu | Test penceresi Gün 5–7; taşan test Gün 8; test günü ≤4 sa | Gerçek test süreleri |
| G04 | Zaman kilitli kontroller | Kategori olarak planlanır; yeniden planlanmaz, gerçek gecikmeyle yapılır, “planlanan / gerçek” yazılır; **Saat alarmı birincil**, uygulama bildirimi ek | Gün 0 alarm sapması |
| G05 | Hata açıklaması ve eşleştirme | Hata nedeni yalnız dış yorum katmanında; kısa maddelerde arka plan eşleştirme yok | Kullanıcı itirazı |
| G06 | Anahtar okuma kaydı | Otomatik ekranda kalma süresi + isteğe bağlı “okudum / anlamadım” | Kullanıcı itirazı |
| G07 | Dış İngilizce kaynak | USA Learns + VOA L1 denemesi; VOA yayınları dinleme merdiveni için aday; Anki, EF SET, VST isteğe bağlı; Duolingo yok | Hafta 1 sonucu; kaynak çalışmazsa |
| G08 | ZIP ve kişisel veri | Her paket öncesi “ses dahil / hariç”; varsayılan dahil | Kullanıcı itirazı |
| G09 | Spor ayrıntıları | Çekirdek / eklenti ayrımı; gün içi dağılım; güç yüklü / hafif gün; Hafta 1 rampası; haftalık hafif gün | Zorlanma / yorgunluk / uyku verisi; “hepsi aynı” itirazı |
| G10 | Spor başlangıç gözlemi | Düşük riskli, isteğe bağlı, Gün 1–2 | Kullanıcı itirazı |
| G11 | Makale sistemi | Alternatif B taslak temalar; giriş + derinleşme (içerik rolü); isteğe bağlı HT günü (G24); haftada ≤2–3 yuva; partiler hâlinde hazırlık; lisans kuralları | Kullanıcı tema değişikliği |
| G12 | Platform | PWA ile başla; Gün 0 sonucuna göre karar | Gün 0 testleri (5.9) |
| G13 | Uyku / yorgunluk beyanı | İsteğe bağlı, kısa gecelik not | Kullanıcı itirazı |
| G14 | Türkçe kontrol görevi | Hafıza ve dinleme görevlerinin bir kısmı Türkçe | Kullanıcı itirazı |
| G15 | Yedekleme ve aktarım | Katmanlı: cihaz içi + haftalık elle USB-C aktarım (Windows 11) + ayda bir ikinci ortam / şifreli dış kopya; isteğe bağlı Syncthing; her test gününden sonra dışa aktarım (6.9) | İlk yedek denemesi; kullanıcı itirazı; Syncthing doğrulaması |
| G16 | Hedef kartlarının sayısal değerleri | 11.3 tablosundaki km / set / tur örnekleri | Hafta 1 başlangıç gözlemi; Hafta 2 |
| G17 | **Dinleme ve kombinasyon merdiveni** | B1–B2 + **C0–C6** (kanal merdiveni), aşamalı hareket, güvenlik kuralları (10.4) | Kullanıcı itirazı; gerçek partner çıkarsa (D39) |
| G18 | **Derin çalışma mimarisi** | Her gün sabit dinleme çekirdeği + günün derin odağı (haftalık döngü) + küçük bakım; fazlar (13.7) | Hafta 1 kapasitesi; kullanıcı itirazı |
| G19 | **Yeniden harita** (R8-1 ile revize) | **Varsayılan kapalı;** kullanıcı isterse (öneri: Hafta 5, 9, 13) alternatif formlarla, tanımlayıcı (13.8) | Kullanıcı isterse; Hafta 13 sonu; ilerleme kanıtı ihtiyacı |
| G20 | **Sürdürme mekanizmaları** | Asgari gün, eğer–o zaman planları, planlı mola, haftalık tanımlayıcı özet, “yeterli” bayrağı (13.9) | Kullanıcı itirazı; ilk iki hafta uygulanabilirliği |
| G21 | **Kaynak ve özel üretim** | R9 ile araştırma ve gerekli özel içerik başlatıldı. Materyal ve nöral sentetik sesler hazır (insan dinleme kontrolü yok); otomatik kayıt yazılımı henüz yok | Cihaz doğrulaması ve sonraki kapsam talimatı |
| G22 | **Alan tipolojisi ve baştan anlatım** (D37) | 5 tip (4.4.2); tek seferlik kısa başlangıç kartı; tip başına rapor biçimi | Kullanıcı sınıflamaya itiraz ederse; Hafta 1 anlatım yükü gözlemi |
| G23 | **İngilizce tekrar mekaniği** | Önceki olaydan 3/10/20/50 gün; nominal 3/13/33/83. Sonraki aralığı gerçek tekrardan başlatma tasarım tercihi; N=3 önerisi | Kullanıcı itirazı; kapasite/kuyruk gözlemi |
| G24 | **Hazırlık → test (HT) günü** (D36) | Makale çifti: 1. makale hazırlık, 2. makale test, aynı gün; yerine geçilen konu atlanır; haftada en çok bir gün (12.4) | Kullanıcı alanı veya birimi düzeltirse (V2, V3) |
| G25 | **Gerçek-hayat kesintili yazma** (D39) | Partnersiz; kullanıcı beyanı + yazı; başkasının sesi kaydedilmez; kayıtlı kesinti ve izinli kişi isteğe bağlı (10.6) | Kullanıcı itirazı; gerçek partner çıkarsa |
| G26 | **Sağlık kontrolü sonuçlarının işlenmesi** (D38) | Tarih sorulmaz; sonuç gelirse bağlam notu; başlama sonucu beklemez; “muayeneye götürülecek not” (10.5) | Sonuç geldiğinde; kullanıcı itirazı |

---

## 16. Açık konular ve ikinci sorular

### 16.1. R9 ile yanıtlanan konu ve iş kapsamı

Tekrarlar önceki çalışmadan itibaren gün aralıklarıdır. İlk hafta dört gün eğitim, üç gün testtir. İlk dört günde iyi dış kaynak tercih edilir; yoksa/yetersizse özel materyal hazırlanır. Kullanıcı web araştırması ve buna göre işe başlamayı istedi. Bu talimatla araştırma, kaynak seçimi ve ilk hafta içerik üretimi yapıldı; aynı onay sorusu tekrar sorulmaz.

Çalışan kayıt yazılımı ve kullanıcı cihazındaki doğrulama tamamlanmadı; sesler üretildi ama insan dinleme kontrolünden geçmedi. Bunlar materyal üretiminden ayrı tutulur. Bu araştırma/üretim işi için yeni kişisel soru engeli yok. Partner yok; sağlık kontrol tarihi sorulmaz.

### 16.1b. Doğrulama bekleyen varsayımlar (soru değil)

Aşağıdakiler kullanıcının ifadesinden **çıkarılan** yorumlardır. Kullanıcı itiraz etmezse geçerlidir; yanlışsa yalnız belirtilen kısım değişir. Yeni soru üretmemek için soru biçiminde yazılmadı.

| Kod | Varsayım | Neden gerekiyor | Yanlışsa ne değişir? |
| --- | --- | --- | --- |
| V1 — kapandı | R9: önceki çalışmadan 3/10/20/50 gün aralıkları; nominal 3/13/33/83. Eski mutlak gün varsayımı kaldırıldı | Güncel mekanik 8.8 | Kararlı yük 4N kalır; yarım yük iddiası geçersiz |
| V2 | **Hazırlık → test (HT) ikilisi makale çiftinde ve ders tipinde** uygulanır; ikisi **aynı gün**. | “Bazıları” hangi alanlar belirtilmedi | Alan veya birim (iki ardışık gün) farklıysa 12.4 ve G24 değişir |
| V3 | **“Eski günün konusu atlanır”** yalnız HT gününün yerine geçtiği konu içindir; D04 (yarım hedef önce) değişmez. | D04–D05 ile çakışmayı önlemek | Hafta 2+ için genel “birikim yok” kuralı kastedildiyse D04–D05 değişir ve birikim mekanizması kalkar |
| V4 | **“Canlı pratik”** = konuşma turları (C4–C6), network konuşmaları, gerçek-hayat kesintili yazma; **“mekanik”** = spor, göz / satır takibi, dinleme antrenmanı (B1–B2), C0–C3 | Tip sınıflaması | Tip değişir; kurallar değişmez (G22) |
| V5 | **Yeniden harita varsayılan olarak yok** (R8-1 daha yeni ve özgül). | T19 çözümü | Kullanıcı yine istiyorsa 13.8'deki isteğe bağlı program aynen devreye alınır |

### 16.2. Bilinmeyenler ve varsayılan işlem kuralları (yeniden sorulmaz)

| Bilinmeyen | Durum | Varsayılan işlem |
| --- | --- | --- |
| Halter barının kendi ağırlığı | Kullanıcı tekrar sorulmasını istemedi | Yükler “plaka toplamı, bar hariç” yazılır |
| Nadiren bakabilen kişi | Cevaplanmadı | Gözetimsiz kabul; 11.12 kuralları |
| Çift görme | Belirtilmedi | “Yok” yazılmaz; “bildirilmedi” yazılır |
| Gözlük numarası ve son muayene sonucu | Verilmedi | “Bilinmiyor” |
| İşitme muayene geçmişi | Cevaplanmadı | “Bilinmiyor”; bilgi notu olarak kalır |
| Bilinen tanı / hekim kontrolü | Yalnız “düzenli ilaç yok” denildi | “Bilinmiyor”; spor güvenlik notları geçerli (11.12) |
| Okul / TYT saatleri | Verilmedi; kullanıcı saat bazlı yapılandırma istemiyor | Yük gözlemle öğrenilir (3.2); artık istenmiyor |
| Satır kaybının en çok olduğu ortam | Çelişkili beyan | Kitap, PDF / ekran ve ders dışı metin hepsinde ölçülür (10.2) |
| Sporda “günlük klasik şeyler” | Cevaplanmadı | Hareket seçimi Claude'da (11.7 menüsü); kullanıcı değiştirebilir |
| “Hepsi aynı olacak”ın tam anlamı | Cevaplanmadı | Yapı her gün aynı, güç içeriği yüklü / hafif (G09) |
| Network alanı | “Her amaç için gerekli” | Genel network senaryoları (8.2) |
| AI'ya ihtiyaç duyulan durumlar | Belirtilmedi | Genel: canlı konuşma, video / podcast, yazı (8.2) |
| Skill temelli yeterlilik tanımı | Şimdilik verilmiyor | Sorulmaz; 3 aylık hedef sürdürmedir (D32, 13.9) |
| Telefon mikrofonu ve USB-C kulaklık mikrofonu | Doğrulanamadı | Gün 0'da cihazda test |
| Windows tarayıcısı | Verilmedi | Chromium tabanlı (Edge / Chrome) varsayılır; Gün 0 testi (5.9) |
| ZIP geri yükleme | Tanımlanmadı | Aynı biçim, ileride içe aktarım hedefi (6.6); aylık geri yükleme testi (6.9) |
| Bulut hesabı kullanımı | Belirtilmedi | Opsiyonel; kullanılırsa yalnız şifreli kopya (6.9) |
| Telefonun başkalarıyla ortak kullanımı | Belirtilmedi | “Bilinmiyor”; ekran kilidi önerilir (6.9) |
| Dış değerlendiricinin kimliği | Seçilmedi | Kullanıcı yükleme anında seçer |
| Konuşma partneri | Cevaplandı: yok (D39) | Kayıtlı replikler + gerçek-hayat kesintili yazma (10.6) |
| Check-up tarihleri (göz, KBB, diş) | Kesin değil; sorulmaz (D38) | Beklemeden başlanır; sonuç gelirse bağlam notu (10.5) |
| “3-10-20-50” birimi | R9 ile cevaplandı | Önceki çalışmadan gün aralıkları; 8.8 |
| Hazırlık → test ikilisinin hangi alanlarda olduğu | Belirtilmedi | Varsayım V2 (makale çifti, ders tipi); 12.4 |
| Test yerine geçilen konunun “atlanması”nın kapsamı | Belirtilmedi | Varsayım V3 (yalnız HT günü); D04 geçerli |
| Alan tipi sınıflaması (“galiba / muhtemelen”) | Kesin değil | 4.4.2 eşlemesi; itirazla değişir (G22, V4) |

### 16.3. Yapılanlar ve tamamlanmayanlar

Yapılanlar: resmî kaynak araştırması ve 27 Ekim 2026'da yeniden kontrolü, ilk dört günün eğitim seçimi, dört yedek İngilizce dersi, özgün okuma metinleri, spor başlangıç kartı, üç test gününün gün gün ayrı görev dosyaları, anahtarları ve seslendirme metinleri, Türkçe ve İngilizce nöral sentetik uyaranlar (otomatik tanıma ile geri okundu), formüllü İngilizce tekrar takvimi ve boş kayıt şablonları.

Tamamlanmayanlar: otomatik kayıt uygulaması; seslerin insan dinleme kontrolü; kullanıcı cihazında teknik doğrulama (HyperOS, Windows, tablo uygulamaları); 25 konu/50 makalelik bütün havuz; eski prototip incelemesi. Klinik değerlendirme ve bulut/hukuk hizmeti seçimi kapsam dışı. Yapılmış kullanıcı ölçümü yoktur.

---

## 17. Kaynaklar

### 17.1. Kaynak tablosu

Kodlar bu belgenin her yerinde aynı kaynağı gösterir. K1–K57 önceki sürümlerde, K58–K61 v8'de, K62–K72 v10'da, K73–K74 v11'de eklendi. 27 Ekim 2026'da yeniden açılan bağlantılar satırında belirtilmiştir; bir satırda bu not yoksa bağlantı v11'de yeniden açılmamıştır.

| Kod | Kaynak | İlgili olduğu nokta ve sınır |
| --- | --- | --- |
| K1 | CDC, Sleep and Health: https://www.cdc.gov/healthy-schools/sleep/index.html | 13–18 yaşta 24 saatte 8–10 saat uyku önerisi. |
| K2 | AASM uzlaşı makalesi: https://pmc.ncbi.nlm.nih.gov/articles/PMC5078711/ | Yaşa göre uyku süresi önerilerinin dayanağı. |
| K3 | NIDCD, Measuring Hearing Loss: https://www.nidcd.nih.gov/health/statistics/what-numbers-mean-epidemiological-perspective-hearing | İşitme değerlendirmesinde frekans eşikleri, kulaklar ve konuşmayı anlama gibi unsurlar. |
| K4 | NHS, Hearing loss: https://www.nhs.uk/conditions/hearing-loss/ | Konuşmayı duymada zorluk, değerlendirme ve ani değişikliklerin önemi. |
| K5 | NIDCD, Tinnitus: https://www.nidcd.nih.gov/health/tinnitus | Çınlamanın çeşitli nedenleri olabileceği; burada tanı konmadı. |
| K6 | USA Learns: https://www.usalearns.org/ ; başlangıç açıklaması: https://www.usalearns.org/how-to-learn-english-free?isTeacher=False ; öğrenci yardım: https://www.usalearns.org/need-help-students | Ücretsiz eğitim, hesapla çalışma / sonuç kaydı, resmî mobil kullanım açıklaması. |
| K7 | VOA Let's Learn English 1: https://learningenglish.voanews.com/p/5644.html | Amerikan İngilizcesi öğretmenlerince hazırlanan başlangıç kursu; konuşma, kelime, yazma, çalışma kâğıtları ve değerlendirme materyalleri. |
| K8 | IES, Organizing Instruction and Study: https://ies.ed.gov/ncee/wwc/practiceguide/1 | Aralıklı çalışma ve hatırlama / sorularla çalışma yöntemleri. |
| K9 | Council of Europe, CEFR levels: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions | A1–C2 düzey tanımları; A3 bulunmaması. |
| K10 | OpenAI speech-to-text belgeleri: https://developers.openai.com/api/docs/guides/speech-to-text | Sesin yazıya çevrilmesi; bu işlev telaffuz değerlendirmesiyle aynı kabul edilmedi. Ücretli API seçimi yapılmadı. |
| K11 | faster-whisper: https://github.com/SYSTRAN/faster-whisper | Yerel transkripsiyon için araştırılmış aday; zorunlu teknoloji değil. |
| K12 | AAP, çocuklarda direnç çalışması rehberi: https://www.healthychildren.org/English/news/Pages/Guidance-on-Resistance-Training-for-Children.aspx | Uygun gözetim ve direnç çalışmasının gençlerde ele alınışı. |
| K13 | AAP, Strength Training: https://www.healthychildren.org/English/healthy-living/sports/Pages/Strength-Training.aspx | Teknik ve kademeli yük gibi başlangıç ilkeleri; kişisel program yerine geçmez. |
| K14 | NHS, memory problems: https://www.nhs.uk/symptoms/memory-loss-amnesia/ ; CUH: https://www.cuh.nhs.uk/patient-information/managing-memory-problems/ | Günlük yaşamı etkileyen unutkanlık için değerlendirme ve pratik hafıza çerçevesi. |
| K15 | NEI, convergence insufficiency: https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/convergence-insufficiency | Göz yakınmalarında özel değerlendirme gerektiren durumlar olabileceği; kullanıcıya bu tanı konmadı. |
| K16 | Anki: https://apps.ankiweb.net/ ; AnkiDroid: https://docs.ankidroid.org/manual.html | Aralıklı tekrar için adı geçen araçlar; kesin seçilmedi. |
| K17 | British Council A1 dinleme: https://learnenglish.britishcouncil.org/free-resources/listening/a1 ; A1 okuma: https://learnenglish.britishcouncil.org/free-resources/reading/a1 | Daha önce araştırılmış ücretsiz materyaller; Amerikan İngilizcesi tercihi sonradan netleşti, bu yüzden varsayılan seçim sayılmamalı. |
| K18 | Busuu ücretsiz / Premium ayrımı: https://help.busuu.com/hc/en-us/articles/16269241908497-What-is-Premium | Adı geçen örneğin bütün özelliklerinin ücretsiz olmadığı; ücretsiz ihtiyaçlara göre yeniden kontrol gereği. |
| K19 | MDN MediaRecorder: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event | Ses parçalarının zamanlaması ve mobil kesintiler için teknik aday araştırması; mevcut ürün kararı değil. |
| K20 | Çalışma belleği antrenmanı meta-analizi (Melby-Lervåg, Redick & Hulme 2016): https://www.psychologicalscience.org/journals/perspectives/1745691616635612/ | Antrenman eğitilen göreve yarıyor; okuma, aritmetik, sözel / sözel olmayan yetenek gibi uzak ölçülerde güvenilir iyileşme gösterilemedi. Arama özetine dayanır, tam metin okunmadı. |
| K21 | Hafıza sarayı (loci) meta-analizi, Twomey & Kroneisen 2021: https://journals.sagepub.com/doi/10.1177/1747021821993457 | 13 randomize çalışmada orta etki (g≈0,65); çoğu çalışmada yanlılık önlemleri raporlanmamış. Özet düzeyinde okundu. |
| K22 | Hafıza sarayı sistematik derleme / meta-analiz (2025): https://pmc.ncbi.nlm.nih.gov/articles/PMC12514325/ | Anlık sıralı hatırlamada büyük etki (d≈0,88); yazar kanıt kalitesini düşük / çok düşük derecelendiriyor. Özet düzeyinde okundu. |
| K23 | AAPOS, Vision Therapy: https://www.aapos.org/glossary/vision-therapy ; U. Michigan Dyslexia Help: https://dyslexiahelp.umich.edu/answers/eyes-still-dont-have-it/ | 2014 ortak açıklamaya göre göz egzersizlerinin öğrenme / okuma becerisini artırdığına dair bilimsel kanıt yok; konverjans yetersizliği gibi belirli durumlar ayrı (bkz. K15). Bu kullanıcıya tanı konmadı. |
| K24 | NSCA, gençlerde direnç antrenmanı: https://pubmed.ncbi.nlm.nih.gov/19620931/ ; LTAD: https://www.nsca.com/about-us/position-statements/youth-training-and-long-term-athletic-development/ | Uygun gözetim, aşırı şiddet / hacim ve yetersiz dinlenmeden kaçınma. Tam metin okunmadı. |
| K25 | WHO 5–17 yaş fiziksel aktivite önerisi (EMRO sayfası): https://www.emro.who.int/health-education/physical-activity/recommended-levels-of-physical-activity-for-health.html | Günde ≥60 dk orta-şiddetli aktivite; haftada ≥3 gün şiddetli aerobik ve kas / kemik güçlendirici aktivitenin birlikte kapsandığı bir koşul; hareketsizlerde küçük miktarla başlayıp kademeli artış. |
| K26 | EF SET: https://www.efset.org/4-skill/ | Resmî sayfa dört becerilik ücretsiz ürünü 90 dakika olarak açıklıyor. Önceki 50 dakikalık iki beceri açıklaması bu bağlantıya yanlış bağlanmıştı; K69 ile düzeltildi. |
| K27 | USA Learns öğrenci yardım sayfası (doğrudan okundu): https://www.usalearns.org/need-help-students | Sayfa “100% FREE” diyor; telefon, tablet ve bilgisayarda tarayıcıdan çalışıyor; konuşma etkinlikleri için mikrofon izni gerekiyor. Bu sayfada Flash geçmiyor. Bağımsız (öğretmensiz) öğrenci için kayıtlı ilerleme / rapor bu sayfadan doğrulanamadı; sınıf anahtarıyla öğretmen puanları ve süreyi görüyor. |
| K28 | VOA Let's Learn English Level 1 (doğrudan okundu): https://learningenglish.voanews.com/p/5644.html | 52 ders, haftada 1 yeni ders, her derste video; konuşma, kelime, yazma; yazdırılabilir çalışma kâğıtları ve değerlendirme materyalleri. Sayfa ücret / hesap durumunu belirtmiyor (arama sonucu hesap gerekmediğini söylüyor; sayfadan doğrulanmadı). |
| K29 | Aralıklı tekrar ve geri çağırma çalışması (ikincil özetler): https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication ; https://inspire.acu.edu.au/articles/spaced-practice | Dağıtık pratiğin kitlesel pratikten daha iyi olduğu bulguları (Donoghue & Hattie 2021; Mawson & Kang 2025 özetlerde geçiyor, özgün makaleler okunmadı). Etki çoğunlukla çalışılan maddeye özgü; ergenlere özgü kanıt az belgelenmiş; bazı sınıf çalışmalarında genel teste aktarım görülmedi. |
| K30 | AOA, çocuklarda yıllık göz muayenesi: https://www.aoa.org/about-the-aoa/press-room/press-releases/annual-eye-exams-for-children ; All About Vision özeti: https://www.allaboutvision.com/eye-care/eye-exam/how-often/ | AOA'nın 2017 sonrası önerisi: okul çağı çocuklar ve gençler (6–17/18 yaş) ve gözlük kullananlar için yıllık kapsamlı muayene; riskli gençlerde daha sık olabilir. Arama özeti düzeyinde okundu, birincil yönerge metni okunmadı; bir klinik sayfası iki yılda bir yazıyor (muhtemelen eski). Bu bir tanı değil, genel kontrol aralığıdır. |
| K31 | FITNESSGRAM türü gençlik saha testleri (okul dokümanları ve araştırma protokolü): https://www.phenxtoolkit.org/protocols/view/150203 ; https://static.sched.com/hosted_files/ignitepg2025/5a/Fitnessgram.pdf | Batarya: PACER (20 m mekik koşusu) veya 1 mil yürüme / koşma, curl-up, şınav (form bozulunca biter), gövde kaldırma, otur-uzan; sonuçlar sağlık standartlarına göre puanlanır. Resmî FITNESSGRAM sayfası bu turda bulunamadı; eski olabilen okul belgeleri ve bir araştırma protokolü düzeyinde okundu. Burada yalnızca bir madde menüsü olarak ilham alındı, puanlama kullanılmıyor. |
| K32 | CDC, Çocuklar ve gençler için “neler sayılır”: https://www.cdc.gov/physical-activity-basics/adding-children-adolescents/what-counts.html | 6–17 yaş için günde ≥60 dk aktivite; aerobik orta / şiddetli her gün; kas ve kemik güçlendirme haftada ≥3 gün; talk test (orta şiddet: konuşulur ama şarkı söylenmez; şiddetli: birkaç kelime); gençler için örnek: şınav, barfiks, ağırlık çalışması. Arama özetine dayanır. |
| K33 | NSCA 2009 pozisyon metni (PDF): https://dxpprod.nsca.com/globalassets/about/position-statements/position_stand_youth_resistance_training---2009.pdf ; AAP özeti (Healio): https://www.healio.com/news/pediatrics/20200526/aap-kids-can-benefit-from-resistance-training-with-proper-supervision ; ikincil özet: https://www.ptpioneer.com/personal-training/certifications/nsca-cpt/nsca-cpt-chapter-18/ | Gözetim ve teknik; AAP özetinde sağlık uzmanına danışma, dinamik ısınma ve hafif germeyle soğuma. “2–3 ardışık olmayan gün, 1–3 set, 6–15 tekrar, %5–10 kademeli artış” ikincil özetten alındı, NSCA / AAP metinlerinde **doğrulanmadı**. |
| K34 | AAP 2024 raporu, aşırı kullanım yaralanmaları, aşırı antrenman ve tükenmişlik: https://www.healthychildren.org/English/news/Pages/AAP-calls-out-causes-of-injury-overtraining-and-burnout-in-youth-sports.aspx ; https://www.aap.org/en/news-room/news-releases/aap/2024/american-academy-of-pediatrics-highlights-causes-of-injury-overtraining-and-burnout-in-youth-sports/ | Aşırı antrenman = antrenman – toparlanma dengesizliği; belirtiler: süregiden yorgunluk, kötü uyku, ruh hali değişikliği; büyüyen kemikler stres yaralanmasına daha açık. Haftalık dinlenme günü sayısı ve %10 kuralı özetlerde **doğrulanamadı**, tam raporda aranmalı. |
| K35 | Gençlerde denge antrenmanı (Gebel ve ark. 2018 meta-analizi ve 2020 çalışması): https://duepublico2.uni-due.de/servlets/MCRFileNodeServlet/duepublico_derivate_00077262/BMC_Sports_Sci_Med_Rehabil_2020_12_71.pdf | Denge antrenmanı gençlerde etkili; süre ve sıklık etkisi tutarsız, zorluk derecesi önemli olabilir. Yalnızca özet düzeyinde okundu; 2018 meta-analizinin bağlantısı bu turda doğrulanamadı. |
| K36 | Gençlerde çeviklik: sistematik kapsam taraması https://oalib-perpustakaan.upi.edu/Record/doaj_e0b7eb1cc6314dc49d28e94d35ef42a5/Details?print=1 ; küçük randomize çalışma (n=35, 15–19 yaş, 6 hafta, haftada 3 × 15–20 dk) https://studia.reviste.ubbcluj.ro/index.php/subbeducatio/article/view/9725 | Çeviklik gençlerde eğitilebilir, alan henüz yeni; gelişim doğrusal değil. Küçük ve kısa denemedeki doz, kullanıcının %5'lik payından yüksek. Ön bulgu düzeyinde. |
| K37 | İşitsel işlemleme güçlüğü ve konuşmayı anlama değerlendirmesi (klinik / dernek sayfaları): https://ent.weill.cornell.edu/node/298 ; https://hearinghealthmatters.org/pathways-society/2023/evaluation-and-management-of-adult-auditory-processing-disorders-part-1-2/ | Önce kapsamlı odyolojik değerlendirme (hafif işitme kaybı da benzer güçlük yaratabilir); hızlı konuşan kişileri takip güçlüğünde sıkıştırılmış konuşma ve gürültüde dinleme testleri kullanılabiliyor; belirtiler dikkat, dil bozuklukları, kaygı ve işitme kaybıyla örtüşebilir. Klinik sayfalardır, resmî ölçüt değildir; **tanı yerine geçmez**. |
| K38 | Konuşma hızı ve yabancı dilde dinleme anlama: https://iastatedigitalpress.com/psllt/article/id/15429 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC5487441 | Sonuçlar tutarsız: öğrenciler yavaş konuşmayı tercih ediyor ama yavaşlatmanın anlamaya etkisi her çalışmada görülmüyor; konuşma hızı dinleme puanlarıyla ilişkili olabilir (korelasyon). Küçük çalışmalar, özet düzeyinde okundu. |
| K39 | Okurken zihnin dağılması: https://ies.ed.gov/use-work/awards/mind-wandering-during-reading ; https://link.springer.com/article/10.3758/s13421-023-01509-0 | Okuma sırasında dikkat kayması sık (çalışmalarda yaklaşık %15–30 bildirilmiş, gazete özetinden); zayıf öğrenmeyle ilişkili. Satırı kaybetme / geri dönme davranışını doğrudan ölçen kanıt **bulunamadı**. |
| K40 | Xiaomi HyperOS 3 (Android 16) dağıtım takvimi: https://9to5google.com/2025/09/26/xiaomi-android-16-list-schedule/ ; https://www.gizmochina.com/2025/12/10/hyperos-3-update-extends-to-older-xiaomi-phones-heres-the-full-list/ ; https://new.c.mi.com/pk/post/85667 | HyperOS 3 Android 16 tabanlı; Redmi Note 13 Pro+ 5G üçüncü dalgada (Aralık 2025 – Mart 2026). Kaynaklar takvimde kısmen çelişiyor; kullanıcı zaten HyperOS 3 kullandığını bildirdi. Arama özeti düzeyinde. |
| K41 | Redmi Note 13 Pro+ 5G özellikleri (perakende / özellik sayfası): https://us.smartprix.com/mobiles/xiaomi-redmi-note-13-pro-plus-ppd17s27km27 | Dimensity 7200 Ultra; 8 / 12 GB RAM; 256 / 512 GB UFS 3.1, bellek kartı yok; 3,5 mm jak yok; 5000 mAh. Mikrofon bilgisi yok. Resmî Xiaomi sayfası değildir. |
| K42 | HyperOS pil / arka plan ayar rehberleri: https://info.drivequant.com/hubfs/Tuto%20Smartphones%20-%20EN/Xiaomi/Xiaomi%20-%20HyperOS%203.0%20-%20EN.pdf ; https://drfone.wondershare.com/android-xiaomi/fix-whatsapp-telegram-notifications-delayed-xiaomi.html ; dontkillmyapp.com (erişilemedi) | Pil “Kısıtlama yok”, otomatik başlatma, son uygulamalarda kilitleme, “kullanılmayan uygulama etkinliğini duraklat”ı kapatma; alarm gecikmesi. Üçüncü taraf, SEO tarzı rehberler; menü yolları sürüme göre değişir; garanti yok. |
| K43 | Chrome Notification Triggers API: https://developer.chrome.com/docs/web-platform/notification-triggers | Zamanlanmış yerel bildirim API'si; deneme (origin trial) tamamlanmış, yayına alma başlamamış görünüyor; güncel destek durumu doğrulanamadı. |
| K44 | Mobil tarayıcıda ekran kilidi / arka plan ve ses: https://meta.discourse.org/t/media-playback-with-pwa-keep-playing-when-phone-locked/182219 | Mobil tarayıcılar ekran kilitlenince veya arka plana alınınca sekmeyi dondurabiliyor; konu **oynatmadır**, kayıt için dolaylı kanıt. |
| K45 | Bluetooth profil karşılaştırması (Vivox / Unity belgesi): https://docs.unity.com/en-us/vivox-core/developer-guide/android/bluetooth-profile-comparison | Mikrofonlu Bluetooth (SCO / HFP) mono ve düşük çözünürlüklü; A2DP ayrı profil. Android'de kablolu kulaklıkla ölçülü karşılaştırma yok. |
| K46 | Kalıcı depolama: https://web.dev/persistent-storage ; https://developer.chrome.com/blog/storage-buckets | IndexedDB / localStorage düşük depolamada silinebilir; `persist()` ile kalıcılık istenebilir; Chrome ekibine göre otomatik silme nadir, elle silme daha olası. Kurulu PWA'ya özgü davranış doğrulanamadı. |
| K47 | Screen Wake Lock API: https://developer.chrome.com/docs/capabilities/web-apis/wake-lock ; https://caniuse.com/wake-lock | Ekranı açık tutar; belgeler Chrome 84'ten beri destek diyor, caniuse'un Android sütunu özette farklı sürüm gösterdi; doğrulanmalı. Sekme gizlenince bırakılması genel bilgidir. |
| K48 | JSZip bellek ve akış sınırları: https://github.com/Stuk/jszip/issues/580 ; https://github.com/Stuk/jszip/issues/343 | `generateAsync` sonucu belleğe alır; büyük arşivde kararsızlık; akış çözümleri var; Android'de sınır daha düşük olabilir. |
| K49 | whisper.cpp Android: https://dev.to/software_mvp-factory/wiring-whispercpp-to-androids-audiorecord-api-hjo ; https://learn.arm.com/learning-paths/mobile-graphics-and-gaming/ai-portal-audio-to-text/ | Dimensity için kesin hız verisi yok; tek anekdot “base”i işaret ediyor; bellek ≈273 / 388 MB (tiny / base). Kendi cihazında ölçülmeli. |
| K50 | Tek olgu tasarımı ve uygulama etkisi: https://www.frontiersin.org/articles/10.3389/fpsyg.2016.00032/pdf ; https://pmc.ncbi.nlm.nih.gov/articles/PMC4876902/table/tbl2 | ≥3 koşul karşılaştırması ve rastgele sıralama; alternatif formlar uygulama etkisini azaltır ama denk olmayabilir; RCI bireysel olgularda kullanılır. Özet / tablo düzeyinde. |
| K51 | Vocabulary Size Test (Nation & Beglar): https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/vocabulary-tests/the-vocabulary-size-test/Vocabulary-Size-Test-information-and-specifications.pdf ; https://my.vocabularysize.com/ | Çoktan seçmeli kelime boyutu testi; 14 000 sürümü 140 madde (puan × 100); araştırma kullanımı için izin gerekmiyor; CEFR eşlemesi yaklaşık. |
| K52 | VOA Learning English yayınları: https://en.wikipedia.org/wiki/Learning_English_(version_of_English) ; https://pdu.itu.edu.tr/educational-technologies/SFL-picks/voa | Yayınlar yaklaşık üçte bir daha yavaş okunuyor; ~1500 kelimelik çekirdek sözcük, deyimden kaçınma; hedef seviye kaynaklarda tutarsız (üst-başlangıç / orta / ileri). İkincil kaynaklar; güncel program VOA sitesinden kontrol edilmeli. |
| K53 | L2 dinleme eğitimi yöntemleri (gölgeleme, dikte): https://journals.sagepub.com/doi/10.1177/0033688218771380 ; https://journal.uia.no/index.php/NJLTL/article/view/1139 | Gölgeleme alt-düzey (sesbilgisel) işlemeyi iyileştirebiliyor; yararın düşük düzeyde belirgin olduğu iddiası tartışmalı; dikte esas olarak sesbilgisel kodlama; çalışmalar küçük, çoğu Japon EFL sınıfı; kapsamlı dinleme için doğrudan inceleme bulunamadı. Özet düzeyinde. |
| K54 | Ergenlerde çift görev (yürürken) ve çift görev maliyeti: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00912/pdf ; https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2021.711054/text | Ergenlerde çift görev altında yürümenin bozulduğu, ayakta durmada bozulmadığı bildirilmiş; genç yetişkinlerde bilişsel yük arttıkça maliyet artıyor. Gerçek yaralanma / kaza oranlarıyla ilişki gösterilmemiş. Özet düzeyinde. |
| K55 | Syncthing klasör türleri: https://docs.syncthing.net/users/foldertypes.html ; https://forum.syncthing.net/t/regarding-send-only-receive-only/14239 | *Send Only* klasör diğer cihazlardaki değişiklikleri uygulamaz; sürümleme yalnız diğer cihazdan gelen değişiklikleri kapsar. Android / Windows istemci özellikleri doğrulanmadı. |
| K56 | 3-2-1 yedekleme kuralı (ikincil kaynaklar): https://www.nakivo.com/blog/3-2-1-backup-rule/ ; https://www.ninjaone.com/blog/the-3-2-1-backup-rule-explained/ | Üç kopya, iki farklı ortam, biri başka yerde. CISA / NIST onayı ikincil kaynaklarda geçiyor, birincil sayfada doğrulanmadı. |
| K57 | 7-Zip ile şifreli arşiv: https://cnx-software.com/2011/02/22/aes-256-encryption-and-file-names-encryption-with-7-zip-7z/ ; https://tdx.flemingcollege.ca/TDClient/178/Portal/KB/PrintArticle?ID=9194 | Windows 11 yerleşik zip'i parola desteklemez; 7-Zip açık kaynak, AES-256; zip biçiminde dosya adları görünür, 7z biçiminde başlık şifrelemesi (-mhe) adları gizler. İlk kaynak 2011 tarihli; yeni üniversite rehberi seçenekleri doğruluyor. Parola kaybı = veri kaybı. |
| K58 | Egzersiz zamanı ve uyku: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12452866/ ; https://medicalnewsbulletin.com/exercising-night-sleep/ | Ergenlerde egzersiz müdahaleleri uyku kalitesini genel olarak iyileştiriyor (8 çalışma, 710 katılımcı; yatış saati moderatör olarak incelenmemiş). Yetişkin verisi yatışa yakın egzersizde karışık; asıl kaygı yatıştan yaklaşık bir saatten az önce biten **şiddetli** egzersiz; çalışmaların çoğu düşük kalite. Ergene özgü doğrudan kanıt ince; özet düzeyinde okundu. |
| K59 | Alışkanlık oluşumu (Lally ve ark. 2010): https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit ; https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally | 96 üniversite öğrencisi, 84 gün; ortanca 66 gün (39 kişilik uygun uyum alt kümesi), aralık 18–254 gün (üst uç tahmini); araştırmacı bunu evrensel kural saymıyor; küçük örnek, tekrarlanmamış. “Bir iki günü kaçırmak etkisiz” iddiası yalnız ikincil bir blogda; doğrulanamadı. |
| K60 | Uygulama niyetleri (Gollwitzer & Sheeran 2006), ikincil özetler: https://stafforini.com/works/gollwitzer-2006-implementation-intentions-and/ ; https://goalsandprogress.com/implementation-intentions-research/ | “Eğer–o zaman” planlarının hedefe ulaşmayı orta-büyük etkiyle artırdığını bildiren meta-analiz (94 test, d≈0,65). Sayılar ikincil sayfalardan; orijinal bölüm okunmadı. |
| K61 | Yabancı dilde dinlerken not alma: https://www.igi-global.com/chapter/getting-smart-split-attention/73266/ ; https://irtest.lib.nccu.edu.tw/handle/140.119/31796 | Not alma L2'de çalışma belleğine ek yük getirebilir; yararı dinleyicinin düzeyine ve metin zorluğuna göre değişiyor, sonuçlar karışık; çalışmalar küçük, bazı kaynaklar düşük kalite. Özet düzeyinde. |
| K62 | Aralıklı tekrar aralığı örnekleri (ikincil rehberler; “3-10-20-50” aramasının sonucu): https://www.sprachcaffe.com/en/uc/magazine-article/spaced-repetition-for-vocabulary.htm ; https://vaia.com/en-us/explanations/psychology/memory-studies-in-psychology/spaced-repetition | “3-10-20-50” adlı bir yöntem İngilizce ve Türkçe aramada bulunamadı. Arama özetlerinde genel rehberler genişleyen aralıklar öneriyor (örn. 1–3–7–14 gün; ilk tekrar yaklaşık 1 gün sonra, ardından birkaç gün, sonra 1–2 hafta). Bu, kullanıcının kuralının doğrulaması değildir. Yalnız arama özetleri görüldü, sayfalar açılmadı. |
| K63 | https://www.usalearns.org/need-help-students ; https://www.usalearns.org/1st-free-online-english-course | Ücretsiz başlangıç, telefon/bilgisayar, öğretmensiz çalışma ve etkinlik yapısı doğrudan doğrulandı; kullanıcı hesabında denenmedi. 27 Ekim 2026'da yeniden okundu (20 ünite; akıllı telefon ve mikrofon yardım sayfası). |
| K64 | https://learningenglish.voanews.com/p/5644.html ; https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html | Resmî başlangıç serisi ve Ders 1 medya indirme bağlantıları; gerçek cihazda indirme testi yok. 27 Ekim 2026'da yeniden açıldı (52 ders; Ders 1 için 240p–1080p video ve 64 kbps MP3). |
| K65 | https://learningenglish.voanews.com/p/5373.html | Bazı programların yavaş okunması ve metin/MP3 seçenekleri resmî açıklamadan doğrulandı; bütün derslere tek hız genellenmez. |
| K66 | https://help.busuu.com/hc/tr/articles/16269241908497-Premium-nedir | Ücretsiz ders ile ücretli çevrimdışı/tekrar özellikleri ayrıldı. **27 Ekim 2026'da sayfa 403 verdi; bilgi yeniden doğrulanamadı.** Kaynak seçimi bu satıra dayanmaz. |
| K67 | https://ctl.stanford.edu/memory-strategy-memory-palace | Sıralı bilgi için üniversite yöntem rehberi (lisans: CC BY-NC-ND 4.0); etkililik deneyi değil; çeviri veya uyarlama çoğaltılmadı, yalnız bağlantı ve kendi cümlelerimle yönerge verilir. 27 Ekim 2026'da yeniden açıldı. |
| K68 | https://www.nike.com/tr/ntc-app | Ücretsiz egzersiz/video kaynağı; kişisel antrenman onayı veya cihaz doğrulaması değil. |
| K69 | https://www.efset.org/4-skill/ ; https://www.efset.org/ef-set-50/ | Dört beceri 90 dakika; okuma/dinleme 50 dakika. İsteğe bağlı dış ölçüm. 27 Ekim 2026'da yeniden açıldı. |
| K70 | https://www.nsca.com/globalassets/about/position-statements/position_stand_youth_resistance_training---2009.pdf | Ardışık olmayan 2–3 direnç günü, teknik ve gözetim bu turda doğrudan doğrulandı; kişisel yük reçetesi değil. 27 Ekim 2026'da PDF metni yeniden okundu. |
| K71 | https://journals.sagepub.com/doi/10.1177/1745691616635612 | Özgün meta-analiz yayıncı sayfası açıldı; çalışma belleği oyunlarından geniş beceriye aktarım otomatik kabul edilmez. Bu bağlantı v11 hazırlığında yeniden açılmadı. |
| K72 | https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/ ; https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/ | İlk makale çiftinin dayanakları; gösterim sonucu ile genel sistem açıklaması aynı koşul sayılmaz. |
| K73 | Brain Workshop: https://brainworkshop.sourceforge.net/ | Ücretsiz açık kaynak dual n-back (Windows, Mac, Linux). 27 Ekim 2026'da açıldı. Günlük unutkanlık için ana çözüm yapılmadı; çalışma belleği antrenmanından geniş aktarım için bkz. K20, K71. |
| K74 | Piper nöral konuşma sentezi ve ses modeli kartları: https://huggingface.co/rhasspy/piper-voices | Hafta 1 sesleri bu modellerle üretildi. Model kartlarında bildirilen lisanslar: kristin ve ljspeech kamu malı, joe CC0, Türkçe dfki CC BY-NC-SA 4.0 (yalnız kişisel, ticari olmayan kullanım). Kartlar ses seçimi sırasında okundu. Lisansı kuran taraf bu rapor değildir; sesler gerçek bir kişinin sesi olarak sunulmaz. |

### 17.2. Kaynakları yorumlama sınırları

- Bir kaynağın varlığı, o yöntemin bu kullanıcıda aynı sonucu vereceğini veya bir ürünün tüm özelliklerinin çalıştığını göstermez.
- Ücretsiz olmak açık kaynak veya yeniden dağıtılabilir olmak değildir.
- Dış araçların kendi puanları (ör. EF SET, Anki istatistikleri) uygulamanın puan vermesini gerektirmez.
- K20–K23, K29, K35, K36 ve K38–K39 çoğunlukla **özet düzeyinde** okundu; K26 satıcı sayfasıdır; K37 klinik / dernek sayfalarıdır, resmî ölçüt değildir; K40–K42 perakende ve üçüncü taraf kaynaklara dayanır.
- Hiçbir kaynağın dört günde belirli bir gelişimi garanti ettiği gösterilmedi.
- K52–K57 ikincil kaynaklara ve arama özetlerine dayanır; K55 ve K56 için birincil sayfalar bu turda tam doğrulanmadı. K58–K61 de ikincil / özet düzeyindedir (K59 küçük ve tekrarlanmamış bir çalışma, K60 ikincil sayfalar).
- K66 ve K71 için v11'de doğrulama yapılamadı (Busuu sayfası 403; Melby-Lervåg bağlantısı açılmadı).
- K62 yalnız arama özetlerine dayanır; “3-10-20-50” kuralının kaynağı bulunamadığı için kuralın etkisi hakkında kanıt iddiası yapılmaz (Bölüm 8.8).

---

## 18. Değerlendirici talimatı (başka bir yapay zekâ veya insan için)

### 18.1. Rol

Bu belgeyi, bir kullanıcıyla yürütülen uzun gereksinim görüşmesinin **birleşik aktarımı** olarak oku. Kişisel öğrenme ve gelişim düzeniyle bunu destekleyen bir sistemi düşünüyoruz. Önceki bir asistan yeterince soru sormadan geliştirmeye başladığı için kullanıcı itiraz etti. Bu yüzden bu aşamada **geliştirme değil, doğru anlama, bağımsız analiz ve gerekli sorular** isteniyor. (v11 notu: R9'dan sonra kaynak araştırması ve ilk hafta içerik üretimi kullanıcı talimatıyla başlatıldı; değerlendirici bu raporu paketteki `09_DEGISIKLIK_VE_HATA_RAPORU.md` ve `EKSIKLER.md` ile birlikte okur. Bu paragraf ilk değerlendirme turunun rolünü anlatır, üretim işini durdurmaz.)

### 18.2. Okuma sırası

1. Bölüm 0, 1 ve 4 (okuma kuralları, özet, kesin kararlar; test kavramı ve alan tipolojisi: 4.4).
2. Bölüm 15 ve 16 (devredilen kararlar, açık sorular).
3. İlgili alan bölümleri (3, 5–13) ve Bölüm 14 (risk).
4. Gerektiğinde Ek A (kullanıcının kendi sözleri) ve Ek B.

### 18.3. Senden beklenenler

- Kullanıcı kararlarını (D-kodları) **yeniden sorma**. Devredilen kararları (G-kodları) gerekçeyle değiştirebilirsin, ama kullanıcıya açıkça söyle.
- Belirsiz, çelişkili veya yanlış yorumlanabilir noktaları kendi muhakemenle bul; tek bir mimariye, uygulamaya veya yönteme kilitlenme.
- Araştırma gerekiyorsa **resmî kaynakları** ve doğrudan araştırmaları kullan; **kanıtı, yorumu ve öneriyi ayır.**
- Eğitim kalitesi, ölçümün güvenilirliği, gerçekçi ilerleme, kayıtların korunması, günlük kullanım ve aksayan günlerdeki davranışı özellikle incele.
- Uygulamanın kaydı ile senin bağımsız yorumunu birbirine karıştırma.
- Önerilerin kullanıcı kararı gibi yazılmasın.
- Raporu **alan tipine göre** (4.4.2) yorumla; tipleri tek ölçekte birleştirme. Hafta 1'den sonra İngilizce dışındaki alanlarda kontrollü test yoktur; “gelişti / geriledi” hükmü verme (7.9). Doğrulama bekleyen varsayımları (V2–V5, Bölüm 16.1b) kesin bilgi gibi aktarma.

### 18.4. Yapma

- Sağlık yakınmalarından tanı üretme; eğitim ölçümlerini tıbbi test yerine koyma.
- Uygulamanın puan / hüküm verdiğini varsayma.
- Güncel R9 talimatı araştırma, kaynak seçimi ve gerekli özel içerik üretimini başlattı. Eski değerlendirmeden sonra otomatik durma talimatını bu işe uygulama. Yazılım veya cihaz testi yoksa varmış gibi yazma.
- Önceki asistanın prototipini veya başka sohbetlerdeki projeleri bu kullanıcının onaylı gereksinimi sayma.
- Olmayan testi olmuş gibi anlatma. Tekrar aralıkları R9 ile gün olarak doğrulandı; eski mutlak gün yorumunu kullanma.

### 18.5. İlk yanıt biçimi

1. Anladığın temel noktalar (5–8 madde).
2. Gördüğün çelişki, risk ve eksikler (kısa).
3. Araştırma bulguları (kaynaklı, kanıt / yorum ayrımıyla).
4. Önerilerin (gerekçeli; kullanıcı kararı olmadığı belirtilerek).
5. Kullanıcıya soruların: en çok 10, **önem sırasıyla**, her biri hangi kararı değiştirdiğini belirterek; cevabı bu belgede olanları sorma.

Anlaşılır Türkçeyle, dayanak ve belirsizlikleri belirterek yaz.

---

## Ek A. Kullanıcı mesajlarının kronolojisi

Bu ek, kullanıcının bu görevle ilgili mesajlarını **aynen** içerir; yazım hataları korunmuştur. Platformun birebir dışa aktarımı değil, önceki asistanın mesajlarını içermeyen bir derlemedir. **Sonraki açık düzeltme, önceki ifadenin önüne geçer.** U2'deki “Sesleri, ritimleri veya müzik notalarını daha iyi ayırt etmek” ifadesi önceki asistanın soru seçeneği metninin yapıştırılmış parçasıdır; kullanıcı R6'da bunun kendi hedefi olmadığını belirtmiştir (D25). U1–U11 raporun ilk derlemesi öncesi mesajlardır; R0–R10 bu derlemeden sonraki mesajlardır.

### Kod haritası (Bölüm 4, 10–16'da geçen R-kodları)

| Kod | Konu | Kullanıcı ifadesi (aynen) |
| --- | --- | --- |
| R1-1 | Anahtar | “Her maddede 3. gönderimde (Önerim)” |
| R1-2 | Tamamlanma | “Adımlar + yanıt ya da ‘bilmiyorum’ (Önerim)” |
| R1-3 | Birikim | “Kural aynı, bölme seçeneği sunulsun (Önerim)” |
| R1-4 | Hafta 1 testleri | “Dinle + başka iş yap, Okuma ve satır takibi, Gecikmeli hatırlama, İngilizce profil” + serbest not (aşağıda R1) |
| R2-0 | Genel devir | “geri kalanı onerine bırakıyorum diğer soruları da kendi önerilerine göre cevapla kişisel soru varsa sor yoksa dosyayı güncelle” |
| R2-1 | Dambıl | “Ayarlanabilir dambıl 1 tane var diğeri ayarlanmiyor” |
| R2-2 | Gözetim | “çoğunlukla yok nadiren bakabilir” |
| R2-3 | Göz kontrolü | “2024 son ayları göz hastanesine gittim” |
| R2-5 | Spor blokları | “Spor blokları her zaman o stile uygun olmalı en azından hafta içi uyumlu olmalı test günleri esnetebilmeli olmali” |
| R3-1 | Dambıl kg | “Sabit 5 kg en fazla 20 kg oluyor” |
| R3-2 | Bar / gözetim | “halter barı zorlarsak 50 kg halter kaldırırken bir sorun yaşarsam diye ama çoğunlukla hayır bakmaz” |
| R3-4 | İşitme, kulak | “iki kulakta olmalı muhtemelen ama bilgim yok” |
| R3-5 | Esneme = test süresi | “test süresi olarak dedim ama spor da da test istiyorsan farklı ona göre yaparız” |
| R3-6 | Spor, kaydırma | “spor kapsamlıdır kaydırma meselesi olmaz günlük klâsik şeyler yapacağım için hiçbiri eksik kalmayacak hepsi aynı olacak sporda” |
| R4-0 | Spor oranları | “Oranlar şu şekilde %50 dayanıklılık %30 güç %15 denge %5 çeviklilik olarak söylüyorum 70-80 dakikalık çalışmaya göre yapilandirirsin ama kesinlikle yapılması lazım ile isteğe bırakılan olarak yapilandririsin” |
| R4-2 | Plakalar | “4 tane 10 Luk 2 tane 5 lik koyuyorsun 50 oluyor çünkü ya kısaca 4 tane 2.5 4 tane 5 4 tane 10 Luk var artık onu sorgulama yapma” |
| R4-3 | Güvenlik tutacakları | “güvenlik tutacakları var sağlam” |
| R4-4 | Göz | “sürekli gözlük takıyorum gözlük bulanık gordurtmuyor göz veya baş ağrısı olmuyor” |
| R4-5 | İşitme | “işitme çok değişken sessiz ortam olsun konuşma hızlı ve yogunsa duyamiyabiliyorum ya kısaca duyma oranım çok değişken” |
| R4-6 | Genel | “artık aynı soruları tekrarlama araştırmalar yap kapsamlı eğer cidden kişisel sorun varsa sor yoksa dosyayı güncelle” |
| R6-1 | Cihaz | “Evet Windows 11 pro olması lazım  USB c kablolu” |
| R6-2 | Planlama | “dakika cinsinden yapılandırmayı hiçbir zaman sevmem hedef x kadarsa akşam a kadar ulaşmak yeterlidir” |
| R6-3 | Dinleme hedefi (düzeltme) | “Böyle birşey dememiştim aslında ben dinleme algılama gibi testler ile dinleme testleri yapmayı hedefliyordum sonra dinlediğimi anlama en sonda kombinasyonlu çalışma olarak hedefliyordum yani dinle haraket yap duyarak aynı anda iş yap gibi birşey” |
| R6-4 | İngilizce amacı | “İngilizce amacı network için ve artık aı gerekmeden rahatlıkla anlayıp dinleyebilme” |
| R6-5 | Okuma ve not | “Kitaplarda PDF lerde az oluyor not almıyorum alsamda unutuyorum” |
| R6-6 | Süreklilik ve başlangıç | “aslında devam edebilirdim ama tamam dedim iyi gittik yeterli gibi hissettim mola verdikten sonra düzgün anı bekledik ve bu hafta olarak karar verdim” |
| R6-7 | İlaç | “düzenli ilaç kullanımı yok” |
| R6-8 | Yedek | “yedek ve aktarma önerin olsun” |
| R7-1 | Hafta 1 ve derin çalışma | “Hafta 1  uygulamali başlıyoruz ama nerede ne olduğumuzu hepsini öğrenip hafta 2 ve sonraki günlerde ise derin çalışma olacak olarak hedefledim önerilerin varsa önerilerini kabul ediyorum” |
| R7-2 | Akşam sınırı | “uyuyana kadar olarak söylüyorum 23 gibi” |
| R7-3 | Network | “yani her türlü amactan dolayı network gerekli” |
| R7-4 | Yeterlilik / 3 ay | “bu yeterlilik  onayı vermem şuan artık 3 ay çalışırsam böyle durmamayi gaye edinmek” |
| R7-5 | Kombinasyon çalışması | “daha farklı haraketlerden bahsettim görev akışları olarak her türlüsünden bahsettim mesela klavyede kendi fikrimi yazarken birisi ile konuşup yazımda istediğimi yazıp konuşmayı da hatasız yürütme gibi hedefler olabilir karmaşık kombinasyon herşey olabilir önerinr bırakayım bu kısmı” |
| R8-1 | Hafta 1 ve test kavramı | “1. Hafta hiçbir haftaya benzemez çünkü 1. Hafta bittikten sonra test diye kavram sadece muhtemelen ingilizcede olacak o da 3-10-20-50 kuralı ile tekrar yapılarak olacak” |
| R8-2 | Diğer alanların standardı | “ötekilerin de ise bu standart var pratik çalışmayı kesintisiz sunar bazıları ise ilkte hazırlanma okuma 2. Sinde test ama o tek günde olur ve eski günün konusu atlanır ara sıra tekrar edilebilir” |
| R8-3 | Hafıza sarayı = ders | “Hafıza sarayı gibi şeyler ise onlar kendi başına dersdir ve çalışma prensipleri hatırlama ezberi rahatça aklına getirebilmeleri rahatlikla sürdürülebilir” |
| R8-4 | Tipler ve rapor | “diğerleri galiba canlı pratik makale ve ingilizce öğrenme haricî hepsi mekanik vücut eğitimi muhtemelen en baştan herşeye en baştan anlatırsın analiz ettirmeleri ona göre yaptırırsın raporları ona göre hazırlarsin” |
| R8-5 | Sağlık kontrolü | “Bide garanti olması için hem gözcüye hem kulak burun a hemde dişçiye giderek yapılabilirse ise check up yaptirabilirsem onu da yaptıracağım” |
| R8-6 | Partner yok, örnek | “partner yok ama örnek verdim mesela sana prompt yazıyorum yazarken birisi ile konuşurken prompta hatasız devam ettirebilme her türlü durumda olabilir çünkü yalnız değilim olacak durum oluyor ondan dolayı geri kalanı öneri olarak bırakıyorum” |
| R8-7 | Sorma talimatı | “kişisel sorun varsa sor ama net Bilgi bu dişçi kulak göz ve burun ne zaman gideceğim kesin değil ondan dolayı sormanı istemiyorum” |

### R-mesajları (derleme sonrası)

**R0 — Bu belgenin güncellenmesi talebi**
> Attığım raporu oku ve kendi dusuncelerini fikirlerin ile hibritleyeceksin ama sorular sormani istiyorum sorular sorduktab sonra yanıtlayacagim ve ona göre verdiğim dosyayı güncelle

**R1 — İlk soru turu cevapları (seçilen seçenekler + serbest not)**
> Anahtar: Her maddede 3. gönderimde (Önerim) · Tamamlanma: Adımlar + yanıt ya da 'bilmiyorum' (Önerim) · Birikim: Kural aynı, bölme seçeneği sunulsun (Önerim) · Hafta 1 testleri: Dinle + başka iş yap, Okuma ve satır takibi, Gecikmeli hatırlama, İngilizce profil
> Serbest not: İstediğin her türlüsü olabilir sana bırakıyorum yapacağın araştırmalar 4 gün çalışma içinde ne yapılacak başka uygulamalar daha iyiyse o uygulamaları önermeni eğer yoksa  kendin hazırlamanı webden aradtirmalar yapmanı istiyorum

**R2**
> Ayarlanabilir dambıl 1 tane var diğeri ayarlanmiyor çoğunlukla yok nadiren bakabilir ama  2024 son ayları göz hastanesine gittim
> Spor blokları her zaman o stile uygun olmalı en azından hafta içi uyumlu olmalı  test günleri esnetebilmeli olmali geri kalanı onerine bırakıyorum diğer soruları da kendi önerilerine göre cevapla kişisel soru varsa sor yoksa dosyayı güncelle

**R3**
> Sabit 5 kg  en fazla 20 kg  oluyor halter barı zorlarsak 50 kg halter kaldırırken bir sorun yaşarsam diye ama çoğunlukla hayır bakmaz  iki kulakta olmalı muhtemelen ama bilgim yok test süresi olarak dedim ama spor da da test istiyorsan farklı ona göre yaparız spor kapsamlıdır kaydırma meselesi olmaz günlük klâsik şeyler yapacağım için hiçbiri eksik kalmayacak hepsi aynı olacak sporda

**R4**
> Oranlar şu şekilde %50 dayanıklılık %30 güç %15 denge %5 çeviklilik olarak söylüyorum 70-80 dakikalık çalışmaya göre yapilandirirsin ama kesinlikle yapılması lazım ile isteğe bırakılan olarak yapilandririsin 4 tane 10 Luk 2 tane 5 lik koyuyorsun 50 oluyor çünkü ya kısaca 4 tane 2.5 4 tane 5 4 tane 10 Luk var artık onu sorgulama yapma güvenlik tutacakları var sağlam  sürekli gözlük takıyorum gözlük bulanık gordurtmuyor göz veya baş ağrısı olmuyor işitme çok değişken sessiz ortam olsun konuşma hızlı ve yogunsa duyamiyabiliyorum ya kısaca duyma oranım çok değişken  artık aynı soruları tekrarlama araştırmalar yap kapsamlı eğer cidden kişisel sorun varsa sor yoksa dosyayı güncelle

**R5**
> Redmi 13 pro plus hyper oss 3 sürümü olan dosyasını tamamen yazıp güncelleyip bana sun eğer hâlâ soruların varsa sor eksik kalmasın raporu boşuna sana sormadım gpt nin yapamadığını yapıp daha profesyonel analizler yapmanı istedim

**R6**
> Evet Windows 11 pro olması lazım  USB c kablolu dakika cinsinden yapılandırmayı hiçbir zaman sevmem hedef x kadarsa akşam a kadar ulaşmak yeterlidir
> Ses, ritim, nota ayrımı: Müzik veya enstrüman geçmişin var mı? "Ayırt etmek" ile kastın ne: sesin yüksek/alçak olduğunu ayırmak, ritim taklidi, melodi ayırmak, enstrüman çalmak? Bunu netleştirmediğim için bu alanda şimdilik hiçbir ölçüm tasarlamadım.
> Böyle birşey dememiştim aslında ben dinleme algılama gibi testler ile dinleme testleri yapmayı hedefliyordum sonra dinlediğimi anlama en sonda kombinasyonlu çalışma olarak hedefliyordum yani dinle haraket yap duyarak aynı anda iş yap gibi birşey
> İngilizce amacı network için ve artık aı gerekmeden rahatlıkla anlayıp dinleyebilme
> Kitaplarda PDF lerde az oluyor not almıyorum alsamda unutuyorum  aslında devam edebilirdim ama tamam dedim iyi gittik yeterli gibi hissettim mola verdikten sonra düzgün anı bekledik ve bu hafta olarak karar verdim düzenli ilaç kullanımı yok  yedek ve aktarma önerin olsun

(Mesajdaki “Ses, ritim, nota ayrımı…” satırı, kullanıcının önceki asistan sorusunu yapıştırıp “böyle bir şey dememiştim” diye cevapladığı alıntıdır.)

**R7**
> Hafta 1  uygulamali başlıyoruz ama nerede ne olduğumuzu hepsini öğrenip hafta 2 ve sonraki günlerde ise derin çalışma olacak olarak hedefledim önerilerin varsa önerilerini kabul ediyorum uyuyana kadar olarak söylüyorum 23 gibi yani her türlü amactan dolayı network gerekli bu yeterlilik  onayı vermem şuan artık 3 ay çalışırsam böyle durmamayi gaye edinmek  daha farklı haraketlerden bahsettim görev akışları olarak her türlüsünden bahsettim mesela klavyede kendi fikrimi yazarken birisi ile konuşup yazımda istediğimi yazıp konuşmayı da hatasız yürütme gibi hedefler olabilir karmaşık kombinasyon herşey olabilir önerinr bırakayım bu kısmı

(R7, Q1–Q5 sorularına verilen cevaptır: Q1 Hafta 1 başlangıcı, Q2 akşam sınırı, Q3 network, Q4 yeterlilik, Q5 dinleme merdiveni / hareket türleri. Bu tarihsel turda açık kalan uygulamalı ifadesi R9 ile eğitim kaynağı/özel içerik ilkesi olarak netleşti.)

**R8**
> 1. Hafta hiçbir haftaya benzemez çünkü 1. Hafta bittikten sonra test diye kavram sadece muhtemelen ingilizcede olacak o da 3-10-20-50 kuralı ile tekrar yapılarak olacak ötekilerin de ise bu standart var pratik çalışmayı kesintisiz sunar bazıları ise ilkte hazırlanma okuma 2. Sinde test ama o tek günde olur ve eski günün konusu atlanır ara sıra tekrar edilebilir
> Hafıza sarayı gibi şeyler ise onlar kendi başına dersdir ve çalışma prensipleri hatırlama ezberi rahatça aklına getirebilmeleri rahatlikla sürdürülebilir diğerleri galiba canlı pratik makale ve ingilizce öğrenme haricî hepsi mekanik vücut eğitimi muhtemelen en baştan herşeye en baştan anlatırsın analiz ettirmeleri ona göre yaptırırsın raporları ona göre hazırlarsin
> Bide garanti olması için hem gözcüye hem kulak burun a hemde dişçiye giderek yapılabilirse ise check up yaptirabilirsem onu da yaptıracağım  partner yok ama örnek verdim mesela sana prompt yazıyorum yazarken birisi ile konuşurken prompta hatasız devam ettirebilme her türlü durumda olabilir çünkü yalnız değilim olacak durum oluyor ondan dolayı geri kalanı öneri olarak bırakıyorum kişisel sorun varsa sor ama net Bilgi bu dişçi kulak göz ve burun ne zaman gideceğim kesin değil ondan dolayı sormanı istemiyorum

(Tarihsel not: R8 sırasında açık kalan tekrar tanımı ve başlangıç kapsamı R9 ile netleşti; güncel durum 8.8 ve 16.1'de.)

**R9 — Son açıklama ve işe başlama talimatı**
> Günler arasında tekrarlar 3 gün sonra tekrar 10 gün sonra tekrar gibi ilk hafta 4 gün çalışma 3 gün test yani 4 günlük çalışma kısmında dış uygulamalar çok iyiyse orası tercih edilecek eğer iyi değilse veya yoksa sen yapacaksın ona göre webden aradtirmalar yapmanı falan istiyorum ve ona göre işe koyulmani istiyorum

**R10 — v11 hata analizi ve düzeltme talimatı (27 Ekim 2026)**
> Hepsini oku hataları analiz edip gider daha profesyonel hale getir sorunları çöz o 220 kb galiba o Md dosyasına bakarak guncellersin mantıksal hataları giderrirsin sorunları çözersin sistem sorunları daha profesyonel yapılandırma vs. Vs. Hepsini kapsayan bir çalışma yaparsın kodları hem düzenleyip hataları giderdikten sonra raporla zip dosyasını hepsini teker teker eksiksiz şekilde analiz etmen şart eğer sorularin olursa kesinlikle sorabilirsin eğer yoksa ana gayeye göre yapilandirirsin

(R10 ile birlikte bir ZIP paket eklendi. Mesajda soru zorunlu tutulmadı; sorular gerekmediği için sorulmadı, varsayımlar `09_DEGISIKLIK_VE_HATA_RAPORU.md` içinde yazılıdır.)

### U-mesajları (ilk derleme öncesi)

### U1 — Başlangıç hedefleri

> Sırasıyla makale okuma hangi makaleleri okuyacağım ingilizce dil eğitimi nasıl olacağı
> Çok ölçekli hatırlama yeteneği kazanabilme hafıza sarayıni kullanabilme göz kas gelişimi kulak duyma becerisi ve günlük yapılacak klâsik sporlar hiçbirinde birşey demeyeceğim ama spor kısmında söyleyeceğim bazı kısımlar var onların haricinde sen söyleyeceksin damble var 5 kilo olur 10 kilo olur 15 20 de olur uzanıp iki kolunu kullanarak kaldırıp indirdiğin damble in daha büyük ağırlık var
> Günlük 40-50 dakika spor yapacağım 1 saat e kadar çıkabilir sabah 15 dakika öğle 20 dakika akşam kendi istenilen kadar 20-40 dakikaya çıkabilir dağınık bir düzen olacak denge güç dayanıklılık en sonda çeviklilik ama en düşüğü çeviklilik olacak şu anlık eğer sorularin varsa sor ardından fikir yürüteceğiz ve yapabileceklerim herşeyini orada fikir yürüteceğiz

### U2 — İngilizce, duyular ve zaman açıklaması

> İngilizcede şu anda hangi durum sana daha yakın?
>
> 1000 kelimeden az kelime bilgim var ama uzun zamandır İngilizce dili dinlemedim ve çevirileri de denemedim ve çoğunlukla cümle kurmakta zorlanıyorum temel kelimeleri bilmiyor olabilirim ama kelimlerin bazılarını vs. biliyorum
>
> Göz ve kulak becerilerini geliştirmek derken hangilerini kastediyorsun?
>
> Okurken satır takibini ve görsel dikkati geliştirmek, Daha net görmek veya göz yorgunluğunu azaltmak, İngilizce konuşmaları duyarak daha iyi anlamak, Sesleri, ritimleri veya müzik notalarını daha iyi ayırt etmek, dinlerken aklıma kaydetme ve kombinasyonlu görevleri yapabilme yani pilot olacağım gibi düşün hem dinliyorum hem uçağı sürüyorum hemde radara bakıyorum bu sadece örnekti ama hem dinlerken hafızama katıp denilenleri rahatlıkla hatırlayabilir ve denilen görevi zaman fazla bile geçse görevde unutmamak ve görevi sürdürebilme yani duyu sadece dinleyip unutma değil hafızamda yerlestirebilme gereklli iş ise hafızama kaydedip unutmama tüm akışı sırasıyla bilebilme eğer hâlâ anlamadiysan sorabilirsin
>
> Sporun dışında makale okuma, İngilizce ve hafıza çalışmaları için toplam ne kadar günlük zaman ayırabilirsin?
>
> günlük süre yerine haftalık süre olarak guncelleyelim ilk 2 hafta deneme 3. hafta artık tüm akış sağlanmış ve görevleri sırasıyla uyabilme sporun dışında düzgün süre yok onu öğrenmek için deneyip test etmeliyiz ama saat verilerini verirsek 6.5 saatim var ve 6.5 saatin hepsini günlük olarak kullanamam ondan dolayı düzgün süre yok denem sonrası bilgimiz olacak daha fazla sorun varsa sor

### U3 — Yaş, spor geçmişi ve unutma örnekleri

> 17 yaşıma giriyorum 2 ay a 176 cm 78 kilo sakatlık yok şu anlık 1.5 yıl önce 3 ay aktif spor yapıp bırakmıştim şimdi tekrardan devam edeceğim yağ oranı %22-24 arası olabilir
> Hafta içi o yükleri kullanabiliyorum evet halter evet alan da var uzanilan alan var
> Bazen 5 saniye önce dediğimi unutuyorum ve çoğunlukla unutuyorum uzun ölçekli ise çok fazla hatırlamak istediğim şey ise yarım gün kadar hatırlsyabiliyorum ama orta ölçekli ise rahatlıkla unutabiliyorum mesela ders anlatisi oluyor onu anlık olarak dinliyorum ama başında derse neyden bahsettiğimizi unutabiliyorum ve dahası

### U4 — Uyku, bir haftalık deneme ve test tasarımı

> Muhtemelen düzende şu anlık mantık 23-24 arası yatarım 6.30-7.15 ise uyanmayı hedefliyorum öğle vakitleri şekerlemeler yarım saat şekerleme yaparım veya 1 saate kadar bile çıkabilir ama 30 dakika diye dusjn onu
> Bu aslında vardı 7 yaşımdan önceki zamanı hatırlamıyorum mesela
> Aslında ölçüm testi 1 hafta sürebilir ikinci hafta hedeflere koyulabiliriz
> Bana sorarsan uygulama yapmanı istiyorum ingilizce için busu gibi ingilizce eğitimi sunanlari kullandirmani ardından test haftası bitmeden son 3 gün kala idr busu gibi ingilizce eğitimi sunan çalışma yerine senin hazırlayacağın profesyonel yapılandırılmış konuşma sesini dinleyen whisper kullanıp okumayı dinleme yazı olarak nasıl yazıldığı ne istendiği boşlukları dolduracağı kelime yerleştirme gibi A1 A2 A3 testleri yaparsın nasıl konuştuğumu dinlersin raporlar sonucunda ne yazdığıma bakarsın ve sonrasında gerçekten hangi seviyede olduğunu kelime bilgim hangi seviyede olduğu kapsamlı bir test olur grammer bilgisi vs. Vs. Bilgileri ölçüp test etmiş ve rapor hazırlanan sistem olmuş olur diğerleri de bu mantıkta olur 4 gün çalışma teknikleri ne yapılacağı belki hangi uygulama kullanılacağı her türlü şey söylenir ve test sonrasında hedefleneni ölçme makale okudun ne anlatıyor anlayabildin mi anlatabilirmisin anlayarak anlatabilirmisin cidden eksikler var mı diye testler olur makale de mesela sesli olarak anlatırsın whisper sesi transkripte eder ama İngilizcede transkripte yerine tam lafız duyma olacak ondan dolayı ses kaydedici diyebiliriz mesela ciddende araştırdin bulamadın senin yapacağın uygulamada o 4 günlük çalışmayı sunan eğitim olacak kesinlikle soruların vardır sor cevaplayayım

### U5 — Cihaz, ücretsiz araçlar ve checkpoint

> Uygulamayı hangi cihazlarda kullanacaksın?
>
> Android telefon ve Windows bilgisayar
>
> Eğitim uygulamaları ve otomatik ses değerlendirmesi için bütçe yaklaşımın nasıl?
>
> ücretsiz olanları kullanalım açık kaynak olanları eğitim uygulamaları zaten var oradaki kendi gelisimim testleri etkilemez eskiyi hatırlatır
>
> Sesli yanıtlarından sonra değerlendirmeyi nasıl almak istersin?
>
> senin hazırlayacağın uygulamada checkpoint sistemi ile en güncel yer kaydedilir 1 hata yapsanda kayıt durmaz testte o soruda 5 kere soru 1 de durdun ve hatalı yaptın mesela düzeltmeler izlenir ve en son hata nedenini söyler hata sebebinin altında doğru sonuç yazar eğer isterse oradan okuyabilir eğer istemezse okumaz ve raporh sunar eğer okumadiysa bilgilendirmelidir yani rapor küçük değil devasa kalitededir sesli kayıttan txt kayitina kadar tutar ve hafızasında kaybolmaz ege r hâlâ sorun varsa sor

### U6 — Erken geliştirmeye itiraz

> Sadece adam akıllı sorular sor hâlâ eksikler varken bana soru sorman lazimken işe koyuldun ben bilerekten sormanı zrolayamaya çalışıyorken sorular sor cevaplayayım eksik kalmasın diyorum hâlâ soru sormuyorsun istediğini yapıyorsun ve ben günlük çalışmaya başlayınca onlarca sorunu yakalayacağım çok fazla sorun olmuş olacak

### U7 — Eğitim, rapor, makaleler ve spor önceliklerinin ayrıntılanması

> Dersler oldukça dışarıdan olacak gerçekten insanları o kısımda gelistiriyorsa ve gerçekçi raporlar geliyorsa o zaman olur eğer öyle raporlar yoksa kendin yapmalısın evet telefok ve bilgisayar çalışır olmalı uygulama içinde önereceğin uygulamalar sadece telefonla çalışması yeterli çoğu yapılabilir olmalı 4. Soruda ki önerin ne ise o olsun uygulama puanlamaz sadece ses kayıtlarını yazıları kaydeder Amerikan tarzı konuşmak daha basit ondan dolayı Amerika tarzı olmalı kullanıcı doğru cevabı isterse açılması gibi bir mekanik ile açması ama 3 kere hata yapınca da açılabilir olması 8. Soruyu da sana bırakıyorum yarım saati aşmaz gibi ama zorlarsam 1 saat eğer uygulaması varsa öyle bir görev ağacı önemsiz x çalışma için ama senin yapacağın uygulama içerisinde ise günlük hedefler normaldir eğer yapılmaz ise beklenmesi onerilmesi en normalidir onu yapinca ardından yapmasi lazım günün ki mi yapabilir öncelik yok hepsi çok önemli ilk önce yabancı dil i de kabul ederim makalede ama kesin okurum diye birşey yok sadece okurum eğer okuyamazsam ise senin ağzın ile tercüme edilmiş yazıyı sunman daha iyi olur kendin çevirmiş olmandir zaten benim kim olduğumu ne yaptığımı ne sevdiğimi biliyorsun ama detay vermem gerekirse makaleler diğer makaleler ile celismemesi başlangıçta o konu ile basit anlatımlı olup sonrasında ise eğer o konuda ki bilgileri biliyorsam kavramları i zaman basit dil anlatılmayan makalelere geçme olacak gerçek olması muhtemel teoriler yerine gerçekleşebilecek teoriler okumak daha iyi olur bu teori okumalıyım sorusuna cevabım diye düşün ilk önce 5 tema ayır ve 5 temadan 5 farkli konu edinsin 1 i si x konusunu diğeri y diğeri Z gibi benim tercih etmem kendime kalmış hangisini okumam sende link + tercümesini koyarsın Türkçe ise Türkçe yazıyı kopyalayıp oraya geçirirsin ve link sunarsin nedeni link çalışmayabilir evet istersen farklı farklı saat zaman kategorileri ile olcebiliriz istersen en sonki hatırlama testinde 1 tane bilgi yerine iki farklı bilgi ile karmaşıklastirabilirsin testi
> Sporda dediğim şey sırasıyla dayanıklılık güç denge ve çeviklik eğer bunlara göre yapilandirirsan yapıyı uzun süreli aynı şeyi yaptığımda zorlanmamaya başlamam ardından güç kazandığım için ise daha fazla kaldirabilme denge ise tam ortada durabilme birşeyi taşırken birşey yaparken yamulmak yerine düzensiz bir görüntü yerine dümdüz denge içinde durabilme çubuk olur mesela onun üstünde dimdik tek ayakla durabilme örnekti ama öyle bir malzeme var demek değil
> En sonda çeviklilik vücudumu daha hızlı esnetebilme bunun amacı dövüş sporlarında ki hantal çalışma yerine çevik hızlı refleks verinen hızlı ama acele olmadan profesyonel çalışmayı sağlayabilme
> Ayarlanabilir olabikiyor birisi sadece ayarlanabilir diğeri 5 kilo 10 kiloluktan 4 tane var sadece ağırlık cinsinden söylüyorum dambıl için değil 4 tane 5 kilo 4 tane de 2.5 kilo var evet sporda uzanıp halter kaldirabilme yeri gözlük kullanıyorum ona göre yorumlayabilirsin odak testleri de vardı dimi sorun olmasın çünkü bazen odaktan dolayı satır kayıyor

### U8 — Hüküm vermeyen rapor, tek ZIP, 50 makale ve unutma takibi

> Uygulama puan veremez sadece rapor verir doğru yanlış birşey adam akıllı geliştirmek ama test olduğu için yapabilirsin ama çok az yap metin okuma çevirme gibi testlerde olabilir serbest yazı tercih edilmesi iyi olur ama sadece boşluk doldurma az da olsa olabilir yanıtlar çoğunlukla nesneldir ama sistem sadece şöyle söyleyebilir 1. De şu yanıtı verdi ama sistem bu yanıtı bekliyordu 2. Sinde böyle yanıt verdi 3. Sinde böyle yanıt verdi ve cevap anahtarı açıldı 4. Seferde ise doğru yanıtı verdi ve şöyle söyledi gibi asla doğru yanlış diyemez sadece cevap anahtarı olur ve rapor sunulur istediğim zaman açılabilmesi ve 3. Sefer de hatalı ise otomatik açılması ikiside olacak raporlar tek bir zip dosyasında kaydedilecek eğer ses kaydı varsa o zaman dosya adı ve uzantıyi verir soruyu verir hangi sorunun cümlesi idi onlar gösterilir x metin olduğunu ve tüm metin yazısı görür mesela ona göre cevap verirsin böylece 1 dosya ile gereken tüm işlemleri yapabiliriz kaydırma yok dünkü hedefi tamamlayacak ve günün hedefini yapmaya koyulacak eğer o zamanda yarım kalırsa diğer güne böyle böyle devam edecek 5. Soruyu tam anlamadım otomatik veri aktarımı olmayacak zaten dışarıdan çalışılan çalışma ile içerisi bağlantılı olması gerekmez ama sadece isterse raporu olur ve dersi söyler ve rapor sunar istediği gibi bu olabilir ama isteğe bağlı olacak onlar toplam 25 konu her konudan 2 tane makale olarak 50 makale istiyorum soyut veya somut olabilir gerçek test edilmiş teori teori olmaz eğer doğru ise kapsamlı her konudan olabilir ama bilgi gerekli olduğunu hissetmeliyim unuttu ve neyi hatırlayacağı aklına gelmiyorsa kaydedilir ve yeni bilgi veya görev verilir o da test edilir yine erkenden unuttuysa muhtemelen hatirlanmis anın ile hatirlamiyorken ki anın arasında tahmini dakika söyleyebilir ve yine zaman testi devma eder yeni farklı iş ile evet ne olursa olsun çoğunlukla unutuyorum ama kalıp kelimeler kalabiliyor çoğunlukla çok sevdiğim ve saran bir konu ise ve 3 ten fazla kez düzenli şekilde dinliyorsam da o zamanda değişir orada kalıplar ve birazi artık aklımda kalabiliyor oluyor odagim kayıyor ve 2 satır veya aynı satıra geri dönüyorum 1 tane dambıl sapı var 2 tane dambıl var evet halter barı ni koyacak yer var kafa hizası yukarısında yatma pozisyonuna göre . Hafta içi her saat aslında dayanıklılık kapsamlı dediysem cidden kapsamlıya göre düşünmelisin
> Evet var şuan kesin olmayan 3-4 saatimiz var olduğunu analiz ettim spor dahil olmadan

### U9 — Günlük süre, hafta sonu, göz ve işitme

> Tamam önerini kabul edeceğim günlük zaman olarak çıkıyor hedef 7-7.30 saat yatmak ona göre düzenlenlenen saat düzeni olacak hafta sonu erisemem güvenlik destekleri var tutacaklar evet o zamanda oluyor ikisi dahil ekran ve kitap ama çoğunlukla kitapda oluyor kulak kısmı ikili dahil duyma oranım normal insanlar 20000 Hz duyabiliyorken bende 17500 falan galiba tam kaliteli de duyamıyorum normal sesteki konuşmayı bazenleri anlamlandiramiyorum veya duyamıyorum şu anlık yaptığım dövüş sporu yok
> Eğer hâlâ soruların varsa sor işe geçme

### U10 — İşitme tahmininin geri çekilmesi, 2–4 saat ve ses kaydı sınırı

> Çünkü şekerlemeler dahil 8 saat yatmış oluyorum ve onlar çok daha uzun süreli uyanık kalmamı rahatlatıyor
> 17.500 Hz sonucunu nereden elde ettin? Salladım çünkü biraz zayıf duyuyorum 2 yıla yakın hayır nadiren öyle çınlama lar oluyor
> Hayır girmiyor tyt falan olmuyor ama kesin süre değil 2 saat im var gibi düşünüp 4 saate kadar çıkarabiliriz gibi düşünmeliyiz hayır sadece sunulan yerlerde ses kaydı kullanılacak sorular hâlâ sorabilirsin webden araştırmalar yap eğer sorun yoksa bile duracaksın ondan dolayı gerekli sorularını sor

### U11 — Son açıklama ve bu raporun talebi

> Son göz kontrolüm 1 yıldan önceydi
> Heryerde duyamıyor olabiliyorum
>
> Şimdi tüm raporu hazırlamanı istiyorum kod yazmayacaksin sadece rapor yazacaksın eksik sorular cevaplanmamış anlaşılmamış sorular olsun tüm raporlar olsun tüm analizler olsun bu konuştuğumuz bu sohbette ki konuşmalar olsun başka aı a vereceğim onunda sorulari oldun fikirleri olsun düşünceleri olsun muhakeme etmesine zarar vermeden rapor promptu hazırla ona sunacağım raporu

---

## Ek B. Yanlış aktarılmaması gerekenler

**Hedefler ve planlama**
- Kullanıcı **dakika cinsinden yapılandırmayı sevmiyor**; plan çıktı (hedef) olarak sunulur, hedefe akşama kadar ulaşmak yeterlidir (D24). Belgedeki dakikalar kapasite analizi ve otomatik gözlem içindir.
- **“Ses / ritim / nota ayrımı” kullanıcının hedefi değildir**; önceki asistanın soru seçeneğiydi. Gerçek hedef: dinleme–algılama → anlama → dinle + hareket (D25).
- İngilizce amacı: **her türlü amaç için network** ve **AI gerekmeden** rahatlıkla anlayıp dinleyebilme (D26, D31). Belirli bir network alanı yok.
- **“Akşam” = uyku öncesi, yaklaşık 23:00** (D30); gün sonu sınırı yatışa bitişiktir.
- **Üç aylık hedef sürdürmedir** (“böyle durmamak”); kullanıcı skill temelli bir yeterlilik onayı **vermedi** (D32). Seviye iddiası yapılmaz.
- Kombinasyonlu çalışma yalnız fiziksel hareket değildir; **dinle, konuş, yaz, hareket, hatırla** kanallarının geniş kombinasyonlarıdır (D33).
- R9: ilk hafta 4 gün çalışma + 3 gün test; iyi dış eğitim, yetersiz/yoksa özel materyal. Dört günün özel uygulamada geçmesi zorunlu değil. Araştırma ve üretim başlatıldı; kayıt yazılımı henüz yok.

**Sağlık ve ölçüm**
- 17.500 Hz bir işitme ölçümü değildir; kullanıcı “salladım” diyerek geri çekti. İşitme yüzdesi veya aralığı üretilmez.
- İşitme güçlüğü “gürültüde duyamama” değildir; **sessiz ortamda da hızlı / yoğun konuşmada** ortaya çıkıyor ve çok değişken. Muayene geçmişi bilinmiyor.
- Gözlük sürekli takılı ve bulanık göstermiyor; göz / baş ağrısı yok; **çift görme belirtilmedi** (“yok” yazılmaz). Son göz kontrolü 2024'ün son ayları; numara ve sonuç bilinmiyor.
- Satır kaybı beyanı çelişkili (kitapta çok → kitap / PDF'te az); en çok olduğu ortam belirtilmedi.
- Düzenli ilaç yok; bilinen tanı / hekim kontrolü bilgisi verilmedi (“tanı yok” yazılmaz).
- Yedi yaş öncesini hatırlamamak, unutkanlığın o yaşta başladığına dair kesin tarih değildir. %22–24 yağ oranı ölçülmüş değildir.
- Pilot örneği meslek hedefi veya pilotluk yeterlilik ölçüsü değildir. Hafıza sarayı başarısı bütün günlük unutkanlığın çözüldüğü anlamına gelmez.

**Uygulama ve kayıt**
- Uygulama puan, yüzde, doğru / yanlış hükmü veya otomatik teşhis vermez.
- Açılmış anahtar, **okunmuş veya anlaşılmış** anahtar demek değildir; ekranda görünmek de okunmak değildir.
- Anahtar sonrası deneme bağımsız ilk yanıtla aynı kategoriye konmaz.
- Başka yapay zekânın raporu yorumlaması ile uygulamanın hüküm vermesi farklı şeylerdir.
- Whisper / Anki / Busuu / belirli bir teknoloji zorunlu seçilmedi. Transkript özgün sesin yerini tutmaz.
- “A3” testi yoktur (CEFR: A1–C2). Özel test CEFR sınavı değildir.
- Amerikan İngilizcesi tercihi öznel bir tercihtir; nesnel olarak daha kolay olduğu iddia edilmez.
- Dış eğitim araçlarıyla otomatik veri aktarımı istenmiyor; ses kaydı yalnız belirlenmiş görevlerde. Kullanıcının kendi iki cihazı arasındaki aktarım ayrı bir konudur (Bölüm 6.9).

**Test kavramı, tipler ve sağlık (R8)**
- “1. Hafta” = **Hafta 1**; soru numarası değildir. Hafta 1 hiçbir haftaya benzemez; Hafta 1'den sonra “test” kavramı **muhtemelen** yalnız İngilizce'de (D34).
- **“3-10-20-50”** R9 ile önceki çalışmadan gün aralıkları olarak doğrulandı; nominal 3/13/33/83. Kullanıcıda üstünlük kanıtı veya uzun dönem yükün yarıya indiği iddiası yok.
- Diğer alanlarda standart **kesintisiz pratik**tir; “hazırlık → test” ikilisinin hangi alanlarda olduğu belirtilmedi (V2). “Eski günün konusu atlanır” ifadesinin D04'ü kaldırdığı **varsayılmaz** (V3).
- Alan tipleri kullanıcının “galiba / muhtemelen” dediği bir sınıflamadır (D37); Claude'un eşlemesi (C0–C3 mekanik, C4–C6 canlı pratik) uygulamadır.
- Yeniden harita kullanıcı tarafından **açıkça kaldırılmadı**; R8-1 ile çeliştiği için varsayılan olarak kapatıldı (T19, V5). Kullanıcı isterse yeniden açılır.
- **Konuşma partneri yoktur** (D39). “Yalnız değilim” cümlesi, çevrede başkalarının bulunduğu gerçek durumlara işaret eder; bir partner veya katılımcı olduğu anlamına gelmez.
- Göz, KBB ve diş check-up'ı **planlanıyor, yapılmadı**; tarih belirsiz, sorulmaz (D38). Sonuç yokken işitme veya görme hakkında yorum yapılmaz.

**Spor**
- Günlük spor **70–80 dk eşdeğeri iş yüküdür**; hedefler çıktı birimiyle yazılır; eski 40–50 / 60 dk hedefleri geçersizdir.
- Oranlar %50 / %30 / %15 / %5’tir; çekirdek ve eklenti ayrımının **içeriği ve sayısal örnekleri Claude önerisidir** (G09, G16).
- Plaka envanteri 70 kg’dır (4 × 2,5 + 4 × 5 + 4 × 10); “50 kg” = 4 × 10 + 2 × 5 plaka toplamı, **bar hariç**. Barın kendi ağırlığı bilinmiyor.
- Dambıllar eşit değildir: biri sabit 5 kg, biri ayarlanabilir en fazla 20 kg.
- Gözetim çoğunlukla yoktur; güvenlik tutacakları kullanıcıya göre sağlamdır.
- Test günü esnekliği **test süresi** içindir; spor için kaydırma kuralı yoktur.
- Çubuk üstünde denge örneği, ekipman bulunduğu anlamına gelmez. Şu anda dövüş sporu yok.
- Başka sohbetlerdeki programlar (ör. PPL) bu düzene aktarılmamalı.

**Makale ve genel**
- Beş tema ve 25 konu **başlık taslağıdır**; 50 makalelik doğrulanmış kaynakça henüz yok.
- Günlük 2–4 saat kesin ve zorunlu çalışma taahhüdü değildir; spor, okul ve TYT dışındaki tahmini kapasitedir.
- Önceki prototip (“Odak Atölyesi”) onaylı tasarım değildir.
- Telefon **Redmi Note 13 Pro+ 5G**’dir (kullanıcı onayladı); Windows 11 Pro “olması lazım” şeklinde bildirildi; kulaklık USB-C kablolu.
- Başka sohbetlerden gelen aktif proje, uzmanlık veya cihaz varsayımları bu belgeye eklenmemelidir.

---

## Ek C. Sürüm günlüğü

| Sürüm | Tarih | Değişiklik |
| --- | --- | --- |
| v1 | 26 Ekim 2026 | İlk aktarım raporu ve değerlendirme promptu. |
| v2 | 26 Ekim 2026 | R1 cevapları, Claude'un hibrit değerlendirmesi, K20–K29, ikinci soru turu. |
| v3 | 26 Ekim 2026 | R2 cevapları ve devredilen kararlar, K30. |
| v4 | 26 Ekim 2026 | R3 cevapları, spor başlangıç gözlemi, K31. |
| v5 | 26 Ekim 2026 | R4 cevapları: 70–80 dk spor ve oranlar, plaka envanteri, işitme / göz bilgileri, K32–K39. |
| v6 | 26 Ekim 2026 | **Tamamen yeniden yazıldı ve birleştirildi.** Yeni: cihaz bilgisi (Redmi Note 13 Pro+ varsayımı, HyperOS 3), platform ve fizibilite analizi (Bölüm 5), veri modeli ve ZIP şartnamesi (Bölüm 6), ölçüm geçerliliği ve tek olgu tasarımı (Bölüm 7), risk kaydı (Bölüm 14), devredilen kararların geri alma koşulları (Bölüm 15), yeni sorular Q1–Q9 (Bölüm 16), K40–K51. Katmanlı güncelleme metinleri kaldırıldı; v5'in tarihsel hâli ayrı bir yedekte saklıdır. Kod yazılmadı. |
| v7 | 26 Ekim 2026 | R6 cevapları ilgili bölümlere işlendi: hedef-temelli planlama (D24; spor ve Hafta 1 çıktı birimleriyle yeniden yazıldı), dinleme hedefinin düzeltilmesi ve dinleme merdiveni (Bölüm 10.4; ses / ritim / nota alanı kaldırıldı), İngilizce amacı (Bölüm 8), cihaz doğrulaması (Redmi Note 13 Pro+ 5G, Windows 11 Pro, USB-C kulaklık), yedek ve aktarım önerisi (Bölüm 6.9), köprü protokolü (Bölüm 13.6), yeni riskler RK18–RK21, devredilen kararlar G15–G17, yeni sorular Q1–Q5, K52–K57. Kod yazılmadı. |
| v8 | 26 Ekim 2026 | R7 cevapları ilgili bölümlere işlendi: Hafta 1 uygulamalı ve harita amaçlı, Hafta 2+ derin çalışma (D28–D29, Bölüm 13.7); akşam sınırı ≈23:00 (D30, 3.5, 11.5); network her amaç için (D31); 3 aylık hedef sürdürme (D32, 13.9); geniş kombinasyon → C0–C6 merdiveni (D33, 10.4); geliştirme kapısı ve ilk sürüm kapsamı (5.11); hibrit başlangıç; yeniden harita takvimi (13.8); yeni riskler RK22–RK23; devredilen kararlar G17–G21; yeni sorular Q1–Q2; K58–K61. Kod yazılmadı. |
| v9 | 26 Ekim 2026 | R8 cevapları ilgili bölümlere işlendi: Hafta 1'den sonra “test” yalnız İngilizce'de, “3-10-20-50” tekrar kuralı (D34–D35, Bölüm 8.8, yük hesabı); diğer alanlar kesintisiz pratik, hazırlık → test günü (D36, 12.4); alan tipolojisi ve baştan anlatım (D37, Bölüm 4.4); yeniden harita varsayılan olarak kapatıldı (T19, 13.8, 7.9); sağlık kontrolü (D38, 10.5); partner yok ve gerçek-hayat kesintili yazma (D39, 10.6); yeni gerilimler T19–T24; riskler RK24–RK27; devredilen kararlar G22–G26; doğrulama bekleyen varsayımlar V1–V5 (16.1b); K62; Q2 cevaplandı. Kod yazılmadı. |
| **v10** | 26 Ekim 2026 | R9 güncellemesi: ardışık tekrar aralıkları, kaynak seçim ilkesi ve işe başlama talimatı işlendi. Hatalı yarım yük yorumu kaldırıldı. Resmî kaynaklar doğrulandı; ilk hafta içerik paketi hazırlandı. Kayıt yazılımı, Türkçe sesler ve cihaz doğrulaması tamamlanmış sayılmadı. |
| **v11** | 27 Ekim 2026 | v10 raporu ve ilk hafta paketinin hata analizi. Rapor: sürüm/tarih; 0.1; Bölüm 8.8 numarası (8.8 boşluğu kapatıldı, tüm göndermeler güncellendi); 13.2 gün tablosu paketle eşlendi (Gün 12–13 dahil); 7.8, 9.3, 9.5, 10.2, 11.7, 11.11, 11.13 düzeltmeleri; RK28–RK29; G21; K63–K74 notları; Ek A R10; D39 “Q2” göndermesi düzeltildi; Türkçe sesler artık üretilmiş ama insan dinleme kontrolünden geçmemiş olarak yazıldı. Paket: Gün 5–7 görev ve anahtar dosyaları ayrıldı, sesler yeniden üretilip bağımsız modelle doğrulandı, İngilizce tekrar takvimi (xlsx), manifest ve SHA-256 özetleri, dürüst eksikler listesi. Ayrıntı: `09_DEGISIKLIK_VE_HATA_RAPORU.md`. |

Not: Eski sürüm satırlarındaki “Q1–Q9” gibi etiketler o sürümün soru numaralarıdır; v10'dan itibaren kullanılmaz. Kalıcı kodlar D, G, T, RK, V, K ve R'dir. Bölüm 8.8'e yapılan göndermeler, eski sürümlerde “8.9” olarak yazılmıştır.
