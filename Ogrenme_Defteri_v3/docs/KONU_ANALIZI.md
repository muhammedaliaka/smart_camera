# Konu konu analiz: ne vardı, neden vardı, neresi zayıftı, şimdi ne var?

Bu belge eski sürümdeki (v2) her konuyu dört soruyla ele alır: **Nedir? Neden seçilmişti? Zayıf yanı neydi? v3'te ne yaptık?**

## Genel teşhis (eski sürüm)

Eski sürüm (v2) içeriği çoğunlukla **göstermiyor, yönlendiriyor ve kaydediyordu**. Aşağıdakiler eski paketin dosyalarından okunarak sayıldı:

- **İngilizce dışarıdaydı.** Uygulamanın kendi metni bile "Günlük İngilizce eğitimi dış uygulamadadır… Burada ders yanıtı yok" diyordu; ders yönergesi USA Learns (20 ünite) ve VOA Let's Learn English (52 ünite) sitelerine gönderiyordu. Uygulamada öğrenilecek kelime, alıştırma ya da ses yoktu.
- **Doğru cevabı olan soru yok denecek kadar azdı.** "Beklenen çıktı, kendi sözlerinle deneyimini ve yapılan işi kaydetmendir." cümlesi paketin içinde 184 kez geçiyordu. Öğrenci ne kadar öğrendiğini göremiyordu.
- **50 bilgi yazısı** (25 konu × 2) kaynaklıydı (OpenStax gibi), ama yazıların her birinde aynı iki şablon soru vardı: "…metindeki ana ayrımı kendi örneğinle anlat" ve "Örneğin neyi gösteriyor; hangi sonucu tek başına göstermiyor?". Cevap anahtarı da tek paragraflık "Ana fikir" idi. Yani soru yazıya özgü değildi, kontrol edilemiyordu.
- **36 yazma istemi ve 36 konuşma senaryosu** Türkçe yönergelerdi ("Karşındaki kişi 'Bu alana yeni başladım' diyor. Onu konuşturacak bir soru sor…"); İngilizce ses ya da örnek cümle içermiyordu.
- Program, ders ve soru verisi ayrı yerlerde duruyordu; aynı bilgi birden çok dosyada yazıldığı için "burada Z, şurada başka" türü tutarsızlıklar çıkabiliyordu.
- Arayüz: tek uzun sayfa, görselsiz, telefonda yazı yığını.

**Eski sürümde iyi olan ve korunan şeyler:** hafıza sarayında gecikmeli geri dönüş fikri, aralıklı tekrar aralıkları (3-10-20-50), kayıtların silinmemesi (olay günlüğü) ve kaynak göstermek.

v3'ün ilkeleri: **(1)** öğretim uygulamanın içinde; **(2)** nesnel sorularda doğru/yanlış ve yüzde gösterilir; **(3)** her bilgi tek yerde yazılır; **(4)** her içerik bir hedefe hizmet eder, gerekmeyen konu yoktur.

## Sayılarla v3

132 kelime/kalıp · 47 ders (10 İngilizce, 5 hafıza, 4 okuma, 3 dinleme, 14 spor, 7 kontrol, 4 dış uygulama) · 12 konuşma sahnesi · 14 günlük program · 6 spor hareketi · her kelime için ses · 454 farklı ses dosyası.

---

## 1. İngilizce

**Nedir?** Sıfırdan başlayan, konuşmaya ve anlamaya dönük İngilizce.

**Neden seçildi?** Öğrencinin ana hedeflerinden biri; her gün küçük adımlarla ilerleme, aralıklı tekrarla en iyi sonuç veren alanlardan biri.

**Zayıf yanı (v2).** Öğretim dışarıdaydı (USA Learns / VOA yönlendirmesi); uygulama kelime, alıştırma, ses ya da konuşma sahnesi sunmuyordu.

**v3.**
- Her ders bir **hedef cümlesiyle** başlar ("Dersin sonunda kendini İngilizce tanıtabileceksin").
- Kelimeler **kademeli**: 1. haftada 54, 2. haftada 78 kelime/kalıp (toplam 132). Örnek cümleler büyük oranda **önceden öğretilmiş** kelimelerle kurulur.
- Her ders: kısa anlatım → kelime kartı (ses + örnek) → otomatik alıştırma → kısa sahne (konuşmacı sesleriyle) → sorular → cümle kurma → dikte → "kendin söyle".
- **Kelimeden otomatik üretim:** alıştırmalar, oyunlar ve tekrarlar tek kelime bankasından türetilir; anlam bir yerde yazılır.
- Aralıklı tekrar: 3 → 10 → 20 → 50 gün; yanlış cevap ertesi gün yeniden sorulur.
- Sayılar için ayrı çalışma: 13 / 30 karışıklığı özellikle çalışılır (dinleyip yazma).
- Dış kaynak: Voscreen (gerçek konuşma hızı) ve Busuu (ikinci bakış açısı) isteğe bağlı görevlerdir.

## 2. Hafıza sarayı (yöntem + uygulama)

**Nedir?** Bir listeyi tanıdığın bir yerin duraklarına bağlayarak ezberleme yöntemi.

**Neden seçildi?** Sıralı listeleri (kelimeler, gezegenler) hatırlamak için eski ve etkili bir yöntem; öğrenci "hafıza sarayı" öğrenmek istiyordu.

**Zayıf yanı (v2).** v2'nin hafıza sarayı motoru en iyi yapılmış kısımdı (rehberli rota, tek tek yerleştirme, gecikmeli dönüş). Sorun içerikteydi: örnek rota **8 duraklıydı**, ama hazır listelerin 12'si de **11–12 öğeliydi**; yani durak sayısından fazla öğe vardı. Tek bir rota vardı, yöntemin gerçek bir işe (ders konusu, İngilizce kelime) bağlanması da yoktu.

**v3.**
- 5 ders: saray nedir ve ilk rota, ilk liste (6 öğe, 6 durak), daha uzun liste ve "hangi iş için hangi yöntem", **İngilizce kelimeleri sarayda kullanma**, gerçek bir konu (gezegenler).
- Liste uzunluğu rotaya göre ayarlanır (rota kurarken en az/en çok durak sayısı belli); **her liste için ayrı rota** (ev, okul, mahalle, akraba evi) kurulabilir, eski listeler birbirine karışmaz.
- Hatırlama **ölçülür**: kaç öğe var, kaçı doğru sırada.
- Gecikmeli kontrol: 30 dakika ve 1 gün sonra. Listeler aralıklı tekrara girer (3-10-20-50 gün).
- Kontrol günlerinde önceki derslerin listeleri bakmadan sorulur.

**Dış uygulama gerekir mi?** Hayır. Hafıza sarayı için ayrı bir uygulama, kendi rotalarını kurmaktan ve kendi resimlerini üretmekten daha iyi sonuç vermez: yöntem kişiseldir (kendi evin, kendi saçma resimlerin). Burada kurduğumuz akış (kur → yerleştir → bakmadan hatırla → gecikmeli kontrol) yeterlidir.

## 3. Okuma

**Nedir?** Kısa bilgi metinlerini okuyup anlamak.

**Neden seçildi?** Okuduğunu anlamak her derste ve sınavda lazım.

**Zayıf yanı (v2).** Okuma, 50 kısa yazıyı (her biri yaklaşık 110 kelime) okuyup iki şablon soruya kendi sözlerinle cevap yazmaktı. Hiçbir soru yazıya özgü değildi, doğru/yanlış yoktu; yazılar soyut ve birbirinden kopuktu.

**v3.**
- **Yöntem öğretilir:** önce bak → bir kez oku → kapat ve anlat.
- 4 kısa metin: uzay istasyonunda su geri dönüşümü, gökyüzünün rengi, arıların dansı, uyku ve öğrenme. (Uyku metni isteğe bağlıdır.) Uzay istasyonu metni NASA'nın Haziran 2023 duyurusuna, uyku metni Amerikan Uyku Tıbbı Akademisi'nin 8–10 saat önerisine dayanır ve ders içinde kaynağı gösterilir. Gökyüzü ve arı metinleri yaygın bilinen bilgilerdir, ders içinde ayrı kaynak gösterilmez. Metinler ayrıca bir öğretmen tarafından gözden geçirilmedi; öneri: bir öğretmene gösterin.
- Her metnin **5–6 yazıya özgü sorusu** vardır: ayrıntı, neden-sonuç, ana fikir ve **"metinde yok"** seçeneği (olmayan bilgiyi tahminle doldurmamayı öğretir).
- Sözlük kutusu zor sözcükleri açıklar; "Metne bak" düğmesi vardır, kontrol gününde kapalıdır.
- Her metin "kendi cümlelerinle anlat" ile biter (puansız).
- Sonuç ekranında **"% anladın"** gösterilir.

## 4. Dinleme

**Nedir?** Kısa İngilizce kayıtları dinleyip anlamak.

**Neden seçildi?** Dinleyerek anlamak, konuşmanın önkoşuludur; Türkiye'de en az çalışılan beceridir.

**Zayıf yanı (v2).** Dinleme çalışması dış sitelere yönlendirmeydi; uygulamada anlamayı ölçen, cevabı olan soru yoktu.

**v3.**
- 3 dinleme dersi: okul duyurusu (4 soru), sesli mesaj (4 soru), Maya'nın günü (5 soru). Her kayıt **en çok 3 kez** dinlenebilir (gerçek hayata yakın), ardından sorular, sonra yazı ve Türkçesi.
- "Her sözcüğü anlamaya çalışma; anahtar bilgiye (gün, saat, sayı, yer) kulak ver" yöntemi öğretilir.
- Derslerdeki 12 konuşma sahnesi ayrıca dinleme çalışmasıdır; sonuç ekranında "% anladın" gösterilir.
- **Voscreen** (gerçek video kesitleri) gerçek hıza alışmak için eklenir. Neden: kayıtlarımız bilerek yavaş ve net; gerçek konuşma değil.

## 5. Spor

**Nedir?** Vücut ağırlığıyla, ekipmansız, kademeli bir hareket programı: yürüyüş, güç, denge, çeviklik.

**Neden seçildi?** Uzun süre oturarak çalışmanın dengelenmesi; ilk hafta güvenli başlangıç.

**Zayıf yanı (v2).** Spor planı "denk dakika" mantığıyla hesaplanıyordu (her hareket için bir dakika karşılığı: yürüyüş 12, sandalye 2, köprü 2…); öğrenciye gösterilen ölçü ile hedef farklı birimlerdeydi. Dambıl gibi ekipman mantığı da vardı. Kullanıcı hedefi dakika değil, hedef bazlı istemişti.

**v3.**
- **6 hareket** (sandalyeye otur-kalk, duvar şınavı, kalça köprüsü, çekiş provası, denge turu, çeviklik turu); her biri **bir kez** tanımlanır ve **hareket çizimiyle** gösterilir. Aynı hareket her günde yeniden yazılmaz, sayısı (set, tekrar, tur) günden güne değişir.
- 14 günlük sakin ilerleme: 1–3. gün 1 set, 4–6. gün 2 set, 7. gün hafif gün; 2. haftada güç günleri ile yürüyüş günleri **dönüşümlü**, 14. gün yine hafif.
- Hedef **dakika değil, mesafe ve tamamlanan set/tur** (ör. yürüyüş 1,5–2 km → 2,5–3 km).
- Her kartta güvenlik notu vardır: ağrı ya da baş dönmesinde bırak; yapılmayan spor ertesi güne eklenmez.
- Zorlanma (0–10), "destek (duvar, sandalye) kullandım" ve kısmi tamamlama kaydedilir; puan değildir.

Sınır: Spor kartı bir sağlık uzmanının kişiye özel programı değildir; sağlık sorunu olan biri doktora danışmalıdır.

## 6. Ölçüm ve kontrol günleri

**Nedir?** Hafta sonunda öğrendiklerini yardımsız deneme + haftanın nasıl geçtiğini kaydetme.

**Neden seçildi?** Öğrenme ancak denendiğinde görülür; yük ve uyku kaydı sonraki haftaları ayarlamaya yarar.

**Zayıf yanı (v2).** Ölçümler "kendi sözlerinle kaydet" biçimindeydi; neyin doğru neyin yanlış olduğu belli değildi.

**v3.**
- İlk hafta **4 gün öğrenme (Gün 1–4), 3 gün kontrol (Gün 5–7)**: Gün 5 İngilizce kontrolü, Gün 6 hafıza kontrolü, Gün 7 okuma + dinleme kontrolü ve "haftayı değerlendir" (zorluk, uyku, spor, yük, bir not).
- İkinci hafta: 6 öğrenme günü, Gün 14'te İngilizce, hafıza + dinleme kontrolü ve değerlendirme.
- Kontrol günleri tek seferliktir (yanlışlar tekrar sorulmaz); sonuç, neyi tekrar edeceğini gösterir.
- Değerlendirme soruları her hafta aynıdır (h1-… / h2-… kimlikleriyle); haftalar arası karşılaştırma yapılabilir.

## 7. Çıkarılan "bilgi yazıları" (25 konu, 50 yazı)

Eski sürümde şu konular ikişer yazıyla (giriş + derinleşme) işlenmişti: aralıklı tekrar, unutma, hafıza sarayı, uyku, çalışma belleği, okurken gözler, dikkat, konuşmayı duymak, çoklu görev, göz yorgunluğu, dayanıklılık, kuvvet, denge, ergenlikte antrenman, toparlanma, ikinci dil, dinleme anlama, ses ve vurgu, çeviri, yapay zekâ dili, makine öğrenmesi, simülasyon, uzayda kapalı yaşam, enerji depolama ve bilgi doğrulama.

**Neden vardı?** "Neden böyle çalışıyoruz?" sorusunu cevaplamak ve merak uyandırmak.

**Zayıf yanı.** Yazılar soyut ve kısa; her birinin iki sorusu aynı şablondu (bkz. yukarıda). Birkaç konu öğrencinin gündelik hedeflerinden uzaktı (yapay zekâ dili, makine öğrenmesi, simülasyon fiziği, enerji depolama): bunları okumak, ardından yapılacak somut bir iş olmadan, "karmaşık ve gereksiz" izlenimi veriyor.

**v3.**
- "Neden böyle çalışıyoruz?" bilgisi artık ilgili dersin içinde **bir iki cümledir** (derslerin `neden` alanı) ve yaptığın işle doğrudan ilgilidir.
- Gerçekten öğretici olanlar **okuma dersine** dönüştü, yazıya özgü sorularla: uyku ve öğrenme (aralıklı tekrar ve uyku konularının sade hâli), uzay istasyonunda su (kapalı yaşam sistemleri konusunun sade hâli), gökyüzü ve arıların dansı (merak uyandıran, doğrulanabilir bilgiler).
- Diğerleri **bu pakete alınmadı**. İstersen herhangi birini `oku` dersi olarak ekleyebilirsin (bkz. `ICERIK_EKLEME.md`); kural: önce soruları ve cevap anahtarını yaz, sonra metni.

## 8. Yazma istemleri ve konuşma senaryoları (36 + 36)

**Nedir?** Türkçe yönergeli serbest yazma görevleri ve konuşma rolü senaryoları.

**Zayıf yanı.** Hedefi belirsiz, İngilizce sesi ya da örneği olmayan, kontrol edilemeyen görevlerdi.

**v3.** Bunların yerine, öğrendiğin kelimelerle kurulan **12 kısa İngilizce sahne** (sesli, soru ve cümle kurma alıştırmalı) ve her ders sonunda 1 "kendin söyle/yaz" görevi (örnek cevapla) var. Açık uçlu görevler **puanlanmaz**: yanıt kaydedilir, anahtar noktaları kendin işaretlersin.

## 9. Aralıklı tekrar sistemi

**Nedir?** Eski bilginin 3, 10, 20 ve 50 gün sonra yeniden sorulması.

**v2'den ne korundu?** Aralıklar (kullanıcının seçimi) ve "gerçekleşen tekrardan sayma" kuralı.
**Ne iyileşti?** Madde türleri otomatik: kelimeler ve işaretlenmiş listeler. Yanlış cevapta kutu korunur, ertesi gün tekrar sorulur. Günlük tekrar adedi (10/20/30) seçilebilir.

## 10. Dış uygulamalar

Ayrıntı: `DIS_UYGULAMALAR.md`. Kısaca: Voscreen ve Busuu tercih edildi; otomatik bağlantı mümkün değil; sonuç elle girilir.

## Öğretmeden bıraktığımız şeyler (dürüst liste)

- **Konuşma telaffuzu:** uygulama senin söylediğini değerlendirmez. Ses kaydı alabilir, ama telaffuz puanlaması yoktur.
- **Dilbilgisi anlatımı** yalnızca kalıp düzeyindedir (I am…, "on Monday", "Can you repeat that, please?", can / can't gibi). Ayrıntılı bir dilbilgisi kitabı değildir.
- **Ses kalitesi:** Konuşmalar bilgisayarla üretildi ve bilgisayarla kontrol edildi (kayıt metnini geri okuyup karşılaştırma). Bir insanın baştan sona dinleyip onaylaması **yapılmadı**; garip duyduğun bir yer olursa `ICERIK_EKLEME.md`'deki "Ses" bölümüyle o dosyayı yeniden üretebilirsin.
- **İlerleme sınırı:** 2 haftalık içerik hazır. Yeni haftalar için `ICERIK_EKLEME.md`.
