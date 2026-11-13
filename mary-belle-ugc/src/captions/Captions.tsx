import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config/brand";
import { SANS } from "../components/fonts";
import { buildChunks } from "./captions";
import { clamp } from "../animations/motion";

/**
 * Sous-titres dynamiques synchronisés mot à mot.
 * `hiddenRanges` : plages (s) où les sous-titres sont masqués (écrans de fin
 * qui affichent déjà l'information en grand).
 */
export const Captions: React.FC<{ hiddenRanges?: [number, number][]; bottom?: number }> = ({
  hiddenRanges = [],
  bottom = 470,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => buildChunks(), []);

  if (hiddenRanges.some(([a, b]) => t >= a && t < b)) return null;
  const chunk = chunks.find((c) => t >= c.start - 0.05 && t < c.end);
  if (!chunk) return null;

  const local = frame - Math.round(chunk.start * fps);
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(pop, [0, 1], [0.86, 1]);
  const opacity = interpolate(local, [0, 3], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          maxWidth: 880,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: COLORS.ivory,
          textShadow: "0 4px 18px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.8)",
          WebkitTextStroke: "1.5px rgba(73,48,45,0.65)",
          paintOrder: "stroke fill",
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.08;
          const said = t >= w.start;
          return (
            <span
              key={i}
              style={{
                color: active ? COLORS.goldLight : said ? COLORS.ivory : "rgba(255,249,245,0.72)",
                display: "inline-block",
                transform: active ? "translateY(-4px)" : "none",
                marginRight: 16,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
