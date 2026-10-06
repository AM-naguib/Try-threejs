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

### D-023 — Front product photo is the bottle-shape authority
When the procedural bottle disagrees with the supplied Amber Touch front photo, prioritize the photo's visible proportions: broad/faceted shoulders, tapered body/foot, larger front label coverage, neck ratio and the continuous rippled black cap silhouette. Prototype geometry should be corrected against that reference before decorative polish.

### D-024 — Bottle must be a GLB project asset
The bottle should no longer be modeled inline inside the React component. Generate and serve it as `public/models/amber-touch.glb`, load it with `useGLTF`, and reuse that asset for all seven prototype instances. Use the real supplied product photo for the label texture mapping instead of redrawing the label in Canvas.


### D-025 — No inferred 3D from a front-only reference
The owner explicitly requires no guessing. A single front photograph cannot determine bottle depth, side surfaces, hidden glass geometry or physically correct liquid volume. Therefore the current prototype must use the exact supplied front photograph as the bottle's visual asset, cropped and white-background-keyed at runtime. Keep interaction in 3D space, but keep the bottle itself nearly front-facing. Resume a true GLB only when measured dimensions, side/top/back references, CAD, scan or an approved artist-made model exists.

### D-026 — Front-reference fidelity overrides previous prototype GLB
D-025 supersedes the prototype implementation parts of D-011, D-021 and D-024 where they would force inferred geometry. The final product can still use true 3D, but the current implementation must not manufacture unseen geometry simply to satisfy a format preference.


### D-027 — Transparent bottle asset is generated offline
The interactive prototype should use a preprocessed transparent WebP derived from the supplied front product photo. White-background removal, edge feathering and white-matte decontamination happen in the build asset step with Sharp. Runtime Three.js uses a normal transparent texture; do not use a chroma-key shader for the bottle.


### D-028 — Use a continuous silhouette mask for the bottle cutout
Do not remove the white background by color connectivity through the bottle image. Transparent glass and bright reflections can connect visually to the studio background and create striped/fragmented alpha on mobile. Use one traced outer silhouette mask and preserve all photographic pixels inside it. Output PNG for predictable alpha in the current iOS/WebGL target.


### D-029 — Approved Amber Touch asset is canonical
The owner approved the isolated Amber Touch image now stored at `public/products/amber-touch.avif`. This file is the source of truth for the current product visual. Agents must reuse the project asset rather than regenerate or reinterpret the bottle from memory.

### D-030 — Current rail uses DOM images, not 3D
For the current homepage interaction, true 3D is unnecessary. Render the approved bottle as a normal DOM image and create the physical feel with drag/swipe, velocity-aware snapping, CSS translate/scale/rotate, opacity and selected-state choreography. This decision supersedes the current-use portions of D-011, D-017, D-021, D-024, D-025, D-027 and D-028 that required Three.js/WebGL/GLB or asset-generation work for the rail.


### D-031 — Rail motion is continuous, not index-reset animation
The rail must behave like one physical strip. Keep one continuous position value across all seven products. During touch drag, the rendered position follows the pointer through requestAnimationFrame interpolation. On release, velocity projects the destination and a damped spring settles to the nearest fragrance. Seamless wrapping is computed from that continuous position. Do not reset a drag offset to zero and use CSS transform transitions to hide the jump.

### D-032 — Normal drag choreography stays restrained
During normal rail movement, bottles should not independently scale, fade or move vertically based on distance. Those simultaneous effects made the interaction feel nervous. Keep horizontal travel dominant, with at most a small shared velocity-driven swing. Richer scale/opacity choreography is reserved for deliberate product selection, not browsing.


## 2026-10-06

### D-033 — Browsing should read as a hanging gallery, not a slider
The owner rejected a merely smooth carousel/slider feel. Keep the continuous RAF rail from D-031, but layer deliberate hanging-object choreography on top: restrained per-bottle lag, independent pendulum swing, center-focused drop/scale, hanger extension and a subtle gold aura. The goal is to preserve smooth input while making the rail feel physically staged and cinematic.

### D-034 — D-032 is superseded by controlled secondary choreography
D-032 correctly identified that multiple uncontrolled transforms made the earlier interaction nervous, but its “shared swing only” restriction is now too conservative. Per-bottle animation is allowed when it is spring-driven, bounded and tied to the hanging-gallery metaphor. Horizontal rail position remains continuous and authoritative.

### D-035 — Selection visually detaches the bottle from the rail
Selecting the centered fragrance should look like removing a suspended object from display: the hanger retracts/fades, the bottle moves upward/forward with spring motion, and neighboring bottles spread and dim. This is still implemented with DOM/CSS transforms and the approved flat product asset; no inferred 3D geometry is required.


### D-036 — Motion language is a traveling WAVE
The owner wants the interaction to feel memorable rather than like a conventional premium carousel. Horizontal rail position remains continuous, but user input now injects wave energy that propagates across the suspended bottles with phase offsets. The WAVE brand name should be expressed through the interaction itself, not through decorative effects alone.

### D-037 — Vertical motion comes from hanger travel, not card translation
To preserve the physical hanging metaphor, normal wave movement should keep each bottle's rail anchor fixed and vary hanger length to move the bottle vertically. Avoid moving the entire bottle button up/down as a slider card. Selection may still detach the product visually from the hanger.


### D-038 — Avoid conventional carousel affordances
The hero interaction should not visually read as a standard product slider. Remove conventional pagination dots from the primary rail UI. Keep product count in the information card, but let motion identity come from the WAVE behavior itself: traveling vertical propagation, hanger travel, recoil and reactive light.
