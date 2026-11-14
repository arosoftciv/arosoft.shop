"""Assemble la voix-off V2 (12 passages) + timeline et mots horodatés globaux.

Entrées : assets/audio/v2/sNN-*.mp3 et src/v2/words/sNN.json (ElevenLabs Scribe)
Sorties : public/audio/v2/voix-off.mp3, src/v2/timeline.json
"""
import glob, json, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 0.35  # silence entre deux passages (s)
segs = sorted(glob.glob(os.path.join(ROOT, "assets/audio/v2/s[0-9][0-9]-*.mp3")))
out = {"gap": GAP, "segments": [], "words": []}
t = 0.0
inputs, filters = [], []
for i, path in enumerate(segs):
    sid = os.path.basename(path)[:3]
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode())
    words = json.load(open(os.path.join(ROOT, f"src/v2/words/{sid}.json")))["words"]
    out["segments"].append({"id": sid, "name": os.path.basename(path)[4:-4], "start": round(t, 3), "dur": round(dur, 3)})
    for w in words:
        out["words"].append({"text": w["text"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3), "seg": sid})
    inputs += ["-i", path]
    filters.append(f"[{i}:a]aresample=48000,adelay={int(t*1000)}|{int(t*1000)}[a{i}]")
    t += dur + GAP
total = t - GAP
out["voiceEnd"] = round(total, 3)
mix = "".join(f"[a{i}]" for i in range(len(segs)))
fc = ";".join(filters) + f";{mix}amix=inputs={len(segs)}:normalize=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=9"
os.makedirs(os.path.join(ROOT, "public/audio/v2"), exist_ok=True)
subprocess.check_call(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-ar", "48000", "-ac", "1", "-b:a", "256k", os.path.join(ROOT, "public/audio/v2/voix-off.mp3")])
json.dump(out, open(os.path.join(ROOT, "src/v2/timeline.json"), "w"), ensure_ascii=False, indent=1)
for s in out["segments"]:
    print(s)
print("voiceEnd", out["voiceEnd"])
