# WAVE Interactive Fragrance Homepage

A 3D, animation-led homepage for **WAVE Fragrances** built around a horizontal fragrance rail.

## Current prototype

- seven Amber Touch test bottles
- generated GLB bottle asset built from the supplied reference photo
- real supplied label artwork mapped onto the GLB front label mesh
- shared GLB geometry/materials for the repeated test bottles
- drag/swipe with velocity-aware magnetic snapping
- edge resistance and secondary bottle swing
- wheel/trackpad navigation
- cinematic selected-bottle + camera transition
- studio-style glass/gold lighting
- black + gold WAVE art direction
- desktop and mobile responsive baseline
- static export ready for public hosting

The repeated Amber Touch bottles are intentional prototype data. The underlying catalog remains data-driven for later replacement by the real seven fragrances.

## Stack

- Next.js 16
- React 19
- TypeScript
- React Three Fiber / Three.js
- Drei
- GSAP

## Local start

```bash
npm install
npm run dev
```

Validate:

```bash
npm run typecheck
npm run build
```

## Project documentation

Before changing the implementation, read in this order:

1. `AGENTS.md`
2. `docs/MEMORY.md`
3. `docs/DECISIONS.md`
4. `docs/QUESTIONS.md`
5. `docs/TASKS.md`
6. `docs/IMPLEMENTATION.md`

After meaningful changes, update the task checklist and memory/decisions/questions in the same work cycle.

## Product reference

The supplied bottle reference is **WAVE Amber Touch — 60ml — Extrait De Parfum**.

Reference source:
`assets/reference/amber-touch-reference.webp.b64`

See `assets/reference/README.md` for decode instructions.

## Current status

Commit `516d763` is the current validated GLB bottle build and passes install, TypeScript and production build in GitHub Actions. Live prototype: `https://try-threejs-nu.vercel.app`.
