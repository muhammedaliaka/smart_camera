@echo off
REM Smart Camera - One-Click Installer
REM Tek Tıklama Kurulum

title Smart Camera Installer

echo.
echo ========================================
echo   Smart Camera - Otomatik Kurulum
echo   Smart Camera - Auto Installation
echo ========================================
echo.

REM Python kontrolü
python --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Python bulunamadi!
    echo [ERROR] Python not found!
    echo.
    echo Python 3.8+ gereklidir.
    echo Python 3.8+ is required.
    echo.
    echo Indirmek icin: https://www.python.org/downloads/
    echo Download from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Kurulum scriptini çalıştır
python install.py

if errorlevel 1 (
    echo.
    echo [HATA] Kurulum basarisiz!
    echo [ERROR] Installation failed!
    pause
    exit /b 1
)

echo.
echo [BASARILI] Kurulum tamamlandi!
echo [SUCCESS] Installation completed!
echo.
pause
