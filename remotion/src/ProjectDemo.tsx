import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { tokens } from './tokens';

// Screenshot pan/zoom montage with caption cards.
// Images live in remotion/public/demo/<slug>/NN.jpg (copied from assets/img).
export type Shot = { src: string; caption: string };

const ShotView: React.FC<{ shot: Shot; frames: number; zoomIn: boolean }> = ({
  shot,
  frames,
  zoomIn,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], zoomIn ? [1.02, 1.12] : [1.12, 1.02]);
  const fade = interpolate(frame, [0, 12, frames - 12, frames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Img
        src={staticFile(shot.src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
      <div
        style={{
          position: 'absolute',
          left: 48,
          bottom: 48,
          padding: '14px 22px',
          borderRadius: 12,
          background: 'rgba(6,6,8,0.82)',
          border: `1px solid rgba(244,244,245,0.16)`,
          color: tokens.text,
          fontFamily: tokens.fontMono,
          fontSize: 22,
          letterSpacing: '0.08em',
        }}
      >
        {shot.caption}
      </div>
    </AbsoluteFill>
  );
};

export const ProjectDemo: React.FC<{ title: string; shots: Shot[] }> = ({ title, shots }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const intro = Math.round(fps * 1.5);
  const per = Math.floor((durationInFrames - intro) / Math.max(shots.length, 1));
  const frame = useCurrentFrame();
  const titleFade = interpolate(frame, [0, 10, intro - 10, intro], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: tokens.bg0 }}>
      <Sequence durationInFrames={intro}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: titleFade }}>
          <div
            style={{
              color: tokens.text,
              fontFamily: tokens.fontDisplay,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      </Sequence>
      {shots.map((shot, i) => (
        <Sequence key={shot.src} from={intro + i * per} durationInFrames={per}>
          <ShotView shot={shot} frames={per} zoomIn={i % 2 === 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
