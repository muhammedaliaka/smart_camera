#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart Camera Complete Installer
Tam Kurulum ve Test Scripti
"""

import os
import sys
import subprocess
from pathlib import Path
import json

class SmartCameraInstaller:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.lang = 'tr'  # Varsayılan dil
        
    def print_header(self, text_tr, text_en=""):
        """Başlık yazdır"""
        print("\n" + "=" * 70)
        if self.lang == 'tr':
            print(f"  {text_tr}")
        else:
            print(f"  {text_en or text_tr}")
        print("=" * 70 + "\n")
    
    def print_step(self, step_num, text_tr, text_en=""):
        """Adım yazdır"""
        if self.lang == 'tr':
            print(f"\n[{step_num}] {text_tr}")
        else:
            print(f"\n[{step_num}] {text_en or text_tr}")
    
    def print_success(self, text_tr, text_en=""):
        """Başarı mesajı"""
        if self.lang == 'tr':
            print(f"✅ {text_tr}")
        else:
            print(f"✅ {text_en or text_tr}")
    
    def print_error(self, text_tr, text_en=""):
        """Hata mesajı"""
        if self.lang == 'tr':
            print(f"❌ {text_tr}")
        else:
            print(f"❌ {text_en or text_tr}")
    
    def print_warning(self, text_tr, text_en=""):
        """Uyarı mesajı"""
        if self.lang == 'tr':
            print(f"⚠️  {text_tr}")
        else:
            print(f"⚠️  {text_en or text_tr}")
    
    def select_language(self):
        """Dil seçimi"""
        self.print_header("Dil Seçimi / Language Selection")
        print("1. Türkçe")
        print("2. English")
        print()
        
        choice = input("Seçim / Choice (1-2): ").strip()
        self.lang = 'tr' if choice == '1' else 'en'
    
    def check_python(self):
        """Python kontrolü"""
        self.print_step(1, "Python kontrol ediliyor...", "Checking Python...")
        
        try:
            version = sys.version_info
            if version.major >= 3 and version.minor >= 8:
                self.print_success(
                    f"Python {version.major}.{version.minor}.{version.micro} bulundu",
                    f"Python {version.major}.{version.minor}.{version.micro} found"
                )
                return True
            else:
                self.print_error(
                    "Python 3.8+ gerekli!",
                    "Python 3.8+ required!"
                )
                return False
        except Exception as e:
            self.print_error(f"Python kontrol hatası: {e}", f"Python check error: {e}")
            return False
    
    def check_files(self):
        """Gerekli dosyaları kontrol et"""
        self.print_step(2, "Dosyalar kontrol ediliyor...", "Checking files...")
        
        required_files = [
            'setup_wizard.py',
            'build_exe.py',
            'analyze_video_v2.py',
        ]
        
        all_present = True
        for file in required_files:
            file_path = self.root_dir / file
            if file_path.exists():
                self.print_success(f"  ✓ {file}")
            else:
                self.print_error(f"  ✗ {file} bulunamadı!", f"  ✗ {file} not found!")
                all_present = False
        
        return all_present
    
    def install_dependencies(self):
        """Bağımlılıkları yükle"""
        self.print_step(3, "Bağımlılıklar yükleniyor...", "Installing dependencies...")
        
        # PyInstaller için
        packages = ['pyinstaller']
        
        for package in packages:
            try:
                self.print_warning(f"Yükleniyor: {package}", f"Installing: {package}")
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '-q'])
                self.print_success(f"{package} yüklendi", f"{package} installed")
            except subprocess.CalledProcessError:
                self.print_warning(
                    f"{package} yüklenemedi (opsiyonel)",
                    f"Failed to install {package} (optional)"
                )
    
    def create_folders(self):
        """Gerekli klasörleri oluştur"""
        self.print_step(4, "Klasörler oluşturuluyor...", "Creating folders...")
        
        folders = ['videos', 'raporlar', 'raporlar/frames', 'raporlar/json']
        
        for folder in folders:
            folder_path = self.root_dir / folder
            folder_path.mkdir(parents=True, exist_ok=True)
            self.print_success(f"  ✓ {folder}")
    
    def test_setup_wizard(self):
        """Setup wizard'ı test et"""
        self.print_step(5, "Setup wizard test ediliyor...", "Testing setup wizard...")
        
        try:
            # Sadece import edip kontrol et
            import importlib.util
            spec = importlib.util.spec_from_file_location("setup_wizard", "setup_wizard.py")
            if spec and spec.loader:
                self.print_success(
                    "Setup wizard scripti doğrulandı",
                    "Setup wizard script validated"
                )
                return True
            else:
                self.print_error(
                    "Setup wizard yüklenemedi",
                    "Setup wizard could not be loaded"
                )
                return False
        except Exception as e:
            self.print_error(f"Test hatası: {e}", f"Test error: {e}")
            return False
    
    def build_exe_option(self):
        """EXE oluşturma seçeneği"""
        self.print_step(6, "EXE oluşturma (opsiyonel)", "Building EXE (optional)")
        
        if self.lang == 'tr':
            print("\nEXE dosyası oluşturmak istiyor musunuz?")
            print("Bu işlem birkaç dakika sürebilir.")
            choice = input("\nOluştur? (e/h) [h]: ").strip().lower()
        else:
            print("\nDo you want to build EXE file?")
            print("This may take a few minutes.")
            choice = input("\nBuild? (y/n) [n]: ").strip().lower()
        
        if choice in ['e', 'y', 'yes', 'evet']:
            try:
                self.print_warning("EXE oluşturuluyor...", "Building EXE...")
                subprocess.check_call([sys.executable, 'build_exe.py'])
                
                exe_path = self.root_dir / 'dist' / 'SmartCamera_Setup.exe'
                if exe_path.exists():
                    self.print_success(
                        f"EXE oluşturuldu: {exe_path}",
                        f"EXE created: {exe_path}"
                    )
                    return True
                else:
                    self.print_error("EXE oluşturulamadı", "EXE creation failed")
                    return False
            except Exception as e:
                self.print_error(f"Build hatası: {e}", f"Build error: {e}")
                return False
        else:
            self.print_warning(
                "EXE oluşturma atlandı. İstediğiniz zaman 'build_exe.bat' çalıştırabilirsiniz.",
                "EXE build skipped. You can run 'build_exe.bat' anytime."
            )
            return False
    
    def create_desktop_shortcut_option(self):
        """Masaüstü kısayolu oluşturma seçeneği"""
        if self.lang == 'tr':
            print("\n\nMasaüstüne kısayol oluşturmak istiyor musunuz?")
            choice = input("Oluştur? (e/h) [h]: ").strip().lower()
        else:
            print("\n\nDo you want to create desktop shortcut?")
            choice = input("Create? (y/n) [n]: ").strip().lower()
        
        if choice in ['e', 'y', 'yes', 'evet']:
            try:
                subprocess.check_call([sys.executable, 'create_desktop_shortcut.py'])
            except:
                self.print_warning(
                    "Kısayol oluşturulamadı, ancak devam edebilirsiniz",
                    "Shortcut creation failed, but you can continue"
                )
    
    def show_final_instructions(self):
        """Son talimatları göster"""
        self.print_header("Kurulum Tamamlandı! 🎉", "Installation Complete! 🎉")
        
        if self.lang == 'tr':
            print("""
📋 Sonraki Adımlar:

1. Setup Wizard'ı Çalıştır:
   • EXE varsa: dist/SmartCamera_Setup.exe
   • Script ile: python setup_wizard.py
   • veya: run_setup.bat

2. Ayarları Yapılandır:
   • Video klasörü seç
   • Rapor klasörü seç
   • İşleme parametrelerini ayarla
   • AI ayarlarını yap

3. Sistemi Kullan:
   • python analyze_video_v2.py

📚 Dokümantasyon:
   • README_SETUP.md - Hızlı başlangıç
   • SETUP_GUIDE.md - Detaylı kılavuz

🆘 Yardım:
   • GitHub Issues
   • Dokümantasyon dosyaları

💡 İpuçları:
   • İlk kullanımda varsayılan ayarları deneyin
   • Performans sorunları için Worker sayısını azaltın
   • Detaylı analiz için Multi-Frame'i açın
""")
        else:
            print("""
📋 Next Steps:

1. Run Setup Wizard:
   • If EXE exists: dist/SmartCamera_Setup.exe
   • With script: python setup_wizard.py
   • or: run_setup.bat

2. Configure Settings:
   • Select video folder
   • Select report folder
   • Adjust processing parameters
   • Configure AI settings

3. Use the System:
   • python analyze_video_v2.py

📚 Documentation:
   • README_SETUP.md - Quick start
   • SETUP_GUIDE.md - Detailed guide

🆘 Help:
   • GitHub Issues
   • Documentation files

💡 Tips:
   • Try default settings first
   • Reduce Workers for performance issues
   • Enable Multi-Frame for detailed analysis
""")
    
    def run(self):
        """Ana kurulum süreci"""
        os.system('cls' if os.name == 'nt' else 'clear')
        
        # Dil seçimi
        self.select_language()
        
        # Ana başlık
        self.print_header(
            "Smart Camera - Otomatik Kurulum",
            "Smart Camera - Automatic Installation"
        )
        
        # Kontroller
        if not self.check_python():
            return False
        
        if not self.check_files():
            return False
        
        # Kurulum adımları
        self.install_dependencies()
        self.create_folders()
        self.test_setup_wizard()
        
        # Opsiyonel: EXE oluştur
        self.build_exe_option()
        
        # Opsiyonel: Desktop shortcut
        self.create_desktop_shortcut_option()
        
        # Son talimatlar
        self.show_final_instructions()
        
        return True


def main():
    installer = SmartCameraInstaller()
    try:
        success = installer.run()
        if success:
            print("\n" + "=" * 70)
            input("\nDevam etmek için Enter'a basın / Press Enter to continue...")
            return 0
        else:
            return 1
    except KeyboardInterrupt:
        print("\n\nKurulum iptal edildi / Installation cancelled")
        return 1
    except Exception as e:
        print(f"\n\nBeklenmeyen hata / Unexpected error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
