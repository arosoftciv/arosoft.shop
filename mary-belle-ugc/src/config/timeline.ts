/**
 * TIMELINE — dérivée des horodatages mot à mot de la voix-off réelle
 * (src/captions/words.json, ElevenLabs Scribe). Durées en secondes.
 * Si vous régénérez la voix, relancez `npm run srt` puis ajustez ces repères.
 */
export type SceneId =
  | "hook"
  | "curiosite"
  | "decouverte"
  | "explication"
  | "vajacial"
  | "savoirFaire"
  | "prix"
  | "emotion"
  | "whatsapp"
  | "signature";

export const SCENES: { id: SceneId; start: number; end: number }[] = [
  { id: "hook", start: 0, end: 4.29 },
  { id: "curiosite", start: 4.29, end: 10.13 },
  { id: "decouverte", start: 10.13, end: 14.33 },
  { id: "explication", start: 14.33, end: 23.46 },
  { id: "vajacial", start: 23.46, end: 32.66 },
  { id: "savoirFaire", start: 32.66, end: 37.46 },
  { id: "prix", start: 37.46, end: 41.97 },
  { id: "emotion", start: 41.97, end: 44.83 },
  { id: "whatsapp", start: 44.83, end: 53.06 },
  { id: "signature", start: 53.06, end: 58.4 },
];

/** Repères de synchro (début du mot prononcé). */
export const CUES = {
  lesFilles: 0.16,
  vajacialQ: 5.16,
  etonnement: 6.16, // petit rire
  maryBelle1: 11.44,
  riviera1: 12.88,
  visage: 17.04,
  cheveux: 17.92,
  ongles: 18.96,
  mais: 19.57,
  zoneIntime: 20.48,
  nettoyage: 26.83,
  exfoliation: 27.68,
  hydratation: 28.88,
  douceur: 35.08,
  hygiene: 35.79,
  confort: 36.72,
  devinez: 37.76,
  prix: 40.16,
  prenez: 43.32,
  whatsapp: 48.32,
  numero: [48.96, 49.28, 49.68, 50.48, 51.36, 52.08],
  maryBelle3: 53.12,
  parceQue: 54.83,
} as const;

/** Plans où le personnage parlant est à l'écran (le reste = B-roll + motion). */
export const TALKING_HEAD_RANGES: [number, number][] = [
  [0, 10.13],
  [19.4, 23.46],
  [37.46, 44.83],
  [53.06, 58.4],
];
