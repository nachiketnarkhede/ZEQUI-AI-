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
