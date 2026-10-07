# Project Memory

_Last updated: 2026-10-07_

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
- Elastic Arc Gallery motion layered on top of the continuous rail;
- bottles follow a shallow suspended arc: the center hangs lower while side bottles sit higher, producing a display-arc rather than a flat slider line;
- a soft magnetic field pulls the nearest bottle toward center during drag without removing free movement;
- per-bottle spring response is direction-aware, so motion propagates through neighboring bottles with domino-like follow-through instead of moving the row as one rigid strip;
- horizontal lag, hanger depth and pendulum angle use different spring timings to create elastic recoil on direction changes;
- center scale is intentionally restrained while side bottles remain more visible, reducing conventional carousel cues;
- smooth wheel/trackpad input followed by magnetic settling;\n- when completely idle, bottles keep a very slow asynchronous micro-sway: sub-degree rotation, tiny horizontal drift, 1–3px hanger breathing and a barely perceptible scale/aura pulse; the idle layer fades out immediately when drag/wheel/selection motion begins and respects reduced-motion preferences;
- selecting the centered bottle retracts/fades its hanger, lifts the bottle forward, and spreads/fades neighboring bottles;
- conventional carousel pagination dots remain removed; the UI now identifies the interaction as ELASTIC ARC rather than a slider control;\n- the background gold glow shifts subtly with rail velocity/interaction energy;\n- CSS/DOM presentation instead of canvas rendering.

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

The continuous rail foundation remains in `ec375be` / `c40694b`. The Elastic Arc motion engine is implemented in `74e3569` with CSS/UI integration in `05c6194`. Ambient idle motion is implemented in `b1d462b` with light breathing in `c637013`.\n\nTypeScript validation and the production build passed for the idle-motion implementation.

The production alias is live at:

`https://try-threejs-nu.vercel.app`

## Next step

Review the Elastic Arc idle state on the owner's iPhone. Tune idle sway amplitude, hanger breathing and idle fade timing only if the resting motion is too still or too noticeable.
