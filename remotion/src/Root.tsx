import React from 'react';
import { Composition } from 'remotion';
import { HeroLoop } from './HeroLoop';
import { ProjectDemo } from './ProjectDemo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroLoop"
        component={HeroLoop}
        durationInFrames={240} // 8s @ 30fps, seamless
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProjectDemo-kontrack"
        component={ProjectDemo}
        durationInFrames={360} // 15s @ 24fps
        fps={24}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Kontrack',
          shots: [
            { src: 'demo/kontrack/01.jpg', caption: 'kontrack.web.app — live dashboard' },
            { src: 'demo/kontrack/02.jpg', caption: 'projects & finance in one view' },
          ],
        }}
      />
      <Composition
        id="ProjectDemo-manob"
        component={ProjectDemo}
        durationInFrames={360}
        fps={24}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Manob Production',
          shots: [
            { src: 'demo/manob/01.jpg', caption: 'manobproduction.com — live site' },
            { src: 'demo/manob/02.jpg', caption: 'portfolio-first, production-ready' },
          ],
        }}
      />
    </>
  );
};
