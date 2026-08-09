# WearWave WebAR Platform Architecture & Phase 2 Master Roadmap

**Patent-Aligned Social Wearables Platform | Single Source of Truth**  
**Live Platform URL:** [https://ar.aiforall.ltd](https://ar.aiforall.ltd)  
**Repository:** [https://github.com/gorky117-cell/ar-expression-platform](https://github.com/gorky117-cell/ar-expression-platform)  

---

## 1. Executive Summary & V1 Deployed Baseline

The WearWave WebAR platform has successfully achieved a fully operational, production-ready V1 baseline deployed live on Railway Cloud (`https://ar.aiforall.ltd`). The platform seamlessly connects physical streetwear prints (e.g., T-shirts, hoodies, posters) with dynamic WebAR camera overlays and real-time social reaction infrastructure.

### Deployed V1 Milestones:
- **Markerless Multi-Target AR Engine:** Powered by MindAR 1.2.5 (`all-targets.mind`) tracking Target 0 (**Cosmic Butterfly** 🦋) and Target 1 (**Test Tree** 🌳) in real 3D camera space.
- **Soft Radial Aura Glow (`/overlays/soft-aura.svg`):** Custom soft radial gradient alpha-mask SVG texture that eliminates hard polygon edges, rendering a seamless blurred mood color glow.
- **Subtle White Glass Story Pill:** Sleek 3D story badge (`💬 "Your 3D AR story floats here"`) matching the 2D creator preview 1-to-1.
- **Vibrant Native Emoji Floating Particles (`#particleOverlay`):** Floating star sparkles (`✨`), leaves (`🍃`), lightning bolts (`⚡`), palette icons (`🎨`), and zen symbols (`🧘`) drifting smoothly around the scanned artwork.
- **Automatic Target-to-Expression Dynamic Sync:** The WebAR camera automatically queries Supabase for the latest published expression of the scanned print, binding caption, mood aura, and real-time Like/Wave buttons dynamically.
- **Automatic Mobile Cache-Busting:** Inline head script forces mobile Safari/Chrome to append timestamp parameters (`?_cb=TIMESTAMP`) on launch, bypassing phone storage cache.

---

## 2. Phase 2 Master Development Roadmap

- **Long-Range Scanning (10 ft):** Scale-adaptive MindAR target descriptor optimization for scanning garments across a room.
- **6-DOF Motion Smoothing:** Kalman filter and exponential moving average smoothing for fabric motion and body movement stabilization.
- **3D Flying Birds & Figure-8 Flight:** 3D bluebirds taking flight off tree branches; 3D butterfly flying off chest print in figure-8 infinity loop flight path.
- **Room Locking (Spatial Anchor Fallback):** Spatial anchor fallback retaining 3D object positions in physical room space even when camera briefly turns away.
- **Dynamic 3D AR Motion & Model Experimentation (Phase 2 End):** Full creator freedom to select, upload, or prompt real 3D GLTF models (e.g., sailing boat, surfer, dragon, sneakers, cherry blossoms) coming to life over any scanned print!

---

## 3. Phase 2 End: Dynamic 3D AR Motion & Model Creation Options Table

The table below details the 4 implementation paths for allowing creators to select, prompt, or upload real 3D AR motion models (e.g., sailing boats, surfers, dragons, sneakers) to bring custom expressions to life when scanned:

| Creation Option | Creator Input Method | 3D WebAR Asset Delivery | Technical Feasibility & Status |
|:---|:---|:---|:---|
| **Option A: Built-in 3D AR Motion Library** | Selects 3D Motion Card from curated grid on `/create` (e.g., ⛵ Ocean Boat, 🦋 Cosmic Butterfly, 🌳 Swaying Tree, 🐉 Cyber Dragon) | Pre-compiled WebGL `.glb` models stored in `public/models/` | **100% Ready** (A-Frame `<a-gltf-model>` natively supported; 0ms load overhead) |
| **Option B: Custom 3D Model Upload** | Drag-and-drop custom `.glb` / `.gltf` 3D file built in Blender, Maya, or Sketchfab | File uploaded to Supabase Storage bucket; URL stored in expression row | **100% Doable** (Standard WebGL asset loading; file size limit 5MB) |
| **Option C: Free 3D Model API Integration** | Searches 3D model keywords (*"boat"*, *"dragon"*, *"sneakers"*) via Sketchfab / Poly Pizza search box | Fetches GLTF model URL dynamically from public 3D API endpoints | **100% Feasible** (REST API search integration; dynamic A-Frame instantiation) |
| **Option D: Voice & Text AI Prompt Command** | Types or speaks prompt: *"Put a sailing boat on ocean waves"* or *"Spawn a dragon"* | AI maps prompt keywords to 3D GLTF asset + custom particle overlay | **Phase 3 Extension** (NLP/AI prompt mapping engine connected to GLTF library) |

---

## 4. Tomorrow's Immediate Priorities & Test Plan

1. **Differentiate Mood Motion Profiles:** Refine unique visual and motion characteristics for inspired, happy, playful, peaceful, and calm moods on both Cosmic Butterfly and Test Tree artwork.
2. **Creator Side Preview Precision:** Ensure the live graphic canvas on `/create` displays the exact motion, aura, and particle behavior before publishing.
3. **Randomized Multi-Mood Testing:** Publish expressions with random mood combinations across both target artworks and verify that scanning accurately detects and displays each unique emotion profile in real-time.
