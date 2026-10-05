# Implementation Plan

_Last updated: 2026-10-05_

## Chosen foundation

- Next.js App Router
- React
- React Three Fiber
- Three.js
- Drei helpers where useful
- GSAP for controlled transitions
- TypeScript in strict mode

## Experience architecture

The homepage is not a standalone demo widget. The 3D rail is the primary hero/product-discovery system and the rest of the homepage is structured around it.

### Version 1 interaction

1. Seven bottles live on a horizontal rail.
2. Drag/swipe follows the user's movement.
3. Releasing magnetically snaps to the nearest fragrance.
4. Mouse wheel/trackpad moves between fragrances.
5. The centered bottle is active.
6. Clicking the active bottle detaches it toward the camera.
7. Other bottles recede.
8. The detail UI uses only approved catalog data.

### 3D strategy

The first implementation uses real Three.js geometry and PBR-style materials rather than flat bottle cutouts. The current bottle is a procedural approximation of the supplied Amber Touch reference. It is modular so it can later be replaced by an exact optimized GLB without rewriting the selector.

For final production fidelity we still need accurate bottle dimensions and label artwork, or an approved final GLB.

## Performance rules

- Cap device pixel ratio.
- Avoid post-processing until profiling proves it is safe.
- Reuse geometry/material patterns where possible.
- No remote HDR/environment dependency in the base experience.
- Respect reduced-motion preferences.
- Desktop and mobile both matter.

## Catalog rules

There are seven fragrance slots. Only Amber Touch is populated with confirmed product data today. Unknown products remain null/placeholder internally instead of inventing names, notes, prices or claims.
