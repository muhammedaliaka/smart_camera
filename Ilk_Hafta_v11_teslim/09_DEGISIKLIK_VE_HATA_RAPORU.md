# Değişiklik ve hata raporu: v10 → v11

27 Ekim 2026 · kapsam: `Ilk_Hafta_Kaynak_ve_Calisma_Paketi.zip` (v10) içindeki bütün dosyalar ve `10_ANA_RAPOR_v10.md` (216 183 bayt, “220 KB”lık dosya olarak yorumlandı).

Bu rapor üç soruya cevap verir: **Ne bulundu? Ne düzeltildi? Neyin doğrulanmadığı hâlâ açık?** Rapor puan ya da hüküm üretmez; “iyi/kötü” yerine her bulgunun **ne işe yaradığı ve nasıl denetlendiği** yazılır.

## 1. Kısa özet

- v10 paketindeki 26 dosyanın **tamamı tek tek okundu**. Bütünlük listesi (`checksums.sha256`) ile dosyalar uyuşuyordu; yani paket bozuk değildi, **içerik eksik ve tutarsızdı**.
- Zip'te **kaynak kod yoktu**; “kodlar” ifadesi, paketin kendisi (görevler, kayıtlar, tablo, ses üretimi) olarak yorumlandı. Ses dosyalarını üreten betikler bu teslimde pakete **konmadı** (anahtar ve ses metinlerini içerdiği için “test_gununde_ac” ile aynı sızıntı sorunu doğar); istenirse ayrı verilir.
- En ağır üç sorun: (1) ana raporun anlattığı görevlerin çoğu pakette yoktu (Gün 0, H4, H5, H6, dikte, alan kartları, prova anahtarları), (2) Türkçe ses hiç yoktu, İngilizce sesler robotikti ve tek dosyada toplanmış anahtar test günlerini birbirine sızdırıyordu, (3) ana rapor paketten ve kendi içinde çelişiyordu (eksik bölüm numarası, kaynak notları, gün planı).
- v11'de **54 dosya** vardır (26 ses: 13 İngilizce, 13 Türkçe). Hiçbir ses bir insan tarafından dinlenip onaylanmadı; cihaz denemesi yok. Ayrıntı: bölüm 5 ve `EKSIKLER.md`.

## 2. Nasıl denetlendi?

1. Zip, kendi dizininden ayrı bir klasöre açıldı; betikler açılan klasörün **dışında** tutuldu ve dosyaları okuyan her Python komutu yalıtılmış kipte (`python3 -I`) çalıştırıldı (çıkarılan dosyalar güvenilmez veri sayılır).
2. `checksums.sha256` ve `manifest.json` karşılaştırıldı; 9 İngilizce mp3 `ffprobe` ile açıldı.
3. Her Markdown dosyası baştan sona okundu; görev numaraları, dosya adları, gün sayıları, anahtar–görev eşleşmesi ve çapraz bağlantılar elle ve betikle kontrol edildi.
4. Ana rapor v10, paketle ve kendi iç tutarlılığıyla karşılaştırıldı (bölüm numaraları, kaynak kodları K, karar kodları D/G, hafta planı, görev özeti).
5. v11 rapor, bir **doğrulayıcı betikle** (`validate_v9.py`: başlık sırası, kod aralıkları, bağlantı biçimi, çapraz başvuru) yeniden denetlendi ve geçti.
6. Ses: bölüm 5.

## 3. Bulgular: paket dosyaları

Ciddiyet: **Yüksek** = görevi yapılamaz kılar ya da ölçümü bozar · **Orta** = yanıltır, karıştırır, sızdırır · **Düşük** = özen / dil / kesinlik.

| Kod | Ciddiyet | Dosya (v10) | Sorun | v11'de yapılan | Nasıl denetlendi |
| --- | --- | --- | --- | --- | --- |
| BP01 | Yüksek | `test_gununde_ac/05_TEST_GUNLERI.md`, `ses/` | Türkçe ses dosyası yoktu; Türkçe dinleme (TR-L) ve Türkçe kontrol görevleri “bekliyor” durumundaydı; `manifest.json` `turkish_audio_included:false` diyordu | Türkçe nöral ses (tek erkek ses) ile 13 dosya üretildi; manifest `true` | Her dosya mp3'ten okunup otomatik tanıma ile metne karşı denendi (bölüm 5) |
| BP02 | Yüksek | paket geneli | Ana raporun (9.x, 13.2) tarif ettiği Gün 0, alan başlangıç kartları, prova ve Gün 1–4 anahtarları, H4 (çok kısa gecikme), H5 (ders başı), H6 (tekrar dinleme), dikte (B1) ve ağ/başlangıç görevleri **pakette yoktu**; hafta planı yalnız rapordaydı | `01_GUN_0_HAZIRLIK`, `02a_ALAN_BASLANGIC_KARTLARI`, `02b_PROVA_VE_GUN1_4_ANAHTARLARI`, gün gün görev dosyaları, H4/H5/H6/dikte metin ve sesleri eklendi | Rapor 13.2 tablosu ile `00_BURADAN_BASLA.md` hafta planı satır satır eşlendi |
| BP03 | Yüksek | `08_CEVAP_ANAHTARI.md`, `06_SESLENDIRME_METINLERI.md` | Üç test gününün anahtarı **tek dosyadaydı**: Gün 5'in anahtarını açan, Gün 6–7 cevaplarını da görüyordu. Ses metinlerinin yazılı hâli ses dosyalarının yanındaydı: dinleme görevi “okuma”ya dönüşebiliyordu | Anahtar gün gün bölündü (`08_ANAHTAR_GUN5/6/7/8_H6`); `06_SES_VE_LISANS_NOTU.md` **metin ve cevap içermez**; metinler yalnız ilgili günün anahtarındadır | `grep` ile: her anahtar dosyası yalnız kendi günündeki görev kimliklerine (ve önceki günden devreden hatırlama görevlerine) başvuruyor |
| BP04 | Orta | `ses/*.mp3` (9 dosya) | Ses motoru Flite “slt”; yavaş/hızlı sürümler bir zaman uzatma/sıkıştırma çarpanıyla (`tempo_factor`) elde edilmişti. Robotik tını, dinleme güçlüğünü sesin kendisinden ayırmayı zorlaştırıyordu. Hız, ses ve metin her dosyada birlikte değişiyordu | Piper nöral sesler; hız, sentezleyicinin `length_scale` ayarı ve cümle araları ile ayarlandı; **gerçekleşen** sözcük/dk ölçüldü ve `ses_manifest.json` içine yazıldı (hedef 90/120/150, gerçekleşen yaklaşık 90 / 118–121 / 145–152) | Süre `ffprobe` ile, sözcük sayısı metinden hesaplandı |
| BP05 | Orta | `05_TEST_GUNLERI.md` L1, `ses/` | L1 görevi üç dosyayı listeliyordu (EN_A_normal, EN_B_yavas, EN_C_hizli), ama aynı üç metnin **öbür altı hızı** da aynı klasördeydi: aynı metni ikinci kez duymak mümkündü | Gün 6 klasöründe yalnız üç dosya var; öbür altı sürüm `ses/sonradan_calisma` içinde ve **test bittikten sonra** diye etiketli | Görev dosyasındaki ses adları ile `ses/` klasörü betikle eşlendi |
| BP06 | Orta | `05_TEST_GUNLERI.md` H2-B | Gün 6'daki ikinci hatırlama bilgisinin (B) iki sözcüğü, aynı günlerde dinlenen metinlerin cevaplarıyla örtüşüyordu (bir renk ve bir gün adı). Hatırlama görevinde karışma ve sızıntı doğurur | B bilgisi yeniden yazıldı; yeni içeriğin renk, nesne ve gün sözcükleri pakette başka bir ses ya da görev metninde geçmiyor (eski nesne sözcüğü de Gün 5'teki bir ses metniyle çakıştığı için değiştirildi). Yeni içerik burada yazılmaz (Gün 6'dan önce görmemen için): `test_gununde_ac/05_GUN6_GOREVLER.md` | Bütün dosyalarda `grep` ile aratıldı |
| BP07 | Orta | `08_CEVAP_ANAHTARI.md`, `06_SESLENDIRME_METINLERI.md` | Türkçe dinleme metnindeki konuşmacı adı paket sahibinin adıyla örtüşüyordu; dinleme görevinde “ben” ile karışır, kendi kendine konuşma izlenimi verir | Farklı bir ad kullanıldı | Metin ve anahtar yeniden üretildi |
| BP08 | Orta | `calisma/04_SPOR_ILK_HAFTA.md` | Kartta “v9'daki 50/30/15/5” gibi **sürüm içi başvuru** vardı (kullanıcıya anlamsız). NSCA'nın “ardışık olmayan günler” ilkesi alıntılanıyor ama kart 7 gün üst üste hareket içeriyordu; ilkenin bu haftaya uygulanıp uygulanmadığı belirsizdi. Hareket ölçümü (başlangıç gözlemi), zorlanma ölçeği ve test günlerinde yatış öncesi saat uyarısı yoktu | Sürüm başvurusu ana rapor 11.x'e çevrildi; “bu hafta yüklü (dambıl/bar) direnç çalışması yok, ilke Hafta 2+ için” netleştirildi; 3 basamak korundu, Gün 4–6 mesafesi “rahat geldiyse 2,5–3 km” oldu; Gün 7 hafif gün **önerisi** (istersen tam çekirdek); isteğe bağlı başlangıç gözlemi (Gün 1–2; 1RM ve maksimal deneme yok; duvar şınavı/karın kıvırma en çok 20); zorlanma 0–10 | Rapor 11.7, 11.11, 11.13 ile eşlendi. Spor uzmanı ya da hekim onayı **yoktur** (bölüm 6) |
| BP09 | Orta | `calisma/02_ILK_DORT_GUN.md` | Gün 1 “eğitim öncesi” başlangıç kaydı yoktu (yalnız “istersen doğal bir örnek sakla”). Gün 1'deki okuma gözlemi, Gün 3'te “kendi sözlerinle anlat” görevinde yeniden kullanılan **aynı makalenin** ilk iki paragrafını kullanıyordu: ilk okuma ikincisini etkiler. Gün 4'teki “üçüncü gönderimden sonra anahtarı aç” provası, var olmayan bir eğitim sorusuna gönderme yapıyordu. H5/H6/dikte tanışma ve ses tabanlı C0 görevi yoktu | 18 KB: Gün 1'de ayrı, özgün bir başlangıç metni (“Haritanın notu”) ve yazı/ses/okuma kaydı; Gün 3'te makale ayrı; prova soruları (P1, P2) `02b` içinde; H5, H6, dikte, C0 tanışmaları günlere yerleştirildi; Gün 4'te test maddeleri kilitlenir | `00_BURADAN_BASLA.md` tablosu ve rapor 13.2 ile eşlendi |
| BP10 | Orta | `kayitlar/YANIT_SABLONU.md` | Yardım durumları serbest sözcüklerle yazılıydı (kodu yoktu); gönderim sayacı, H4/H6/dikte alanları ve dosya adı kuralı yoktu; “ses anlaşılmadı” ayrımı yoktu | Yardım kodları **A0–A4**; gönderim sayacı tablosu; H4 (sayma süresi), H6 (kaçıncı dinleme), dikte (tekrar açma sayısı, metin görünür mü) alanları; dosya adı biçimi; yorgunluk/uyku 0–10; ses kalitesi ile içeriği ayırma notu (06 notunda) | Ana rapor 13.6 ile eşlendi |
| BP11 | Orta | `kayitlar/INGILIZCE_TEKRAR_KURALI.md` | Kural doğruydu (3→10→20→50; nominal 3/13/33/83) ve CSV'de planlanan/gerçekleşen tarih sütunları vardı, ama hesap elle yapılacaktı ve iki cümle anlaşılmazdı (“Günlük genel hedef kuyruğunun önce yarım hedef kuralı ayrıca devam eder”, “Bu takvim farkı günlük uzun dönem yükünü yarıya indirmez”) | Kural örneklerle yeniden yazıldı; **formüllü xlsx** (`INGILIZCE_TEKRAR_TAKVIMI.xlsx`) eklendi: planlanan ve gerçekleşen tarih ayrı, gecikmede sonraki aralık gerçekleşen tarihten başlar, günlük yük 0/N/2N/3N/4N | xlsx LibreOffice (başsız) ile yeniden hesaplatılıp eşik günleri denendi. **Excel/telefonda denenmedi** |
| BP12 | Düşük | `02b` satır 25 (v11'de yeni) | “İki gönderimden sonra 3. gönderim” kuralı 3. gönderimi bir sınav gibi hissettirebilirdi | “3. gönderimi yapmak, kuralı denemek içindir (doğru/yanlış hükmü değildir)” | Okundu |
| BP13 | Düşük | `01_KAYNAK_SECIMI.md` | “v9'da EF SET … anlatılmıştı” gibi sürüm geçmişi cümleleri kullanıcıya dönük dosyada | Sürüm geçmişi rapora (0.1, Ek C), dosya yalnız bugünkü durumu anlatacak şekilde yeniden yazıldı | Okundu |
| BP14 | Düşük | `EKSIKLER.md` | Dürüsttü ama kapsamı dardı; v11'in yeni parçaları (Gün 0, H4–H6, dikte, xlsx, PowerShell, sentetik ses) için kayıt gerekiyordu | Her satırda **yapılan** ve **yapılmayan** ayrı yazıldı; PowerShell ve xlsx denenmediği açık | Okundu |
| BP15 | Düşük | `manifest.json`, `checksums.sha256` | Eski sürüm (“1”), eski tarih (26 Ekim) | Yeniden üretildi (sürüm 11, 27 Ekim 2026); `checksums.sha256` manifest dahil her dosyayı kapsar, kendisi hariç | `sha256sum -c` (bölüm 8) |

## 4. Bulgular: ana rapor (`10_ANA_RAPOR_v10.md` → `10_ANA_RAPOR_v11.md`)

Rapor bir betikle (assert'li, her değişiklikte beklenen metnin bulunduğunu doğrulayan) yamalandı; elle düzenleme yapılmadı. Rapor 216 183 → ~227 KB.

| Kod | Ciddiyet | Yer | Sorun | v11'de yapılan |
| --- | --- | --- | --- | --- |
| BA01 | Yüksek | 8.x | Bölüm numarası **8.8 yoktu** (8.7'den 8.9'a atlıyordu); 19 çapraz başvuru 8.9'a gidiyordu | 8.9 → **8.8**; 19 başvuru yeniden numaralandı. Eski numaraya yapılan tarihsel anma bilerek korundu ve açıkça yazıldı |
| BA02 | Yüksek | 13.2 gün planı | Gün planı paketle uyuşmuyordu (Gün 0, Gün 12–13 kontrolleri, Gün 8 H6 kontrolü, test günlerinin içeriği) | 13.2 tablosu paketle satır satır hizalandı; “G05/G06/G07 = Gün, G01–G26 karar kodlarıyla karıştırma” notu eklendi |
| BA03 | Yüksek | “Durum” satırı, 8.5, 9.3 | Hâlâ “Türkçe ses yok / Flite” diyordu; H5 A/B sırası **dengelenmiş** gibi geçiyordu | Durum satırı güncel; H5 için “sıra sabit, dengelenmedi” açıkça yazıldı (9.3) |
| BA04 | Orta | 7.8, 9.4 | H2 (gecikmeli bilgi) kontrol zamanları paketle uyuşmuyordu | 5 dk · 30 dk · 2 sa · ertesi gün; bir hafta kontrolü Gün 12 (A) / Gün 13 (B, isteğe bağlı) |
| BA05 | Orta | 9.5, 10.2 | Durak sayısı ve H1 madde sayısı eski; okuma metni uzunluğu ve ortam yanlış | 8 durak, 6 maddelik liste, 7 maddelik H1; okuma metni ≈155 sözcük, tek ortam (ekran) |
| BA06 | Orta | D39 | Cevabı tanımlanmamış bir “Q2” koduna başvuruyordu | “(R8-6 cevabı)” olarak düzeltildi |
| BA07 | Orta | 17.1 (K63, K64, K66, K67, K69–K71) | Bazı kaynaklar bu turda yeniden açılamamıştı (Busuu **403**; Melby-Lervåg bağlantısı yeniden açılmadı) ama kayıt “doğrulandı” gibi okunuyordu; K67 açıklaması anlaşılmazdı | Her kaynağa bu turdaki **durumu** yazıldı; K67 sadeleştirildi |
| BA08 | Orta | RK, K | Yeni riskler ve kaynaklar işlenmemişti | RK28 (sentetik ses kalitesi), RK29 (Hafta 1'in karışıklıkları), K73 (Brain Workshop), K74 (Piper model kartları) eklendi; G21 güncellendi |
| BA09 | Düşük | 11.7, 11.11, 11.13 | İlk hafta spor planı pakete uymuyordu | Hafta 1'de yüklü direnç yok; 3 basamaklı yükselme; duvar şınavı |
| BA10 | Düşük | Ek A, 18.1 | Ek A başlığı R0–R9 diyordu; 18.1 sürüm notu eskiydi | R0–R10 (bu istek R10 olarak kaydedildi); 18.1 v11 notu |
| BA11 | Düşük | 0.x | v11 değişiklikleri raporda yoktu | Yeni 0.1 “v11'de ne değişti?” (7 madde); v10'un R9 değişikliği korundu |
| BA12 | Düşük | 8.8 (araç) | Tekrar tablosu için araç yok | “Araç:” paragrafı xlsx'i anlatır ve sınırını (yalnız LibreOffice'te denendi) söyler |

## 5. Ses dosyaları: ne yapıldı, ne bulundu?

**Yöntem.** Piper (nöral, ONNX) ile cümle cümle sentez; her cümle için birden çok aday; adaylar otomatik tanıma ile yazıya çevrilip beklenen metne en çok benzeyen seçildi; iki geçişli ses düzeyi normalizasyonu (−18 LUFS); mono mp3 22050 Hz 64 kb/sn. Sesler: İngilizce `kristin` (ses 1 ve dikte), `joe` (ses 2), `ljspeech` (ses 3); Türkçe `dfki`. Lisans bilgisi model kartlarından alındı (kristin/ljspeech kamu malı, joe CC0, dfki **CC BY-NC-SA 4.0: yalnız kişisel, ticari olmayan kullanım**).

**Karşılaşılan teknik hatalar (ve çözümleri).**

| Kod | Ne oldu | Sonuç |
| --- | --- | --- |
| BS01 | `difflib.SequenceMatcher` varsayılan ayarı 200 karakter ve üstü metinde “autojunk” uygular; uzun dosyalarda benzerlik **yapay olarak 0,68** çıktı (gerçekte yüksekti) | Her yerde `autojunk=False` kullanıldı. Eski düşük skorlar bu yüzden gerçek hata sayılmadı |
| BS02 | Tek başına söylenen kısa öğelerde (sayılar, gün adları, sıra sözcükleri) otomatik tanıma güvenilmez çıktı; bir sayı ya da gün adı bazen anlamsız hecelere ya da başka bir sözcüğe çevrildi | Bu öğeler kısa bir taşıyıcı ifadenin ardına konup iki ayrı boyutta (small, medium) modelle denendi; hâlâ çok kısa öğelerde doğrulama zayıf kalabilir |
| BS03 | Whisper-small bazı bozuk girdilerde ~35 sn'lik tekrar döngüsüne girdi, üretimi saatlere uzattı | Çözümleme sınırları (`temperature=0.0`, `max_new_tokens=40`, zaman damgasız) eklendi |
| BS04 | Bir özel ad bir kez başka bir ad olarak tanındı | Özel ad farkı olarak not edildi; ses değiştirilmedi |
| BS05 | Hedef hız 90/120/150 sözcük/dk iken gerçekleşen değerler tam tutmadı (ör. EN_A: 90,0 / 119,5 / 145,2) | Etiketler “yaklaşık” diye anlatıldı; gerçekleşen değer `ses_manifest.json` içinde |
| BS06 | `en_US-kristin` sesi, tek başına söylenen bazı sözcüklerde (özellikle bir sayı) her adayda bozuk çıktı; karşılaştırma yalnız taşıyıcı ifadeyle yapıldığı için bu ilk turda gözden kaçtı, dosya bağlamında ise anlamsız hecelere dönüştü | İngilizce dikte dosyaları `en_US-ljspeech` (high) ile yeniden üretildi; öğeler hem taşıyıcı ifadeyle hem de **dosyadaki gerçek bağlamda** (sıra sözcüğü + kısa boşluk + öğe), iki modelle (small, medium) denendi |
| BS07 | Türkçe `dfki` sesi bazı tek sözcüklerde (bir gün adı, bir onluk sayı, `ü`/`ş`/`k` öbekli sözcükler) tutarsız çıktı; “Üçüncü” gibi sıra sözcüklerinde adayların çoğu bozuktu | Güvenilmez iki öğe (bir gün adı ve bir sayı) aynı türden, ses tarafından tutarlı söylenenlerle değiştirildi (anahtar dosyası yeniden üretildi); sıra sözcükleri için aday sayısı 24'e çıkarıldı ve ASR'nin sıra sözcüğünü rakamla yazması eşdeğer sayıldı |
| BS08 | Türkçe dinleme metninin konuşmacı adı, otomatik tanımada benzer bir adla karışıyordu (sonda `m`/`n` ayrımı) | Sonu ayırt edilebilir başka bir ad kullanıldı; ses ve anahtar yeniden üretildi |

**Son doğrulama (nihai mp3'ler üzerinde, `medium` model):**

- 26 mp3 dosyasının tamamı mp3'ten okunup `medium` modelle yazıya çevrildi (tam tablo: `test_gununde_ac/06_SES_VE_LISANS_NOTU.md`, dosya başına ayrıntı: `test_gununde_ac/ses/ses_manifest.json`). **En düşük benzerlik 0,923, ortanca 0,995**; 22 dosya ≥ 0,98, 18 dosya ≥ 0,99.
- Düşük kalan dört dosya dikte dosyalarıdır (0,923–0,963): tanıma modeli sayıları/sıra sözcüklerini rakamla ya da kısaltmayla yazıyor veya sıra sözcüğünü başka bir sözcük olarak okuyor. Transkriptler tek tek okundu; öğelerin kendisi bu transkriptlerde tanındı, ama bu bir insanın duyduğu şeyin kanıtı değildir.
- Dikte öğeleri (42 birim: 30 İngilizce, 12 Türkçe), taşıyıcı ifade ve dosya bağlamında small ve medium ile denendi; her birimin dört skorundan en düşüğü: 29 birimde ≥ 0,999, 35 birimde ≥ 0,95; kalan 7 birimde 0,81–0,94. Bu birimlerde sesin mi yoksa tanıma modelinin mi hatalı olduğu ayırt edilemedi.
- Ses düzeyi −19,2 … −18,3 LUFS; en yüksek tepe −3,3 … −1,5 dBFS. Gün 6 İngilizce dinleme dosyalarında gerçekleşen toplam hız 119,5 / 90,0 / 152,3 sözcük/dk.

**Bu doğrulama neyi göstermez?**

- Bir insan hiçbir dosyayı dinlemedi. Otomatik tanıma, anlaşılabilirliğin ya da doğallığın ölçüsü değildir.
- Dikte dosyalarında `medium` model seçimde de kullanıldı; oradaki son kontrol **bağımsız değildir**. Üçüncü bir model (large) denenmedi.
- Telefonda, USB-C kulaklıkla çalma denenmedi.
- Hız, konuşmacı ve metin dosyalar arasında birlikte değişir; “hızlı ses daha zor” gibi bir sonuç bu verilerden çıkarılamaz.

## 6. Doğrulanamayan ve yapılmayan şeyler (dürüst liste)

1. İnsan dinleme kontrolü (bütün sesler).
2. Redmi Note 13 Pro+ 5G (HyperOS 3) ve Windows 11 üzerinde hiçbir akış denenmedi: mikrofon, ses kaydı, uçak modu, alarm, ZIP, tablo.
3. `PAKETLEME_VE_YEDEK.md` içindeki PowerShell komutları **denenmedi** (bu ortamda PowerShell yok).
4. xlsx yalnız LibreOffice ile yeniden hesaplatıldı; Excel ve telefon tablo uygulamalarında denenmedi.
5. Dış kaynakların (USA Learns, VOA, Busuu vb.) telefonda kullanıcı denemesi yapılmadı. Busuu yardım sayfası 403 verdi; Melby-Lervåg ve K65/K72 bağlantıları bu turda yeniden açılmadı.
6. Okuma metinleri (≈155 sözcük) yalnız ekranda; tek ortam. Kitap/PDF/ekran karşılaştırması bu hafta yok.
7. Görevler standartlaştırılmış sınav değildir; madde eşdeğerliği, güvenilirlik, zorluk dengesi ölçülmedi. H5'te A→B sırası sabit; dikte dosyalarında hız, sıra ve öğe birlikte değişir.
8. Türkçe ses tek erkek ses; kişisel kullanım lisanslı. Başka Türkçe ses denenmedi.
9. Spor: bir spor uzmanı veya hekim onayı yok; yük kalibrasyonu yapılmadı.
10. Sağlık kontrol tarihleri (göz, kulak-burun, diş) belirsiz: sorulmadı, tanı ya da varsayılan sonuç eklenmedi.
11. Otomatik kayıt uygulaması (checkpoint, 3. gönderimde otomatik anahtar açma, mikrofon olayları, ZIP üretimi) **geliştirilmedi**; “elle/köprü kaydı” kullanılır.
12. 25 konu / 50 makalelik havuz tamamlanmadı; yalnız ilk haftanın metinleri var.

## 7. Verdiğim kararlar ve varsayımlar

Soru sormamam istendiği için aşağıdakileri ben seçtim; yanlışsa söyle, düzeltilir.

| Kod | Karar / varsayım | Gerekçe |
| --- | --- | --- |
| VA1 | “220 KB md” = `10_ANA_RAPOR_v10.md` (216 183 bayt) | Zip'teki tek 200 KB üstü Markdown |
| VA2 | “Kodlar” = paket içeriği ve ses üretimi; zip'te kaynak kod yoktu | Elde yok |
| VA3 | Hem paket hem ana rapor güncellendi; v10 rapor yerine v11 rapor pakete kondu | “Md dosyasına bakarak güncellersin” |
| VA4 | Gün 0 (hazırlık) Hafta 1'in 4+3 gün yapısına dahil değil | 4 gün çalışma + 3 gün test kuralını bozmamak |
| VA5 | Her günün bitiş ölçütü **hedeftir**; saat yapısı yoktur (ana hedef akşama, yaklaşık 23:00'e kadar) | Dakika temelli yapı istememen |
| VA6 | H5 A/B sırası sabit | Bir haftada dengeleme mümkün değil; bu bir sınırdır |
| VA7 | Türkçe için tek ses, lisans uyarısıyla | Kullanılabilir tek Türkçe Piper sesi |
| VA8 | Sesler yapay; gerçek kişiye aitmiş gibi sunulmadı | Dürüstlük |
| VA9 | Commit/PR yapılmadı; teslim bir zip ve iki Markdown dosyasıdır | İstenmedi |
| VA10 | Üretim betikleri pakete konmadı | Anahtar/metin içerirler (spoiler) |

## 8. v11 paketi nasıl denetlenir?

1. Zip'i aç. İçinde tek klasör olmalı: `Ilk_Hafta_Paketi_v11/`.
2. Bütünlük: Linux/macOS `sha256sum -c checksums.sha256`; Windows için komut `kayitlar/PAKETLEME_VE_YEDEK.md` içinde (denenmedi).
3. Önce `00_BURADAN_BASLA.md`, sonra `EKSIKLER.md` oku. `test_gununde_ac` klasörünü **Gün 4 bitmeden açma**.
4. Bir ses çalmıyorsa, anlaşılmıyorsa ya da bir komut çalışmıyorsa `HAFTA1\EKSIKLER.md` dosyasına tarih, cihaz ve ne olduğunu yaz; yapılmış gibi kaydetme.
