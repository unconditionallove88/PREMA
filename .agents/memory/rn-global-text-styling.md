---
name: RN global text styling (Nunito + lowercase)
description: How to enforce a global font + textTransform across ALL text in the Expo/RN 0.81 app, and why the obvious monkeypatches fail.
---

To force a global font and/or `textTransform` on every piece of text in `prema-mobile`:

**Use a shared wrapper component** (`components/Text.tsx`) that wraps RN `Text` and applies the
defaults via a style array `[base, callerStyle, forced]` — put the forced rule LAST so it always
wins over per-instance styles (even explicit `textTransform: "uppercase"`). Then repoint every
`import { Text } from "react-native"` to `@/components/Text` (a simple codemod over the ~dozen files
that import it). `TextInput` is deliberately left on RN so typed input keeps its real casing.

**Why the obvious global monkeypatches do NOT work on RN 0.81 / React 19:**
- RN 0.81 `Text` is authored with Flow `component(...)` syntax → compiles to a **plain function
  component** (ref is a normal prop in React 19). There is **no `Text.render`** to patch, so the
  classic `Text.render = ...` forwardRef trick silently no-ops.
- Patching the JSX runtime (`react/jsx-runtime` / `react/jsx-dev-runtime`) throws
  `Cannot set property jsx of #<Object> which has only a getter` — the namespace exports are
  getter-only, so you cannot reassign `jsx`/`jsxs`/`jsxDEV`. This white-screens the app.

**Escape hatches the wrapper does NOT cover — handle separately:**
- `Animated.Text` bypasses the wrapper (it wraps RN `Text` directly). Add the forced style to the
  referenced StyleSheet def instead.
- Navigation label/title sinks render text outside your wrapper: expo-router `NativeTabs` `<Label>`,
  classic `Tabs.Screen` `options.title`, and `Stack.Screen` `options.title`/`headerTitle`. These take
  raw string literals — lowercase the literals themselves. (Note: root Stack here uses
  `headerShown: false`, so stack titles aren't visible, but tab labels are.)

**How to apply:** any future "make all text X" request must cover all three layers — the wrapper,
`Animated.Text` style defs, and navigation label literals. Data strings passed as children to the
wrapped `<Text>` (e.g. `{t.title}`) are already transformed on display, so their source case can stay.
