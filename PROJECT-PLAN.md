# WearWave — Project Plan

**Product name:** **WearWave** — social, engaging, wearable prints; solo-friendly, modern AR.  
This file is a team-facing continuity brief. Use it with `memory.md` and README to continue implementation without re-discovery.

---

## Mission

Build a minimal, intuitive, mobile-first **AR-first social layer** around physical prints (wearables, posters, accessories), aligned with the provisional patent direction — shipped as **WearWave**.

- Physical print acts as AR trigger.
- Wearer sets mood/caption/story.
- Viewer scans and sees AR overlay + caption.
- Reactions create persistent digital memory for each expression.

---

## Current baseline

- Frontend: React + React Router + Vite
- AR scene: A-Frame + AR.js (`public/ar.html`) with Hiro marker
- Data: `src/data/api.js` (Supabase when `.env` is set, in-memory fallback otherwise)
- Voice/NLP: Web Speech API + compromise in `src/utils/voice.js`
- Voice path is code-split with dynamic import from `src/pages/Expression.jsx`

---

## Run locally

```bash
cd D:\ar-expression-platform
npm install
npm run dev
```

- App: `http://localhost:5173/`
- AR launcher: `http://localhost:5173/ar`

---

## File map

- App shell/routes: `src/App.jsx`, `src/main.jsx`
- Feed: `src/pages/Home.jsx`
- Create: `src/pages/Create.jsx`
- Expression: `src/pages/Expression.jsx`
- AR launcher: `src/pages/AR.jsx`
- AR scene: `public/ar.html`
- Data layer: `src/data/api.js`, `src/data/store.js`, `src/data/supabase.js`
- Voice/NLP: `src/utils/voice.js`
- DB schema: `supabase/schema.sql`
- Vision + decisions: `memory.md`

---

## Agreed MVP decisions

1. **Trigger strategy:** Hiro-only detection for MVP; `triggerImage` remains metadata.
2. **Supabase policy:** Temporary anonymous write allowed for MVP testing.
3. **Continuity truth:** Keep `memory.md` and this `PROJECT-PLAN.md` updated after milestones.

---

## Next priorities

1. Add up to **5 overlay assets** and a simple picker in Create.
2. Optionally expose additional reactions (Love / Good / Keep) in UI.
3. Add wearer/viewer mode split (mobile-first).
4. Tighten Supabase security before public launch (auth + stronger RLS).
5. Consider backend voice (Whisper/Coqui/LLM) later; keep browser fallback.

---

## Working principles

- Keep changes stepwise and minimal.
- Apply Fogg (Prompt, Motivation, Ability) to every user touchpoint.
- Prefer open-source components.
- Update docs (`memory.md` + this file) whenever architecture or decisions change.
