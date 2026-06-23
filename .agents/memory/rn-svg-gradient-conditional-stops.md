---
name: react-native-svg conditional gradient stops
description: Why conditional <Stop> children inside react-native-svg gradients must be arrays, not JSX fragments
---

In react-native-svg, the children of `<LinearGradient>` / `<RadialGradient>` (and `<Defs>`) are typed as an array of elements. A conditional that returns a JSX **Fragment** (`{cond ? <>...</> : <>...</>}`) fails typecheck with TS2740 ("Type 'ReactElement' is missing the following properties from type 'ReactElement[]': length, pop, push, concat...").

**Rule:** when branching the set of `<Stop>` children by a condition, return an **array of keyed `<Stop>`** elements, not a Fragment:

```tsx
{isDark
  ? [<Stop key="0" .../>, <Stop key="1" .../>]
  : [<Stop key="0" .../>, <Stop key="1" .../>]}
```

**Why:** the gradient child prop type is an element array; a Fragment is a single element and does not satisfy it.
**How to apply:** any time you conditionally vary gradient stops (e.g. theme-adaptive SVG fills in the Prema mobile app).
