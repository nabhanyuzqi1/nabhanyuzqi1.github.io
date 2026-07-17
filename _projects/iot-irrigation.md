---
title: IoT Irrigation
tagline: Keeping a 2,000-tree palm oil nursery alive with ESP32s, soil sensors, and a cloud dashboard.
category: IoT · Hardware
year: 2025
role: Hardware · Firmware · Dashboard
stack: [ESP32, C++ / Arduino, Soil sensors, Relays & pumps, Firebase]
featured: true
order: 4
cover: /assets/img/covers/iot-irrigation.svg
description: >-
  Case study — an automated irrigation system for a 2,000-tree palm oil nursery:
  ESP32 microcontrollers, soil-moisture sensing, relay-driven pumps, and remote
  monitoring.
---

## The problem

A palm oil nursery with ~2,000 seedlings has one non-negotiable job: nothing dries
out. Manual watering at that scale means workers walking rows with hoses, no record
of what was actually watered, and losses whenever heat spikes outpace the schedule.
A dead seedling is months of growth gone.

## The approach

Automate the decision, not just the valve. Soil-moisture sensors feed ESP32
microcontrollers that switch pumps through relays when readings cross thresholds —
and every reading and pump-run is reported up to a dashboard, so the nursery can
see the whole field's condition remotely instead of guessing.

## Architecture

<div class="case-diagram" data-scene="cs-diagram">
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture: sensors to ESP32 to pumps and cloud dashboard">
  <defs>
    <marker id="arrow-io" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#9a9aa3"/>
    </marker>
  </defs>
  <rect class="d-box" x="20" y="60" width="150" height="70" rx="10"/>
  <text class="d-label" x="95" y="90">Soil sensors</text>
  <text class="d-sub" x="95" y="108">moisture per zone</text>

  <rect class="d-box d-box--accent" x="250" y="60" width="150" height="130" rx="10"/>
  <text class="d-label" x="325" y="94">ESP32</text>
  <text class="d-sub" x="325" y="112">threshold logic</text>
  <text class="d-sub" x="325" y="130">offline-safe control</text>
  <text class="d-sub" x="325" y="166">Wi-Fi uplink</text>

  <rect class="d-box" x="480" y="40" width="130" height="60" rx="10"/>
  <text class="d-label" x="545" y="66">Relays</text>
  <text class="d-sub" x="545" y="84">pump control</text>

  <rect class="d-box" x="480" y="150" width="130" height="60" rx="10"/>
  <text class="d-label" x="545" y="176">Cloud</text>
  <text class="d-sub" x="545" y="194">telemetry log</text>

  <rect class="d-box" x="640" y="150" width="100" height="60" rx="10"/>
  <text class="d-label" x="690" y="176">Dashboard</text>
  <text class="d-sub" x="690" y="194">remote monitor</text>

  <path class="d-line d-flow" d="M170 95 H250" marker-end="url(#arrow-io)"/>
  <path class="d-line" d="M400 80 H480" marker-end="url(#arrow-io)"/>
  <path class="d-line" d="M400 170 H480" marker-end="url(#arrow-io)"/>
  <path class="d-line" d="M610 180 H640" marker-end="url(#arrow-io)"/>
  <circle class="d-dot" cx="170" cy="95" r="5"/>
</svg>
</div>

## Key engineering decisions

- **Control at the edge, insight in the cloud.** Watering decisions run on the
  ESP32 itself — if the internet drops, the plants still get watered. The cloud
  gets telemetry, not authority.
- **Zones over a single loop.** Sensors and pump circuits are grouped by nursery
  zone, so a wet corner doesn't stop a dry one from being watered.
- **Cheap, replaceable parts.** Consumer-grade ESP32s and standard relays keep the
  per-zone cost low enough that spares live on a shelf — uptime by redundancy,
  not by premium hardware.

## Impact

<div class="case-metrics">
  <div class="case-metric"><p class="case-metric__value"><span data-count="2000">2000</span></p><p class="case-metric__label">seedlings under automated watering</p></div>
  <div class="case-metric"><p class="case-metric__value">24/7</p><p class="case-metric__label">moisture-driven watering, no manual rounds</p></div>
  <div class="case-metric"><p class="case-metric__value">Remote</p><p class="case-metric__label">field condition visible from anywhere</p></div>
</div>
