# Decision Log

This document contains only confirmed project decisions. Do not treat open ideas as decisions.

## 2026-10-05

### D-001 — Project repository
Use `AM-naguib/Try-threejs` as the working GitHub repository.

### D-002 — Brand
The experience is for **WAVE Fragrances**.

### D-003 — Core discovery metaphor
Use a physical-feeling horizontal perfume rail / display as the main product-selection metaphor instead of a standard static product grid.

### D-004 — Product interaction
The centered perfume becomes the active product. A selected active bottle should be able to detach from the rail/display and animate toward the viewer before product information is revealed.

### D-005 — Multi-product architecture
The implementation must be data-driven and able to support multiple fragrances. Amber Touch is the initial reference product, not a hardcoded single-product limitation.

### D-006 — Mobile is first-class
Touch interaction and mobile performance must be considered from the beginning rather than added after desktop is complete.

### D-007 — Persistent project documentation
Agents must read the project documentation before edits and update memory/decisions/questions after meaningful changes.

### D-008 — Full homepage scope
Treat the project as the WAVE homepage, not only an isolated interactive section.

### D-009 — Seven fragrances
Version 1 is designed around **7 fragrances**.

### D-010 — Shared bottle geometry
All seven fragrances use the same bottle shape; product identity changes through label/artwork and catalog data.

### D-011 — True 3D
Use real 3D geometry/materials with professional glass, metal and reflection behavior. Do not make the final experience a flat image-only fake.

### D-012 — Selection progression
Start with the selected bottle moving toward the viewer while supporting a notes/detail reveal. Leave room to evolve selected products into richer dedicated visual worlds.

### D-013 — Navigation feel
Use free-feeling drag/swipe interaction with magnetic snapping to the nearest fragrance on release. Wheel/trackpad navigation should also work on desktop.

### D-014 — Existing visual identity
Continue the current WAVE black-and-gold visual language.

### D-015 — Product detail model
The catalog model should support name, inspiration, notes, price, size, quantity and reviews. Only render fields once the data is approved.

### D-016 — Commerce integration deferred
A connected Add to Cart / checkout flow is not required for the first implementation.

### D-017 — Technical stack
Use the technically appropriate stack for a polished result. Initial foundation: Next.js + React Three Fiber + Three.js + GSAP + TypeScript.

### D-018 — Original WAVE execution
Use the clothing-rail reference for interaction inspiration, not as a requirement to copy its visual composition. Make the WAVE execution original.

### D-019 — Desktop and mobile parity
Both desktop and mobile are important launch targets. Design and performance decisions must consider both.

### D-020 — Seven identical bottles for prototype testing
Until real catalog differences matter, render the same Amber Touch bottle seven times. This is a test-data decision and must not compromise the data-driven architecture.

### D-021 — Reference image is enough for prototype 3D
Do not block current 3D work on measured dimensions or an external GLB. Build and refine the procedural bottle directly from the supplied Amber Touch image; exact dimensions/assets can improve production fidelity later.

### D-022 — Persistent task ledger
Maintain `docs/TASKS.md` as the project execution checklist. Every completed task must be marked complete in the same work cycle.
