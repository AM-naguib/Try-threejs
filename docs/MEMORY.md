# Project Memory

_Last updated: 2026-10-06_

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

`public/products/amber-touch.avif`

This project file is now the source of truth. Whenever the implementation needs the Amber Touch image, use this file. Do not regenerate the bottle from memory or an image prompt, and do not run another masking/reconstruction pipeline unless the owner explicitly approves a replacement.

## Current interaction strategy

The earlier 3D/GLB/WebGL experiments are retired for this homepage interaction.

The current solution is deliberately simple:

- normal DOM `<img>` bottle using `public/products/amber-touch.avif`;
- seven repeated instances;
- one continuous rail-position value rather than index + temporary drag offsets;
- requestAnimationFrame interpolation while the finger is down;
- velocity-aware release projection and spring settling to the nearest fragrance;
- seamless modulo wrapping so the rail does not teleport at 01/07 or 07/07;
- per-bottle spring lag and independent pendulum swing layered on top of the continuous rail;
- the bottle approaching center drops slightly from the rail, scales into focus and gains a soft gold aura;
- hanger length extends into center focus so the product reads as physically suspended rather than as a flat carousel card;
- smooth wheel/trackpad input followed by magnetic settling;
- the centered active bottle is visually staged rather than merely occupying a slider slot;
- selecting the centered bottle retracts/fades its hanger, lifts the bottle forward, and spreads/fades neighboring bottles;
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
- `public/products/amber-touch.avif` is the approved product asset.
- The old `Bottle.tsx` Three.js renderer is removed.
- The old asset-generation script is removed.
- The seven products remain data-driven through `lib/fragrances.ts`.

## Validation

The continuous rail foundation remains in `ec375be` / `c40694b`. The luxury hanging-gallery choreography is implemented in `f1c6d17` and styled in `24c153e`.

GitHub Actions passed TypeScript validation and the production build for the hanging-gallery implementation.

The production alias is live at:

`https://try-threejs-nu.vercel.app`

## Next step

Review the hanging-gallery build on the owner's iPhone. Tune the per-bottle lag, pendulum amplitude, center drop, hanger extension, aura strength and selection-detach choreography from live feedback without altering the approved bottle asset.
