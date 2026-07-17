---
title: Kontrack
tagline: A project & finance dashboard for contractors — with Gemini reading the contracts so humans don't have to.
category: Web App · AI
year: 2025
role: Design · Fullstack · AI integration
stack: [JavaScript, Firebase Hosting, Firestore, Firebase Auth, Gemini API]
links:
  - label: Live app
    url: https://kontrack.web.app/
  - label: Source on GitHub
    url: https://github.com/nabhanyuzqi1/kontrack
featured: true
order: 2
cover: /assets/img/covers/kontrack.svg
description: >-
  Case study — Kontrack, a contractor project-management and finance dashboard
  with Gemini-powered contract data extraction, running serverless on Firebase.
---

## The problem

Small contracting businesses live inside their contracts: payment terms,
milestones, values, deadlines. In practice all of that sits in scanned PDFs and
someone re-types it into spreadsheets — slowly, and with errors that surface as
missed payments and schedule disputes.

## The approach

Kontrack treats the contract document as the input, not the archive. Upload a
contract, let **Gemini extract the structured data** — parties, values, dates,
milestones — then manage the project and its money from a live dashboard instead
of a folder of PDFs.

## Architecture

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: browser SPA on Firebase with Gemini extraction">
  <defs>
    <marker id="arrow-ko" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <text class="d-title" x="20" y="30">CLIENT</text>
  <rect class="d-box" x="20" y="60" width="170" height="80" rx="10"/>
  <text class="d-label" x="105" y="94">Kontrack SPA</text>
  <text class="d-sub" x="105" y="112">dashboard · projects · finance</text>

  <text class="d-title" x="300" y="30">AI</text>
  <rect class="d-box d-box--accent" x="300" y="60" width="170" height="80" rx="10"/>
  <text class="d-label" x="385" y="94">Gemini API</text>
  <text class="d-sub" x="385" y="112">contract → structured data</text>

  <text class="d-title" x="580" y="30">FIREBASE</text>
  <rect class="d-box" x="580" y="60" width="160" height="150" rx="10"/>
  <text class="d-label" x="660" y="94">Firestore</text>
  <text class="d-sub" x="660" y="112">projects · payments</text>
  <text class="d-label" x="660" y="148">Hosting + Auth</text>
  <text class="d-sub" x="660" y="166">kontrack.web.app</text>
  <text class="d-label" x="660" y="196">PDF reports</text>

  <rect class="d-box" x="300" y="170" width="170" height="60" rx="10"/>
  <text class="d-label" x="385" y="196">Contract upload</text>
  <text class="d-sub" x="385" y="214">PDF / scan</text>

  <path class="d-line" d="M190 100 H300" marker-end="url(#arrow-ko)"/>
  <path class="d-line" d="M385 170 V140" marker-end="url(#arrow-ko)"/>
  <path class="d-line" d="M470 100 H580" marker-end="url(#arrow-ko)"/>
  <path class="d-line" d="M190 130 C 240 200, 250 200, 300 200" marker-end="url(#arrow-ko)"/>
  <!-- composite flow: SPA → Gemini → Firestore -->
  <path class="d-flow" d="M190 100 H385 V100 H580" fill="none" stroke="none"/>
  <circle class="d-dot" cx="190" cy="100" r="5"/>
</svg>
</div>

## Key engineering decisions

- **Extraction is assist, not autopilot.** Gemini's output pre-fills the project
  form; a human confirms before anything becomes a record. Wrong AI guesses cost
  a click, not an invoice.
- **Serverless end to end.** Firebase Hosting + Firestore + client-side calls keep
  the running cost of a niche B2B tool near zero — it can idle cheaply and scale
  when a contractor loads it up.
- **Finance is derived, never duplicated.** Payment progress, outstanding amounts,
  and project health are computed from one source of truth in Firestore, so the
  dashboard can't drift from reality.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value"><span data-count="1">1</span> upload</p><p class="case-metric__label">replaces manual re-typing of a whole contract</p></div>
  <div class="case-metric"><p class="case-metric__value">Live</p><p class="case-metric__label">in production at kontrack.web.app</p></div>
  <div class="case-metric"><p class="case-metric__value">$0</p><p class="case-metric__label">fixed server cost — fully serverless</p></div>
</div>

<div class="case-screens" data-scene="cs-screens">
  <figure>
    <img src="{{ '/assets/img/sites/kontrack.jpg' | relative_url }}" alt="Kontrack dashboard in production" loading="lazy" width="920" height="575">
    <figcaption>kontrack.web.app — production dashboard</figcaption>
  </figure>
</div>
