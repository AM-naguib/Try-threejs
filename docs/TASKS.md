# Project Tasks

_Last updated: 2026-10-05_

This file is the execution checklist for the WAVE homepage. Every agent must read it before working, keep it current, and mark work complete immediately after it is actually finished.

Status:
- `[x]` complete
- `[ ]` pending
- `[~]` in progress / partially complete

## Foundation

- [x] **T-001 — Project operating docs**: create agent rules, memory, decisions and questions files.
- [x] **T-002 — Frontend foundation**: scaffold Next.js + React + TypeScript + React Three Fiber + Three.js + GSAP.
- [x] **T-003 — CI validation**: GitHub Actions installs dependencies, typechecks and production-builds successfully.
- [x] **T-004 — Full-homepage direction**: treat the rail experience as the homepage foundation, not a detached demo.

## Prototype catalog

- [x] **T-005 — Seven test products**: use seven instances of the same Amber Touch bottle for the interaction prototype.
- [x] **T-006 — Shared data model**: keep the seven instances data-driven so real fragrance data can replace them later without rebuilding the scene.

## 3D bottle

- [x] **T-007 — Bottle model v1 from reference image**: create the bottle procedurally from the supplied Amber Touch photo instead of waiting for CAD/GLB/dimensions.
- [x] **T-008 — Reference-style materials**: glass body, dark liquid, black sculpted cap, gold collar/top and black/gold front label.
- [x] **T-009 — Procedural Amber Touch label**: create a recognizable WAVE / Amber Touch test label inside the 3D scene without inventing alternate product identities.
- [ ] **T-010 — Bottle fidelity pass**: refine silhouette, glass edges, cap waves, refraction/highlights and proportions while comparing against the supplied photo.
- [ ] **T-011 — Production 3D optimization**: profile geometry/material cost and consolidate/reuse resources for seven bottles.

## Rail interaction

- [x] **T-012 — Horizontal rail baseline**: render seven bottles across the rail.
- [x] **T-013 — Pointer/touch drag**: allow dragging/swiping through the collection.
- [x] **T-014 — Magnetic snap baseline**: release onto the nearest fragrance.
- [x] **T-015 — Wheel/trackpad navigation**: move through fragrances on desktop.
- [x] **T-016 — Active bottle state**: center bottle is visually active.
- [x] **T-017 — Selection baseline**: clicking the active bottle moves it toward the camera and pushes the others back.
- [ ] **T-018 — Premium rail physics**: add better inertia, velocity response, overscroll resistance and physically convincing snap.
- [ ] **T-019 — Bottle secondary motion**: subtle swing/settle response while dragging and snapping.
- [ ] **T-020 — Cinematic selection transition**: improve camera/product choreography beyond the current baseline.
- [ ] **T-021 — Detail/notes reveal system**: build the animated reveal architecture without requiring real notes yet.

## Art direction

- [x] **T-022 — Black + gold base identity**: keep the current WAVE visual language.
- [ ] **T-023 — Lighting/reflection pass**: create a richer luxury studio-lighting setup for realistic glass/gold.
- [ ] **T-024 — Background motion system**: subtle scene response tied to active fragrance/drag position.
- [ ] **T-025 — Typography/UI polish**: replace prototype UI treatment with final premium hierarchy and transitions.

## Homepage

- [x] **T-026 — Hero/collection foundation**: interactive rail occupies the main homepage hero.
- [ ] **T-027 — Homepage section architecture**: design the sections below the rail while keeping them consistent with the cinematic interaction.
- [ ] **T-028 — Navigation transitions**: make header/navigation feel integrated with the 3D experience.
- [ ] **T-029 — Footer/content completion**: finalize once approved content exists.

## Quality

- [x] **T-030 — Desktop + mobile baseline**: responsive shell, touch support and capped DPR are present.
- [ ] **T-031 — Mobile interaction tuning**: tune gestures, spacing, camera and GPU cost on phone-sized viewports.
- [ ] **T-032 — Desktop polish**: tune large-screen composition and trackpad/mouse behavior.
- [ ] **T-033 — Reduced-motion pass**: verify the complete experience, not only current bottle transitions.
- [ ] **T-034 — Performance budget**: profile FPS, memory, draw calls and initial load once the visual pass stabilizes.
- [ ] **T-035 — Final regression/CI pass**: clean typecheck/build plus interaction regression before any release.

## Working rule

When a task is completed, change its checkbox to `[x]` in the same work cycle. If work is only partial, use `[~]` and state what remains. Never mark a task complete based on intent alone.
