# Pack: AI asset production (3D, image, music, SFX, voice, rig, texture, video)

Read when a task makes game or media assets with AI tools or picks one. Terms change often. Facts read 2026-10-25 on the pages named; re-read the tool's terms on the day you use it. Labels: [official] page text, [secondary], [reasoning], [unverified].

## Sources first
- Steam AI disclosure: https://partner.steamgames.com/doc/gettingstarted/contentsurvey. US copyright: https://www.copyright.gov/ai/ (Part 2 report, January 2025).
- Licenses: https://github.com/microsoft/TRELLIS, https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/LICENSE, https://www.meshy.ai/pricing, https://stability.ai/license, https://huggingface.co/black-forest-labs/FLUX.1-schnell and `FLUX.1-dev`, https://github.com/ace-step/ACE-Step, https://huggingface.co/stabilityai/stable-audio-open-1.0, https://github.com/facebookresearch/audiocraft, https://help.suno.com/en/articles/2746945, https://kenney.nl/support, https://freesound.org/help/faq/, https://sonniss.com/gameaudiogdc/, https://github.com/hexgrad/kokoro, https://elevenlabs.io/pricing.

## Traps (rules that never change)
1. Every asset gets a ledger row in `assets/LEDGER.md`: file, tool and version, plan or model license, date, source URL of the terms, prompt, credit text, who reviewed it. No row, no ship. [reasoning]
2. Pick the license before the tool. Free plan, paid plan and open weights usually differ. [official, below]
3. Check what the license says about the **model** and about the **outputs** separately (FLUX.1 dev below). [official]
4. Do not run unknown model code or checkpoints from random repos: scan first (`security-and-hardening`), prefer `safetensors`. [reasoning]

## Ownership and disclosure
- US Copyright Office, Part 2 (Jan 2025): no copyright for purely AI-generated material; prompts alone do not give enough control; human selection, arrangement and creative edits can be protected. So your own edits and arrangement matter, and AI-only art may be copyable by anyone. Not legal advice. [official; I read the executive summary]
- Steam Content Survey: disclose AI content that ships with the game (pre-generated) or is made while it runs (live-generated, which also needs a statement of guardrails). Tools used only to work faster are not the focus. Where credit lines go is not stated there: put them in the in-game credits and the store text. [official; the credit placement is reasoning]

## Lanes (license as read)
**3D**
- TRELLIS (Microsoft): MIT models and most code; submodules may differ; needs an NVIDIA GPU with at least 16 GB. A 3070 Ti (8 GB) is too small, so cloud. [official]
- Hunyuan3D 2.0 (Tencent): community license; does not apply in the EU, UK or South Korea; over 1M monthly users needs Tencent's license; outputs cannot improve other AI models; notice file required when distributing. [official]
- Meshy: free plan models are CC BY 4.0 (credit Meshy); paid plans give a private, customer-owned license. [official]
- Tripo: pricing page returned 403, terms [unverified].

**Image**
- FLUX.1 schnell: Apache-2.0. FLUX.1 dev: non-commercial model license, read LICENSE.md for outputs. [official]
- Stability AI Community License: free under $1M yearly revenue; above it, an enterprise license. [official]

**Music**
- ACE-Step: Apache-2.0; v1.5 released 2026-01-28; the README names no training data and asks you to disclose AI use; its 8 GB VRAM note is for v1, v1.5 [unverified]. [official]
- Stable Audio Open 1.0: Stability Community License; up to 47 s clips; trained on CC0, CC BY and CC Sampling+ recordings. [official]
- MusicGen weights (AudioCraft): CC-BY-NC 4.0, so not for a sold game. Code is MIT. [official]
- Suno: free plan, Suno owns the songs, non-commercial only; Pro or Premier, you own them. [official]
- Google Flow Music / Lyria 3: Google's terms not found; reseller pages conflict; tracks carry a SynthID watermark. [unverified]

**SFX** (AI SFX is weak; real libraries first)
- ElevenLabs SFX: free plan needs credit to elevenlabs.io for commercial use; paid plans none; no use to build competing products. [official]
- Kenney: CC0, credit optional. [official]
- Freesound: each file is CC0, CC-BY (credit) or CC-BY-NC (no commercial use). Check every file. [official]
- Sonniss GameAudioGDC: royalty-free, no credit, games allowed; no AI training; no resale as sound effects. [official]

**Voice**
- Kokoro TTS: Apache-2.0 code and weights. [official]
- ElevenLabs: a commercial license is listed from the Starter plan up, none on Free. Credit rules [unverified]. [official]

**Rig, animation, texture, VFX**
- Mixamo (Adobe): characters and animations royalty-free for commercial projects, games included; no credit; do not redistribute the raw files or train ML models on them; auto-rigger: bipedal humanoids only. [secondary: search summary; Adobe's FAQ page returned 403]
- Poly Haven: CC0, commercial use, no credit. ambientCG: CC0 1.0, no credit, suggests a credit line. [official]
- AI rig, animation and texture tools, and particle assets: terms [unverified]; build VFX in the engine from CC0 textures. [reasoning]

**Video** (see `video-production.md`)
- Wan 2.1: Apache-2.0; README claims no rights over your outputs; T2V-1.3B needs 8.19 GB VRAM. [official]
- HunyuanVideo (Tencent): does not apply in the EU, UK or South Korea; outputs cannot improve other AI models; over 100M monthly users needs Tencent's license. [official] Hosted video tools: [unverified].

## Checks
- `assets/LEDGER.md` has a row for every file in the shipped asset folders (a small script or `ls` diff); empty license cells fail.
- Game budgets per asset class (triangles, texture size, clip length) come from the project's config, never from this file. Measure the file, do not trust the tool's claim.
- Listen to or view every asset; "generated" is not "usable" (loops, artifacts, wrong scale, T-pose, missing alpha).

## Done when
Every shipped asset has a complete ledger row, the disclosure text for the store page is drafted and quoted from the Steam page, and tools whose terms were not readable are marked [unverified] in the ledger.
