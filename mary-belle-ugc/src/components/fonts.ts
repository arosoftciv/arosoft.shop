import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const playfair = loadPlayfair("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
const playfairItalic = loadPlayfair("italic", {
  weights: ["500"],
  subsets: ["latin", "latin-ext"],
});
const montserrat = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

void playfairItalic;

/** Titres élégants */
export const SERIF = playfair.fontFamily;
/** Textes secondaires modernes + chiffres tarifaires */
export const SANS = montserrat.fontFamily;
