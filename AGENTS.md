# AGENTS.md — WAVE Interactive Perfume Experience

This file is mandatory reading for every coding/design agent working in this repository.

## Before making any change

1. Read `README.md`.
2. Read `docs/MEMORY.md`.
3. Read `docs/DECISIONS.md`.
4. Read `docs/QUESTIONS.md`.
5. Inspect the current repository state before editing.
6. Do not silently override a confirmed decision. If a change conflicts with `docs/DECISIONS.md`, flag it first.

## During implementation

- Preserve the premium WAVE brand feel.
- Treat animation and product discovery as part of the shopping UX, not decoration.
- Mobile performance and touch interaction are first-class requirements.
- Prefer a maintainable product-data-driven architecture rather than hardcoding a single fragrance.
- Keep visual/interaction logic modular so assets, bottle models, copy, and products can be swapped later.
- Avoid introducing dependencies without a clear reason.
- Do not fabricate product facts, prices, notes, or brand copy that the owner has not confirmed.

## Mandatory documentation update after every meaningful change

After each meaningful implementation or product decision:
- update `docs/MEMORY.md` with the current state, what changed, and the next step;
- append any newly confirmed choices to `docs/DECISIONS.md`;
- update `docs/QUESTIONS.md` by removing answered questions and adding new blockers;
- use clear commit messages.

Documentation updates are part of the change, not optional cleanup.

## Current product direction

The experience is an interactive perfume selector inspired by products hanging / arranged on a horizontal rail. Navigation should feel physical and premium. The active perfume comes to the center, and a selection can detach toward the camera before revealing fragrance information.

## Reference bottle

The supplied reference is WAVE **Amber Touch**, 60ml, Extrait De Parfum. A reference image is stored under `assets/reference/`.
