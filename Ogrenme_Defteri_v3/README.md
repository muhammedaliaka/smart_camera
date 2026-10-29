# Öğrenme Defteri 3

Telefonda ve tabletde çalışan, İngilizce + hafıza + okuma + dinleme + spor çalışma uygulaması. Derleme yok, hesap yok, sunucu yok: klasörü bir adrese koyarsın, tarayıcıda açılır.

**Ne yapar?** Her gün 2–4 küçük görev verir. Dersler uygulamanın içinde öğretilir (kelime kartları, sesli sahneler, alıştırmalar, sorular). Sonuç ekranında doğru sayısı ve yüzde görünür; eski kelimeleri 3, 10, 20 ve 50 gün sonra yeniden sorar. İçeriği JSON dosyalarına ekleyerek aylık program kurabilirsin.

**Çalışma raporu:** Ben → İlerleme sayfasından, yapılan çalışmanın her sorusunu (soru metni, öğrencinin yanıtı, doğru yanıt, ders ve gün) tek başına anlaşılır biçimde Markdown olarak indirebilir ya da "Yapay zekâ için kopyala" ile bir yapay zekâya verebilirsin. Puan ikinci plandadır; rapor ham kayıttır, not değildir.

## Hızlı başlangıç

```
node scripts/sunucu.mjs          # Node.js 20+; yazdığı adresi tarayıcıda aç (aynı Wi-Fi'daki telefondan da açılır)
```

Telefonda tam özellik (mikrofon, çevrimdışı, ana ekrana ekleme) için `https` gerekir: klasörü ücretsiz bir statik barındırmaya koy. Ayrıntı: [docs/KULLANIM.md](docs/KULLANIM.md).

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run baslat` | Yerel sunucuyu açar (`node scripts/sunucu.mjs`) |
| `npm run dogrula` | Tüm içeriği kontrol eder (çelişki, eksik referans, programa bağlanmamış ders…) |
| `npm run guncelle` | İçerik eklemeden sonra tek komutla kontrol listesi: doğrula → ses listesini güncelle → eksik sesleri göster → program özeti |
| `npm test` | Birim testleri (`node --test`) |

## Klasörler

```
index.html, sw.js, manifest.webmanifest   uygulama kabuğu
css/, js/, gorsel/                        arayüz ve mantık (derleme gerektirmez)
icerik/                                   TEK İÇERİK KAYNAĞI: kelimeler, dersler, program
ses/                                      konuşma dosyaları (mp3) ve listeleri
scripts/                                  sunucu, doğrulama, güncelleme, ses üretimi
tests/                                    birim testleri, uçtan uca (tarayıcı) testleri
docs/                                     kılavuzlar
```

## Belgeler

| Belge | Kimin için, ne anlatır |
|---|---|
| [docs/KULLANIM.md](docs/KULLANIM.md) | Öğrenci: açma, günlük kullanım, sonuçları okuma, yedek, sık sorular |
| [docs/ICERIK_EKLEME.md](docs/ICERIK_EKLEME.md) | İçerik ekleyen: kelime, ders, hafta ekleme; tutarlılık kuralları; geri dönme |
| [docs/KONU_ANALIZI.md](docs/KONU_ANALIZI.md) | Her konu: ne, neden seçildi, eski sürümde neresi zayıftı, yeni sürümde ne var |
| [docs/DIS_UYGULAMALAR.md](docs/DIS_UYGULAMALAR.md) | Voscreen/Busuu, canlı izleme neden yok, bağlantılar |
| [docs/KARARLAR.md](docs/KARARLAR.md) | Tasarım kararları ve bilinen sınırlar |
| [docs/TEMIZLIK.md](docs/TEMIZLIK.md) | Eski sürümden neler alınmadı, neden |

## İçerik ekleme (özet)

1. `icerik/` altına yeni kelime/ders/hafta JSON'u yaz (ya da var olana ekle).
2. `npm run guncelle` — hata varsa söyler, yoksa hangi sesler eksik diye gösterir.
3. Gerekirse sesleri üret (`docs/ICERIK_EKLEME.md`, "Ses").
4. Kayıtlar ve ilerleme dokunulmaz; yeni içerik aynı adrese yüklenince uygulama bir sonraki açılışta güncellenir.

Kendi paketini tarayıcıdan da ekleyebilirsin (Ben → İçerik); beğenmezsen aynı yerden kaldırırsın, ilerleme kalır.

## Sınırlar

İnsan kulağıyla ses onayı yapılmadı, gerçek telefon/tablette denenmedi (Chromium'da telefon/tablet boyutlarında test edildi), dış uygulama sonuçları elle girilir, telaffuz değerlendirilmez. Ayrıntı: [docs/KARARLAR.md](docs/KARARLAR.md).
