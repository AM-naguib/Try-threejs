# WAVE Interactive Fragrance Homepage

A 3D, animation-led homepage for **WAVE Fragrances** built around a horizontal fragrance rail.

## Direction

- full homepage foundation, not an isolated demo
- seven-fragrance data model
- true 3D bottle geometry
- drag/swipe with magnetic snapping
- wheel/trackpad navigation
- active bottle detaches toward the camera
- current WAVE black + gold identity
- desktop and mobile treated as first-class targets

## Stack

- Next.js 16
- React 19
- TypeScript
- React Three Fiber / Three.js
- Drei
- GSAP

## Start

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
5. `docs/IMPLEMENTATION.md`

After meaningful changes, update memory/decisions/questions in the same work cycle.

## Product reference

The initial supplied bottle reference is **WAVE Amber Touch — 60ml — Extrait De Parfum**.

Reference source:
`assets/reference/amber-touch-reference.webp.b64`

See `assets/reference/README.md` for decode instructions.

## Current status

The first homepage scaffold and procedural 3D rail are implemented. The bottle geometry is deliberately replaceable with an exact optimized GLB later. The missing six fragrance names, labels and catalog data are tracked in `docs/QUESTIONS.md`.
