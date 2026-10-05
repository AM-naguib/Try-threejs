# Project Memory

_Last updated: 2026-10-05_

## Purpose

Build the complete WAVE Fragrances homepage around a premium, physical-feeling 3D fragrance discovery experience rather than a conventional product grid.

## Confirmed product direction

- Brand: WAVE Fragrances.
- Repository: `AM-naguib/Try-threejs`.
- Homepage scope: full homepage, not only an isolated hero demo.
- Version 1 catalog size: 7 fragrances.
- All fragrances share the same bottle shape; labels/artwork change by product.
- Amber Touch is the first confirmed reference:
  - WAVE
  - Amber Touch
  - 60ml
  - Extrait De Parfum
- Final visual language remains the current black + gold WAVE identity.
- Both desktop and mobile are equally important.
- Commerce integration is not required in the first pass.

## Confirmed interaction direction

- Horizontal physical-feeling bottle rail.
- Drag/swipe follows the user's motion.
- Release magnetically snaps to the nearest fragrance.
- Wheel/trackpad navigation is supported on desktop.
- Center bottle becomes active.
- Clicking the active bottle moves it toward the camera and pushes the rest back.
- Detail architecture supports notes/product information.
- The experience may later evolve into a dedicated visual world per selected fragrance.

## Technical direction

- Next.js App Router.
- React + TypeScript.
- Three.js through React Three Fiber.
- Drei where useful.
- GSAP for controlled animation.
- Real 3D geometry/materials, not a final flat cutout implementation.
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

- Project documentation and agent rules are initialized.
- Amber Touch reference asset is stored in `assets/reference/`.
- Initial Next.js homepage scaffold is present.
- A procedural true-3D bottle approximation is implemented so interaction can be developed before an exact GLB exists.
- Seven data slots exist. Only Amber Touch contains confirmed product data; the other six intentionally remain unnamed.
- Initial rail supports pointer drag/swipe, magnetic-style snap, wheel navigation, active-product state and selected-bottle forward animation.
- Black/gold responsive homepage shell and product status UI are implemented.
- GitHub Actions CI is configured to install dependencies, typecheck and production-build on every push.
- CI run #6 for commit `3dbd9a3` passed all steps: install, typecheck and production build.
- CI setup was corrected after its first run exposed a missing-lockfile cache configuration issue.
- The first TypeScript validation exposed GSAP cleanup typing/formatting; fixes were completed through commit `3dbd9a3`.

## Important constraint

Do not invent the missing six product names, notes, prices, inspiration, reviews or brand story. Wait for approved data/assets.

## Next step

CI now passes install, TypeScript validation and production build. Next: iterate on rail physics and bottle fidelity. In parallel collect the six remaining product names, labels and catalog data listed in `docs/QUESTIONS.md`.
