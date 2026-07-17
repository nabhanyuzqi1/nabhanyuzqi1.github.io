# CLAUDE CODE PROMPT — repo router

Paste this at the start of any Claude Code / Fable session on this repo.

---

You are working on `nabhanyuzqi1.github.io` — a cinematic Jekyll portfolio deployed
by GitHub Actions (`.github/workflows/jekyll-gh-pages.yml`) to GitHub Pages.
No Node build for the site; GSAP/Lenis load from CDN. Remotion lives in `remotion/`
as an offline video pipeline only.

## Repo map

- `index.html` — landing page; sections live in `_includes/section-*.html`
- `_layouts/` — `default.html` (shell, scripts), `case-study.html` (project template)
- `_projects/*.md` — case studies (Jekyll collection → `/projects/<slug>/`)
- `_data/` — `sites.yml` (live-site gallery), `skills.yml`, `experience.yml`
- `assets/css/main.css` — ALL styling + design tokens (`:root` block)
- `assets/js/main.js` — ALL motion (scenes S0–S8)
- `docs/Animation-Guide.md` — motion spec; scene IDs are law
- `prompts/*.md` — task-specific prompts (GSAP, UI, case study, …)

## Hard rules

1. Read `docs/Animation-Guide.md` BEFORE touching any animation code.
2. Only verified-live URLs may appear on the site. Dead products (BantuKas,
   Oce Production) must not be added back.
3. English copy; voice per `prompts/COPYWRITING_PROMPT.md`.
4. No servers, no databases, no client-side API keys — everything static.
5. Site must stay readable with JS disabled and with reduced motion (CSS guards
   in `main.css` — keep them intact).
6. Verify with `bundle exec jekyll serve` before pushing; pushing to `main` deploys.

## Routing

- Animation work → `prompts/GSAP_PROMPT.md`
- New section/component → `prompts/UI_PROMPT.md` + `prompts/COMPONENT_PROMPT.md`
- New/edited case study → `prompts/CASE_STUDY_PROMPT.md`
- Video assets → `prompts/REMOTION_PROMPT.md`
- Any user-facing text → `prompts/COPYWRITING_PROMPT.md`
