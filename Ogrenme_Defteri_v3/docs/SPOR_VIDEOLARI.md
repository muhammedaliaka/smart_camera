# Spor hareketleri: videolar ve ayrıntılar

6 hareket: sandalyeye otur-kalk, duvar şınavı, kalça köprüsü, çekiş provası, denge turu, çeviklik turu. Her hareketin kartında **video, nerede hissedilir, nefes, tempo, sık yapılan hatalar, kolay/zor seçenek ve ne zaman durmalı** bilgisi vardır (`icerik/spor.json`).

## Videolar nedir? (önemli)
Videolar **gerçek bir kişinin çekimi değildir**. `scripts/hareket-video.mjs` ile **kendi ürettiğim, çizimli (SVG) bir figür animasyonudur**: eklemli figür (2 kemikli IK) + Türkçe anlatım (Piper sesi) + altyazı + "doğru form / sık yapılan hata" karşılaştırması → `gorsel/spor/video/<id>.mp4` ve `.jpg` (toplam ≈ 4 MB; çevrimdışı önbelleğe alınır). Amaç: formu **ve hissedilecek yeri** net anlatmak. Gerçek hareket kalitesini, özellikle başlangıçta, bir uzman ya da gerçek video ile karşılaştırmak daha güvenlidir; bunun için her harekette **bağlantılar** da vardır: NHS ve hastane sayfaları (İngilizce, fotoğraflı) ve YouTube arama bağlantıları (içerik değişebilir; belirli bir videoya bağlanmadım).

## Yeniden üretme / yeni hareket
```
node scripts/hareket-video.mjs --model <tr_TR-dfki-medium.onnx> [--python <python>] [--hareket sandalye] [--poster-yalniz]
```
Gerekenler: ffmpeg, ffprobe, Playwright (Chromium), Piper (`pip install piper-tts`). Yeni hareket: `scripts/hareket/sahneler.js` içine sahne yaz, `icerik/spor.json`'a `anlatim` (adım adım betik) ve `nerede/hisset/nefes/tempo/hatalar/kolay/zor/dur/izle` alanlarını ekle, betiği çalıştır, `npm run dogrula`. Doğrulayıcı (`hareketDetayDogrula`) eksik alanları ve bozuk bağlantıları yakalar.

## Sınırlar
- Videolar H.264 mp4'tür. Bu ortamdaki başsız (headless) Chromium H.264 oynatamadığı için **videoların tarayıcıda oynadığı doğrulanamadı, gerçek telefonda da denenmedi**; dosyalar ffmpeg ile üretildi, süre/çözünürlükleri ffprobe ile okundu, karelerden poster alındı ve kartın düzeni posterle denendi. Oynamazsa kartta poster, yazılı ayrıntılar ve bağlantılar kalır.
- Hareketler genel sağlıklı yetişkin/genç içindir; ağrı, baş dönmesi ya da sağlık sorunu varsa bir uzmana danış. Uygulama tıbbi tavsiye vermez.
- Spor seviyesi (1, 2, …) ve "kısmi/zorlanma" ölçüleri **kendi tasarımımdır**, kanıtlanmış bir protokol değildir.
