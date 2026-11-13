import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, COLORS } from "../config/brand";
import { CUES } from "../config/timeline";
import { TalkingHead } from "../components/TalkingHead";
import { GoldDust, GoldRule, KineticTitle, Logotype } from "../components/Graphics";
import { IconWhatsApp } from "../components/Icons";
import { SANS, SERIF } from "../components/fonts";
import { clamp, enter } from "../animations/motion";
import type { SceneProps } from "./TalkingScenes";

const local = (cue: number, start: number, fps: number) => Math.round((cue - start) * fps);

const Brand: React.FC<{ size?: number; color?: string }> = ({ size = 1, color }) =>
  BRAND.logo ? (
    <Img src={staticFile(BRAND.logo)} style={{ width: 520 * size, objectFit: "contain" }} />
  ) : (
    <Logotype size={size} color={color} />
  );

/* SCÈNE 9 — CONVERSION WHATSAPP : écran final premium */
export const WhatsAppScene: React.FC<SceneProps> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (d: number) => enter(frame, fps, d, 15);
  const notifIn = local(CUES.whatsapp, start, fps) - 4;
  const n = enter(frame, fps, notifIn, 12);
  const btnIn = local(CUES.numero[5], start, fps) + 12;
  const btn = enter(frame, fps, btnIn, 12);
  const pulse = 1 + 0.035 * Math.max(0, Math.sin((frame - btnIn) / 6));
  const bg = interpolate(frame, [0, 240], [0, 30], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% ${20 + bg}%, ${COLORS.ivory} 0%, ${COLORS.champagne} 45%, ${COLORS.rose} 100%)`,
      }}
    >
      <GoldDust count={26} seed={11} opacity={0.6} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <div style={{ opacity: a(0), transform: `translateY(${(1 - a(0)) * 40}px)` }}>
          <Brand size={1} />
        </div>
        <GoldRule delay={8} width={360} />
        <div
          style={{
            opacity: a(10),
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 10,
            color: COLORS.brown,
            marginTop: 6,
          }}
        >
          {BRAND.service}
        </div>
        <div
          style={{
            opacity: a(16),
            transform: `scale(${0.9 + 0.1 * a(16)})`,
            marginTop: 14,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 84,
            color: COLORS.brown,
          }}
        >
          <span style={{ fontSize: 46, color: COLORS.gold, letterSpacing: 4, marginRight: 14 }}>{BRAND.priceShortPrefix}</span>
          {BRAND.price} <span style={{ color: COLORS.gold }}>{BRAND.currency}</span>
        </div>
        <div
          style={{
            opacity: a(24),
            marginTop: 16,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 5,
            color: COLORS.brown,
          }}
        >
          {BRAND.location} — {BRAND.city}
        </div>

        {/* Simulation de notification WhatsApp */}
        <div
          style={{
            marginTop: 54,
            width: 900,
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: "28px 34px",
            borderRadius: 34,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 24px 60px rgba(73,48,45,0.25)",
            opacity: n,
            transform: `translateY(${(1 - n) * -60}px) scale(${0.9 + 0.1 * n})`,
          }}
        >
          <IconWhatsApp size={112} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#128C7E" }}>WHATSAPP</div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 66,
                color: COLORS.brown,
                letterSpacing: 1,
                whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {BRAND.whatsappGroups.map((g, i) => {
                // +225 apparaît avec la notification, puis chaque groupe avec la voix
                const cue = i === 0 ? notifIn + 6 : local(CUES.numero[i], start, fps) - 2;
                const p = enter(frame, fps, cue, 12);
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

        {/* Bouton visuel (non cliquable dans un MP4) */}
        <div
          style={{
            marginTop: 50,
            padding: "34px 60px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.brown}, #6b4540)`,
            border: `3px solid ${COLORS.gold}`,
            color: COLORS.ivory,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 42,
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

/* SCÈNE 10 — SIGNATURE : elle conclut, puis logotype + signature + fondu doux */
export const SignatureScene: React.FC<SceneProps & { tailFrames: number }> = ({ start, end, tailFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speakFrames = Math.round((end - start) * fps);
  const tagIn = local(CUES.parceQue, start, fps);
  const endCard = interpolate(frame, [speakFrames - 10, speakFrames + 8], [0, 1], clamp);
  const fadeOut = interpolate(frame, [speakFrames + tailFrames - 18, speakFrames + tailFrames], [1, 0], clamp);
  const brandIn = enter(frame, fps, local(CUES.maryBelle3, start, fps) - 2, 15);
  return (
    <AbsoluteFill style={{ opacity: fadeOut, backgroundColor: "#000" }}>
      <TalkingHead globalStartFrame={Math.round(start * fps)} zoomFrom={1.06} zoomTo={1.0} focus="50% 30%" />
      {/* Bandeau marque */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <div
          style={{
            opacity: brandIn * (1 - endCard),
            transform: `translateY(${(1 - brandIn) * 30}px)`,
            background: "rgba(255,249,245,0.88)",
            borderRadius: 36,
            padding: "26px 48px",
            border: `2px solid ${COLORS.gold}`,
          }}
        >
          <Brand size={0.75} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 420, opacity: 1 - endCard }}>
        <div style={{ maxWidth: 900 }}>
          <KineticTitle
            text="Parce que chaque femme mérite de se sentir belle et bien dans sa peau"
            delay={tagIn}
            stagger={3}
            size={64}
            italic
            weight={500}
          />
        </div>
      </AbsoluteFill>
      {/* Carton final */}
      <AbsoluteFill
        style={{
          opacity: endCard,
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(110% 70% at 50% 40%, ${COLORS.ivory}, ${COLORS.champagne} 60%, ${COLORS.rose})`,
        }}
      >
        <GoldDust count={20} seed={21} opacity={0.6} />
        <Brand size={1.15} />
        <GoldRule delay={speakFrames} width={380} />
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 50,
            color: COLORS.brown,
            textAlign: "center",
            maxWidth: 860,
            lineHeight: 1.25,
          }}
        >
          Belle et bien dans sa peau
        </div>
        <div style={{ marginTop: 40, fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: COLORS.brown }}>
          WhatsApp {BRAND.whatsappDisplay}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
