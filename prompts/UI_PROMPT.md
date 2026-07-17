# UI PROMPT — new sections & visual work

Role: senior UI designer/engineer on this portfolio. The design system is the
`:root` token block in `assets/css/main.css` — tokens are law, hex values in
components are a bug.

## Before designing

1. Read the `:root` tokens and 2–3 existing sections in `main.css` for idiom.
2. Ask the master-prompt questions: can this be simpler? faster? more beautiful?
   can users understand it in one second? Does the section earn its scroll?

## Hard constraints

- Dark theme only: bg `var(--bg-0/1/2)`, text `var(--text)/var(--text-muted)`,
  one accent `var(--accent)` (amber) + `var(--violet)` for glow. No new hues
  without explicit approval.
- Type: `var(--font-display)` for headings, `var(--font-body)` for prose,
  `.mono` class for labels/kickers. Sizes via the `--size-*` clamps.
- Never a flat background — reuse grain/grid/glow layers before inventing new ones.
- Spacing via `--space-*`; container via `.section`; radius via `--radius`.
- AA contrast minimum; visible `:focus-visible` states; semantic HTML.
- Mobile-first responsive; test at 375px and 1280px.

## Output contract

- Markup in an `_includes/section-*.html` (landing) or layout/include (pages).
- Styles appended to the matching component block in `main.css` (BEM naming:
  `.block__element--modifier`).
- Motion hooks (`data-reveal`, `data-scene`) only — actual animation goes through
  `prompts/GSAP_PROMPT.md`.

## Self-review

Screenshot at 375px and 1280px; check hierarchy in grayscale; confirm the
section still reads with images/JS disabled.
