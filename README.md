# Akıllı Kamera Arşiv Analiz Sistemi v2.0

Güvenlik kamerası kayıtlarını otomatik tarar, hareketli anları tespit eder ve Qwen2-VL yapay zeka modeli ile analiz ederek detaylı raporlar oluşturur.

## 🆕 v2.0 Yenilikleri

- **Çoklu Video Desteği**: `./videos` klasöründeki tüm videoları otomatik işler
- **İnteraktif ROI Seçimi**: İlk frame'de mouse ile kapı bölgesi seçin, koordinatlar otomatik kaydedilir
- **Gelişmiş Hareket Algılama**: Kontur analizi + aspect ratio filtresi (insan dışı hareketleri eleme)
- **Asenkron AI**: Video okuma ve AI analizi paralel thread'lerde (kuyruk sistemi)
- **Nesne Takibi**: Aynı kişiyi 8 saniye içinde tekrar raporlamaz
- **Otomatik Config**: `config.json` ile tüm ayarlar merkezi
- **Frame Resize**: AI'a 640px gönderim (hız + token tasarrufu)
- **Görsel Raporlama**: Her tespit edilen kare rapora görsel olarak eklenir
- **Progress Bar**: `tqdm` ile işlem ilerleme takibi

## 📁 Klasör Yapısı

```
.
├── videos/                 # Analiz edilecek videoları buraya koyun
├── raporlar/               # Otomatik oluşturulan raporlar
│   ├── rapor_video1_20240115_143022.md
│   └── frames/             # Tespit edilen kare görüntüleri
├── config.json             # Sistem ayarları
├── roi_coords.json         # Kaydedilmiş ROI koordinatları
├── analyze_video_v2.py     # Ana script
└── requirements.txt
```

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
pip install -r requirements.txt

# 2. Ollama'yı kur ve modeli indir
ollama pull qwen2-vl:3b

# 3. Videoları klasöre koy
mkdir -p videos
cp kamera_kaydi.mp4 videos/

# 4. Çalıştır
python analyze_video_v2.py
```

## ⚙️ Config Ayarları (config.json)

```json
{
  "video": {
    "input_folder": "./videos",
    "extensions": [".mp4", ".avi", ".mov", ".mkv"],
    "output_folder": "./raporlar",
    "save_frames": true,
    "frame_quality": 85
  },
  "processing": {
    "skip_frames": 5,           // Her 5 karede bir kontrol
    "motion_threshold": 3000,   // Hareket piksel eşiği
    "contour_min_area": 500,  // Minimum kontur alanı (gürültü filtreleme)
    "contour_max_area": 50000,// Maksimum kontur alanı
    "person_aspect_ratio": [0.3, 2.5], // İnsan boy/en oranı
    "cooldown_seconds": 8,      // Aynı kişiyi tekrar raporlama süresi
    "tracker_max_distance": 100 // Takip mesafe eşiği (piksel)
  },
  "ai": {
    "model_name": "qwen2-vl:3b",
    "max_width": 640,         // AI'a gönderilecek max genişlik
    "timeout": 60,
    "workers": 2,             // Paralel AI worker sayısı
    "prompt": "..."           // AI prompt'u
  },
  "roi": {
    "interactive": true,      // İlk çalıştırmada ROI seç
    "auto_save": true,
    "coords_file": "roi_coords.json"
  }
}
```

## 🎯 Kullanım Akışı

1. **Videoları Koy**: `videos/` klasörüne `.mp4`, `.avi`, `.mov` dosyalarını at
2. **ROI Seçimi**: Script ilk çalıştığında pencere açılır, mouse ile kapı bölgesini seç, `s` ile kaydet
3. **Otomatik İşlem**: Tüm videolar sırayla işlenir, hareket anları AI'a gönderilir
4. **Raporları İncele**: `raporlar/` klasöründe `.md` dosyaları ve `frames/` içinde görüntüler

## 🧠 Sistem Nasıl Çalışır?

1. **Filtreleme**: OpenCV MOG2 + kontur analizi + aspect ratio (insan filtresi)
2. **ROI**: Sadece seçilen kapı bölgesindeki hareketler algılanır
3. **Takip**: Centroid tracker ile aynı kişiyi takip eder, 8 saniye cooldown uygular
4. **Asenkron**: Video okuma durmadan, AI worker'lar kuyruktan frame çekip analiz eder
5. **Rapor**: Her tespit için zaman damgası, takip ID'si, görsel ve AI analizi kaydedilir

## ⚠️ Bilinen Sınırlamalar

- **Ollama Gereksinimi**: Sistem Ollama'nın çalışmasına bağlıdır
- **GPU**: AI analizi CPU üzerinde yavaş olabilir, GPU önerilir
- **Işık Değişimi**: Ani ışık değişimleri (far, bulut) false positive üretebilir
- **Kalabalık**: Çok kişili sahnelerde takip ID'leri karışabilir

## 📝 v1 vs v2 Karşılaştırması

| Özellik | v1 | v2 |
|---------|----|----|
| Çoklu video | ❌ | ✅ |
| ROI seçimi | Manuel kod | 🖱️ Mouse ile interaktif |
| Gürültü filtreleme | Yok | Kontur + aspect ratio |
| Asenkron AI | ❌ Senkron | ✅ Multi-thread |
| Nesne takibi | Yok | Centroid tracker |
| Frame resize | Yok | 640px (hız) |
| Görsel rapor | Yok | ✅ Kare görüntüleri |
| Config | Sabit kod | ✅ JSON config |
| Progress bar | Yok | ✅ tqdm |
