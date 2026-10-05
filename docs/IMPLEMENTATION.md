# Implementation Plan

_Last updated: 2026-10-05_

## Chosen foundation

- Next.js App Router
- React
- React Three Fiber
- Three.js
- Drei environment/texture helpers
- GSAP for controlled transitions
- TypeScript in strict mode

## Experience architecture

The 3D rail remains the primary homepage hero/product-discovery system. Bottle instances still move through 3D space, but the current bottle visual is intentionally **reference-locked 2.5D** so no unseen geometry is invented.

### Current interaction

1. Seven Amber Touch test instances live on a horizontal rail.
2. Drag/swipe follows pointer movement.
3. Release uses drag distance plus velocity projection to pick the snap destination.
4. Edge overscroll is damped.
5. Bottles swing subtly while the rail is moving.
6. Mouse wheel/trackpad advances through bottles on desktop.
7. The centered bottle is active.
8. Clicking the active bottle moves it toward camera; camera position also pushes in.
9. Other bottles recede and scene/UI emphasis shifts to the selection.
10. The bottle stays close to front-facing so the exact supplied photograph remains visually authoritative.

## No-guess asset strategy

The previous generated GLB pipeline has been removed because it inferred bottle depth and hidden geometry from a single front photo.

scripts/prepare-assets.mjs now only decodes the exact owner-supplied front reference into public/reference/amber-touch.webp.

Bottle.tsx loads that exact reference with useTexture and renders it on a 3D plane.

The shader:
- crops to the measured bottle bounds from the source image;
- keys only the white studio background;
- preserves the label region so white label text is not removed;
- un-mattes keyed pixels to avoid the white halo from the source background;
- does not redraw the label, cap, glass, gold or liquid;
- does not infer side/depth geometry.

This is the only implementation that can satisfy the owner's “no guessing” constraint from the currently available front-only data.

## True 3D re-entry condition

A production GLB is deferred until we have non-inferred depth/side information: measured dimensions, side/top/back reference views with scale, supplier CAD/model, or a scan.

## Lighting

The scene lighting remains for the environment/background and interaction mood. The reference-locked bottle plane is unlit/tone-mapping-disabled so the supplied product photography is not reinterpreted by synthetic PBR materials.

## Performance rules

- Cap DPR.
- Reuse the same front reference texture across all seven instances.
- Avoid unnecessary post-processing.
- Keep the bottle plane nearly front-facing.
- Respect reduced-motion preferences.
- Profile the full rail on mobile after visual approval.

## Static hosting

next.config.ts uses static export. Vercel is the active public preview target.

## Execution tracking

The canonical implementation checklist is docs/TASKS.md. Mark tasks complete as they are actually finished.
