@echo off
REM Smart Camera - Quick Start
REM En Hizli Baslangic

title Akilli Kamera

echo.
echo ============================================
echo   AKILLI KAMERA - KURULUM
echo ============================================
echo.
echo Grafiksel kurulum penceresi aciliyor...
echo Lutfen bekleyin...
echo.

REM Setup wizard'i GUI modunda calistir
start "" pythonw setup_wizard.py

echo.
echo Pencere actiysa bu konsolu kapatabilirsiniz.
echo.
timeout /t 2 >nul
exit
