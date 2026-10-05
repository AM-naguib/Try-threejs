# Project Tasks

_Last updated: 2026-10-05_

This file is the execution checklist for the WAVE homepage. Every agent must read it before working, keep it current, and mark work complete immediately after it is actually finished.

Latest validated prototype: commit `9aa99be` — GitHub Actions CI run #12 passed install, TypeScript and production build.

Status:
- `[x]` complete
- `[ ]` pending
- `[~]` in progress / partially complete

## Foundation

- [x] **T-001 — Project operating docs**: create agent rules, memory, decisions and questions files.
- [x] **T-002 — Frontend foundation**: scaffold Next.js + React + TypeScript + React Three Fiber + Three.js + GSAP.
- [x] **T-003 — CI validation**: GitHub Actions installs dependencies, typechecks and production-builds successfully. Latest validated code commit: `9aa99be`.
- [x] **T-004 — Full-homepage direction**: treat the rail experience as the homepage foundation, not a detached demo.

## Prototype catalog

- [x] **T-005 — Seven test products**: use seven instances of the same Amber Touch bottle for the interaction prototype.
- [x] **T-006 — Shared data model**: keep the seven instances data-driven so real fragrance data can replace them later without rebuilding the scene.

## 3D bottle

- [x] **T-007 — Bottle model v1 from reference image**: create the bottle procedurally from the supplied Amber Touch photo instead of waiting for CAD/GLB/dimensions.
- [x] **T-008 — Reference-style materials**: glass body, dark liquid, black sculpted cap, gold collar/top and black/gold front label.
- [x] **T-009 — Procedural Amber Touch label**: create a recognizable WAVE / Amber Touch test label inside the 3D scene without inventing alternate product identities.
- [x] **T-010 — Bottle fidelity pass**: refine silhouette, glass edges, cap waves, refraction/highlights and proportions against the supplied photo. Revalidated with the corrective pass in `9aa99be`.
- [~] **T-011 — Production 3D optimization**: shared geometry/materials and cached label textures are implemented; final GPU/draw-call profiling remains.

## Rail interaction

- [x] **T-012 — Horizontal rail baseline**: render seven bottles across the rail.
- [x] **T-013 — Pointer/touch drag**: allow dragging/swiping through the collection.
- [x] **T-014 — Magnetic snap baseline**: release onto the nearest fragrance.
- [x] **T-015 — Wheel/trackpad navigation**: move through fragrances on desktop.
- [x] **T-016 — Active bottle state**: center bottle is visually active.
- [x] **T-017 — Selection baseline**: clicking the active bottle moves it toward the camera and pushes the others back.
- [x] **T-018 — Premium rail physics**: velocity projection, overscroll resistance, inertia-aware snapping and faster wheel cadence.
- [x] **T-019 — Bottle secondary motion**: bottles subtly swing/twist in response to drag velocity and settle after release.
- [x] **T-020 — Cinematic selection transition**: camera moves in, hero copy recedes, vignette increases and the selected bottle advances.
- [x] **T-021 — Detail/notes reveal system**: selected-product reveal architecture is wired to render approved inspiration/notes when data exists.

## Art direction

- [x] **T-022 — Black + gold base identity**: keep the current WAVE visual language.
- [x] **T-023 — Lighting/reflection pass**: studio-style environment lightformers plus warm/cool key lights for glass and gold.
- [x] **T-024 — Background motion system**: background glow shifts with rail position and interaction energy.
- [~] **T-025 — Typography/UI polish**: transitions, selected states, safe-area behavior and premium card styling improved; final brand typography remains open.

## Homepage

- [x] **T-026 — Hero/collection foundation**: interactive rail occupies the main homepage hero.
- [ ] **T-027 — Homepage section architecture**: design the sections below the rail while keeping them consistent with the cinematic interaction.
- [ ] **T-028 — Navigation transitions**: make header/navigation feel integrated with the 3D experience.
- [ ] **T-029 — Footer/content completion**: finalize once approved content exists.

## Quality

- [x] **T-030 — Desktop + mobile baseline**: responsive shell, touch support and capped DPR are present.
- [~] **T-031 — Mobile interaction tuning**: safe-area spacing, reduced DPR and gesture resistance are improved; physical device performance pass remains.
- [~] **T-032 — Desktop polish**: camera, wheel cadence and selection composition improved; visual QA on multiple large viewports remains.
- [ ] **T-033 — Reduced-motion pass**: verify the complete experience, including camera/background behavior.
- [ ] **T-034 — Performance budget**: profile FPS, memory, draw calls and initial load once the visual pass stabilizes.
- [ ] **T-035 — Final regression/CI pass**: clean typecheck/build plus interaction regression before any release.
- [x] **T-036 — Public live preview**: Vercel production deployment is READY and mapped to `https://try-threejs-nu.vercel.app`.

- [x] **T-037 — Reference-driven bottle silhouette correction**: redraw the body proportions, widen/facet the shoulders, enlarge the label area, correct neck proportions and replace stacked cap bands with one continuous lathed ripple profile based on the supplied front photo.

## Working rule

When a task is completed, change its checkbox to `[x]` in the same work cycle. If work is only partial, use `[~]` and state what remains. Never mark a task complete based on intent alone.
