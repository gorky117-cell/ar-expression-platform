# WearWave

**WearWave** is the product name: social, engaging, wearable-first AR — solo-friendly and modern.  
Repo folder: **AR Expression Platform** (aligned with the provisional patent: AI-Driven AR and Social Expression via Wearable Prints).

## URLs (D drive, local)

- **App (after `npm run dev`):** http://localhost:5173  
- **AR launcher:** http://localhost:5173/ar  
- **GitHub repo:** https://github.com/gorky117-cell/ar-expression-platform  
- **Public deploy URL:** add when you deploy (e.g. Vercel / Netlify / Railway); not set in-repo yet.

## What it does

- **Create expressions** – Trigger image + overlay image + mood. One print can carry multiple narratives.
- **AR view** – Point your camera at the **Hiro marker**; the overlay appears in AR with sway and birds animation.
- **Social layer** – Like, send greeting, and comment on each expression. Reactions are tied to the expression (digital memory).

## Run locally

```bash
cd D:\ar-expression-platform
npm install
npm run dev
```

Open http://localhost:5173

- **Feed** – List of expressions (like, greeting, comment counts).
- **Create** – Add new expression (name, mood, trigger URL, overlay URL).
- **AR View** – Open the AR experience; use a phone or webcam. Print the [Hiro marker](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/hiro.png) and point the camera at it.

## AR flow

1. From Feed or an expression page, click **Open AR** or **Open AR experience**.
2. Allow camera access.
3. Point the camera at the Hiro marker (on paper or another screen).
4. The overlay (tree + birds) appears in AR with gentle sway; birds animate.

## Tech

- **Frontend:** React, React Router, Vite
- **AR:** A-Frame + AR.js (pattern marker)
- **Data:** Supabase (optional). Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; run `supabase/schema.sql` in Supabase SQL Editor. Without `.env`, app uses in-memory store (resets on refresh).

## D drive

Repo and all work: **D:\ar-expression-platform**. Run `npm install` and `npm run dev` from this path so dependencies stay on D.
