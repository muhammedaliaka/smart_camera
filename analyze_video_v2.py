#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Akıllı Kamera Arşiv Analiz Sistemi v2.0
- Çoklu video desteği
- İnteraktif ROI seçimi
- Gelişmiş hareket algılama (contour + aspect ratio)
- Asenkron AI analizi (multi-threading)
- Basit nesne takibi (centroid tracker)
- Otomatik raporlama
"""

import cv2
import ollama
import os
import time
import json
import threading
import queue
import numpy as np
from datetime import timedelta
from pathlib import Path
from typing import Optional, List, Dict, Tuple
from collections import defaultdict

try:
    from tqdm import tqdm
except ImportError:
    tqdm = None

# --- YAPILANDIRMA YÜKLEME ---
CONFIG_PATH = "config.json"

# Ingilizce talimat + Turkce cevap: Qwen modellerinde daha az halusinasyon
DEFAULT_AI_PROMPT = """Analyze sequential security camera frames. Frame 1 is oldest, the last frame is newest.

STRICT RULES:
- Describe ONLY what is clearly visible. Never invent or assume a person exists.
- If you cannot clearly see a human body/face, you MUST answer exactly: Kisi: yok
- CRITICAL: If Kisi is "yok" (no person), NEVER add Cinsiyet, Kiyafet, or Hareket fields.
- Do NOT repeat these instructions in your answer.
- Answer in TURKISH only.

OUTPUT FORMAT (2 to 5 short lines, Turkish):
Olay: [kapi aciliyor / kapi kapaniyor / kisi giriyor / kisi cikiyor / baska hareket]
Kisi: [yok OR kisa aciklama - sadece net goruyorsan]

ONLY if person is 100% clearly visible in at least 2 frames, add:
Cinsiyet: [erkek / kadin / belirsiz]
Kiyafet: [renkler ve cesitler]
Hareket: [yon veya hareketi]"""

def load_config() -> dict:
    defaults = {
        "video": {
            "input_folder": "./videos",
            "extensions": [".mp4", ".avi", ".mov", ".mkv"],
            "output_folder": "./raporlar",
            "save_frames": True,
            "frame_quality": 85,
            "exclude_prefixes": ["test_", "_"]
        },
        "processing": {
            "skip_frames": 5,
            "motion_threshold": 1500,
            "contour_min_area": 300,
            "contour_max_area": 80000,
            "person_aspect_ratio": [0.2, 4.5],
            "use_aspect_ratio_filter": False,
            "cooldown_seconds": 8,
            "global_cooldown_seconds": 10,
            "tracker_max_distance": 100,
            "one_event_per_scan": True
        },
        "multi_frame": {
            "enabled": True,
            "frame_count": 6,
            "interval_frames": 5,
            "margin": 50,
            "max_width": 384,
            "num_ctx": 8192,
            "timeout_per_frame": 15
        },
        "ai": {
            "model_name": "qwen2.5vl:3b",
            "max_width": 640,
            "timeout": 60,
            "workers": 2,
            "output_language": "tr",
            "prompt": DEFAULT_AI_PROMPT
        },
        "startup": {
            "ask_video_selection": True,
            "ask_roi_selection": True
        },
        "roi": {
            "interactive": True,
            "auto_save": True,
            "coords_file": "roi_coords.json",
            "max_display_width": 1280
        }
    }

    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            user_cfg = json.load(f)
            # Derin merge
            for k, v in user_cfg.items():
                if isinstance(v, dict) and k in defaults:
                    defaults[k].update(v)
                else:
                    defaults[k] = v
    else:
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(defaults, f, indent=2, ensure_ascii=False)
        print(f"[BİLGİ] Varsayılan config oluşturuldu: {CONFIG_PATH}")

    return defaults

CFG = load_config()

ROI_WINDOW = "ROI Secimi"

def get_video_info(path: Path) -> dict:
    cap = cv2.VideoCapture(str(path))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    return {
        "fps": fps,
        "frames": total,
        "duration": total / fps if fps else 0,
        "width": w,
        "height": h,
    }

def read_first_frame(path: Path) -> Optional[np.ndarray]:
    cap = cv2.VideoCapture(str(path))
    ret, frame = cap.read()
    cap.release()
    return frame if ret else None

def load_roi_store() -> dict:
    coords_file = CFG["roi"]["coords_file"]
    if not os.path.exists(coords_file):
        return {}
    with open(coords_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if "roi" in data and isinstance(data["roi"], list):
        return {"_legacy": data["roi"]}
    return data if isinstance(data, dict) else {}

def load_roi_for_video(video_name: str) -> Optional[Tuple[int, int, int, int]]:
    data = load_roi_store()
    roi = data.get(video_name) or data.get("_legacy")
    if isinstance(roi, list) and len(roi) == 4:
        return tuple(roi)
    return None

def save_roi_for_video(video_name: str, roi: Tuple[int, int, int, int]):
    coords_file = CFG["roi"]["coords_file"]
    data = load_roi_store()
    data[video_name] = list(roi)
    data.pop("_legacy", None)
    with open(coords_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[BILGI] ROI kaydedildi: {video_name} -> {roi}")

def prompt_video_selection(all_videos: List[Path]) -> List[Path]:
    if not CFG.get("startup", {}).get("ask_video_selection", True) or len(all_videos) == 1:
        if len(all_videos) == 1:
            print(f"[BILGI] Video: {all_videos[0].name}")
        return all_videos

    print("\n" + "=" * 40)
    print("  VIDEO SECIMI")
    print("=" * 40)
    for i, path in enumerate(all_videos, 1):
        info = get_video_info(path)
        print(
            f"  {i}. {path.name}  "
            f"({info['duration']:.0f} sn, {info['width']}x{info['height']})"
        )
    print("  0. Tum videolar")
    print()

    while True:
        choice = input("Hangi video analiz edilsin? (numara): ").strip()
        if choice == "0":
            return all_videos
        if choice.isdigit():
            idx = int(choice)
            if 1 <= idx <= len(all_videos):
                selected = all_videos[idx - 1]
                print(f"[BILGI] Secilen: {selected.name}")
                return [selected]
        print("[HATA] Gecersiz secim. Listeden bir numara girin.")

def prompt_roi_selection(video_path: Path) -> Optional[Tuple[int, int, int, int]]:
    video_name = video_path.name
    saved_roi = load_roi_for_video(video_name)

    if not CFG.get("startup", {}).get("ask_roi_selection", True):
        if saved_roi:
            print(f"[BILGI] Kayitli ROI: {saved_roi}")
            return saved_roi
        if CFG["roi"]["interactive"]:
            frame = read_first_frame(video_path)
            if frame is not None:
                return ROISelector().select(frame, video_name)
        return None

    print("\n" + "=" * 40)
    print("  ALAN SECIMI (ROI)")
    print("=" * 40)
    print(f"  Video: {video_name}")
    if saved_roi:
        print(f"  Kayitli alan: {saved_roi}")
    print()
    print("  1. Mouse ile yeni alan sec (ONERILEN)")
    if saved_roi:
        print("  2. Kayitli alani kullan")
        print("  3. Tam ekran (ROI yok)")
    else:
        print("  2. Tam ekran (ROI yok)")
    print()

    while True:
        default = "1"
        choice = input(f"Secim [{default}]: ").strip() or default

        if choice == "1":
            frame = read_first_frame(video_path)
            if frame is None:
                print("[HATA] Video karesi okunamadi.")
                return saved_roi
            roi = ROISelector().select(frame, video_name)
            if roi:
                print(f"[BILGI] ROI secildi: {roi}")
            return roi

        if choice == "2":
            if saved_roi:
                print(f"[BILGI] Kayitli ROI kullaniliyor: {saved_roi}")
                return saved_roi
            print("[BILGI] Tam ekran modu (ROI yok)")
            return None

        if choice == "3" and saved_roi:
            print("[BILGI] Tam ekran modu (ROI yok)")
            return None

        print("[HATA] Gecersiz secim.")

# --- ROI YÖNETİMİ ---
class ROISelector:
    def __init__(self):
        self.roi = None
        self.drawing = False
        self.ix = self.iy = -1
        self.base_frame = None
        self.display = None
        self.scale = 1.0
        self.pending_rect = None  # display koordinatları (x1, y1, x2, y2)

    def _to_original_roi(self, x1: int, y1: int, x2: int, y2: int) -> Tuple[int, int, int, int]:
        ox1 = int(min(x1, x2) / self.scale)
        ox2 = int(max(x1, x2) / self.scale)
        oy1 = int(min(y1, y2) / self.scale)
        oy2 = int(max(y1, y2) / self.scale)
        return oy1, oy2, ox1, ox2

    def _draw_overlay(self, img: np.ndarray) -> np.ndarray:
        out = img.copy()
        if self.pending_rect:
            x1, y1, x2, y2 = self.pending_rect
            cv2.rectangle(out, (x1, y1), (x2, y2), (0, 255, 0), 2)
            oy1, oy2, ox1, ox2 = self._to_original_roi(x1, y1, x2, y2)
            cv2.putText(
                out,
                f"Secildi: {ox2 - ox1}x{oy2 - oy1}px",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 0),
                2,
            )
        cv2.putText(
            out,
            "Sol tik + surukle = sec | s/Enter = kaydet | r = sifirla | q = tam ekran",
            (10, out.shape[0] - 15),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (255, 255, 255),
            2,
        )
        return out

    def mouse_callback(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            self.drawing = True
            self.ix, self.iy = x, y
            self.pending_rect = None
            self.roi = None
        elif event == cv2.EVENT_MOUSEMOVE and self.drawing:
            self.display = self._draw_overlay(self.base_frame)
            cv2.rectangle(self.display, (self.ix, self.iy), (x, y), (0, 255, 0), 2)
            cv2.imshow(ROI_WINDOW, self.display)
        elif event == cv2.EVENT_LBUTTONUP:
            self.drawing = False
            x1, x2 = sorted([self.ix, x])
            y1, y2 = sorted([self.iy, y])
            if (x2 - x1) >= 10 and (y2 - y1) >= 10:
                self.pending_rect = (x1, y1, x2, y2)
                self.roi = self._to_original_roi(x1, y1, x2, y2)
                print(f"[ROI] Alan secildi: {self.roi}  -> 's' veya Enter ile kaydet")
            else:
                print("[ROI] Alan cok kucuk, tekrar secin (en az 10x10 piksel)")
                self.pending_rect = None
                self.roi = None
            self.display = self._draw_overlay(self.base_frame)
            cv2.imshow(ROI_WINDOW, self.display)

    def select(self, first_frame: np.ndarray, video_name: str = "") -> Optional[Tuple[int, int, int, int]]:
        if not CFG["roi"]["interactive"]:
            return None

        h, w = first_frame.shape[:2]
        max_w = CFG["roi"].get("max_display_width", 1280)
        if w > max_w:
            self.scale = max_w / w
            self.base_frame = cv2.resize(first_frame, (max_w, int(h * self.scale)))
        else:
            self.scale = 1.0
            self.base_frame = first_frame.copy()

        self.display = self._draw_overlay(self.base_frame)
        cv2.namedWindow(ROI_WINDOW, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(ROI_WINDOW, self.base_frame.shape[1], self.base_frame.shape[0])
        cv2.setMouseCallback(ROI_WINDOW, self.mouse_callback)

        print("[ROI] Pencere acildi. Sol tik + surukle + birak, sonra 's' veya Enter.")

        while True:
            cv2.imshow(ROI_WINDOW, self.display)
            key = cv2.waitKey(30) & 0xFF

            if key in (ord('s'), 13) and self.roi is not None:
                if CFG["roi"]["auto_save"] and video_name:
                    save_roi_for_video(video_name, self.roi)
                break
            elif key == ord('r'):
                self.roi = None
                self.pending_rect = None
                self.display = self._draw_overlay(self.base_frame)
                print("[ROI] Secim sifirlandi, yeniden secin.")
            elif key == ord('q'):
                self.roi = None
                break

        cv2.destroyAllWindows()
        return self.roi

# --- NESNE TAKİBİ (Basit Centroid Tracker) ---
class CentroidTracker:
    def __init__(self, max_distance: int = 100):
        self.objects = {}  # id -> (cx, cy, last_seen)
        self.next_id = 0
        self.max_distance = max_distance

    def update(self, detections: List[Tuple[int, int, int, int]]) -> Dict[int, Tuple[int, int, int, int]]:
        if len(detections) == 0:
            current_time = time.time()
            expired = [oid for oid, (_, _, t) in self.objects.items()
                         if current_time - t > CFG["processing"]["cooldown_seconds"] * 2]
            for oid in expired:
                del self.objects[oid]
            return {}

        new_objects = {}
        result = {}
        used = set()

        for (x, y, w, h) in detections:
            cx, cy = x + w // 2, y + h // 2
            best_id = None
            best_dist = float('inf')

            for oid, (ocx, ocy, ot) in self.objects.items():
                if oid in used:
                    continue
                dist = np.sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2)
                if dist < self.max_distance and dist < best_dist:
                    best_dist = dist
                    best_id = oid

            if best_id is not None:
                new_objects[best_id] = (cx, cy, time.time())
                result[best_id] = (x, y, w, h)
                used.add(best_id)
            else:
                new_objects[self.next_id] = (cx, cy, time.time())
                result[self.next_id] = (x, y, w, h)
                self.next_id += 1

        self.objects = new_objects
        return result

class PendingTasks:
    def __init__(self):
        self._lock = threading.Lock()
        self.count = 0

    def add(self):
        with self._lock:
            self.count += 1

    def done(self):
        with self._lock:
            self.count -= 1

    def pending(self) -> int:
        with self._lock:
            return self.count

# --- ASENKRON AI İŞLEYİCİ ---
class AIWorker(threading.Thread):
    def __init__(self, model_name: str, prompt: str, max_width: int,
                 result_queue: queue.Queue, pending: PendingTasks):
        super().__init__(daemon=True)
        self.model_name = model_name
        self.prompt = prompt
        self.max_width = max_width
        self.task_queue = queue.Queue()
        self.result_queue = result_queue
        self.pending = pending
        self.stop_event = threading.Event()
        self.busy = threading.Event()

    def add_task(self, frames: List[np.ndarray], timestamp: str, video_name: str, track_id: int):
        self.pending.add()
        self.task_queue.put((frames, timestamp, video_name, track_id))

    def _prepare_images(self, frames: List[np.ndarray]) -> Tuple[List[str], List[np.ndarray]]:
        temp_paths = []
        resized = []
        max_w = self.max_width
        if len(frames) > 1 and CFG["multi_frame"]["enabled"]:
            max_w = CFG["multi_frame"]["max_width"]

        for i, frame in enumerate(frames):
            h, w = frame.shape[:2]
            if w > max_w:
                ratio = max_w / w
                frame = cv2.resize(frame, (max_w, int(h * ratio)))
            path = f".temp_ai_{threading.current_thread().ident}_{int(time.time()*1000)}_{i}.jpg"
            cv2.imwrite(path, frame, [cv2.IMWRITE_JPEG_QUALITY, CFG["video"]["frame_quality"]])
            temp_paths.append(path)
            resized.append(frame)
        return temp_paths, resized

    def run(self):
        while not self.stop_event.is_set():
            try:
                frames, timestamp, video_name, track_id = self.task_queue.get(timeout=1)
            except queue.Empty:
                continue

            self.busy.set()
            temp_paths = []
            try:
                if not frames:
                    self.result_queue.put({
                        'status': 'error',
                        'timestamp': timestamp,
                        'video': video_name,
                        'track_id': track_id,
                        'result': 'AI Hatası: Bos kare listesi',
                        'frames': None,
                        'frame_count': 0,
                        'confidence': 0.0
                    })
                    continue

                temp_paths, resized = self._prepare_images(frames)
                frame_count = len(temp_paths)

                prompt = self.prompt
                if frame_count > 1:
                    prompt = (
                        f"{self.prompt}\n\n"
                        f"{frame_count} frames provided. Give ONE brief summary in Turkish."
                    )

                timeout = CFG["ai"]["timeout"]
                options = {'timeout': timeout}
                if CFG["multi_frame"]["enabled"] and frame_count > 1:
                    timeout += frame_count * CFG["multi_frame"]["timeout_per_frame"]
                    options['timeout'] = timeout
                    options['num_ctx'] = CFG["multi_frame"]["num_ctx"]

                response = ollama.chat(
                    model=self.model_name,
                    messages=[{
                        'role': 'user',
                        'content': prompt,
                        'images': temp_paths
                    }],
                    options=options
                )
                result = response['message']['content']
                result = clean_ai_result(result)
                
                # Confidence hesapla (sonuc kalitesine gore)
                confidence = 85.0  # Base confidence
                if len(result) > 50:
                    confidence += 5  # Detayli sonuc
                if 'olay:' in result.lower() or 'kisi:' in result.lower():
                    confidence += 5  # Yapili format
                if frame_count > 3:
                    confidence = min(99, confidence + 3)  # Cok kare = daha iyi
                confidence = min(99, confidence)  # Max 99%

                self.result_queue.put({
                    'status': 'success',
                    'timestamp': timestamp,
                    'video': video_name,
                    'track_id': track_id,
                    'result': result,
                    'frames': resized if CFG["video"]["save_frames"] else None,
                    'frame_count': frame_count,
                    'confidence': confidence
                })

            except Exception as e:
                self.result_queue.put({
                    'status': 'error',
                    'timestamp': timestamp,
                    'video': video_name,
                    'track_id': track_id,
                    'result': f"AI Hatası: {str(e)}",
                    'frames': None,
                    'frame_count': len(frames) if frames else 0,
                    'confidence': 15.0  # Hata durumu icin dusuk confidence
                })
            finally:
                for path in temp_paths:
                    if os.path.exists(path):
                        os.remove(path)
                self.busy.clear()
                self.pending.done()
                self.task_queue.task_done()

    def stop(self):
        self.stop_event.set()

# --- RAPOR YÖNETİCİSİ ---
class ReportManager:
    def __init__(self, output_folder: str):
        self.output_folder = Path(output_folder)
        self.output_folder.mkdir(parents=True, exist_ok=True)
        self.frames_folder = self.output_folder / "frames"
        self.frames_folder.mkdir(exist_ok=True)
        self.json_folder = self.output_folder / "json"
        self.json_folder.mkdir(exist_ok=True)
        self.results = {}  # Track data for JSON export

    def create_report(self, video_name: str) -> Path:
        timestamp = time.strftime('%Y%m%d_%H%M%S')
        safe_name = Path(video_name).stem
        report_path = self.output_folder / f"rapor_{safe_name}_{timestamp}.md"
        json_path = self.json_folder / f"rapor_{safe_name}_{timestamp}.json"
        
        self.results[str(report_path)] = {
            'video': video_name,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'model': CFG['ai']['model_name'],
            'events': [],
            'json_path': str(json_path)
        }

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f"# 📹 Video Analiz Raporu\n\n")
            f.write(f"- **Video:** `{video_name}`\n")
            f.write(f"- **Tarih:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"- **Model:** {CFG['ai']['model_name']}\n")
            mf = CFG["multi_frame"]
            if mf["enabled"]:
                f.write(f"- **Multi-Frame:** {mf['frame_count']} kare / {mf['interval_frames']} kare aralık\n")
            f.write(f"- **Hareket Eşiği:** {CFG['processing']['motion_threshold']}\n")
            f.write(f"- **ROI Kullanıldı:** Evet\n\n")
            f.write(f"## 📊 İstatistikler\n\n")
            f.write(f"*Veriler analiz sırasında güncellenecek*\n\n")
            f.write(f"| Zaman | Takip ID | Görsel | AI Analiz |\n")
            f.write(f"| :--- | :--- | :--- | :--- |\n")

        return report_path

    def _make_contact_sheet(self, frames: List[np.ndarray]) -> np.ndarray:
        thumb_h = 120
        thumbs = []
        for i, frame in enumerate(frames):
            h, w = frame.shape[:2]
            ratio = thumb_h / h
            thumb = cv2.resize(frame, (int(w * ratio), thumb_h))
            cv2.putText(thumb, str(i + 1), (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            thumbs.append(thumb)
        return np.hstack(thumbs)

    def append_result(self, report_path: Path, data: dict):
        with open(report_path, 'a', encoding='utf-8') as f:
            ts = data['timestamp']
            tid = data['track_id']
            result = data['result'].replace('\n', ' ').replace('|', '\\|')
            frame_count = data.get('frame_count', 1)
            confidence = data.get('confidence', 0.0)

            img_link = "-"
            frames = data.get('frames')
            if frames:
                safe_ts = ts.replace(':', '').replace('.', '')
                if len(frames) > 1:
                    sheet = self._make_contact_sheet(frames)
                    img_name = f"burst_{safe_ts}_id{tid}_{frame_count}f.jpg"
                else:
                    sheet = frames[0]
                    img_name = f"frame_{safe_ts}_id{tid}.jpg"
                img_path = self.frames_folder / img_name
                cv2.imwrite(str(img_path), sheet)
                img_link = f"![{frame_count} kare](frames/{img_name})"

            f.write(f"| {ts} | {tid} | {img_link} | {result} |\n")
        
        # Track event for JSON export
        report_key = str(report_path)
        if report_key in self.results:
            has_person = 'kişi: yok' not in data['result'].lower() and 'kisi: yok' not in data['result'].lower()
            self.results[report_key]['events'].append({
                'timestamp': ts,
                'track_id': tid,
                'ai_result': data['result'],
                'frame_count': frame_count,
                'confidence': round(confidence, 2),
                'has_person': has_person,
                'status': data.get('status', 'success')
            })
    
    def finalize_report(self, report_path: Path):
        """Raporu finalize et ve JSON export et."""
        report_key = str(report_path)
        if report_key not in self.results:
            return
        
        data = self.results[report_key]
        events = data['events']
        
        # İstatistikleri hesapla
        total_events = len(events)
        persons_count = sum(1 for e in events if e.get('has_person', False))
        avg_confidence = sum(e.get('confidence', 0) for e in events) / total_events if total_events > 0 else 0
        process_time = data.get('process_time', 0)
        total_frames = data.get('total_frames', 0)
        
        # JSON'a kaydet
        json_data = {
            'video': data['video'],
            'timestamp': data['timestamp'],
            'model': data['model'],
            'statistics': {
                'total_events': total_events,
                'events_with_persons': persons_count,
                'events_without_persons': total_events - persons_count,
                'avg_confidence': round(avg_confidence, 2),
                'process_time_seconds': process_time,
                'total_frames_processed': total_frames,
                'processing_speed_fps': round(total_frames / process_time, 2) if process_time > 0 else 0
            },
            'events': events
        }
        with open(data['json_path'], 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        
        print(f"[BİLGİ] JSON raporu kaydedildi: {data['json_path']}")
        print(f"        Toplamı: {total_events} olay, {persons_count} kisi mevcud, {round(avg_confidence, 1)}% ort. guvensirlik")
        print(f"        Islem suresi: {process_time:.1f}s ({json_data['statistics']['processing_speed_fps']:.1f} FPS)")

def clamp_roi(roi: Tuple[int, int, int, int], frame_h: int, frame_w: int) -> Tuple[int, int, int, int]:
    y1, y2, x1, x2 = roi
    y1 = max(0, min(y1, frame_h - 1))
    y2 = max(y1 + 1, min(y2, frame_h))
    x1 = max(0, min(x1, frame_w - 1))
    x2 = max(x1 + 1, min(x2, frame_w))
    return y1, y2, x1, x2

# --- HAREKET ALGILAMA ---
def detect_motion(frame: np.ndarray, bg_subtractor, roi: Optional[Tuple]) -> List[Tuple[int, int, int, int]]:
    if roi:
        y1, y2, x1, x2 = clamp_roi(roi, frame.shape[0], frame.shape[1])
        roi_frame = frame[y1:y2, x1:x2]
        if roi_frame.size == 0:
            return []
    else:
        roi_frame = frame
        y1 = y2 = x1 = x2 = 0

    fgmask = bg_subtractor.apply(roi_frame)
    _, fgmask = cv2.threshold(fgmask, 250, 255, cv2.THRESH_BINARY)

    # Morfolojik işlemler (gürültü temizleme)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)
    fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, kernel)

    motion_pixels = cv2.countNonZero(fgmask)
    if motion_pixels < CFG["processing"]["motion_threshold"]:
        return []

    # Kontur analizi
    contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    detections = []

    min_area = CFG["processing"]["contour_min_area"]
    max_area = CFG["processing"]["contour_max_area"]
    ar_min, ar_max = CFG["processing"]["person_aspect_ratio"]

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue

        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(h) / w if w > 0 else 0

        if CFG["processing"].get("use_aspect_ratio_filter", False):
            if not (ar_min <= aspect_ratio <= ar_max):
                continue

        if roi:
            x += x1
            y += y1
        detections.append((x, y, w, h))

    return detections

class EventGate:
    """Ayni hareketi tekrar tekrar AI'a gondermeyi engeller."""

    def __init__(self):
        self.last_global_video_sec = -999.0
        self.last_track: Dict[int, float] = {}

    def allow(self, video_sec: float, track_id: int) -> bool:
        proc = CFG["processing"]
        global_cd = proc.get("global_cooldown_seconds", 10)
        track_cd = proc.get("cooldown_seconds", 8)

        if video_sec - self.last_global_video_sec < global_cd:
            return False
        if track_id in self.last_track:
            if video_sec - self.last_track[track_id] < track_cd:
                return False
        return True

    def mark(self, video_sec: float, track_id: int):
        self.last_global_video_sec = video_sec
        self.last_track[track_id] = video_sec

def pick_primary_detection(tracked: Dict[int, Tuple[int, int, int, int]]) -> Tuple[int, Tuple[int, int, int, int]]:
    tid, bbox = max(tracked.items(), key=lambda kv: kv[1][2] * kv[1][3])
    return tid, bbox

def detect_hallucination(lines: List[str]) -> bool:
    """AI hallüsinasyon yaptı mı kontrol et: 'Kişi: yok' ama Cinsiyet/Kiyafet varsa."""
    has_no_person = False
    has_gender = False
    has_clothing = False
    has_movement = False
    
    for line in lines:
        low = line.lower()
        # "Kişi:" ve "Kisi:" ikisini de kontrol et
        if 'kişi:' in low or 'kisi:' in low:
            if 'yok' in low:
                has_no_person = True
        if 'cinsiyet:' in low:
            has_gender = True
        if 'kiyafet:' in low or 'kiyafet:' in low:
            has_clothing = True
        if 'hareket:' in low:
            has_movement = True
    
    # Eğer kişi yok ama cinsiyet/kiyafet/hareket varsa -> hallüsinasyon
    if has_no_person and (has_gender or has_clothing or has_movement):
        return True
    return False

def remove_contradictory_lines(lines: List[str]) -> List[str]:
    """Eğer 'Kişi: yok' varsa, Cinsiyet/Kiyafet/Hareket satırlarını kaldır."""
    has_no_person = False
    
    for line in lines:
        low = line.lower()
        if ('kişi:' in low or 'kisi:' in low) and 'yok' in low:
            has_no_person = True
            break
    
    if not has_no_person:
        return lines
    
    # Kişi: yok ise, person-specific fields'ı kaldır
    filtered = []
    for line in lines:
        low = line.lower()
        # Cinsiyet, Kiyafet, Hareket satırlarını atla
        if any(keyword in low for keyword in ['cinsiyet:', 'kiyafet:', 'hareket:']):
            continue
        filtered.append(line)
    
    return filtered if filtered else lines

def parse_ai_analysis(text: str) -> dict:
    """AI çıktısından yapılandırılmış veri çıkar."""
    result = {
        'events': [],
        'has_person': False,
        'gender': None,
        'clothing': [],
        'raw_text': text
    }
    
    for line in text.split('|'):
        line = line.strip().lower()
        if 'kişi:' in line or 'kisi:' in line:
            result['has_person'] = 'yok' not in line
            if 'erkek' in line:
                result['gender'] = 'erkek'
            elif 'kadın' in line or 'kadin' in line:
                result['gender'] = 'kadin'
        if 'kiyafet:' in line or 'kiyafet:' in line:
            result['clothing'].append(line.replace('kiyafet:', '').strip())
        if any(event in line for event in ['kapi açılıyor', 'kapi kapaniyor', 'kişi giriyor', 'kişi çıkıyor', 'kisi giriyor', 'kisi cikiyor']):
            result['events'].append(line)
    
    return result

def clean_ai_result(text: str) -> str:
    skip_phrases = (
        'varsa ekle', 'yoksa sadece', 'output format', 'strict rules',
        'do not repeat', 'answer in turkish', 'frame 1 is', 'if and only if',
        'clearly visible, add', 'kisi varsa', 'kisi yoksa', 'format (',
    )
    lines = []
    for line in text.replace('\r', '').split('\n'):
        line = line.strip()
        if not line:
            continue
        low = line.lower()
        if low.startswith('kare ') and ':' in line:
            continue
        if any(p in low for p in skip_phrases):
            continue
        if low.startswith('- ') and ('must' in low or 'describe only' in low):
            continue
        lines.append(line)
    
    # Hallüsinasyon kontrolü ve temizleme
    if detect_hallucination(lines):
        lines = remove_contradictory_lines(lines)
    
    if not lines:
        return text.replace('\n', ' ').strip()
    return ' | '.join(lines[:6])

def estimate_ai_events(video_path: str, roi: Optional[Tuple]) -> int:
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return 0

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    bg = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=16, detectShadows=True)
    tracker = CentroidTracker(max_distance=CFG["processing"]["tracker_max_distance"])
    gate = EventGate()
    frame_count = 0
    ai_calls = 0
    one_per_scan = CFG["processing"].get("one_event_per_scan", True)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        if frame_count % CFG["processing"]["skip_frames"] != 0:
            continue

        detections = detect_motion(frame, bg, roi)
        if not detections:
            continue

        tracked = tracker.update(detections)
        video_sec = frame_count / fps

        if one_per_scan:
            tid, _ = pick_primary_detection(tracked)
            if gate.allow(video_sec, tid):
                ai_calls += 1
                gate.mark(video_sec, tid)
        else:
            for tid in tracked:
                if gate.allow(video_sec, tid):
                    ai_calls += 1
                    gate.mark(video_sec, tid)

    cap.release()
    return ai_calls

def crop_around_bbox(frame: np.ndarray, bbox: Tuple[int, int, int, int], margin: int) -> np.ndarray:
    x, y, w, h = bbox
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(frame.shape[1], x + w + margin)
    y2 = min(frame.shape[0], y + h + margin)
    return frame[y1:y2, x1:x2].copy()

def nearest_bbox(detections: List[Tuple[int, int, int, int]], ref_bbox: Tuple[int, int, int, int]) -> Optional[Tuple[int, int, int, int]]:
    if not detections:
        return None
    rx, ry, rw, rh = ref_bbox
    rcx, rcy = rx + rw // 2, ry + rh // 2
    best, best_dist = None, float('inf')
    for det in detections:
        x, y, w, h = det
        d = np.sqrt((x + w // 2 - rcx) ** 2 + (y + h // 2 - rcy) ** 2)
        if d < best_dist:
            best_dist = d
            best = det
    return best

def capture_burst(
    cap: cv2.VideoCapture,
    start_frame: np.ndarray,
    start_bbox: Tuple[int, int, int, int],
    bg_subtractor,
    roi: Optional[Tuple],
    pbar,
) -> Tuple[List[np.ndarray], int]:
    """Hareket anından itibaren ardışık kareler topla (AI için sahte video)."""
    mf = CFG["multi_frame"]
    margin = mf["margin"]
    count = mf["frame_count"]
    interval = max(1, mf["interval_frames"])

    if not mf["enabled"] or count <= 1:
        return [crop_around_bbox(start_frame, start_bbox, margin)], 0

    frames = [crop_around_bbox(start_frame, start_bbox, margin)]
    ref_bbox = start_bbox
    extra_reads = 0

    for _ in range(count - 1):
        for _ in range(interval - 1):
            ret, _ = cap.read()
            extra_reads += 1
            if pbar:
                pbar.update(1)
            if not ret:
                return frames, extra_reads

        ret, frame = cap.read()
        extra_reads += 1
        if pbar:
            pbar.update(1)
        if not ret:
            break

        detections = detect_motion(frame, bg_subtractor, roi)
        bbox = nearest_bbox(detections, ref_bbox) or ref_bbox
        ref_bbox = bbox
        frames.append(crop_around_bbox(frame, bbox, margin))

    return frames, extra_reads

# --- ANA İŞLEM ---
def process_video(video_path: str, roi: Optional[Tuple], report_mgr: ReportManager, 
                  ai_workers: List[AIWorker], result_queue: queue.Queue) -> Path:
    
    process_start_time = time.time()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[HATA] Video açılamadı: {video_path}")
        return None

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        fps = 25.0  # Varsayılan

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    bg_subtractor = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=16, detectShadows=True)
    tracker = CentroidTracker(max_distance=CFG["processing"]["tracker_max_distance"])
    gate = EventGate()
    one_per_scan = CFG["processing"].get("one_event_per_scan", True)

    video_name = Path(video_path).name
    report_path = report_mgr.create_report(video_name)

    print(f"\n[İŞLEM] {video_name} başlatılıyor...")
    print(f"        FPS: {fps:.1f}, Toplam Kare: {total_frames}, ROI: {roi if roi else 'Tam Ekran'}")

    frame_count = 0
    processed = 0
    pbar = tqdm(total=total_frames, desc=video_name[:20]) if tqdm else None

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            if pbar:
                pbar.update(1)

            if frame_count % CFG["processing"]["skip_frames"] != 0:
                continue

            detections = detect_motion(frame, bg_subtractor, roi)
            if not detections:
                continue

            tracked = tracker.update(detections)
            video_sec = frame_count / fps

            if one_per_scan:
                candidates = [pick_primary_detection(tracked)]
            else:
                candidates = list(tracked.items())

            for tid, (x, y, w, h) in candidates:
                if not gate.allow(video_sec, tid):
                    continue

                bbox = (x, y, w, h)
                timestamp = str(timedelta(seconds=int(video_sec)))

                burst_frames, extra_reads = capture_burst(
                    cap, frame, bbox, bg_subtractor, roi, pbar
                )
                frame_count += extra_reads

                worker = ai_workers[processed % len(ai_workers)]
                worker.add_task(burst_frames, timestamp, video_name, tid)
                processed += 1
                gate.mark(video_sec, tid)

                n = len(burst_frames)
                print(f"  [{timestamp}] olay #{processed} -> {n} kare AI kuyruguna eklendi")
                break

    finally:
        cap.release()
        process_duration = time.time() - process_start_time
        report_mgr.results[str(report_path)]['process_time'] = round(process_duration, 2)
        report_mgr.results[str(report_path)]['total_frames'] = total_frames
        if pbar:
            pbar.close()

    return report_path

def main():
    main_start_time = time.time()
    print("=" * 60)
    print("  AKILLI KAMERA ARŞİV ANALİZ SİSTEMİ v2.0")
    print("=" * 60)

    # Ollama kontrolü
    try:
        ollama.list()
    except Exception as e:
        print(f"[HATA] Ollama bağlantısı kurulamadı: {e}")
        print("        Ollama'nın çalıştığından emin olun: 'ollama serve' komutunu çalıştırın")
        return

    # Model kontrolü
    model = CFG["ai"]["model_name"]
    try:
        ollama.show(model)
        print(f"[BİLGİ] Model hazır: {model}")
    except Exception as e:
        print(f"[UYARI] {model} bulunamadı!")
        print(f"        Komut: ollama pull {model}")
        return

    # Klasörleri hazırla
    try:
        input_folder = Path(CFG["video"]["input_folder"])
        output_folder = Path(CFG["video"]["output_folder"])
        input_folder.mkdir(exist_ok=True)
        output_folder.mkdir(exist_ok=True)
        print(f"[BİLGİ] Klasörler hazır: {input_folder}, {output_folder}")
    except Exception as e:
        print(f"[HATA] Klasör oluşturulamadı: {e}")
        return

    # Videoları bul (büyük/küçük harf duyarsız)
    exclude = CFG["video"].get("exclude_prefixes", ["test_", "_"])
    videos = []
    seen = set()
    for ext in CFG["video"]["extensions"]:
        ext = ext if ext.startswith(".") else f".{ext}"
        for pattern in (f"*{ext}", f"*{ext.upper()}"):
            for path in input_folder.glob(pattern):
                if path in seen:
                    continue
                if any(path.name.startswith(p) for p in exclude):
                    seen.add(path)
                    continue
                seen.add(path)
                videos.append(path)

    if not videos:
        print(f"[HATA] Video bulunamadı: {input_folder}")
        print("        Videoları ./videos klasörüne koyun veya config.json'daki input_folder'u güncelleyin.")
        return

    videos = prompt_video_selection(videos)

    # ROI sec (secilen videonun ilk karesinden)
    roi = prompt_roi_selection(videos[0])

    total_est = 0
    for vp in videos:
        est = estimate_ai_events(str(vp), roi)
        total_est += est
        print(f"[TESHIS] {vp.name}: tahmini {est} AI analizi")
    if total_est == 0:
        print("[UYARI] Secilen alanda hareket bulunamadi. ROI veya video secimini kontrol edin.")

    # AI Worker'ları başlat
    result_queue = queue.Queue()
    pending_tasks = PendingTasks()
    ai_workers = []
    for i in range(CFG["ai"]["workers"]):
        worker = AIWorker(
            CFG["ai"]["model_name"],
            CFG["ai"]["prompt"],
            CFG["ai"]["max_width"],
            result_queue,
            pending_tasks
        )
        worker.start()
        ai_workers.append(worker)

    print(f"[BİLGİ] {len(ai_workers)} AI worker başlatıldı.")
    mf = CFG["multi_frame"]
    if mf["enabled"]:
        span = mf["frame_count"] * mf["interval_frames"]
        print(f"[BİLGİ] Multi-frame aktif: olay başına {mf['frame_count']} kare (~{span} kare aralığı)")

    # Rapor yöneticisi
    report_mgr = ReportManager(str(output_folder))
    active_reports = {}
    total_results = 0

    try:
        # Videoları işle
        for video_path in videos:
            report_path = process_video(str(video_path), roi, report_mgr, ai_workers, result_queue)
            if report_path:
                active_reports[video_path] = report_path

        # Kalan AI sonuçlarını bekle
        print("\n[BİLGİ] AI analizleri tamamlanıyor...")
        if pending_tasks.pending() > 0:
            print(f"  [...] {pending_tasks.pending()} olay AI tarafindan isleniyor (kare basina ~15-30 sn)...")

        def handle_result(result: dict):
            nonlocal total_results
            total_results += 1
            video_name = result['video']
            for vp, rp in active_reports.items():
                if Path(vp).name == video_name:
                    report_mgr.append_result(rp, result)
                    break
            status_icon = "[OK]" if result['status'] == 'success' else "[HATA]"
            summary = result['result'].replace(' | ', ' / ')
            print(f"  {status_icon} [{result['timestamp']}] {summary}")

        while pending_tasks.pending() > 0 or not result_queue.empty():
            try:
                handle_result(result_queue.get(timeout=3))
            except queue.Empty:
                if pending_tasks.pending() > 0:
                    print(f"  [...] Bekleniyor... ({pending_tasks.pending()} olay kuyrukta/isleniyor, {total_results} tamamlandi)")
                else:
                    break

        # Gecikmeli gelen son sonuclar
        while True:
            try:
                handle_result(result_queue.get_nowait())
            except queue.Empty:
                break

    except KeyboardInterrupt:
        print("\n[!] Kullanıcı tarafından durduruldu.")

    finally:
        # Worker'ları durdur
        for w in ai_workers:
            w.stop()
        for w in ai_workers:
            w.join(timeout=180)

        # Raporları finalize et
        for vp, rp in active_reports.items():
            report_mgr.finalize_report(rp)

        print("\n" + "=" * 60)
        print("  ANALİZ TAMAMLANDI")
        print("=" * 60)
        print(f"Raporlar: {output_folder}")
        for vp, rp in active_reports.items():
            print(f"  - {Path(vp).name} -> {rp.name}")
        
        total_time = time.time() - main_start_time
        print(f"\nToplam {total_results} olay analiz edildi.")
        print(f"Toplam işlem süresi: {int(total_time)}s ({int(total_time/60)}m {int(total_time%60)}s)")

if __name__ == "__main__":
    main()
