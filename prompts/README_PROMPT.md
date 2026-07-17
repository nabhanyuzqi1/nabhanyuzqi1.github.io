# README PROMPT — keep README honest

The README describes what the repo IS, not what it aspires to be. Update it in
the same commit as any structural change.

## Structure (fixed)

1. Title + one-line description + live URL
2. Stack summary (Jekyll · GSAP/Lenis CDN · Remotion offline pipeline)
3. Repo map (folders + one-line purpose each)
4. Local development (`bundle install`, `bundle exec jekyll serve`)
5. Deployment (push to `main` → GitHub Actions → Pages)
6. Content workflows (add a case study / add a live site / change motion —
   pointing at the matching `prompts/*.md`)

## Rules

- If a feature isn't merged and working, it isn't in the README.
- Every path mentioned must exist; every URL mentioned must be live.
- No badges, no emoji walls, no marketing prose — this is an engineering document.
