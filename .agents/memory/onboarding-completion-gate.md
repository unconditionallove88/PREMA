---
name: Onboarding completion gate (prema-mobile)
description: Why finishing onboarding must update SessionContext state, not just AsyncStorage.
---

`hasOnboarded` in SessionContext is loaded **once** from AsyncStorage at provider
mount and never re-read. Any feature gated on `hasOnboarded` (e.g. the root-level
AlarmManager that fires Nurture reminders on intervals) will stay dormant for the
rest of the session if onboarding only writes `prema_onboarded` to AsyncStorage.

**Rule:** When a flow completes onboarding, call an in-memory action
(`completeOnboarding()`) that flips the context state to `true` *and* persists it —
do not rely on the AsyncStorage write alone.

**Why:** Without flipping in-memory state, the user finishes onboarding, navigates to
the tabs, but the alarm intervals never start until the app is fully restarted
(which re-runs the mount-time AsyncStorage load).

**How to apply:** Any new feature that should activate "after onboarding" must depend
on the live `hasOnboarded` context value, and the onboarding save path must update
that value before/at navigation. The redirect effect in `_layout` only depends on
`[hasOnboarded]`, so flipping it false→true does not bounce the user back to onboarding.

## Version gate (re-showing a redesigned onboarding)

When onboarding is significantly redesigned, returning users stay stuck on the
dashboard because their persisted `prema_onboarded="true"` makes `_layout` skip the
landing forever — and a fresh screenshot browser hides this (empty storage looks fine).

**Rule:** Gate completion on BOTH the flag and a version: `hasOnboarded =
onboarded === "true" && onbVersion === ONBOARDING_VERSION`. Bump the
`ONBOARDING_VERSION` constant when the flow changes; `completeOnboarding()` writes
`prema_onboarded` + `prema_onboarding_version` together. Old users (no version key)
fall through to the new landing once, then match on next launch — no redirect loop.
