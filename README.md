# WAVE Interactive Fragrance Homepage

A premium, animation-led homepage for **WAVE Fragrances** built around a horizontal fragrance rail.

## Current prototype

- seven repeated Amber Touch test bottles
- owner-approved isolated product asset stored in the repository
- DOM/CSS interactive rail instead of WebGL
- drag/swipe with velocity-aware magnetic snapping
- edge resistance and subtle bottle swing
- wheel/trackpad navigation
- active centered product
- selected bottle moves/scales forward while the others recede
- black + gold WAVE art direction
- desktop and mobile responsive baseline

## Canonical product asset

Use this exact file whenever Amber Touch is rendered:

`public/products/amber-touch-approved.webp`

Do not regenerate the bottle from prompts or memory unless the owner explicitly approves a replacement.

## Stack

- Next.js 16
- React 19
- TypeScript
- DOM/CSS transforms

The current rail does not require Three.js, React Three Fiber, shaders, GLB generation or runtime image processing.

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

## Live preview

https://try-threejs-nu.vercel.app
