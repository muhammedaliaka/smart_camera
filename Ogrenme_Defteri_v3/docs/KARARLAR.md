# Kararlar ve nedenleri

Bu belge, tasarımda verilen kararları ve bilerek bırakılan sınırları tek yerde toplar. Bir şeyi değiştirmek istersen önce buraya bak.

## Ölçme ve puan

| Karar | Neden |
|---|---|
| **Nesnel sorularda doğru/toplam ve yüzde gösterilir** (çoktan seçmeli, dinleyip yazma, sayı, eşleştirme, cümle kurma). İlk denemedeki yanıt sayılır; yanlış soru sonda bir kez daha sorulur ama sonucu değiştirmez. | İstek: "yüzde kaç anladın, kaç soruyu doğru bildin". Önceki sürümde uygulama yalnızca kayıt tutuyordu; bu kural **bilerek gevşetildi**, yalnız tek doğru cevabı olan sorular için. |
| **Açık uçlu yanıtlar puanlanmaz** (kendi cümlenle anlat, kısa konuşma). Yanıt kaydedilir; yanıtında hangi noktaların olduğunu kendin işaretlersin (yazıda bulabildiklerimiz önceden işaretlenir). | Bir programın "iyi anlattın" demesi güvenilir olmaz; yanlış güven ya da yanlış hayal kırıklığı yaratır. |
| **Kontrol günleri tek seferliktir** (yanlışlar tekrar sorulmaz). | Amaç öğretmek değil, ne öğrendiğini görmek. |
| Yardım sorusu 4 seçenekli: yardımsız, ipucu/araç, kitap-sözlük-video, yapay zekâ/çeviri aracı. | Öğrenci için kısa ve anlaşılır tutuldu. (Kayıtlarda görünen kodlar A0, A1, A3, A4'tür; A2 kullanılmıyor.) |

**Puan ikinci plandadır, asıl çıktı rapordur.** Kullanıcının isteği: sistem bir not verme aracı olmasın; yalnız tek doğru yanıtlı sorularda kısmi puan olabilir. Asıl amaç, yapılan çalışmanın bir yapay zekâya ya da öğretmene karıştırmadan verilebilmesidir. Bu yüzden her kayıt soru metnini, öğrencinin yanıtını ve doğru yanıtı kendi içinde taşır (aşağıda "Kayıt ve rapor").

## Kayıt ve rapor

| Karar | Neden |
|---|---|
| **Her kayıt tek başına anlaşılır:** soru metni, dinlenen sesin yazısı, öğrencinin yanıtı, doğru yanıt, yanlışsa ekrandaki seçenekler, ders adı, konu, bölüm ve programın kaçıncı günü olduğu birlikte saklanır. | Eskiden yalnız `ders`, `id` ve doğru/yanlış tutuluyordu; bir yapay zekâ "hangi soruydu, ne yanıtlanmıştı" diye soramıyordu. |
| **Bağlam kataloğu:** değişmeyen bilgi (soru, doğru yanıt, ders adı…) `bag` içinde **bir kez** saklanır; olay yalnız kısa anahtarını (`b`) taşır. Aynı soru yüz kez sorulsa bir bağlam kaydı olur. | Tarayıcı depolaması ≈ 5 milyon karakterdir; aylarca kayıt tutulacağı için yer tasarrufu gerekli. Yedek yüklenirken katalog birleşir. |
| **Rapor tek bir saf fonksiyondur** (`js/rapor.js`) ve Markdown üretir: okuma kılavuzu, özet, en çok karıştırılanlar, tekrar sistemi durumu, günlük kayıt. Kısa kipte doğru bilinenler yalnız sayılır, yanlışlar ve açık uçlu yanıtlar eksiksiz yazılır; tam kipte her soru yazılır. | Uzun raporu bir yapay zekâ daha kötü okur; asıl bilgi yanlışlarda ve yazılan yanıtlardadır. |
| **Beyanlar ayrı etiketlenir** ("Beyan: zorlanma 6/10, yardım = ipucu…"); açık uçlu yanıtlar puanlanmaz, uygulamanın örnek yanıtı "tek doğru değildir" notuyla verilir. | Okuyan kişi öğrencinin söylediğini uygulamanın ölçtüğünden ayırabilmeli. |
| **Hiçbir kayıt türü unutulmaz:** uygulamanın yazdığı her kayıt türünün raporda bir biçimi ya da gerekçeli bir "atlandı" kararı olmak zorundadır; yeni bir tür eklenip raporu unutulursa birim testi (`tests/unit/rapor.test.mjs`) kırılır. Bilinmeyen türler yine de ham veri olarak yazılır. | "Bir kısım bile unutulmasın" isteği. |
| **Kota koruması:** alan 3,8 milyon karakteri aşınca **en eski** kayıtların yalnız ayrıntısı silinir (yanlışta gösterilen seçenekler, doğru yanıtların yazısı, tekrar sistemi hareketleri). Soru, doğru/yanlış, tarih ve en yeni %20 dokunulmaz. "Ben → Ayarlar → Yedek" kartında doluluk yüzdesi görünür. | Sessizce kayıt kaybetmektense ayrıntıyı bilerek azaltmak daha güvenli; düzenli yedek/rapor yine önerilir. |

## Tek kaynak ve tutarlılık

- **Kelimeler bir kez yazılır** (`kelimeler.json`); alıştırmalar, oyunlar, tekrar ve sahne çevirileri bu bankadan üretilir. Aynı `en` farklı `tr` ile iki kez yazılırsa doğrulayıcı hata verir.
- **Hareketler bir kez yazılır** (`spor.json` içindeki kütüphane); günlük spor kartları yalnızca `{ref, set, tekrar}` söyler.
- **Hafıza rotaları kimlikle** (`ev`, `okul`, …) bağlanır; liste bir kez yazılır, hatırlama adımları `ref` ile ona bakar.
- **Program yalnızca ders kimliği listeler**; ders içeriği programda yazılmaz.
- **Doğrulayıcı** (`js/dogrula.js`; tarayıcıda kendi paketini yüklerken ve komut satırında `scripts/dogrula.mjs` ile aynı kod çalışır) şunları yakalar: aynı soru farklı cevap, eksik/yanlış referans, aynı emoji, kullanılmayan kelime/hareket, programa bağlanmamış ders, aynı dersin iki kez programlanması, gün aralığı hataları.
- **Cevap anahtarı yazılmaz, türetilir.** Çoktan seçmeli sorularda doğru şık her zaman ilk yazılandır; uygulama şıkları karıştırır. Böylece "anahtar Z diyor, şık Y" biçiminde bir hata mümkün olmaz.

## Program

- **İlk hafta yoklama haftasıdır; sonrası seviyeli ve sürekli.** 1–7. günlerde her beceri (İngilizce, okuma, dinleme, hafıza) için günde en çok bir kısa yoklama çıkar; spor için yoklama yoktur. Yoklama haftası 3 sabit günden (hafıza sarayı, liste, uzun liste) ve beceri yoklamalarından oluşur. Yoklama bitince o becerinin günlük görevi **seviye oturumuna** döner. Neden: kullanıcı, seviyenin en zorlayıcı testle değil küçük basamaklarla bulunmasını istedi; programı elle yazılmış haftalarla sürdürmek, öğrenci hangi seviyedeyse ona uymadığı için bırakıldı.
- **Sonrası yedi günlük bir desen** (`program.json` → `seviyeli.desen`): her gün İngilizce + o günün becerisi (okuma / dinleme / hafıza) + spor; dış uygulamalar (Voscreen, Busuu) isteğe bağlı. Desen sonsuza kadar tekrarlanır; içerik seviyeye göre seçilir. Günler elle yazılmaz.
- Yoklama haftasında günde birkaç kısa yoklama; sonrasında çoğu gün 3 seviye oturumu (7. gün hafif: yalnız İngilizce zorunlu, hafıza ve spor isteğe bağlı). Her oturumdan sonra seviyene uygun bir ders **önerilir** (isteğe bağlı). İsteğe bağlılar "isteğe bağlı" etiketiyle gösterilir ve günü tamamlamayı engellemez.
- **Hedef odaklı, süre odaklı değil:** hiçbir kartta "20 dakika çalış" yok; "bu listeyi bakmadan yaz", "2 set × 8" gibi hedefler var.
- **İngilizce tekrar aralığı 3 → 10 → 20 → 50 gün** (istek). Yanlış cevap aynı kutuda kalır ve ertesi gün yeniden sorulur.
- **Eski iki haftalık dersler silinmedi.** Seviyeli ders havuzuna (`sv` ile) ya da Dersler sayfasındaki kütüphaneye (`kutuphane: true`) alındı; kayıtlı ilerleme bozulmaz.

## Seviye sistemi

Ayrıntı ve kanıt tablosu: `SEVIYE_SISTEMI.md`. Kararlar:

| Karar | Neden |
|---|---|
| **Her beceri ayrı, açık uçlu bir merdiven** (1–100 gösterilir, içerik eklendikçe uzar). | İstek: "100–200 seviye varsa" biçiminde sınırsız merdiven; üstte tavan yok. |
| **Yoklama en çok 5 → 10 → 20 → 35 → 50.** 50'yi geçen öğrenci "50 (tavan)" yazılır; sonrası gerçek çalışmada kendiliğinden yükselir. | İstek: en yukarı test bile 50 civarı olsun, en zorlayıcı testle başlanmasın. Tavan 50 **kullanıcı kararıdır**; yerleştirme literatüründe testi yeteneğin biraz üstüne kadar sürdürmek önerilir (`SEVIYE_SISTEMI.md`, kanıt tablosu). |
| **Yükselme için puanlanan soruların %100'ü ilk denemede doğru.** | İstek: "hepsinde tamamen doğruluk ile geçersem değişir". Bu bir **kullanıcı tercihidir**; kanıt tablosunda %85 civarı doğruluğun öğrenme için iyi olduğunu gösteren ancak insan öğrencide doğrudan sınanmamış bir bulgu var (Wilson ve ark. 2019). %100 kuralı bilerek daha sıkıdır. |
| **Düşme: üst üste 2 oturumda <%60.** Yarım oturum hiçbir şeyi değiştirmez. | Tek bir kötü gün seviyeyi düşürmesin. |
| **Aynı metnin tekrarı seviyeyi değiştirmez.** | Yeni okuma/dinleme metni kalmayınca pencerede en eski metin pekiştirme için yeniden verilir; cevaplar bellekten gelebileceği için olay `tekrar: true` ile kaydedilir ve seviye hesabında yok sayılır (raporda "AYNI METNİN TEKRARI"). Benzetim, bu kural olmadan 7 oturum boyunca aynı 25. seviye metnin seviyeyi 26'dan 31'e çıkardığını gösterdi. |
| **Yoklamada küçük örneklem payı:** en az 4 soruluk yoklamada tek yanlış geçer. | %80 kuralı 4 soruda 3/4'ü (%75) geçirmiyor, 5 soruda 4/5'i geçiriyordu; bu tutarsızlık tek bir dikkatsizliğin güçlü bir öğrenciyi en alta atmasına yol açıyordu (`birYanlisHakki`, `icerik/seviye.json`). |
| **Başlangıç = geçilen en yüksek seviyenin %80'i.** | Gerçek çalışma başarıyla başlasın; yoklama soru sayısı küçük olduğundan bulunan seviye bir miktar iyimser olabilir. |
| **Spor için yoklama yok;** hacim tablosundan 1. basamaktan başlar, üst üste 2 rahat oturumda yükselir. | Sağlık nedeniyle test yerine kademeli artış. Hacim sayıları bizim tasarımımızdır; sağlık sorunu varsa doktora danışılır. |
| **Seviye olay günlüğünden yeniden hesaplanır.** Kayıt silinmez, geçmiş değişmez; kurallar `icerik/seviye.json`'da veridir. | Kuralı değiştirince geçmiş yeniden değerlendirilebilir; hesaplama saf işlevdir ve test edilir (`js/seviye.js`). |
| **Elle ayar vardır** (`seviye-ayar` olayı, nedenle birlikte raporda görünür). | Öğrenci ya da öğretmen/yapay zekâ önerisiyle düzeltebilsin; gizli değişiklik olmasın. |
| **Seviye bir not değildir.** Arayüz bunu söyler; rapor "Seviyeler" bölümünde kuralları ve değişim nedenlerini yazar. | Kullanıcı sistemin puanlama aracı olmasını istemedi (yukarıdaki "Ölçme ve puan"). |

## Kolay giriş ve MCP

| Karar | Neden |
|---|---|
| **İçerik düz metin olarak yazılır** (`giris/*.txt`), araç JSON'a çevirir (`scripts/ekle.mjs`). Hatalar satır numarasıyla gelir, hata varsa hiçbir dosya değişmez, aynı girdi aynı çıktıyı verir. | İstek: "daha basit girilen bir yapı". JSON'da virgül/tırnak hatası yapmadan içerik eklenebilsin. |
| **Üretilen paket işaretlidir** (`uretim.kaynak = giris`); elle yazılmış bir paketin üzerine araç **yazmaz**. | Kazara elle yazılmış içeriği ezmemek. |
| **Sıklık listesi pakete konmadı;** yalnız türetilmiş sıra numarası (`siklik`) vardır. | Kullanılan açık listenin koşulları kişisel kullanım içindir. |
| **MCP sunucusu öğrencinin kaydını yalnız okur;** yazan tek araç `icerik_ekle`'dir ve varsayılanı "yalnız dene"dir. | Yapay zekâ seviyeyi ya da kaydı yanlışlıkla değiştirmesin; içerik değişikliği her zaman insan gözden geçirmesinden geçsin. |
| **Eşitleme yerel sunucuya, belirteçle gider;** `veri/` klasörü dışarı sunulmaz ve git'e girmez. | Öğrencinin kaydı üçüncü bir hizmete gitmesin; aynı ağdaki biri okuyamasın. |
| **Bağımlılık yok** (MCP protokolü elle yazıldı). | "Derleme yok, kurulum yok" ilkesi; bakım yükü ve kırılma riski en az. |

## İçerik

- Her ders: **hedef** (ne yapabileceksin) ve **neden** (1–2 cümle) ile başlar; gereksiz soyut bilgi dersin dışında bırakıldı.
- Metin dili sade Türkçe; İngilizce kısımlar seviyeye uygun, daha önce öğretilmiş kelimelerle.
- **Okuma ve dinleme sorularında "metinde yok" seçeneği** bilerek var: tahminle doldurmamayı öğretir.
- Dilbilgisi yalnızca kalıp düzeyinde.

## Ses

- **Yerel ve ücretsiz Kokoro sesleri** (Apache-2.0); her konuşma için bir `mp3`. Üç rol var: anlatıcı, kadın, erkek. Dosya adı, metin + ses + hızdan türetilir (`ses/<14 haneli kod>.mp3`); metin değişince eski dosya otomatik "kullanılmıyor" olur, yeni dosya üretilir.
- Yavaş dinleme ayrı dosya değil, çalma hızıdır (`playbackRate`).
- Her cümle konuşma tanıma (Whisper) ile geri okunur ve benzerliği raporlanır. **İnsan kulağıyla baştan sona dinlenmedi.**
- **Neden Kokoro?** İlk sürümde Piper sesleri kullanılmıştı. Tek sözcüklü kayıtlarda (kelime kartları) Piper'ın ljspeech sesi zor sözcüklerde (book, who, hot, green, tea…) bozuk çıktı: 16 zor sözcüğün 3'er denemesinde (48 kayıt) yalnız 10'u anlaşılır bulundu (aynı ölçüt: kayıt "The word is …" taşıyıcı cümlesinden sonra Whisper medium ile geri okundu). Kokoro aynı ölçütte 24 zor sözcük/sayıdan anlatıcı sesinde 24'ünü, erkek sesinde 23'ünü anlaşılır buldu; bu yüzden tüm sesler Kokoro ile yeniden üretildi. Bu yine bir bilgisayar ölçütüdür, insan kulağı değildir.
- Türkçe özel adlar (Ece, Türkiye, Izmir) İngilizce ön uçta yanlış okunduğu için `scripts/ses-uret.py` içinde elle yazılmış okunuşla seslendirilir.
- Çok okunuşlu sözcükler (`close` = kapatmak, `live`/`lives` = yaşamak) için de elle okunuş var (`SOZCUKLER`): Kokoro bunları tek başına ya da cümle içinde "yakın" ve "canlı" gibi okuyordu (`live` 220 tek sözcüklü kaydın "The word is …" taşıyıcısıyla geri okunmasında yakalandı, `close` ve `lives` okunuşlarına bakılarak bulundu). Düzeltmeden sonra aynı denetimde 220 kaydın 214'ü doğrulandı. Kalan 6'sı: eş sesli ya da yazım farkı (meet/meat, week/weak, "one hundred"/100), taşıyıcıda net duyulamama (park/part, four) ve özel ad (Goodbye, Ece!). Bunlar bir ses hatası olmayabilir ama kulakla da dinlenmelidir.
- Ses dosyası yoksa uygulama cihazın kendi sesini kullanır (kalite düşer ama çalışır).
- Ses dosyaları internet olmadan da çalışsın diye ayrı bir önbellekte tutulur ("Tüm sesleri indir").

## Veri ve geri dönüş

- Kayıtlar **yalnızca cihazda** (tarayıcı depolamasında) durur; sunucu yok, hesap yok. Bunun bedeli: tarayıcı verisi silinirse kayıtlar gider, bu yüzden **yedek** düğmesi var.
- Kayıt **olay günlüğü** olarak tutulur (silinmez, eklenir). Yedek başka cihaza yüklenince kayıtlar kimliğe göre **birleşir**.
- **Geri dönmek:** (a) "Ben → Ayarlar → Program başlangıç tarihi" ile günü ileri/geri al, kayıt silinmez; (b) eklediğin içerik paketini "Ben → İçerik → Kaldır" ile kaldır, ilerleme kalır; (c) aynı adda yeni paket yüklersen eskisinin yerine geçer.

## Arayüz

- **Telefon öncelikli:** alt gezinme, ≥44 px dokunma alanları, tek sütun; ≥900 px'de sol menü; koyu mod; yazı boyutu ayarı.
- **Yazıya bağımlılık azaltıldı:** emoji, hareket çizimleri, ilerleme çubukları, renkli doğru/yanlış durumları; ama anlam tek başına renk ya da simgeye bırakılmadı, her zaman yazıyla da söylenir.
- Derleme yok, çerçeve yok; dosyayı açan tarayıcı çalıştırır. Neden: bakım yükü ve kırılma riski en az.

## Oturum, süre ve oyunlaştırma (v3.3)

- **Tek tuş + süre görünürlüğü:** başlamayı zorlaştıran şey "ne kadar sürer, nereden başlayayım" belirsizliğidir. Bu yüzden Bugün'de tek ▶ Başla düğmesi ve her görevin yanında dakika tahmini vardır (`docs/SURE_VE_OTURUM.md`). Dakika sabitleri ölçülmüş değil **tahminimdir**; öğrencinin gerçek hızıyla kalibre edilir.
- **Odak penceresi 30 dk (20–50), +5 dk önerisi yalnız öneridir:** dayanıklılığı artırmak istenen bir hedef; ama süre uzatmak öğrencinin kararıdır. 3 gün/%85/7 gün eşikleri tasarım tahminidir.
- **Spor odak süresine sayılmaz ve mola yerine geçer:** hareket ederek dinlenmek hem sıkıcılığı hem de oturma süresini azaltır.
- **Uzun kelime sunumları bölünür** (≤ 7 kelime + hemen o parçanın alıştırması): aynı süre, daha az monotonluk, daha erken geri çağırma. Bu, kartları art arda göstermenin geri çağırmadan daha az etkili olduğu bilgisine dayanır; bu uygulamada ölçülmedi.
- **Oyunlaştırma bilerek hafif ve cezasız** (`docs/OYUNLASTIRMA.md`): XP olay defterinden türetilir (ayrı sayaç yok), seri esnektir (7 günde 1 gün serbest), hedef gün sayısıdır, liderlik tablosu/bildirim/rastgele ödül yoktur. Kanıt orta düzeyde ve tasarıma bağlıdır; XP öğrenme ölçüsü değildir ve rapora girmez.
- **Serbest alan** (`docs/SERBEST_ALAN.md`): yağmurlu/sakin günlerde dışarıda çalışmak için. Sonuçlar öğrencinin kendi bildirimidir, seviyeyi değiştirmez.
- **Spor videoları kendi ürettiğim çizimli animasyonlardır** (gerçek kişi çekimi değil) ve her harekette dış kaynak bağlantıları vardır (`docs/SPOR_VIDEOLARI.md`).

## Dış uygulamalar

Ayrıntı: `DIS_UYGULAMALAR.md`. Özet: otomatik bağlantı yok, sonuç elle girilir, görevler isteğe bağlıdır; mağaza bağlantıları üçüncü taraf kaynaklarla teyit edildi (Google'ın kendi sayfasından değil).

## Bilerek yapılmayanlar ve bilinen sınırlar

- **Rapor bir yapay zekâ tarafından okunarak denenmedi.** Biçimi örnek ve gerçek ders kayıtlarıyla (tarayıcı testi) denetlendi: her soru satırında soru, öğrenci yanıtı ve doğru yanıt var, "undefined/null" yok, kayıt sayısı satır sayısıyla eşleşiyor. Bir yapay zekânın bu raporu ne kadar iyi yorumladığı ayrıca denenmedi.

- **Gerçek cihazda test yapılmadı.** Testler masaüstü Chromium'da (Playwright) 390×844 (telefon), 820×1180 (tablet) ve 1280×800 boyutlarında yapıldı. iPhone/Safari ve gerçek Android cihazda denenmedi.
- **Ses dosyaları insan kulağıyla onaylanmadı.**
- **Okuma metinleri bir öğretmen tarafından gözden geçirilmedi.**
- **Windows/Android hazır başlatıcı (.bat/.sh) verilmedi**; yerine sade bir sunucu (`node scripts/sunucu.mjs`) ve ücretsiz barındırma yolu anlatıldı (`KULLANIM.md`).
- **Mikrofon kaydı ve çevrimdışı çalışma yalnızca `https` ya da `localhost`** adreslerinde çalışır (tarayıcı kuralı).
- **Telaffuz değerlendirmesi yoktur.**
- **Dış uygulama sonuçları öğrencinin beyanıdır.**
- **Süre tahminleri ve oyunlaştırma sayıları (rütbe eşikleri, rozet hedefleri, XP değerleri, odak eşikleri) bu öğrenci üzerinde sınanmadı;** kullanıldıkça ayarlanmalıdır.
- **Spor videoları tarayıcıda oynarken denenmedi** (ortamdaki başsız Chromium H.264 oynatamadı); gerçek telefonda da denenmedi.
- **Uzun İngilizce dersleri hâlâ 14–21 dakikadır** (bölünme monotonluğu azaltır, süreyi değil). Daha kısa istenirse içerik kırpılmalıdır.
- **Serbest alan sonuçları kendi bildirimidir;** gerçek mekânda yürüyüp yürümediğin denetlenmez.
