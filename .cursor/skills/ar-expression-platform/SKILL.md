---
name: ar-expression-platform
description: How to work on the AR Expression Platform repo—stepwise, minimalistic, Fogg-aware, open-source first. Use when editing, adding features, or refactoring this project.
---

# AR Expression Platform — Project Skill

**Serve job:** When working in this repo, follow this skill so every change is **stepwise**, **minimalistic**, **intuitive**, and **exhaustive** (documented and searchable). Apply the **Fogg Behavior Model** at every user touchpoint.

---

## 1. Before You Change Anything

1. **Read project memory:** Open `memory.md` in the repo root. It holds: product vision, patent alignment, Fogg model, open-source stance, design principles, current state.
2. **Identify the touchpoint:** Which screen or action are you changing? (Feed, Create, Expression detail, AR launch, like/greeting/comment, voice mood, caption, etc.)

---

## 2. Stepwise and Minimalistic

- **One clear step per screen:** Each view should have one primary action. Secondary actions (e.g. “Back to Feed”) stay visible but secondary.
- **Refine, don’t ornament:** Prefer removing or simplifying over adding. If adding UI, ask: “Does this increase clarity, motivation, or ability?”
- **Intuitive flows:**  
  - Feed → tap expression → Expression detail → Like / Greeting / Comment / Open AR / Set mood by voice.  
  - Create → form → submit → Expression detail.  
  - AR View → instructions + “Open AR experience” → `ar.html`.
- Keep flows **minimal** and **predictable**.

---

## 3. Fogg Behavior Model at Every Touchpoint

For **every** user-facing change, check:

| Fogg component | Question to answer |
|----------------|---------------------|
| **Prompt**     | Is it obvious *what* to do (button/label/instruction)? |
| **Motivation** | Does copy/UI support curiosity, expression, or social reward? |
| **Ability**    | Is the action as **easy** as possible (few steps, clear labels)? |

- **Copy:** Use short, action-oriented text. Avoid jargon.
- **Buttons/links:** One primary action per block; secondary actions visually lighter.
- **AR entry:** Instructions must be minimal and clear (e.g. “Point camera at Hiro marker”).

---

## 4. Open Source and Dependencies

- **Prefer open source** for new features (backend, AI, voice, etc.).
- Before adding a dependency: check license, maintenance, and fit with our minimal stack.
- **Current stack:** React, React Router, Vite, A-Frame, AR.js, Supabase client (optional), compromise (voice/NLP chunk). Data: `api.js` → Supabase if `.env` set, else in-memory `store.js`.
- Document in `memory.md` or README when we add a major new OSS component.

---

## 5. Exhaustive and Searchable

- **Document decisions:** Non-obvious choices (e.g. why this AR lib, why this flow) go in `memory.md` or in-code comments.
- **Naming:** Use clear, consistent names (e.g. “expression”, “overlay”, “trigger”, “Feed”, “AR View”) so search finds everything.
- **Keywords to keep in mind:** patent, Fogg, minimal, intuitive, stepwise, open source, wearable, digital memory, mood, caption, AR, trigger.

---

## 6. File and Flow Map (Quick Reference)

| Area            | Files / entry points |
|-----------------|----------------------|
| App shell       | `src/App.jsx`, `src/main.jsx`, `index.html` |
| Feed            | `src/pages/Home.jsx` |
| Create          | `src/pages/Create.jsx` |
| Expression      | `src/pages/Expression.jsx` (dynamic `import('../utils/voice')` for voice) |
| AR launcher     | `src/pages/AR.jsx` |
| AR experience   | `public/ar.html` |
| Data API        | `src/data/api.js`, `src/data/store.js`, `src/data/supabase.js` |
| Voice + NLP     | `src/utils/voice.js` |
| DB schema       | `supabase/schema.sql`, `.env.example` |
| Global styles   | `src/index.css` |
| Memory / vision | `memory.md` |

---

## 7. When Adding a Feature or Refactor

1. Read `memory.md`.
2. Decide which touchpoint(s) are affected.
3. Apply Fogg (prompt, motivation, ability) to that touchpoint.
4. Implement in a **stepwise**, **minimal** way.
5. Update `memory.md` if vision, principles, or stack change; update README if run/setup changes.

---

## 8. When Searching “What We Have”

- **Code:** See `memory.md` § “Current repo state” and the file map above.
- **Vision and principles:** `memory.md` §§ 1–5.
- **How to work:** This SKILL.md.

Keeping this in mind keeps the project **smart**, **professional**, and **aligned** with the patent and product vision.
