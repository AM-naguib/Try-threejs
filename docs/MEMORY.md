# Project Memory

_Last updated: 2026-10-05_

## Purpose

Build the complete WAVE Fragrances homepage around a premium, physical-feeling fragrance discovery experience.

## Confirmed product direction

- Brand: WAVE Fragrances.
- Repository: AM-naguib/Try-threejs.
- Homepage scope: full homepage, not only an isolated hero demo.
- Prototype catalog: 7 test instances of Amber Touch.
- Amber Touch reference:
  - WAVE
  - Amber Touch
  - 60ml
  - Extrait De Parfum
- Current visual language remains black + gold.
- Both desktop and mobile are equally important.
- Commerce integration is not required in the first pass.
- Owner explicitly requires **no guessing** for bottle geometry or hidden dimensions.

## Confirmed interaction direction

- Horizontal physical-feeling bottle rail.
- Drag/swipe with velocity-aware magnetic snap.
- Edge overscroll resistance.
- Subtle secondary swing.
- Wheel/trackpad navigation.
- Center bottle active state.
- Selected bottle advances while camera/UI choreography emphasizes it.

## Current bottle strategy

The previous inferred GLB approach is retired.

Reason:
- only a straight-on product photograph is authoritative;
- depth, side surfaces, hidden glass volume and real cap depth cannot be recovered exactly from that single view;
- previous GLB attempts looked visually wrong because those unseen properties had to be invented.

Current implementation:
- the exact supplied front photograph is decoded during the asset-preparation step;
- Sharp crops the approved bottle bounds and applies one continuous traced silhouette mask, so transparent glass/highlights inside the bottle are never mistaken for background;
- the build outputs `public/reference/amber-touch-cutout.png` with stable alpha for iOS/WebGL;
- Bottle.tsx renders that PNG with a standard `MeshBasicMaterial`, so there is no runtime chroma-key shader and no flood-fill striping;
- no bottle part is redrawn and no unseen 3D dimensions are invented;
- bottle Y rotation is intentionally kept extremely small.

## Technical foundation

- Next.js 16.3.8
- React / React DOM 19.3.0
- React Three Fiber 9.8.1
- Drei 10.7.9
- Three.js 0.186.0
- GSAP 3.15.0
- TypeScript strict mode
- Static export / Vercel preview

## Current repository state

- Project docs and task ledger are present.
- Seven Amber Touch entries remain data-driven.
- Rail physics, secondary motion, selection transition and responsive homepage shell remain implemented.
- The inferred GLB generator was removed from scripts/prepare-assets.mjs.
- Bottle rendering was switched from useGLTF to exact-reference useTexture rendering.
- The original owner-supplied front reference remains the visual source of truth.

## True 3D blocker

True production 3D now intentionally waits for measured depth/side information, supplier CAD/3D files, or a scan. This does not block the current exact-front prototype.

## Validation

Commit `55f548c` passed dependency install, TypeScript validation and production build. Vercel production deployment is READY and aliased to `try-threejs-nu.vercel.app`.

## Retina sharpness

The mobile bottle looked soft after alpha artifacts were fixed. The renderer now uses DPR 2–3, bottle texture mipmaps are disabled, anisotropy is increased, and the generated PNG is 2× upscaled with Lanczos + mild sharpening for Retina screens.

## Next step

Owner reviews the Retina sharpness pass on mobile. If the bottle is now crisp enough, continue composition and interaction polish.
