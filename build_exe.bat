@echo off
REM EXE Builder Batch Script
REM EXE Oluşturucu Batch Script

echo ========================================
echo   Smart Camera EXE Builder
echo   Akıllı Kamera EXE Oluşturucu
echo ========================================
echo.

REM Python kontrolü
python --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Python bulunamadi!
    echo [ERROR] Python not found!
    pause
    exit /b 1
)

REM PyInstaller kontrolü
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo [BILGI] PyInstaller yuklenmiyor...
    echo [INFO] Installing PyInstaller...
    pip install pyinstaller
    echo.
)

REM EXE oluştur
echo [BILGI] EXE olusturuluyor...
echo [INFO] Building EXE...
echo.

python build_exe.py

if errorlevel 1 (
    echo.
    echo [HATA] EXE olusturulamadi!
    echo [ERROR] Failed to build EXE!
    pause
    exit /b 1
)

echo.
echo [TAMAMLANDI] EXE basariyla olusturuldu!
echo [COMPLETED] EXE successfully created!
echo.
echo Konum / Location: dist\SmartCamera_Setup.exe
echo.
pause
