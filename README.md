# WAVE Interactive Fragrance Homepage

A premium, animation-led homepage for **WAVE Fragrances** built around a horizontal fragrance rail.

## Current prototype

- seven Amber Touch test bottles
- exact owner-supplied front bottle reference used directly in the experience
- no inferred bottle depth or hidden geometry
- 3D rail movement with a reference-locked 2.5D product plane
- drag/swipe with velocity-aware magnetic snapping
- edge resistance and secondary swing
- wheel/trackpad navigation
- cinematic selected-bottle + camera transition
- black + gold WAVE art direction
- desktop and mobile responsive baseline
- static export ready for public hosting

## Why the bottle is currently 2.5D

Only the straight-on bottle photograph is authoritative. Building a true GLB from that image alone requires inventing depth, side surfaces and hidden glass geometry. The owner explicitly requested no guessing, so the current bottle visual is the exact supplied photograph with the white background removed at render time.

A true 3D GLB returns when measured dimensions, side/top/back references, supplier CAD/model or a scan is available.

## Stack

- Next.js 16
- React 19
- TypeScript
- React Three Fiber / Three.js
- Drei
- GSAP

## Local start

npm install
npm run dev

Validate:

npm run typecheck
npm run build

## Project documentation

Before changing the implementation, read in this order:

1. AGENTS.md
2. docs/MEMORY.md
3. docs/DECISIONS.md
4. docs/QUESTIONS.md
5. docs/TASKS.md
6. docs/IMPLEMENTATION.md

## Product reference

The supplied bottle reference is **WAVE Amber Touch — 60ml — Extrait De Parfum**.

Reference source:
assets/reference/amber-touch-reference.webp.b64

The build decodes it to:
public/reference/amber-touch.webp

## Live preview

https://try-threejs-nu.vercel.app
