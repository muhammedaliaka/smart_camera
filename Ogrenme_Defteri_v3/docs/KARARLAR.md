# Kararlar ve nedenleri

Bu belge, tasarımda verilen kararları ve bilerek bırakılan sınırları tek yerde toplar. Bir şeyi değiştirmek istersen önce buraya bak.

## Ölçme ve puan

| Karar | Neden |
|---|---|
| **Nesnel sorularda doğru/toplam ve yüzde gösterilir** (çoktan seçmeli, dinleyip yazma, sayı, eşleştirme, cümle kurma). İlk denemedeki yanıt sayılır; yanlış soru sonda bir kez daha sorulur ama sonucu değiştirmez. | İstek: "yüzde kaç anladın, kaç soruyu doğru bildin". Önceki sürümde uygulama yalnızca kayıt tutuyordu; bu kural **bilerek gevşetildi**, yalnız tek doğru cevabı olan sorular için. |
| **Açık uçlu yanıtlar puanlanmaz** (kendi cümlenle anlat, kısa konuşma). Yanıt kaydedilir; yanıtında hangi noktaların olduğunu kendin işaretlersin (yazıda bulabildiklerimiz önceden işaretlenir). | Bir programın "iyi anlattın" demesi güvenilir olmaz; yanlış güven ya da yanlış hayal kırıklığı yaratır. |
| **Kontrol günleri tek seferliktir** (yanlışlar tekrar sorulmaz). | Amaç öğretmek değil, ne öğrendiğini görmek. |
| Yardım sorusu 4 seçenekli: yardımsız, ipucu/araç, kitap-sözlük-video, yapay zekâ/çeviri aracı. | Öğrenci için kısa ve anlaşılır tutuldu. (Kayıtlarda görünen kodlar A0, A1, A3, A4'tür; A2 kullanılmıyor.) |

## Tek kaynak ve tutarlılık

- **Kelimeler bir kez yazılır** (`kelimeler.json`); alıştırmalar, oyunlar, tekrar ve sahne çevirileri bu bankadan üretilir. Aynı `en` farklı `tr` ile iki kez yazılırsa doğrulayıcı hata verir.
- **Hareketler bir kez yazılır** (`spor.json` içindeki kütüphane); günlük spor kartları yalnızca `{ref, set, tekrar}` söyler.
- **Hafıza rotaları kimlikle** (`ev`, `okul`, …) bağlanır; liste bir kez yazılır, hatırlama adımları `ref` ile ona bakar.
- **Program yalnızca ders kimliği listeler**; ders içeriği programda yazılmaz.
- **Doğrulayıcı** (`js/dogrula.js`; tarayıcıda kendi paketini yüklerken ve komut satırında `scripts/dogrula.mjs` ile aynı kod çalışır) şunları yakalar: aynı soru farklı cevap, eksik/yanlış referans, aynı emoji, kullanılmayan kelime/hareket, programa bağlanmamış ders, aynı dersin iki kez programlanması, gün aralığı hataları.
- **Cevap anahtarı yazılmaz, türetilir.** Çoktan seçmeli sorularda doğru şık her zaman ilk yazılandır; uygulama şıkları karıştırır. Böylece "anahtar Z diyor, şık Y" biçiminde bir hata mümkün olmaz.

## Program

- **Hafta 1 = 4 öğrenme günü + 3 kontrol günü** (istek bu yöndeydi). **Hafta 2 = 6 öğrenme günü + 1 kontrol günü**: öğrenci kontrol alışkanlığını edindi, öğrenme için daha çok gün gerekiyor.
- Günde 2–4 zorunlu görev (çoğu gün 3), en çok 2 isteğe bağlı görev. 4 zorunlu görev yalnız 14. günde var (üç kısa kontrol + spor). İsteğe bağlılar "isteğe bağlı" etiketiyle gösterilir ve günü tamamlamayı engellemez.
- **Hedef odaklı, süre odaklı değil:** hiçbir kartta "20 dakika çalış" yok; "bu listeyi bakmadan yaz", "2 set × 8" gibi hedefler var.
- **İngilizce tekrar aralığı 3 → 10 → 20 → 50 gün** (istek). Yanlış cevap aynı kutuda kalır ve ertesi gün yeniden sorulur.
- **İki hafta içerik hazır; aylık program kullanıcı tarafından eklenir** (bkz. `ICERIK_EKLEME.md`). Neden iki hafta: kalite her dersin tek tek yazılıp dinlenip sorulmasıyla sağlanır; kalitesiz 12 hafta yerine iyi 2 hafta ve ekleme sistemi tercih edildi.

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

## Dış uygulamalar

Ayrıntı: `DIS_UYGULAMALAR.md`. Özet: otomatik bağlantı yok, sonuç elle girilir, görevler isteğe bağlıdır; mağaza bağlantıları üçüncü taraf kaynaklarla teyit edildi (Google'ın kendi sayfasından değil).

## Bilerek yapılmayanlar ve bilinen sınırlar

- **Gerçek cihazda test yapılmadı.** Testler masaüstü Chromium'da (Playwright) 390×844 (telefon), 820×1180 (tablet) ve 1280×800 boyutlarında yapıldı. iPhone/Safari ve gerçek Android cihazda denenmedi.
- **Ses dosyaları insan kulağıyla onaylanmadı.**
- **Okuma metinleri bir öğretmen tarafından gözden geçirilmedi.**
- **Windows/Android hazır başlatıcı (.bat/.sh) verilmedi**; yerine sade bir sunucu (`node scripts/sunucu.mjs`) ve ücretsiz barındırma yolu anlatıldı (`KULLANIM.md`).
- **Mikrofon kaydı ve çevrimdışı çalışma yalnızca `https` ya da `localhost`** adreslerinde çalışır (tarayıcı kuralı).
- **Telaffuz değerlendirmesi yoktur.**
- **Dış uygulama sonuçları öğrencinin beyanıdır.**
