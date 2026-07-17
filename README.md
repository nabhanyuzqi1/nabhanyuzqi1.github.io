# nabhanyuzqi1.github.io

Cinematic developer portfolio of **Nabhan Yuzqi Al Mubarok** — live at
[nabhanyuzqi1.github.io](https://nabhanyuzqi1.github.io/).

Static Jekyll site, dark editorial design, GSAP-driven scroll storytelling.
No servers, no databases, no client build step.

## Stack

- **Jekyll** (GitHub Pages whitelisted plugins only: `jekyll-seo-tag`, `jekyll-sitemap`)
- **GSAP 3 + ScrollTrigger + Lenis** from CDN — motion spec in [docs/Animation-Guide.md](docs/Animation-Guide.md)
- **Remotion** (`remotion/`) — offline pipeline that renders video assets into `assets/video/`; never part of the Jekyll build

## Repo map

| Path | Purpose |
|---|---|
| `index.html` | Landing page — includes `_includes/section-*.html` (scenes S1–S8) |
| `_layouts/` | `default.html` shell · `case-study.html` project template |
| `_projects/*.md` | Case studies → `/projects/<slug>/` |
| `_data/` | `sites.yml` (verified live sites) · `skills.yml` · `experience.yml` |
| `assets/css/main.css` | All styling + design tokens (`:root`) |
| `assets/js/main.js` | All motion (scenes S0–S8) + micro-interactions |
| `docs/` | Vision + Animation Guide (single source of truth for motion) |
| `prompts/` | Task prompts for AI-assisted work on this repo — start at `prompts/CLAUDE_CODE_PROMPT.md` |

## Local development

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## Deployment

Push to `main` → `.github/workflows/jekyll-gh-pages.yml` builds and deploys to
GitHub Pages. Nothing else to configure.

## Content workflows

- **Add a case study** — follow `prompts/CASE_STUDY_PROMPT.md`, create `_projects/<slug>.md`
- **Add a live site to the gallery** — verify the URL responds, then add it to `_data/sites.yml` with a screenshot in `assets/img/sites/`. Dead sites are removed, never hidden.
- **Change or add motion** — read `docs/Animation-Guide.md`, then follow `prompts/GSAP_PROMPT.md`
- **Render video assets** — follow `prompts/REMOTION_PROMPT.md`
