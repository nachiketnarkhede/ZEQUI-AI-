# ZEQUI — AI Study & Growth Companion

ZEQUI is a React + TypeScript + Vite learning workspace combining AI chat, research, summarization, quizzes, topic tracking, exam planning, focus tools, voice interaction and personalization.

## Architecture
- React 18 + TypeScript + Vite
- Tailwind CSS + Lucide React
- Netlify Function: `/.netlify/functions/ai-router`
- AI fallback: Gemini → Groq → Hugging Face
- Browser persistence for profile, preferences, exams, quiz history and topic signals

## Local development
1. Install Node.js 18+ (20+ recommended).
2. Run `npm install`.
3. Run `npm run dev`.
4. For the AI function locally, use Netlify Dev or deploy to Netlify and configure the server environment variables.

## Netlify environment variables
Set these only in Netlify/server configuration — never in the frontend source:
- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `HUGGINGFACE_API_KEY` (optional fallback)

## Validation
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Security notes
Provider API keys are intentionally not stored in browser code. All normal client AI requests go through the Netlify serverless router. User study state is currently browser-local rather than cloud synchronized.

## Research note
The Research feature currently provides structured AI answers and suggested source-search links; it does not independently verify citations.

## Adaptive Learning Engine

ZEQUI now includes a local-first Adaptive Learning Engine that turns study activity into explainable recommendations.

- Learning signals from recurring topics and quiz outcomes
- Explainable study recommendations with priority levels
- Topic relationship graph for connected subjects
- Learning summary with tracked topics, quiz attempts and accuracy
- AI telemetry for provider, request count, fallback events and latency during the current session
- Growth dashboard accessible from the `Growth` tab

The learning state remains browser-local in this version. This keeps the prototype privacy-conscious and avoids requiring a separate database for the core learning experience.

## Usage Guard
ZEQUI includes a server-side usage guard in the Netlify AI router. It adds anonymous device/IP burst limits, a daily per-device limit, a short provider cooldown after rate-limit responses, request-size protection, and a global warm-instance burst cap.

Optional Netlify function variables can tune the defaults:
- `ZEQUI_RATE_WINDOW_MS` (default: 10 minutes)
- `ZEQUI_RATE_WINDOW_LIMIT` (default: 20)
- `ZEQUI_RATE_DAILY_LIMIT` (default: 100)
- `ZEQUI_GLOBAL_WINDOW_LIMIT` (default: 250 per warm function instance/window)
- `ZEQUI_MAX_BODY_BYTES` (default: 90000)

This guard is an abuse/burst protection layer, not a strict authenticated quota or billing system. A future large-scale deployment should move counters to a shared persistent store and add authentication/entitlements.

## Responsive UI
The interface uses responsive Tailwind layouts, breakpoint-aware navigation, a mobile bottom navigation bar, flexible content widths, safe-area support, and overflow protection so the same application adapts across desktop, tablet and phone screens.

## Optional account sign-in

ZEQUI now includes an optional Supabase Authentication UI. Guest use remains available when authentication is not configured.

Client environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Netlify Function environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The Supabase anon key is a public client key, but it must still be protected by Supabase Row Level Security for any database tables added later. Never place provider API secrets in `VITE_*` variables.

The current Usage Guard can identify a verified signed-in Supabase user inside a warm Netlify function instance. It is still not a strict cross-instance quota. A shared persistent counter is required before promising a hard per-user or college-wide limit.

## Production Account & Usage Backend

ZEQUI now supports persistent, authenticated AI usage tracking through Supabase.

### Architecture

- Supabase Auth identifies the signed-in user.
- Netlify Functions validate the access token server-side.
- The Supabase service-role key is used **only inside the Netlify function**.
- `profiles` stores account/profile data with row-level security.
- `ai_usage_events` stores a minimal server-side AI request ledger.
- `consume_ai_usage()` performs an atomic rolling-window + daily quota check using a transaction-scoped advisory lock.
- `get_ai_usage()` powers the signed-in usage indicator.
- `finalize_ai_usage()` records the provider used without exposing provider internals to the client.
- Anonymous users continue to receive the in-memory abuse/burst guard.

### Supabase setup

1. Create/open the ZEQUI Supabase project.
2. Run `supabase/migrations/202609250001_zequi_accounts_usage.sql` in the Supabase SQL Editor.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify environment variables for the browser.
4. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Netlify environment variables for the server function.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never put it in `VITE_*` variables or source code.
6. Deploy the site and test: create account → sign in → send an AI request → refresh the page → confirm usage remains.

### Account plans

The database supports `free`, `pro`, and `admin` plans. The current defaults are 100 daily AI requests and 20 requests per rolling 10-minute window for free accounts. Pro and admin multipliers are defined in the database function and should only be used when the corresponding entitlement is actually provisioned by the product/billing system.

### Data retention

The raw AI usage ledger is designed to retain 35 days of request metadata. Run `purge_old_ai_usage_events()` from an authorized scheduled job once per day. The ledger intentionally stores no prompt or response content.
