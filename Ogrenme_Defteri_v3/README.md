# Öğrenme Defteri 3

Telefonda ve tabletde çalışan, İngilizce + hafıza + okuma + dinleme + spor çalışma uygulaması. Derleme yok, hesap yok, sunucu yok: klasörü bir adrese koyarsın, tarayıcıda açılır.

**Ne yapar?** Her gün 2–4 küçük görev verir. Dersler uygulamanın içinde öğretilir (kelime kartları, sesli sahneler, alıştırmalar, sorular). Sonuç ekranında doğru sayısı ve yüzde görünür; eski kelimeleri 3, 10, 20 ve 50 gün sonra yeniden sorar.

**Seviyeli çalışma:** İngilizce, okuma, dinleme, hafıza ve spor ayrı birer merdivendir (1'den başlar, açık uçlu, küçük adımlarla yükselir). **İlk hafta yoklama haftasıdır:** her beceri 5. seviyeden başlayıp gerekirse 10 → 20 → 35 → 50'ye çıkan kısa yoklamalarla ölçülür (yoklama 50'yi geçmez; en zorlayıcı testle başlanmaz). Sonra **gerçek çalışma** bulunan seviyenin biraz altından başlar; bir oturumdaki puanlanan sorular **hepsi ilk denemede doğruysa** seviye bir basamak yükselir. Hangi sayının kanıta, hangisinin bizim tasarımımıza dayandığı: [docs/SEVIYE_SISTEMI.md](docs/SEVIYE_SISTEMI.md).

**İçeriği JSON yazmadan ekle:** düz metin dosyası (`giris/*.txt`) → `node scripts/ekle.mjs`. Biçim: [docs/KOLAY_GIRIS.md](docs/KOLAY_GIRIS.md).

**Yapay zekâ bağlantısı (MCP):** `scripts/mcp.mjs` bir yapay zekâ asistanına öğrencinin raporunu, seviyelerini ve geçmişini okutur; içerikte arama yaptırır, yeni içeriği doğrulatıp ekletir (varsayılan: yalnız dene). Kurulum ve güvenlik: [docs/MCP.md](docs/MCP.md).

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
| `node tests/benzetim.mjs '{"ingilizce":55,"okuma":40}' 40` | Gerçek motor ve içerikle üretilmiş bir öğrenciyi N gün yürütür; yerleştirme, yükselme ve içerik tükenmesini gösterir |
| `node scripts/ekle.mjs giris/dosya.txt` | Düz metin giriş dosyasını içerik paketine çevirir ve doğrular (`--kuru`: yalnız dene) |
| `node scripts/mcp.mjs` | MCP sunucusu (yapay zekâ istemcisi başlatır; elle çalıştırılmaz). `npm run` ile **değil**, doğrudan `node` ile çalıştır |

## Klasörler

```
index.html, sw.js, manifest.webmanifest   uygulama kabuğu
css/, js/, gorsel/                        arayüz ve mantık (derleme gerektirmez)
icerik/                                   TEK İÇERİK KAYNAĞI: kelimeler, dersler, program, seviye kuralları
giris/                                    düz metin yazım kaynakları (okuma, dinleme, hafıza, kelime bankası)
ses/                                      konuşma dosyaları (mp3) ve listeleri
scripts/                                  sunucu, doğrulama, güncelleme, ses üretimi, içerik ekleme, MCP
veri/                                     (yalnız eşitleme açıksa) öğrenci kaydı ve belirteç; git'e girmez, dışarı sunulmaz
tests/                                    birim testleri, uçtan uca (tarayıcı) testleri
docs/                                     kılavuzlar
```

## Belgeler

| Belge | Kimin için, ne anlatır |
|---|---|
| [docs/KULLANIM.md](docs/KULLANIM.md) | Öğrenci: açma, günlük kullanım, sonuçları okuma, yedek, sık sorular |
| [docs/SEVIYE_SISTEMI.md](docs/SEVIYE_SISTEMI.md) | Seviye merdiveni, ilk hafta yoklama, yükselme/düşme kuralları, **kanıt tablosu (neyin kanıtı var, neyin yok)** |
| [docs/KOLAY_GIRIS.md](docs/KOLAY_GIRIS.md) | JSON yazmadan düz metinle kelime/okuma/dinleme/hafıza içeriği ekleme |
| [docs/MCP.md](docs/MCP.md) | Yapay zekâ asistanını bağlama: kurulum, araçlar, güvenlik, sorun giderme |
| [docs/ICERIK_EKLEME.md](docs/ICERIK_EKLEME.md) | İçerik ekleyen: kelime, ders, hafta ekleme; tutarlılık kuralları; geri dönme |
| [docs/KONU_ANALIZI.md](docs/KONU_ANALIZI.md) | Her konu: ne, neden seçildi, eski sürümde neresi zayıftı, yeni sürümde ne var |
| [docs/DIS_UYGULAMALAR.md](docs/DIS_UYGULAMALAR.md) | Voscreen/Busuu, canlı izleme neden yok, bağlantılar |
| [docs/KARARLAR.md](docs/KARARLAR.md) | Tasarım kararları ve bilinen sınırlar |
| [docs/TEMIZLIK.md](docs/TEMIZLIK.md) | Eski sürümden neler alınmadı, neden |

## İçerik ekleme (özet)

1. Kelime, okuma, dinleme ya da hafıza içeriği için `giris/` altına düz metin yaz ve `node scripts/ekle.mjs giris/dosya.txt` çalıştır ([docs/KOLAY_GIRIS.md](docs/KOLAY_GIRIS.md)). Program, spor ve sahne gibi şeyler için `icerik/` altına JSON yaz.
2. `npm run guncelle` — hata varsa söyler, yoksa hangi sesler eksik diye gösterir.
3. Gerekirse sesleri üret (`docs/ICERIK_EKLEME.md`, "Ses").
4. Kayıtlar ve ilerleme dokunulmaz; yeni içerik aynı adrese yüklenince uygulama bir sonraki açılışta güncellenir.

Kendi paketini tarayıcıdan da ekleyebilirsin (Ben → İçerik); beğenmezsen aynı yerden kaldırırsın, ilerleme kalır.

## Sınırlar

İnsan kulağıyla ses onayı yapılmadı, gerçek telefon/tablette denenmedi (Chromium'da telefon/tablet boyutlarında test edildi), dış uygulama sonuçları elle girilir, telaffuz değerlendirilmez. **Seviye sayıları (5/10/20/35/50, %80, %100…) tasarım tahminidir, bu öğrenci üzerinde sınanmadı;** hazır içerik kelimede 70, okumada 66, dinlemede 70. seviyeye kadardır; **okuma (28 metin) ve dinleme (23 kayıt) havuzu yetkin bir öğrenci için yaklaşık 3. haftada yetmemeye başlar** (benzetimle ölçüldü; yeni metin kalmayınca tekrar turu seviyeyi değiştirmez). Yeni okuma/dinleme metinlerini bir öğretmen gözden geçirmedi. MCP sunucusu betikli bir istemciyle sınandı, gerçek bir yapay zekâ istemcisiyle henüz değil. Ayrıntı: [docs/KARARLAR.md](docs/KARARLAR.md), [docs/SEVIYE_SISTEMI.md](docs/SEVIYE_SISTEMI.md).
