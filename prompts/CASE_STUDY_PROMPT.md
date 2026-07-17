# CASE STUDY PROMPT — `_projects/*.md`

Role: technical storyteller. A case study here is an engineering story with
evidence — not a screenshot dump.

## Front matter (all fields required unless noted)

```yaml
title: <Name>
tagline: <one sentence, concrete, no buzzwords>
category: <e.g. Mobile Platform / SaaS · POS>
year: <YYYY>
role: <e.g. Founder · Product · Fullstack>
stack: [<4–6 items>]
links:            # optional — ONLY verified-live URLs or public repos
  - label: <text>
    url: <url>
featured: <true|false>   # true → appears in landing work grid
order: <int>             # position + next-project chain
cover: /assets/img/covers/<slug>.svg
description: <SEO sentence for meta tags>
```

## Body skeleton (h2 sections, in order)

1. `## The problem` — the business pain, specific and human. Numbers if honest.
2. `## The approach` — key product decisions and why.
3. `## Architecture` — a `.case-diagram` inline SVG (copy an existing one as a
   template; classes `d-box/d-label/d-sub/d-line/d-title`, one `d-flow` path +
   one `d-dot` for the traveling-request animation, unique marker id per svg).
4. `## Key engineering decisions` — 3–4 bullets, each "decision + why it matters".
5. `## Impact` — `.case-metrics` grid; numbers use `<span data-count="N">N</span>`.
   Optional `.case-screens` figures (real screenshots only).

## Truth rules (non-negotiable)

- Never invent metrics, users, or revenue. "Live in production" only if verified.
- Simulated/academic numbers (e.g. thesis SUS scores from simulated data) are
  NOT metrics — describe the testing method instead.
- Dead products don't get links.

## Self-review

Would the client/employer described recognize this account as accurate?
Does every metric trace to something checkable?
