#!/usr/bin/env python3
"""Ses üretimi: ses/metinler.json içindeki her konuşmayı ses/<dosya>.mp3 olarak üretir.

Önce şunu çalıştır:   node scripts/ses-liste.mjs --yaz      (metinler.json ve liste.json'u günceller)
Sonra:                python3 scripts/ses-uret.py --model <klasör>

Gerekenler: kokoro-onnx, faster-whisper, numpy ve ffmpeg.
  pip install kokoro-onnx faster-whisper numpy
Kokoro model dosyaları (<klasör> içine, toplam ~120 MB; Apache-2.0):
  kokoro-v1.0.int8.onnx   voices-v1.0.bin
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Her cümle üretilir, ASR (Whisper) ile geri okunur ve metne benzerliği rapora yazılır.
Varsayılan olarak yalnız eksik dosyalar üretilir; mevcut dosyaya dokunulmaz (--yeniden ile yeniden üretilir).
Büyük işlerde dört işlemle: --parca 1/4 ... --parca 4/4
"""
import argparse, difflib, json, os, re, subprocess, sys, tempfile, unicodedata, wave
import numpy as np

# İçerikteki ses kimliği -> Kokoro sesi. Yeni bir konuşmacı rolü için buraya satır ekle.
SESLER = {
    "anlatici": "af_bella",   # kelimeler, açıklayıcı cümleler (varsayılan)
    "kadin": "af_heart",      # diyaloglarda kadın konuşmacılar
    "erkek": "am_michael",    # diyaloglarda erkek konuşmacılar
}

# Kokoro'nun İngilizce ön ucu Türkçe özel adları yanlış okur (ör. "Ece" -> "ɛs", harf S gibi).
# Bu adlar elle yazılmış okunuşlarla (Kokoro'nun ses simgeleriyle) okutulur. Yeni bir ad kullanırsan
# buraya ekle, adı ASR_ISIMLER'e yaz, o adı içeren mp3'leri sil ve betiği yeniden çalıştır; kulakla kontrol et.
ADLAR = {
    "Ece": "ɛʤˈɛ",
    "Türkiye": "tˈɜːkɪjɛ",
    "Izmir": "ɪzmˈiːɹ",
}
# Kokoro'nun ön ucu, bağlamdan anlayamadığında yanlış anlamı seçebilir: yalnız "close" yazınca "yakın" (klˈoʊs),
# "live" yazınca "canlı" (lˈaɪv) okur; "lives" cümle içinde bile "canlı" okunur. Derste bu sözcükler hep fiildir
# (kapatmak, yaşamak). Bu tablodaki sözcükler her yerde buradaki okunuşla okutulur (büyük/küçük harf fark etmez).
# Yeni bir çok okunuşlu sözcük (ör. "wind", "tear", "lead") kullanırsan buraya ekle; tests/unit/ses.test.mjs seni uyarır.
SOZCUKLER = {
    "close": "klˈoʊz",
    "live": "lˈɪv",
    "lives": "lˈɪvz",
    "use": "jˈuːz",  # yalnız "use" yazınca isim (jˈuːs) okur; derste hep fiildir (kullanmak)
}
# Whisper'a özel adların yazımını ipucu olarak verir (aksi halde "Ece" yerine "Ajah" gibi bir şey yazar).
ASR_ISIMLER = ["Ece", "Sam", "Maya", "Daniel", "Türkiye", "Bursa", "Izmir", "Ali", "Anna", "Smith", "Manchester", "Leeds", "Max", "Tom", "Sara", "Mike"]
ASR_IPUCU = ", ".join(ASR_ISIMLER) + "."

ONLAR = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
ONLU = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def sayi_en(n):
    if n < 20:
        return ONLAR[n]
    d, b = divmod(n, 10)
    return ONLU[d] + ("" if b == 0 else " " + ONLAR[b])


def sade(s):
    s = unicodedata.normalize("NFC", s).lower().replace("-", " ")
    s = re.sub(r"\b\d{1,2}\b", lambda m: sayi_en(int(m.group(0))), s)
    s = re.sub(r"[^\w\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def benzerlik(a, b):
    return difflib.SequenceMatcher(None, sade(a), sade(b)).ratio()


def cumlelere_bol(metin):
    return [c.strip() for c in re.split(r"(?<=[.!?])\s+", metin.strip()) if c.strip()]


def calistir(komut):
    return subprocess.run(komut, capture_output=True, text=True)


def mp3_yaz(wav, mp3):
    r = calistir(["ffmpeg", "-nostats", "-i", wav, "-af", "loudnorm=I=-18:TP=-2:LRA=9:print_format=json", "-f", "null", "-"])
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    j = json.loads(m.group(0))
    af = (f"loudnorm=I=-18:TP=-2:LRA=9:measured_I={j['input_i']}:measured_LRA={j['input_lra']}:"
          f"measured_TP={j['input_tp']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", af, "-ar", "22050", "-ac", "1",
                    "-c:a", "libmp3lame", "-b:a", "64k", mp3], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--model", required=True, help="kokoro-v1.0.int8.onnx ve voices-v1.0.bin dosyalarının klasörü")
    ap.add_argument("--hedef", default=os.path.join(os.path.dirname(__file__), "..", "ses"), help="ses klasörü (metinler.json burada)")
    ap.add_argument("--parca", default="1/1", help="i/n: işi n parçaya böl, i. parçayı yap")
    ap.add_argument("--yeniden", action="store_true", help="var olan dosyaları da yeniden üret")
    ap.add_argument("--rapor", help="ASR benzerlik raporunun yazılacağı json")
    ap.add_argument("--asr", default="small", help="Whisper model adı")
    ap.add_argument("--asr-is-parcacigi", type=int, default=1, help="Whisper'ın CPU iş parçacığı sayısı (parçalar paralel çalışırken 1)")
    a = ap.parse_args()

    from faster_whisper import WhisperModel
    from kokoro_onnx import Kokoro

    hedef = os.path.abspath(a.hedef)
    metinler = json.load(open(os.path.join(hedef, "metinler.json"), encoding="utf-8"))
    i, n = (int(x) for x in a.parca.split("/"))
    isler = [(d, v) for k, (d, v) in enumerate(sorted(metinler.items())) if k % n == i - 1]
    if not a.yeniden:
        isler = [(d, v) for d, v in isler if not os.path.exists(os.path.join(hedef, d))]
    bilinmeyen = sorted({v["ses"] for _, v in isler if v["ses"] not in SESLER})
    if bilinmeyen:
        sys.exit(f"bilinmeyen ses kimliği: {', '.join(bilinmeyen)} (SESLER tablosuna ekle)")
    print(f"{len(isler)} dosya üretilecek (parça {a.parca})", flush=True)

    kokoro = Kokoro(os.path.join(a.model, "kokoro-v1.0.int8.onnx"), os.path.join(a.model, "voices-v1.0.bin"))
    asr = WhisperModel(a.asr, device="cpu", compute_type="int8", cpu_threads=a.asr_is_parcacigi)
    SR = 24000
    ozel = {**{ad.lower(): ph for ad, ph in ADLAR.items()}, **SOZCUKLER}
    ad_deseni = re.compile(r"\b(" + "|".join(map(re.escape, ozel)) + r")\b", re.I)

    def fonemle(cumle):
        """Cümleyi Kokoro ses simgelerine çevirir; özel adlar ADLAR, çok okunuşlu sözcükler SOZCUKLER tablosundan gelir."""
        parcalar = ad_deseni.split(cumle)
        ph = ""
        for k, p in enumerate(parcalar):
            if k % 2:
                ph += " " + ozel[p.lower()] + " "
            else:
                ph += kokoro.tokenizer.phonemize(p, "en-us") if re.search(r"\w", p) else p
        return re.sub(r"\s+", " ", ph).strip()

    def uret(ad, cumle, hiz):
        ornek, sr = kokoro.create(fonemle(cumle), voice=SESLER[ad], speed=hiz, lang="en-us", is_phonemes=True)
        assert sr == SR
        return np.clip(ornek * 32767, -32768, 32767).astype(np.int16)

    def oku(dizi, cumle):
        x = dizi.astype(np.float32) / 32768.0
        m = int(len(x) * 16000 / SR)
        x = np.interp(np.linspace(0, len(x) - 1, m), np.arange(len(x)), x).astype(np.float32)
        x = np.concatenate([np.zeros(3200, np.float32), x, np.zeros(3200, np.float32)])
        isim_var = any(re.search(rf"\b{n}\b", cumle) for n in ASR_ISIMLER)
        parca, _ = asr.transcribe(x, language="en", beam_size=5, condition_on_previous_text=False, initial_prompt=ASR_IPUCU if isim_var else None)
        return " ".join(p.text.strip() for p in parca)

    sessiz = lambda sn: np.zeros(int(SR * sn), np.int16)
    rapor = []
    for sira, (dosya, v) in enumerate(isler, 1):
        ad, hiz = v["ses"], v.get("hiz", 1) or 1
        parcalar, puanlar = [sessiz(0.15)], []
        cumleler = cumlelere_bol(v["metin"]) or [v["metin"]]
        for k, c in enumerate(cumleler):
            dizi = uret(ad, c, hiz)
            puanlar.append(benzerlik(c, oku(dizi, c)))
            parcalar += [dizi, sessiz(0.45 if k < len(cumleler) - 1 else 0.25)]
        dizi = np.concatenate(parcalar)
        with tempfile.TemporaryDirectory() as gecici:
            wav = os.path.join(gecici, "a.wav")
            with wave.open(wav, "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(dizi.tobytes())
            mp3_yaz(wav, os.path.join(hedef, dosya))
        kisa = len(v["metin"].split()) <= 2   # tek sözcükte ASR güvenilir değil (bağlam yok)
        rapor.append({"dosya": dosya, "metin": v["metin"], "ses": ad, "asr": round(min(puanlar), 3), "kisa": kisa})
        print(f"[{sira}/{len(isler)}] {dosya} {ad} asr={min(puanlar):.2f}{' (kısa)' if kisa else ''} {v['metin'][:50]!r}", flush=True)

    if a.rapor:
        json.dump(rapor, open(a.rapor, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    dusuk = [r for r in rapor if r["asr"] < 0.8 and not r["kisa"]]
    print(f"bitti: {len(rapor)} dosya, ASR benzerliği 0.8'in altında (kısa olanlar hariç): {len(dusuk)}")
    for r in dusuk[:30]:
        print("  düşük:", r["asr"], r["ses"], repr(r["metin"][:60]))


if __name__ == "__main__":
    main()
