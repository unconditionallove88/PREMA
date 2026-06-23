# Prema

A Firebase-backed harm reduction app for festival communities — helps users prepare safely, track their session, and access care resources.

## Run & Operate

- `pnpm --filter @workspace/prema run dev` — run the Prema web app (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (migrated from Next.js)
- Routing: wouter (replaces next/navigation)
- DB/Auth: Firebase (Firestore + Firebase Auth)
- Styling: Tailwind v4 with custom CSS vars (`@theme inline` block)
- Build: Vite

## Where things live

- `artifacts/prema/src/app/` — all page components (one per route)
- `artifacts/prema/src/components/` — shared UI components
- `artifacts/prema/src/firebase/` — Firebase config and hooks
- `artifacts/prema/src/ai/flows/` — AI flow stubs (browser-safe; real genkit flows run server-side only)
- `artifacts/prema/src/index.css` — Tailwind v4 theme with all Prema CSS custom properties

## Architecture decisions

- **Next.js → Vite migration**: All `next/navigation`, `next/link`, `useRouter()` patterns replaced with wouter (`useLocation`, `Link`). `"use client"` directives removed.
- **Genkit AI stubs**: `src/ai/` flows use Node.js-only genkit packages (server-side). These are replaced with browser-safe stubs that return placeholder data, preserving type signatures for components that import them.
- **Tailwind v3 → v4**: Source used `@tailwind base/components/utilities` (v3). Rewritten to `@import "tailwindcss"` + `@theme inline {}` block (v4).
- **Firebase hardcoded config**: Firebase API keys are embedded in `src/firebase/config.ts` — no env vars needed for development.

## Product

- **Landing page** — glowing orb entry with language picker (EN/DE)
- **Auth** — Firebase email/password auth with light/dark theme toggle
- **Onboarding** — multi-step profile setup
- **Dashboard** — personalized harm reduction hub with affirmations
- **Session check-in** — intention setting before a festival session
- **Before / During / Recovery** — phase-specific guidance
- **Heart Check / Heart Status** — vitals and wellness monitoring
- **Safety Network** — emergency contacts
- **Map** — venue map with care locations
- **Lab / Laboratory Test** — anonymous substance testing booking
- **Awareness / Support Console** — staff care hub
- **Profile, Self-care** — personal settings and wellbeing tools

## Gotchas

- AI flows in `src/ai/` are browser-safe stubs. Do NOT import `genkit` or `@genkit-ai/*` packages into the frontend bundle — they pull in Node.js-only modules (`events`, `path`, `http`, etc.).
- The `map/page.自由.tsx` file exists (Unicode filename from source) — it is ignored by the router.
- Firebase auth guards redirect unauthenticated users to `/auth` on protected pages.

## User preferences

- **Font**: Nunito everywhere, both web and mobile apps.
- **Casing**: ALL UI text is lowercase everywhere — no uppercase wording anywhere. (Typed input in TextInput/inputs is left untouched.)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
