# Temizlik: eski sürümden (v2) neler alınmadı ve neden

Eski paket yaklaşık 19 MB idi: `web` 9,7 MB, `reference_v11` 6,6 MB, `docs` 1,7 MB (çoğu eski sürüm kayıtları) ve geri kalanı betik/test/sunucu. Yeni paket (v3) yalnızca uygulamanın çalışması, içerik eklenmesi ve doğrulanması için gerekenleri taşır. Eski paketin kendisi silinmedi; yüklediğin zip'te durmaya devam ediyor.

## Alınmayanlar

| Eski dosya / klasör | Ne işe yarıyordu | Neden alınmadı |
|---|---|---|
| `docs/history-v4` … `history-v8` | Eski sürümlerin değişiklik kayıtları | Uygulamayla ilgisi yok; sürüm geçmişi git'te tutulur. |
| `docs/evidence` | Geçmiş testlerin kanıt dosyaları | Geçmiş sürümlere ait; yeni sürümün testleri `tests/` altında. |
| `docs/ANALIZ_VE_DUZELTMELER.md`, `ARAYUZ_DENEMESI.md`, `DOGRULAMA.md`, `GEREKSINIM_ESLESMESI.md`, `KULLANIM_DENEMESI.md`, `YEDEKTEN_BULGULAR.md`, `KOD_HARITASI.md`, `JSON_KILAVUZU.md`, `KAYNAKLAR.md` | Eski çalışma notları ve kılavuzları | Yerlerini `README.md`, `docs/KULLANIM.md`, `docs/ICERIK_EKLEME.md`, `docs/KONU_ANALIZI.md`, `docs/KARARLAR.md`, `docs/DIS_UYGULAMALAR.md` aldı. |
| `reference_v11/` (6,6 MB) | İlk hafta paketinin kopyası (ses dosyaları dahil) | Aynı dosyalar zaten ayrı teslim edilmişti; uygulamaya kopya gömmek hem boyutu şişirir hem de iki yerde güncelleme gerektirirdi. |
| `server.mjs`, `server.py`, `local_services.py` | Üç ayrı yerel sunucu; Whisper/Ollama gibi yerel model servisleri | Uygulama bunlar olmadan çalışır. Tek ve sade bir statik sunucu yeterli: `scripts/sunucu.mjs`. Yerel yapay zekâ servisleri kurulum yükü getiriyordu ve telefonda çalıştırılamazdı. |
| `BASLAT_ANDROID.sh`, `BASLAT_WINDOWS.bat` | Başlatıcılar | Üretilmedi ve **denenmedi**. Yerine `node scripts/sunucu.mjs` ya da ücretsiz barındırma yolu anlatıldı (`KULLANIM.md`). |
| `scripts/build-*.py` (articles, content-v8, experiences, layout-report, program-v4/v5/v6, schema, teaching-v7, usage-report, week-one), `draw-moves.py`, `package_release.py`, `package_week.mjs`, `check.mjs` | İçeriği betiklerle üreten ve paketleyen zincir | İçerik artık **doğrudan JSON olarak yazılan tek kaynak**. Zincir, aynı bilginin birkaç betikte üretilmesine yol açıyor ve tutarsızlık doğuruyordu. Yerine: `scripts/guncelle.mjs` (kontrol listesi), `scripts/dogrula.mjs`, `scripts/ses-*.{mjs,py}`. |
| `tests/*.test.mjs` (12 dosya), `local_services_test.py`, `web/browser-tests.*`, `web/layout-checks.js`, `web/journey-checks.js` | Eski mimariye bağlı testler | Yeni mimariye uymuyor. Yerine `tests/unit/` altında yeni birim testleri yazıldı. |
| `examples/*.json` (4 örnek hafta) | Örnek içerik biçimleri | Eski biçim. Yerine `docs/ICERIK_EKLEME.md` içindeki örnekler ve `tests/fixtures/icerik/` var. |
| `RELEASE.json`, `VALIDATION.json`, `DOSYA_LISTESI.sha256` | Eski sürümün kendi doğrulama dosyaları | Eski içeriği tarif ediyor. Yeni doğrulama: `npm run dogrula` ve teslim zip'inin yanındaki `SHA256SUMS`. |
| `web/legacy-content.json` | 200 görev, 209 soru (çoğunun cevap anahtarı "kendi sözlerinle kaydet") | Doğru cevabı olmayan, ölçülemeyen, tekrarlı içerik. Yerine kelime bankası ve sorulu dersler. |
| `web/program/articles.json` (50 yazı) | 25 konuda bilgi yazıları | Her yazının iki sorusu aynı şablondu; çoğu konu hedeften bağımsızdı. Öğretici bulunanlar (uyku, uzayda su) sorularla okuma dersine dönüştü. Bkz. `KONU_ANALIZI.md`. |
| `program.json` içindeki `writingPrompts` (36), `networkScenarios` (36), `readingPassages` (50), `courses` (USA Learns / VOA), `sport.unitEquivalents`, `focusCycle`, `policy`, `profile`, `sources` | Eski program verisi | Yerine ders içindeki sahneler, sorular ve kayıt alanları; "denk dakika" yerine doğrudan mesafe/set hedefi. |
| `web/audio` içindeki 61 mp3 | Eski içerik sesleri | Yeni içerik farklı; sesler `ses/` altında yeniden üretildi (şimdi 1288 konuşma). |
| `web/*.js` (core, db, app, activities, journey, free-practice, …), `web/index.html`, `web/assets/` | Eski arayüz ve mantık | Telefonda kullanılabilirlik sorunlu, tek dosyada çok uzun satırlar; sıfırdan modüler yazıldı (`js/`, `css/`). |

## Yeni pakette ne var, neden?

| Yol | Neden duruyor |
|---|---|
| `index.html`, `manifest.webmanifest`, `sw.js`, `css/`, `js/`, `gorsel/` | Uygulamanın kendisi. |
| `icerik/` | **Tek içerik kaynağı** (kelimeler, dersler, program). |
| `ses/` | Konuşma dosyaları (`*.mp3`), `liste.json` (çevrimdışı indirme listesi), `metinler.json` (hangi dosya hangi metin). |
| `scripts/` | `sunucu` (yerel sunucu), `dogrula` (içerik kontrolü), `guncelle` (içerik sonrası kontrol listesi), `ses-liste` ve `ses-uret` (ses üretimi). |
| `tests/` | Birim testleri ve örnek içerik (`fixtures`). |
| `docs/` | Altı kısa belge. |

Başka dosya yok: gizli klasör, derleme çıktısı, `node_modules`, geçici dosya, kullanılmayan görsel yok. Ses klasöründe `ses/liste.json` ile uyuşmayan (artık kullanılmayan) mp3 varsa `node scripts/guncelle.mjs` bunu bildirir.

## Depo ana dizinindeki başka dosyalar

Bu çalışma `smart_camera` deposunun içindeki `Ogrenme_Defteri_v3/` klasöründe yapıldı. Deponun ana dizininde "Smart Camera" adlı **başka bir projeye** ait çok sayıda dosya (kurulum betikleri, `config.json`, test görselleri, video analiz betikleri…) var. Bunlar öğrenme defteri ile ilgili görünmüyor; senin onayın olmadan **silinmedi** ve değiştirilmedi.
