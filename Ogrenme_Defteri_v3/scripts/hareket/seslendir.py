#!/usr/bin/env python3
"""Hareket videolarının Türkçe anlatımını Piper ile üretir.

Kullanım: python3 seslendir.py <model.onnx> <girdi.json> <cikti-klasoru> [hiz]
girdi.json: [{"dosya": "x.wav", "metin": "..."}]. Var olan dosyaya dokunmaz.
hiz: konuşma temposu (varsayılan 1.08; büyük = daha yavaş). Gereken: pip install piper-tts
"""
import json, os, sys, wave
from piper import PiperVoice, SynthesisConfig

model, girdi, cikti = sys.argv[1:4]
hiz = float(sys.argv[4]) if len(sys.argv) > 4 else 1.08
ses = PiperVoice.load(model)
cfg = SynthesisConfig(length_scale=hiz)
os.makedirs(cikti, exist_ok=True)
for o in json.load(open(girdi, encoding="utf-8")):
    yol = os.path.join(cikti, o["dosya"])
    if os.path.exists(yol):
        continue
    with wave.open(yol, "wb") as wf:
        ses.synthesize_wav(o["metin"], wf, syn_config=cfg)
    print("ok", o["dosya"])
