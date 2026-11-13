import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Grain de capteur léger, commun à toute la vidéo : il unifie les plans du
 * personnage et les plans d'illustration (rendu « filmé au téléphone »).
 * Calculé en demi-résolution puis agrandi : grain plus organique, rendu plus rapide.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity, pointerEvents: "none" }}>
      <svg width="540" height="960" style={{ width: "100%", height: "100%" }}>
        <filter id="mb-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 24} />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
          />
        </filter>
        <rect width="540" height="960" filter="url(#mb-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
