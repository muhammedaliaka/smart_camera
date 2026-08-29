#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EXE Builder Script for Smart Camera Setup Wizard
PyInstaller kullanarak setup_wizard.py'yi EXE'ye dönüştürür
"""

import PyInstaller.__main__
import os
import sys

def build_exe():
    """Setup Wizard için EXE oluştur"""
    
    # PyInstaller parametreleri
    params = [
        'setup_wizard.py',              # Ana script
        '--name=SmartCamera_Setup',     # EXE adı
        '--onefile',                    # Tek dosya olarak
        '--windowed',                   # Konsol penceresi gösterme
        '--clean',                      # Önceki build'leri temizle
        '--noconfirm',                  # Onay sorma
        
        # Optimizasyonlar
        '--optimize=2',                 # Bytecode optimizasyonu
    ]
    
    print("=" * 60)
    print("  Smart Camera Setup Wizard - EXE Builder")
    print("=" * 60)
    print()
    print("Building executable...")
    print()
    
    try:
        PyInstaller.__main__.run(params)
        print()
        print("=" * 60)
        print("  BUILD SUCCESSFUL!")
        print("=" * 60)
        print()
        print("EXE dosyası oluşturuldu:")
        print("  - dist/SmartCamera_Setup.exe")
        print()
        print("Bu dosyayı herhangi bir Windows bilgisayarda çalıştırabilirsiniz.")
        print()
        
    except Exception as e:
        print()
        print("=" * 60)
        print("  BUILD FAILED!")
        print("=" * 60)
        print()
        print(f"Hata: {str(e)}")
        print()
        print("Çözüm önerileri:")
        print("  1. PyInstaller kurulu mu? -> pip install pyinstaller")
        print("  2. Python kurulumu doğru mu?")
        print("  3. Antivirüs yazılımı build'i engelliyor olabilir")
        print()
        sys.exit(1)


def check_dependencies():
    """Gerekli bağımlılıkları kontrol et"""
    print("Checking dependencies...")
    
    # PyInstaller'ı direkt import etmeyi dene
    try:
        import PyInstaller
        print(f"  ✓ PyInstaller")
    except ImportError:
        print(f"  ✗ PyInstaller - MISSING!")
        print()
        print("PyInstaller yükleniyor / Installing PyInstaller...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pyinstaller', '-q'])
            print("  ✓ PyInstaller yüklendi / PyInstaller installed")
        except:
            print("  ✗ PyInstaller yüklenemedi / Failed to install PyInstaller")
            return False
    
    # tkinter kontrolü
    try:
        import tkinter
        print(f"  ✓ tkinter")
    except ImportError:
        print(f"  ✗ tkinter - MISSING!")
        return False
    
    print()
    return True


if __name__ == "__main__":
    if not check_dependencies():
        sys.exit(1)
    
    build_exe()
