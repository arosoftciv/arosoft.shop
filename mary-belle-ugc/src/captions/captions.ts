import wordsJson from "./words.json";

export type Word = { text: string; start: number; end: number };
export type Chunk = { words: Word[]; start: number; end: number };

const isTag = (t: string) => t.startsWith("[") || t.endsWith("]");
const isPunct = (t: string) => /^[!?.…,;:]+$/.test(t);

/** Mots réellement prononcés (balises de jeu et ponctuation isolée retirées). */
export const spokenWords = (): Word[] => {
  const raw = (wordsJson as { words: Word[] }).words;
  const out: Word[] = [];
  for (const w of raw) {
    if (isTag(w.text)) continue;
    if (isPunct(w.text)) {
      // rattache la ponctuation au mot précédent (affichage « femme ! »)
      if (out.length) out[out.length - 1] = { ...out[out.length - 1], text: out[out.length - 1].text + " " + w.text };
      continue;
    }
    out.push({ text: w.text, start: w.start, end: w.end });
  }
  return out;
};

/** Regroupe en lignes courtes lisibles sur smartphone. */
export const buildChunks = (maxWords = 4, maxChars = 24): Chunk[] => {
  const words = spokenWords();
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = cur[cur.length - 1];
    const chars = cur.map((x) => x.text).join(" ").length + w.text.length;
    if (prev && (w.start - prev.end > 0.35 || cur.length >= maxWords || chars > maxChars)) flush();
    cur.push(w);
    if (/[!?.…,]$/.test(w.text)) flush();
  }
  flush();
  // prolonge légèrement chaque ligne jusqu'à la suivante pour éviter le clignotement
  for (let i = 0; i < chunks.length - 1; i++) {
    chunks[i].end = Math.min(chunks[i + 1].start, chunks[i].end + 0.4);
  }
  return chunks;
};
