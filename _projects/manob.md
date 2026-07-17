---
title: Manob Production
tagline: A creative agency's digital home — production site live at manobproduction.com, plus an academy app in Kotlin Multiplatform.
category: Agency · Web & Mobile
year: 2025
role: Web development · Mobile development
stack: [Next.js, TypeScript, Kotlin Multiplatform, Firebase]
links:
  - label: Live site
    url: https://manobproduction.com
  - label: Academy app source
    url: https://github.com/nabhanyuzqi1/manob-academy-kmp
featured: false
order: 6
cover: /assets/img/covers/manob.svg
description: >-
  Case study — Manob Production: the agency's production website at
  manobproduction.com and a companion academy app built with Kotlin Multiplatform.
---

## The problem

A creative production house sells taste — so a slow, template-looking website
actively costs them clients. Manob Production needed a site that carries their
portfolio credibly, plus a learning product ("academy") that could grow into its
own line of business on mobile.

## The approach

Two deliverables, one brand system. The public site puts the work first: fast
loads, strong typography, portfolio front and center — live in production at
**manobproduction.com**. The academy ships as a **Kotlin Multiplatform** app, so
course content and business logic are written once and shared across platforms.

## Architecture

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: agency web platform and KMP academy app sharing Firebase">
  <defs>
    <marker id="arrow-mb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <rect class="d-box" x="20" y="40" width="180" height="70" rx="10"/>
  <text class="d-label" x="110" y="70">manobproduction.com</text>
  <text class="d-sub" x="110" y="88">Next.js · portfolio · leads</text>

  <rect class="d-box" x="20" y="140" width="180" height="70" rx="10"/>
  <text class="d-label" x="110" y="170">Academy app</text>
  <text class="d-sub" x="110" y="188">Kotlin Multiplatform</text>

  <rect class="d-box d-box--accent" x="330" y="85" width="180" height="90" rx="10"/>
  <text class="d-label" x="420" y="120">Firebase</text>
  <text class="d-sub" x="420" y="138">auth · content · media</text>

  <rect class="d-box" x="600" y="85" width="140" height="90" rx="10"/>
  <text class="d-label" x="670" y="120">Shared brand</text>
  <text class="d-sub" x="670" y="138">one identity across</text>
  <text class="d-sub" x="670" y="154">web + mobile</text>

  <path class="d-line d-flow" d="M200 75 C 260 75, 270 105, 330 115" marker-end="url(#arrow-mb)"/>
  <path class="d-line" d="M200 175 C 260 175, 270 150, 330 145" marker-end="url(#arrow-mb)"/>
  <path class="d-line" d="M510 130 H600" marker-end="url(#arrow-mb)"/>
  <circle class="d-dot" cx="200" cy="75" r="5"/>
</svg>
</div>

## Key engineering decisions

- **KMP where it pays.** The academy's domain logic (courses, progress, auth) is
  shared Kotlin; UI stays native-feeling per platform — code reuse without the
  uncanny-valley UI of a lowest-common-denominator framework.
- **The site is a portfolio, not a brochure.** Content structure and image
  pipeline are built around showing production work large and fast.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value">Live</p><p class="case-metric__label">agency site in production at manobproduction.com</p></div>
  <div class="case-metric"><p class="case-metric__value">2 platforms</p><p class="case-metric__label">served by one shared KMP codebase for the academy</p></div>
</div>

<div class="case-screens" data-scene="cs-screens">
  <figure>
    <img src="{{ '/assets/img/sites/manob-production.jpg' | relative_url }}" alt="Manob Production website in production" loading="lazy" width="920" height="575">
    <figcaption>manobproduction.com — live production site</figcaption>
  </figure>
</div>
