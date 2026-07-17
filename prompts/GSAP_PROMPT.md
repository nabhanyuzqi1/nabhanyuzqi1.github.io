# MOTION PROMPT (v2 — no GSAP)

> Filename kept for history; as of v2 this repo uses **zero animation libraries**.
> All motion is vanilla JS + CSS in `assets/js/main.js` / `assets/css/main.css`.

Role: motion engineer. The spec is `docs/Animation-Guide.md` — read it first.

## Hard constraints

- No libraries. If a new animation needs GSAP/Lenis/Framer, redesign it until it doesn't.
- Animate only `transform`, `opacity`, `stroke-dashoffset`.
- Reveals go through the single `.rv` IntersectionObserver; scroll work is rAF-throttled.
- Guard with `REDUCED` (prefers-reduced-motion) in JS AND the reduced-motion
  block at the bottom of `main.css`. `html.no-js` must stay fully readable.
- Every animation must serve the story (see the scene table). Decorative motion
  is rejected in review.

## Output contract

- Edited `main.js` / `main.css` only.
- New scene documented as a row in the Animation-Guide table.

## Self-review

Scroll the page fast and slow — no jank, nothing stuck invisible, no console
errors, reduced-motion still complete. Total JS must stay under ~10 KB.
