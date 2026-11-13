import { continueRender, delayRender, staticFile } from "remotion";
import faces from "./font-faces.json";

/**
 * Polices auto-hébergées (public/fonts) — Playfair Display (titres) + Montserrat
 * (textes & chiffres). Licence SIL Open Font License : usage commercial autorisé.
 * Chargées localement pour un rendu fiable, même hors ligne.
 */
type Face = { family: string; style: string; weight: string; file: string; unicodeRange: string };

if (typeof document !== "undefined") {
  const handle = delayRender("Chargement des polices locales");
  Promise.all(
    (faces as Face[]).map((f) => {
      const ff = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
        style: f.style,
        weight: f.weight,
        unicodeRange: f.unicodeRange,
      });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(ff);
      return ff.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

/** Titres élégants */
export const SERIF = "'Playfair Display', Georgia, serif";
/** Textes secondaires modernes + chiffres tarifaires */
export const SANS = "'Montserrat', Arial, sans-serif";
