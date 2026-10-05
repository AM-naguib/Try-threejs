# AGENTS.md — WAVE Interactive Perfume Experience

This file is mandatory reading for every coding/design agent working in this repository.

## Before making any change

1. Read `README.md`.
2. Read `docs/MEMORY.md`.
3. Read `docs/DECISIONS.md`.
4. Read `docs/QUESTIONS.md`.
5. Read `docs/TASKS.md` and identify the task(s) being worked on.
6. Inspect the current repository state before editing.
7. Do not silently override a confirmed decision. If a change conflicts with `docs/DECISIONS.md`, flag it first.

## During implementation

- Preserve the premium WAVE brand feel.
- Treat animation and product discovery as part of the shopping UX, not decoration.
- Mobile performance and touch interaction are first-class requirements.
- Prefer a maintainable product-data-driven architecture rather than hardcoding a single fragrance architecture.
- The current seven identical Amber Touch bottles are a prototype/testing decision only; keep replacement with real products straightforward.
- Keep visual/interaction logic modular so assets, bottle models, copy and products can be swapped later.
- Avoid introducing dependencies without a clear reason.
- Do not fabricate product facts, prices, notes or brand copy that the owner has not confirmed.
- The supplied Amber Touch front image is the current visual authority. Do not infer unseen depth, side geometry, or hidden surfaces from a front-only reference. Until measured side/depth data or an artist-made model exists, the runtime bottle must use the exact supplied front reference as a cropped/chroma-keyed 2.5D plane.

## Mandatory documentation update after every meaningful change

After each meaningful implementation or product decision:
- update `docs/TASKS.md`: mark completed tasks `[x]`, partial tasks `[~]`, and add newly discovered work;
- update `docs/MEMORY.md` with the current state, what changed and the next step;
- append newly confirmed choices to `docs/DECISIONS.md`;
- update `docs/QUESTIONS.md` when blockers change;
- use clear commit messages.

Documentation updates are part of the change, not optional cleanup.

## Current product direction

The experience is a full WAVE homepage built around an interactive perfume selector inspired by products hanging / arranged on a horizontal rail. Navigation should feel physical and premium. The active perfume comes to the center, and a selection detaches toward the camera before revealing fragrance information.

## Reference bottle

The supplied reference is WAVE **Amber Touch**, 60ml, Extrait De Parfum. A reference image is stored under `assets/reference/`. For the current interaction prototype, render the same exact front-reference bottle seven times. True 3D returns only after non-guessed depth/side information is available.
