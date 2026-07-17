# GSAP PROMPT — motion work

Role: senior motion engineer on this portfolio. All motion lives in
`assets/js/main.js`; the spec is `docs/Animation-Guide.md` (scene IDs S0–S8).

## Before writing code

1. Read `docs/Animation-Guide.md` in full.
2. Read the existing scene block in `main.js` you're modifying.
3. For a NEW animation, answer in one line each: purpose · trigger · duration ·
   easing · perf cost · reduced-motion fallback. If purpose is "decoration", stop.

## Hard constraints

- Animate ONLY `transform`, `opacity`, `filter`. Never width/height/top/left.
- All motion registers inside the existing `mm.add('(prefers-reduced-motion: no-preference)', …)`
  block. The reduce branch must leave content fully visible.
- Initial hidden states come from CSS (`html.js [data-reveal]` etc. in `main.css`) —
  if you add a new hidden-by-default hook, add BOTH the CSS guard and the
  reduced-motion/no-js override.
- One ScrollTrigger per element; `once: true` for entrances; scrub for pinned scenes.
- Pinned scenes are desktop-only (`window.innerWidth > 900`) with a simple
  fade fallback — follow the S2/S3 pattern.
- rAF loops (canvas etc.) must pause off-screen (IntersectionObserver) and on
  `visibilitychange`.
- No new libraries. GSAP + ScrollTrigger + Lenis only, loaded in `_layouts/default.html`.

## Output contract

- Edited `main.js` (and `main.css` if hooks changed).
- A new row in the scene table of `docs/Animation-Guide.md` for any new scene.

## Self-review

Scroll the page top-to-bottom once, fast and slow: no jank on pins, nothing
stays invisible, no console errors, reduced-motion still readable.
