# Pack: Video production (trailers, clips, edits)

Read when the task makes or edits video: a trailer, a capture, a clip, captions, a render from code. Facts read 2026-10-25 on the pages named. Labels: [official], [reasoning], [unverified], [ran] ran in this session.

## Sources first
- ffmpeg: https://ffmpeg.org/ffmpeg.html (first 100,000 characters read; the rest not). Run `ffmpeg -h full` on the installed build before using a flag from memory. This machine has ffmpeg 6.1.1. [official, ran]
- Code-made video (Remotion): free for individuals, non-profits, for-profit companies with up to 3 employees, and evaluation; a paid Company License for others; you may not resell or sublicense Remotion itself; terms change slightly in Remotion 5.0. Source: https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md. Check the user's situation before adding it. [official]
- Music, voice, footage and images used in a video follow their own licenses: `packs/ai-production.md`. Ledger row per asset.
- Steam trailers, https://partner.steamgames.com/doc/store/trailer (read 2026-10-26): highest resolution you have up to 1920x1080 (1280x720 avoids processing issues); 30/29.97 or 60/59.94 fps; 5,000+ Kbps; `.mov`, `.wmv` or `.mp4`; H.264 video and AAC audio preferred; 16:9 preferred, 4:3 accepted; audio is downmixed to stereo, use 44 or 48 kHz; the first two valid trailers show before screenshots. The page gives no file-size limit, length or loudness target. [official]

## Traps (ffmpeg facts)
1. `-ss` before `-i` seeks fast to the nearest point and, when transcoding, decodes and discards the gap (accurate by default); with `-c copy` or `-noaccurate_seek` the gap is kept, so cuts start at the previous keyframe. `-ss` after `-i` decodes everything up to the time. [official]
2. `-t` and `-to` are mutually exclusive and `-t` wins. [official]
3. `-c copy` copies streams with no filtering or re-encoding, and can fail in some cases. Any filter (`-vf`, `-filter_complex`) means re-encoding. [official]
4. `-y` overwrites silently; `-n` refuses and exits. Do not use `-y` on a path that holds the user's work: write to a new file name. [official + reasoning]
5. `-r` as an output option drops or duplicates frames to a constant rate; with stream copy it only sets the label. [official]
6. `-an` removes audio but not audio produced inside a filtergraph. [official]
7. `-progress pipe:1` prints key=value lines ending with `progress=continue|end`: use it for long renders instead of guessing. [official]
8. Phone and web targets differ in codec and pixel format support: confirm with the target's own docs; do not assume. [reasoning]

## Checks (measure the output file, not the command)
- `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json out.mp4`: duration, size, codec, frame rate match the brief. [ran: duration read on a generated 6 s clip]
- Look at it: `ffmpeg -i out.mp4 -vf fps=1 frame_%03d.png` gives one frame per second to view (6 frames from the 6 s test clip). [ran]
- Audio: check it is present, not clipped, and the right language; a silent render is a common failure. The Steam page names no loudness target; for other platforms read the destination's page: [unverified].
- Subtitles and on-screen text: read every line against the script; text in the video's language.
- Size against the destination limit, from the destination's page, not from memory.

## Done when
`ffprobe` output matches the brief, the user-visible frames were looked at, audio was checked, every asset has a ledger row and a license that allows the use, and the render command is saved in the task folder so it can be rerun.
