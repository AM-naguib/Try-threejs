# WAVE Interactive Fragrance Homepage

A 3D, animation-led homepage for **WAVE Fragrances** built around a horizontal fragrance rail.

## Current prototype

- full homepage foundation, not an isolated demo
- seven Amber Touch test instances on the rail
- procedural true-3D bottle built from the supplied reference photo
- drag/swipe with magnetic snapping
- wheel/trackpad navigation
- active bottle detaches toward the camera
- current WAVE black + gold identity
- desktop and mobile treated as first-class targets

The repeated Amber Touch bottles are intentional prototype data. The underlying catalog remains data-driven for later replacement by the real seven fragrances.

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
5. `docs/TASKS.md`
6. `docs/IMPLEMENTATION.md`

After meaningful changes, update the task checklist and memory/decisions/questions in the same work cycle.

## Product reference

The supplied bottle reference is **WAVE Amber Touch — 60ml — Extrait De Parfum**.

Reference source:
`assets/reference/amber-touch-reference.webp.b64`

See `assets/reference/README.md` for decode instructions.

## Current status

The homepage scaffold, seven-bottle prototype data, first procedural 3D bottle model and baseline rail interactions are implemented. Remaining work is tracked explicitly in `docs/TASKS.md`.
