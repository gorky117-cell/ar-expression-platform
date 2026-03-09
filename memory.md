# AR Expression Platform — Project Memory

**Purpose:** Single source of truth for vision, patent alignment, principles, and constraints. Update this as the project evolves. Search this file for: patent, Fogg, open source, minimal, intuitive, wearable, AI, memory.

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
- **Future scope (patent):** AI stack (SML, VLM, LLM, Stable Diffusion), SNN, voice, persistent co-creation. Current repo is a **minimal MVP**; AI and persistence are planned, not yet implemented.

---

## 3. Fogg Behavior Model (apply at every touchpoint)

At **each** user action (Feed, Create, Expression detail, AR launch, like, greeting, comment, etc.) we want:

- **Prompt:** Clear, visible trigger (e.g. button, link, instruction) so the user knows what to do.
- **Motivation:** Copy and UI should reinforce curiosity, expression, or social reward (not generic “click here”).
- **Ability:** Actions must be **easy** (minimal steps, obvious labels, no unnecessary friction).

Design and refine each screen/flow with these three in mind. Test: “Is the prompt obvious? Is motivation clear? Is it as simple as possible?”

---

## 4. Design and UX principles

- **Minimalistic:** No ornamentation for its own sake. Every element should have a job (clarity, prompt, motivation, or ability).
- **Intuitive:** Flows should feel obvious (e.g. Feed → Expression → AR; Create → Expression).
- **Stepwise:** Break flows into clear steps; one primary action per view where possible.
- **Exhaustive but organized:** Document every decision and pattern so that when someone (or an agent) searches, they find: open-source choices, Fogg application, and rationale.

---

## 5. Open source and tech (utilize first)

- **Prefer open source** for all components where possible.
- **Current stack:** React, React Router, Vite, A-Frame, AR.js (Hiro pattern marker). In-memory store (to be replaced with persistent backend).
- **Candidates to evaluate:**  
  - Backend/DB: Supabase, PocketBase, or self-hosted OSS.  
  - AI (when we add): open-source SML/VLM/LLM, voice APIs.  
  - AR: remain on A-Frame + AR.js unless we have a clear reason to switch.
- Before adding a dependency, check: license, maintenance, and fit with minimalistic architecture.

---

## 6. Current repo state (as of this memory)

- **Implemented:** Feed, Create expression, Expression detail (like, greeting, comment), AR launcher page, standalone AR experience (`public/ar.html`) with tree + birds overlay and Hiro marker.
- **Not implemented:** Persistent storage, AI-driven mood/caption/overlay, voice input, wearable-specific flows, Fogg-aware copy/UX audit.
- **Refinement rule:** Every change (feature or fix) should **refine** the product: clearer prompts, better motivation, higher ability, or better alignment with patent and memory.

---

## 7. Where this file lives and how to use it

- **Path:** `memory.md` in project root.
- **Use:** Read before major features or refactors. Update when vision, principles, or stack decisions change. Reference in SKILL.md so agents and contributors stay aligned.
