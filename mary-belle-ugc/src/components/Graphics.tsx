import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COLORS } from "../config/brand";
import { clamp, enter } from "../animations/motion";
import { SANS, SERIF } from "./fonts";

/** Titre cinétique : apparition mot par mot (montée + fondu + léger flou). */
export const KineticTitle: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  color?: string;
  serif?: boolean;
  italic?: boolean;
  weight?: number;
  letterSpacing?: number;
  align?: "center" | "left";
}> = ({
  text,
  delay = 0,
  stagger = 4,
  size = 96,
  color = COLORS.ivory,
  serif = true,
  italic = false,
  weight = 600,
  letterSpacing = 1,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: serif ? SERIF : SANS,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing,
        color,
        textAlign: align,
        textShadow: "0 6px 30px rgba(0,0,0,0.35)",
      }}
    >
      {words.map((w, i) => {
        const p = enter(frame, fps, delay + i * stagger, 16);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: size * 0.25,
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.45}px)`,
              filter: `blur(${(1 - p) * 6}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Filet doré animé (ligne qui se dessine). */
export const GoldRule: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 260 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 14], [0, width], clamp);
  return (
    <div
      style={{
        height: 3,
        width: w,
        margin: "18px auto",
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold}, transparent)`,
      }}
    />
  );
};

/** Puce texte (VISAGE / CHEVEUX…) — verre dépoli + bordure dorée. */
export const Chip: React.FC<{
  label: string;
  delay?: number;
  highlight?: boolean;
  icon?: React.ReactNode;
}> = ({ label, delay = 0, highlight = false, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 38px",
        borderRadius: 999,
        background: highlight
          ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.champagne})`
          : "rgba(255,249,245,0.16)",
        border: `2px solid ${highlight ? COLORS.gold : "rgba(230,204,152,0.75)"}`,
        backdropFilter: "blur(14px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        color: highlight ? COLORS.brown : COLORS.ivory,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: 4,
        opacity: p,
        transform: `translateX(${(1 - p) * -80}px) scale(${0.9 + 0.1 * p})`,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/** Carte numérotée (NETTOYAGE / EXFOLIATION / HYDRATATION). */
export const StepCard: React.FC<{
  index: number;
  label: string;
  delay?: number;
  icon: React.ReactNode;
}> = ({ index, label, delay = 0, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 14);
  return (
    <div
      style={{
        width: 860,
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "30px 40px",
        borderRadius: 34,
        background: "rgba(255,249,245,0.92)",
        border: `2px solid ${COLORS.gold}`,
        boxShadow: "0 20px 50px rgba(73,48,45,0.30)",
        opacity: p,
        transform: `translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * 35}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.champagne})`,
          border: `2px solid ${COLORS.gold}`,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: COLORS.gold }}>
          ÉTAPE {index}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 60, color: COLORS.brown, lineHeight: 1.1 }}>
          {label}
        </div>
      </div>
    </div>
  );
};

/** Mention légale permanente — discrète mais lisible. */
export const Disclaimer: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 92, pointerEvents: "none" }}>
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: 1,
        color: "rgba(255,249,245,0.92)",
        background: "rgba(73,48,45,0.55)",
        padding: "8px 20px",
        borderRadius: 999,
        backdropFilter: "blur(8px)",
      }}
    >
      {BRAND.disclaimer}
    </div>
  </AbsoluteFill>
);

/** Logotype typographique (remplacé par BRAND.logo si fourni). */
export const Logotype: React.FC<{ size?: number; color?: string }> = ({ size = 1, color = COLORS.brown }) => (
  <div style={{ textAlign: "center", color }}>
    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 112 * size, lineHeight: 1, letterSpacing: 2 }}>
      Mary Belle
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 34 * size,
        letterSpacing: 18 * size,
        marginTop: 10 * size,
        paddingLeft: 18 * size,
        color: COLORS.gold,
      }}
    >
      COSMETICS
    </div>
  </div>
);

/** Particules dorées flottantes (profondeur subtile). */
export const GoldDust: React.FC<{ count?: number; seed?: number; opacity?: number }> = ({
  count = 22,
  seed = 1,
  opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const rnd = (i: number) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = rnd(i) * 1080;
        const speed = 0.4 + rnd(i + 99) * 1.1;
        const y = (1920 + 40 - ((frame * speed + rnd(i + 7) * 1920) % (1920 + 80))) as number;
        const r = 2 + rnd(i + 3) * 5;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 14 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 30 + i) * 14,
              top: y,
              width: r,
              height: r,
              borderRadius: "50%",
              background: COLORS.goldLight,
              boxShadow: `0 0 ${r * 3}px ${COLORS.gold}`,
              opacity: opacity * tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
