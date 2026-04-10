# AR Expression Platform — Project Memory

**Purpose:** Single source of truth for vision, patent alignment, principles, and constraints. Update this as the project evolves. Search this file for: patent, Fogg, open source, minimal, intuitive, wearable, AI, memory, Supabase, voice, NLP.

**GitHub:** https://github.com/gorky117-cell/ar-expression-platform  
**Local path:** `D:\ar-expression-platform` (keep work on D drive when possible).

---

## 1. Product vision (what we are building)

- **Not** Instagram/TikTok-style social. We are building an **AR-first social layer around physical prints** (wearables, posters, accessories).
- **Trigger:** A physical print (e.g. tree on T-shirt) is the **trigger**. The wearer **dictates** the meaning (mood, caption, story) via voice or text.
- **Viewer experience:** When someone points a camera at the print, they see **live AR visuals + caption** that reflect **what the wearer said/felt**. Reactions (greetings, likes, comments) form a **persistent digital memory** tied to that print.
- **One print, multiple narratives:** One print can carry multiple expressions; wearer can change or enhance them over time.

---

## 2. Patent alignment (provisional patent)

- **Title:** AI-Driven Augmented Reality and Social Expression Platform via Wearable Prints, Accessories, and Interactive Physical Media.
- **Core claims we care about:**  
  - Physical triggers (garments, accessories, posters) for AR storytelling.  
  - Viewer interaction: greetings, comments, puzzle-solving, social memory threads.  
  - Persistent digital memory tied to object triggers.  
  - Expression via visual art, mood, message, gamified logic, narrative overlays.  
  - Voice/text personalization for wearer and viewer co-creation.  
  - Fogg Behavior Model for engagement.
- **MVP vs patent future:** Repo implements a **web MVP** (Feed, Create, Expression, AR, optional persistence, voice + lightweight NLP). Patent’s full AI stack (SML, VLM, LLM, Stable Diffusion, SNN, etc.) is **future scope** when backend/cloud is added.

---

## 3. Fogg Behavior Model (apply at every touchpoint)

At **each** user action (Feed, Create, Expression detail, AR launch, like, greeting, comment, voice, etc.) we want:

- **Prompt:** Clear, visible trigger (e.g. button, link, instruction) so the user knows what to do.
- **Motivation:** Copy and UI should reinforce curiosity, expression, or social reward (not generic “click here”).
- **Ability:** Actions must be **easy** (minimal steps, obvious labels, no unnecessary friction).

Design and refine each screen/flow with these three in mind. Test: “Is the prompt obvious? Is motivation clear? Is it as simple as possible?”

---

## 4. Design and UX principles

- **Minimalistic:** No ornamentation for its own sake. Every element should have a job (clarity, prompt, motivation, or ability).
- **Intuitive:** Flows should feel obvious (e.g. Feed → Expression → AR; Create → Expression).
- **Stepwise:** Break flows into clear steps; one primary action per view where possible.
- **Mobile-first / web lite:** Test locally first; deploy later (e.g. Railway, Google Cloud, Vercel, Netlify).
- **Exhaustive but organized:** Document decisions so agents and humans can search: open-source choices, Fogg, rationale.

---

## 5. Open source and tech (current stack)

- **Prefer open source** for all components where possible.
- **Frontend:** React 18, React Router 6, Vite 5.
- **AR:** A-Frame + AR.js (Hiro pattern marker); scene in `public/ar.html` with `?overlay=`, `?mood=`, `?caption=`.
- **Data:**  
  - **`src/data/api.js`** — single API for the app.  
  - **Supabase** when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env` (copy from `.env.example`). Run `supabase/schema.sql` in Supabase SQL Editor.  
  - **In-memory fallback** in `src/data/store.js` when `.env` is missing (data resets on refresh).
- **Voice + NLP:**  
  - **Web Speech API** (browser) for speech-to-text.  
  - **compromise** (npm) for normalization, keyword mood mapping, simple negation (`src/utils/voice.js`).  
  - Voice module is **dynamically imported** from `Expression.jsx` so the main bundle stays smaller (separate chunk).
- **Future:** Whisper/Coqui or LLM on Railway/Google Cloud can replace or augment browser voice/NLP.
- **AR:** Stay on A-Frame + AR.js unless there is a strong reason to switch.

---

## 6. Current repo state (as of this memory)

**Implemented**

- Feed (`Home`), Create expression, Expression detail (like, greeting, comment).
- **Caption** optional on Create; shown below preview on Expression; passed to AR URL.
- **Set mood by voice** on Expression (mic → transcript → mood/caption via NLP → `updateExpression`).
- **Mood** dropdown on Create (hardwired list in `store.js` `MOODS`).
- AR launcher (`AR.jsx`) loads expression and opens `ar.html` with overlay + mood + caption.
- `public/ar.html` — Hiro marker, overlay texture, birds animation; top bar for caption/mood.
- **Reactions in DB schema:** like, greeting, love, good, keep, comment (`supabase/schema.sql`); UI may not expose all reaction types yet.
- **Git** — remote `origin` → `gorky117-cell/ar-expression-platform`; default branch often `master`.

**Planned / not done yet**

- Five overlay assets + picker (MVP target: max 5 overlays in `public/overlays/`).
- Extra reaction buttons in UI (Love, Good, Keep) if desired.
- Wearer vs Viewer modes, retailer/QR flows, image-as-trigger beyond Hiro.
- Full patent AI stack on backend; Fogg copy audit pass on every screen.

**Refinement rule:** Every change should **refine** the product: clearer prompts, better motivation, higher ability, or better alignment with patent and this file.

---

## 7. Decision log

Use this format for new product or architecture decisions:

- **Status:** proposed | accepted | rejected | deprecated
- **Decision:** one-line decision
- **Why:** rationale and trade-offs
- **Scope:** MVP only / production / module-specific
- **Impacts:** files, flows, data model, UX, security
- **Follow-ups:** next tasks, owner, due
- **References:** commit, PR, docs links

### 2026-03-09 — MVP trigger strategy

- **Status:** accepted
- **Decision:** Use Hiro-only detection for MVP; keep `triggerImage` as metadata.
- **Why:** Fastest stable path for local testing and demo reliability.
- **Scope:** MVP
- **Impacts:** `public/ar.html`, `src/pages/AR.jsx`, expression model
- **Follow-ups:** Evaluate custom marker/image-target detection later.
- **References:** `memory.md`, `CODEX-HANDOFF.md`

### 2026-03-09 — Supabase access policy for MVP

- **Status:** accepted
- **Decision:** Anonymous write access is allowed temporarily for MVP.
- **Why:** Reduce setup friction and validate product loop quickly.
- **Scope:** MVP/testing only
- **Impacts:** `supabase/schema.sql`, data integrity/security risk
- **Follow-ups:** Add auth, stricter RLS, and rate limiting before public launch.
- **References:** `supabase/schema.sql`, `memory.md`, `CODEX-HANDOFF.md`

### 2026-03-09 — Continuity source of truth

- **Status:** accepted
- **Decision:** Keep truth updated in `memory.md` and `CODEX-HANDOFF.md`.
- **Why:** Reliable handoff between agents without repeated repo walkthroughs.
- **Scope:** ongoing
- **Impacts:** documentation discipline after each milestone
- **Follow-ups:** Update both files in each docs-related PR/commit.
- **References:** `memory.md`, `CODEX-HANDOFF.md`

---

## 8. Local testing

```bash
cd D:\ar-expression-platform
npm install
npm run dev
```

- App: `http://localhost:5173/`
- AR launcher: `http://localhost:5173/ar`
- AR scene: opened via “Open AR experience” (e.g. `ar.html?overlay=...&mood=...&caption=...`).

---

## 9. Where this file lives and how to use it

- **Path:** `memory.md` in project root.
- **Use:** Read before major features or refactors. Update when vision, principles, or stack change. Pair with **`.cursor/skills/ar-expression-platform/SKILL.md`** for agent workflow and **README.md** for run commands.
