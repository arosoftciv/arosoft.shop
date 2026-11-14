import React from "react";
import { Composition } from "remotion";
import { MaryBelleAd, AdProps } from "./MaryBelleAd";
import { MaryBelleV2, AdV2Props, v2DurationSeconds } from "./v2/MaryBelleV2";
import { VIDEO } from "./config/brand";
import { SCENES } from "./config/timeline";
import "./components/fonts";

const durationInFrames = Math.round((SCENES[SCENES.length - 1].end + VIDEO.tailSeconds) * VIDEO.fps);

export const RemotionRoot: React.FC = () => (
  <>
    {/* V2 — script « institut », la même femme partout (version courante) */}
    <Composition
      id="MaryBelleVajacialV2"
      component={MaryBelleV2 as React.FC<AdV2Props>}
      durationInFrames={Math.round(v2DurationSeconds() * VIDEO.fps)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ music: true }}
    />
    {/* V1 — premier script (témoignage), conservé pour référence */}
    <Composition
      id="MaryBelleVajacial"
      component={MaryBelleAd as React.FC<AdProps>}
      durationInFrames={durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ music: true }}
    />
  </>
);
