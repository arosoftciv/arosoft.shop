/**
 * CONFIGURATION CENTRALE — modifiez ici prix, numéro, adresse, couleurs, textes.
 * Toutes les scènes lisent ces valeurs : aucune autre modification n'est nécessaire.
 */
export const BRAND = {
  name: "MARY BELLE COSMETICS",
  nameShort: "Mary Belle",
  service: "SOIN VAJACIAL",
  pricePrefix: "À PARTIR DE",
  priceShortPrefix: "DÈS",
  price: "25 000",
  currency: "F CFA",
  location: "RIVIERA PALMERAIE",
  city: "ABIDJAN",
  whatsappDisplay: "+225 07 88 84 52 44",
  /** Groupes du numéro, révélés un à un en synchro avec la voix. */
  whatsappGroups: ["+225", "07", "88", "84", "52", "44"],
  cta: "RÉSERVEZ VOTRE RENDEZ-VOUS",
  tagline: "Parce que chaque femme mérite de se sentir belle et bien dans sa peau",
  disclaimer: "Mise en scène publicitaire — personnage IA",
  /** Chemin (dans public/) d'un logo PNG/SVG. null = logotype typographique. */
  logo: null as string | null,
} as const;

export const COLORS = {
  rose: "#E8B7C8",
  champagne: "#F5E7D3",
  gold: "#C9A46A",
  goldLight: "#E6CC98",
  brown: "#49302D",
  ivory: "#FFF9F5",
  whatsapp: "#25D366",
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  /** Silence ajouté après la dernière phrase (fondu final). */
  tailSeconds: 1.6,
} as const;

/** Fichiers médias (dans public/). */
export const MEDIA = {
  voice: "audio/voix-off.mp3",
  music: "audio/musique.mp3",
  sfx: {
    pop: "audio/sfx-pop.mp3",
    whoosh: "audio/sfx-whoosh.mp3",
    shimmer: "audio/sfx-shimmer.mp3",
    notif: "audio/sfx-notification.mp3",
  },
  /**
   * Vidéo du personnage parlant, lip-syncée sur TOUTE la voix-off
   * (même timeline que voix-off.mp3). null = mode APERÇU (photo + filigrane).
   */
  talkingHead: null as string | null,
  characterStill: "character/reference.png",
  broll: {
    reception: "images/reception.jpg",
    cabine: "images/cabine.jpg",
    visage: "images/visage.jpg",
    manucure: "images/manucure.jpg",
    produits: "images/produits.jpg",
    estheticienne: "images/estheticienne.jpg",
  },
} as const;

export const AUDIO_MIX = {
  voiceVolume: 1,
  /** Volume musique sous la voix (ducking) et en ouverture/fermeture. */
  musicUnderVoice: 0.13,
  musicOpen: 0.22,
  sfxVolume: 0.35,
} as const;
