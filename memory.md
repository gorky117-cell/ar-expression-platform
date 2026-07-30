# WearWave — Project Memory

**Product name:** **WearWave** — social, engaging, wearable-first AR; modern, solo-friendly vibe.  
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

### 2026-03-09 — Product name

- **Status:** accepted
- **Decision:** Public product name is **WearWave** (repo may still be named ar-expression-platform on GitHub).
- **Why:** Short, modern, wearable + social “wave” of engagement; works for solo creators and viewers.
- **Scope:** branding / UI copy
- **Impacts:** `index.html`, `README.md`, `App.jsx`, `Home.jsx`, `public/ar.html`, `memory.md`, `PROJECT-PLAN.md`
- **Follow-ups:** Domain + deploy URL when ready.
- **References:** this commit

### 2026-03-09 — MVP trigger strategy

- **Status:** accepted
- **Decision:** Use Hiro-only detection for MVP; keep `triggerImage` as metadata.
- **Why:** Fastest stable path for local testing and demo reliability.
- **Scope:** MVP
- **Impacts:** `public/ar.html`, `src/pages/AR.jsx`, expression model
- **Follow-ups:** Evaluate custom marker/image-target detection later.
- **References:** `memory.md`, `PROJECT-PLAN.md`

### 2026-03-09 — Supabase access policy for MVP

- **Status:** accepted
- **Decision:** Anonymous write access is allowed temporarily for MVP.
- **Why:** Reduce setup friction and validate product loop quickly.
- **Scope:** MVP/testing only
- **Impacts:** `supabase/schema.sql`, data integrity/security risk
- **Follow-ups:** Add auth, stricter RLS, and rate limiting before public launch.
- **References:** `supabase/schema.sql`, `memory.md`, `PROJECT-PLAN.md`

### 2026-03-09 — Continuity source of truth

- **Status:** accepted
- **Decision:** Keep truth updated in `memory.md` and `PROJECT-PLAN.md`.
- **Why:** Reliable handoff between agents without repeated repo walkthroughs.
- **Scope:** ongoing
- **Impacts:** documentation discipline after each milestone
- **Follow-ups:** Update both files in each docs-related PR/commit.
### 2026-07-03 — Simplified MVP Hosting & Database Architecture

- **Status:** accepted
- **Decision:** Use local D drive for development, MongoDB M0 Free Tier for database, Vercel/Netlify for frontend hosting, and custom CNAME routing to `ar.aiforall.ltd`.
- **Why:** To prevent any risk of out-of-pocket charges, billing, or GST taxes, while keeping the MVP loading speeds ultra-fast (under 1.5s) and practical for investor demos. Excludes complex hardware/wireless sensors from the initial POC to avoid over-engineering.
- **Scope:** MVP Demo
- **Impacts:** `api.js`, `Expression.jsx`, `AR.jsx`, `Create.jsx`, `index.css`
- **Follow-ups:** Set up MongoDB local connection in `api.js` and deploy to `ar.aiforall.ltd`.

### 2026-07-11 — Mood-Grouped Reactions & Comments Tracking

- **Status:** accepted
- **Decision:** Capture and save the wearer's active mood at the exact moment a comment, like, or wave is created by a viewer.
- **Why:** To fulfill Patent Claim 7 (Mood History & Persistent Memory) and allow wearers to see how viewers reacted to specific mood states.
- **Scope:** MVP Demo
- **Impacts:** `api.js`, `Expression.jsx`, `ar.html`
- **References:** `implementation_plan.md`

---

## 8. Implemented Features Log (July 2026 Update)

- **Streetwear Feed UI:** Upgraded [Home.jsx](file:///d:/ar-expression-platform/src/pages/Home.jsx) with a dark theme (#0F0F12), violet branding header, and glassmorphic cards representing t-shirt graphics.
- **Visual Overlay Ingestion:** Ingested 4 new SVG overlay assets: [happy.svg](file:///d:/ar-expression-platform/public/overlays/happy.svg), [playful.svg](file:///d:/ar-expression-platform/public/overlays/playful.svg), [inspired.svg](file:///d:/ar-expression-platform/public/overlays/inspired.svg), and [peaceful.svg](file:///d:/ar-expression-platform/public/overlays/peaceful.svg) inside `public/overlays/`.
- **Visual Overlay Selector:** Added a horizontal selection grid inside [Create.jsx](file:///d:/ar-expression-platform/src/pages/Create.jsx) to select overlays with one tap.
- **Tactile Voice Controls:** Upgraded [Expression.jsx](file:///d:/ar-expression-platform/src/pages/Expression.jsx) with a glassmorphic layout and a glowing, circular microphone button with pulse animations.
- **AR Scanning Interface:** Cleaned up [AR.jsx](file:///d:/ar-expression-platform/src/pages/AR.jsx) to display clear instructions and target download cards.

### 2026-07-13 — DNS Subdomain Configuration & GoDaddy Settings

- **Status:** accepted
- **Decision:** Use GoDaddy account to manage `aiforall.ltd` DNS. Map subdomain `ar.aiforall.ltd` via an A Record to the static external IP address `34.173.55.234` of the GCP VM.
- **Why:** Enables frictionless WebAR URLs for users scanning printed materials without modifying main root domain settings.
- **Scope:** Deployment
- **Impacts:** GoDaddy DNS Records, GCP VM networking
- **References:** `implementation_plan.md`

### 2026-07-17 — Express 5 Wildcard Routing Fix

- **Status:** accepted
- **Decision:** Use native JavaScript RegExp object (`/.*/`) instead of string wildcards (`/*` or `*`) in the Express static server.
- **Why:** Bypasses `path-to-regexp` compilation rules in Express v5, resolving the server crash error: `PathError: Missing parameter name at index 2: /*`.
- **Scope:** Production / Server
- **Impacts:** `server.js`

### 2026-07-18 — VR/AR Headset Buttons Removal

- **Status:** accepted
- **Decision:** Add CSS overrides (`.a-enter-vr, .a-enter-vr-button, .a-enter-ar, .a-enter-ar-button { display: none !important; }`) and configure `vr-mode-ui="enabled: false"` on `<a-scene>` in `ar.html`.
- **Why:** Forcefully hides default A-Frame VR and AR headset UI triggers, keeping the interface strictly in AR camera view and preventing mobile users from accidentally splitting their screens in half.
- **Scope:** Production / Frontend
- **Impacts:** `public/ar.html`

### 2026-07-22 — MindAR Neural Machine-Learning Image Tracking Migration

- **Status:** accepted
- **Decision:** Switch WebAR engine from legacy AR.js SURF NFT to MindAR 1.2.5 (TensorFlow.js neural feature tracking). Automated `.mind` descriptor compilation via Puppeteer script (`scripts/compile-mind.cjs`).
- **Why:** MindAR uses neural feature detection that tracks clean 2D vector artwork directly (with ZERO markers, ZERO borders, and ZERO tags) without requiring photographic textures or high-entropy corners like legacy SURF algorithms.
- **Scope:** Production / Frontend / Tooling
- **Impacts:** `public/ar.html`, `public/data/targets/tree-birds.mind`, `scripts/compile-mind.cjs`

### 2026-07-25 — Pure Markerless MindAR Engine Deployment & Local Worker Script Hosting

- **Status:** accepted
- **Decision:** Implemented Option 1 (Pure Markerless Natural Feature Tracking) for 100% clean artwork without markers/tags. Built dedicated viewer `ar-mind.html` and compiled MindAR descriptor `cosmic-butterfly.mind` (188 KB) with 150+ natural feature keypoints. Hosted MindAR script locally at `/js/mindar-image-aframe.prod.js` to eliminate mobile browser Web Worker CORS blocking.
- **Why:** Local script hosting guarantees zero CDN CORS worker blocks on iOS Safari and Android Chrome, enabling 60 FPS body-hinged 3D wing flapping animations to map natively on clean artwork targets in camera view.
- **Impacts:** `public/ar-mind.html`, `public/js/mindar-image-aframe.prod.js`, `public/overlays/cosmic-butterfly.svg`, `public/data/targets/cosmic-butterfly.mind`

### 2026-07-27 — WebGL Camera Layer Stacking & Controlled 3D Wing Flapping Optimization

- **Status:** accepted
- **Decision:**
  1. Separated CSS stacking layers in `ar-mind.html` and `ar.html`: `video` stream placed at `z-index: -2 !important`, and WebGL canvas placed at `z-index: 1 !important`.
  2. Implemented 0ms optimistic real-time comment rendering in `submitComment()` to instantly display viewer comments at top of feed.
  3. Cleaned 3D A-Frame scene by removing expanding body spheres/dots, implementing body-hinged 3D left/right wing flap animations (`butterfly-left-wing.svg` and `butterfly-right-wing.svg`) at a controlled 45° rotation rhythm (`550ms` pulse) over the clean target.
  4. Added full interactive social bar (❤️ Likes, 👋 Waves, 💬 Comments modal) directly to `ar-mind.html`.
- **Why:** Resolved mobile browser WebGL canvas occluding bug where camera video stream blocked WebGL drawing output. Provides immediate 0ms real-time feedback for comments while giving users an unencumbered, elegant 3D wing flapping animation over target prints.
### 2026-07-30 — Universal Multi-Target WebAR Camera Scanner (`ar-camera.html`)

- **Status:** accepted
- **Decision:**
  1. Compiled multi-target descriptor `all-targets.mind` containing `Target 0` (Cosmic Butterfly) and `Target 1` (Test Tree).
  2. Built `public/ar-camera.html` allowing one single camera view to automatically scan both Cosmic Butterfly and Test Tree without closing or switching scanner pages.
  3. Integrated auto-switching HUD that updates title badge, status guidance, and real-time Supabase reaction counters based on active target in view.
- **Why:** Delivers seamless WebAR camera experience where viewers open ONE camera view and point at ANY streetwear artwork print to trigger matching 3D AR overlays.
- **Impacts:** `public/ar-camera.html`, `public/data/targets/all-targets.mind`, `scripts/compile-mind-all.cjs`, `src/pages/AR.jsx`

---

## 8. Implemented Features Log (July 2026 Update)

- **Streetwear Feed UI:** Upgraded [Home.jsx](file:///d:/ar-expression-platform/src/pages/Home.jsx) with a dark theme (#0F0F12), violet branding header, and glassmorphic cards representing t-shirt graphics.
- **Visual Overlay Ingestion:** Ingested 4 new SVG overlay assets: [happy.svg](file:///d:/ar-expression-platform/public/overlays/happy.svg), [playful.svg](file:///d:/ar-expression-platform/public/overlays/playful.svg), [inspired.svg](file:///d:/ar-expression-platform/public/overlays/inspired.svg), and [peaceful.svg](file:///d:/ar-expression-platform/public/overlays/peaceful.svg) inside `public/overlays/`.
- **Visual Overlay Selector:** Added a horizontal selection grid inside [Create.jsx](file:///d:/ar-expression-platform/src/pages/Create.jsx) to select overlays with one tap.
- **Tactile Voice Controls:** Upgraded [Expression.jsx](file:///d:/ar-expression-platform/src/pages/Expression.jsx) with a glassmorphic layout and a glowing, circular microphone button with pulse animations.
- **AR Scanning Interface:** Cleaned up [AR.jsx](file:///d:/ar-expression-platform/src/pages/AR.jsx) to display clear instructions and target download cards.
- **Production GCP VM & Nginx Deployment:** Successfully deployed the platform inside a Docker container on a GCP Compute Engine instance proxied by Nginx. Secured all camera feeds with Let's Encrypt SSL (HTTPS) at `https://ar.aiforall.ltd/ar`.
- **Mobile-AR Clean Interface:** Disabled default A-Frame split-screen Cardboard VR features, removing the headset buttons to enforce a distraction-free WebAR camera layout.
- **Interactive Social AR Interface:** Added real-time comments feeds, likes (❤️), and greetings (👋) overlay modules directly inside `ar.html` and `ar-mind.html` on top of the webcam feed.
- **Transparent 3D Spacing & Floating:** Fixed A-Frame plane height calculations to render relative to the Y-axis (vertical offset above the marker) and removed solid SVG box backgrounds for true transparency.
- **Secure VM Git Syncing:** Configured Linux SSH folder permissions and agent identities on the GCP instance, allowing frictionless `git fetch && git reset --hard` deployments.
- **MindAR Neural Image Tracking:** Migrated `ar.html` and `ar-mind.html` to MindAR (TF.js). Target descriptor compilation is automated via `scripts/compile-mind.cjs`, enabling pure 100% markerless tracking on clean original vector artwork directly (zero Hiro tags, zero scan badges).
- **Optimistic 0ms Real-Time Social Commenting:** Integrated optimistic DOM prepending for social comments so viewer responses render instantly in 0ms without waiting for backend network roundtrips.
- **Pure 3D Wing Flapping WebAR Engine:** Built dedicated body-hinged wing flap planes for Cosmic Butterfly with controlled 45° rotation pulses and interactive reaction controls.
- **Real-Time Cross-Device DB Reactions Sync:** Successfully verified 500ms live database persistence & real-time auto-sync for Likes, Waves, and Comments between mobile AR view and laptop desktop views.

---

## 10. Local testing

```bash
cd D:\ar-expression-platform
npm install
npm run dev
```

- App: root `http://localhost:61100/` redirects to **AR** (`/ar`). Feed lives at **`/feed`**.
- AR launcher: `http://localhost:61100/ar`
- AR scene: opened via “Open AR experience” (e.g. `ar.html?overlay=...&mood=...&caption=...`).

---

## 11. Where this file lives and how to use it

- **Path:** `memory.md` in project root.
- **Use:** Read before major features or refactors. Update when vision, principles, or stack change. Pair with **`PROJECT-PLAN.md`** and **README.md** for continuity.
