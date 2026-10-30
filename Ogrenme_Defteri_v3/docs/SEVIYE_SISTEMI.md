# Seviye sistemi: nasıl çalışır, neye dayanır, nerede sınırı var?

Bu belge dört şeyi anlatır: **(1)** seviye merdiveni ve ilk hafta yerleştirme, **(2)** yükselme ve düşme kuralları, **(3)** her becerinin merdiveni, **(4)** kullanılan tekniklerin kanıt durumu. Sayıların hangileri kanıta, hangileri bizim tasarımımıza dayanır, açıkça ayrılmıştır.

## 1. Fikir

- Her beceri (İngilizce, okuma, dinleme, hafıza, spor) ayrı bir merdivendir. Seviye **1'den başlar, hafif hafif yükselir**; tepe noktası yoktur (ölçek 1–100 gösterilir, içerik eklendikçe uzar).
- **En zorlayıcı testle başlanmaz.** İlk hafta herkes en altta değil, **5. seviyeden** başlayan kısa yoklamalarla ölçülür; geçtikçe 10 → 20 → 35 → **50**'ye çıkılır. **Yerleştirme testi 50'nin üstüne çıkmaz.** Bir beceride 50 de geçilirse yerleştirme "50 (tavan)" yazılır; sonrası gerçek çalışmada kendiliğinden yükselir.
- İlk hafta bitince **gerçek çalışma** başlar: her gün her beceri için o günkü seviyene göre kısa bir **seviye oturumu** yapılır.
- Oturumdaki puanlanan soruların **hepsi ilk denemede doğruysa seviye bir basamak yükselir**. Çok az doğruysa iki oturum üst üste sonra bir basamak iner. Arası aynı seviyede kalır (yeni içerikle).

## 2. Yerleştirme (ilk hafta)

| Kural | Değer | Not |
|---|---|---|
| Yoklama basamakları | 5 → 10 → 20 → 35 → 50 | Biri başarısız olursa iki seviye arası ikiye bölünerek aranır (ikili arama). |
| Tavan | 50 | En üst yoklama bile 50'yi geçmez. |
| Geçme ölçütü | yoklamadaki sorularda **≥ %80** (7 soruda en çok 1 hata); **en az 4 soruluk yoklamada tek yanlış da geçer** (3/4) | Tek bir dikkatsizlik seviyeyi düşürmesin diye. 4 soruda %80 kuralı tek yanlışı bile cezalandırırdı (3/4 = %75), 5 soruda ise bir yanlışa izin verirdi; bu tutarsızlık `birYanlisHakki` ile giderildi (`icerik/seviye.json`; 0 yazılırsa kapanır). |
| Hız | Beceri başına **günde en çok 1 yoklama**, en çok 7 yoklama | Ayrı günlere yaymak tek günlük uykusuzluk/yorgunluk etkisini azaltır. |
| Bitiş | Geçilen en yüksek ile kalınan en düşük seviye arası ≤ 2 olunca; ya da 7 yoklama dolunca; ya da 50 geçilince | Normalde çözünürlük 1–2 seviyedir. |
| Başlangıç seviyesi | geçilen en yüksek seviyenin **%80'i** (en az 1) | Güvenlik payı: gerçek çalışma başarıyla başlasın. |

**Çözünürlük ne kadar iyi?** Hatasız (hiç şans/dikkatsizlik olmayan) bir öğrenci için motoru 0–70 arasındaki her gerçek seviyede çalıştırdım: yerleştirme **en çok 7 yoklamada** biter ve bulunan seviye gerçek seviyeyi **hiçbir zaman aşmaz**. Ama 7 yoklama sınırına takılınca (71 durumdan 30'unda) geçilen ile kalınan arası açık kalır; **en kötü durumda gerçek seviye bulunandan 3 basamak yukarıda olabilir** (ör. 35 geçildi, 39 kalındı). Gerçek öğrencide tek yoklamadaki soru sayısı küçük olduğundan (7) şans ve dikkatsizlik bunu büyütür. Bu yüzden başlangıç seviyesi bilerek altında tutulur (%80) ve ilk haftalardaki oturumlar seviyeyi düzeltir. Bu özellik `tests/unit/seviye.test.mjs` içinde sınanır.

Yoklamalar çoktan seçmeli sorularda **"Bilmiyorum"** seçeneği taşır; şansa doğru işaretlemek yerine bilinmeyen dürüstçe işaretlenir. Yoklamada yanlışlar yeniden sorulmaz (ölçüm, öğretim değil). Her yoklama sonunda doğrusu gösterilir; yani yoklama aynı zamanda ön-testtir.

Yerleştirme sonucu "Ben → İlerleme → Seviyelerin" kartında ve raporda görünür; istenirse elle düzeltilebilir (öğretmen/yapay zekâ önerisiyle).

## 3. Yükselme ve düşme

| Durum | Sonuç |
|---|---|
| Oturumda puanlanan sorular ilk denemede **%100** (en az 5 soru) | Seviye **+1** (spor: üst üste 2 tam oturum) |
| %60 – %99 | Aynı seviye |
| **%60'ın altı**, üst üste 2 oturum | Seviye **−1** (en altta 1) |
| Yarım bırakılan oturum | Hiçbir şeyi değiştirmez |
| Aynı metnin **tekrarı** (yeni metin kalmamış) | Kaydedilir ama hiçbir şeyi değiştirmez (cevaplar bellekten gelebilir) |

Seviye durumu **olay defterinden yeniden hesaplanır** (kayıt silinmez, geçmiş değişmez); kurallar `icerik/seviye.json` içinde veridir.

## 4. Becerilere göre merdiven

| Beceri | Seviye neyi belirler | Oturum nasıl kurulur | İçerik kaynağı |
|---|---|---|---|
| **İngilizce** | Kelimenin seviyesi (`sv`): konuya ve sıklığa göre sıralanmış (aşağıda "Seviye nasıl atandı?") | Seviyedeki ~5 yeni kelime (kart + alıştırma), önceki seviyelerden 3 hatırlama sorusu, 1 dikte | `icerik/kelime-bankasi.json` (413 kelime) ve ilk iki haftanın kelimeleri; her kelimede `sv` |
| **Okuma** | Metnin seviyesi: uzunluk, kelime sıklığı, cümle yapısı | Seviyene en yakın okunmamış metin + sorular | `icerik/okuma-seviyeli.json` ve eski okuma dersleri (`iz: okuma`, `sv`) |
| **Dinleme** | Kaydın seviyesi: uzunluk, hız, konuşmacı sayısı, ayrıntı düzeyi | Seviyene en yakın dinlenmemiş kayıt + sorular | `icerik/dinleme-seviyeli.json` ve eski dinleme dersleri (`iz: dinleme`, `sv`) |
| **Hafıza** | Liste uzunluğu ve bekleme süresi | Seviyeye göre üretilen kelime listesi (3 öğe ile başlar), gerekirse araya dikkat dağıtıcı | `icerik/hafiza-havuzu.json` (147 somut sözcük) |
| **Spor** | Hacim (yürüyüş, set, tekrar, tur) | Tablodan seviyeye göre plan; yerleştirme testi **yok** | `icerik/seviye.json` spor tablosu |

Seviye 1–100 kaba bir **CEFR yaklaşımıdır**: 1–10 başlangıç öncesi/A1 başı, 11–25 A1, 26–40 A2, 41–60 A2 sonu–B1 başı, 61–80 B1, 81–100 B2. Bu eşleme resmî bir CEFR belgesi değildir; yalnız seviyeleri yorumlamaya yarar.

### Seviye nasıl atandı? (kelimeler, okuma, dinleme)

Bir içeriğin seviyesi ölçülmüş bir değer değil, **sıralanmış bir tahmindir**; yeterince öğrenciyle sınanmış bir ölçek yoktur. Kullandığımız yöntem:

1. **Kelimeler.** Her kelime bir **konu grubuna** girer (insan, yiyecek, ev, …). Grubun seviye aralığını **elle** verdik (`@kelimeler grup=yiyecek sv=6-24`). Grup içinde sıra, kelimenin **sıklık sırasına** göre yayılır: sık sözcük aralığın altına, seyrek olan üstüne. Sıklık tek başına ölçüt yapılmadı, çünkü sık olan her sözcük kolay, seyrek olan her sözcük zor değildir. Tek tek elle düzeltilen kelimeler satırda `sv=` ile belirtilir. Sıra → seviye çapaları (50. sözcük = 1, 200 = 8, 500 = 16, 1000 = 26, 2000 = 38, 3000 = 46, 5000 = 60, 8000 = 75, 10 000 = 85; aralarda logaritmik) **bizim seçimimizdir**.
2. **Sıklık listesi pakete konmadı.** Kullanılan açık sıklık listesinin (google-10000-english) lisansı kişisel kullanıma izin veriyor; dağıtıma değil. Pakette yalnız kelime başına **türetilmiş sıra numarası** (`siklik`) vardır; listenin kendisi yoktur. Yeni kelimeler için listeyi kendin ver (`--siklik`) ya da her satıra elle `sv=` yaz.
3. **Okuma ve dinleme metinleri** uzunluğa, cümle yapısına ve sözcük zorluğuna göre elle sıralandı; **Ateşman okunabilirlik puanı** yalnız bu sıralamanın ters düşmediğini **denetlemek** için kullanılır (doğrulayıcı sıra bozulursa uyarır). Dinleme metinleri uydurma alıştırma metinleridir; gerçek kaynak gibi sunulmaz.
4. **Mevcut sınır.** Kelimeler seviye 1–70, okuma 4–66, dinleme 2–70 arasındadır. Yüksek seviyede içerik bitince oturum "bu seviyede içerik yok" der (`icerik_kapsami` MCP aracı ya da doğrulayıcı kapsam uyarısı nerede eksik olduğunu gösterir). Sistem merdiveni **sınırlamaz**; sınırlı olan hazır içeriktir. Yeni içerik kolay giriş biçimiyle (`docs/KOLAY_GIRIS.md`) ya da yapay zekâ ile (`docs/MCP.md`) eklenir.

## 5. Kanıt tablosu (dürüst sürüm)

"Güç" sütunu bizim yorumumuzdur: **Güçlü** = birçok çalışmada tekrarlanmış; **Orta** = olumlu ama koşullara bağlı; **Tasarım** = bizim kararımız, deneyle doğrulanmadı.

| Teknik / karar | Kaynak | Ne gösterdi (kısaca) | Güç | Bu uygulamada | Sınır |
|---|---|---|---|---|---|
| Aralıklı tekrar | Cepeda, Vul, Rohrer, Wixted, Pashler (2008) *Psychological Science* 19(11) | 1350'den fazla kişi; en iyi aralık, testin ne kadar sonra yapılacağına bağlı; test gecikmesinin payı olarak ~%5–40; çok kısa aralık çok uzundan daha zararlı | Güçlü | 3 → 10 → 20 → 50 gün tekrar | 3/10/20/50 sayıları genel ilkeye uyar, "kanıtlanmış tek doğru" değildir |
| Geri çağırma pratiği (kendini sınama) | Dunlosky ve ark. (2013) *PSPI* 14(1); Karpicke & Blunt (2011) *Science* | Pratik testi ve dağıtık pratik "yüksek yarar" derecesi; geri çağırma, kavram haritasıyla çalışmaktan daha iyi öğretti | Güçlü | Her dersin sonunda soru, okumada "kapat ve anlat" | Çoğu çalışma üniversite öğrencisiyle |
| Başarısız deneme sonrası öğrenme (ön-test) | Kornell, Hays & Bjork (2009) *JEP:LMC* 35(4); Richland ve ark. | Başarısız bir geri çağırma denemesi, sonraki öğrenmeyi güçlendirebiliyor | Orta | Yerleştirme yoklaması doğrusunu gösterir | Geri bildirim şart; bilgisiz uzun başarısızlık yararlı değil |
| Metindeki kelimelerin bilinme oranı | Hu & Nation (2000); Schmitt, Jiang & Grabe (2011) | Okumada %95 alt sınır, %98 hedef; ilişki doğrusala yakın | Orta–Güçlü | Okuma seviyesi, metindeki kelimelerin sıklığına göre; metinlere bilmediği kelime sözlüğü eklenir | %98 "tam" değil; Hu & Nation %98'i doğrudan sınamadı, çıkarım yaptı |
| Dinlemede kelime oranı | van Zeeland & Schmitt (2012/2013) | Dinlemede ~%95 yeterli olabilir; araştırma az | Orta–Zayıf | Dinleme kayıtları yavaş/net başlar | Az çalışma |
| Kelime bilgisi bantlarıyla yerleştirme | Nation & Beglar (2007) Vocabulary Size Test; Beglar (2010) | 1000'lik sıklık bantları; bant başına 5–10 madde yeterli güvenilirlik verir; testi yetenekten yaklaşık iki düzey üste kadar sürdürmek önerilir | Orta | Yerleştirme: 5 → 10 → 20 → 35 → 50 basamakları | Biz tavanı bilerek 50'de tutuyoruz (kullanıcı tercihi); gerçek seviye 50'nin üstündeyse düşük görünebilir |
| Basamaklı seviye ayarı (staircase) | Levitt (1971) *JASA* 49(2) | "n doğruda yukarı, 1 yanlışta aşağı" kuralları sabit bir doğruluk düzeyine (ör. 2↑/1↓ → %70,7) yakınsar | Güçlü (psikofizik) | Biz **ikili arama** kullanıyoruz; formal staircase değil | Eğitim bağlamında tek tek madde güvenilirliği düşük |
| Optimum zorluk | Wilson, Shenhav, Straccia & Cohen (2019) *Nat. Commun.* 10:4646 | Bazı öğrenme modellerinde ~%85 doğruluk (%15,87 hata) öğrenme hızını en yükseğe çıkarır | Zayıf–Orta (insan öğrencide doğrudan gösterilmedi; yazar da öğrenciye doğrudan geçmeyebileceğini söylüyor) | Yükselme ölçütü %100, düşme ölçütü <%60; arası "bölge" | %85 bir **hedef bölgeyi** anlatır, kuralımız değil; %100 kuralı kullanıcı tercihi |
| Ustalık öğrenmesi | Kulik, Kulik & Bangert-Drowns (1990) *Rev. Educ. Res.* 60(2) | 108 kontrollü çalışmada sınav başarısında olumlu etki | Orta | "Tam doğru olmadan sonraki basamağa geçme" | Eşik çalışmadan çalışmaya değişiyor; %100 bizim tasarımımız |
| Çalışma belleği sınırı | Cowan (2001) *BBS* 24(1) | Yetişkinde odak bellek ~4 öbek | Güçlü | Hafıza merdiveni 3 öğeyle başlar, yavaş uzar | Öbekleme ile aşılır; bireysel fark büyük |
| Mekân yöntemi (hafıza sarayı) | Dresler ve ark. (2017) *Neuron* 93(5) | 51 acemi, 6 hafta eğitim: kelime listesi hatırlamada kontrol gruplarından belirgin artış, bağlantısallıkta değişim | Orta | Sıralı listeler için hafıza sarayı dersleri | Kelime listesi hatırlama genel öğrenmeye otomatik aktarılmaz |
| Anahtar-sözcük ve imgeleme (metin öğrenme) | Dunlosky ve ark. (2013) | "Düşük yarar" derecesi (sınırlı koşullarda yarar) | Güçlü (düşük yarar yönünde) | Bu yöntemler **genel ders çalışma yöntemi olarak önerilmiyor**; yalnız liste/isim ezberinde kullanılıyor | — |
| Karışık (iç içe) çalışma | Dunlosky ve ark. (2013) | "Orta yarar" | Orta | Oturumlarda kelime türleri karışık | Yeni konuda önce blok, sonra karışık daha iyi olabilir |
| Somut sözcüklerin daha iyi hatırlanması | Paivio (1971, 1986) ikili kodlama kuramı ve "somutluk etkisi" çalışmaları | Somut, kolay hayal edilen sözcükler soyutlardan genelde daha iyi hatırlanır | Orta–Güçlü (etki); açıklaması tartışmalı | Hafıza havuzu yalnız somut günlük sözcüklerden oluşur; kelime kartlarında emoji | "Resim ya da emoji her zaman öğrenmeyi artırır" sonucu **çıkarılmaz** |
| Sözcük sıklığına göre öğretme sırası | Nation (2006) *Canadian Modern Language Review* 63(1) ve sıklık/kapsama çalışmaları | Sık sözcükler metinlerin büyük bölümünü kapsar; sıklık, kelime öğretiminde yaygın bir sıralama ölçütü | Orta–Güçlü (kapsama); sıra→seviye çapaları **tasarım** | Kelime bankasında grup içi sıra sıklığa göre | Sık ≠ kolay; bu yüzden konu aralıklarını elle verdik |
| Türkçe okunabilirlik puanı | Ateşman (1997) *Dil Dergisi* 58 (Flesch okuma kolaylığı formülünün Türkçe uyarlaması) | Ortalama hece ve cümle uzunluğundan 0–100 puan | Orta (yalnız yüzey uzunluğunu ölçer) | Okuma metni **sıralamasını denetlemek** için | Anlam zorluğunu ve ön bilgiyi ölçmez; seviyeyi tek başına belirlemez |
| Spor hacmi artışı | Genel ilerleyici yükleme ilkesi (ACSM/NSCA kılavuzları) | Hacmi kademeli artırma | Genel ilke | Üst üste 2 tam oturumda +1 basamak | **Tasarım**: sayılar bizim; kişiye özel program değil, sağlık sorunu olan doktora danışmalı |

**Kullanılmayan yaygın inanışlar:** "Öğrenme stilleri" (görsel/işitsel öğrenen) için eğitim sonucuna bağlı kanıt zayıf olduğundan tasarımda kullanılmadı. Yeniden okuma/vurgulama "düşük yarar" olduğundan önerilmedi.

## 6. Bilinen sınırlar

- Seviye sayıları (5/10/20/35/50, %80, %100, %60, %80'i, 7 soru) **bizim tasarımımızdır**; kanıt tablosundaki ilkelere uyar ama bu öğrenci üzerinde sınanmadı. İlk ayın sonunda kayıtlara bakıp ayarlamak gerekir (kurallar `icerik/seviye.json`'da).
- İçerik tavanı: Her beceri için hazır içerik belli bir seviyeye kadardır (kelime 70, okuma 66, dinleme 70; bölüm 4). Seviyen oraya gelince uygulama bunu gösterir; yeni içerik "kolay giriş" biçimi ya da MCP ile eklenir. Okuma ve dinlemede her seviye aralığında yalnız birkaç metin vardır; yani aynı seviyede uzun süre kalırsan metinler biter.
- Yerleştirme 7 günle sınırlıdır; bu sürede bir beceride yoklama bitmezse o ana kadar geçilen en yüksek seviye alınır. En kötü durumda bulunan seviye gerçeğin 3 basamak altında kalabilir (bölüm 2).
- Yoklama soru sayısı küçük (4–7); tek bir yoklamanın güvenilirliği sınırlıdır. Bu yüzden başlangıç %80 güvenlik payıyla yapılır ve oturumlarla düzeltilir. **Yoklamada çok yanlış bir sonuç çıkarsa** (ör. gerçekte güçlü öğrencinin düşük basamakta iki yanlış yapıp en alttan başlaması) seviye ancak oturum başına bir basamak yükselir; bu durumda "Elle ayarla" ile düzelt ya da raporu yapay zekâya göster.
- **İçerik havuzu seviye ilerlemesini sınırlar (benzetimle ölçüldü).** `node tests/benzetim.mjs` gerçek motoru, planı ve gerçek içeriği; üretilmiş öğrenci yanıtlarıyla (kendi seviyesinin altında %97, üstünde %25 doğru) çalıştırır. 45 günlük, 10 tohumlu çalıştırmada (okuma 28 metin, dinleme 23 kayıt): gerçekte okuma 40 / dinleme 35 olan yetkin öğrenci okumada ortalama **5,6**, dinlemede **3,0** *yeni metinli* oturum yapabildi, kalan oturumlar aynı metnin tekrarıydı; son seviyeler okumada 32–34, dinlemede 28–30 (gerçek seviyenin altında). Nedenleri: (1) yoklama haftası metinlerin dörtte birini tüketir (yoklamada sorulan metin yeni sayılmaz), (2) seviye penceresine (−6…+3) birkaç metin düşer, (3) öğrenci her tam oturumda bir basamak çıktığı için havuzdan metin seviyeden hızlı tükenir. İngilizce ve hafıza böyle sınırlanmaz (kelime bankası 545, hafıza havuzu 147 sözcük; oturumlar sınırsız üretilir). **Bu nedenle okuma ve dinlemede ilerlemenin hızı, yazılan metin sayısına bağlıdır;** benzetimde ilk tekrar oturumu 15.–19. günlerde göründü; yani yetkin bir öğrenci için yaklaşık 3. haftadan itibaren yeni metin gerekir (orta düzey için de 3–4. hafta). Yeni metin eklemek `docs/KOLAY_GIRIS.md` ya da MCP `icerik_ekle` ile birkaç dakikalık iştir.
- **Tekrar oturumu seviyeyi değiştirmez.** Yeni metin kalmayınca uygulama pencerede en eski çözülmüş metni yeniden verir (pekiştirme). Soruların cevapları bellekten geleceği için bu oturum **kaydedilir (raporda "AYNI METNİN TEKRARI" yazar) ama seviyeyi ne yükseltir ne düşürür**. Aksi hâlde aynı metni tekrar çözerek seviye şişerdi.
- **Yetkin öğrenci için tavan:** yoklama 50'de durur; gerçek seviyesi 50'nin üstünde olan biri 40'tan başlayıp tam oturumlarla basamak basamak çıkar. Bu bilerek yavaştır (`hafif hafif yukarı`) ve yukarıdaki içerik sınırına çarpar.
- **%100 yükselme kuralı** kullanıcı tercihidir (bölüm 5, Wilson ve ustalık öğrenmesi satırları): bir tek dikkatsizlik yükselmeyi bir oturum erteler. Kural gevşek tutulsaydı seviye daha hızlı yükselirdi; tutarlı doğru yapamadığın yerde ilerlememen bilerek seçildi. Yanlış bulursan `icerik/seviye.json` içindeki `yukselme.enAzSoru` ve izlerdeki `yukselmeSeri` ayarlanır.
- **Aynı seviyede takılma:** %60–%99 arası oturumlar seviyeyi değiştirmez. Birkaç oturum ardı ardına bu bölgede kalıyorsan ilerleme yavaştır; bu bir hata değil, kuralın doğal sonucudur. Raporda her seviye oturumunun sonucu (`x/y doğru`) ve seviye değişimleri yazılır; takılma oradan görülür.
- Seviye hesabı yalnız bu uygulamadaki **oturumlara** dayanır. Başka yerde (ör. gerçek konuşma) edinilen beceri sayılmaz; seviye elle ayarlanabilir (Ben → İlerleme → Elle ayarla).
- **Hiç gerçek bir öğrenciyle sınanmadı.** Bu sistem birim testleri, bir betikli tarayıcı testi (rastgele yanıtlarla) ve benzetimlerle denetlendi; "ilk ayda seviyeler makul mü?" sorusunun cevabı gerçek kullanımdan çıkacaktır. İlk ayın sonunda raporu (ya da MCP üzerinden `seviyeler` aracını) yapay zekâyla inceleyip sayıları ayarlamanı öneririz.
