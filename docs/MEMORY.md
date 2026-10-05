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
- Real procedural 3D geometry/materials rather than a flat cutout.
- Shared bottle geometry/material resources are reused across the seven test instances.
- Label canvas textures are cached instead of regenerated per bottle.
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
- Bottle model was corrected again against the latest supplied front photo: wider/faceted shoulders, narrower foot, larger label area, corrected neck ratio and a continuous lathed rippled cap replace the previous stacked-cylinder approximation.
- Shared geometry/materials reduce repeated 3D resource creation.
- Rail physics now include velocity projection, overscroll resistance, inertia-aware snap and secondary bottle swing/twist.
- Selected product transition includes camera push-in, scene vignette and UI/hero de-emphasis.
- Studio environment lightformers improve glass/gold reflections without remote HDR assets.
- Background glow responds to rail position and interaction energy.
- Commit `9aa99be` passed GitHub Actions CI run #12: dependency install, TypeScript validation and production build all succeeded.
- Vercel production deployment for commit `9aa99be` is READY and the production alias remains `https://try-threejs-nu.vercel.app`.

## Prototype blockers

No implementation blocker is active. The latest bottle correction is live and ready for visual approval.

## Next step

Get visual approval on the corrected bottle silhouette from the live Vercel build. If approved, continue T-027/T-028 and the remaining device/performance QA.
