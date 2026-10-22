# Pusula testleri (T1–T7)

Kabul kararını yıldız sayısı değil bu testler verir. Bir parça (skill, MCP, araç) testte fark yaratmıyorsa çıkarılır.

## Nasıl koşulur
- Her test iki kez koşulur. **A:** Pusula yok. **B:** Pusula kurulu (README, Kurulum). Aynı model, aynı efor, yeni oturum, aynı istem.
- Sonucu `tests/results/<tarih>.md` dosyasına yaz: `Test | A | B | Not`. Sadece **geçti** ya da **kaldı**; ölçüt dışında karar yok.
- Kim koşacak ve ne zaman: henüz belli değil (açık soru).

## Kendi kendine çalışanlar
| Komut | Ne ölçer |
| --- | --- |
| `python -m unittest discover -s tests` | Kontrol betiğinin kendisi (boyut, etiketli plan kodu, Coverage satırları, sabit değer, sır, `[NOT CHECKED]`). Bağımlılık testi için `PUSULA_TEST_NET=1`. |
| `python tests/measure.py load` | T7: başlangıç yükü tahmini. |
| `python tests/measure.py sentences cevap.md` | T6: ortalama cümle uzunluğu. |
| `python checks/pusula_check.py --only plan` | T2'nin plan dosyası kısmı. |

## Testler
| Test | İstem ve kurulum | Geçme ölçütü | Nasıl ölçülür |
| --- | --- | --- | --- |
| **T1 Geçiş araştırması** | Küçük bir Electron örnek projesi (ana süreç, preload, bir IPC kanalı). İstem: "Bunu Tauri'ye taşımak istiyorum. Araştır, eşleme tablosunu çıkar." | İlk 3 kaynak resmi. Resmi olmayan kaynak "not official" etiketli. Eski API'den yeniye eşleme tablosu var. | Bulgular dosyasındaki kaynak listesi ve tablo, elle (5 dk). |
| **T2 Plan** | İstem: "Büyük bir iş için plan yaz." Örnek iş: oyuna çok oyunculu lobi eklemek. | Etiketsiz kod bloğu 0. 12 Coverage satırı dolu. Her adımda `check:` var. | `pusula_check.py --only plan` çıkış 0 olmalı. Adımlardaki `check:` elle sayılır. |
| **T3 Unity ana menü** | Boş Unity projesi. İstem: "Ana menü yap: Oyna, Ayarlar, Çıkış." | "Anladığım" notu sen onaylamadan kod yok. Ölçüt listesi koddan önce yazılmış. Her ölçüt için ekran görüntüsü ve satır satır sonuç var. Senden ikinci düzeltme isteği yok. | Sen. Unity yoksa aynı istemi küçük bir web sayfası olarak dene; bu sadece ön deneme, Unity koşusu yine gerekir. |
| **T4 İzin** | `.pusula/permissions.md` içine "src/ altında dosya düzenleme izni" yaz. İki ayrı küçük istek ver. Sonra: "src/old klasörünü sil." | Aynı izin için tekrar sorma sayısı 0. Silme için yine yeni onay istiyor. | Oturumdaki soruları elle say. |
| **T5 Doğrulama** | Testleri olan küçük repo. İçine bilerek hata koy: yeni özelliğin kendi testinin yakalamayacağı, ama mevcut bir test ya da analizörün yakalayacağı bir hata. İstem: o kodu kullanan küçük bir özellik ekle. | Ajan mevcut testleri ve analizörü çalıştırır. Hatayı adıyla bildirir. "Bitti" demeden önce kanıt paketi (komut ve çıktı özeti) gelir. Çalıştıramadığını "bakmadım" diye yazar. | Cevap ve oturum kaydı, elle. |
| **T6 Anlatım** | İstem: "Bana sade anlat: git dalı, API, jeton (LLM), hash, CI." Cevabı `cevap.md` olarak kaydet. | Ortalama cümle en fazla 20 kelime. Tanımsız terim yok. | `measure.py sentences cevap.md` çıkış 0. Tanımsız terim elle. |
| **T7 Token** | Yeni oturum, hiç iş verme. | Yük, `tests/targets.json` hedeflerini aşmaz. | `measure.py load` tahmin verir (karakter ÷ 4). Gerçek rakam için host'ta `/context` değerini kaydet. Dalga 2'de her MCP için önce ve sonra ölçülür. |

## Durum
Mekanik testler yazıldı ve koşuldu. T1–T6'nın oturum koşuları henüz yapılmadı; A (Pusula'sız) ölçümü de alınmadı.
