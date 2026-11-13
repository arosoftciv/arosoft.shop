// Génère renders/mary-belle-vajacial.srt depuis src/captions/words.json
// (mêmes règles de découpage que les sous-titres incrustés).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const { words } = JSON.parse(readFileSync(new URL("../src/captions/words.json", import.meta.url)));
const isTag = (t) => t.startsWith("[") || t.endsWith("]");
const isPunct = (t) => /^[!?.…,;:]+$/.test(t);

const spoken = [];
for (const w of words) {
  if (isTag(w.text)) continue;
  if (isPunct(w.text)) {
    if (spoken.length) spoken[spoken.length - 1].text += " " + w.text;
    continue;
  }
  spoken.push({ text: w.text, start: w.start, end: w.end });
}

// Lignes de sous-titres un peu plus longues que l'incrustation (lecture SRT).
const chunks = [];
let cur = [];
const flush = () => {
  if (cur.length) chunks.push({ text: cur.map((w) => w.text).join(" "), start: cur[0].start, end: cur.at(-1).end });
  cur = [];
};
for (const w of spoken) {
  const prev = cur.at(-1);
  const len = cur.map((x) => x.text).join(" ").length + w.text.length;
  if (prev && (w.start - prev.end > 0.45 || len > 42)) flush();
  cur.push(w);
  if (/[!?.…]$/.test(w.text)) flush();
}
flush();

const ts = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, "0")}`;
};
const srt = chunks
  .map((c, i) => {
    const end = Math.min(chunks[i + 1]?.start ?? c.end + 0.6, c.end + 0.6);
    return `${i + 1}\n${ts(c.start)} --> ${ts(end)}\n${c.text}\n`;
  })
  .join("\n");

mkdirSync(new URL("../renders/", import.meta.url), { recursive: true });
writeFileSync(new URL("../renders/mary-belle-vajacial.srt", import.meta.url), srt);
console.log(`${chunks.length} sous-titres écrits dans renders/mary-belle-vajacial.srt`);
