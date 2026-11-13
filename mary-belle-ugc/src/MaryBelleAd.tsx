import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AUDIO_MIX, COLORS, MEDIA, VIDEO } from "./config/brand";
import { CUES, SCENES, SceneId } from "./config/timeline";
import { Captions } from "./captions/Captions";
import { Disclaimer } from "./components/Graphics";
import { CuriositeScene, EmotionScene, HookScene, PrixScene, SceneProps } from "./scenes/TalkingScenes";
import { DecouverteScene, ExplicationScene, SavoirFaireScene, VajacialScene } from "./scenes/BRollScenes";
import { SignatureScene, WhatsAppScene } from "./scenes/EndScenes";
import { clamp } from "./animations/motion";

export type AdProps = { music: boolean };

const SCENE_COMPONENTS: Record<Exclude<SceneId, "signature">, React.FC<SceneProps>> = {
  hook: HookScene,
  curiosite: CuriositeScene,
  decouverte: DecouverteScene,
  explication: ExplicationScene,
  vajacial: VajacialScene,
  savoirFaire: SavoirFaireScene,
  prix: PrixScene,
  emotion: EmotionScene,
  whatsapp: WhatsAppScene,
};

/** Lueur champagne aux coupes (transition douce, sans dissoudre la voix). */
const CutGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 10], [0, 0.55, 0], clamp);
  return <AbsoluteFill style={{ backgroundColor: COLORS.champagne, opacity: o, pointerEvents: "none" }} />;
};

const SFX: { at: number; src: string; vol?: number }[] = [
  { at: CUES.lesFilles, src: MEDIA.sfx.pop },
  { at: CUES.vajacialQ - 0.05, src: MEDIA.sfx.pop },
  { at: 10.05, src: MEDIA.sfx.whoosh },
  { at: 14.25, src: MEDIA.sfx.whoosh },
  { at: CUES.visage - 0.05, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: CUES.cheveux - 0.05, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: CUES.ongles - 0.05, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: CUES.zoneIntime - 0.1, src: MEDIA.sfx.shimmer, vol: 0.6 },
  { at: 23.38, src: MEDIA.sfx.whoosh },
  { at: CUES.nettoyage - 0.08, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: CUES.exfoliation - 0.08, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: CUES.hydratation - 0.08, src: MEDIA.sfx.pop, vol: 0.6 },
  { at: 32.58, src: MEDIA.sfx.whoosh },
  { at: CUES.prix - 0.05, src: MEDIA.sfx.shimmer },
  { at: CUES.whatsapp - 0.15, src: MEDIA.sfx.notif },
  { at: 58.45, src: MEDIA.sfx.shimmer, vol: 0.7 },
];

export const MaryBelleAd: React.FC<AdProps> = ({ music }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const voiceEnd = SCENES[SCENES.length - 1].end;
  const tailFrames = f(VIDEO.tailSeconds);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map((s, i) => {
        const from = f(s.start);
        const dur = s.id === "signature" ? f(s.end) - from + tailFrames : f(s.end) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            {s.id === "signature" ? (
              <SignatureScene start={s.start} end={s.end} tailFrames={tailFrames} />
            ) : (
              React.createElement(SCENE_COMPONENTS[s.id], { start: s.start, end: s.end })
            )}
            {i > 0 && <CutGlow />}
          </Sequence>
        );
      })}

      <Captions hiddenRanges={[[38.6, 41.97], [44.83, 999]]} />
      <Disclaimer />

      {/* AUDIO */}
      <Audio src={staticFile(MEDIA.voice)} volume={AUDIO_MIX.voiceVolume} />
      {music && (
        <Audio
          src={staticFile(MEDIA.music)}
          volume={(fr) =>
            interpolate(
              fr,
              [0, 6, f(voiceEnd), f(voiceEnd) + 8, durationInFrames - 20, durationInFrames],
              [0, AUDIO_MIX.musicUnderVoice, AUDIO_MIX.musicUnderVoice, AUDIO_MIX.musicOpen, AUDIO_MIX.musicOpen, 0],
              clamp,
            )
          }
        />
      )}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s.at))} durationInFrames={f(2)}>
          <Audio src={staticFile(s.src)} volume={AUDIO_MIX.sfxVolume * (s.vol ?? 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
