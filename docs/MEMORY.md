# Project Memory

_Last updated: 2026-10-05_

## Purpose

Build an interactive, premium product-discovery experience for **WAVE Fragrances** using a physical-feeling perfume selector rather than a conventional product grid.

## Confirmed context

- Brand: WAVE Fragrances.
- Repository: `AM-naguib/Try-threejs`.
- The brand owner supplied the perfume bottle reference for **Amber Touch**.
- Bottle label visible in the supplied reference:
  - WAVE
  - Amber Touch
  - 60ml
  - Extrait De Parfum
- Primary interaction direction:
  - perfume products arranged across a horizontal rail / display;
  - drag, mouse wheel, and touch move through products;
  - the bottle nearest the center becomes active;
  - selecting the active bottle should allow it to detach / move toward the viewer;
  - surrounding products can recede or dim;
  - fragrance details / notes appear as part of the reveal.
- The experience should be reusable for multiple products, not built as a one-off for Amber Touch.
- Mobile interaction and performance are mandatory concerns.

## Workflow rule

Every agent must read `AGENTS.md`, this file, `docs/DECISIONS.md`, and `docs/QUESTIONS.md` before implementation. After every meaningful change, update project memory and decisions/questions in the same work cycle.

## Current repository state

- Repository was empty when work started.
- Project documentation has been initialized.
- Implementation stack and final visual behavior are not yet confirmed.
- Bottle reference image is being added to `assets/reference/`.

## Next step

Resolve the initial product/design/technical questions in `docs/QUESTIONS.md`, then scaffold the first interactive prototype around the confirmed choices.
