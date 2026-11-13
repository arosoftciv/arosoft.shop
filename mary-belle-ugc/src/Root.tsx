import React from "react";
import { Composition } from "remotion";
import { MaryBelleAd, AdProps } from "./MaryBelleAd";
import { VIDEO } from "./config/brand";
import { SCENES } from "./config/timeline";
import "./components/fonts";

const durationInFrames = Math.round((SCENES[SCENES.length - 1].end + VIDEO.tailSeconds) * VIDEO.fps);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MaryBelleVajacial"
    component={MaryBelleAd as React.FC<AdProps>}
    durationInFrames={durationInFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
    defaultProps={{ music: true }}
  />
);
