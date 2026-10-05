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

### Prototype interaction

1. Seven Amber Touch test instances live on a horizontal rail.
2. Drag/swipe follows the user's movement.
3. Releasing magnetically snaps to the nearest bottle.
4. Mouse wheel/trackpad moves between bottles.
5. The centered bottle is active.
6. Clicking the active bottle detaches it toward the camera.
7. Other bottles recede.
8. Detail UI stays data-driven so real products can replace test instances later.

### 3D strategy

The bottle is created procedurally in Three.js from the supplied Amber Touch reference image. Current model layers include:
- beveled/extruded glass silhouette based on the photographed proportions;
- inset dark liquid volume;
- metallic gold neck/collar;
- stacked black cap bands to approximate the sculpted/wavy cap;
- gold top hardware;
- generated black/gold Amber Touch label texture.

Exact dimensions, CAD or a production GLB are **not blockers for the current prototype**. Continue visual comparison and refinement against the supplied photo. If production assets become available later, the model remains modular enough to replace the procedural geometry without rebuilding the rail.

## Performance rules

- Cap device pixel ratio.
- Avoid post-processing until profiling proves it is safe.
- Reuse geometry/material patterns where possible.
- No remote HDR/environment dependency in the base experience.
- Respect reduced-motion preferences.
- Desktop and mobile both matter.
- Profile the cost of seven transmissive glass bottles before adding expensive visual effects.

## Catalog rules

For the current interaction prototype, all seven data entries intentionally represent Amber Touch. IDs remain unique and the catalog remains data-driven. Replace test entries with real product data later without changing the selector architecture.

## Execution tracking

The canonical implementation checklist is `docs/TASKS.md`. Mark tasks complete as they are actually finished.
