---
title: Tekka Cafe OS
tagline: One codebase, many cafes — a multi-tenant ordering and POS SaaS for PT Tuntas Kilat Group.
category: SaaS · POS
year: 2026
role: Founder · Architecture · Fullstack
stack: [PHP, MySQL, JavaScript, Multi-tenant architecture]
links:
  - label: Repository (private) — overview on GitHub profile
    url: https://github.com/nabhanyuzqi1
featured: false
order: 5
cover: /assets/img/covers/tekka-pos.svg
description: >-
  Case study — Tekka Cafe OS, a multi-tenant cafe ordering and point-of-sale SaaS:
  one deployment serving many cafes with isolated data, menus, and orders.
---

## The problem

Every small cafe wants the same software — menu, orders, payments, daily recap —
but none can afford custom development, and juggling one deployment per customer
doesn't scale for a tiny team either. The economics only work if **one system
serves every cafe**.

## The approach

Tekka Cafe OS is built multi-tenant from the first table: each cafe is a tenant
with its own menu, staff, orders, and reporting, served from a single deployment.
Onboarding a new cafe is configuration, not a project.

## Architecture

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: multiple cafe tenants on one Tekka deployment">
  <defs>
    <marker id="arrow-tp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <rect class="d-box" x="20" y="30" width="130" height="50" rx="10"/>
  <text class="d-label" x="85" y="60">Cafe A</text>
  <rect class="d-box" x="20" y="100" width="130" height="50" rx="10"/>
  <text class="d-label" x="85" y="130">Cafe B</text>
  <rect class="d-box" x="20" y="170" width="130" height="50" rx="10"/>
  <text class="d-label" x="85" y="200">Cafe N…</text>

  <rect class="d-box d-box--accent" x="270" y="55" width="200" height="140" rx="10"/>
  <text class="d-label" x="370" y="95">Tekka Cafe OS</text>
  <text class="d-sub" x="370" y="113">tenant resolution</text>
  <text class="d-sub" x="370" y="131">ordering · POS · recap</text>
  <text class="d-sub" x="370" y="163">single deployment</text>

  <rect class="d-box" x="580" y="55" width="160" height="60" rx="10"/>
  <text class="d-label" x="660" y="81">Tenant data</text>
  <text class="d-sub" x="660" y="99">scoped per cafe</text>
  <rect class="d-box" x="580" y="140" width="160" height="60" rx="10"/>
  <text class="d-label" x="660" y="166">Reports</text>
  <text class="d-sub" x="660" y="184">daily sales recap</text>

  <path class="d-line" d="M150 55 C 210 55, 210 90, 270 100" marker-end="url(#arrow-tp)"/>
  <path class="d-line" d="M150 125 H270" marker-end="url(#arrow-tp)"/>
  <path class="d-line" d="M150 195 C 210 195, 210 160, 270 150" marker-end="url(#arrow-tp)"/>
  <path class="d-line" d="M470 95 H580" marker-end="url(#arrow-tp)"/>
  <path class="d-line" d="M470 160 H580" marker-end="url(#arrow-tp)"/>
  <!-- composite flow: Cafe → Tekka OS → Tenant data -->
  <path class="d-flow" d="M150 55 C 210 55, 210 90, 270 100 L370 125 H470 V95 H660" fill="none" stroke="none"/>
  <circle class="d-dot" cx="150" cy="55" r="5"/>
</svg>
</div>

## Key engineering decisions

- **Tenancy enforced in the data layer.** Every query is tenant-scoped at the
  source — cross-tenant leakage is a structural impossibility, not a code-review
  hope.
- **Boring, hostable stack.** PHP + MySQL runs on cheap commodity hosting that
  Indonesian SME margins can actually afford, and any local developer can maintain.
- **Cafe-shaped features only.** No generic ERP ambitions: menus, orders, POS,
  daily recap. Small surface, fast onboarding, less to break.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value">1 → N</p><p class="case-metric__label">one deployment onboards each new cafe by configuration</p></div>
  <div class="case-metric"><p class="case-metric__value">Minutes</p><p class="case-metric__label">to set up a new tenant, not weeks</p></div>
</div>
