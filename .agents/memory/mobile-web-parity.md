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
bilingual EN/DE copy. Staff consoles (awareness, support-console) are out of scope.

**Mobile nav diverged on purpose (2026-06):** the user explicitly restructured the
mobile tab bar to exactly 5 tabs — circle (home, full-screen heartbeat) · breath ·
letters · lab · create. The old Home/Phases/Map/Network/Profile model and the
map/network/phases tabs were removed at the user's request, so for navigation the
mobile app is NO LONGER a mirror of web — treat the 5-tab layout as canonical for
mobile. Orphaned stack screens (heart-status, laboratory-test, self-care, recovery,
before, during) remain registered but are unreachable from the new tabs.

**"you" (profile) is no longer a tab — it lives inside the circle tab (2026-06):**
the profile route (`app/(tabs)/profile.tsx`) was deleted and its content moved into a
slide-up panel (`components/YouPanel.tsx`, driven by `context/YouPanel.tsx`'s
`YouPanelProvider`/`useYouPanel`). It opens two ways: (a) tapping the Circle of Love on
the dashboard, (b) re-tapping the already-focused "circle" tab. Re-tap is wired via a
`navigation.addListener("tabPress")` inside `app/(tabs)/index.tsx` (NOT in `_layout.tsx`),
so it works for both the classic Tabs layout and the native liquid-glass tabs — the
native `NativeTabs.Trigger` exposes no re-tap/press event API, so this screen-level
listener is the only cross-layout hook. Close the panel via swipe-down or × top-right.

# Previewing onboarding-gated screens

`app/_layout.tsx` redirects to `/onboarding` whenever `hasOnboarded` is false, so the
screenshot tool only ever sees onboarding. To inspect tab/stack screens, temporarily
**comment out the redirect block** (not just change its target — a `router.replace`
fires on mount and overrides any path you navigate to). Revert immediately after.
