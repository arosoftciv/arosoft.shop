import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../animations/motion";

type Move = "in" | "out" | "left" | "right" | "up";

/**
 * Plan illustratif animé (Ken Burns + parallaxe douce + flou de mise au point
 * à l'entrée). Évite l'effet "diaporama" : chaque plan a un mouvement de caméra.
 */
export const KenBurns: React.FC<{ src: string; move?: Move; focus?: string }> = ({
  src,
  move = "in",
  focus = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const s = move === "out" ? 1.16 - 0.1 * p : 1.06 + 0.1 * p;
  const tx = move === "left" ? 30 - 60 * p : move === "right" ? -30 + 60 * p : 0;
  const ty = move === "up" ? 30 - 60 * p : 0;
  const blur = interpolate(frame, [0, 10], [8, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1a1110" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          filter: `blur(${blur}px) saturate(1.04)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(73,48,45,0.30) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(73,48,45,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Enchaîne plusieurs plans avec fondu enchaîné. Durées en frames. */
export const BRollSequence: React.FC<{
  shots: { src: string; frames: number; move?: Move; focus?: string }[];
  crossfade?: number;
}> = ({ shots, crossfade = 8 }) => {
  let from = 0;
  return (
    <AbsoluteFill>
      {shots.map((shot, i) => {
        const start = from;
        from += shot.frames;
        const dur = shot.frames + (i < shots.length - 1 ? crossfade : 0);
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Crossfade frames={dur} fade={i === 0 ? 0 : crossfade}>
              <KenBurns src={shot.src} move={shot.move} focus={shot.focus} />
            </Crossfade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Crossfade: React.FC<{ frames: number; fade: number; children: React.ReactNode }> = ({
  fade,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = fade === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
