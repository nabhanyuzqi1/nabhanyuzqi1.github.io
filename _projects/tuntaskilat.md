---
title: Tuntaskilat
tagline: An on-demand cleaning platform for Sampit — three Flutter apps on one Firebase backend, zero servers.
category: Mobile Platform
year: 2026
role: Founder · Product · Fullstack
stack: [Flutter, Dart, Firestore, Firebase Auth, Cloud Storage, FCM]
links:
  - label: Source on GitHub
    url: https://github.com/nabhanyuzqi1/tuntaskilat
featured: true
order: 1
cover: /assets/img/covers/tuntaskilat.svg
description: >-
  Case study — Tuntaskilat, an on-demand cleaning platform built with Flutter and
  Firebase using Human-Centered Design: 3 apps, 22 screens, atomic booking
  transactions, production security rules.
---

## The problem

PT Tuntas Kilat Group provides home cleaning services in Sampit, Central Kalimantan.
Before this platform, every booking arrived by phone call or personal chat and was
recorded by hand. That created three failure modes that cost real money:

- **Double-bookings** — two customers, one crew, same time slot, discovered only when someone's house didn't get cleaned.
- **Zero price transparency** — customers couldn't see a price until a human quoted one, and couldn't verify who would show up at their door.
- **No order visibility** — "is the crew on the way?" had no answer other than another phone call.

## The approach

The platform was designed with **Human-Centered Design** and validated as an
examined undergraduate thesis at Universitas Darwan Ali — meaning every flow was
specified, built, and then black-box tested against written scenarios before being
called done. The user base skews non-technical (including older customers wary of
confusing layouts), so the customer flow is deliberately linear: pick a service,
adjust rooms/duration, see the exact fixed price, book, pay, track.

One deliberate scope decision: **fixed pricing only**. Prices come from a managed
service catalog (`services.harga × quantity`) and are recomputed and validated at
submit time — the client's number is never trusted.

## Architecture

Three apps, one backend, no servers. Customer and Crew ship as Android Flutter
apps; Admin runs as Flutter Web from the office.

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: three Flutter apps talking to Firebase services">
  <defs>
    <marker id="arrow-tk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <text class="d-title" x="20" y="30">CLIENTS</text>
  <rect class="d-box" x="20" y="50" width="150" height="56" rx="10"/>
  <text class="d-label" x="95" y="74">Customer app</text>
  <text class="d-sub" x="95" y="92">Flutter · Android · P1–P12</text>
  <rect class="d-box" x="20" y="130" width="150" height="56" rx="10"/>
  <text class="d-label" x="95" y="154">Crew app</text>
  <text class="d-sub" x="95" y="172">Flutter · Android · K1–K5</text>
  <rect class="d-box" x="20" y="210" width="150" height="56" rx="10"/>
  <text class="d-label" x="95" y="234">Admin console</text>
  <text class="d-sub" x="95" y="252">Flutter Web · A1–A5</text>

  <text class="d-title" x="330" y="30">FIREBASE (NO SERVERS)</text>
  <rect class="d-box d-box--accent" x="330" y="50" width="180" height="216" rx="10"/>
  <text class="d-label" x="420" y="86">Firestore</text>
  <text class="d-sub" x="420" y="104">7 collections · security rules</text>
  <text class="d-label" x="420" y="140">Authentication</text>
  <text class="d-label" x="420" y="180">Cloud Storage</text>
  <text class="d-sub" x="420" y="198">before/after photos · receipts</text>
  <text class="d-label" x="420" y="234">Cloud Messaging</text>
  <text class="d-sub" x="420" y="252">status pushes</text>

  <text class="d-title" x="590" y="30">GUARANTEE</text>
  <rect class="d-box" x="590" y="50" width="150" height="90" rx="10"/>
  <text class="d-label" x="665" y="84">Atomic booking</text>
  <text class="d-sub" x="665" y="102">Firestore Transaction</text>
  <text class="d-sub" x="665" y="118">locks the time slot</text>
  <rect class="d-box" x="590" y="176" width="150" height="90" rx="10"/>
  <text class="d-label" x="665" y="210">Server-side price</text>
  <text class="d-sub" x="665" y="228">harga × qty revalidated</text>
  <text class="d-sub" x="665" y="244">client never trusted</text>

  <path class="d-line" d="M170 78 H330" marker-end="url(#arrow-tk)"/>
  <path class="d-line" d="M170 158 H330" marker-end="url(#arrow-tk)"/>
  <path class="d-line" d="M170 238 H330" marker-end="url(#arrow-tk)"/>
  <path class="d-line" d="M510 95 H590" marker-end="url(#arrow-tk)"/>
  <path class="d-line" d="M510 221 H590" marker-end="url(#arrow-tk)"/>
  <!-- composite flow: Customer → Firebase → Guarantee -->
  <path class="d-flow" d="M170 78 H420 V95 H590 V95 H665" fill="none" stroke="none"/>
  <circle class="d-dot" cx="170" cy="78" r="5"/>
</svg>
</div>

## Key engineering decisions

- **Double-booking is solved with Firestore Transactions, not hope.** A new order
  runs inside an atomic transaction that reads the slot and writes the lock in one
  step — a plain `get()` then `set()` would reintroduce the race the platform
  exists to eliminate.
- **Security rules as the backend.** With no API server, Firebase Security Rules
  carry production authorization: users read and write only their own documents;
  crew see assigned jobs; admin operations are role-gated.
- **Field names are a contract.** The Firestore schema mirrors the thesis data
  dictionary exactly, so the running system stays traceable to the examined design.
- **Manual payment, by design.** MVP payments use uploaded transfer/QRIS proof
  verified by admin — right-sized for how Sampit actually pays, with gateway
  integration planned as a later phase.

## Testing

Every critical flow maps to one of eight written black-box scenarios — booking,
locking, payment proof, crew photo reporting, rating — and a feature is only
"done" when its scenario passes. The thesis was examined and passed on this basis.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value"><span data-count="3">3</span></p><p class="case-metric__label">apps from one codebase discipline (Customer, Crew, Admin)</p></div>
  <div class="case-metric"><p class="case-metric__value"><span data-count="22">22</span></p><p class="case-metric__label">screens specified &amp; built (P1–P12 · K1–K5 · A1–A5)</p></div>
  <div class="case-metric"><p class="case-metric__value"><span data-count="7">7</span></p><p class="case-metric__label">Firestore collections behind production security rules</p></div>
  <div class="case-metric"><p class="case-metric__value"><span data-count="0">0</span></p><p class="case-metric__label">servers to maintain — 100% Firebase</p></div>
</div>

The manual phone-and-notebook flow is replaced end-to-end: transparent fixed
prices before checkout, a locked schedule that can't double-book, photo-verified
work, and an admin console that sees everything in real time.
