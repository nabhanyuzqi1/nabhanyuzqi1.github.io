# R3F PROMPT — status: intentionally not used

React Three Fiber is in the master prompt's wishlist, but this site ships as
**Jekyll + vanilla JS** (no React, no Node build) to keep GitHub Pages deploys
zero-config and Lighthouse at 100. The hero's canvas particle field
(`assets/js/main.js`) is the deliberate stand-in for 3D.

## If 3D is ever added anyway

Preferred path (no React): **vanilla Three.js from CDN**, following the same
rules as the particle field:

- One scene max, in the hero only. 3D must communicate (architecture, network,
  depth) — never decorate.
- Lazy-init after first paint; pause off-screen (IntersectionObserver) and on
  `visibilitychange`; cap pixel ratio at 2.
- Full fallback: static gradient/canvas when WebGL is unavailable, nothing when
  reduced-motion.
- Budget: ≤150 KB gzipped extra JS, ≥55fps on a mid-range Android, zero
  Lighthouse performance regression.

Migrating the whole site to Next.js + R3F is a separate project — requires a
new build pipeline (static export), and every rule in
`docs/Animation-Guide.md` still applies. Don't start it casually.
