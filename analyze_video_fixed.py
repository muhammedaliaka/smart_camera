import cv2
import ollama
import os
import time
from datetime import timedelta

# --- YAPILANDIRMA ---
VIDEO_PATH = "okul_kaydi.mp4"  # Analiz edilecek video dosyasının yolu
MODEL_NAME = "qwen2-vl:3b"      # Kullanılacak Ollama modeli (README ile uyumlu)
OUTPUT_REPORT = "analiz_raporu.md"
MOTION_THRESHOLD = 5000         # Hareket algılama hassasiyeti (piksel sayısı)
SKIP_FRAMES = 10                # Hızlandırmak için kaç karede bir kontrol yapılsın
ROI_COORDS = None               # [y1:y2, x1:x2] -> None ise kullanıcı seçer veya tam ekran bakar

def analyze_with_ai(image_path, timestamp):
    """Ollama API kullanarak görseli analiz eder."""
    prompt = (
        "Bu güvenlik kamerası görüntüsünde kapıdan içeri giren birini görüyor musun? "
        "Eğer birisi varsa; cinsiyetini, kıyafet renklerini (üst ve alt), "
        "elinde veya sırtında taşıdığı nesneleri (çanta, anahtar, dosya vb.) "
        "çok kısa ve net maddeler halinde açıkla. Eğer kimse yoksa 'Hareket algılandı ancak kişi tespit edilemedi' yaz."
    )

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{
                'role': 'user',
                'content': prompt,
                'images': [image_path]
            }]
        )
        return response['message']['content']
    except Exception as e:
        return f"AI Analiz Hatası: {str(e)}"

def format_timestamp(seconds):
    """Saniyeyi SS:DD:SS formatına çevirir."""
    return str(timedelta(seconds=int(seconds)))

def main():
    if not os.path.exists(VIDEO_PATH):
        print(f"Hata: {VIDEO_PATH} bulunamadı. Lütfen video dosyasını projeye ekleyin.")
        return

    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or fps is None:
        fps = 25.0  # Varsayılan FPS

    # Hareket algılayıcıyı başlat (MOG2)
    fgbg = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=16, detectShadows=True)

    print(f"Video analizi başlıyor: {VIDEO_PATH}")
    print("Rapor dosyası: ", OUTPUT_REPORT)

    with open(OUTPUT_REPORT, "w", encoding="utf-8") as report:
        report.write(f"# Video Analiz Raporu\n")
        report.write(f"- **Dosya:** {VIDEO_PATH}\n")
        report.write(f"- **Tarih:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        report.write("| Zaman Damgası | AI Analiz Raporu |\n")
        report.write("| :--- | :--- |\n")

    frame_count = 0
    last_detection_time = -10  # Aynı anı defalarca analiz etmemek için

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            # Sadece belirli kareleri işle (hız optimizasyonu)
            if frame_count % SKIP_FRAMES != 0:
                continue

            # ROI Belirleme (Eğer tanımlanmadıysa tam kareye bak)
            roi = frame[ROI_COORDS[0]:ROI_COORDS[1], ROI_COORDS[2]:ROI_COORDS[3]] if ROI_COORDS else frame 

            # Maske oluştur ve hareketi hesapla
            fgmask = fgbg.apply(roi)
            # Gölgeleri temizle (isteğe bağlı)
            _, fgmask = cv2.threshold(fgmask, 250, 255, cv2.THRESH_BINARY)

            motion_pixels = cv2.countNonZero(fgmask)
            current_time_sec = frame_count / fps

            # Hareket varsa ve son tespitten üzerinden 5 saniye geçtiyse
            if motion_pixels > MOTION_THRESHOLD and (current_time_sec - last_detection_time) > 5:
                timestamp_str = format_timestamp(current_time_sec)
                print(f"[{timestamp_str}] Hareket algılandı, AI analizine gönderiliyor...")

                # Geçici kare kaydet
                temp_img = f"temp_capture_{int(time.time())}.jpg"
                cv2.imwrite(temp_img, frame)

                # AI Analizi
                analysis_result = analyze_with_ai(temp_img, timestamp_str)

                # Raporu Güncelle
                with open(OUTPUT_REPORT, "a", encoding="utf-8") as report:
                    # Markdown tablosu için satır sonlarını temizle
                    clean_result = analysis_result.replace('\n', ' ')
                    report.write(f"| {timestamp_str} | {clean_result} |\n")

                last_detection_time = current_time_sec

                # Geçici dosyayı temizle
                if os.path.exists(temp_img):
                    os.remove(temp_img)
    finally:
        cap.release()

    print("\nAnaliz tamamlandı. Rapor oluşturuldu.")

if __name__ == "__main__":
    main()
