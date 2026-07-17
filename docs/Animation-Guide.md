# Animation Guide — Single Source of Truth

Every scene has a stable ID (S0–S8). Code in `assets/js/main.js` references these IDs.
Any prompt that touches motion MUST read this file first (see `prompts/GSAP_PROMPT.md`).

## Global rules

1. **Properties**: animate only `transform`, `opacity`, `filter` (GPU-composited). Never layout properties.
2. **Reduced motion**: all scenes register inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`. CSS makes everything visible when motion is reduced or JS is off (`html.no-js`).
3. **Initial states**: CSS hides `[data-reveal]`, `[data-reveal-group] > *`, `.work-card`, `.timeline__item`, `[data-split-lines]` only under `html.js` + motion-ok. GSAP must therefore always animate these to a visible end state.
4. **Cleanup**: one `ScrollTrigger` per scene element; no global `refresh()` loops; kill triggers on `pagehide` only if needed.
5. **Performance**: `will-change` sparingly (already in CSS where needed); hero canvas pauses when off-screen or tab hidden; target 60fps on a mid-range Android.

## Scene spec

| ID | Scene | Trigger | Duration / Easing | Notes |
|----|-------|---------|-------------------|-------|
| S0 | Preloader | `DOMContentLoaded` | count 0.9s `power2.inOut`, curtain 0.5s `power4.inOut` | Skip on repeat visit (`sessionStorage.seenIntro`) and reduced-motion (CSS hides). Total ≤1.2s. |
| S1 | Hero | after S0 curtain | lines 1.1s `power4.out`, stagger 0.08s | Per-line `yPercent:110→0` + `blur(8px)→0` inside `overflow:clip` masks. Tagline/CTA fade-up 24px, 0.7s `power3.out`, +0.4s. Magnetic CTA: pointer-follow ±12px, `elastic.out(1,0.4)` release. Canvas particle field ~120pts, cursor drift, paused via IntersectionObserver + `visibilitychange`. Scroll cue: 12px y-loop `sine.inOut` 1.6s, fades on first scroll. |
| S2 | Who I am | ScrollTrigger pin `top top`, `+=150%`, scrub 0.8 | scrub-bound | Frame scale 1.06→1 parallax; bio words opacity 0.25→1 word-by-word (stagger 0.02 within scrub). Reading pace = scroll pace. |
| S3 | How I think | pin `top top`, `+=300%`, scrub 0.8 | card swap 0.9s-equivalent `power3.inOut` within scrub | 3 cards swap: outgoing `xPercent:-12`, `blur(6px)`, `scale:.94`, `autoAlpha:0`; incoming from `xPercent:12`. Amber rail fills `scaleY 0→1` across full pin. |
| S4 | Work cards | per-card `top 75%`, once | 1.0s `power4.out`, inner stagger 0.12s | Card `autoAlpha 0→1` + `y:48→0`; media `clip-path inset(12%)→0` + img counter-zoom `scale 1.15→1`. Hover (JS): 3D tilt max 6° from pointer, `power2.out` 0.4s, reset on leave. |
| S5 | Sites gallery | scrub over section | scrub-bound | Row1 `xPercent 0→-18`, Row2 `xPercent -18→0` (opposite directions). Card hover handled by CSS. |
| S6 | Skills constellation | `top 70%`, once | edges 1.4s `power2.inOut`, nodes `back.out(1.7)` stagger 0.04s | Edges draw via `stroke-dashoffset`; nodes scale 0→1 (transform-origin center). Hover: dim non-neighbors to 0.25 (class toggle). Reduced motion: static, fully drawn. |
| S7 | Timeline | line: scrub over list; items: `top 80%`, once | items 0.7s `power3.out` | Line `scaleY 0→1` scrub; items `autoAlpha` + `x:±32→0` alternating; year numbers count up with `snap:1`. |
| S8 | Contact | `top 70%`, once + infinite glow | underline 0.6s draw; glow 6s `sine.inOut` loop | Email underline `scaleX 0→1` then class `is-drawn`; glow breathes `scale 1→1.08` infinite (killed on reduced motion — it's inside matchMedia). |

## Case-study scenes

- `cs-hero`: title via `[data-split-lines]` line-mask reveal (S1 recipe); kicker/tagline/meta `[data-reveal]` fade-up stagger 0.1s.
- `cs-diagram`: on enter `top 75%` — paths draw (`stroke-dashoffset`), boxes/labels fade in stagger 0.06s; a `.d-dot` travels along the main flow path in a 2.4s loop (paused off-screen; static when reduced motion).
- `cs-screens`: alternating parallax `yPercent ±8` scrub.
- `cs-metrics`: `.case-metric__value[data-count]` counts 0→value on enter, 1.2s `power2.out`, `snap:1`.
- `cs-next`: arrow nudges via CSS hover; block fades up on enter.

## Global micro-interactions

- **Custom cursor**: dot instant, ring lerp 0.12/frame; ring grows on `a, button, [data-magnetic]`; desktop fine-pointer only (CSS gates it).
- **Smart-hide nav**: hide after scrolling down past 120px, reveal on any scroll-up; `is-scrolled` class adds blur background after 40px.
- **Magnetic elements**: `[data-magnetic]` — translate toward pointer (strength 0.3, max ±12px), elastic reset.
- **Cursor glow**: `.glow` follows pointer, lerp 0.06 — depth layer behind content.

## Adding a new animation

Answer the master prompt's questions first: purpose, trigger, duration, easing, performance cost, reduced-motion fallback. Then: add markup hooks (`data-scene`, `data-reveal`), register inside the existing `mm.add(...)` block in `main.js`, and document it here with a new ID.
