#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart Camera - Ana Uygulama Launcher
Modern GUI ile video analiz başlatıcı
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import json
import subprocess
import threading
from pathlib import Path
import os

# Modern renkler
COLORS = {
    'primary': '#2196F3',
    'primary_dark': '#1565C0',
    'success': '#4CAF50',
    'warning': '#FF9800',
    'error': '#F44336',
    'bg': '#F5F5F5',
    'card': '#FFFFFF',
    'text': '#212121',
    'text_secondary': '#757575',
}

class SmartCameraApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title('🎥 Akıllı Kamera')
        
        # Pencere
        width, height = 1000, 700
        x = (self.root.winfo_screenwidth() - width) // 2
        y = (self.root.winfo_screenheight() - height) // 2
        self.root.geometry(f'{width}x{height}+{x}+{y}')
        self.root.configure(bg=COLORS['bg'])
        
        self.process = None
        self.load_config()
        self.setup_ui()
    
    def load_config(self):
        """Config yükle"""
        try:
            with open('config.json', 'r', encoding='utf-8') as f:
                self.config = json.load(f)
        except:
            self.config = {
                'input_folder': str(Path.cwd() / 'videos'),
                'output_folder': str(Path.cwd() / 'raporlar')
            }
    
    def setup_ui(self):
        """UI oluştur"""
        # Header
        header = tk.Frame(self.root, bg=COLORS['primary'], height=100)
        header.pack(fill=tk.X)
        header.pack_propagate(False)
        
        title_frame = tk.Frame(header, bg=COLORS['primary'])
        title_frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)
        
        tk.Label(title_frame, text='🎥', font=('Segoe UI', 40), 
                bg=COLORS['primary'], fg='white').pack(side=tk.LEFT, padx=15)
        
        title_text = tk.Frame(title_frame, bg=COLORS['primary'])
        title_text.pack(side=tk.LEFT)
        
        tk.Label(title_text, text='AKILLI KAMERA', 
                font=('Segoe UI', 24, 'bold'),
                bg=COLORS['primary'], fg='white').pack(anchor=tk.W)
        
        tk.Label(title_text, text='Video Analiz Sistemi', 
                font=('Segoe UI', 11),
                bg=COLORS['primary'], fg='white').pack(anchor=tk.W)
        
        # Ana içerik
        main = tk.Frame(self.root, bg=COLORS['bg'])
        main.pack(fill=tk.BOTH, expand=True, padx=30, pady=30)
        
        # Sol panel - Kontroller
        left = tk.Frame(main, bg=COLORS['card'], width=400)
        left.pack(side=tk.LEFT, fill=tk.BOTH, padx=(0, 15))
        left.pack_propagate(False)
        
        # Başlık
        tk.Label(left, text='📹 Video Analizi', 
                font=('Segoe UI', 16, 'bold'),
                bg=COLORS['card'], fg=COLORS['text']).pack(pady=20, padx=20, anchor=tk.W)
        
        # Klasör bilgileri
        info_frame = tk.LabelFrame(left, text='Klasörler', 
                                   font=('Segoe UI', 10, 'bold'),
                                   bg=COLORS['card'], fg=COLORS['text'],
                                   padx=15, pady=15)
        info_frame.pack(fill=tk.X, padx=20, pady=10)
        
        tk.Label(info_frame, text=f"📁 Videolar:\n{self.config['input_folder']}", 
                font=('Segoe UI', 9),
                bg=COLORS['card'], fg=COLORS['text_secondary'],
                justify=tk.LEFT).pack(anchor=tk.W, pady=5)
        
        tk.Label(info_frame, text=f"📝 Raporlar:\n{self.config['output_folder']}", 
                font=('Segoe UI', 9),
                bg=COLORS['card'], fg=COLORS['text_secondary'],
                justify=tk.LEFT).pack(anchor=tk.W, pady=5)
        
        # Video sayısı
        video_count = len(list(Path(self.config['input_folder']).glob('*.mp4'))) if Path(self.config['input_folder']).exists() else 0
        
        count_frame = tk.Frame(left, bg=COLORS['card'])
        count_frame.pack(fill=tk.X, padx=20, pady=20)
        
        tk.Label(count_frame, text=str(video_count), 
                font=('Segoe UI', 36, 'bold'),
                bg=COLORS['card'], fg=COLORS['primary']).pack()
        
        tk.Label(count_frame, text='video tespit edildi', 
                font=('Segoe UI', 10),
                bg=COLORS['card'], fg=COLORS['text_secondary']).pack()
        
        # Butonlar
        btn_frame = tk.Frame(left, bg=COLORS['card'])
        btn_frame.pack(fill=tk.X, padx=20, pady=20)
        
        self.start_btn = tk.Button(btn_frame, 
                                   text='▶ ANALİZİ BAŞLAT',
                                   command=self.start_analysis,
                                   bg=COLORS['success'], fg='white',
                                   font=('Segoe UI', 12, 'bold'),
                                   relief=tk.FLAT, padx=30, pady=15,
                                   cursor='hand2')
        self.start_btn.pack(fill=tk.X, pady=5)
        
        self.stop_btn = tk.Button(btn_frame, 
                                  text='⏹ DURDUR',
                                  command=self.stop_analysis,
                                  bg=COLORS['error'], fg='white',
                                  font=('Segoe UI', 12, 'bold'),
                                  relief=tk.FLAT, padx=30, pady=15,
                                  cursor='hand2',
                                  state=tk.DISABLED)
        self.stop_btn.pack(fill=tk.X, pady=5)
        
        tk.Button(btn_frame, 
                 text='⚙️ AYARLAR',
                 command=self.open_settings,
                 bg=COLORS['card'], fg=COLORS['text'],
                 font=('Segoe UI', 10),
                 relief=tk.SOLID, bd=1,
                 padx=20, pady=10,
                 cursor='hand2').pack(fill=tk.X, pady=5)
        
        tk.Button(btn_frame, 
                 text='📂 RAPORLARI AÇ',
                 command=self.open_reports,
                 bg=COLORS['card'], fg=COLORS['text'],
                 font=('Segoe UI', 10),
                 relief=tk.SOLID, bd=1,
                 padx=20, pady=10,
                 cursor='hand2').pack(fill=tk.X, pady=5)
        
        # Sağ panel - Log ve Chat
        right = tk.Frame(main, bg=COLORS['bg'])
        right.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Notebook (tabs)
        notebook = ttk.Notebook(right)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        # Tab 1: Log
        log_tab = tk.Frame(notebook, bg=COLORS['card'])
        notebook.add(log_tab, text='📊 Analiz Günlüğü')
        
        tk.Label(log_tab, text='📊 Analiz Günlüğü', 
                font=('Segoe UI', 16, 'bold'),
                bg=COLORS['card'], fg=COLORS['text']).pack(pady=20, padx=20, anchor=tk.W)
        
        # Log area
        log_frame = tk.Frame(log_tab, bg=COLORS['card'])
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        
        self.log_text = scrolledtext.ScrolledText(log_frame,
                                                  font=('Consolas', 9),
                                                  bg='#1E1E1E', fg='#D4D4D4',
                                                  relief=tk.FLAT,
                                                  wrap=tk.WORD)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # Sağ tık menüsü
        self.log_menu = tk.Menu(self.log_text, tearoff=0)
        self.log_menu.add_command(label="📋 Tümünü Kopyala", command=self.copy_all_log)
        self.log_menu.add_command(label="📋 Seçileni Kopyala", command=self.copy_selected_log)
        self.log_menu.add_separator()
        self.log_menu.add_command(label="🗑️ Temizle", command=self.clear_log)
        
        self.log_text.bind("<Button-3>", self.show_log_menu)
        
        # Tab 2: AI Özeti
        chat_tab = tk.Frame(notebook, bg=COLORS['card'])
        notebook.add(chat_tab, text='🤖 AI Özeti')
        
        tk.Label(chat_tab, text='🤖 AI Analiz Özeti', 
                font=('Segoe UI', 16, 'bold'),
                bg=COLORS['card'], fg=COLORS['text']).pack(pady=20, padx=20, anchor=tk.W)
        
        # Özet bilgisi
        self.summary_frame = tk.Frame(chat_tab, bg=COLORS['primary_light'], relief=tk.FLAT)
        self.summary_frame.pack(fill=tk.X, padx=20, pady=10)
        
        self.summary_label = tk.Label(self.summary_frame, 
                                      text='Henüz analiz yapılmadı', 
                                      font=('Segoe UI', 10),
                                      fg=COLORS['text'], bg=COLORS['primary_light'],
                                      justify=tk.LEFT)
        self.summary_label.pack(padx=15, pady=15, anchor=tk.W)
        
        # Chat area
        chat_frame = tk.Frame(chat_tab, bg=COLORS['card'])
        chat_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        
        self.chat_text = scrolledtext.ScrolledText(chat_frame,
                                                   font=('Segoe UI', 10),
                                                   bg='white', fg=COLORS['text'],
                                                   relief=tk.FLAT,
                                                   wrap=tk.WORD,
                                                   padx=10, pady=10)
        self.chat_text.pack(fill=tk.BOTH, expand=True)
        
        # İlk mesaj
        self.log("🎥 Akıllı Kamera hazır!")
        self.log(f"📁 {video_count} video bulundu")
        self.log("▶ Analizi başlatmak için 'ANALİZİ BAŞLAT' butonuna tıklayın\n")
    
    def log(self, message):
        """Log mesajı ekle"""
        self.log_text.insert(tk.END, message + '\n')
        self.log_text.see(tk.END)
        self.root.update()
    
    def show_log_menu(self, event):
        """Sağ tık menüsünü göster"""
        try:
            self.log_menu.tk_popup(event.x_root, event.y_root)
        finally:
            self.log_menu.grab_release()
    
    def copy_all_log(self):
        """Tüm log'u kopyala"""
        log_content = self.log_text.get('1.0', tk.END)
        self.root.clipboard_clear()
        self.root.clipboard_append(log_content)
        self.log("\n✅ Tüm log kopyalandı!")
    
    def copy_selected_log(self):
        """Seçili log'u kopyala"""
        try:
            selected = self.log_text.get(tk.SEL_FIRST, tk.SEL_LAST)
            self.root.clipboard_clear()
            self.root.clipboard_append(selected)
            self.log("\n✅ Seçili metin kopyalandı!")
        except tk.TclError:
            messagebox.showinfo('Bilgi', 'Önce kopyalanacak metni seçin!')
    
    def clear_log(self):
        """Log'u temizle"""
        if messagebox.askyesno('Onay', 'Log günlüğünü temizlemek istediğinize emin misiniz?'):
            self.log_text.delete('1.0', tk.END)
            self.log("🎥 Log temizlendi\n")
    
    def generate_summary(self):
        """Analiz özetini oluştur ve göster"""
        try:
            # Son JSON raporunu bul
            json_folder = Path(self.config['output_folder']) / 'json'
            if not json_folder.exists():
                return
            
            json_files = list(json_folder.glob('rapor_*.json'))
            if not json_files:
                return
            
            # En son raporu al
            latest_report = max(json_files, key=lambda p: p.stat().st_mtime)
            
            with open(latest_report, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Özet bilgi
            total_events = data.get('summary', {}).get('total_events', 0)
            total_people = data.get('summary', {}).get('total_tracks', 0)
            
            summary_text = f"📹 Video: {data.get('video_name', 'Bilinmiyor')}\n"
            summary_text += f"⏱️ Süre: {data.get('video_duration', 'Bilinmiyor')}\n"
            summary_text += f"🎯 Tespit: {total_events} olay, {total_people} kişi/nesne\n"
            
            search_prompt = self.config.get('search_prompt', '')
            if search_prompt:
                summary_text += f"🔍 Arama: {search_prompt}\n"
            
            self.summary_label.config(text=summary_text)
            
            # Chat'e olayları ekle
            self.chat_text.delete('1.0', tk.END)
            
            self.chat_text.insert(tk.END, f"{'='*60}\n", 'header')
            self.chat_text.insert(tk.END, "🤖 AI ANALİZ ÖZETİ\n", 'header')
            self.chat_text.insert(tk.END, f"{'='*60}\n\n", 'header')
            
            if total_events == 0:
                self.chat_text.insert(tk.END, "✅ ", 'success')
                if search_prompt:
                    self.chat_text.insert(tk.END, f"'{search_prompt}' ile ilgili hiçbir şey bulunamadı.\n\n")
                else:
                    self.chat_text.insert(tk.END, "Şüpheli bir durum tespit edilmedi.\n\n")
            else:
                self.chat_text.insert(tk.END, f"📊 Toplam {total_events} olay tespit edildi:\n\n", 'bold')
                
                for event in data.get('events', []):
                    timestamp = event.get('timestamp', 'Bilinmiyor')
                    description = event.get('description', 'Açıklama yok')
                    confidence = event.get('confidence', 0)
                    
                    self.chat_text.insert(tk.END, f"⏰ {timestamp}\n", 'time')
                    self.chat_text.insert(tk.END, f"   {description}\n")
                    if confidence > 0:
                        self.chat_text.insert(tk.END, f"   Güven: %{confidence:.1f}\n", 'confidence')
                    self.chat_text.insert(tk.END, "\n")
            
            # Tag stilleri
            self.chat_text.tag_config('header', foreground=COLORS['primary'], font=('Segoe UI', 10, 'bold'))
            self.chat_text.tag_config('bold', font=('Segoe UI', 10, 'bold'))
            self.chat_text.tag_config('time', foreground=COLORS['success'], font=('Segoe UI', 9, 'bold'))
            self.chat_text.tag_config('confidence', foreground=COLORS['text_secondary'], font=('Segoe UI', 8))
            self.chat_text.tag_config('success', foreground=COLORS['success'], font=('Segoe UI', 11, 'bold'))
            
        except Exception as e:
            self.chat_text.delete('1.0', tk.END)
            self.chat_text.insert(tk.END, f"❌ Özet oluşturulamadı:\n{e}")
    
    def start_analysis(self):
        """Analizi başlat"""
        if not Path(self.config['input_folder']).exists():
            messagebox.showerror('Hata', 'Video klasörü bulunamadı!')
            return
        
        videos = list(Path(self.config['input_folder']).glob('*.mp4'))
        if not videos:
            messagebox.showwarning('Uyarı', 'Video klasöründe MP4 dosyası bulunamadı!')
            return
        
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        
        self.log("\n" + "="*60)
        self.log("🚀 ANALİZ BAŞLADI")
        self.log("="*60)
        
        # Thread'de analiz başlat
        thread = threading.Thread(target=self.run_analysis, daemon=True)
        thread.start()
    
    def run_analysis(self):
        """Analiz çalıştır"""
        try:
            self.log("📹 analyze_video_v2.py çalıştırılıyor...\n")
            
            # Otomatik mod için environment variable
            env = os.environ.copy()
            env['AUTO_MODE'] = '1'  # Otomatik mod bayrağı
            
            # Python script çalıştır
            self.process = subprocess.Popen(
                ['python', 'analyze_video_v2.py', '--auto'],  # --auto parametresi
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                stdin=subprocess.DEVNULL,  # Input engelle
                text=True,
                bufsize=1,
                cwd=os.getcwd(),
                env=env
            )
            
            # Output'u oku
            for line in self.process.stdout:
                self.log(line.rstrip())
            
            self.process.wait()
            
            if self.process.returncode == 0:
                self.log("\n" + "="*60)
                self.log("✅ ANALİZ TAMAMLANDI!")
                self.log("="*60)
                self.log(f"📝 Raporlar: {self.config['output_folder']}\n")
                
                # AI özetini oluştur ve göster
                self.generate_summary()
                
                messagebox.showinfo('Başarılı', 'Video analizi tamamlandı!\n\n🤖 AI Özeti sekmesine bakın.')
            else:
                self.log("\n❌ Analiz sırasında hata oluştu!")
                messagebox.showerror('Hata', 'Analiz başarısız oldu!')
        
        except Exception as e:
            self.log(f"\n❌ HATA: {e}")
            messagebox.showerror('Hata', f'Analiz hatası:\n{e}')
        
        finally:
            self.start_btn.config(state=tk.NORMAL)
            self.stop_btn.config(state=tk.DISABLED)
            self.process = None
    
    def stop_analysis(self):
        """Analizi durdur"""
        if self.process:
            self.process.terminate()
            self.log("\n⏹ Analiz durduruldu\n")
            self.start_btn.config(state=tk.NORMAL)
            self.stop_btn.config(state=tk.DISABLED)
    
    def open_settings(self):
        """Ayarları aç"""
        subprocess.Popen(['pythonw', 'setup_wizard_modern.py'])
    
    def open_reports(self):
        """Rapor klasörünü aç"""
        if Path(self.config['output_folder']).exists():
            os.startfile(self.config['output_folder'])
        else:
            messagebox.showwarning('Uyarı', 'Rapor klasörü henüz oluşturulmamış!')
    
    def run(self):
        """Uygulamayı başlat"""
        self.root.mainloop()

if __name__ == '__main__':
    app = SmartCameraApp()
    app.run()
