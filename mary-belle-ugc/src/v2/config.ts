/**
 * V2 — script « institut » (12 passages de voix), la même femme partout,
 * elle ne parle à l'écran qu'au début et à la fin (air sérieux).
 * Les durées des scènes sont tirées de src/v2/timeline.json
 * (généré par scripts/build-v2-voice.py à partir des vraies durées de voix).
 */
import timeline from "./timeline.json";

export type Seg = { id: string; name: string; start: number; dur: number };
export type TWord = { text: string; start: number; end: number; seg: string };

export const TL = timeline as { gap: number; segments: Seg[]; words: TWord[]; voiceEnd: number };

export const V2_MEDIA = {
  voice: "audio/v2/voix-off.mp3",
  music: "audio/v2/musique.mp3",
  /** Base sérieuse (même photo, sans sourire) — utilisée tant qu'une vidéo parlée manque. */
  baseStill: "character/serieuse.jpg",
  /** Vidéos parlées OmniHuman (1080p). null = image fixe + filigrane « en attente ». */
  talkIntro: null as string | null,
  talkSignature: "video/v2/parle-signature.mp4" as string | null,
  /** Vidéos muettes (Kling 3 Pro, 1080p) — durée réelle de chaque fichier en secondes. */
  clips: {
    accueil: { src: "video/v2/accueil.mp4", dur: 7.04 },
    manucure: { src: "video/v2/manucure.mp4", dur: 4.04 },
    cabine: { src: "video/v2/cabine.mp4", dur: 8.04 },
    gants: { src: "video/v2/gants.mp4", dur: 8.04 },
    serviettes: { src: "video/v2/serviettes.mp4", dur: 7.04 },
    produits: { src: "video/v2/produits.mp4", dur: 10 },
    fenetre: { src: "video/v2/fenetre.mp4", dur: 8.04 },
    pratique: { src: "video/v2/pratique.mp4", dur: 11.8 },
  },
} as const;

export const TAIL_SECONDS = 1.8;

/** Fenêtre [début, fin) d'un passage : jusqu'au début du passage suivant. */
export const segWindow = (id: string): { start: number; end: number } => {
  const i = TL.segments.findIndex((s) => s.id === id);
  const s = TL.segments[i];
  const next = TL.segments[i + 1];
  return { start: s.start, end: next ? next.start : s.start + s.dur };
};

/** Instant (s, global) du n-ième mot d'un passage commençant par `prefix`. */
export const cue = (seg: string, prefix: string, nth = 0): number => {
  const p = prefix.toLowerCase();
  const hits = TL.words.filter((w) => w.seg === seg && w.text.toLowerCase().startsWith(p));
  const w = hits[Math.min(nth, hits.length - 1)];
  if (!w) throw new Error(`cue introuvable: ${seg} « ${prefix} »`);
  return w.start;
};
