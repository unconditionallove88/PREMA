---
name: Mobile AlarmOverlay vibration
description: How to handle device vibration in the Prema mobile app overlay component
---

## Rule
Always guard `Vibration.vibrate()` and `Vibration.cancel()` with `Platform.OS !== "web"` — the RN Vibration API throws on Expo web. `expo-haptics` works cross-platform and is installed; use it for confirmation feedback.

**Why:** Vibration is not available in the browser; without the guard the AlarmOverlay crashes on web preview.

**How to apply:** In any component that uses `Vibration` from `react-native`, wrap calls in `if (Platform.OS !== "web") { ... }`.
