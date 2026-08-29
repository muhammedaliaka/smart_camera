#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart Camera - Modern Setup Wizard
Profesyonel ve şık kurulum arayüzü
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
from pathlib import Path

# Modern renk paleti
COLORS = {
    'primary': '#2196F3',
    'primary_dark': '#1565C0',
    'primary_light': '#BBDEFB',
    'success': '#4CAF50',
    'warning': '#FF9800',
    'bg': '#F5F5F5',
    'card': '#FFFFFF',
    'text': '#212121',
    'text_secondary': '#757575',
    'border': '#E0E0E0'
}

class ModernButton(tk.Canvas):
    """Modern flat button"""
    def __init__(self, parent, text, command, bg=COLORS['primary'], fg='white', **kwargs):
        super().__init__(parent, highlightthickness=0, **kwargs)
        self.command = command
        self.text = text
        self.bg = bg
        self.fg = fg
        self.hover_bg = COLORS['primary_dark']
        
        self.config(width=120, height=40, bg=bg, cursor='hand2')
        
        # Text
        self.text_id = self.create_text(60, 20, text=text, fill=fg, 
                                        font=('Segoe UI', 10, 'bold'))
        
        # Bindings
        self.bind('<Button-1>', lambda e: self.command())
        self.bind('<Enter>', self.on_enter)
        self.bind('<Leave>', self.on_leave)
    
    def on_enter(self, e):
        self.config(bg=self.hover_bg)
    
    def on_leave(self, e):
        self.config(bg=self.bg)

class ModernCard(tk.Frame):
    """Modern card container"""
    def __init__(self, parent, **kwargs):
        super().__init__(parent, bg=COLORS['card'], relief=tk.FLAT, **kwargs)
        self.config(highlightbackground=COLORS['border'], 
                   highlightthickness=1, padx=20, pady=20)

class ModernSetupWizard:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title('Akıllı Kamera Kurulum')
        
        # Pencere boyutu ve pozisyon
        width, height = 900, 650
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width - width) // 2
        y = (screen_height - height) // 2
        self.root.geometry(f'{width}x{height}+{x}+{y}')
        self.root.resizable(False, False)
        self.root.configure(bg=COLORS['bg'])
        
        self.current_page = 0
        self.pages = [
            self.page_welcome,
            self.page_folders,
            self.page_ai_setup,      # YENİ: AI seçimi
            self.page_search_setup,  # YENİ: Arama kriteri
            self.page_settings,
            self.page_complete
        ]
        
        # Config değişkenleri
        self.config_vars = {
            'input_folder': tk.StringVar(value=str(Path.cwd() / 'videos')),
            'output_folder': tk.StringVar(value=str(Path.cwd() / 'raporlar')),
            'skip_frames': tk.StringVar(value='5'),
            'motion_threshold': tk.StringVar(value='1200'),
            'cooldown': tk.StringVar(value='8'),
            'model_name': tk.StringVar(value='qwen2.5vl:3b'),
            'workers': tk.StringVar(value='2'),
            'timeout': tk.StringVar(value='60'),
            'enable_multiframe': tk.BooleanVar(value=True),
            'frame_count': tk.StringVar(value='6'),
            'interval_frames': tk.StringVar(value='5'),
            'search_prompt': tk.StringVar(value=''),  # Kullanıcı arama kriteri
            'auto_install_ollama': tk.BooleanVar(value=False)  # Ollama otomatik kurulum
        }
        
        self.setup_ui()
        self.show_page()
    
    def setup_ui(self):
        """Ana UI yapısı"""
        # Header - Gradient arkaplan simülasyonu
        header = tk.Frame(self.root, bg=COLORS['primary'], height=80)
        header.pack(fill=tk.X)
        header.pack_propagate(False)
        
        # Logo ve başlık
        title_frame = tk.Frame(header, bg=COLORS['primary'])
        title_frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)
        
        tk.Label(title_frame, text='🎥', font=('Segoe UI', 32), 
                bg=COLORS['primary'], fg='white').pack(side=tk.LEFT, padx=10)
        
        tk.Label(title_frame, text='AKILLI KAMERA', 
                font=('Segoe UI', 20, 'bold'),
                bg=COLORS['primary'], fg='white').pack(side=tk.LEFT)
        
        # Progress bar
        self.progress_frame = tk.Frame(self.root, bg=COLORS['bg'], height=8)
        self.progress_frame.pack(fill=tk.X)
        self.progress_frame.pack_propagate(False)
        
        self.progress_bar = tk.Canvas(self.progress_frame, bg=COLORS['border'], 
                                     height=8, highlightthickness=0)
        self.progress_bar.pack(fill=tk.BOTH)
        
        # Content area
        self.content = tk.Frame(self.root, bg=COLORS['bg'])
        self.content.pack(fill=tk.BOTH, expand=True, padx=30, pady=30)
        
        # Footer - Navigation
        footer = tk.Frame(self.root, bg=COLORS['card'], height=70)
        footer.pack(fill=tk.X, side=tk.BOTTOM)
        footer.pack_propagate(False)
        
        # Footer içeriği
        footer_content = tk.Frame(footer, bg=COLORS['card'])
        footer_content.pack(fill=tk.BOTH, padx=30, pady=15)
        
        # Butonlar
        self.btn_back = tk.Button(footer_content, text='◀ Geri', 
                                  command=self.prev_page,
                                  bg=COLORS['bg'], fg=COLORS['text'],
                                  font=('Segoe UI', 10), relief=tk.FLAT,
                                  padx=20, pady=10, cursor='hand2',
                                  activebackground=COLORS['border'])
        self.btn_back.pack(side=tk.LEFT)
        
        self.btn_next = tk.Button(footer_content, text='İleri ▶', 
                                 command=self.next_page,
                                 bg=COLORS['primary'], fg='white',
                                 font=('Segoe UI', 10, 'bold'), relief=tk.FLAT,
                                 padx=30, pady=10, cursor='hand2',
                                 activebackground=COLORS['primary_dark'])
        self.btn_next.pack(side=tk.RIGHT)
        
        # Sayfa numarası
        self.page_label = tk.Label(footer_content, text='', 
                                   font=('Segoe UI', 9),
                                   fg=COLORS['text_secondary'], bg=COLORS['card'])
        self.page_label.pack(side=tk.RIGHT, padx=20)
    
    def update_progress(self):
        """Progress bar güncelle"""
        progress = (self.current_page / (len(self.pages) - 1)) * 100
        self.progress_bar.delete('all')
        self.progress_bar.create_rectangle(0, 0, 
                                          self.progress_bar.winfo_width() * progress / 100, 
                                          8, fill=COLORS['success'], width=0)
    
    def show_page(self):
        """Sayfayı göster"""
        # Content temizle
        for widget in self.content.winfo_children():
            widget.destroy()
        
        # Sayfa göster
        self.pages[self.current_page]()
        
        # Butonları güncelle
        self.btn_back.config(state=tk.NORMAL if self.current_page > 0 else tk.DISABLED)
        
        if self.current_page == len(self.pages) - 1:
            self.btn_next.config(text='Kapat', command=self.root.quit)
        else:
            self.btn_next.config(text='İleri ▶', command=self.next_page)
        
        # Sayfa numarası
        self.page_label.config(text=f'Sayfa {self.current_page + 1} / {len(self.pages)}')
        
        # Progress bar
        self.root.update_idletasks()
        self.update_progress()
    
    def next_page(self):
        """Sonraki sayfa"""
        if self.validate_current_page():
            if self.current_page < len(self.pages) - 1:
                self.current_page += 1
                self.show_page()
    
    def prev_page(self):
        """Önceki sayfa"""
        if self.current_page > 0:
            self.current_page -= 1
            self.show_page()
    
    def validate_current_page(self):
        """Mevcut sayfa doğrulama"""
        if self.current_page == 1:  # Folders page
            if not self.config_vars['input_folder'].get():
                messagebox.showerror('Hata', 'Lütfen video klasörünü seçin!')
                return False
            if not self.config_vars['output_folder'].get():
                messagebox.showerror('Hata', 'Lütfen rapor klasörünü seçin!')
                return False
        
        if self.current_page == 2:  # Settings page
            try:
                # Değerleri kontrol et
                int(self.config_vars['skip_frames'].get())
                int(self.config_vars['motion_threshold'].get())
                int(self.config_vars['cooldown'].get())
                int(self.config_vars['workers'].get())
                int(self.config_vars['timeout'].get())
                int(self.config_vars['frame_count'].get())
                int(self.config_vars['interval_frames'].get())
            except ValueError:
                messagebox.showerror('Hata', 'Lütfen geçerli sayılar girin!')
                return False
            
            # Config kaydet
            return self.save_config()
        
        return True
    
    def page_welcome(self):
        """Karşılama sayfası"""
        # Ana card
        card = ModernCard(self.content)
        card.place(relx=0.5, rely=0.5, anchor=tk.CENTER, width=700, height=450)
        
        # Icon
        tk.Label(card, text='🎥', font=('Segoe UI', 80), 
                bg=COLORS['card']).pack(pady=30)
        
        # Başlık
        tk.Label(card, text='Hoş Geldiniz!', 
                font=('Segoe UI', 24, 'bold'),
                fg=COLORS['text'], bg=COLORS['card']).pack(pady=10)
        
        # Açıklama
        desc = """Akıllı Kamera videoları otomatik olarak izler ve
içlerindeki olayları size raporlar.

Kurulum sadece 3 adımda tamamlanacak!"""
        
        tk.Label(card, text=desc, font=('Segoe UI', 12),
                fg=COLORS['text_secondary'], bg=COLORS['card'],
                justify=tk.CENTER).pack(pady=20)
        
        # Özellikler
        features_frame = tk.Frame(card, bg=COLORS['card'])
        features_frame.pack(pady=30)
        
        features = [
            ('📹', 'Videoları otomatik tarar'),
            ('🤖', 'Yapay zeka ile analiz eder'),
            ('📝', 'Detaylı raporlar oluşturur')
        ]
        
        for icon, text in features:
            f = tk.Frame(features_frame, bg=COLORS['card'])
            f.pack(pady=8)
            
            tk.Label(f, text=icon, font=('Segoe UI', 16),
                    bg=COLORS['card']).pack(side=tk.LEFT, padx=10)
            
            tk.Label(f, text=text, font=('Segoe UI', 11),
                    fg=COLORS['text'], bg=COLORS['card']).pack(side=tk.LEFT)
    
    def page_folders(self):
        """Klasör seçimi"""
        # Başlık
        tk.Label(self.content, text='Klasörleri Seçin', 
                font=('Segoe UI', 18, 'bold'),
                fg=COLORS['text'], bg=COLORS['bg']).pack(pady=20)
        
        # Card
        card = ModernCard(self.content)
        card.pack(fill=tk.BOTH, expand=True)
        
        # Video klasörü
        self.create_folder_row(card, '📹 Videolarım nerede?', 
                              self.config_vars['input_folder'])
        
        tk.Frame(card, height=30, bg=COLORS['card']).pack()
        
        # Rapor klasörü
        self.create_folder_row(card, '📝 Raporlar nereye kaydedilsin?', 
                              self.config_vars['output_folder'])
        
        # Bilgi
        info_frame = tk.Frame(card, bg=COLORS['primary_light'])
        info_frame.pack(fill=tk.X, pady=20, padx=0)
        
        tk.Label(info_frame, text='💡 İpucu: Klasörler yoksa otomatik oluşturulacak', 
                font=('Segoe UI', 9), fg=COLORS['text_secondary'],
                bg=COLORS['primary_light']).pack(pady=10)
    
    def create_folder_row(self, parent, label_text, var):
        """Klasör seçim satırı"""
        frame = tk.Frame(parent, bg=COLORS['card'])
        frame.pack(fill=tk.X, pady=10)
        
        # Label
        tk.Label(frame, text=label_text, font=('Segoe UI', 11, 'bold'),
                fg=COLORS['text'], bg=COLORS['card']).pack(anchor=tk.W, pady=5)
        
        # Entry ve button
        entry_frame = tk.Frame(frame, bg=COLORS['card'])
        entry_frame.pack(fill=tk.X)
        
        entry = tk.Entry(entry_frame, textvariable=var, font=('Segoe UI', 10),
                        relief=tk.SOLID, bd=1)
        entry.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=8)
        
        btn = tk.Button(entry_frame, text='📁 Seç', 
                       command=lambda: self.browse_folder(var),
                       bg=COLORS['primary'], fg='white',
                       font=('Segoe UI', 9), relief=tk.FLAT,
                       padx=20, cursor='hand2',
                       activebackground=COLORS['primary_dark'])
        btn.pack(side=tk.LEFT, padx=(10, 0))
    
    def browse_folder(self, var):
        """Klasör seç"""
        folder = filedialog.askdirectory(title='Klasör Seçin')
        if folder:
            var.set(folder)
    
    def page_ai_setup(self):
        """AI kurulum ve model seçimi"""
        tk.Label(self.content, text='🤖 Yapay Zeka Ayarları', 
                font=('Segoe UI', 18, 'bold'),
                fg=COLORS['text'], bg=COLORS['bg']).pack(pady=20)
        
        card = ModernCard(self.content)
        card.pack(fill=tk.BOTH, expand=True)
        
        # Ollama kurulum durumu
        ollama_status = self.check_ollama()
        
        if not ollama_status['installed']:
            # Ollama yok - kurulum öner
            warning_frame = tk.Frame(card, bg=COLORS['warning'], relief=tk.FLAT)
            warning_frame.pack(fill=tk.X, pady=10, padx=0)
            
            tk.Label(warning_frame, text='⚠️ Ollama Kurulu Değil', 
                    font=('Segoe UI', 12, 'bold'),
                    fg='white', bg=COLORS['warning']).pack(pady=10)
            
            tk.Label(warning_frame, 
                    text='AI özellikleri için Ollama kurulumu gerekli.\nOllama olmadan sadece basit hareket tespiti yapılabilir.', 
                    font=('Segoe UI', 9),
                    fg='white', bg=COLORS['warning'],
                    justify=tk.CENTER).pack(pady=5, padx=20)
            
            btn_install = tk.Button(warning_frame, text='🔽 Ollama İndir ve Kur',
                                   command=self.install_ollama,
                                   bg='white', fg=COLORS['warning'],
                                   font=('Segoe UI', 10, 'bold'),
                                   relief=tk.FLAT, padx=20, pady=8,
                                   cursor='hand2')
            btn_install.pack(pady=10)
            
            tk.Checkbutton(card, text='Ollama olmadan devam et (sadece hareket tespiti)',
                          variable=tk.BooleanVar(value=True),
                          font=('Segoe UI', 9), bg=COLORS['card'],
                          activebackground=COLORS['card']).pack(pady=10)
        
        else:
            # Ollama var - model seçimi
            success_frame = tk.Frame(card, bg=COLORS['success'], relief=tk.FLAT)
            success_frame.pack(fill=tk.X, pady=10, padx=0)
            
            tk.Label(success_frame, text='✅ Ollama Kurulu', 
                    font=('Segoe UI', 12, 'bold'),
                    fg='white', bg=COLORS['success']).pack(pady=10)
            
            if ollama_status['models']:
                tk.Label(success_frame, 
                        text=f"{len(ollama_status['models'])} model bulundu", 
                        font=('Segoe UI', 9),
                        fg='white', bg=COLORS['success']).pack(pady=5)
            
            success_frame_end = tk.Frame(success_frame, bg=COLORS['success'])
            success_frame_end.pack(pady=10)
            
            # Model seçimi
            tk.Label(card, text='🎯 AI Modeli Seçin', 
                    font=('Segoe UI', 12, 'bold'),
                    fg=COLORS['text'], bg=COLORS['card']).pack(anchor=tk.W, pady=(20, 10), padx=20)
            
            # Mevcut modeller
            if ollama_status['models']:
                model_frame = tk.LabelFrame(card, text='Kurulu Modeller',
                                           font=('Segoe UI', 10, 'bold'),
                                           bg=COLORS['card'], fg=COLORS['text'],
                                           padx=15, pady=10)
                model_frame.pack(fill=tk.X, padx=20, pady=10)
                
                for model in ollama_status['models']:
                    rb = tk.Radiobutton(model_frame, text=model,
                                       variable=self.config_vars['model_name'],
                                       value=model,
                                       font=('Segoe UI', 10),
                                       bg=COLORS['card'],
                                       activebackground=COLORS['card'])
                    rb.pack(anchor=tk.W, pady=3)
            
            # Önerilen modeller
            rec_frame = tk.LabelFrame(card, text='Önerilen Modeller (İndirilecek)',
                                     font=('Segoe UI', 10, 'bold'),
                                     bg=COLORS['card'], fg=COLORS['text'],
                                     padx=15, pady=10)
            rec_frame.pack(fill=tk.X, padx=20, pady=10)
            
            recommended = [
                ('qwen2.5vl:3b', '✅ Hızlı ve hafif (3GB) - ÖNERİLEN'),
                ('llama3.2-vision:11b', '🔥 Güçlü (11GB)'),
                ('llava:7b', '⚡ Orta (4.5GB)')
            ]
            
            for model, desc in recommended:
                frame = tk.Frame(rec_frame, bg=COLORS['card'])
                frame.pack(fill=tk.X, pady=5)
                
                rb = tk.Radiobutton(frame, text=model,
                                   variable=self.config_vars['model_name'],
                                   value=model,
                                   font=('Segoe UI', 10, 'bold'),
                                   bg=COLORS['card'],
                                   activebackground=COLORS['card'])
                rb.pack(side=tk.LEFT)
                
                tk.Label(frame, text=desc,
                        font=('Segoe UI', 8),
                        fg=COLORS['text_secondary'], bg=COLORS['card']).pack(side=tk.LEFT, padx=10)
        
        # Bilgi
        info_frame = tk.Frame(card, bg=COLORS['primary_light'])
        info_frame.pack(fill=tk.X, pady=20, padx=0)
        
        tk.Label(info_frame, 
                text='💡 İpucu: Seçtiğiniz model otomatik indirilecek. İlk kullanımda birkaç dakika sürebilir.', 
                font=('Segoe UI', 9), fg=COLORS['text_secondary'],
                bg=COLORS['primary_light'], wraplength=600).pack(pady=10, padx=15)
    
    def page_search_setup(self):
        """Arama kriteri ayarları"""
        tk.Label(self.content, text='🔍 Ne Arıyorsunuz?', 
                font=('Segoe UI', 18, 'bold'),
                fg=COLORS['text'], bg=COLORS['bg']).pack(pady=20)
        
        card = ModernCard(self.content)
        card.pack(fill=tk.BOTH, expand=True)
        
        # Açıklama
        tk.Label(card, 
                text='Videolarda neyi aramak istiyorsunuz?\nBurada belirttiğiniz şeylere odaklanılacak.', 
                font=('Segoe UI', 11),
                fg=COLORS['text'], bg=COLORS['card'],
                justify=tk.CENTER).pack(pady=20)
        
        # Örnekler
        examples_frame = tk.LabelFrame(card, text='Örnekler',
                                      font=('Segoe UI', 10, 'bold'),
                                      bg=COLORS['card'], fg=COLORS['text'],
                                      padx=20, pady=15)
        examples_frame.pack(fill=tk.X, padx=20, pady=15)
        
        examples = [
            '👤 İnsanları tespit et',
            '🚗 Arabaları say',
            '📦 Paket hırsızlığı',
            '🏃 Şüpheli davranış',
            '🐕 Hayvan tespiti',
            '🔥 Yangın veya duman',
        ]
        
        for ex in examples:
            btn = tk.Button(examples_frame, text=ex,
                           command=lambda e=ex: self.config_vars['search_prompt'].set(e.split(' ', 1)[1]),
                           bg=COLORS['primary_light'], fg=COLORS['text'],
                           font=('Segoe UI', 9),
                           relief=tk.FLAT, padx=15, pady=8,
                           cursor='hand2',
                           activebackground=COLORS['primary'])
            btn.pack(side=tk.LEFT, padx=5, pady=5)
        
        # Arama kutusu
        tk.Label(card, text='Arama Kriteri (Opsiyonel)', 
                font=('Segoe UI', 11, 'bold'),
                fg=COLORS['text'], bg=COLORS['card']).pack(anchor=tk.W, pady=(20, 5), padx=20)
        
        entry_frame = tk.Frame(card, bg=COLORS['card'])
        entry_frame.pack(fill=tk.X, padx=20, pady=5)
        
        search_entry = tk.Entry(entry_frame, 
                               textvariable=self.config_vars['search_prompt'],
                               font=('Segoe UI', 12),
                               relief=tk.SOLID, bd=1)
        search_entry.pack(fill=tk.X, ipady=10)
        
        tk.Label(card, 
                text='Boş bırakırsanız: Genel hareket tespiti + şüpheli durum analizi yapılır', 
                font=('Segoe UI', 9),
                fg=COLORS['text_secondary'], bg=COLORS['card']).pack(pady=10, padx=20)
        
        # Prompt önizleme
        preview_frame = tk.LabelFrame(card, text='AI Promptu (Otomatik)',
                                     font=('Segoe UI', 9, 'bold'),
                                     bg=COLORS['primary_light'], fg=COLORS['text'],
                                     padx=15, pady=10)
        preview_frame.pack(fill=tk.X, padx=20, pady=15)
        
        self.prompt_preview = tk.Label(preview_frame, 
                                       text=self.generate_prompt_preview(),
                                       font=('Consolas', 8),
                                       fg=COLORS['text'], bg=COLORS['primary_light'],
                                       justify=tk.LEFT, anchor=tk.W)
        self.prompt_preview.pack(fill=tk.X)
        
        # Prompt güncelleme
        self.config_vars['search_prompt'].trace_add('write', 
                                                    lambda *args: self.update_prompt_preview())
    
    def generate_prompt_preview(self):
        """Prompt önizlemesi oluştur"""
        search = self.config_vars['search_prompt'].get().strip()
        
        if search:
            return f'''Bu videoda "{search}" arıyorum.
Lütfen sadece bununla ilgili durumları rapor et.
Başka bir şey görürsen belirtme.'''
        else:
            return '''Bu videoda herhangi bir hareket veya şüpheli durum var mı?
- İnsan, araç veya hayvan hareketi
- Olağandışı aktiviteler
- Potansiyel güvenlik sorunları

Hiçbir şey yoksa "Şüpheli bir durum yok" de.'''
    
    def update_prompt_preview(self):
        """Prompt önizlemesini güncelle"""
        if hasattr(self, 'prompt_preview'):
            self.prompt_preview.config(text=self.generate_prompt_preview())
    
    def check_ollama(self):
        """Ollama durumunu kontrol et"""
        try:
            import ollama
            models = [m['name'] for m in ollama.list()['models']]
            return {'installed': True, 'running': True, 'models': models}
        except:
            return {'installed': False, 'running': False, 'models': []}
    
    def install_ollama(self):
        """Ollama kurulum sayfasını aç"""
        import webbrowser
        webbrowser.open('https://ollama.com/download')
        messagebox.showinfo('Ollama Kurulum', 
                           'Tarayıcıda Ollama indirme sayfası açıldı.\n\n' +
                           'Kurulum tamamlandıktan sonra bu wizard\'ı kapatıp tekrar açın.')
    
    def page_settings(self):
        """Ayarlar sayfası"""
        # Başlık
        tk.Label(self.content, text='Ayarları Yapılandırın', 
                font=('Segoe UI', 18, 'bold'),
                fg=COLORS['text'], bg=COLORS['bg']).pack(pady=20)
        
        # Scrollable card
        canvas = tk.Canvas(self.content, bg=COLORS['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.content, orient=tk.VERTICAL, command=canvas.yview)
        
        card = ModernCard(canvas)
        
        canvas.create_window(0, 0, window=card, anchor=tk.NW)
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Hız ayarları
        self.create_section(card, '⚡ Hız Ayarları', [
            ('Her kaç karede bir baksın', self.config_vars['skip_frames'], '5 önerilen'),
            ('Hassaslık seviyesi', self.config_vars['motion_threshold'], '1200 önerilen'),
            ('Tekrar süresi (saniye)', self.config_vars['cooldown'], '8 önerilen')
        ])
        
        # Yapay zeka
        self.create_section(card, '🤖 Yapay Zeka', [
            ('Model', self.config_vars['model_name'], 'Değiştirmeyin'),
            ('Aynı anda iş sayısı', self.config_vars['workers'], '2 önerilen'),
            ('Bekleme süresi (saniye)', self.config_vars['timeout'], '60 önerilen')
        ])
        
        # Resim ayarları
        cb_frame = tk.Frame(card, bg=COLORS['card'])
        cb_frame.pack(fill=tk.X, pady=10)
        
        tk.Checkbutton(cb_frame, text='📸 Her olaydan çoklu resim al', 
                      variable=self.config_vars['enable_multiframe'],
                      font=('Segoe UI', 10), bg=COLORS['card'],
                      activebackground=COLORS['card']).pack(anchor=tk.W)
        
        self.create_section(card, '📸 Resim Ayarları', [
            ('Resim sayısı', self.config_vars['frame_count'], '6 önerilen'),
            ('Kare atlama', self.config_vars['interval_frames'], '5 önerilen')
        ])
        
        # Pack canvas
        card.update_idletasks()
        canvas.configure(scrollregion=canvas.bbox('all'))
        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    def create_section(self, parent, title, fields):
        """Ayar bölümü oluştur"""
        # Başlık
        tk.Label(parent, text=title, font=('Segoe UI', 12, 'bold'),
                fg=COLORS['text'], bg=COLORS['card']).pack(anchor=tk.W, pady=(15, 10))
        
        # Alanlar
        for label, var, hint in fields:
            frame = tk.Frame(parent, bg=COLORS['card'])
            frame.pack(fill=tk.X, pady=5)
            
            tk.Label(frame, text=label, font=('Segoe UI', 10),
                    fg=COLORS['text'], bg=COLORS['card']).pack(anchor=tk.W)
            
            entry_frame = tk.Frame(frame, bg=COLORS['card'])
            entry_frame.pack(fill=tk.X, pady=3)
            
            entry = tk.Entry(entry_frame, textvariable=var, font=('Segoe UI', 10),
                           width=30, relief=tk.SOLID, bd=1)
            entry.pack(side=tk.LEFT, ipady=5)
            
            tk.Label(entry_frame, text=f'  💡 {hint}', font=('Segoe UI', 8),
                    fg=COLORS['text_secondary'], bg=COLORS['card']).pack(side=tk.LEFT)
    
    def page_complete(self):
        """Tamamlanma sayfası"""
        # Card
        card = ModernCard(self.content)
        card.place(relx=0.5, rely=0.5, anchor=tk.CENTER, width=700, height=450)
        
        # Success icon
        tk.Label(card, text='✅', font=('Segoe UI', 100),
                bg=COLORS['card']).pack(pady=40)
        
        # Başlık
        tk.Label(card, text='Kurulum Tamamlandı!', 
                font=('Segoe UI', 24, 'bold'),
                fg=COLORS['success'], bg=COLORS['card']).pack(pady=10)
        
        # Mesaj
        msg = """Ayarlarınız başarıyla kaydedildi.

Artık videoları analiz etmeye başlayabilirsiniz!"""
        
        tk.Label(card, text=msg, font=('Segoe UI', 12),
                fg=COLORS['text_secondary'], bg=COLORS['card'],
                justify=tk.CENTER).pack(pady=20)
        
        # Sonraki adımlar
        next_frame = tk.Frame(card, bg=COLORS['primary_light'], relief=tk.FLAT)
        next_frame.pack(fill=tk.X, pady=20, padx=40)
        
        steps = """📌 Sonraki Adımlar:
1. Video dosyalarını seçtiğiniz klasöre koyun
2. Komut: python analyze_video_v2.py
3. Raporlar otomatik oluşacak!"""
        
        tk.Label(next_frame, text=steps, font=('Segoe UI', 10),
                fg=COLORS['text'], bg=COLORS['primary_light'],
                justify=tk.LEFT).pack(anchor=tk.W, padx=15, pady=15)
    
    def save_config(self):
        """Config kaydet"""
        try:
            config = {
                'input_folder': self.config_vars['input_folder'].get(),
                'output_folder': self.config_vars['output_folder'].get(),
                'skip_frames': int(self.config_vars['skip_frames'].get()),
                'motion_threshold': int(self.config_vars['motion_threshold'].get()),
                'cooldown_seconds': int(self.config_vars['cooldown'].get()),
                'model_name': self.config_vars['model_name'].get(),
                'workers': int(self.config_vars['workers'].get()),
                'timeout': int(self.config_vars['timeout'].get()),
                'enable_multiframe_burst': self.config_vars['enable_multiframe'].get(),
                'burst_frame_count': int(self.config_vars['frame_count'].get()),
                'burst_interval_frames': int(self.config_vars['interval_frames'].get()),
                'search_prompt': self.config_vars['search_prompt'].get().strip()  # YENİ
            }
            
            # Klasörleri oluştur
            Path(config['input_folder']).mkdir(parents=True, exist_ok=True)
            Path(config['output_folder']).mkdir(parents=True, exist_ok=True)
            Path(config['output_folder'], 'frames').mkdir(exist_ok=True)
            Path(config['output_folder'], 'json').mkdir(exist_ok=True)
            
            # Config.json kaydet
            with open('config.json', 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            
            return True
        
        except Exception as e:
            messagebox.showerror('Hata', f'Ayarlar kaydedilemedi:\n{e}')
            return False
    
    def run(self):
        """Uygulamayı başlat"""
        self.root.mainloop()

if __name__ == '__main__':
    app = ModernSetupWizard()
    app.run()
