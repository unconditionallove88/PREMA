# Prema — Feature Inventory

Generated: 2026-06-06

This file inventories the app's main routes, components and features. Each item lists: feature name, location (route / main component file), short user description, and status.

---

## Safety / Emergency

- Support Console
  - Where: `/support-console` — `src/app/support-console/page.tsx`
  - What: Live moderation and safety feed for flagged messages and incidents. Shows logs, metadata and quick context for reviewers.
  - Status: works end-to-end (reads `moderation_logs` from Firestore)

- SOS Alert / Emergency Modal
  - Where: `src/components/dashboard/SOSAlert.tsx` (invoked from dashboard)
  - What: Full-screen emergency alert prompt with quick actions and dismiss flow.
  - Status: works end-to-end (UI + local flows; backend hooks optional)

- Emergency Presence Portal (Collective Care)
  - Where: Dashboard integration (`src/app/dashboard/page.tsx`) + Map route `/map` (`src/app/map/page.tsx` / `page.自由.tsx`)
  - What: Shows distress/collective-care alerts and guides users to a map/nearby helpers.
  - Status: works end-to-end (dashboard UI + navigation to `/map`)

- Guardian & Safety Engine
  - Where: `src/lib/guardian.ts` used by dashboard + `GuardianStatusBar`, `PulseGuardianBanner` (`src/components/dashboard/*`)
  - What: Computes a simplified safety state (safe/caution/locked) and gates emergency UI.
  - Status: works end-to-end (local logic + optional Firestore inputs)

---

## Self-check / Presence

- Heart Status & Aura
  - Where: `/heart-status` — `src/app/heart-status/page.tsx` + `src/components/dashboard/HeartStatusAura.tsx`
  - What: Visual heart status and short-form presence indicators; links into chat/holders and social features.
  - Status: works end-to-end (UI + routing; uses local/profile data)

- Heart Breath (Oxytocin Breath)
  - Where: `src/components/dashboard/HeartBreath.tsx`
  - What: Guided breathing exercise with affirmation animations and heartbeat feedback.
  - Status: works end-to-end (UI + local audio/animation)

- Anatomical Heart Check-In
  - Where: `src/components/dashboard/AnatomicalHeartCheckIn.tsx`
  - What: Guided check-in UI for recording a short self-assessment.
  - Status: prototype/stub (UI-focused; back-end persistence may be minimal)

- Session Check-In
  - Where: `/session-check-in` — `src/app/session-check-in/page.tsx`
  - What: Flow for regular session check-ins to track mood/metrics.
  - Status: works end-to-end (UI + local storage; optional persistence)

---

## Dosing / Timing / Lab

- Visual Dose Assistant (Dose Estimation)
  - Where: `src/components/lab/VisualDoseAssistant.tsx` (invoked from `/dashboard` & `/laboratory-test`)
  - What: Camera-based visual dose estimation and pill identification using AI flows (`estimateDose`, `identifyPill`), results logging to the Lab UI.
  - Status: works end-to-end (AI-assisted — calls AI flows; requires API config for AI services)
  - Lite candidate: yes (manual-entry alternative available)

- Laboratory Test / Lab Pages
  - Where: `/laboratory-test` — `src/app/laboratory-test/page.tsx` and `src/components/lab/cards/*`
  - What: Lab UI for logging dose observations, viewing past logs and safety notes.
  - Status: works end-to-end (UI + local logging; depends on backend)

- Substance Interaction Risk Assessment
  - Where: `src/ai/flows/substance-interaction-risk-assessment.ts` (used in onboarding Step4/5: `src/components/onboarding/Step4.tsx`, `Step5SubstanceLab.tsx`)
  - What: AI-assisted risk scoring for combinations of medications/substances.
  - Status: works end-to-end (AI-assisted; requires AI backend)

---

## Education / Walkthroughs

- Onboarding Flow (multi-step)
  - Where: `/onboarding` — `src/app/onboarding/page.tsx` + `src/components/onboarding/*`
  - What: Multi-step setup (legal, identity, health, medications, verification, summary) that persists to Firestore `users` doc on completion.
  - Status: works end-to-end (writes to Firestore in `handleOnboardingComplete`)
  - Lite candidate: yes (core steps can be kept minimal)

- Pulse Guide (Interactive Guide)
  - Where: `src/components/dashboard/PulseGuide.tsx` (invoked from dashboard)
  - What: Guided tour / interactive tips overlay for the app.
  - Status: works end-to-end (UI-driven)

- Stepwise Safety/Preparation Components
  - Where: `src/components/onboarding/Step*` (e.g., `StepIntentions`, `Step7EssentialsCheck`, `StepSomethingToRemember`)
  - What: Modular teaching/guidance steps used during onboarding and wisdom dialogs.
  - Status: works end-to-end (UI; some steps call external flows)

---

## Dashboard Utilities / Tools

- Guardian Simulator
  - Where: `src/components/dashboard/GuardianSimulator.tsx` (used in dashboard lab calibration)
  - What: Simulator for adjusting heart rate and substance count to test guardian states.
  - Status: works end-to-end (UI simulator)

- Pulse Guardian Banner / Status Bar
  - Where: `src/components/dashboard/PulseGuardianBanner.tsx`, `GuardianStatusBar.tsx`
  - What: Visual banners and status indicators for safety state and suggestions.
  - Status: works end-to-end (UI + computed safety)

- Smart Alerts
  - Where: `src/components/dashboard/SmartAlerts.tsx`
  - What: Alerts feed surface for suggested safety actions and reminders based on goals/profile.
  - Status: works end-to-end (UI; integrates with user data)

- Wearables Sync
  - Where: `src/components/dashboard/WearablesSync.tsx`
  - What: UI for syncing heart-rate / wearable data (simulated or real depending on device integrations).
  - Status: prototype/stub (integration depends on external device APIs)

- Co-Creation, LoveLetter, VibeMirror
  - Where: `src/components/dashboard/CoCreation.tsx`, `LoveLetter.tsx`, `VibeMirror.tsx`
  - What: Creative & social utilities for sharing, journaling and reflection.
  - Status: works end-to-end (UI; some features may be local-only)

---

## Chat / Social / Community

- Supporter Portal (Assistant)
  - Where: `src/components/chat/AssistantPortal.tsx` (invoked from dashboard)
  - What: Supporter interaction UI (voice/resonance play, wisdom modules, phase selection).
  - Status: works end-to-end (UI + text-to-speech flow; interacts with local/audio)

- AI Safety Chat / App Support Chat / Community Chats
  - Where: `src/components/chat/AiSafetyChat.tsx`, `AppSupportChat.tsx`, `CommunityChat.tsx`, `PartyCircleChat.tsx`, `LoveCircleChat.tsx`
  - What: Chats for AI moderation/safety assistance, community conversation, and moderated support channels.
  - Status: mixed — `AiSafetyChat` / `AppSupportChat`: works end-to-end (backend + AI/moderation flows). Community chats: works end-to-end (UI + Firestore realtime/chat plumbing)

---

## Account / Auth

- Auth Pages / Sign-in
  - Where: `/auth` — `src/app/auth/page.tsx`
  - What: Login/register entry (provider + local flows). Redirects to `/dashboard` after auth.
  - Status: works end-to-end (integrates with Firebase Auth)

- Profile Page
  - Where: `/profile` — `src/app/profile/page.tsx` + profile UI components
  - What: View/edit profile and saved preferences.
  - Status: works end-to-end (reads/writes Firestore `users` doc)

- Support Console (Admin/Safety)
  - (See Safety above) — includes admin-level controls for moderation review.

---

## Settings / Theme / UI

- Global Theme / Tokens
  - Where: `src/app/globals.css`, `tailwind.config.ts`
  - What: Desert Dawn Grace (light) and Lunar Ocean (dark) tokens, glassmorphism, and utility overrides.
  - Status: works end-to-end (global CSS & Tailwind mapping)

- UI primitives (buttons, inputs, dialogs, toasts, calendar)
  - Where: `src/components/ui/*` (button, input, dialog, calendar, tabs, badge, toast, etc.)
  - What: Reusable UI primitives used across the app.
  - Status: works end-to-end (styled components + accessibility helpers)

---

## AI-assisted Features

- Text-to-Speech / Voice Flows
  - Where: `src/ai/flows/text-to-speech.ts`, used by `AssistantPortal`
  - What: Generates audio URIs for assistant speech; node/wasm writer handling lives in `text-to-speech` flow.
  - Status: works end-to-end (requires AI/tts service and keys)

- Estimate Dose / Identify Pill
  - Where: `src/ai/flows/estimate-dose-flow.ts`, `src/ai/flows/identify-pill-flow.ts`; used by Visual Dose Assistant
  - What: AI models estimate doses and attempt pill identification from images.
  - Status: works end-to-end (AI-assisted; requires AI backend credentials)

- Generate Substance Education Video / Other Flows
  - Where: `src/ai/flows/generate-substance-education-video.ts`, `src/ai/*`
  - What: Content generation flows for education, moderation and safety assessments.
  - Status: works end-to-end (AI-assisted)

---

## Other / Misc

- Map (Radar)
  - Where: `/map` — `src/app/map/page.tsx` and `page.自由.tsx`
  - What: Radar-style map UI showing nearby helpers, hubs and sharing toggles.
  - Status: works end-to-end (UI; mapping backend optional)

- Laboratory / Cards
  - Where: `src/components/lab/cards/*`
  - What: Card UIs for lab items (PoppersCard, etc.).
  - Status: works end-to-end (UI; logging may require backend)

- Placeholder Images
  - Where: `src/app/lib/placeholder-images.json`, `src/lib/placeholder-images.ts`
  - What: Demo imagery used across visual flows.
  - Status: static asset (works)

- Misc utilities & listeners
  - Where: `src/components/FirebaseErrorListener.tsx`, `src/firebase/*`, `src/lib/*`
  - What: Firebase wiring, error handling, helpers and small libraries.
  - Status: works end-to-end (provided Firebase is configured)

---

## Notes on Status
- "Works end-to-end" indicates features that integrate with backend services (Firestore, Auth, or AI flows) or have complete UI + persistence wiring in the repo. Some of these require proper environment configuration (API keys, Firebase project) to operate at runtime.
- "Prototype/stub" indicates primarily UI-only or simulated features that depend on external integrations not fully wired in the repo (device wearables, some creative integrations).


---

If you want, I can:
- Run an automated WCAG contrast report across rendered components and produce a short prioritized fix list.
- Reduce this inventory to a CSV/JSON for import into task trackers.
- Mark each item with exact file links and line ranges for quicker navigation.

