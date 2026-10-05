# Project Memory

_Last updated: 2026-10-05_

## Purpose

Build the complete WAVE Fragrances homepage around a premium, physical-feeling fragrance discovery experience.

## Confirmed product direction

- Brand: WAVE Fragrances.
- Repository: `AM-naguib/Try-threejs`.
- Homepage scope: full homepage.
- Prototype catalog: 7 repeated Amber Touch instances.
- Amber Touch: WAVE / Amber Touch / 60ml / Extrait De Parfum.
- Current visual language: black + gold.
- Desktop and mobile are both important.
- Commerce integration is deferred.

## Canonical bottle asset

The owner approved the isolated Amber Touch bottle visual.

**Canonical project path:**

`public/products/amber-touch-approved.webp`

This project file is now the source of truth. Whenever the implementation needs the Amber Touch image, use this file. Do not regenerate the bottle from memory or an image prompt, and do not run another masking/reconstruction pipeline unless the owner explicitly approves a replacement.

## Current interaction strategy

The earlier 3D/GLB/WebGL experiments are retired for this homepage interaction.

The current solution is deliberately simple:

- normal DOM `<img>` bottle;
- seven repeated instances;
- horizontal drag/swipe;
- velocity-aware magnetic snap;
- edge resistance;
- subtle bottle tilt/swing;
- wheel/trackpad navigation;
- centered active state;
- selected bottle moves/scales forward while the others recede;
- CSS/DOM presentation instead of canvas rendering.

This matches the actual goal: the bottle needs to feel interactive and movable, not be a freely rotatable 3D object.

## Technical foundation

- Next.js 16.3.8
- React / React DOM 19.3.0
- TypeScript strict mode
- CSS transforms + pointer/touch events
- Vercel production deployment

No Three.js / React Three Fiber / Drei / Sharp asset-generation dependency is required by the current implementation.

## Repository state

- `components/experience/PerfumeExperience.tsx` is the DOM rail implementation.
- `public/products/amber-touch-approved.webp` is the approved product asset.
- The old `Bottle.tsx` Three.js renderer is removed.
- The old asset-generation script is removed.
- The seven products remain data-driven through `lib/fragrances.ts`.

## Validation

Commit `18bd11d` added the approved canonical product asset.

GitHub Actions run #74 passed:
- dependency install;
- TypeScript validation;
- production build.

Vercel production deployment for the same commit is READY and mapped to:

`https://try-threejs-nu.vercel.app`

## Next step

Visually review the live DOM rail with the approved asset on mobile and desktop, then tune only composition/interaction (spacing, size, swing, snap, selected-state choreography) without altering the approved bottle image.
