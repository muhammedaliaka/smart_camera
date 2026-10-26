# Pack: AI asset production (3D, image, music, SFX, voice, rig, texture, video)

Read when a task makes game or media assets with AI tools or picks one. Facts read 2026-10-26 on the pages named; re-read the tool's terms on the day you use it. Labels: [official] page text, [secondary], [reasoning], [unverified].

## Sources first
- Steam AI disclosure: https://partner.steamgames.com/doc/gettingstarted/contentsurvey. US copyright: https://www.copyright.gov/ai/.
- Licenses: https://github.com/microsoft/TRELLIS, https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/LICENSE, https://www.meshy.ai/pricing, https://stability.ai/license, https://huggingface.co/black-forest-labs/FLUX.1-schnell and `FLUX.1-dev`, https://github.com/ace-step/ACE-Step-1.5, https://huggingface.co/stabilityai/stable-audio-open-1.0, https://github.com/facebookresearch/audiocraft, https://help.suno.com/en/articles/2746945, https://kenney.nl/support, https://freesound.org/help/faq/, https://sonniss.com/gameaudiogdc/, https://github.com/hexgrad/kokoro, https://elevenlabs.io/pricing.

## Traps
1. Every asset gets a ledger row in `assets/LEDGER.md`: file, tool and version, plan or model license, date, source URL of the terms, prompt, credit text, who reviewed it. No row, no ship. [reasoning]
2. Pick the license before the tool. Free plan, paid plan and open weights usually differ. [official, below]
3. Check what the license says about the **model** and about the **outputs** separately (FLUX.1 dev below). [official]
4. Do not run unknown model code or checkpoints from random repos: scan first (`security-and-hardening`), prefer `safetensors`. [reasoning]

## Ownership and disclosure
- US Copyright Office, Part 2 (Jan 2025): no copyright for purely AI-generated material; prompts alone do not give enough control; human selection, arrangement and creative edits can be protected. Your own edits and arrangement matter; AI-only art may be copyable. Not legal advice. [official; executive summary read]
- Steam Content Survey: disclose AI content that ships with the game (pre-generated) or is made while it runs (live-generated, which also needs a statement of guardrails). Tools used only to work faster are not the focus. Credit lines: in-game credits and store text. [official; the placement is reasoning]

## Lanes (license as read)
**3D**
- TRELLIS (Microsoft): MIT models and most code; submodules may differ; needs an NVIDIA GPU with 16 GB+; smaller cards: cloud. [official]
- Hunyuan3D 2.0 (Tencent): community license; does not apply in the EU, UK or South Korea; over 1M monthly users needs Tencent's license; outputs cannot improve other AI models; notice file when distributing. [official]
- Meshy: free plan models are CC BY 4.0 (credit Meshy); paid plans give a private, customer-owned license. [official]
- Tripo hosted: terms and pricing pages return 403 (2026-10-26): [unverified]. TripoSR, TripoSG (local): MIT; TripoSR lists Objaverse as training data. [official]

**Image**
- FLUX.1 schnell: Apache-2.0. FLUX.1 dev: non-commercial model license, read LICENSE.md for outputs. [official]
- Stability AI Community License: free under $1M yearly revenue; above it, an enterprise license. [official]

**Music**
- ACE-Step 1.5: MIT in README, LICENSE and model card (v1 repo: Apache-2.0); no training data named; asks you to disclose AI use; VRAM from under 4 GB to 12 GB+ by model size. [official]
- Stable Audio Open 1.0: Stability Community License; up to 47 s clips; trained on CC0, CC BY and CC Sampling+ recordings. [official]
- MusicGen weights (AudioCraft): CC-BY-NC 4.0, so not for a sold game. Code is MIT. [official]
- Suno: free plan, Suno owns the songs, non-commercial only; Pro or Premier, you own them. [official]
- Lyria 3.5 via Gemini API: Google claims no ownership of outputs, may give others the same, you answer for use; audio carries a SynthID watermark (API terms effective 2026-03-23). Flow Music app terms unread (script page): [unverified]. [official]

**SFX** (AI SFX is weak; real libraries first)
- ElevenLabs SFX: free plan needs credit to elevenlabs.io for commercial use; paid plans none; no use to build competing products. [official]
- Kenney: CC0, credit optional. [official]
- Freesound: each file is CC0, CC-BY (credit) or CC-BY-NC (no commercial use). Check every file. [official]
- Sonniss GameAudioGDC: royalty-free, no credit, games allowed; no AI training; no resale as sound effects. [official]

**Voice**
- Kokoro TTS: Apache-2.0 code and weights. [official]
- ElevenLabs: a commercial license is listed from the Starter plan up, none on Free. Credit rules [unverified]. [official]

**Rig, animation, texture, VFX**
- Mixamo (Adobe FAQ, 2021-09-14): free with an Adobe ID; royalty-free for personal, commercial and non-profit projects, games included; bipedal humanoids only; not for Enterprise or Federated IDs or China. No credit or ML-training rule on the FAQ: [unverified]. [official]
- Poly Haven: CC0, commercial use, no credit. ambientCG: CC0 1.0, no credit, suggests a credit line. [official]
- AI rig, animation and texture tools, and particle assets: terms [unverified]; build VFX in the engine from CC0 textures. [reasoning]

**Video** (see `video-production.md`)
- Wan 2.1: Apache-2.0; README claims no rights over your outputs; T2V-1.3B needs 8.19 GB VRAM. [official]
- HunyuanVideo (Tencent): does not apply in the EU, UK or South Korea; outputs cannot improve other AI models; over 100M monthly users needs Tencent's license. [official] Hosted video tools: [unverified].

## Checks
- `assets/LEDGER.md` has a row for every file in the shipped asset folders; empty license cells fail.
- Budgets per asset class (triangles, texture size, clip length) come from the project's config, never from this file. Measure the file, not the tool's claim.
- Listen to or view every asset; "generated" is not "usable" (loops, artifacts, wrong scale, T-pose, missing alpha).

## Done when
Every shipped asset has a complete ledger row, the store-page disclosure is drafted from the Steam page, and tools with unreadable terms are marked [unverified] in the ledger.
