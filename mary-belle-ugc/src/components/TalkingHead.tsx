import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MEDIA } from "../config/brand";
import { clamp } from "../animations/motion";
import { SANS } from "./fonts";

/**
 * Personnage UGC parlant.
 * La vidéo lip-syncée couvre toute la voix-off : on la "cale" sur la timeline
 * globale via trimBefore = frame globale de début du plan → synchro parfaite.
 */
export const TalkingHead: React.FC<{
  /** Frame globale à laquelle ce plan commence. */
  globalStartFrame: number;
  /** Zoom de départ/arrivée (zoom cinématique). */
  zoomFrom?: number;
  zoomTo?: number;
  /** Point focal du zoom (origine CSS). */
  focus?: string;
}> = ({ globalStartFrame, zoomFrom = 1.0, zoomTo = 1.06, focus = "50% 35%" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], clamp);

  const media = MEDIA.talkingHead ? (
    <OffthreadVideo
      src={staticFile(MEDIA.talkingHead)}
      trimBefore={globalStartFrame}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <Img
      src={staticFile(MEDIA.characterStill)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: focus }}>
        {media}
      </AbsoluteFill>
      {/* léger dégradé pour la lisibilité des sous-titres */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(73,48,45,0.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(73,48,45,0.55) 100%)",
        }}
      />
      {!MEDIA.talkingHead && <PreviewWatermark />}
    </AbsoluteFill>
  );
};

/** Filigrane obligatoire tant que la vidéo lip-sync n'est pas intégrée. */
const PreviewWatermark: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
    <div
      style={{
        transform: "rotate(-24deg)",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 54,
        letterSpacing: 4,
        color: "rgba(255,255,255,0.28)",
        border: "4px solid rgba(255,255,255,0.28)",
        padding: "18px 34px",
        textAlign: "center",
        lineHeight: 1.25,
      }}
    >
      APERÇU — LIP-SYNC EN ATTENTE
      <br />
      <span style={{ fontSize: 30, fontWeight: 600 }}>image fixe, non diffusable</span>
    </div>
  </AbsoluteFill>
);
