# NEXUS v5 (Pusula sürümü)

**Sonuç:** NEXUS v4'ün 19 kuralı 9 kurala indi. Klasör başına MANIFEST ve dosya başına tabela kalktı. Yerine projede tek bir mimari dosyası var: `.pusula/architecture.md`. Bir aracın ölçebildiğini artık araç ölçüyor, yapay zekâ değil.

Kurallar AI için `skills/architecture-standard/SKILL.md` içinde (İngilizce, kısa). Bu dosya senin için: neyin neden değiştiğini anlatır.

## Neden değiştirdim
1. **Olmayan araçlara dayanıyordu.** `nexus-check`, `nexus-perf`, `nexus-complexity`, `nexus-purge` ve "AST analyzer" yazılmamıştı. Araç yoksa kural kâğıtta kalır. Yerine var olan araçları kullandım: lizard, osv-scanner, Semgrep, derleyici uyarıları.
2. **Aynı bilgi iki yerde duruyordu.** Tabeladaki Contract ve Depends-On zaten kodda var (export ve import). İki kopya zamanla ayrışır. v4 bunu "Virus Protokolü" diye cezalandırıyordu; ben kopyayı kaldırdım.
3. **Her işe tören ekliyordu.** Küçük bir düzeltme bile 4 satırlık Vibe-Check ve onay istiyordu. Şimdi tören işin büyüklüğüne bağlı.

## Dokuz kural
| # | Kural | Tek cümle |
| --- | --- | --- |
| N1 | Tek harita | Projede tek dosya: katmanlar, modüller, bağımlılıklar. |
| N2 | Sözleşme önce | Yeni modülün imzasını yaz, sonra gövdesini. |
| N3 | İsim | Ne olduğunu söyle, nasıl yaptığını değil. |
| N4 | Katman ve yüzey | Her katman yalnız altındakini çağırır. Dışarı açılan her şeyin tek satır gerekçesi var. |
| N5 | Küçük ve sade | Dosya 30 KB altı, fonksiyon karmaşıklığı en çok 10. |
| N6 | Ölü kod yok | Yorumlanmış kod yok. TODO'nun tarihi var. Yedek git'tir. |
| N7 | Değişiklik boyu | 5 dosyaya kadar tören yok. 6–20 dosyada 4 satırlık not. 20'den fazlada böl ya da plan yaz. |
| N8 | Üç grev | Üç denemeden sonra yaklaşımın bir yanı değişmek zorunda. |
| N9 | Hata, hız, günlük | I/O yapan modül çökünce ne olacağını söyler. Bütçe ölçümden gelir. Sorunlar `.pusula/issues.md` içine eklenir. |

## Eski 19 kural ne oldu
| Eski | Yeni | Ne oldu ve neden |
| --- | --- | --- |
| R1 Fraktal kimlik (MANIFEST, en çok 7 öğe) | N1 | MANIFEST klasör başına değil, projede **tek dosya**. "7 öğe" sınırı atıldı (aşağıda soru 1). |
| R2 Canlı tabela | atıldı | Kodun kopyasıydı, ayrışırdı. Doğrulayan araç da yoktu. |
| R3 Sözleşme önce | N2 | Kaldı. "5 dakika + commit" töreni kalktı. |
| R4 İsim egemenliği | N3 | Kaldı, aynı. |
| R5 Bağımlılık kasası | N1 | Bağımlılık tablosu: ad ve neden. **Lisans** artık araçtan geliyor (osv-scanner). |
| R6 Tasarım anayasası | `ui-acceptance` | Pusula'da zaten var. WCAG 2.2 kullanıyor, hareket ve yazı ölçeği de token. |
| R7 Performans ahdi | N9 | Ölçümden gelir. Ölçülmediyse `unmeasured` yazılır. Sadece sıcak modüller. |
| R8 Hücresel metabolizma | N5 | 30 KB (senin Pusula kararın, v4'te 20 KB). Karmaşıklığı lizard ölçüyor. |
| R9 Mimari anayasa | N4 | Kural aynı. Denetimi özel araç değil platform yapıyor (Unity asmdef, Rust crate). |
| R10 Beyan edilmiş yüzey | N4 | Kaldı. Derleyici uyarısı açılır. |
| R11 Acımasız budama | N6 | Back-Up klasörü ve 14 gün kalktı. Git zaten yedek. Silmek için onay kuralı aynı. |
| R12 Guardian checkpoint | `pusula_check.py` | Üç kapı tek komut oldu ve gerçekten var. Her commit'ten önce çalışır. |
| R13 Ölümsüz kod yasağı | N6 | 72 saat yerine 30 gün. Yorumlanmış kod yasak. |
| R14 Tabela senkronizasyonu | atıldı | R2 ile birlikte gitti. |
| R15 Vibe-Check | N7 | Sadece 6+ dosyalık işte. Geri dönüş satırı kaldı. Onay beklenmez, itiraz olursa durulur. |
| R16 Kademeli patlama | N7 | Eşikler aynı (5 ve 20). |
| R17 Üç grev | N8 | Kaldı. `systematic-debugging` içine de yazıldı. |
| R18 Kaderine yaz | N9 | Sadece I/O yapan modüller için tek satır. `blast_scope` atıldı, N7 ile örtüşüyordu. |
| R19 Log yakıtı | N9 | İki dosya yerine tek dosya, sadece ekleme. PowerShell zorunluluğu kalktı. |

İhlal seviyeleri (Mimari İhlal, Virus Protokolü, Lint Failure) ikiye indi: **kontrol betiği kalırsa commit durur**; diğer her şey aynı görev içinde düzeltilir.

## Mekanik kontroller
`python .pusula/checks/pusula_check.py` şimdi şunları da bakar. Hiçbiri jeton harcamaz.
- `complexity`: karmaşıklığı 10'u geçen fonksiyon varsa kalır. **Doğruladım:** Pusula'nın kendi 7 fonksiyonu geçemedi, böldüm, şimdi geçiyor.
- `architecture`: `.pusula/architecture.md` içindeki bir modül yolu yoksa kalır. Dosya yoksa bakmaz.
- `licenses`: `license_allow` listesi doluysa, listede olmayan lisansı yakalar. Liste boşken kapalıdır.

## Senin vereceğin kararlar
1. **"Klasörde en çok 7 öğe"** kuralını attım. Unity'de `Assets` altındaki klasörler yüzlerce dosya içerir; sayı yerine "bir klasör, bir iş" kuralı daha kolay. İstersen geri koyarım. **Tahmin:** geri koymak gerekmez.
2. **Lisans izin listesi.** Ticari oyunda hangi lisanslar olur? MIT, Apache-2.0, BSD ve ISC genelde sorun çıkarmaz. GPL ve AGPL genelde çıkarır. Bu hukuki bir karar, bana değil sana ait. Karar verene kadar `license_allow` boş, kontrol kapalı.
3. **Katman adları.** L0–L3'ü korudum. Seasons of Iron için gerçek katmanları (örneğin simülasyon, çizim, arayüz, ağ) birlikte yazarız.

## Bilmediklerim
- **Bakmadım:** Gerçek bir Unity projesinde asmdef ile katman denetimi. Resmi sayfa döngüsel referansın izin verilmediğini söylüyor ([Unity](https://docs.unity3d.com/6000.3/Documentation/Manual/assembly-definitions-referencing.html)); kurulumu denemedim.
- **Bakmadım:** Flutter için katman denetimi. Resmi yolu araştırmadım.
- **Doğruladım:** lizard Dart ve GLSL dosyalarını tanımıyor. O dosyalarda `complexity` bir şey demez, "temiz" gibi görünür.
- **Doğruladım:** lizard'in iç içe derinlik ölçümü tutarsız çıktı (aynı türden iki fonksiyonu 4 ve 7 ölçtü). Bu yüzden iç içelik sınırı araçsız bir kural olarak kaldı.
