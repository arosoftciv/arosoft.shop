import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COLORS, MEDIA } from "../config/brand";
import { CUES } from "../config/timeline";
import { BRollSequence } from "../components/BRoll";
import { TalkingHead } from "../components/TalkingHead";
import { Chip, GoldDust, GoldRule, KineticTitle, StepCard } from "../components/Graphics";
import {
  IconCleanse,
  IconExfoliate,
  IconFeather,
  IconHeart,
  IconHydrate,
  IconSparkle,
} from "../components/Icons";
import { SANS, SERIF } from "../components/fonts";
import { clamp, enter } from "../animations/motion";
import type { SceneProps } from "./TalkingScenes";

const local = (cue: number, start: number, fps: number) => Math.round((cue - start) * fps);
const f = (s: number, fps: number) => Math.round(s * fps);

/** Mention visuelle : images illustratives, pas l'établissement réel. */
const IllustrativeTag: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 360px 40px" }}>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 22,
        fontWeight: 500,
        color: "rgba(255,249,245,0.8)",
        background: "rgba(0,0,0,0.25)",
        padding: "4px 12px",
        borderRadius: 8,
      }}
    >
      Images d'illustration
    </div>
  </AbsoluteFill>
);

/* SCÈNE 3 — DÉCOUVERTE : institut premium + badge marque/lieu */
export const DecouverteScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = f(end - start, fps);
  const half = Math.round(total * 0.52);
  const b = enter(frame, fps, local(CUES.maryBelle1, start, fps) - 4, 15);
  const loc = enter(frame, fps, local(CUES.riviera1, start, fps), 15);
  return (
    <AbsoluteFill>
      <BRollSequence
        shots={[
          { src: MEDIA.broll.reception, frames: half, move: "in" },
          { src: MEDIA.broll.cabine, frames: total - half, move: "left" },
        ]}
      />
      <GoldDust count={14} seed={3} opacity={0.5} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <div
          style={{
            opacity: b,
            transform: `translateY(${(1 - b) * 40}px)`,
            textAlign: "center",
            background: "rgba(255,249,245,0.9)",
            borderRadius: 36,
            padding: "34px 56px",
            border: `2px solid ${COLORS.gold}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 92, color: COLORS.brown, lineHeight: 1 }}>
            Mary Belle
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 14, color: COLORS.gold, marginTop: 8 }}>
            COSMETICS
          </div>
          <div
            style={{
              marginTop: 22,
              opacity: loc,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 4,
              color: COLORS.brown,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {BRAND.location}
          </div>
        </div>
      </AbsoluteFill>
      <IllustrativeTag />
    </AbsoluteFill>
  );
};

/* SCÈNE 4 — EXPLICATION : visage / cheveux / ongles → soin du maillot */
export const ExplicationScene: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const thStart = 19.4;
  const brollFrames = f(thStart - start, fps);
  const visageFrames = f(CUES.cheveux - 0.2 - start, fps);
  const chips: { label: string; cue: number; hl?: boolean }[] = [
    { label: "VISAGE", cue: CUES.visage },
    { label: "CHEVEUX", cue: CUES.cheveux },
    { label: "ONGLES", cue: CUES.ongles },
    { label: "SOIN DU MAILLOT", cue: CUES.zoneIntime, hl: true },
  ];
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={brollFrames + 8}>
        <BRollSequence
          shots={[
            { src: MEDIA.broll.visage, frames: visageFrames, move: "in", focus: "50% 35%" },
            { src: MEDIA.broll.manucure, frames: brollFrames + 8 - visageFrames, move: "right" },
          ]}
        />
      </Sequence>
      <Sequence from={brollFrames}>
        <FadeIn>
          <TalkingHead globalStartFrame={f(thStart, fps)} zoomFrom={1.03} zoomTo={1.08} />
        </FadeIn>
      </Sequence>
      <AbsoluteFill style={{ alignItems: "flex-start", paddingTop: 300, paddingLeft: 60, gap: 22, flexDirection: "column" }}>
        {chips.map((c) => (
          <Chip
            key={c.label}
            label={c.label}
            delay={local(c.cue, start, fps) - 3}
            highlight={c.hl}
            icon={c.hl ? <IconSparkle size={44} color={COLORS.brown} /> : undefined}
          />
        ))}
      </AbsoluteFill>
      <Sequence durationInFrames={brollFrames}>
        <IllustrativeTag />
      </Sequence>
    </AbsoluteFill>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode; frames?: number }> = ({ children, frames = 8 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(frame, [0, frames], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

/** Illustration abstraite NON anatomique : ondes douces évoquant la peau. */
const SkinWaves: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.55 }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="wg" x1="0" x2="1">
            <stop offset="0" stopColor={COLORS.rose} />
            <stop offset="0.5" stopColor={COLORS.goldLight} />
            <stop offset="1" stopColor={COLORS.rose} />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 300 + i * 150;
          const ph = frame / 22 + i * 0.7;
          const d = `M -50 ${y} C 250 ${y - 60 * Math.sin(ph)}, 700 ${y + 70 * Math.cos(ph)}, 1130 ${y - 30 * Math.sin(ph + 1)}`;
          return <path key={i} d={d} stroke="url(#wg)" strokeWidth={2.5} fill="none" opacity={0.35 + 0.06 * i} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* SCÈNE 5 — LE VAJACIAL : définition + 3 cartes animées */
export const VajacialScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = f(end - start, fps);
  const first = f(CUES.nettoyage - 0.3 - start, fps);
  const panel = interpolate(frame, [first - 6, first + 8], [0, 1], clamp);
  const titleOut = interpolate(frame, [first - 8, first + 2], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <BRollSequence
        shots={[
          { src: MEDIA.broll.produits, frames: first, move: "out" },
          { src: MEDIA.broll.cabine, frames: total - first, move: "up" },
        ]}
      />
      {/* voile champagne pour les cartes */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(245,231,211,0.0) 0%, rgba(245,231,211,0.82) 25%, rgba(232,183,200,0.82) 100%)`,
          opacity: panel,
        }}
      />
      <AbsoluteFill style={{ opacity: panel }}>
        <SkinWaves />
      </AbsoluteFill>
      {/* Définition */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, opacity: titleOut }}>
        <KineticTitle text="LE VAJACIAL" size={116} delay={2} stagger={6} />
        <GoldRule delay={12} width={300} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: 2,
            color: COLORS.ivory,
            textAlign: "center",
            maxWidth: 820,
            textShadow: "0 4px 18px rgba(0,0,0,0.45)",
            opacity: interpolate(frame, [16, 28], [0, 1], clamp),
          }}
        >
          Soin esthétique de la peau du maillot
        </div>
      </AbsoluteFill>
      {/* Trois cartes */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 34, flexDirection: "column", perspective: 1200 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: COLORS.brown, opacity: panel }}>
          Le soin en 3 étapes
        </div>
        <StepCard index={1} label="Nettoyage" delay={local(CUES.nettoyage, start, fps) - 3} icon={<IconCleanse />} />
        <StepCard index={2} label="Exfoliation douce" delay={local(CUES.exfoliation, start, fps) - 3} icon={<IconExfoliate />} />
        <StepCard index={3} label="Hydratation" delay={local(CUES.hydratation, start, fps) - 3} icon={<IconHydrate />} />
      </AbsoluteFill>
      <Sequence durationInFrames={first}>
        <IllustrativeTag />
      </Sequence>
    </AbsoluteFill>
  );
};

/* SCÈNE 6 — SAVOIR-FAIRE : douceur / hygiène / confort (icônes fines) */
export const SavoirFaireScene: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = f(end - start, fps);
  const items = [
    { label: "DOUCEUR", cue: CUES.douceur, icon: <IconFeather size={70} color={COLORS.brown} /> },
    { label: "HYGIÈNE", cue: CUES.hygiene, icon: <IconSparkle size={70} color={COLORS.brown} /> },
    { label: "CONFORT", cue: CUES.confort, icon: <IconHeart size={70} color={COLORS.brown} /> },
  ];
  return (
    <AbsoluteFill>
      <BRollSequence shots={[{ src: MEDIA.broll.estheticienne, frames: total, move: "in", focus: "50% 30%" }]} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 60,
            color: COLORS.ivory,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            opacity: interpolate(frame, [4, 16], [0, 1], clamp),
          }}
        >
          Chez Mary Belle
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 36 }}>
          {items.map((it) => {
            const p = enter(frame, fps, local(it.cue, start, fps) - 3, 12);
            return (
              <div
                key={it.label}
                style={{
                  width: 300,
                  padding: "34px 0 30px",
                  borderRadius: 30,
                  background: "rgba(255,249,245,0.92)",
                  border: `2px solid ${COLORS.gold}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                }}
              >
                {it.icon}
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: COLORS.brown }}>
                  {it.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <IllustrativeTag />
    </AbsoluteFill>
  );
};
