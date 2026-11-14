import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { AUDIO_MIX, MEDIA } from "../config/brand";
import { Captions } from "../captions/Captions";
import { Disclaimer } from "../components/Graphics";
import { Grain } from "../components/Grain";
import { clamp } from "../animations/motion";
import { TAIL_SECONDS, TL, V2_MEDIA, cue, segWindow } from "./config";
import {
  S01Intro,
  S02Accueil,
  S03Visage,
  S04Zone,
  S05Epilation,
  S06Etapes,
  S07Complement,
  S08Douceur,
  S09Prix,
  S10Meritez,
  S11WhatsApp,
  S12Signature,
  SceneProps,
} from "./ScenesV2";

export type AdV2Props = { music: boolean };

const SCENES: Record<string, React.FC<SceneProps>> = {
  s01: S01Intro,
  s02: S02Accueil,
  s03: S03Visage,
  s04: S04Zone,
  s05: S05Epilation,
  s06: S06Etapes,
  s07: S07Complement,
  s08: S08Douceur,
  s09: S09Prix,
  s10: S10Meritez,
  s11: S11WhatsApp,
};

export const v2DurationSeconds = () => TL.voiceEnd + TAIL_SECONDS;

export const MaryBelleV2: React.FC<AdV2Props> = ({ music }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const tailFrames = f(TAIL_SECONDS);
  const w11 = segWindow("s11");
  const w12 = segWindow("s12");

  const sfx: { at: number; src: string; vol?: number }[] = [
    { at: segWindow("s02").start - 0.08, src: MEDIA.sfx.whoosh, vol: 0.4 },
    { at: cue("s03", "visage") - 0.05, src: MEDIA.sfx.pop, vol: 0.55 },
    { at: cue("s03", "cheveux") - 0.05, src: MEDIA.sfx.pop, vol: 0.55 },
    { at: cue("s03", "ongles") - 0.05, src: MEDIA.sfx.pop, vol: 0.55 },
    { at: cue("s04", "zone") - 0.1, src: MEDIA.sfx.shimmer, vol: 0.5 },
    { at: segWindow("s06").start - 0.08, src: MEDIA.sfx.whoosh, vol: 0.4 },
    { at: cue("s06", "nettoie") - 0.08, src: MEDIA.sfx.pop, vol: 0.5 },
    { at: cue("s06", "exfolie") - 0.08, src: MEDIA.sfx.pop, vol: 0.5 },
    { at: cue("s06", "hydrate") - 0.08, src: MEDIA.sfx.pop, vol: 0.5 },
    { at: cue("s09", "vingt-cinq") - 0.05, src: MEDIA.sfx.shimmer },
    { at: cue("s11", "whatsapp") - 0.15, src: MEDIA.sfx.notif },
    { at: TL.voiceEnd + 0.1, src: MEDIA.sfx.shimmer, vol: 0.6 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {TL.segments.map((s) => {
        const w = segWindow(s.id);
        const from = f(w.start);
        if (s.id === "s12") {
          return (
            <Sequence key={s.id} from={from} durationInFrames={f(w.end) - from + tailFrames} name={s.id}>
              <S12Signature start={w.start} end={w.end} tailFrames={tailFrames} />
            </Sequence>
          );
        }
        const C = SCENES[s.id];
        return (
          <Sequence key={s.id} from={from} durationInFrames={f(w.end) - from} name={s.id}>
            <C start={w.start} end={w.end} />
          </Sequence>
        );
      })}

      <Grain />
      <Captions words={TL.words} hiddenRanges={[[w11.start, w12.end + 99]]} />
      <Disclaimer />

      <Audio src={staticFile(V2_MEDIA.voice)} volume={AUDIO_MIX.voiceVolume} />
      {music && (
        <Audio
          src={staticFile(V2_MEDIA.music)}
          volume={(fr) =>
            interpolate(
              fr,
              [0, 6, f(TL.voiceEnd), f(TL.voiceEnd) + 8, durationInFrames - 20, durationInFrames],
              [0, AUDIO_MIX.musicUnderVoice, AUDIO_MIX.musicUnderVoice, AUDIO_MIX.musicOpen, AUDIO_MIX.musicOpen, 0],
              clamp,
            )
          }
        />
      )}
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s.at))} durationInFrames={f(2)}>
          <Audio src={staticFile(s.src)} volume={AUDIO_MIX.sfxVolume * (s.vol ?? 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
