# ZEQUI Debug & Polish Report

## Fixed
- Centralized browser AI requests through `/.netlify/functions/ai-router`; no provider API key is kept in client code.
- Connected Chat, Research, Advice and Companion to the shared AI hook from `App.tsx`.
- Removed stale/unused imports and removed unused legacy duplicate components.
- Fixed `ChatTab`'s unused export callback contract.
- Fixed file validation handling for the legacy summarizer path.
- Made Smart Summarize file types truthful and routed file reading through the shared validator/processor.
- Fixed text sanitization so normal characters such as `&` are not displayed as HTML entities.
- Added server-side message count, role validation and per-provider abort timeouts.
- Added Netlify build configuration and SPA fallback.
- Added `README.md` and `.env.example` with deployment guidance.
- Verified JavaScript syntax for the Netlify function.
- Verified TypeScript/TSX syntax by transpilation.
- Smoke-tested Netlify function handling for OPTIONS, unsupported methods, invalid payloads and invalid roles.

## Validation limitation
The environment used for this polish pass did not have a complete npm dependency cache. `npm ci --offline` could not complete because one package tarball was unavailable locally. Therefore a full `npm run typecheck`, `npm run lint`, and `npm run build` could not be executed in this environment. The source was still checked for TS/TSX syntax, serverless JavaScript syntax, obvious unused imports, client-side secret leakage, and the key integration contracts.

## Before deployment
Run:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Configure these Netlify environment variables:

- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `HUGGINGFACE_API_KEY` (optional)

## v1.1 Adaptive Learning Upgrade

- Added `src/utils/learningEngine.ts` for local learning-signal aggregation, recommendations and topic relationships.
- Added `src/components/AdaptiveLearningDashboard.tsx` for explainable recommendations, learning graph and AI telemetry.
- Added a `Growth` application tab and mobile navigation entry.
- Extended `useGroq` with current-session provider and telemetry metrics.
- Converted `netlify/functions/ai-router.js` from CommonJS `exports.handler` to ESM `export const handler`, matching the project's `"type": "module"` configuration.

## Usage Guard + Responsive Finalization
- Added a server-side anonymous usage/burst guard to `netlify/functions/ai-router.js`.
- Added per-device/IP rolling-window protection, daily protection, global warm-instance burst protection, request-size limits, provider cooldown after rate-limit responses, and friendly 429/503 responses.
- Removed the old browser-only AI request quota from `useGroq`; the server now controls the enforcement point.
- Added mobile-safe bottom navigation and responsive content sizing/overflow handling.
- Added safe-area support for phones and breakpoint-aware navigation behavior.

### Validation
- `node --check netlify/functions/ai-router.js` passed.
- Router smoke tests passed for OPTIONS (200), unsupported methods (405), invalid payload (400), invalid roles (400).
- Usage Guard smoke test reached the configured 20-request rolling limit and returned 429 on the next request.
- Changed TS/TSX files (`App.tsx`, `useGroq.ts`, `MobileBottomNav.tsx`) transpiled successfully with TypeScript syntax checking.
- Full dependency reinstall/build could not be completed in this environment because the package installation process timed out and the available local dependency cache is incomplete.

### Important deployment limitation
The Usage Guard in this release is a serverless warm-instance abuse/burst guard. It is intentionally not described as a strict college-wide quota because ordinary in-memory state is not shared across every Netlify function instance. A future authenticated/high-scale release should use a shared persistent counter store and server-side identities/entitlements for strict quotas.
