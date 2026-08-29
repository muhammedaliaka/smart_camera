# 🚀 QUICKSTART - Hızlı Başlangıç

## 🇹🇷 Türkçe

### ⚡ 3 Adımda Başlayın

```bash
# 1. Kurulumu Başlat
install.bat           # veya: python install.py

# 2. Setup Wizard'ı Çalıştır
run_setup.bat         # veya: python setup_wizard.py

# 3. Sistemi Kullan
python analyze_video_v2.py
```

### 📁 Dosya Rehberi

| Dosya | Açıklama | Ne Zaman Kullanılır |
|-------|----------|---------------------|
| **install.bat** | Otomatik kurulum | İlk kurulum için |
| **run_setup.bat** | Setup wizard başlatıcı | Ayarları değiştirmek için |
| **build_exe.bat** | EXE oluşturucu | Bağımsız kurulum istiyorsanız |
| **setup_wizard.py** | Ana kurulum scripti | Python ile direkt çalıştırmak için |
| **config.json** | Yapılandırma dosyası | Wizard tarafından oluşturulur |

### 🎯 Kullanım Senaryoları

#### Senaryo 1: İlk Kurulum (YENİ KULLANICI)
```bash
1. install.bat çalıştır
2. Dil seç (Türkçe/English)
3. Bekle (bağımlılıklar yüklenir)
4. Setup wizard otomatik açılır
5. Ayarları yap
6. Bitir!
```

#### Senaryo 2: Sadece Ayar Değiştirme
```bash
1. run_setup.bat çalıştır
2. Ayarları güncelle
3. Kaydet
```

#### Senaryo 3: EXE Oluşturma
```bash
1. build_exe.bat çalıştır
2. Bekle (2-3 dakika)
3. dist/SmartCamera_Setup.exe kullan
```

### 🎛️ Hızlı Ayar Profilleri

#### 🏃 HIZLI (Önerilen Yeni Başlayanlar)
```
Skip Frames: 10
Motion Threshold: 2000
Cooldown: 15s
Multi-Frame: KAPALI
Workers: 1
```
**Ne Zaman:** İlk deneme, düşük performanslı PC

#### ⚖️ DENGELİ (Önerilen)
```
Skip Frames: 5
Motion Threshold: 1200
Cooldown: 8s
Multi-Frame: AÇIK (6 kare)
Workers: 2
```
**Ne Zaman:** Normal kullanım

#### 🔍 DETAYLI (İleri Seviye)
```
Skip Frames: 3
Motion Threshold: 800
Cooldown: 5s
Multi-Frame: AÇIK (6 kare)
Workers: 3-4
```
**Ne Zaman:** Yüksek kalite gerekli

### 🐛 Hızlı Sorun Giderme

| Sorun | Hızlı Çözüm |
|-------|-------------|
| ❌ Python bulunamadı | [Python yükle](https://www.python.org/downloads/) |
| ❌ EXE çalışmıyor | Windows Defender > İzin ver |
| ❌ Klasör seçilemiyor | Yönetici olarak çalıştır |
| ❌ Config kaydetmiyor | Yazma izni ver |
| ⚠️ Çok yavaş | Worker sayısını azalt |
| ⚠️ Çok fazla olay | Motion Threshold artır |

### 📞 Yardım

- 📖 **Detaylı Kılavuz:** `SETUP_GUIDE.md`
- 📄 **Kurulum Özet:** `README_SETUP.md`
- 🌐 **GitHub:** Issues bölümü

---

## 🇬🇧 English

### ⚡ Start in 3 Steps

```bash
# 1. Run Installation
install.bat           # or: python install.py

# 2. Run Setup Wizard
run_setup.bat         # or: python setup_wizard.py

# 3. Use the System
python analyze_video_v2.py
```

### 📁 File Guide

| File | Description | When to Use |
|------|-------------|-------------|
| **install.bat** | Auto installer | First-time setup |
| **run_setup.bat** | Setup wizard launcher | Change settings |
| **build_exe.bat** | EXE builder | Want standalone installer |
| **setup_wizard.py** | Main setup script | Run directly with Python |
| **config.json** | Configuration file | Created by wizard |

### 🎯 Usage Scenarios

#### Scenario 1: First-Time Setup (NEW USER)
```bash
1. Run install.bat
2. Select language (Turkish/English)
3. Wait (dependencies install)
4. Setup wizard opens automatically
5. Configure settings
6. Finish!
```

#### Scenario 2: Change Settings Only
```bash
1. Run run_setup.bat
2. Update settings
3. Save
```

#### Scenario 3: Build EXE
```bash
1. Run build_exe.bat
2. Wait (2-3 minutes)
3. Use dist/SmartCamera_Setup.exe
```

### 🎛️ Quick Setting Profiles

#### 🏃 FAST (Recommended for Beginners)
```
Skip Frames: 10
Motion Threshold: 2000
Cooldown: 15s
Multi-Frame: OFF
Workers: 1
```
**When:** First try, low-end PC

#### ⚖️ BALANCED (Recommended)
```
Skip Frames: 5
Motion Threshold: 1200
Cooldown: 8s
Multi-Frame: ON (6 frames)
Workers: 2
```
**When:** Normal use

#### 🔍 DETAILED (Advanced)
```
Skip Frames: 3
Motion Threshold: 800
Cooldown: 5s
Multi-Frame: ON (6 frames)
Workers: 3-4
```
**When:** High quality needed

### 🐛 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| ❌ Python not found | [Install Python](https://www.python.org/downloads/) |
| ❌ EXE not running | Windows Defender > Allow |
| ❌ Can't select folder | Run as administrator |
| ❌ Config not saving | Grant write permission |
| ⚠️ Too slow | Reduce worker count |
| ⚠️ Too many events | Increase motion threshold |

### 📞 Help

- 📖 **Detailed Guide:** `SETUP_GUIDE.md`
- 📄 **Setup Summary:** `README_SETUP.md`
- 🌐 **GitHub:** Issues section

---

## 📊 Comparison Table / Karşılaştırma Tablosu

| Yöntem / Method | Hız / Speed | Kolay / Easy | EXE Gerekli / Need EXE |
|-----------------|-------------|--------------|------------------------|
| **install.bat** | ⚡⚡⚡ | ⭐⭐⭐ | ❌ |
| **run_setup.bat** | ⚡⚡⚡ | ⭐⭐⭐ | ❌ |
| **SmartCamera_Setup.exe** | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ |
| **Python direct** | ⚡⚡ | ⭐⭐ | ❌ |

---

## 🎓 Video Tutorials (Planned)

- [ ] Installation walkthrough
- [ ] Settings optimization
- [ ] Building EXE
- [ ] Troubleshooting

---

## ⚠️ Important Notes / Önemli Notlar

### 🇹🇷 Türkçe
- İlk kurulumda internet bağlantısı gereklidir (PyInstaller için)
- Windows Defender bazı durumlarda EXE'yi engelleyebilir (normal)
- Klasör yollarında Türkçe karakter kullanmaktan kaçının
- Config.json'ı manuel düzenleyebilirsiniz (JSON formatına dikkat)

### 🇬🇧 English
- Internet connection required for first setup (for PyInstaller)
- Windows Defender may block EXE (normal behavior)
- Avoid special characters in folder paths
- You can manually edit config.json (maintain JSON format)

---

**Made with ❤️ for Smart Camera Project**

**Version:** 1.0.0  
**Last Updated:** 2026  
**Language Support:** TR 🇹🇷 | EN 🇬🇧
