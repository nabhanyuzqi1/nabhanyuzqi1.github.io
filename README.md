# nabhanyuzqi1.github.io

Cinematic developer portfolio of **Nabhan Yuzqi Al Mubarok** — live at
[nabhanyuzqi1.github.io](https://nabhanyuzqi1.github.io/).

Static Jekyll site, editorial-dark design, zero animation libraries — a few
authentic scenes (route board from Sampit, hover-preview work index, Remotion
showreel) instead of template scroll effects. No servers, no databases.

## Stack

- **Jekyll** (GitHub Pages whitelisted plugins only: `jekyll-seo-tag`, `jekyll-sitemap`)
- **Vanilla JS + CSS motion** (~10 KB) — spec in [docs/Animation-Guide.md](docs/Animation-Guide.md)
- **Remotion** (`remotion/`) — renders the showreel video from real production
  screenshots (`sh scripts/render-videos.sh` → `assets/video/showreel.webm`)
- Fonts: Clash Display + Satoshi (Fontshare), JetBrains Mono

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
