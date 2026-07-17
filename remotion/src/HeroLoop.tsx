import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens } from './tokens';

// Seamless 8s loop: every motion is a sine of an integer number of cycles
// over the full duration, so frame N-1 flows into frame 0.
const TAU = Math.PI * 2;

type P = { seed: number };

const Particle: React.FC<P> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  // deterministic pseudo-random from seed (no Math.random — reproducible renders)
  const rand = (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const baseX = rand(1) * width;
  const baseY = rand(2) * height;
  const cyclesX = 1 + Math.floor(rand(3) * 2); // 1–2 full cycles → seamless
  const cyclesY = 1 + Math.floor(rand(4) * 2);
  const ampX = 40 + rand(5) * 80;
  const ampY = 30 + rand(6) * 60;
  const size = 1.5 + rand(7) * 2.5;
  const dim = 0.15 + rand(8) * 0.35;

  const x = baseX + Math.sin(TAU * (t * cyclesX + rand(9)));
  const y = baseY + Math.sin(TAU * (t * cyclesY + rand(10)));

  return (
    <div
      style={{
        position: 'absolute',
        left: x + Math.sin(TAU * (t * cyclesX + rand(9))) * ampX,
        top: y + Math.cos(TAU * (t * cyclesY + rand(10))) * ampY,
        width: size,
        height: size,
        borderRadius: '50%',
        background: tokens.text,
        opacity: dim,
      }}
    />
  );
};

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  // gradient blobs drift on 1-cycle sine paths → perfect loop
  const b1x = 65 + Math.sin(TAU * t) * 8;
  const b1y = 22 + Math.cos(TAU * t) * 6;
  const b2x = 22 + Math.sin(TAU * (t + 0.5)) * 7;
  const b2y = 80 + Math.cos(TAU * (t + 0.25)) * 5;

  return (
    <AbsoluteFill style={{ background: tokens.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 45% at ${b1x}% ${b1y}%, rgba(124,108,255,0.16), transparent 65%),
                       radial-gradient(ellipse 50% 40% at ${b2x}% ${b2y}%, rgba(255,180,84,0.12), transparent 65%)`,
        }}
      />
      {Array.from({ length: 90 }, (_, i) => (
        <Particle key={i} seed={i + 1} />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(244,244,245,0.045) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(244,244,245,0.045) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)',
        }}
      />
    </AbsoluteFill>
  );
};
