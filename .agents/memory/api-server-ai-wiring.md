---
name: API Server AI Wiring
description: How to add AI to the api-server without breaking its esbuild bundler
---

## Rule
Use `@google/genai` directly in api-server AI routes. Do NOT use `genkit` or `@genkit-ai/*`.

**Why:** genkit has a transitive chain of `@opentelemetry/*` peer deps (api, api-logs, sdk-trace-base, sdk-node, etc.) that are all externalized in build.mjs but not installed by pnpm, causing `ERR_MODULE_NOT_FOUND` at runtime. @google/genai has no such chain.

**How to apply:**
- Install `@google/genai` in api-server: `pnpm --filter @workspace/api-server add @google/genai`
- Import lazily via `await import("@google/genai")` so the route file typechecks without the package
- `@google/*` and `@opentelemetry/*` are already in the `external` list in `artifacts/api-server/build.mjs`, so they load from node_modules at runtime, not bundled
- AI routes live in `artifacts/api-server/src/routes/ai.ts`, registered in `artifacts/api-server/src/routes/index.ts`
- Frontend stubs in `artifacts/prema/src/ai/flows/` call `/api/ai/...` endpoints
- Routes return 503 gracefully if GOOGLE_GENAI_API_KEY / GOOGLE_API_KEY is not set
