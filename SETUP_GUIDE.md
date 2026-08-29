# Smart Camera Setup Wizard - Kullanım Kılavuzu
# Smart Camera Setup Wizard - User Guide

[Türkçe](#türkçe) | [English](#english)

---

## Türkçe

### 📋 Gereksinimler

#### Kurulum Sihirbazı için:
- Windows 7/8/10/11 (64-bit)
- En az 2GB RAM
- Python 3.8+ (sadece EXE oluşturmak için gerekli)

#### Ana Program için:
- Ollama (AI modeli için)
- OpenCV Python
- Python 3.8+

### 🚀 Hızlı Başlangıç

#### Yöntem 1: EXE Dosyası ile (ÖNERİLEN)

1. **EXE'yi indirin:**
   - `SmartCamera_Setup.exe` dosyasını indirin
   - Herhangi bir kurulum gerektirmez!

2. **Çalıştırın:**
   - `SmartCamera_Setup.exe` dosyasına çift tıklayın
   - Windows Defender uyarısı gelirse "Daha Fazla Bilgi" > "Yine de çalıştır" seçin

3. **Sihirbazı tamamlayın:**
   - Dil seçimi (Türkçe/İngilizce)
   - Klasör ayarları
   - İşleme parametreleri
   - AI ayarları
   - Çoklu kare ayarları
   - Özet ve kaydet

4. **Sistemi kullanın:**
   - `config.json` dosyası otomatik oluşturulur
   - `analyze_video_v2.py` ile video analizine başlayın

#### Yöntem 2: Python Script ile

```bash
# Setup wizard'ı çalıştır
python setup_wizard.py
```

### 🔧 EXE Oluşturma (Geliştiriciler için)

Kendi EXE dosyanızı oluşturmak için:

```bash
# 1. PyInstaller'ı kurun
pip install pyinstaller

# 2. EXE builder'ı çalıştırın
python build_exe.py

# 3. EXE dosyası oluşturulur
# dist/SmartCamera_Setup.exe
```

#### Manuel Build:

```bash
pyinstaller --onefile --windowed --name=SmartCamera_Setup setup_wizard.py
```

### 📁 Klasör Yapısı

```
smart_camera/
│
├── setup_wizard.py          # Setup wizard (kaynak kod)
├── build_exe.py            # EXE builder script
├── config.json             # Yapılandırma (wizard tarafından oluşturulur)
├── analyze_video_v2.py     # Ana analiz programı
├── videos/                 # Video klasörü (otomatik oluşturulur)
└── raporlar/              # Rapor klasörü (otomatik oluşturulur)
    ├── frames/            # Kare görselleri
    └── json/              # JSON raporlar
```

### ⚙️ Ayarlar Açıklaması

#### Klasör Ayarları:
- **Video Giriş Klasörü:** Video dosyalarınızın bulunduğu klasör
- **Rapor Çıkış Klasörü:** Analizlerin kaydedileceği klasör

#### İşleme Ayarları:
- **Atlanan Kare Sayısı (Skip Frames):** Her N karede bir analiz yap (varsayılan: 5)
  - Küçük değer = Daha hassas, daha yavaş
  - Büyük değer = Daha hızlı, daha az detay
  
- **Hareket Eşiği (Motion Threshold):** Hareket algılama hassasiyeti (varsayılan: 1200)
  - Küçük değer = Daha hassas, daha fazla olay
  - Büyük değer = Sadece büyük hareketler

- **Bekleme Süresi (Cooldown):** Aynı olayın tekrar algılanma aralığı (saniye)

#### AI Ayarları:
- **Model Adı:** Ollama AI modeli (varsayılan: qwen2.5vl:3b)
- **Worker Sayısı:** Paralel işleme thread sayısı (1-4 arası)
- **Zaman Aşımı:** AI analizi için maksimum süre (saniye)

#### Çoklu Kare Ayarları:
- **Etkinleştir:** Her olay için birden fazla kare analiz et
- **Kare Sayısı:** Olay başına kaç kare toplanacak (3-10 arası)
- **Kare Aralığı:** Kareler arası boşluk (3-10 arası)

### 🎯 Kullanım Örnekleri

#### Hızlı Analiz (Az detay, hızlı):
- Skip Frames: 10
- Motion Threshold: 2000
- Cooldown: 15s
- Multi-Frame: Kapalı

#### Detaylı Analiz (Çok detay, yavaş):
- Skip Frames: 3
- Motion Threshold: 800
- Cooldown: 5s
- Multi-Frame: Açık (6 kare, 5 aralık)

#### Dengeli (Önerilen):
- Skip Frames: 5
- Motion Threshold: 1200
- Cooldown: 8s
- Multi-Frame: Açık (6 kare, 5 aralık)

### 🐛 Sorun Giderme

#### Problem: EXE çalışmıyor
- **Çözüm:** Windows Defender'ı devre dışı bırakın veya EXE'yi güvenli listeye ekleyin
- **Alternatif:** Python script ile çalıştırın: `python setup_wizard.py`

#### Problem: Klasör seçilemiyor
- **Çözüm:** Yönetici olarak çalıştırın (sağ tık > Yönetici olarak çalıştır)

#### Problem: Config.json oluşturulmuyor
- **Çözüm:** Klasör yazma izinlerini kontrol edin
- **Alternatif:** Manuel olarak oluşturun (örnek config dosyasını kopyalayın)

### 📞 Destek

Sorunlarınız için:
1. SETUP_GUIDE.md dosyasını inceleyin
2. config.json dosyasını kontrol edin
3. GitHub Issues bölümünden destek alın

---

## English

### 📋 Requirements

#### For Setup Wizard:
- Windows 7/8/10/11 (64-bit)
- Minimum 2GB RAM
- Python 3.8+ (only required for building EXE)

#### For Main Program:
- Ollama (for AI model)
- OpenCV Python
- Python 3.8+

### 🚀 Quick Start

#### Method 1: Using EXE File (RECOMMENDED)

1. **Download the EXE:**
   - Download `SmartCamera_Setup.exe`
   - No installation required!

2. **Run it:**
   - Double-click `SmartCamera_Setup.exe`
   - If Windows Defender warns, click "More Info" > "Run anyway"

3. **Complete the wizard:**
   - Language selection (Turkish/English)
   - Folder settings
   - Processing parameters
   - AI settings
   - Multi-frame settings
   - Summary and save

4. **Use the system:**
   - `config.json` file is automatically created
   - Start video analysis with `analyze_video_v2.py`

#### Method 2: Using Python Script

```bash
# Run the setup wizard
python setup_wizard.py
```

### 🔧 Building EXE (For Developers)

To create your own EXE file:

```bash
# 1. Install PyInstaller
pip install pyinstaller

# 2. Run EXE builder
python build_exe.py

# 3. EXE file will be created
# dist/SmartCamera_Setup.exe
```

#### Manual Build:

```bash
pyinstaller --onefile --windowed --name=SmartCamera_Setup setup_wizard.py
```

### 📁 Folder Structure

```
smart_camera/
│
├── setup_wizard.py          # Setup wizard (source code)
├── build_exe.py            # EXE builder script
├── config.json             # Configuration (created by wizard)
├── analyze_video_v2.py     # Main analysis program
├── videos/                 # Video folder (auto-created)
└── raporlar/              # Report folder (auto-created)
    ├── frames/            # Frame images
    └── json/              # JSON reports
```

### ⚙️ Settings Explanation

#### Folder Settings:
- **Video Input Folder:** Folder containing your video files
- **Report Output Folder:** Folder where analysis reports will be saved

#### Processing Settings:
- **Skip Frames:** Analyze every N frames (default: 5)
  - Lower value = More sensitive, slower
  - Higher value = Faster, less detail
  
- **Motion Threshold:** Motion detection sensitivity (default: 1200)
  - Lower value = More sensitive, more events
  - Higher value = Only large movements

- **Cooldown:** Time interval before same event is detected again (seconds)

#### AI Settings:
- **Model Name:** Ollama AI model (default: qwen2.5vl:3b)
- **Worker Count:** Number of parallel processing threads (1-4)
- **Timeout:** Maximum time for AI analysis (seconds)

#### Multi-Frame Settings:
- **Enable:** Analyze multiple frames per event
- **Frame Count:** How many frames to collect per event (3-10)
- **Frame Interval:** Gap between frames (3-10)

### 🎯 Usage Examples

#### Fast Analysis (Less detail, faster):
- Skip Frames: 10
- Motion Threshold: 2000
- Cooldown: 15s
- Multi-Frame: Off

#### Detailed Analysis (More detail, slower):
- Skip Frames: 3
- Motion Threshold: 800
- Cooldown: 5s
- Multi-Frame: On (6 frames, 5 interval)

#### Balanced (Recommended):
- Skip Frames: 5
- Motion Threshold: 1200
- Cooldown: 8s
- Multi-Frame: On (6 frames, 5 interval)

### 🐛 Troubleshooting

#### Problem: EXE not running
- **Solution:** Disable Windows Defender or add EXE to safe list
- **Alternative:** Run with Python script: `python setup_wizard.py`

#### Problem: Cannot select folders
- **Solution:** Run as administrator (right-click > Run as administrator)

#### Problem: Config.json not created
- **Solution:** Check folder write permissions
- **Alternative:** Create manually (copy example config file)

### 📞 Support

For issues:
1. Review SETUP_GUIDE.md
2. Check config.json file
3. Get support from GitHub Issues

---

## 🌟 Features

- ✅ Dual language support (Turkish/English)
- ✅ User-friendly GUI wizard
- ✅ Single EXE file - no installation needed
- ✅ Automatic folder creation
- ✅ Real-time validation
- ✅ Configuration summary before saving
- ✅ Detailed help text for each setting
- ✅ Cross-platform Python support

## 📝 License

This project is part of the Smart Camera system.
