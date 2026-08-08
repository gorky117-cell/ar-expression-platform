# WearWave — Project Memory & Technical Master Log

**Product Name:** **WearWave** — Social, engaging, wearable-first AR platform; modern, solo-friendly vibe.  
**Purpose:** Single source of truth for vision, patent alignment, architecture, commit logs, and technical decisions.  
**GitHub Repository:** https://github.com/gorky117-cell/ar-expression-platform  
**Live Production URL:** https://ar.aiforall.ltd  
**Local Path:** `D:\ar-expression-platform`

---

## 1. Product Vision & Patent Alignment

- **Core Concept:** An AR-first social layer around physical streetwear prints (wearables, posters, accessories).
- **Wearer Narrative:** A physical print (e.g., Cosmic Butterfly or Test Tree on a T-shirt) is the **trigger**. The wearer **dictates** the expression (mood, caption, story).
- **Viewer Experience:** When a viewer scans the garment with their camera, they see **live 3D AR visuals + floating caption story + real-time social reaction deck** (Likes ❤️, Greetings 👋, Comments 💬).
- **Provisional Patent Claims:**
  - Physical triggers (garments, accessories, posters) for AR storytelling.
  - Viewer interaction: greetings, comments, social memory threads.
  - Persistent digital memory tied to object triggers.
  - Fogg Behavior Model applied across all touchpoints (Prompt, Motivation, Ability).

---

## 2. Infrastructure & Zero-Cost Architecture Stack

| Layer | Technology | Configuration & Details | Cost |
|:---|:---|:---|:---|
| **Live App Hosting** | **Railway Cloud** | Auto-deploy on `git push origin master`. Express 5 server on port `61100`. Automatic Let's Encrypt SSL/TLS. | **$0 / mo** (Covered by $5 Railway monthly credit) |
| **Custom Domain & SSL** | **Cloudflare DNS** | `CNAME` for `ar` -> `ar-expression-platform-production.up.railway.app` (Proxied 🧡). `TXT` for `_railway-verify.ar`. | **$0 / mo** |
| **Database & Persistence** | **Supabase PostgreSQL** | REST API endpoints with automated 24-hour Keep-Alive REST ping in `server.js` to prevent 7-day inactivity pause. | **$0 / mo** (Free Tier) |
| **GCP Fallback & Cost Safeguard** | **GCP VM + Shell Script** | Created `deploy-vm.sh` for 1-click redeployment fallback. VM deleted/paused to prevent GCP compute disk/IP charges ($15–$30/mo). | **$0 out-of-pocket** |
| **WebAR Tracking Engine** | **MindAR 1.2.5 (TF.js)** | Multi-target binary `public/data/targets/all-targets.mind` (1,048,170 bytes) tracking Target 0 (Butterfly) and Target 1 (Tree) markerlessly. | Open Source ($0) |

---

## 3. Complete Chronological Commit Log & Technical Rationale

| Commit | Date | Summary | Technical Rationale & Impact |
|:---|:---:|:---|:---|
| **`2e24335`** | Aug 8, 2026 | **Official 2 Artwork Constraint** | Restricted `SYSTEM_OVERLAYS` in `src/pages/Create.jsx` strictly to Cosmic Butterfly (`/overlays/cosmic-butterfly.svg`) and Test Tree (`/overlays/tree-birds-target.png`) for V1 launch clarity. |
| **`86f4e2b`** | Aug 8, 2026 | **Supabase Keep-Alive Ping** | Added automated `setInterval` 24-hour REST ping to Supabase endpoint in `server.js`. Prevents database auto-pause after 7 days of inactivity. |
| **`74deef9`** | Aug 8, 2026 | **Initial 3D AR Preview Box** | Added interactive `🔮 3D AR Visual Preview` box to `/create` page so creators can preview 3D motion descriptions before publishing. |
| **`7408079`** | Aug 8, 2026 | **Line-by-Line Breakdown** | Enhanced preview box with detailed line-by-line visual breakdown for Calm Tree vs Cosmic Butterfly. |
| **`7286a48`** | Aug 8, 2026 | **Integrated Artwork Cards** | Redesigned `/create` layout so each artwork design is presented as a standalone card containing its own mood selector pills. |
| **`24083d2`** | Aug 8, 2026 | **Real-Time Hover Interactivity** | Added `hoveredState` (`onMouseEnter`/`onMouseLeave`) to mood pills. Hovering over any pill instantly highlights the preview box in Electric Neon Cyan (`#00f0ff`). |
| **`144ee11`** | Aug 8, 2026 | **Live Animated Graphic Canvas** | Built a real animated 2D/3D preview canvas with CSS wing flapping (`@keyframes butterflyFlap`) and tree swaying (`@keyframes treeSway`) inside the preview box. |
| **`031c959`** | Aug 8, 2026 | **Dynamic Mood Particles** | Added real-time floating mood particle layers inside the preview canvas: `🍃` for calm, `✨` for inspired, `⚡` for happy, `🎨` for playful, `🧘` for peaceful. |
| **`52a73d7`** | Aug 8, 2026 | **Artwork-Specific Mood Options** | Mapped custom artwork-tailored options (Galactic, Micro-Swarm, Hyperdrive, Zenith vs Canopy-Calm, Leaf-Whirlwind, Solar-Beams, Starlight-Roots). |
| **`e748325`** | Aug 8, 2026 | **Restored Standard Mood Names** | Restored standard clean mood button labels (`🌿 calm`, `⚡ happy`, `🎨 playful`, `🌌 inspired`, `🧘 peaceful`) while preserving rich artwork-tailored 3D AR motion and aura mapping in the canvas. |

---

## 4. Current WebAR Scanner & Creator Architecture

### A. Creator Flow (`/create` -> `Create.jsx`)
1. Creator enters Expression Name & Caption Story.
2. Selects Artwork Design Card (**Cosmic Butterfly** 🦋 or **Test Tree** 🌳).
3. Taps or hovers over a Mood Pill (`🌿 calm`, `⚡ happy`, `🎨 playful`, `🌌 inspired`, `🧘 peaceful`).
4. **Live Graphic Canvas:** Displays real-time wing-flapping or tree-swaying animations, custom aura colors, floating particles, and a floating caption preview.
5. Hits **Publish Expression** -> Writes row to Supabase -> Redirects to Expression Detail & Scanner!

### B. WebAR Scanner Flow (`/scanner` -> `ar-camera.html`)
1. Universal camera view loads `all-targets.mind` (Target 0: Butterfly, Target 1: Tree).
2. **Target 0 Detected (Cosmic Butterfly 🦋):**
   - Renders 3D body-hinged wing flap animation (`butterfly-left-wing.svg` & `butterfly-right-wing.svg`) pulsing at 45° rotation rhythm.
   - Fetches active mood from Supabase and applies aura glow + floating star-dust particles.
3. **Target 1 Detected (Test Tree 🌳):**
   - Renders crisp WebGL PNG overlay (`tree-birds-overlay.png`) with swaying forest canopy.
   - Renders 2 3D perched bluebirds + falling autumn leaves animation.
4. **Floating 3D Story Banner & Reaction Deck:**
   - Wearer's caption story floats in 3D above the artwork.
   - Viewers tap ❤️ Like, 👋 Wave, or 💬 Comment — updating Supabase in real-time with 0ms optimistic UI rendering!

---

## 5. Future Development Roadmap

### Phase 2 (Post-V1 Stability — 100% $0 Cost on Railway)
- **Long-Range Scanning (10 ft):** Scale-adaptive MindAR target descriptor optimization for scanning garments across a room.
- **6-DOF Motion Smoothing:** Kalman filter / exponential moving average smoothing for fabric motion and body movement.
- **3D Flying Birds & Figure-8 Flight:** 3D bluebirds taking flight off the tree branches into room space; 3D butterfly flying off chest print in figure-8 infinity loop flight path.
- **Room Locking:** Spatial anchor fallback so 3D objects remain locked in physical room space even when camera briefly turns away from the garment print.

### Phase 3 (V3 Heavy AI Models — GCP GPU Fallback)
- **Generative AI Art Synthesis:** On-the-fly Stable Diffusion artwork generation driven by wearer voice prompts.
- **VLM & Spiking Neural Networks (SNN):** Edge AI models running on GCP GPU instance for multi-modal emotion and gesture recognition.

---

## 6. How to Run & Deploy

```bash
# Local Development
cd D:\ar-expression-platform
npm run dev

# Deploy Update to Railway (Auto-Deploys in 30 seconds)
npm run build
git add -A
git commit -m "Your feature update message"
git push origin master
```
