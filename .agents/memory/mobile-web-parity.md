---
name: Mobile ↔ web feature parity
description: How the prema-mobile Expo app relates to the prema web app, and how to preview gated tab/stack screens.
---

# prema-mobile is a faithful port of the prema web app

**Rule:** The web app (`artifacts/prema/src/app/`) is the canonical product. The Expo
mobile app (`artifacts/prema-mobile/`) mirrors its features/copy, it does NOT invent
its own. When a mobile screen and a web screen diverge, the web is the source of truth
unless the user says otherwise.

**Why:** prema was originally a mobile-first product migrated to web; an earlier mobile
build was a simplified "surrogate" the user rejected. The user explicitly asked for a
faithful port of the core member screens.

**How to apply:** When building/fixing a mobile screen, read the matching
`artifacts/prema/src/app/<route>/page.tsx` first and reproduce its sections, flow, and
bilingual EN/DE copy. Mobile member nav = Home/Phases/Map/Network/Profile tabs +
stack detail screens (heart-status, laboratory-test, self-care, recovery, before,
during). Staff consoles (awareness, support-console) are out of scope.

# Previewing onboarding-gated screens

`app/_layout.tsx` redirects to `/onboarding` whenever `hasOnboarded` is false, so the
screenshot tool only ever sees onboarding. To inspect tab/stack screens, temporarily
**comment out the redirect block** (not just change its target — a `router.replace`
fires on mount and overrides any path you navigate to). Revert immediately after.
