# Implementation Plan

_Last updated: 2026-10-05_

## Chosen foundation

- Next.js App Router
- React
- TypeScript in strict mode
- Normal DOM images
- CSS transforms and pointer/touch events

The current product rail intentionally does **not** use Three.js, React Three Fiber, WebGL, GLB models, shaders, or a runtime image-processing pipeline.

## Canonical Amber Touch asset

The owner approved one isolated bottle image as the visual source of truth:

`public/products/amber-touch-approved.webp`

Rules:

- render this file directly with a normal `<img>`;
- use the same file for all seven prototype bottles;
- do not regenerate the bottle from prompts or memory;
- do not crop, remask, sharpen, upscale, or rebuild the bottle at runtime;
- if the bottle artwork changes, replace the canonical project asset only after explicit owner approval.

## Interaction architecture

The visual product stays 2D; the physical feeling comes from transforms.

1. Seven Amber Touch instances sit across a horizontal rail.
2. Pointer/touch drag follows the user's finger.
3. Drag distance and velocity determine the snap destination.
4. Edge drag receives resistance.
5. Bottles tilt subtly from drag velocity.
6. Mouse wheel/trackpad changes the active product on desktop.
7. The centered bottle is active.
8. Clicking the active bottle scales/moves it forward while other bottles fade/recede.
9. Product UI stays data-driven so real fragrances can replace the repeated prototype later.

## Rendering

Each bottle is a standard DOM button containing the approved image.

The transform uses GPU-friendly CSS properties such as:

- `translate3d(...)`
- `scale(...)`
- `rotate(...)`
- opacity

No canvas texture sampling is involved, so the browser renders the product image using its normal image pipeline on Retina/mobile displays.

## Performance rules

- Reuse one browser-cached product asset for all seven instances.
- Do not add rendering engines unless the interaction actually needs them.
- Keep transforms GPU-friendly.
- Avoid unnecessary filters on moving bottles.
- Respect reduced-motion preferences.
- Test touch behavior and composition on physical mobile devices.

## Static hosting

Vercel is the active public preview target:

`https://try-threejs-nu.vercel.app`

## Execution tracking

The canonical implementation checklist is `docs/TASKS.md`. Mark tasks complete only after implementation and validation.
