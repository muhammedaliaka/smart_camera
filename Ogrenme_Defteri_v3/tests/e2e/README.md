# Tarayıcı testleri (uçtan uca)

Bu betikler uygulamayı gerçek bir tarayıcıda (Chromium, telefon ve tablet boyutunda) açıp kullanıcı gibi gezer. Birim testlerinden (`npm test`) ayrıdır; Playwright gerektirir, bu yüzden varsayılan test komutuna dahil değildir.

## Kurulum (bir kez)

```
npm install -g playwright
npx playwright install chromium
```

## Çalıştırma

Bir terminalde uygulamayı aç:

```
node scripts/sunucu.mjs --port 8812
```

Başka bir terminalde:

```
export NODE_PATH=$(npm root -g)

# Her dersi sonuna kadar gez (telefon boyutu); takılma, konsol hatası, ekran taşması, küçük dokunma hedefi arar
node tests/e2e/dersleri-gez.cjs

# Ana sayfaları telefon / tablet / dizüstü boyutunda, açık ve koyu temada tara; ekran görüntüsü kaydeder
node tests/e2e/gorunum-taramasi.cjs

# Bugün: Başla düğmesi, süre bölümleri, mola, spor videosu kartı
node tests/e2e/bugun-sure.cjs

# Serbest alan: mekân avı, gerçek mekânda hafıza sarayı (rota → yerleştir → hatırla → canavar turu), sesli tur
node tests/e2e/alan.cjs

# Oyunlaştırma: kombo, ders sonu XP kartı, rütbe şeridi, hafta noktaları, Yeni rozet kartı, rozet ızgarası, haftalık hedef
node tests/e2e/oyun.cjs
```

Çıkış kodu 0 ise sorun bulunmadı, 1 ise bulundu (ayrıntı ekranda). Ekran görüntüleri `./e2e-cikti/` klasörüne yazılır.

| Ortam değişkeni | Anlamı | Varsayılan |
|---|---|---|
| `ADRES` | Uygulamanın adresi | `http://localhost:8812` |
| `DERSLER` | Yalnız şu derslerde çalış (virgülle) | hepsi |
| `W`, `H` | Görünüm boyutu (`dersleri-gez`) | `390`, `844` |
| `EKRAN=1` | `dersleri-gez` için ekran görüntüsü al | kapalı |
| `CIKTI` | Ekran görüntüsü klasörü | `./e2e-cikti` |

## Ne denetler?

- `gezgin.cjs`: oynatıcıyı her sayfa türünde rastgele ama makul davranışlarla (doğru/yanlış cevap, kart çevirme, yazma, ses düğmesi) sonuna kadar götürür. Her yeni sayfa türünde **yatay taşma** ve **38 pikselden küçük dokunma hedefi** arar.
- Tarihi sabitlemek için adreste `?t=YYYY-MM-DD`, servis çalışanını kapatmak için `?sw0=1` kullanılır (betikler bunu kendisi ekler).

## Sınırlar

- Masaüstü Chromium'da telefon/tablet **taklidi**dir; gerçek cihazdaki dokunma, klavye ve ses davranışının yerini tutmaz.
- Sesli içerik çalınır ama **ne duyulduğu** denetlenmez.
- Rastgele gezgin yeni bir sayfa türü eklediğinde o türü bilmeyebilir; "eylem hatası" ya da "adımda bitmedi" mesajı görürsen `gezgin.cjs`'e o tür için bir dal ekle.
