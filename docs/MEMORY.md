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
- Release magnetically snaps to the nearest bottle.
- Wheel/trackpad navigation is supported on desktop.
- Center bottle becomes active.
- Clicking the active bottle moves it toward the camera and pushes the rest back.
- Detail architecture supports later notes/product information.
- The experience may later evolve into a dedicated visual world per selected fragrance.

## Technical direction

- Next.js App Router.
- React + TypeScript.
- Three.js through React Three Fiber.
- Drei where useful.
- GSAP for controlled animation.
- Real procedural 3D geometry/materials rather than a flat cutout.
- The supplied reference image is sufficient for prototype 3D work; exact dimensions/GLB are not currently required.
- No remote HDR dependency in the initial build.
- DPR is capped and reduced-motion support is part of the base implementation.

Current pinned foundation:
- Next.js 16.3.8
- React / React DOM 19.3.0
- React Three Fiber 9.8.1
- Drei 10.7.9
- Three.js 0.186.0
- GSAP 3.15.0

## Current repository state

- Agent rules, memory, decisions, questions, implementation plan and task ledger are present.
- `docs/TASKS.md` is now the required execution checklist and completed work is marked there.
- Amber Touch reference asset is stored in `assets/reference/`.
- Next.js homepage scaffold is present.
- The catalog now renders seven unique data entries that all intentionally represent Amber Touch for testing.
- Bottle model v1 has been refined from the supplied photo into a procedural beveled glass silhouette with dark liquid, gold hardware, sculpted black cap bands and a generated Amber Touch front label.
- Rail supports pointer drag/swipe, snap, wheel navigation, active-product state and selected-bottle forward animation.
- Black/gold responsive homepage shell is implemented.
- GitHub Actions CI installs dependencies, typechecks and production-builds on every push.
- Previous CI validation passed install, TypeScript and production build before this refinement.

## Prototype blockers

None. Continue implementation without waiting for the remaining six product names, exact bottle measurements or external 3D files.

## Next step

Follow `docs/TASKS.md` in order of impact. Next targets are bottle fidelity/performance, premium rail physics, secondary bottle motion, richer lighting/reflections and cinematic selection polish.
