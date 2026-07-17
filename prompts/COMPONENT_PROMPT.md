# COMPONENT PROMPT — build pattern

Every component in this repo follows the same three-layer pattern. Deviating
from it is the main way this codebase rots — don't.

## The pattern

1. **Markup** — a Jekyll include (`_includes/*.html`) or Liquid block.
   - Data comes from `_data/*.yml` or collection front matter, never hardcoded
     into markup when it could be data.
   - Semantic elements + `aria-label` on sections; images get width/height +
     `loading="lazy"` (first hero image: `eager`).
2. **Style** — one BEM block in `assets/css/main.css` under a `/* ---------- */`
   banner comment. Tokens only (see `prompts/UI_PROMPT.md`).
3. **Behavior (optional)** — progressive enhancement in `assets/js/main.js`:
   - hook via `data-*` attributes, never classes;
   - component must be fully usable with JS off (CSS `html.no-js` guards);
   - motion follows `prompts/GSAP_PROMPT.md`.

## Checklist for a new component

- [ ] Include created; data externalized to `_data/` or front matter
- [ ] BEM block added to `main.css` with banner comment, tokens only
- [ ] Keyboard reachable, focus visible, AA contrast
- [ ] Works with JS off · reduced motion · 375px viewport
- [ ] If hidden-until-animated: CSS guard added under BOTH
      `html.js` + `prefers-reduced-motion: no-preference` AND the reveal branch
      in `main.js`
- [ ] `bundle exec jekyll serve` renders without Liquid warnings
