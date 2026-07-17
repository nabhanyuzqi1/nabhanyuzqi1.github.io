# Animation Guide — v2 (single source of truth)

v2 replaces the GSAP/Lenis stack with **vanilla JS + CSS** (`assets/js/main.js`,
~200 lines, zero libraries). Reason: the v1 build felt template-heavy and slow;
v2 keeps a few *authentic* scenes and cuts everything decorative.

## Global rules

1. Animate only `transform`, `opacity`, `stroke-dashoffset`. No layout properties.
2. Everything readable with JS off (`html.no-js .rv { opacity:1 }`) and with
   `prefers-reduced-motion: reduce` (CSS kills all animation; JS checks `REDUCED`).
3. One IntersectionObserver for reveals; scroll handlers are rAF-throttled.
4. No animation without a story purpose. If it could appear on any dev's
   portfolio unchanged, cut it.

## Scenes

| ID | Scene | Mechanism | Notes |
|----|-------|-----------|-------|
| H | Hero name rise | pure CSS `@keyframes rise` on `.hero__mega .line > span` | 0.9s, second line stroked, 0.12s delay. Runs once on load — no preloader. |
| H2 | WIB clock chip | JS `[data-clock]`, 30s interval | Live "Sampit, ID — HH:MM WIB". Authentic detail, not decoration. |
| M | Stack marquee | pure CSS `@keyframes scroll` on duplicated track | Killed by reduced-motion media query. |
| R | Route board (signature) | scroll-progress → `stroke-dashoffset` on `[data-route]` paths | Routes draw from Sampit to Jakarta/Perth/cloud as the board enters. Origin dot pings via CSS. THE authentic scene — protect it. |
| L | Ledger count-up | IO at 0.6 + rAF easeOutCubic on `[data-count]` | Real numbers only (3 apps, 2000 trees, 6+ sites, 4 companies). |
| W | Work rows | CSS hover (accent bar, bg, padding shift) + `.rv` entrance | Row list, not cards — reads like an index. |
| P | Hover preview floater | pointermove → lerped `translate` on fixed `.preview` | Fine pointers only; shows the REAL screenshot of the hovered project. |
| V | Showreel | `<video muted loop preload=none>`; section `hidden` until `loadedmetadata` | Video is Remotion-rendered (`remotion/`, `scripts/render-videos.sh`). If the file is missing the section never appears — no broken UI. |
| D | Case diagrams | IO → `stroke-dashoffset` transition; `.d-dot` travels `.d-flow` via rAF `getPointAtLength` | Static when reduced-motion. |
| G | Hero flow field | `assets/js/hero-field.js` — three.js GPGPU (positions/velocities in textures), **curl-noise** flow (divergence-free → no density voids), pointer attraction, click pulse rings, UnrealBloom threshold 0.82 = selective glow, camera parallax on pointer + scroll | Homepage only (importmap in `default.html`). 12.5k particles phone / 31k desktop, DPR ≤1.5, paused off-screen/hidden. Fallback = CSS gradient; exits on reduced-motion/no-WebGL2/error with a console.warn. Audio hook: `window.__heroRingPulse(0..1)`. |
| O | Work orbit carousel | `assets/js/orbit-cards.js` — 5 production screenshots on a tilted elliptical 3D orbit above the work index; billboarded, back cards recede; section scroll slides the orbit right → lower-left; pointer tilts the camera | Transparent renderer, no post-processing. Band hidden entirely on no-js/reduced-motion. Textures = `assets/img/sites/*.jpg` (1600px). |

## Adding a new animation

State purpose · trigger · mechanism · reduced-motion fallback in one line each,
add it to this table, keep `main.js` dependency-free. If it needs a library,
the answer is no.
