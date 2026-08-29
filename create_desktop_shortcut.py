#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Desktop Shortcut Creator for Smart Camera
Masaüstü Kısayolu Oluşturucu
"""

import os
import sys
from pathlib import Path

def create_desktop_shortcut():
    """Masaüstüne kısayol oluştur"""
    import sys
    
    try:
        # Desktop path
        desktop = Path.home() / "Desktop"
        
        # EXE veya script yolu
        exe_path = Path("dist/SmartCamera_Setup.exe")
        script_path = Path("setup_wizard.py")
        
        if exe_path.exists():
            target = exe_path.absolute()
            name = "Smart Camera Setup"
        elif script_path.exists():
            target = script_path.absolute()
            name = "Smart Camera Setup (Python)"
        else:
            print("❌ Hata: setup_wizard.py veya EXE bulunamadı!")
            print("❌ Error: setup_wizard.py or EXE not found!")
            return False
        
        # Windows kısayolu oluştur
        if sys.platform == 'win32':
            try:
                import winshell
                from win32com.client import Dispatch
                
                shortcut_path = desktop / f"{name}.lnk"
                shell = Dispatch('WScript.Shell')
                shortcut = shell.CreateShortcut(str(shortcut_path))
                
                # Python ile script çalıştır
                if target.suffix == '.py':
                    import sys
                    shortcut.TargetPath = sys.executable
                    shortcut.Arguments = f'"{target}"'
                else:
                    shortcut.TargetPath = str(target)
                
                shortcut.WorkingDirectory = str(Path.cwd())
                shortcut.IconLocation = sys.executable if target.suffix == '.py' else str(target)
                shortcut.Description = "Smart Camera Setup Wizard - Kurulum Sihirbazı"
                shortcut.save()
                
                print(f"✅ Kısayol oluşturuldu: {shortcut_path}")
                print(f"✅ Shortcut created: {shortcut_path}")
                return True
                
            except ImportError:
                print("⚠️  winshell veya pywin32 bulunamadı")
                print("⚠️  Installing required packages...")
                os.system("pip install pywin32 winshell")
                print("\n🔄 Lütfen scripti tekrar çalıştırın")
                print("🔄 Please run the script again")
                return False
        else:
            print("❌ Bu script sadece Windows'ta çalışır")
            print("❌ This script only works on Windows")
            return False
            
    except Exception as e:
        print(f"❌ Hata: {str(e)}")
        print(f"❌ Error: {str(e)}")
        return False


def create_batch_launcher():
    """Batch dosyası ile launcher oluştur (alternatif)"""
    desktop = Path.home() / "Desktop"
    batch_path = desktop / "Smart_Camera_Setup.bat"
    
    script_dir = Path.cwd()
    
    batch_content = f"""@echo off
cd /d "{script_dir}"
if exist "dist\\SmartCamera_Setup.exe" (
    start "" "dist\\SmartCamera_Setup.exe"
) else if exist "setup_wizard.py" (
    python setup_wizard.py
) else (
    echo Setup dosyasi bulunamadi!
    echo Setup file not found!
    pause
)
"""
    
    try:
        with open(batch_path, 'w', encoding='utf-8') as f:
            f.write(batch_content)
        print(f"✅ Batch launcher oluşturuldu: {batch_path}")
        print(f"✅ Batch launcher created: {batch_path}")
        return True
    except Exception as e:
        print(f"❌ Batch oluşturulamadı: {str(e)}")
        print(f"❌ Failed to create batch: {str(e)}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("  Smart Camera - Desktop Shortcut Creator")
    print("  Akıllı Kamera - Masaüstü Kısayol Oluşturucu")
    print("=" * 60)
    print()
    
    # Önce Windows kısayolu dene
    success = create_desktop_shortcut()
    
    # Başarısız olursa batch dosyası oluştur
    if not success:
        print("\n🔄 Alternatif olarak batch dosyası oluşturuluyor...")
        print("🔄 Creating alternative batch file...")
        print()
        create_batch_launcher()
    
    print()
    print("=" * 60)
    input("Devam etmek için Enter'a basın / Press Enter to continue...")
