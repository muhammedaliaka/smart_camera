@echo off
title Paket Yukleme

echo.
echo ==========================================
echo   GEREKLI PAKETLER YUKLENIYOR...
echo ==========================================
echo.

echo [1/3] pip guncelleniyor...
python -m pip install --upgrade pip

echo.
echo [2/3] OpenCV ve diger paketler yukleniyor...
pip install opencv-python opencv-contrib-python numpy tqdm ollama

echo.
echo [3/3] Kontrol ediliyor...
python -c "import cv2; print('OpenCV:', cv2.__version__)"
python -c "import numpy; print('NumPy:', numpy.__version__)"
python -c "import tqdm; print('tqdm: OK')"
python -c "import ollama; print('ollama: OK')"

echo.
echo ==========================================
echo   YUKLEME TAMAMLANDI!
echo ==========================================
echo.
pause
