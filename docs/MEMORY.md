# Project Memory

_Last updated: 2026-10-05_

## Purpose

Build the complete WAVE Fragrances homepage around a premium, physical-feeling 3D fragrance discovery experience rather than a conventional product grid.

## Confirmed product direction

- Brand: WAVE Fragrances.
- Repository: `AM-naguib/Try-threejs`.
- Homepage scope: full homepage, not only an isolated hero demo.
- Prototype catalog: 7 test instances of the same Amber Touch bottle.
- Architecture remains data-driven so the seven real fragrances can replace the test entries later.
- Amber Touch reference:
  - WAVE
  - Amber Touch
  - 60ml
  - Extrait De Parfum
- Current visual language remains black + gold.
- Both desktop and mobile are equally important.
- Commerce integration is not required in the first pass.

## Confirmed interaction direction

- Horizontal physical-feeling bottle rail.
- Drag/swipe follows the user's motion.
- Velocity influences the projected snap target.
- Edge overscroll is resisted instead of hard-stopping.
- Bottles swing/twist subtly during movement and settle afterward.
- Wheel/trackpad navigation is supported on desktop.
- Center bottle becomes active.
- Clicking the active bottle moves it toward the camera while the camera also pushes in and surrounding UI/scene recedes.
- Detail architecture supports approved inspiration/notes when real data is supplied.

## Technical direction

- Next.js App Router.
- React + TypeScript.
- Three.js through React Three Fiber.
- Drei for environment lighting helpers.
- GSAP for controlled object transitions.
- The bottle is now a real GLB asset generated at `public/models/amber-touch.glb` before dev/build.
- `Bottle.tsx` loads the GLB through `useGLTF`; inline bottle geometry was removed.
- The seven bottles clone the same GLB geometry and reuse common PBR materials.
- The front label uses UV coordinates mapped directly to the supplied Amber Touch product photo, so the visible label is the real reference artwork rather than a redrawn approximation.
- Static export is enabled so the prototype can be hosted on static hosting.
- DPR remains capped for performance.

Current pinned foundation:
- Next.js 16.3.8
- React / React DOM 19.3.0
- React Three Fiber 9.8.1
- Drei 10.7.9
- Three.js 0.186.0
- GSAP 3.15.0

## Current repository state

- Agent rules, memory, decisions, questions, implementation plan and task ledger are present.
- `docs/TASKS.md` is the required execution checklist.
- Amber Touch reference asset is stored in `assets/reference/`.
- The catalog renders seven unique data entries that all intentionally represent Amber Touch for testing.
- Bottle geometry is generated as a standalone GLB from pixel measurements of the supplied 1536×1536 front photo. GLB v2 uses one global image-to-model scale so the cap/body/neck proportions stay faithful to the reference, traces the shoulder/body taper row-by-row, uses a smaller measured cap radius profile, and maps the real label from its measured corners over nearly the full front panel.
- Shared geometry/materials reduce repeated 3D resource creation.
- Rail physics now include velocity projection, overscroll resistance, inertia-aware snap and secondary bottle swing/twist.
- Selected product transition includes camera push-in, scene vignette and UI/hero de-emphasis.
- Studio environment lightformers improve glass/gold reflections without remote HDR assets.
- Background glow responds to rail position and interaction energy.
- Commit `5a24672` passed GitHub Actions CI run #25: dependency install, TypeScript validation and production build all succeeded, including the rebuilt GLB v2 generation step.
- Vercel production deployment for commit `5a24672` is READY and mapped to `https://try-threejs-nu.vercel.app`.

## Prototype blockers

No implementation blocker is active. The latest bottle correction is live and ready for visual approval.

## Next step

Get visual approval on the rebuilt GLB v2 bottle silhouette and real-photo label mapping from the live Vercel build. If approved, continue T-027/T-028 and the remaining device/performance QA.
