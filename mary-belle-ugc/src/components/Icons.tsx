import React from "react";
import { COLORS } from "../config/brand";

/** Icônes fines (trait 2.2px) — élégantes, non médicales. */
type P = { size?: number; color?: string };
const base = (size: number, color: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: color,
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Goutte + bulles : nettoyage */
export const IconCleanse: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <path d="M24 6c6 8 11 14 11 20a11 11 0 0 1-22 0c0-6 5-12 11-20z" />
    <circle cx="36" cy="10" r="2.5" />
    <circle cx="40" cy="18" r="1.6" />
  </svg>
);
/** Grain doux : exfoliation */
export const IconExfoliate: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <circle cx="24" cy="24" r="15" />
    {[
      [18, 18],
      [28, 16],
      [31, 26],
      [21, 29],
      [25, 23],
      [16, 25],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1.3" fill={color} />
    ))}
  </svg>
);
/** Feuille + gouttelette : hydratation */
export const IconHydrate: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <path d="M10 38C10 20 22 10 40 9c0 18-10 30-28 30" />
    <path d="M10 38l16-16" />
  </svg>
);
/** Plume : douceur */
export const IconFeather: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <path d="M38 8C24 10 14 20 12 36l-2 4" />
    <path d="M38 8c0 14-8 24-24 26" />
    <path d="M20 22h10M16 29h9" />
  </svg>
);
/** Étincelle : hygiène */
export const IconSparkle: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <path d="M24 6l3.5 10.5L38 20l-10.5 3.5L24 34l-3.5-10.5L10 20l10.5-3.5z" />
    <path d="M37 32l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
  </svg>
);
/** Cœur : confort */
export const IconHeart: React.FC<P> = ({ size = 56, color = COLORS.brown }) => (
  <svg {...base(size, color)}>
    <path d="M24 40S8 30 8 18a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 12-16 22-16 22z" />
  </svg>
);

/** Logo WhatsApp (pictogramme générique bulle + combiné). */
export const IconWhatsApp: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="24" fill={COLORS.whatsapp} />
    <path
      d="M24 10.5c-7.4 0-13.4 5.9-13.4 13.2 0 2.5.7 4.9 2 6.9L11 37l6.6-1.7c1.9 1 4.1 1.6 6.4 1.6 7.4 0 13.4-5.9 13.4-13.2S31.4 10.5 24 10.5z"
      fill="none"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M19.3 17.6c.3-.6.6-.6.9-.6h.8c.2 0 .5 0 .7.6l1 2.4c.1.3 0 .5-.1.7l-.7.9c-.1.2-.2.4 0 .7.5.9 1.2 1.7 2 2.4.8.6 1.6 1.1 2.5 1.4.3.1.5 0 .7-.2l.9-1.1c.2-.3.5-.3.8-.2l2.3 1.1c.3.1.5.3.5.5 0 .6-.1 1.6-.9 2.2-.8.7-2 1-3.2.7-1.6-.4-3.2-1.2-4.6-2.4-1.6-1.4-2.8-3-3.4-4.6-.5-1.3-.3-2.7.4-3.5z"
      fill="#fff"
    />
  </svg>
);
