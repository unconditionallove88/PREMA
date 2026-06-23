---
name: Expo custom animated tab bar (pnpm monorepo)
description: How to build/animate a custom bottom tab bar in the prema-mobile Expo app, and the dependency gotcha that makes it possible.
---

To slide/hide or otherwise animate the bottom tab bar in `artifacts/prema-mobile`,
provide a custom `tabBar` to expo-router's classic `<Tabs>` that wraps
`BottomTabBar` from `@react-navigation/bottom-tabs` in an `Animated.View`.

**Dependency gotcha:** `@react-navigation/bottom-tabs` is only a *transitive*
dep of expo-router, so under pnpm it is NOT resolvable as a direct import and a
bare `import { BottomTabBar }` will fail to bundle. Fix: add it to the package's
`package.json` pinned to the **exact** version expo-router already installs (find
it under `node_modules/.pnpm/@react-navigation+bottom-tabs@*`). Matching the
version makes pnpm dedupe to a single physical instance, so your import and
expo-router share one navigation context (no "couldn't find navigation context"
errors).

**Why:** mismatched/duplicate instances break React Navigation's context; a
non-resolvable transitive dep breaks the Metro bundle.

**How to apply:**
- Share a single `Animated.Value` between the screen and the tab bar via a React
  context provider that wraps `<Tabs>` (see `context/TabBarVisibility.tsx`). The
  custom `tabBar` and the route screens are both descendants, so both consume the
  same value.
- The tab-bar-hide path only applies to ClassicTabs (web/Android/most iOS).
  On liquid-glass iOS the layout uses `NativeTabs`, which can't take a custom
  `tabBar` — the context consumer returns `null` there and the screen no-ops
  gracefully.
- On web, `Animated` falls back to the JS driver (no native module); transform +
  opacity still animate. A cubic ease-in-out barely moves in the first ~1s, so
  early screenshots can look like nothing happened — verify with a temporarily
  shortened duration, not a single early capture.

**Per-screen immersion policies share one context safely:** different screens drive
the *same* `translate` value with different rules (breath = hide permanently on
focus; circle = hide after 3s, reveal on touch via a full-screen `Pressable`
`onPressIn` + re-hide after 5s idle). Each screen owns its own `setTimeout` refs,
clears them and calls `show()` in its `useFocusEffect` cleanup, so leaving one
screen never leaves the bar stuck hidden for the next. Because the context's
hide/show both `stopAnimation()` first, brief competing show/hide calls during a
tab transition settle deterministically on the focused screen's intent.
- To fade on-screen copy in lockstep with the bar, derive its opacity from
  `tabBar.translate` (`interpolate [0,1]→[1,0]`) instead of a separate value.
