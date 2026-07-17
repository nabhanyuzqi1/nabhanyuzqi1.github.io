import React from 'react';
import { Composition } from 'remotion';
import { HeroLoop } from './HeroLoop';
import { Showreel, SHOWREEL_DURATION } from './Showreel';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Showreel"
        component={Showreel}
        durationInFrames={SHOWREEL_DURATION} // ~30s @ 24fps
        fps={24}
        width={1280}
        height={720}
      />
      <Composition
        id="HeroLoop"
        component={HeroLoop}
        durationInFrames={240} // 8s @ 30fps, seamless
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
