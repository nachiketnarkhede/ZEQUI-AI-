# ZEQUI v1.0 — AI Study & Growth Companion

> **Build. Learn. Think. Grow.**

ZEQUI is an AI-powered study and growth companion built by **Nachiket Narkhede** under **AvyaktaX NX Systems**.

---

## 🚀 About ZEQUI

ZEQUI brings AI-powered learning, research, productivity, and personal growth features together in one platform.

### ✨ Features

- 💬 AI Chat
- 🔎 Research Assistance
- 📝 Smart Summarization
- 🧠 AI-Generated Quizzes
- 📚 Topic Tracking
- ⏳ Exam Countdown & Planning
- 🎯 Focus Tools
- 🎙️ Voice Input & Text-to-Speech
- 👤 Personalized Profiles
- 🤖 AI Companion Personas
- 📊 Learning & Usage Statistics
- 📤 Chat & Quiz Export

---

## 🧠 Why I Built ZEQUI

I am a **First-Year Electronics & Telecommunication Engineering (ENTC) student at SITRC under SPPU**.

ZEQUI is a practical project through which I am learning how real software is designed, developed, debugged, secured, and deployed.

While building ZEQUI, I have explored:

- Programming fundamentals
- React
- TypeScript
- Vite
- AI API integration
- Serverless architecture
- API security
- File processing
- Local data persistence
- UI/UX
- Error handling
- Debugging
- Deployment

ZEQUI represents my journey from learning programming fundamentals to building complete, practical software.

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### AI & Backend

- Netlify Functions
- Gemini
- Groq
- Hugging Face

### Other Technologies

- PDF.js
- DOMPurify
- jsPDF
- React Markdown
- Browser Speech Recognition
- Browser Speech Synthesis
- Local Storage

---

## 🤖 AI Architecture

ZEQUI uses a serverless AI routing layer through Netlify Functions.

```text
User
  ↓
ZEQUI React + TypeScript Frontend
  ↓
Netlify AI Router
  ↓
Gemini → Groq → Hugging Face
  ↓
AI Response
```
The AI router provides a centralized server-side boundary for AI requests and supports fallback between supported AI providers.
🔐 Security
ZEQUI is designed so that AI provider API keys are stored as server-side environment variables rather than being exposed directly in the frontend.
Expected deployment variables:
GEMINI_API_KEY
GROQ_API_KEY
HUGGINGFACE_API_KEY
Security-related engineering measures include:
Server-side AI routing
API request validation
Provider timeout handling
File validation
Security headers
Client/server separation for AI requests
Removal of unnecessary legacy code
Do not place confidential information, API keys, passwords, or private credentials into this repository.
📁 Project Structure
ZEQUI/
├── netlify/
│   └── functions/
│       └── ai-router.js
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── config/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── package-lock.json
├── netlify.toml
├── vite.config.ts
├── tailwind.config.js
└── README.md
```
🧪 Engineering & Debugging
ZEQUI has gone through a dedicated debugging and polishing process.
Improvements include:
Centralized frontend AI requests
Server-side AI routing
API request validation
Provider timeout handling
Improved error handling
File validation
Security-related deployment headers
Removal of unnecessary legacy code
Deployment documentation
Environment variable configuration
See DEBUG_REPORT.md for additional details.
🌐 Deployment
ZEQUI is structured for deployment using Netlify.
The project includes netlify.toml for:
Build configuration
Deployment directory
Serverless functions
SPA routing
Security headers
🌱 Learning Journey
I am currently a First-Year ENTC Engineering student at SITRC under SPPU.
My current focus is on strengthening programming fundamentals, improving logical thinking, learning modern software development, and building practical projects.
My approach is:
Learn → Build → Break → Debug → Understand → Improve
ZEQUI is one of the projects through which I am turning what I learn into practical engineering work.
🔭 Future Direction
ZEQUI is a starting point for continued exploration of AI orchestration, system architecture, and intelligent software systems.
Future development may include:
Advanced AI orchestration
Improved learning analytics
More personalized study recommendations
Expanded educational workflows
Backend persistence
Authentication and account systems
Production monitoring
Improved research verification
Automated testing
Expanded deployment infrastructure
The long-term goal is to continue evolving ZEQUI from a learning and development project into a more robust, reliable, and research-oriented AI learning platform.

🏢 AvyaktaX NX Systems
AvyaktaX NX Systems is the organization under which I am developing and exploring projects such as ZEQUI.
The goal is to learn, experiment, build practical technology, and gradually turn ideas into mature products.

⚠️ Disclaimer
ZEQUI is currently a learning and development project.
Some features are experimental or prototype-oriented and may require additional backend infrastructure, authentication, monitoring, and production hardening before large-scale production use.
Do not place confidential information, API keys, passwords, or private credentials into this repository.
⭐ Final Note
ZEQUI v1.0 is not the end.
It is the beginning of a journey toward building better software, understanding AI systems, improving engineering skills, and turning ideas into working products.
Built with curiosity.
Improved through debugging.
Driven by learning.
