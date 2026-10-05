# Implementation Plan

_Last updated: 2026-10-05_

## Chosen foundation

- Next.js App Router
- React
- React Three Fiber
- Three.js
- Drei environment/model helpers
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

### 3D asset strategy

The Amber Touch bottle is now a **real GLB project asset**, not inline procedural JSX geometry.

`scripts/prepare-assets.mjs` runs automatically before dev/build and:
- decodes the supplied reference into `public/reference/amber-touch.webp`;
- generates `public/models/amber-touch.glb`;
- builds the GLB from a photo-measured lofted rounded-rectangular bottle body, inner liquid, gold neck/collars, continuous lathed rippled black cap and gold top hardware;
- stores a dedicated `Label_Front` trapezoid with resolution-independent UVs measured from the latest 1536×1536 reference, covering the same near-full-height label area visible in the real bottle.

`Bottle.tsx` loads the GLB with `useGLTF`, clones the same model for all seven products, reapplies web-friendly physical glass/liquid/gold materials, and maps the real supplied reference image onto `Label_Front`.

GLB v2 keeps one global reference-to-model scale for body, neck and cap proportions; only bottle depth is inferred because no side reference exists. This is the format expected by the Three.js project and remains replaceable by a later artist-made GLB.

### Lighting

The scene uses a small local environment map generated with Drei lightformers plus direct warm/cool lights. No remote HDR asset is required.

## Performance rules

- Cap DPR.
- Reuse the same GLB geometry across the seven clones.
- Reuse common material instances where possible.
- Avoid post-processing until profiling supports it.
- Keep environment resolution modest.
- Respect reduced-motion preferences.
- Profile seven transmissive bottles before adding additional expensive effects.

## Static hosting

`next.config.ts` uses static export. Vercel is the active public preview target.

## Execution tracking

The canonical implementation checklist is `docs/TASKS.md`. Mark tasks complete as they are actually finished.
