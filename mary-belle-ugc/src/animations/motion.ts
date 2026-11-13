import { Easing, interpolate, spring } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Entrée douce (0 → 1) démarrant à `delay` frames. */
export const enter = (
  frame: number,
  fps: number,
  delay = 0,
  damping = 18,
  durationInFrames?: number,
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.7, stiffness: 120 },
    durationInFrames,
  });

/** Fondu entrée/sortie sur une plage locale. */
export const fadeInOut = (
  frame: number,
  total: number,
  fadeIn = 8,
  fadeOut = 8,
) =>
  interpolate(
    frame,
    [0, fadeIn, Math.max(fadeIn + 1, total - fadeOut), total],
    [0, 1, 1, 0],
    clamp,
  );

/** Zoom cinématique lent. */
export const slowZoom = (frame: number, total: number, from = 1, to = 1.08) =>
  interpolate(frame, [0, total], [from, to], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

export const sec = (s: number, fps: number) => Math.round(s * fps);
