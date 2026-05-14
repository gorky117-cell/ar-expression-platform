# Codex takeover — AR Expression Platform

Use this file when another agent (Codex, Cursor, etc.) continues work on this repo. It complements **`memory.md`** (vision + principles) and **`.cursor/skills/ar-expression-platform/SKILL.md`** (how to work).

---

## 1. Your mission

Build and refine an **AR-first social layer** around **physical prints** (T-shirts, posters, accessories). **Not** a generic Instagram/TikTok clone. Align with the inventor’s **provisional patent** (AI-driven AR + social expression via wearable prints). Keep the app **minimal, intuitive, mobile-first**, and apply **Fogg** (Prompt, Motivation, Ability) on every screen.

---

## 2. Repo and Git

| Item | Value |
|------|--------|
| **GitHub** | https://github.com/gorky117-cell/ar-expression-platform |
| **Owner** | `gorky117-cell` |
| **Default branch** | `master` (verify with `git branch`) |
| **Suggested local path** | `D:\ar-expression-platform` (author prefers D drive for space) |

Clone:

```bash
git clone https://github.com/gorky117-cell/ar-expression-platform.git
cd ar-expression-platform
npm install
npm run dev
```

---

## 3. Read order (before coding)

1. **`memory.md`** — product vision, patent summary, Fogg, stack, current vs planned.
2. **`CODEX-HANDOFF.md`** (this file) — takeover checklist and file map.
3. **`.cursor/skills/ar-expression-platform/SKILL.md`** — agent workflow and conventions.
4. **`README.md`** — run commands and Supabase setup.
5. **`supabase/schema.sql`** — DB tables if using Supabase.

---

## 4. Architecture (mental model)

```
Browser (React SPA)
  ├── Routes: /  /create  /ar  /expression/:id
  ├── Data: src/data/api.js
  │     ├── If .env has Supabase → PostgreSQL (expressions + reactions)
  │     └── Else → src/data/store.js (in-memory, lost on refresh)
  └── Voice/NLP: dynamic import('../utils/voice') from Expression page only
        → Web Speech API + compromise (separate JS chunk)

public/ar.html  (standalone AR, not React)
  └── A-Frame + AR.js, Hiro marker, ?overlay= & ?mood= & ?caption=
```

- **Single source of data for React:** always use **`api.js`** exports (`getExpressions`, `getExpression`, `addExpression`, `updateExpression`, reactions, comments). Do not bypass to `store.js` from pages except inside `api.js`.

---

## 5. File map (where to edit)

| Concern | Path |
|---------|------|
| App shell, routes | `src/App.jsx`, `src/main.jsx` |
| Feed | `src/pages/Home.jsx` |
| Create (name, mood, caption, URLs) | `src/pages/Create.jsx` |
| Expression (like, greeting, comment, voice, AR link) | `src/pages/Expression.jsx` |
| AR launcher + build `ar.html` URL | `src/pages/AR.jsx` |
| AR scene (marker, overlay, caption bar) | `public/ar.html` |
| API + Supabase + fallback | `src/data/api.js`, `src/data/supabase.js`, `src/data/store.js` |
| Voice + NLP (compromise) | `src/utils/voice.js` |
| DB schema | `supabase/schema.sql` |
| Env template | `.env.example` |
| Styles | `src/index.css` |
| Vision / stack truth | `memory.md` |

---

## 6. Commands

```bash
npm run dev      # http://localhost:61100
npm run build    # production bundle (check voice chunk splits correctly)
npm run preview  # serve dist
```

**Supabase:** copy `.env.example` → `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, run `supabase/schema.sql` in Supabase SQL Editor.

---

## 7. Conventions (do not ignore)

- **Minimal diff:** Only change what the task needs; match existing style (inline styles, no new UI framework unless agreed).
- **Fogg:** Every new button/screen — is the **prompt** obvious, **motivation** clear, **ability** high?
- **Open source first** for new deps; note license and size (voice chunk is already large due to compromise).
- **Dynamic import:** Keep `voice.js` / compromise **out of the main bundle** — load via `import('../utils/voice')` from the Expression page (or equivalent) unless there is a strong reason to change.
- **Update docs:** After meaningful stack or feature changes, update **`memory.md`** and this file if the takeover story changes.

---

## 8. Known limitations / edge cases

- **Speech:** Chrome/Edge best for Web Speech API; Safari may differ; HTTPS required in production for mic.
- **AR:** Hiro marker from CDN in `ar.html`; overlay is a URL (SVG/PNG); caption is query param (encodeURIComponent in `AR.jsx`).
- **UUID vs string id:** Supabase uses UUIDs; in-memory store uses numeric string ids — both must keep working in `api.js`.

---

## 9. Suggested next tasks (backlog)

Priority is for the product owner to confirm; typical order:

1. Add **5 overlay SVGs** under `public/overlays/` and a **picker** on Create (max 5 for MVP).
2. Expose **Love / Good / Keep** reaction buttons if desired (`addReaction` exists for Supabase; extend store for in-memory).
3. **Wearer vs Viewer** entry (two modes) — mobile-first.
4. **Share link** to expression page; optional deploy (Vercel/Netlify/Railway/GCP).
5. **Backend voice:** optional Whisper/Coqui + small API; keep browser path as fallback.
6. **memory.md** — keep in sync after each milestone.

---

## 10. Contact / context

- Inventor vision: wearable print as trigger; viewer points phone/glasses; reactions = digital memory; later retailer + QR + many viewers same shirt.
- **Patent PDF** may live outside the repo (user workspace); **`memory.md`** summarizes alignment.

---

*Last updated with repo docs sync. If this drifts from code, trust `memory.md` + git history and refresh this file.*
