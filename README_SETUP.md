# Smart Camera Setup Wizard

[🇹🇷 Türkçe](#-türkçe) | [🇬🇧 English](#-english)

---

## 🇹🇷 Türkçe

### 📦 Kurulum Sihirbazı - Hızlı Başlangıç

Smart Camera sistemini kolayca yapılandırmak için grafiksel kurulum sihirbazı!

### ✨ Özellikler

- 🌍 **İki Dil Desteği:** Türkçe ve İngilizce
- 🖥️ **Grafiksel Arayüz:** Kullanımı kolay, modern arayüz
- 📁 **Otomatik Klasör Yönetimi:** Gerekli klasörler otomatik oluşturulur
- ⚙️ **Kolay Yapılandırma:** Tüm ayarlar tek yerden
- 💾 **Otomatik Kayıt:** Ayarlar otomatik config.json'a kaydedilir
- 🚀 **Hızlı Kurulum:** 2 dakikada sistem hazır!

### 🎯 Kullanım Senaryoları

#### Senaryo 1: İlk Kurulum (EXE ile - ÖNERİLEN)

```
1. SmartCamera_Setup.exe dosyasını çalıştır
2. Dilini seç (Türkçe)
3. Video klasörünü seç (örn: C:\Videos)
4. Rapor klasörünü seç (örn: C:\Reports)
5. Varsayılan ayarları kullan veya özelleştir
6. "Bitir" butonuna tıkla
7. Sistem hazır! analyze_video_v2.py'yi çalıştır
```

#### Senaryo 2: Python Script ile

```bash
# Setup wizard'ı başlat
python setup_wizard.py

# veya batch dosyası ile
run_setup.bat
```

#### Senaryo 3: EXE Oluşturma (Geliştiriciler için)

```bash
# Gerekli paketleri yükle
pip install -r requirements_setup.txt

# EXE oluştur
python build_exe.py

# veya batch dosyası ile
build_exe.bat

# Sonuç: dist/SmartCamera_Setup.exe
```

### 📋 Sistem Gereksinimleri

**Minimum:**
- Windows 7/8/10/11 (64-bit)
- 2GB RAM
- 100MB disk alanı

**Önerilen:**
- Windows 10/11 (64-bit)
- 4GB+ RAM
- 1GB+ disk alanı

**Yazılım:**
- Python 3.8+ (sadece script çalıştırmak için)
- EXE dosyası için Python gerekmez!

### 🎨 Sihirbaz Sayfaları

1. **Hoş Geldin Sayfası**
   - Dil seçimi (Türkçe/English)
   - Karşılama mesajı

2. **Klasör Ayarları**
   - Video giriş klasörü
   - Rapor çıkış klasörü
   - Gözat butonu ile kolay seçim

3. **İşleme Ayarları**
   - Kare atlama (1-30)
   - Hareket eşiği (500-5000)
   - Bekleme süresi (5-30s)

4. **AI Ayarları**
   - Model seçimi (qwen2.5vl:3b vb.)
   - Worker sayısı (1-4)
   - Zaman aşımı (30-120s)

5. **Çoklu Kare Ayarları**
   - Etkinleştir/kapat
   - Kare sayısı (3-10)
   - Kare aralığı (3-10)

6. **Özet Sayfası**
   - Tüm ayarların özeti
   - Kaydet ve çık

### 🔧 Ayar Önerileri

#### Hızlı İşlem (Az CPU kullanımı)
```
Skip Frames: 10
Motion Threshold: 2000
Cooldown: 15s
Multi-Frame: Kapalı
Workers: 1
```

#### Detaylı Analiz (Yüksek kalite)
```
Skip Frames: 3
Motion Threshold: 800
Cooldown: 5s
Multi-Frame: Açık (6 kare)
Workers: 2-4
```

#### Dengeli (Önerilen) ⭐
```
Skip Frames: 5
Motion Threshold: 1200
Cooldown: 8s
Multi-Frame: Açık (6 kare)
Workers: 2
```

### 📂 Dosya Yapısı

```
smart_camera/
│
├── 🧙 Setup Wizard
│   ├── setup_wizard.py          # Ana sihirbaz scripti
│   ├── build_exe.py             # EXE oluşturucu
│   ├── run_setup.bat            # Windows başlatıcı
│   ├── build_exe.bat            # EXE oluşturma batch
│   ├── requirements_setup.txt   # Setup gereksinimleri
│   ├── README_SETUP.md          # Bu dosya
│   └── SETUP_GUIDE.md           # Detaylı kılavuz
│
├── 📹 Ana Program
│   ├── analyze_video_v2.py      # Video analiz programı
│   ├── config.json              # Yapılandırma (wizard oluşturur)
│   └── roi_coords.json          # ROI ayarları
│
├── 📁 Klasörler
│   ├── videos/                  # Video dosyaları (otomatik)
│   └── raporlar/                # Analiz raporları (otomatik)
│       ├── frames/              # Kare görselleri
│       └── json/                # JSON raporlar
│
└── 🔨 Build Çıktıları (opsiyonel)
    ├── build/                   # Geçici build dosyaları
    ├── dist/                    # EXE dosyası burada
    └── *.spec                   # PyInstaller spec dosyası
```

### 🐛 Sık Karşılaşılan Sorunlar

#### 1. EXE Çalışmıyor

**Semptom:** Çift tıklayınca hiçbir şey olmuyor

**Çözüm:**
```
1. Windows Defender uyarısı:
   - "Daha fazla bilgi" tıkla
   - "Yine de çalıştır" seç

2. Antivirüs engelliyor:
   - Güvenli listeye ekle
   - veya Python script kullan

3. Yönetici izni gerekiyor:
   - Sağ tık > Yönetici olarak çalıştır
```

#### 2. Klasör Seçilemiyor

**Semptom:** Gözat butonu çalışmıyor

**Çözüm:**
```
1. Yönetici olarak çalıştır
2. Klasör yolunu manuel yaz
3. Python script ile dene
```

#### 3. Config.json Oluşmuyor

**Semptom:** Ayarlar kaydedilmiyor

**Çözüm:**
```
1. Yazma izinlerini kontrol et
2. Klasör yolunda Türkçe karakter varsa değiştir
3. Program klasörüne yaz izni ver
```

#### 4. Python Bulunamadı Hatası (script için)

**Çözüm:**
```
1. Python yüklü mü kontrol et: python --version
2. Python PATH'e ekli mi kontrol et
3. Python'u tekrar yükle (Add to PATH işaretle)
```

### 📞 Destek

**Dokümantasyon:**
- `SETUP_GUIDE.md` - Detaylı kullanım kılavuzu
- `README_SETUP.md` - Bu dosya (hızlı başlangıç)

**Sorun bildirimi:**
- GitHub Issues
- Pull Request'ler hoş geldiniz!

### 🎓 Video Eğitimler (Planlanan)

- [ ] Temel kurulum
- [ ] Ayarların optimizasyonu
- [ ] EXE oluşturma
- [ ] Sorun giderme

---

## 🇬🇧 English

### 📦 Setup Wizard - Quick Start

Graphical setup wizard for easy Smart Camera system configuration!

### ✨ Features

- 🌍 **Dual Language:** Turkish and English support
- 🖥️ **GUI Interface:** Easy-to-use, modern interface
- 📁 **Auto Folder Management:** Required folders created automatically
- ⚙️ **Easy Configuration:** All settings in one place
- 💾 **Auto Save:** Settings saved to config.json automatically
- 🚀 **Quick Setup:** System ready in 2 minutes!

### 🎯 Usage Scenarios

#### Scenario 1: First-Time Setup (EXE - RECOMMENDED)

```
1. Run SmartCamera_Setup.exe
2. Select language (English)
3. Choose video folder (e.g., C:\Videos)
4. Choose report folder (e.g., C:\Reports)
5. Use defaults or customize
6. Click "Finish"
7. System ready! Run analyze_video_v2.py
```

#### Scenario 2: Using Python Script

```bash
# Start setup wizard
python setup_wizard.py

# or use batch file
run_setup.bat
```

#### Scenario 3: Building EXE (For Developers)

```bash
# Install dependencies
pip install -r requirements_setup.txt

# Build EXE
python build_exe.py

# or use batch file
build_exe.bat

# Result: dist/SmartCamera_Setup.exe
```

### 📋 System Requirements

**Minimum:**
- Windows 7/8/10/11 (64-bit)
- 2GB RAM
- 100MB disk space

**Recommended:**
- Windows 10/11 (64-bit)
- 4GB+ RAM
- 1GB+ disk space

**Software:**
- Python 3.8+ (only for script)
- EXE doesn't require Python!

### 🎨 Wizard Pages

1. **Welcome Page**
   - Language selection (Turkish/English)
   - Welcome message

2. **Folder Settings**
   - Video input folder
   - Report output folder
   - Easy selection with browse button

3. **Processing Settings**
   - Frame skipping (1-30)
   - Motion threshold (500-5000)
   - Cooldown period (5-30s)

4. **AI Settings**
   - Model selection (qwen2.5vl:3b etc.)
   - Worker count (1-4)
   - Timeout (30-120s)

5. **Multi-Frame Settings**
   - Enable/disable
   - Frame count (3-10)
   - Frame interval (3-10)

6. **Summary Page**
   - All settings overview
   - Save and exit

### 🔧 Recommended Settings

#### Fast Processing (Low CPU usage)
```
Skip Frames: 10
Motion Threshold: 2000
Cooldown: 15s
Multi-Frame: Off
Workers: 1
```

#### Detailed Analysis (High quality)
```
Skip Frames: 3
Motion Threshold: 800
Cooldown: 5s
Multi-Frame: On (6 frames)
Workers: 2-4
```

#### Balanced (Recommended) ⭐
```
Skip Frames: 5
Motion Threshold: 1200
Cooldown: 8s
Multi-Frame: On (6 frames)
Workers: 2
```

### 🐛 Common Issues

#### 1. EXE Not Running

**Solution:**
```
1. Windows Defender warning:
   - Click "More info"
   - Select "Run anyway"

2. Antivirus blocking:
   - Add to safe list
   - or use Python script

3. Admin rights needed:
   - Right-click > Run as administrator
```

#### 2. Cannot Select Folders

**Solution:**
```
1. Run as administrator
2. Type folder path manually
3. Try Python script
```

#### 3. Config.json Not Created

**Solution:**
```
1. Check write permissions
2. Avoid special characters in paths
3. Grant write access to program folder
```

### 📞 Support

**Documentation:**
- `SETUP_GUIDE.md` - Detailed user guide
- `README_SETUP.md` - This file (quick start)

**Issue reporting:**
- GitHub Issues
- Pull requests welcome!

---

## 🚀 Quick Command Reference

```bash
# Run setup wizard (Python)
python setup_wizard.py

# Run setup wizard (Batch)
run_setup.bat

# Build EXE
python build_exe.py
# or
build_exe.bat

# Install dependencies
pip install -r requirements_setup.txt

# Run main program after setup
python analyze_video_v2.py
```

## 📝 Version History

### v1.0.0 (Current)
- ✅ Initial release
- ✅ Dual language support (TR/EN)
- ✅ Full configuration wizard
- ✅ EXE building support
- ✅ Auto folder creation
- ✅ Validation and error handling

---

**Made with ❤️ for Smart Camera Project**
