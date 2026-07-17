---
title: M-Clearance
tagline: Digitizing the immigration clearance workflow in Sampit — from paper stacks to a verified digital trail.
category: Mobile App · GovTech
year: 2026
role: Design · Flutter development
stack: [Flutter, Dart, Firebase Auth, Firestore, Cloud Storage]
links:
  - label: Source on GitHub
    url: https://github.com/nabhanyuzqi1/m-clearance-imigrasi
featured: true
order: 3
cover: /assets/img/covers/m-clearance.svg
description: >-
  Case study — M-Clearance, a Flutter application that digitizes the immigration
  clearance application workflow for Sampit: submission, document upload, officer
  verification, and issued clearance.
---

## The problem

An immigration clearance is a paper workflow: applicants bring physical documents
to a counter, officers check them by hand, and status lives in a stack of forms.
Applicants can't see where their application is; officers can't see workload at a
glance; and the audit trail is only as good as the filing cabinet.

## The approach

M-Clearance moves the workflow — not just the forms — onto mobile. Applicants
submit and upload documents from a Flutter app; officers verify against a live
queue; approvals produce a digital clearance record. The design priority was
**bureaucratic legibility**: every application is always in exactly one state
(submitted → under review → needs revision → cleared/rejected), and both sides
see the same state at the same time.

## Architecture

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: applicant app and officer console over Firebase">
  <defs>
    <marker id="arrow-mc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <rect class="d-box" x="20" y="40" width="160" height="70" rx="10"/>
  <text class="d-label" x="100" y="70">Applicant</text>
  <text class="d-sub" x="100" y="88">submit + upload docs</text>

  <rect class="d-box" x="20" y="150" width="160" height="70" rx="10"/>
  <text class="d-label" x="100" y="180">Officer</text>
  <text class="d-sub" x="100" y="198">verify · approve · reject</text>

  <rect class="d-box d-box--accent" x="300" y="40" width="180" height="180" rx="10"/>
  <text class="d-label" x="390" y="76">Firestore</text>
  <text class="d-sub" x="390" y="94">application state machine</text>
  <text class="d-label" x="390" y="130">Cloud Storage</text>
  <text class="d-sub" x="390" y="148">document scans</text>
  <text class="d-label" x="390" y="184">Firebase Auth</text>
  <text class="d-sub" x="390" y="202">role separation</text>

  <rect class="d-box" x="580" y="90" width="160" height="80" rx="10"/>
  <text class="d-label" x="660" y="124">Clearance record</text>
  <text class="d-sub" x="660" y="142">status + audit trail</text>

  <path class="d-line" d="M180 75 H300" marker-end="url(#arrow-mc)"/>
  <path class="d-line" d="M180 185 H300" marker-end="url(#arrow-mc)"/>
  <path class="d-line" d="M480 130 H580" marker-end="url(#arrow-mc)"/>
  <!-- composite flow: Applicant → Firebase → Clearance -->
  <path class="d-flow" d="M180 75 H390 V130 H580 V130 H660" fill="none" stroke="none"/>
  <circle class="d-dot" cx="180" cy="75" r="5"/>
</svg>
</div>

## Key engineering decisions

- **A state machine, not status strings.** Application status transitions are
  constrained — an application can't jump from "needs revision" to "cleared"
  without passing review — which keeps the digital trail defensible.
- **Documents live in Storage, states live in Firestore.** Heavy scans never
  bloat the queryable records; officers filter and sort the queue in real time.
- **Roles at the auth layer.** Applicant and officer capabilities are separated by
  Firebase Auth claims and enforced in security rules, not hidden buttons.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value">1 queue</p><p class="case-metric__label">replaces the counter line — officers see all pending applications live</p></div>
  <div class="case-metric"><p class="case-metric__value">Full</p><p class="case-metric__label">audit trail on every state change</p></div>
  <div class="case-metric"><p class="case-metric__value">0</p><p class="case-metric__label">lost paperwork — documents are attached to the record, permanently</p></div>
</div>
