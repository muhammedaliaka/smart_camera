# Yapay zekâ bağlantısı (MCP)

**MCP** (Model Context Protocol), bir yapay zekâ asistanının (Claude Desktop, Claude Code ve MCP destekleyen başka istemciler) yerel bir programdan **araç** çağırabilmesini sağlayan açık bir protokoldür. `scripts/mcp.mjs` bu protokolü konuşan küçük bir sunucudur (Node.js ≥ 20, **hiçbir paket kurulumu gerektirmez**).

Neden var? Çalışma raporu (`Ben → İlerleme` altındaki "Çalışma raporu" kartı) çoğu zaman yeter; yapay zekâ "şu soruyu neden yanlış yapmış?" ya da "ingilizce seviyesi neden düştü?" diye daha derine inmek istediğinde raporu yeniden yapıştırmana gerek kalmaz, kendisi sorar. Aynı sunucu yapay zekâya **içerikte arama ve yeni içerik önerisini doğrulatma** imkânı da verir.

## Ne yapar, ne yapmaz

| Yapar | Yapmaz |
|---|---|
| Öğrencinin raporunu, seviyelerini, bugünün planını, soru geçmişini **okur** | Öğrencinin kaydını **değiştirmez**; seviye değiştiremez |
| İçerikte (kelime, ders) arar; hangi seviyede ne kadar içerik var gösterir | Uygulamanın kendisini kontrol etmez (soru çözmez, ders açmaz) |
| Yeni içeriği düz metin biçiminde alır, **doğrular** ve istenirse içerik klasörüne yazar | Hiçbir şeyi internete göndermez; ağ bağlantısı kurmaz |

Yazan tek araç `icerik_ekle`dir ve **varsayılanı "yalnız dene"dir**: yazmak için yapay zekânın `kuru: false` demesi gerekir. Doğrulama başarısızsa değişiklikler geri alınır.

## Kurulum (3 adım)

### 1. Kaydı sunucuya ulaştır

Öğrencinin ilerlemesi tarayıcıda durur. MCP sunucusunun okuyabilmesi için bilgisayardaki bir dosyaya inmesi gerekir. İki yol var:

**A) Eşitleme (önerilen).** Uygulamayı bilgisayardan, kendi sunucunla aç:

```
node scripts/sunucu.mjs            # örn. http://localhost:8080 ; telefondan aynı Wi-Fi'deki adresle de açılır
```

Sunucu ilk açılışta bir **eşitleme belirteci** üretir ve konsola yazar (`veri/belirtec.txt` içinde de durur). Uygulamada **Ben → Ayarlar → Yapay zekâ bağlantısı** kartına belirteci yaz ve **Şimdi eşitle**'ye bas. İstersen "Her değişiklikten sonra kendiliğinden eşitle"yi aç. Kayıt `veri/durum.json` olarak yazılır.

**B) Yedek dosyası.** Statik bir yerde (örneğin GitHub Pages) kullanıyorsan eşitleme çalışmaz, çünkü orada kendi sunucun yoktur. **Ben → Ayarlar → Yedek indir** ile aldığın dosyayı bilgisayara koy ve MCP sunucusuna `--durum` ile göster. Yeni çalışmadan sonra yedeği yenilemen gerekir.

### 2. İstemciye sunucuyu tanıt

Yolları kendi bilgisayarına göre **mutlak** yaz.

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ogrenme-defteri": {
      "command": "node",
      "args": [
        "/ev/yolu/Ogrenme_Defteri_v3/scripts/mcp.mjs",
        "--durum", "/ev/yolu/Ogrenme_Defteri_v3/veri/durum.json"
      ]
    }
  }
}
```

**Claude Code:**

```
claude mcp add ogrenme-defteri -- node /ev/yolu/Ogrenme_Defteri_v3/scripts/mcp.mjs --durum /ev/yolu/Ogrenme_Defteri_v3/veri/durum.json
```

`--durum` verilmezse varsayılan `veri/durum.json`dur (ya da `OD3_DURUM` ortam değişkeni). Başka seçenekler:

| Seçenek | Anlamı |
|---|---|
| `--durum yol` | Öğrenci kaydı (uygulama yedeği ya da eşitlenen dosya) |
| `--icerik klasör` | İçerik klasörü (varsayılan `icerik/`) |
| `--giris klasör` | `icerik_ekle` ile yazılan kaynak metinlerin saklandığı klasör (varsayılan `giris/`) |
| `--bugun YYYY-AA-GG` | "Bugünü" sabitler (test ve geçmişi inceleme için) |

> `npm run` ile **başlatma**: npm kendi başlık satırlarını standart çıktıya yazar ve protokolü bozar. Yukarıdaki gibi `node` ile doğrudan çalıştır.

### 3. Dene

İstemciyi yeniden başlat; araç listesinde `ogrenci_ozeti` görünmelidir. Yapay zekâya şunu söyle:

> "Öğrenme Defteri'ndeki öğrencinin son 7 günlük çalışmasını değerlendir."

İstemcin MCP **istemlerini** (prompt) destekliyorsa `calisma_degerlendirmesi` tek tıkla aynı işi yapar: raporu ve yapay zekâya verilecek görevi birlikte hazırlar.

Sunucuyu istemci olmadan el ile de deneyebilirsin (satır başına bir JSON-RPC iletisi):

```
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"el","version":"0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"ogrenci_ozeti","arguments":{}}}' \
 | node scripts/mcp.mjs --durum tests/fixtures/ornek-durum.json
```

## Araçlar

| Araç | Ne verir | Ne zaman |
|---|---|---|
| `ogrenci_ozeti` | Kaçıncı gün, becerilerin seviyesi ya da "yoklama sürüyor", bugünün görevleri, tekrar bekleyen madde, kaydın ne kadar güncel olduğu | **Önce bunu çağır** |
| `rapor_al` | Çalışma raporu (Markdown). `aralik`: `1`, `7`, `30`, `0` (tümü); `ayrinti`: `kisa` (varsayılan) ya da `tam` | Genel değerlendirme |
| `seviyeler` | Her becerinin seviyesi, yükselme/düşme geçmişi ve **nedenleri**, yoklama denemeleri, yükselmek için gereken seri | "Neden bu seviye?" |
| `bugunun_plani` | Verilen program gününün görevleri; yapıldı mı, isteğe bağlı mı | Bugün ne çalışılmalı |
| `gecmis_ara` | Soru kayıtları: ne soruldu, ne yanıtladı, doğrusu neydi. Süzgeçler: `beceri`, `ders`, `tarih`, `yalnizYanlis`, `sozcuk`, `sinir` | Belirli bir hatayı incelemek |
| `icerik_ara` | Kelime ve derslerde arama; seviye aralığına göre listeleme | "Bu kelime hangi seviyede?" |
| `icerik_kapsami` | Her 10 seviyelik dilimde kaç kelime / hangi beceride kaç ders var | Nerede yeni içerik gerek |
| `icerik_dogrula` | Tüm içeriğin doğrulaması (hata ve uyarılar) | Değişiklikten sonra |
| `icerik_giris_bicimi` | `docs/KOLAY_GIRIS.md` metni | `icerik_ekle`'den **önce** |
| `icerik_ekle` | Düz metin girişi paketleyip doğrular. **`kuru: true` (varsayılan) hiçbir şey yazmaz**; `kuru: false` yazar | Yeni içerik |

İstemin: `calisma_degerlendirmesi` (isteğe bağlı `aralik`).

### Yeni içerik akışı (yapay zekânın izleyeceği yol)

1. `icerik_kapsami` → hangi seviyede içerik az?
2. `icerik_giris_bicimi` → biçimi oku.
3. `icerik_ekle` (varsayılan `kuru: true`) → hatalar ve uyarılar gelir, düzelt, tekrar dene.
4. Sen onaylarsan `kuru: false` ile yaz. Kaynak metin `giris/` klasörüne de saklanır.
5. Sesli içerik (dinleme) eklendiyse: `node scripts/guncelle.mjs` eksik sesleri listeler; üretim için `docs/ICERIK_EKLEME.md` bölüm 7.
6. **Gözden geçir ve git ile kaydet.** Yapay zekânın yazdığı içeriği, özellikle soruların doğru cevabını ve seviyesini, sen kontrol et. Sunucu biçimi ve tutarlılığı doğrular; bilginin **doğru** olduğunu doğrulayamaz.

## Güvenlik ve gizlilik

- **Veri bilgisayarında kalır.** Eşitleme yalnız uygulamayı sunan kendi sunucuna gider; üçüncü bir hizmete bir şey gönderilmez. MCP sunucusu ağ bağlantısı kurmaz.
- **Ama yapay zekâ istemcisine ne gönderildiği istemciye bağlıdır.** Raporu bir yapay zekâya vermek, o kişiye/şirkete içeriği göstermek demektir (rapor, öğrencinin yazdığı açık uçlu yanıtları ve kendi beyanlarını içerir). Bunu bilerek bağla; küçük yaştaysa veli bilgisi olsun.
- Eşitleme **belirteç** ister (`x-belirtec` başlığı). Belirteç `veri/belirtec.txt` içindedir, dosya yalnız sahibi tarafından okunabilir (0600) oluşturulur. Belirteci başkasıyla paylaşma; değiştirmek için dosyayı sil, sunucuyu yeniden başlat ve uygulamaya yenisini yaz.
- `veri/` klasörü **sunucu tarafından dışarıya sunulmaz** (aynı ağdaki biri tarayıcıdan okuyamaz) ve `.gitignore`dadır; kaydı yanlışlıkla git'e koymazsın. Klasörü elle paylaşma/zip'e koyma.
- Sunucu bilgisayarındaki ağ adresinde dinler, yani aynı Wi-Fi'deki cihazlar **uygulamayı** açabilir (telefon için gerekli). Eşitleme noktasına ise yalnız belirteci bilen yazabilir. Ortak/kamusal ağlarda sunucuyu çalıştırma.
- `icerik_ekle` yalnız `icerik/` ve `giris/` klasörlerine yazar. Aynı adlı elle yazılmış bir paketin üzerine yazmaz.

## Sorun giderme

| Belirti | Neden / çözüm |
|---|---|
| "Öğrenci kaydı bulunamadı" | Henüz eşitlenmedi ya da `--durum` yolu yanlış. Uygulamada **Şimdi eşitle**'ye bas ya da yedeği indirip yolu göster |
| Uygulamada "belirteç yanlış" | Sunucu konsolundaki / `veri/belirtec.txt`deki değeri tam olarak yaz (baş/son boşluk olmasın) |
| Uygulamada eşitleme hatası | Uygulamayı `scripts/sunucu.mjs` dışında bir yerden açtıysan (statik barındırma) eşitleme çalışmaz; yedek dosyası yolunu kullan |
| Yapay zekâ eski veriyi görüyor | `ogrenci_ozeti` içindeki `kayit.dosyaZamani`na bak. Yeni çalışmadan sonra yeniden eşitle |
| Araçlar listede yok | Yollar mutlak mı? `node --version` ≥ 20 mi? İstemciyi tamamen kapatıp aç. Sunucu hata iletilerini standart hataya (stderr) yazar; istemcinin MCP günlüğüne bak |
| `icerik_ekle` "doğrulama:" hatası verdi | Biçim doğru ama içerik tutarsız (aynı kimlik, aynı soru farklı cevapla …). Mesajlar `docs/ICERIK_EKLEME.md` bölüm 9'daki tabloda |

## Ne kadar test edildi? (dürüst durum)

- Sunucunun protokol ve araç davranışı **kendi yazdığımız betikli bir istemciyle** otomatik testten geçer (`tests/unit/mcp.test.mjs`: başlatma, araç listesi, her aracın çıktısı, hata durumları, yazma güvenliği, eşitleme ucu ve belirteç).
- **Gerçek bir yapay zekâ istemcisiyle (Claude Desktop, Claude Code) bu ortamda denenmedi.** İlk bağlantıda küçük bir ayar sorunu çıkabilir; yukarıdaki "sorun giderme" ve el ile deneme komutu bunun içindir.
- Uygulama → sunucu eşitlemesi gerçek tarayıcıyla denendi; gerçek bir telefonda denenmedi.
