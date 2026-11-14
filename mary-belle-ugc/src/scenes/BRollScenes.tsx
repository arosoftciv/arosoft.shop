import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
            padding: BRAND.logo ? "28px 40px" : "34px 56px",
            border: `2px solid ${COLORS.gold}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          }}
        >
          {BRAND.logo ? (
            <Img
              src={staticFile(BRAND.logo)}
              style={{
                width: 300,
                height: 300,
                borderRadius: "50%",
                display: "block",
                margin: "0 auto",
                transform: `scale(${0.85 + 0.15 * b}) rotate(${(1 - b) * -8}deg)`,
              }}
            />
          ) : (
            <>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 92, color: COLORS.brown, lineHeight: 1 }}>
                Mary Belle
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 14, color: COLORS.gold, marginTop: 8 }}>
                COSMETICS
              </div>
            </>
          )}
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
      <Sequence durationInFrames={brollFrames}>
        <BRollSequence
          shots={[
            { src: MEDIA.broll.visage, frames: visageFrames, move: "in", focus: "50% 35%" },
            { src: MEDIA.broll.manucure, frames: brollFrames - visageFrames, move: "right" },
          ]}
        />
      </Sequence>
      <Sequence from={brollFrames}>
        <TalkingHead globalStartFrame={f(thStart, fps)} zoomFrom={1.14} zoomTo={1.18} focus="50% 30%" />
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

/** Pastille d'étape (compacte) sous la vidéo pratique. */
const StepPill: React.FC<{ index: number; label: string; delay: number; icon: React.ReactNode }> = ({
  index,
  label,
  delay,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 13);
  return (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 170,
        borderRadius: 30,
        background: "rgba(255,249,245,0.94)",
        border: `2px solid ${COLORS.gold}`,
        boxShadow: "0 16px 40px rgba(73,48,45,0.28)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "0 18px",
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px) scale(${0.88 + 0.12 * p})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -18,
          left: -10,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`,
          color: COLORS.brown,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index}
      </div>
      {icon}
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 34, lineHeight: 1.1, color: COLORS.brown }}>{label}</div>
    </div>
  );
};

/* SCÈNE 5 — LE VAJACIAL : définition + extrait vidéo « pratique » (10 s) + 3 étapes */
export const VajacialScene: React.FC<SceneProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swapAt = f(CUES.nettoyage - 0.35 - start, fps);
  const titleOpacity = interpolate(frame, [swapAt - 8, swapAt + 2], [1, 0], clamp);
  const stepsOpacity = interpolate(frame, [swapAt - 2, swapAt + 8], [0, 1], clamp);
  const cardIn = enter(frame, fps, 3, 16);
  const clip = staticFile(MEDIA.pratique);
  const steps = [
    { label: "Nettoyage", cue: CUES.nettoyage, icon: <IconCleanse size={52} /> },
    { label: "Exfoliation douce", cue: CUES.exfoliation, icon: <IconExfoliate size={52} /> },
    { label: "Hydratation", cue: CUES.hydratation, icon: <IconHydrate size={52} /> },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.champagne }}>
      {/* fond : le même extrait, flouté et voilé champagne/rose */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={clip}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)", filter: "blur(36px) saturate(1.1)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(245,231,211,0.88) 0%, rgba(232,183,200,0.82) 100%)" }}
      />
      <SkinWaves />

      {/* Définition, puis « Le soin en 3 étapes » */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 215, opacity: titleOpacity }}>
        <KineticTitle text="LE VAJACIAL" size={96} delay={2} stagger={6} color={COLORS.brown} />
        <GoldRule delay={12} width={300} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 1.5,
            color: COLORS.brown,
            textAlign: "center",
            maxWidth: 860,
            opacity: interpolate(frame, [16, 28], [0, 1], clamp),
          }}
        >
          Soin esthétique de la peau du maillot
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 240, opacity: stepsOpacity }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 68, color: COLORS.brown }}>
          Le soin en 3 étapes
        </div>
        <GoldRule delay={swapAt} width={300} />
      </AbsoluteFill>

      {/* Extrait vidéo pratique (muet) */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 430 }}>
        <div
          style={{
            width: 620,
            height: 620,
            borderRadius: 44,
            overflow: "hidden",
            border: `3px solid ${COLORS.gold}`,
            boxShadow: "0 30px 80px rgba(73,48,45,0.45)",
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 60}px) scale(${0.92 + 0.08 * cardIn})`,
          }}
        >
          <OffthreadVideo src={clip} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>

      {/* Trois étapes, en synchro avec la voix */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1080 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {steps.map((st, i) => (
            <StepPill key={st.label} index={i + 1} label={st.label} icon={st.icon} delay={local(st.cue, start, fps) - 3} />
          ))}
        </div>
      </AbsoluteFill>
      <IllustrativeTag />
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
