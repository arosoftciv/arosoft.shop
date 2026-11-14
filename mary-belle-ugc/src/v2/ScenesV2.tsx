import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, COLORS } from "../config/brand";
import { Chip, GoldDust, GoldRule, KineticTitle, Logotype } from "../components/Graphics";
import {
  IconCleanse,
  IconExfoliate,
  IconFeather,
  IconHeart,
  IconHydrate,
  IconSparkle,
  IconWhatsApp,
} from "../components/Icons";
import { SANS, SERIF } from "../components/fonts";
import { clamp, enter } from "../animations/motion";
import { V2_MEDIA, cue } from "./config";

export type SceneProps = { start: number; end: number };
const lf = (t: number, start: number, fps: number) => Math.round((t - start) * fps);

/* ------------------------------------------------------------------ */
/* Briques                                                             */
/* ------------------------------------------------------------------ */

/**
 * Vidéo muette plein cadre. Si le clip est plus court que la fenêtre, il est
 * légèrement ralenti (jamais accéléré) pour la remplir sans figer.
 */
export const VideoFill: React.FC<{
  src: string;
  clipDur: number;
  windowSec: number;
  from?: number;
  blur?: number;
  zoom?: [number, number];
  focus?: string;
}> = ({ src, clipDur, windowSec, from = 0, blur = 0, zoom = [1.02, 1.08], focus = "50% 40%" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const avail = Math.max(0.5, clipDur - from);
  const rate = Math.min(1, avail / windowSec);
  const s = interpolate(frame, [0, durationInFrames], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1a1110" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: focus }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          playbackRate={rate}
          trimBefore={Math.round(from * fps)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: blur ? `blur(${blur}px) saturate(1.05)` : undefined,
            transform: blur ? "scale(1.2)" : undefined,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(73,48,45,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 58%, rgba(73,48,45,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Elle, face caméra, qui parle (OmniHuman). Sans vidéo : image fixe + filigrane. */
const TalkingClip: React.FC<{ src: string | null; zoom?: [number, number] }> = ({ src, zoom = [1.0, 1.05] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 30%" }}>
        {src ? (
          <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={staticFile(V2_MEDIA.baseStill)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(73,48,45,0.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(73,48,45,0.55) 100%)",
        }}
      />
      {!src && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              transform: "rotate(-24deg)",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 50,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.32)",
              border: "4px solid rgba(255,255,255,0.32)",
              padding: "18px 34px",
              textAlign: "center",
              lineHeight: 1.25,
            }}
          >
            APERÇU — VIDÉO PARLÉE EN ATTENTE
            <br />
            <span style={{ fontSize: 28, fontWeight: 600 }}>image fixe, non diffusable</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const RoundLogo: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 15);
  if (!BRAND.logo) return <Logotype size={size / 520} />;
  return (
    <Img
      src={staticFile(BRAND.logo)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        boxShadow: `0 ${size * 0.05}px ${size * 0.14}px rgba(0,0,0,0.45), 0 0 0 ${Math.max(2, size * 0.008)}px rgba(201,164,106,0.6)`,
        opacity: p,
        transform: `scale(${0.82 + 0.18 * p})`,
      }}
    />
  );
};

const Pill: React.FC<{ text: string; delay: number; icon?: React.ReactNode; light?: boolean }> = ({
  text,
  delay,
  icon,
  light = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 26px",
        borderRadius: 999,
        background: light ? "rgba(255,249,245,0.92)" : "rgba(73,48,45,0.7)",
        border: `2px solid ${COLORS.gold}`,
        color: light ? COLORS.brown : COLORS.ivory,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: 3,
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      {icon}
      {text}
    </div>
  );
};

const IllustrativeTag: React.FC<{ label?: string }> = ({ label = "Images d'illustration" }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 360px 40px" }}>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 22,
        fontWeight: 500,
        color: "rgba(255,249,245,0.85)",
        background: "rgba(0,0,0,0.28)",
        padding: "4px 12px",
        borderRadius: 8,
      }}
    >
      {label}
    </div>
  </AbsoluteFill>
);

const Veil: React.FC<{ strength?: number }> = ({ strength = 0.84 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(245,231,211,${strength}) 0%, rgba(232,183,200,${strength - 0.05}) 100%)`,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */

/* S01 — elle parle (début) : « Mesdames, venez un peu ! … Le Vajacial ! » */
export const S01Intro: React.FC<SceneProps> = ({ start }) => {
  const { fps } = useVideoConfig();
  const t1 = lf(cue("s01", "vajacial", 0), start, fps);
  return (
    <AbsoluteFill>
      <TalkingClip src={V2_MEDIA.talkIntro} zoom={[1.0, 1.06]} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1070 }}>
        <KineticTitle text="LE VAJACIAL" delay={t1 - 3} stagger={6} size={110} />
        <GoldRule delay={t1 + 8} width={320} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S02 — elle à l'accueil (vidéo muette) + logo + lieu */
export const S02Accueil: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.accueil;
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} focus="55% 30%" />
      <AbsoluteFill style={{ alignItems: "flex-end", paddingTop: 300, paddingRight: 40 }}>
        <RoundLogo size={230} delay={lf(cue("s02", "mary"), start, fps) - 4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1130 }}>
        <Pill
          text={BRAND.location}
          delay={lf(cue("s02", "riviera"), start, fps) - 3}
          icon={
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          }
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S03 — visage / cheveux / ongles : manucure puis produits (sans visage) */
export const S03Visage: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const p = V2_MEDIA.clips.produits;
  return (
    <AbsoluteFill>
      <VideoFill src={p.src} clipDur={p.dur} windowSec={end - start} zoom={[1.0, 1.1]} />
      <AbsoluteFill style={{ alignItems: "flex-start", paddingTop: 300, paddingLeft: 56, gap: 18, flexDirection: "column" }}>
        <Chip label="VISAGE" delay={lf(cue("s03", "visage"), start, fps) - 3} />
        <Chip label="CHEVEUX" delay={lf(cue("s03", "cheveux"), start, fps) - 3} />
        <Chip label="ONGLES" delay={lf(cue("s03", "ongles"), start, fps) - 3} />
      </AbsoluteFill>
      <IllustrativeTag />
    </AbsoluteFill>
  );
};

/* S04 — « et la peau de notre zone intime externe ? » : cabine (sans personne) */
export const S04Zone: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.cabine;
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 320 }}>
        <Chip
          label="ET LA PEAU DU MAILLOT ?"
          delay={lf(cue("s04", "zone"), start, fps) - 4}
          highlight
          icon={<IconSparkle size={42} color={COLORS.brown} />}
        />
      </AbsoluteFill>
      <IllustrativeTag />
    </AbsoluteFill>
  );
};

/* S05 — Vajacial ≠ épilation : carte comparative */
const CompareCard: React.FC<{
  title: string;
  text: string;
  delay: number;
  highlight?: boolean;
  icon: React.ReactNode;
}> = ({ title, text, delay, highlight = false, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, 14);
  return (
    <div
      style={{
        width: 450,
        minHeight: 420,
        borderRadius: 36,
        padding: "40px 30px",
        background: highlight
          ? `linear-gradient(160deg, ${COLORS.ivory}, ${COLORS.champagne})`
          : "rgba(255,249,245,0.78)",
        border: `${highlight ? 3 : 2}px solid ${highlight ? COLORS.gold : "rgba(201,164,106,0.6)"}`,
        boxShadow: highlight ? "0 24px 60px rgba(73,48,45,0.35)" : "0 12px 30px rgba(73,48,45,0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) scale(${(highlight ? 1.02 : 0.96) * (0.9 + 0.1 * p)})`,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: highlight ? `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.champagne})` : "rgba(73,48,45,0.08)",
          border: `2px solid ${COLORS.gold}`,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 4, color: COLORS.brown }}>{title}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, lineHeight: 1.2, color: COLORS.brown }}>{text}</div>
    </div>
  );
};

export const S05Epilation: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.cabine;
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} blur={30} />
      <Veil strength={0.8} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
        <KineticTitle
          text="Le Vajacial n'est pas une épilation"
          delay={lf(cue("s05", "vajacial"), start, fps) - 4}
          stagger={3}
          size={64}
          italic
          weight={500}
          color={COLORS.brown}
        />
        <GoldRule delay={lf(cue("s05", "vajacial"), start, fps) + 10} width={320} />
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          <CompareCard
            title="ÉPILATION"
            text="Enlève les poils"
            delay={lf(cue("s05", "l'épilation", 1), start, fps) - 3}
            icon={
              <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={COLORS.brown} strokeWidth="2.2" strokeLinecap="round">
                <path d="M10 34c6-2 10-8 14-14s8-10 14-12" />
                <path d="M14 38l20-20" />
              </svg>
            }
          />
          <CompareCard
            title="VAJACIAL"
            text="Prend soin de la peau du maillot"
            delay={lf(cue("s05", "vajacial", 1), start, fps) - 3}
            highlight
            icon={<IconSparkle size={50} color={COLORS.brown} />}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S06 — les étapes : extrait vidéo pratique + 3 pastilles */
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
        height: 150,
        borderRadius: 30,
        background: "rgba(255,249,245,0.95)",
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

export const S06Etapes: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.pratique;
  const cardIn = enter(frame, fps, 3, 16);
  const rate = Math.min(1, c.dur / (end - start));
  const steps = [
    { label: "Nettoyage", t: cue("s06", "nettoie"), icon: <IconCleanse size={52} /> },
    { label: "Exfoliation douce", t: cue("s06", "exfolie"), icon: <IconExfoliate size={52} /> },
    { label: "Hydratation", t: cue("s06", "hydrate"), icon: <IconHydrate size={52} /> },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.champagne }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(c.src)}
          muted
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)", filter: "blur(36px) saturate(1.1)" }}
        />
      </AbsoluteFill>
      <Veil strength={0.86} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 66, color: COLORS.brown }}>
          Le soin, étape par étape
        </div>
        <GoldRule delay={6} width={300} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
        <div
          style={{
            width: 960,
            height: 960,
            borderRadius: 44,
            overflow: "hidden",
            border: `3px solid ${COLORS.gold}`,
            boxShadow: "0 30px 80px rgba(73,48,45,0.45)",
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 60}px) scale(${0.92 + 0.08 * cardIn})`,
          }}
        >
          <OffthreadVideo src={staticFile(c.src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1150 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {steps.map((st, i) => (
            <StepPill key={st.label} index={i + 1} label={st.label} icon={st.icon} delay={lf(st.t, start, fps) - 3} />
          ))}
        </div>
      </AbsoluteFill>
      <IllustrativeTag label="Vidéo d'illustration" />
    </AbsoluteFill>
  );
};

/* S07 — complément de la routine beauté : elle enfile les gants */
export const S07Complement: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.gants;
  const d = lf(cue("s07", "complément"), start, fps) - 4;
  const p = enter(frame, fps, d, 15);
  const d2 = lf(cue("s07", "l'épilation"), start, fps) - 3;
  const p2 = enter(frame, fps, d2, 15);
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} focus="50% 30%" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 960 }}>
        <div
          style={{
            width: 880,
            padding: "30px 40px",
            borderRadius: 34,
            background: "rgba(255,249,245,0.93)",
            border: `2px solid ${COLORS.gold}`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            textAlign: "center",
            opacity: p,
            transform: `translateY(${(1 - p) * 50}px)`,
          }}
        >
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 3, color: COLORS.brown }}>
            UN COMPLÉMENT À VOTRE ROUTINE BEAUTÉ
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 36,
              color: COLORS.gold,
              opacity: p2,
            }}
          >
            autour de l'épilation, quand la peau est prête
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S08 — douceur / hygiène / confort : elle dispose les serviettes */
export const S08Douceur: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.serviettes;
  const items = [
    { label: "DOUCEUR", t: cue("s08", "douceur"), icon: <IconFeather size={62} color={COLORS.brown} /> },
    { label: "HYGIÈNE", t: cue("s08", "l'hygiène"), icon: <IconSparkle size={62} color={COLORS.brown} /> },
    { label: "CONFORT", t: cue("s08", "confort"), icon: <IconHeart size={62} color={COLORS.brown} /> },
  ];
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} focus="50% 30%" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 980 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {items.map((it) => {
            const p = enter(frame, fps, lf(it.t, start, fps) - 3, 12);
            return (
              <div
                key={it.label}
                style={{
                  width: 290,
                  padding: "28px 0 24px",
                  borderRadius: 30,
                  background: "rgba(255,249,245,0.93)",
                  border: `2px solid ${COLORS.gold}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                }}
              >
                {it.icon}
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: COLORS.brown }}>
                  {it.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S09 — prix : produits (sans personne) + carte de prix dominante */
export const S09Prix: React.FC<SceneProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.produits;
  const cardIn = lf(cue("s09", "votre"), start, fps) - 2;
  const priceIn = lf(cue("s09", "vingt-cinq"), start, fps);
  const pc = enter(frame, fps, cardIn, 15);
  const pp = enter(frame, fps, priceIn, 9);
  const shine = interpolate(frame - priceIn, [6, 40], [-120, 220], clamp);
  const breathe = 1 + 0.018 * Math.sin(Math.max(0, frame - priceIn) / 7);
  const hook = enter(frame, fps, 2, 15);
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} blur={22} from={2} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, opacity: hook * (1 - pc) }}>
        <KineticTitle text="Pas besoin de vous ruiner" delay={lf(cue("s09", "pas"), start, fps) - 4} stagger={4} size={72} italic weight={500} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 520 }}>
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
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: COLORS.gold }}>{BRAND.service}</div>
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
            }}
          >
            {BRAND.price}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: COLORS.gold, letterSpacing: 6, opacity: pp }}>
            {BRAND.currency}
          </div>
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
      <IllustrativeTag />
    </AbsoluteFill>
  );
};

/* S10 — « Accordez-vous ce moment » : elle près de la fenêtre */
export const S10Meritez: React.FC<SceneProps> = ({ start, end }) => {
  const { fps } = useVideoConfig();
  const c = V2_MEDIA.clips.fenetre;
  return (
    <AbsoluteFill>
      <VideoFill src={c.src} clipDur={c.dur} windowSec={end - start} focus="45% 30%" zoom={[1.0, 1.06]} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1090 }}>
        <KineticTitle
          text="Accordez-vous ce moment"
          delay={lf(cue("s10", "accordez"), start, fps) - 4}
          stagger={4}
          size={70}
          italic
          weight={500}
        />
        <GoldRule delay={lf(cue("s10", "méritez"), start, fps) - 4} width={320} />
        <KineticTitle text="Vous le méritez" delay={lf(cue("s10", "vous", 1), start, fps) - 4} stagger={4} size={56} serif={false} weight={700} letterSpacing={3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S11 — écran WhatsApp */
export const S11WhatsApp: React.FC<SceneProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (d: number) => enter(frame, fps, d, 15);
  const notifIn = lf(cue("s11", "whatsapp"), start, fps) - 4;
  const n = enter(frame, fps, notifIn, 12);
  const groupCues = [notifIn + 6, ...["zéro", "quatre-vingt-huit", "quatre-vingt-quatre", "cinquante", "quarante"].map((w) => lf(cue("s11", w), start, fps) - 2)];
  // "07" apparaît avec « zéro sept »
  const btnIn = lf(cue("s11", "quarante"), start, fps) + 18;
  const btn = enter(frame, fps, btnIn, 12);
  const pulse = 1 + 0.035 * Math.max(0, Math.sin((frame - btnIn) / 6));
  const bg = interpolate(frame, [0, 300], [0, 30], clamp);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% ${20 + bg}%, ${COLORS.ivory} 0%, ${COLORS.champagne} 45%, ${COLORS.rose} 100%)`,
      }}
    >
      <GoldDust count={26} seed={11} opacity={0.6} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <RoundLogo size={320} delay={0} />
        <GoldRule delay={8} width={360} />
        <div style={{ opacity: a(10), fontFamily: SANS, fontWeight: 700, fontSize: 48, letterSpacing: 10, color: COLORS.brown }}>
          {BRAND.service}
        </div>
        <div style={{ opacity: a(16), marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 80, color: COLORS.brown }}>
          <span style={{ fontSize: 44, color: COLORS.gold, letterSpacing: 4, marginRight: 14 }}>{BRAND.priceShortPrefix}</span>
          {BRAND.price} <span style={{ color: COLORS.gold }}>{BRAND.currency}</span>
        </div>
        <div style={{ opacity: a(24), marginTop: 12, fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: COLORS.brown }}>
          {BRAND.location} — {BRAND.city}
        </div>
        <div
          style={{
            marginTop: 46,
            width: 900,
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: "26px 34px",
            borderRadius: 34,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 24px 60px rgba(73,48,45,0.25)",
            opacity: n,
            transform: `translateY(${(1 - n) * -60}px) scale(${0.9 + 0.1 * n})`,
          }}
        >
          <IconWhatsApp size={108} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#128C7E" }}>WHATSAPP</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: COLORS.brown, whiteSpace: "nowrap" }}>
              {BRAND.whatsappGroups.map((g, i) => {
                const p = enter(frame, fps, groupCues[i] ?? groupCues[groupCues.length - 1], 12);
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      marginRight: 16,
                      opacity: p,
                      transform: `translateY(${(1 - p) * 26}px)`,
                      color: i === 0 ? COLORS.gold : COLORS.brown,
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 46,
            padding: "32px 58px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.brown}, #6b4540)`,
            border: `3px solid ${COLORS.gold}`,
            color: COLORS.ivory,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 3,
            boxShadow: "0 20px 50px rgba(73,48,45,0.45)",
            opacity: btn,
            transform: `scale(${(0.8 + 0.2 * btn) * pulse})`,
          }}
        >
          {BRAND.cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S12 — elle parle (fin) + logo + signature, puis carton final */
export const S12Signature: React.FC<SceneProps & { tailFrames: number }> = ({ start, end, tailFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speak = Math.round((end - start) * fps);
  const endCard = interpolate(frame, [speak - 6, speak + 10], [0, 1], clamp);
  const fadeOut = interpolate(frame, [speak + tailFrames - 16, speak + tailFrames], [1, 0], clamp);
  const tag = lf(cue("s12", "votre"), start, fps);
  return (
    <AbsoluteFill style={{ opacity: fadeOut, backgroundColor: "#000" }}>
      <TalkingClip src={V2_MEDIA.talkSignature} zoom={[1.04, 1.08]} />
      <AbsoluteFill style={{ alignItems: "flex-end", paddingTop: 300, paddingRight: 34, opacity: 1 - endCard }}>
        <RoundLogo size={210} delay={2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 430, opacity: 1 - endCard }}>
        <div style={{ maxWidth: 940 }}>
          <KineticTitle text="Votre beauté, votre douceur, votre bien-être" delay={tag - 3} stagger={4} size={62} italic weight={500} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: endCard,
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(110% 70% at 50% 40%, ${COLORS.ivory}, ${COLORS.champagne} 60%, ${COLORS.rose})`,
        }}
      >
        <GoldDust count={20} seed={21} opacity={0.6} />
        <RoundLogo size={560} delay={speak - 6} />
        <GoldRule delay={speak} width={380} />
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 48, color: COLORS.brown, textAlign: "center" }}>
          Votre beauté, votre douceur, votre bien-être
        </div>
        <div style={{ marginTop: 36, fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: COLORS.brown }}>
          WhatsApp {BRAND.whatsappDisplay}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
