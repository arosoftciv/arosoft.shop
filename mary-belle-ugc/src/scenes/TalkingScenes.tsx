import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COLORS } from "../config/brand";
import { CUES } from "../config/timeline";
import { TalkingHead } from "../components/TalkingHead";
import { GoldDust, GoldRule, KineticTitle } from "../components/Graphics";
import { SANS, SERIF } from "../components/fonts";
import { clamp, enter } from "../animations/motion";

export type SceneProps = { start: number; end: number };
const local = (cue: number, start: number, fps: number) => Math.round((cue - start) * fps);

/* SCÈNE 1 — HOOK : elle parle dès la 1re frame, zoom cinématique, « LES FILLES… » */
export const HookScene: React.FC<SceneProps> = ({ start }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <TalkingHead globalStartFrame={Math.round(start * fps)} zoomFrom={1.12} zoomTo={1.02} focus="52% 30%" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <KineticTitle text="LES FILLES…" delay={local(CUES.lesFilles, start, fps)} stagger={6} size={120} />
        <GoldRule delay={local(CUES.lesFilles, start, fps) + 10} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* SCÈNE 2 — CURIOSITÉ : « VAJACIAL ? » + point d'interrogation animé */
export const CuriositeScene: React.FC<SceneProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = local(CUES.vajacialQ, start, fps);
  const p = enter(frame, fps, d, 11);
  const qBounce = Math.sin(Math.max(0, frame - d) / 6) * 8 * Math.exp(-Math.max(0, frame - d) / 40);
  const ring = interpolate(frame - d, [0, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <TalkingHead globalStartFrame={Math.round(start * fps)} zoomFrom={1.02} zoomTo={1.09} focus="50% 32%" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
        <div style={{ position: "relative", opacity: p, transform: `scale(${0.7 + 0.3 * p})` }}>
          {/* halo élégant autour du mot */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 760 * ring,
              height: 250 * ring,
              transform: "translate(-50%,-50%)",
              borderRadius: 999,
              border: `2px solid ${COLORS.goldLight}`,
              opacity: 1 - ring * 0.6,
            }}
          />
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 132,
              color: COLORS.ivory,
              letterSpacing: 3,
              textShadow: "0 8px 34px rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            VAJACIAL
            <span
              style={{
                display: "inline-block",
                color: COLORS.rose,
                fontSize: 160,
                transform: `translateY(${qBounce}px) rotate(${qBounce}deg)`,
              }}
            >
              ?
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* SCÈNE 7 — PRIX : le prix est l'élément dominant (brillance dorée + micro-animation) */
export const PrixScene: React.FC<SceneProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = local(CUES.devinez, start, fps) + 20;
  const priceIn = local(CUES.prix, start, fps);
  const pc = enter(frame, fps, cardIn, 15);
  const pp = enter(frame, fps, priceIn, 9);
  const shine = interpolate(frame - priceIn, [6, 40], [-120, 220], clamp);
  const breathe = 1 + 0.018 * Math.sin(Math.max(0, frame - priceIn) / 7);
  return (
    <AbsoluteFill>
      <TalkingHead globalStartFrame={Math.round(start * fps)} zoomFrom={1.0} zoomTo={1.05} focus="50% 20%" />
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1010 }}>
        <div
          style={{
            width: 900,
            padding: "46px 40px 54px",
            borderRadius: 44,
            textAlign: "center",
            background: `linear-gradient(160deg, ${COLORS.ivory} 0%, ${COLORS.champagne} 100%)`,
            border: `3px solid ${COLORS.gold}`,
            boxShadow: "0 30px 80px rgba(73,48,45,0.45)",
            opacity: pc,
            transform: `translateY(${(1 - pc) * 120}px) scale(${0.92 + 0.08 * pc})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: COLORS.gold }}>
            {BRAND.service}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 6, color: COLORS.brown, marginTop: 18 }}>
            {BRAND.pricePrefix}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 190,
              lineHeight: 1,
              marginTop: 10,
              color: COLORS.brown,
              opacity: pp,
              transform: `scale(${(0.6 + 0.4 * pp) * breathe})`,
              letterSpacing: -2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {BRAND.price}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLORS.gold, letterSpacing: 6, opacity: pp }}>
            {BRAND.currency}
          </div>
          {/* reflet doré qui balaie la carte */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: "35%",
              background: "linear-gradient(100deg, transparent, rgba(255,240,200,0.75), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
        </div>
      </AbsoluteFill>
      <GoldDust count={18} seed={7} opacity={interpolate(frame - priceIn, [0, 12], [0, 0.8], clamp)} />
    </AbsoluteFill>
  );
};

/* SCÈNE 8 — CONNEXION ÉMOTIONNELLE : plan rapproché + « PRENEZ SOIN DE VOUS » */
export const EmotionScene: React.FC<SceneProps> = ({ start }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <TalkingHead globalStartFrame={Math.round(start * fps)} zoomFrom={1.16} zoomTo={1.24} focus="52% 28%" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <KineticTitle
          text="Prenez soin de vous"
          delay={local(CUES.prenez, start, fps) - 8}
          stagger={5}
          size={104}
          italic
          weight={500}
        />
        <GoldRule delay={local(CUES.prenez, start, fps) + 12} width={320} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
