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
| Geçme ölçütü | yoklamadaki sorularda **≥ %80** (ör. 7 soruda en çok 1 hata) | Tek bir dikkatsizlik seviyeyi düşürmesin diye. |
| Hız | Beceri başına **günde en çok 1 yoklama**, en çok 7 yoklama | Ayrı günlere yaymak tek günlük uykusuzluk/yorgunluk etkisini azaltır. |
| Bitiş | Geçilen en yüksek ile kalınan en düşük seviye arası ≤ 2 olunca | Çözünürlük ±2 seviye. |
| Başlangıç seviyesi | geçilen en yüksek seviyenin **%80'i** (en az 1) | Güvenlik payı: gerçek çalışma başarıyla başlasın. |

Yoklamalar çoktan seçmeli sorularda **"Bilmiyorum"** seçeneği taşır; şansa doğru işaretlemek yerine bilinmeyen dürüstçe işaretlenir. Yoklamada yanlışlar yeniden sorulmaz (ölçüm, öğretim değil). Her yoklama sonunda doğrusu gösterilir; yani yoklama aynı zamanda ön-testtir.

Yerleştirme sonucu "Ben → İlerleme → Seviyelerin" kartında ve raporda görünür; istenirse elle düzeltilebilir (öğretmen/yapay zekâ önerisiyle).

## 3. Yükselme ve düşme

| Durum | Sonuç |
|---|---|
| Oturumda puanlanan sorular ilk denemede **%100** (en az 5 soru) | Seviye **+1** (spor: üst üste 2 tam oturum) |
| %60 – %99 | Aynı seviye |
| **%60'ın altı**, üst üste 2 oturum | Seviye **−1** (en altta 1) |
| Yarım bırakılan oturum | Hiçbir şeyi değiştirmez |

Seviye durumu **olay defterinden yeniden hesaplanır** (kayıt silinmez, geçmiş değişmez); kurallar `icerik/seviye.json` içinde veridir.

## 4. Becerilere göre merdiven

| Beceri | Seviye neyi belirler | Oturum nasıl kurulur | İçerik kaynağı |
|---|---|---|---|
| **İngilizce** | Kelimenin seviyesi (`sv`): sıklık ve konuya göre sıralanmış | Seviyedeki ~5 yeni kelime (kart + alıştırma), önceki seviyelerden 3 hatırlama sorusu, 1 dikte | `icerik/kelimeler*.json` her kelimede `sv` |
| **Okuma** | Metnin seviyesi: uzunluk, kelime sıklığı, cümle yapısı | Seviyene en yakın okunmamış metin + sorular | Dersler (`iz: okuma`, `sv`) |
| **Dinleme** | Kaydın seviyesi: uzunluk, hız, konuşmacı sayısı, ayrıntı düzeyi | Seviyene en yakın dinlenmemiş kayıt + sorular | Dersler (`iz: dinleme`, `sv`) |
| **Hafıza** | Liste uzunluğu ve bekleme süresi | Seviyeye göre üretilen kelime listesi (3 öğe ile başlar), gerekirse araya dikkat dağıtıcı | `icerik/hafiza-havuz.json` (somut kelimeler) |
| **Spor** | Hacim (yürüyüş, set, tekrar, tur) | Tablodan seviyeye göre plan; yerleştirme testi **yok** | `icerik/seviye.json` spor tablosu |

Seviye 1–100 kaba bir **CEFR yaklaşımıdır**: 1–10 başlangıç öncesi/A1 başı, 11–25 A1, 26–40 A2, 41–60 A2 sonu–B1 başı, 61–80 B1, 81–100 B2. Bu eşleme resmî bir CEFR belgesi değildir; yalnız seviyeleri yorumlamaya yarar.

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
| Spor hacmi artışı | Genel ilerleyici yükleme ilkesi (ACSM/NSCA kılavuzları) | Hacmi kademeli artırma | Genel ilke | Üst üste 2 tam oturumda +1 basamak | **Tasarım**: sayılar bizim; kişiye özel program değil, sağlık sorunu olan doktora danışmalı |

**Kullanılmayan yaygın inanışlar:** "Öğrenme stilleri" (görsel/işitsel öğrenen) için eğitim sonucuna bağlı kanıt zayıf olduğundan tasarımda kullanılmadı. Yeniden okuma/vurgulama "düşük yarar" olduğundan önerilmedi.

## 6. Bilinen sınırlar

- Seviye sayıları (5/10/20/35/50, %80, %100, %60, %80'i, 7 soru) **bizim tasarımımızdır**; kanıt tablosundaki ilkelere uyar ama bu öğrenci üzerinde sınanmadı. İlk ayın sonunda kayıtlara bakıp ayarlamak gerekir (kurallar `icerik/seviye.json`'da).
- İçerik tavanı: Her beceri için hazır içerik belli bir seviyeye kadardır. Seviyen oraya gelince uygulama bunu gösterir; yeni içerik "kolay giriş" biçimi ya da MCP ile eklenir.
- Yerleştirme 7 günle sınırlıdır; bu sürede bir beceride yoklama bitmezse o ana kadar geçilen en yüksek seviye alınır.
- Yoklama soru sayısı küçük (5–7); tek bir yoklamanın güvenilirliği sınırlıdır. Bu yüzden başlangıç %80 güvenlik payıyla yapılır ve oturumlarla düzeltilir.
