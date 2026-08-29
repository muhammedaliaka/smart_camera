@echo off
title Ollama Kurulum

echo.
echo ==========================================
echo   OLLAMA KURULUM REHBERI
echo ==========================================
echo.
echo Ollama yapay zeka motorunu kurmak icin:
echo.
echo 1. Bu sayfayi ac: https://ollama.com/download
echo.
echo 2. "Download for Windows" butonuna tikla
echo.
echo 3. OllamaSetup.exe dosyasini calistir
echo.
echo 4. Kurulum bitince otomatik baslar
echo.
echo 5. Terminalde "ollama pull qwen2.5vl:3b" komutunu calistir
echo.
echo ==========================================
echo.
echo Simdi tarayiciyi aciyorum...
echo.
timeout /t 3
start https://ollama.com/download
echo.
echo Kurulum bittikten sonra bu pencereyi kapat.
echo.
pause
