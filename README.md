# 🎥 Smart Camera - Akıllı Video Analiz Sistemi

Yapay zeka destekli otomatik video gözetim ve analiz sistemi.

## ✨ Özellikler

- 🤖 **AI Destekli Analiz** - Ollama ile görüntü analizi
- 📹 **Otomatik Video Tarama** - Hareket algılama ve nesne takibi
- 🔍 **Özelleştirilebilir Arama** - "Ne arıyorsun?" özelliği
- 📊 **Akıllı Raporlar** - JSON ve Markdown formatında
- 🎨 **Modern GUI** - Kullanıcı dostu arayüz
- 🌍 **Çoklu Dil** - Türkçe / İngilizce
- ⚡ **Hızlı İşlem** - 1000+ FPS video tarama
- 🖼️ **Multi-Frame Analiz** - Her olaydan çoklu kare yakalar

## 🚀 Hızlı Başlangıç

### 1. Gereksinimleri Yükle

```bash
pip install -r requirements.txt
```

veya

```cmd
.\PAKET_YUKLE.bat
```

### 2. Ollama Kur (AI için - opsiyonel)

```cmd
.\OLLAMA_KURULUM.bat
```

### 3. Kurulum Sihirbazını Çalıştır

```cmd
.\KOLAY_ACILIS.bat
```

### 4. Uygulamayı Başlat

```cmd
.\UYGULAMA_BASLAT.bat
```

## 📋 Gereksinimler

- Python 3.8+
- OpenCV
- NumPy
- Ollama (AI için - opsiyonel)

## 🎯 Kullanım

1. **Setup Wizard** ile ayarları yapın:
   - Video klasörü seçin
   - AI modeli seçin (Ollama gerekli)
   - Arama kriteri belirleyin (örn: "İnsanları tespit et")

2. **Ana Uygulama** ile analiz başlatın:
   - "ANALİZİ BAŞLAT" butonuna tıklayın
   - Canlı log takip edin
   - AI özeti inceleyin

3. **Raporları** görüntüleyin:
   - `raporlar/` klasöründe Markdown raporları
   - `raporlar/json/` klasöründe JSON verileri
   - `raporlar/frames/` klasöründe yakalanan kareler

## 🛠️ Yapılandırma

Setup wizard ile veya `config.json` dosyasını düzenleyerek:

```json
{
  "input_folder": "videos",
  "output_folder": "raporlar",
  "model_name": "qwen2.5vl:3b",
  "search_prompt": "İnsanları ve arabaları tespit et",
  "skip_frames": 5,
  "motion_threshold": 1200
}
```

## 📊 Özellikler Detay

### AI Model Seçenekleri
- **qwen2.5vl:3b** - Hızlı ve hafif (3GB) ✅ ÖNERİLEN
- **llama3.2-vision:11b** - Güçlü (11GB)
- **llava:7b** - Orta (4.5GB)

### Arama Kriterleri Örnekleri
- 👤 "İnsanları tespit et"
- 🚗 "Arabaları say"
- 📦 "Paket hırsızlığı"
- 🏃 "Şüpheli davranış"
- 🐕 "Hayvan tespiti"
- 🔥 "Yangın veya duman"

**Boş bırakılırsa:** Genel hareket tespiti + şüpheli durum analizi

## 📁 Dosya Yapısı

```
smart_camera/
├── app_launcher.py          # Ana uygulama GUI
├── setup_wizard_modern.py   # Modern kurulum sihirbazı
├── analyze_video_v2.py      # Video analiz motoru
├── config.json              # Yapılandırma dosyası
├── requirements.txt         # Python bağımlılıkları
├── UYGULAMA_BASLAT.bat     # Ana uygulama başlatıcı
├── KOLAY_ACILIS.bat        # Setup wizard başlatıcı
├── videos/                  # Video klasörü
└── raporlar/               # Rapor çıktıları
    ├── frames/             # Yakalanan kareler
    └── json/               # JSON raporları
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Ollama](https://ollama.com/) - AI model desteği
- [OpenCV](https://opencv.org/) - Video işleme
- Topluluk katkılarına teşekkürler!

## 📞 İletişim

Sorularınız için [Issues](https://github.com/hayvanatoffical/smart_camera/issues) bölümünü kullanın.

---

⭐ **Beğendiyseniz yıldız verin!**
