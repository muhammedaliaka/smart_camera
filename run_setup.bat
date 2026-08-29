@echo off
REM Modern Setup Wizard Launcher

title Akilli Kamera Kurulum

echo.
echo ==========================================
echo   AKILLI KAMERA - MODERN KURULUM
echo ==========================================
echo.
echo Kurulum penceresi aciliyor...
echo.

REM Modern setup wizard'i ac
start "" pythonw setup_wizard_modern.py

echo.
echo Pencere actiysa bu konsolu kapatabilirsiniz.
echo.
timeout /t 2 >nul
exit

