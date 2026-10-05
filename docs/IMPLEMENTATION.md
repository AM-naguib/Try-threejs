# Implementation Plan

_Last updated: 2026-10-05_

## Chosen foundation

- Next.js App Router
- React
- React Three Fiber
- Three.js
- Drei environment helpers
- GSAP for controlled transitions
- TypeScript in strict mode

## Experience architecture

The 3D rail is the primary homepage hero/product-discovery system rather than an isolated demo widget.

### Current interaction

1. Seven Amber Touch test instances live on a horizontal rail.
2. Drag/swipe follows pointer movement.
3. Release uses drag distance plus velocity projection to pick the snap destination.
4. Edge overscroll is damped.
5. Bottles swing/twist subtly while the rail is moving.
6. Mouse wheel/trackpad advances through bottles on desktop.
7. The centered bottle is active.
8. Clicking the active bottle moves it toward camera; camera position also pushes in.
9. Other bottles recede and scene/UI emphasis shifts to the selection.
10. Detail UI can reveal real notes/inspiration when those fields are later populated.

### 3D strategy

The bottle is built procedurally in Three.js from the supplied Amber Touch reference image:
- refined beveled/extruded glass silhouette;
- inset dark liquid volume;
- thicker glass foot/base;
- metallic gold neck/collar and top hardware;
- stacked black cap bands approximating the photographed sculpted cap;
- generated black/gold Amber Touch label texture.

Shared bottle geometry and core materials are reused across all seven bottles. The label texture is cached by product name.

### Lighting

The scene uses a small local environment map generated with Drei lightformers plus direct warm/cool lights. No remote HDR asset is required.

## Performance rules

- Cap DPR.
- Reuse geometry/materials.
- Cache repeated label textures.
- Avoid post-processing until profiling supports it.
- Keep environment resolution modest.
- Respect reduced-motion preferences.
- Profile seven transmissive bottles before adding additional expensive effects.

## Static hosting

`next.config.ts` enables static export. GitHub Pages workflow exists but is manual-only until repository Pages is explicitly enabled or another authorized host is connected.

## Execution tracking

The canonical implementation checklist is `docs/TASKS.md`. Mark tasks complete as they are actually finished.
