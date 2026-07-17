import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { tokens } from './tokens';

// The showreel: real production screenshots (copied into public/shots/ from
// assets/img/sites by scripts/render-videos.sh), montaged with title cards.

type Shot = { file: string; name: string; tag: string; url: string };

const SHOTS: Shot[] = [
  { file: 'shots/orah-cafe.jpg', name: 'Orah Cafe', tag: 'F&B · PERTH, AUSTRALIA', url: 'orah-cafe-website.web.app' },
  { file: 'shots/kontrack.jpg', name: 'Kontrack', tag: 'SAAS · REACT × GEMINI', url: 'kontrack.web.app' },
  { file: 'shots/query-roastery.jpg', name: 'Query Roastery', tag: 'F&B BRAND · SAMPIT', url: 'query-roastery-sampit.web.app' },
  { file: 'shots/isu-indonesia.jpg', name: 'Isu Indonesia', tag: 'MEDIA PORTAL', url: 'isuindonesia.id' },
  { file: 'shots/manob-production.jpg', name: 'Manob Production', tag: 'CREATIVE STUDIO', url: 'manobproduction.com' },
];

const INTRO = 60;   // 2.5s @24fps
const PER = 120;    // 5s per shot
const OUTRO = 72;   // 3s

export const SHOWREEL_DURATION = INTRO + SHOTS.length * PER + OUTRO;

const Mega: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 110 }) => (
  <div
    style={{
      fontFamily: tokens.fontDisplay,
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 0.94,
      letterSpacing: '-0.015em',
      fontSize: size,
      color: tokens.ink,
    }}
  >
    {children}
  </div>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const out = interpolate(frame, [INTRO - 14, INTRO], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: tokens.bg, justifyContent: 'flex-end', padding: 70, opacity: out }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 78% 8%, rgba(139,157,255,0.14), transparent 65%)`,
        }}
      />
      <div
        style={{
          fontFamily: tokens.fontMono, fontSize: 17, letterSpacing: '0.16em',
          color: tokens.acc, marginBottom: 22,
          opacity: up(0), transform: `translateY(${(1 - up(0)) * 30}px)`,
        }}
      >
        SAMPIT, ID — 2°32′S · 112°57′E
      </div>
      <div style={{ opacity: up(6), transform: `translateY(${(1 - up(6)) * 40}px)` }}>
        <Mega>Nabhan Yuzqi</Mega>
      </div>
      <div
        style={{
          opacity: up(12), transform: `translateY(${(1 - up(12)) * 40}px)`,
          color: 'transparent', WebkitTextStroke: `1.5px ${tokens.ink}`,
        }}
      >
        <Mega>Shipped work.</Mega>
      </div>
    </AbsoluteFill>
  );
};

const ShotScene: React.FC<{ shot: Shot; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoomIn = index % 2 === 0;
  const scale = interpolate(frame, [0, PER], zoomIn ? [1.04, 1.14] : [1.14, 1.04]);
  const fade = interpolate(frame, [0, 10, PER - 10, PER], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cardIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: tokens.bg, opacity: fade }}>
      <Img
        src={staticFile(shot.file)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transform: `scale(${scale})` }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,12,18,0.15) 55%, rgba(10,12,18,0.88))' }} />
      <div
        style={{
          position: 'absolute', top: 44, right: 56,
          fontFamily: tokens.fontMono, fontSize: 16, letterSpacing: '0.2em', color: tokens.ink,
          opacity: 0.85,
        }}
      >
        {String(index + 1).padStart(2, '0')} / {String(SHOTS.length).padStart(2, '0')}
      </div>
      <div
        style={{
          position: 'absolute', left: 56, bottom: 52,
          opacity: cardIn, transform: `translateY(${(1 - cardIn) * 36}px)`,
        }}
      >
        <div style={{ fontFamily: tokens.fontMono, fontSize: 15, letterSpacing: '0.18em', color: tokens.sand, marginBottom: 10 }}>
          {shot.tag}
        </div>
        <div style={{ fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 64, textTransform: 'uppercase', color: tokens.ink, lineHeight: 1 }}>
          {shot.name}
        </div>
        <div style={{ fontFamily: tokens.fontMono, fontSize: 17, letterSpacing: '0.1em', color: tokens.acc, marginTop: 12 }}>
          {shot.url} — LIVE
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 5, width: `${(frame / PER) * 100}%`, background: tokens.acc }} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: tokens.bg, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ background: `radial-gradient(55% 60% at 50% 100%, rgba(139,157,255,0.12), transparent 70%)` }} />
      <div style={{ opacity: up, transform: `translateY(${(1 - up) * 30}px)`, textAlign: 'center' }}>
        <Mega size={92}>Let's build it →</Mega>
        <div style={{ fontFamily: tokens.fontMono, fontSize: 19, letterSpacing: '0.14em', color: tokens.muted, marginTop: 26 }}>
          nabhanyuzqi1@gmail.com · nabhanyuzqi1.github.io
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{ background: tokens.bg }}>
    <Sequence durationInFrames={INTRO}><Intro /></Sequence>
    {SHOTS.map((s, i) => (
      <Sequence key={s.file} from={INTRO + i * PER} durationInFrames={PER}>
        <ShotScene shot={s} index={i} />
      </Sequence>
    ))}
    <Sequence from={INTRO + SHOTS.length * PER} durationInFrames={OUTRO}><Outro /></Sequence>
  </AbsoluteFill>
);
