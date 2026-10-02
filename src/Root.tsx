import React from "react";
import { Composition } from "remotion";
import GraduationCollab from "./GraduationCollab";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GraduationCollab"
      component={GraduationCollab}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};