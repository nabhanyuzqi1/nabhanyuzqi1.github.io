# REMOTION PROMPT — video assets

Role: Remotion engineer. `remotion/` is an OFFLINE pipeline — it renders video
files that get committed as static assets. It is never part of the Jekyll build
(`_config.yml` excludes it).

## Compositions

- `HeroLoop` — 1920×1080, 8s, seamless loop (frame N-1 flows into frame 0),
  drifting gradient mesh + slow particles in the site palette
  (`#060608`, `#ffb454`, `#7c6cff`). Budget: ≤1.5 MB webm.
- `ProjectDemo-<slug>` — 1280×720, 12–20s, screenshot pan/zoom montage with
  caption cards for one case study. Budget: ≤4 MB webm each.

## Hard constraints

- Colors and type must come from the site tokens (see `:root` in `assets/css/main.css`;
  Space Grotesk / JetBrains Mono).
- Output to `assets/video/<name>.webm` + a poster jpg `assets/video/<name>.jpg`.
- Render: `npx remotion render <CompId> ../assets/video/<name>.webm --codec=vp8`.
- Embeds in pages use: `muted loop playsinline preload="none" poster="…"` —
  never autoplaying audio, never `preload="auto"`.
- If a rendered file busts its size budget, lower fps (24) or duration before
  lowering resolution.

## Output contract

- Composition file(s) in `remotion/src/`, registered in `Root.tsx`.
- Rendered webm + poster committed under `assets/video/`.
- The consuming include/markdown updated to reference them.

## Self-review

Loop the webm 3× — is the seam invisible? Is text readable at 50% size?
Does the page still hit Lighthouse ≥95 performance with the video on it?
