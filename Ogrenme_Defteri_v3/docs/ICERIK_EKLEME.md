# İçerik ekleme kılavuzu

Uygulamadaki her şey (kelime, ders, program, spor hareketi, dış uygulama bağlantısı) `icerik/` klasöründeki JSON dosyalarından gelir. Kod değiştirmeden ay ay içerik ekleyebilirsin.

**Altın kural: her bilgi tek yerde yazılır.** Aynı şeyi iki yere yazman gerekmez; yazarsan doğrulayıcı seni uyarır.

## 1. Neyi nereye yazarım?

| Eklemek istediğin | Nereye | Başka yere yazman gerekir mi? |
|---|---|---|
| Yeni kelime / kalıp | `icerik/kelimeler.json` | Hayır. Alıştırmalar, oyunlar ve tekrarlar kelimeden **otomatik** üretilir |
| Yeni ders | Bir paket dosyasındaki `dersler` listesi | Yalnız programa bir gün atamak için `program.json` |
| Dersi bir güne bağlamak | `program.json` → `haftalar` → `gunler` → `gorevler` | Hayır |
| Yeni hafta | `program.json` içine yeni bir `hafta` bloğu | Hayır |
| Spor hareketi tarifi | `icerik/spor.json` → `hareketler` | Hayır. Dersler yalnız `ref` ile başvurur |
| Hafıza sarayı rotası | Dersin içindeki `saray-kur` adımı | Hayır |
| Voscreen / Busuu benzeri dış uygulama | `icerik/genel.json` → `disUygulamalar` | Görev için bir `dis` adımı içeren ders |
| Konuşmacı → ses eşlemesi | `icerik/genel.json` → `sesler` | Hayır |
| Ses (mp3) dosyaları | `ses/` klasörü | **Elle yazılmaz**; metinden otomatik üretilir (bölüm 7) |

## 2. Tek kaynak kuralları (cevap anahtarı tutarsızlığı bu yüzden olmaz)

1. **Kelimenin anlamı yalnız `kelimeler.json`'da yazılır.** Dersler kelimeye kimliğiyle (`"hello"`) başvurur. Anlamı değiştirirsen her ders, alıştırma ve oyun aynı anda değişir.
2. **Aynı İngilizce sözcük iki farklı anlamla yazılırsa doğrulayıcı hata verir.**
3. **Çoktan seçmeli soruda doğru cevap her zaman ilk seçenektir.** Uygulama sırayı karıştırır. Ayrıca "doğru" alanı yazmazsın; yazarsan hata verir. Sırası sabit kalmalıysa `"sabit": true` ve `"dogru": "metin"` yazarsın.
4. **Hareket tarifi kitaplıkta tek kez yazılır**; günlerde yalnız set ve tekrar sayısı değişir.
5. **Program yalnız ders kimliği listeler.** Dersin içeriği programda tekrarlanmaz.
6. **Ses dosyaları metinden türetilir.** Metni değiştirirsen yeni dosya gerekir; `guncelle.mjs` bunu sana söyler.

## 3. Sık yapılanlar

### Yeni kelime
`icerik/kelimeler.json` içinde `kelimeler` listesine tek satır ekle:

```json
{ "id": "airport", "en": "airport", "tr": "havalimanı", "emoji": "✈️", "ornek": { "en": "The airport is big.", "tr": "Havalimanı büyük." } }
```

`emoji` ve `ornek` isteğe bağlıdır. Aynı emoji iki kelimede kullanılırsa uyarı alırsın (resimli seçeneklerde ayırt edilemez). Kelimeyi bir dersin `kelime-ogren` adımında listelemezsen "hiçbir derste kullanılmıyor" uyarısı çıkar.

### Yeni ders
Bir paket dosyasının `dersler` listesine ekle. En küçük örnek:

```json
{
  "id": "en-11-sehir", "iz": "ingilizce", "emoji": "🏙️",
  "baslik": "Şehirde yolunu bul",
  "hedef": "Bir yeri sormak ve tarif almak.",
  "neden": "Gerçek hayatta en çok kullanacağın konuşmalardan biri.",
  "adimlar": [
    { "tur": "kelime-ogren", "kelimeler": ["airport", "street"] },
    { "tur": "alistirma", "kelimeler": ["airport", "street"], "adet": 8 },
    { "tur": "soru", "soru": "“airport” ne demek?", "secenekler": ["havalimanı", "sokak", "okul"] }
  ]
}
```

- `id`: küçük harf, rakam ve tire. Hiçbir yerde tekrar edemez.
- `iz`: `ingilizce`, `hafiza`, `okuma`, `dinleme`, `spor` ya da `olcum` (kontrol günleri; yanlışlar tekrar sorulmaz).
- `hedef`: bir cümle, "dersin sonunda ne yapabileceksin". `neden`: neden gerekli.

### Dersi bir güne bağlamak ve yeni hafta
`program.json`:

```json
{ "hafta": 3, "baslik": "Üçüncü hafta", "gunler": [
  { "gun": 15, "baslik": "Şehir", "hedef": "Yer sormak.", "gorevler": [
      { "ders": "en-11-sehir" },
      { "ders": "oku-05-ornek", "istege": true } ] }
] }
```

- `gun` mutlak numaradır: hafta 3 = 15–21. Aralığın dışına yazarsan doğrulayıcı hata verir.
- `"istege": true` görev isteğe bağlı görünür.
- Bir ders yalnız bir güne bağlanır (her gün kendi ders kimlikleri vardır; böylece tamamlama kaydı karışmaz). Tekrar için dersi çoğaltma: aralıklı tekrar sistemi zaten eski kelimeleri geri getirir.

### Yeni paket dosyası (ör. ay ay içerik)
1. `icerik/ingilizce-hafta3.json` oluştur: `{ "paket": "ingilizce-hafta3", "ad": "İngilizce · Hafta 3", "surum": 1, "dersler": [ ... ] }`
2. `icerik/index.json` içindeki `paketler` listesine dosya adını ekle.
3. `node scripts/guncelle.mjs` çalıştır.

Bir paket, `kelimeler`, `hareketler`, `dersler`, `haftalar`, `disUygulamalar` ve `sesler` bölümlerinden istediğini içerebilir. Programı ayrı bir paketle genişletirsen aynı hafta numarası kullanabilirsin; günler birleşir.

### Bir şeyi değiştirmek
Başka bir paketteki dersi, kelimeyi ya da günü **değiştirmek** için aynı `id` ile yazıp `"degistir": true` ekle. Eklemezsen "kimlik iki yerde" hatası alırsın (kazara üzerine yazmayı engeller).

### Spor günü
`icerik/spor.json` içinde bir ders kopyala; `bolumler` içindeki `ref` kitaplıktaki hareketin kimliğidir:

```json
{ "ad": "Güç ve teknik", "simge": "💪", "hedef": "her hareket 2 set × 8",
  "hareketler": [ { "ref": "sandalye", "set": 2, "tekrar": "8" } ] }
```

Yürüyüş gibi mesafeli bölüm: `{ "tur": "mesafe", "ad": "Yürüyüş", "hedef": "2,5–3 km" }`. Yeni hareket için `hareketler` listesine `{ id, ad, adimlar[], uyari?, gorsel?, birim? }` ekle (`birim: "tur"` ise "2 tur" diye gösterilir).

### Hafıza sarayı
- Rota kurmak: `{ "tur": "saray-kur", "id": "okul", "ad": "Okul rotası", "min": 7, "max": 9, "oneriler": ["Kapı", "…"] }`. Her rotanın kendi `id`'si vardır. Aynı rotaya yeni liste koymak eski listeyle karışma yapar; **yeni liste için yeni rota** kur.
- Listeyi göstermek: `liste-sun` (isteğe bağlı `"tekrar": true`: aralıklı tekrara girer).
- Rotaya yerleştirmek: `saray-yerlestir` (`"saray": "okul"`).
- Bakmadan hatırlamak: `liste-hatirla` (`"ref": "liste-adım-kimliği"`, `"saray": "okul"`). **Başka dersteki listeyi** sormak için `"ref": "ders-kimliği/adım-kimliği"` yaz (kontrol günleri böyle çalışır).

### Okuma ve dinleme
- `oku`: `metin` (paragraf listesi), `sozluk`, `sorular`, isteğe bağlı `serbest` (kendi cümlelerinle anlat). Sorular metne bağlıdır; varsayılan olarak "Metne bak" düğmesi görünür. Kontrol günü için `"kapali": true` yaz (metne bakılamaz).
- `dinle`: `ses: { "metin": "…", "ses": "kadin", "hiz": 0.95 }`, `sinir` (en çok kaç kez dinlenebilir), `sorular`, isteğe bağlı `metin` ve `metinTr` (sorulardan sonra gösterilir).
- Sorular `soru` adımıyla aynı kuralı izler (ilk seçenek doğru).
- Olmayan bilgiyi sormak için "Metinde yok" seçeneği kullanılır (bkz. mevcut okuma dersleri).

### Dış uygulama (Voscreen, Busuu, …)
1. `genel.json` → `disUygulamalar` içine `{ id, ad, simge, kisa, aciklama, nasil[], uyari, play, ios, web, gorev }` ekle.
2. Derse `{ "tur": "dis", "uygulama": "<id>", "gorev": "…" }` adımı koy.

Bu uygulamalarla otomatik bağlantı **yoktur** (bölüm 8). Kullanıcı sonucu (doğru/toplam) elle girer; yüzde ve geçmiş otomatik hesaplanır.

## 4. Adım türleri başvurusu

| `tur` | Zorunlu alanlar | Ne yapar |
|---|---|---|
| `anlat` | `bloklar` | Kısa anlatım. Blok: `baslik`, `p`, `liste` (+`sirali`), `ipucu`, `kutu`, `emoji` (+`altyazi`), `resim`, `ornek {en,tr}`, `tablo {baslik, satirlar}`. `**kalın**` yazılabilir |
| `kelime-ogren` | `kelimeler` | Kelime kartları (ses + örnek) |
| `alistirma` | `kelimeler` | Kelimeden otomatik üretilen alıştırma (`turler`: `dinle-sec`, `anlam-sec`, `kelime-sec`, `yaz`, `eslestir`; `adet`) |
| `soru` | `soru`, `secenekler` | Çoktan seçmeli (ilk seçenek doğru) |
| `sahne` | `id`, `baslik`, `satirlar`, `sorular` | Konuşma sahnesi: satırlar `{kim, en, tr}`; her konuşmacıya ses atanır |
| `cumle-kur` | `ogeler` | Karışık sözcüklerden cümle kurma (`{tr, en, ek[]}`) |
| `dikte` | `ogeler` | Duyduğunu yaz (`{metin}`) |
| `sayi-dinle` | `aralik`, `adet` | Duyduğun sayıyı yaz (`karisiklik: true`: 13/30 gibi) |
| `oku` | `id`, `baslik`, `metin` | Okuma + sorular (yukarıya bak) |
| `dinle` | `id`, `ses` | Kayıt dinleme + sorular |
| `serbest` | `id`, `soru` | Açık uçlu yanıt (yaz ya da ses kaydı). `noktalar`: anahtar noktalar; yalnız kayıttır, puan verilmez |
| `liste-sun`, `saray-kur`, `saray-yerlestir`, `liste-hatirla`, `gecikmeli-kur` | bkz. hafıza sarayı | Hafıza çalışması |
| `spor` | `bolumler` | Spor kartı |
| `dis` | `uygulama` | Dış uygulama görevi + sonuç girişi |
| `olcek` | `id`, `soru` | 0–10 kaydırma ölçeği (kendini değerlendirme) |

## 5. Her değişiklikten sonra: tek komut

```
node scripts/guncelle.mjs
```

Sırasıyla:
1. **İçeriği doğrular.** Kelime/ders kimlikleri, cevap anahtarları, program günleri, rota ve hareket başvuruları, kullanılmayan kelime/ders, çakışan kimlikler. Hata varsa durur.
2. **Ses listesini günceller** (`ses/metinler.json`, `ses/liste.json`).
3. **Eksik ses dosyalarını gösterir** (`--ses <klasör>` ile üretir).
4. **Program özeti** yazar (hafta başına gün ve görev sayısı).

Çıktı "✓ Her şey tamam" diyorsa unuttuğun bir şey yoktur. Ayrıca `npm test` (ya da `node --test "tests/unit/*.test.mjs"`) içeriğin hâlâ hatasız, uyarısız ve seslerinin eksiksiz olduğunu kontrol eder.

## 6. Uygulamanın içinden paket eklemek (Ben → İçerik)

Bilgisayarsız çalışmak istersen JSON paketini telefondan da ekleyebilirsin:

- **Ben → İçerik → Yeni içerik paketi ekle** → `.json` dosyasını seç. Yüklemeden önce aynı doğrulayıcıdan geçer; hata varsa hiçbir şey eklenmez ve hataları listeler.
- Aynı `paket` adıyla yeniden yüklersen paket **güncellenir**.
- **Kaldır** düğmesi senin eklediğin paketi siler (**geri dönüş**). İlerleme kayıtların silinmez.
- Uygulamayla gelen paketler silinemez; onları değiştirmek için `degistir: true` içeren yeni bir paket yükle.

Kullanıcı paketlerinde ses dosyaları yoktur; konuşmalar cihazın kendi sesiyle okunur. Kaliteli ses istiyorsan paketi `icerik/` klasörüne koyup bölüm 5 ve 7'yi izle.

## 7. Ses

Uygulama her konuşma için `ses/<özet>.mp3` dosyasını arar; yoksa cihazın konuşma sentezine düşer. Dosya adı metin + ses adı + hızdan türetilir, bu yüzden elle adlandırma yoktur.

Üretim (bir kez kurulum):

```
pip install kokoro-onnx faster-whisper numpy      # ffmpeg de kurulu olmalı
# Kokoro model dosyalarını bir klasöre indir (toplam ~120 MB, Apache-2.0):
#   kokoro-v1.0.int8.onnx  ve  voices-v1.0.bin
#   https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
node scripts/guncelle.mjs --ses <model-klasörü>
```

**Ses kimlikleri.** İçerikte üç rol vardır: `anlatici` (kelimeler ve açıklayıcı cümleler; varsayılan), `kadin` ve `erkek` (diyaloglardaki konuşmacılar; `genel.json` içindeki `sesler.konusmacilar` hangi kişinin hangi rolde olduğunu söyler). Rollerin hangi Kokoro sesine karşılık geldiği `scripts/ses-uret.py` başındaki `SESLER` tablosundadır. Türkçe satırlar (`dil: "tr"`) için dosya üretilmez, cihazın sesi okur.

Betik her cümleyi üretir, konuşma tanıma (Whisper) ile geri okur ve benzerliği rapora yazar; yalnız **eksik** dosyaları üretir. Çok dosyada dört işlemle hızlandırabilirsin: `python3 scripts/ses-uret.py --model <klasör> --parca 1/4` … `4/4`.

Sınır: Konuşma tanıma doğruluğu kulakla dinlemenin yerini tutmaz, **tek sözcüklük kayıtlarda ise neredeyse hiç güvenilir değildir** (bağlam yok). Yeni üretilen sesleri kısaca dinlemeni öneririz; bozuk olanı silip komutu yeniden çalıştırırsan yenisi üretilir.

**Özel adlar (Türkçe isim, şehir):** İngilizce ses Türkçe adları yanlış okuyabilir (ör. "Ece" ilk denemede harf "S" gibi okundu). Böyle bir ad kullanacaksan `scripts/ses-uret.py` başındaki `ADLAR` tablosuna bir satır ekle (Kokoro'nun ses simgeleriyle okunuşu yazılır) ve adı `ASR_ISIMLER` listesine koy; bir birim testi yeni bir özel ad görürse seni uyarır. Sonra o adı içeren mp3 dosyalarını silip betiği yeniden çalıştır. Dosya adları değişmez, çünkü adı özgün metinden türer. Yeni bir ad kullandığında bunu mutlaka kulakla kontrol et.

**Çok okunuşlu sözcükler:** Bilgisayar sesi bazen bağlamdan yanlış anlamı seçer: tek başına "close" yazınca "yakın" (klos) diye okur, "lives" cümle içinde bile "canlı" (layvz) okunur; oysa derste bunlar fiildir (kapatmak, yaşamak). Bu tür sözcüklerin okunuşu `scripts/ses-uret.py` başındaki `SOZCUKLER` tablosunda elle verilir. Yeni bir çok okunuşlu sözcük (ör. `wind`, `tear`, `lead`, `use`) kullanırsan birim testi seni uyarır: okunuşunu `SOZCUKLER`'e yaz, o sözcüğü içeren mp3'leri sil, betiği yeniden çalıştır ve kulakla dinle.

## 8. Dış uygulamalar neden otomatik bağlanmıyor?

Voscreen ve Busuu için herkese açık bir geliştirici arayüzü (API) bulamadım. Telefonda bir web uygulaması da başka bir uygulamanın ekranını okuyamaz. Bu yüzden uygulama bağlantıyı açar, sen sonucu (doğru/toplam) girersin. Ayrıntı: `docs/DIS_UYGULAMALAR.md`.

## 9. Doğrulayıcı mesajları ve ne yapmalı

| Mesaj | Anlamı | Ne yap |
|---|---|---|
| `kelime "x" tanımlı değil` | Derste yazdığın kimlik yok | `kelimeler.json`'a ekle ya da kimliği düzelt |
| `"x" iki farklı karşılıkla tanımlı` | Aynı sözcüğe iki anlam | Biri yanlış, birini sil ya da anlamı birleştir |
| `… her zaman ilk seçenektir` | Soruya `dogru` yazmışsın | `dogru`'yu sil, doğru cevabı ilk sıraya koy |
| `gün numarası hafta N aralığında değil` | Gün numarası haftaya uymuyor | Hafta 1 = 1–7, hafta 2 = 8–14 … |
| `programdaki hiçbir güne bağlı değil` | Ders yazılmış ama programda yok | `program.json`'a ekle (ya da bilerek serbest bırakıyorsan görmezden gel) |
| `hiçbir derste kullanılmıyor` | Kelime/hareket kullanılmıyor | Bir derse ekle ya da sil |
| `aynı soru metni başka yerde farklı cevapla var` | Aynı soru iki yerde farklı cevaplı | Sorulardan birini kendi bağlamına göre yeniden yaz |
| `kimliği iki yerde` | İki pakette aynı kimlik | Birinin kimliğini değiştir, ya da üzerine yazmak içinse `degistir: true` |
| `rota "x" hiçbir saray-kur adımında kurulmuyor` | Olmayan rotaya başvuru | `saray-kur` adımına aynı `id`'yi ver |
