# Project Tasks

_Last updated: 2026-10-07_

This file is the execution checklist for the WAVE homepage. Every agent must read it before working, keep it current, and mark work complete immediately after it is actually finished.

Latest validated motion implementation: `05c6194` — Elastic Arc Gallery with magnetic center, arc-path hanger depth and direction-aware domino follow-through; TypeScript and production build passed.

Status:
- `[x]` complete
- `[ ]` pending
- `[~]` in progress / partially complete

## Foundation

- [x] **T-001 — Project operating docs**: create agent rules, memory, decisions and questions files.
- [x] **T-002 — Frontend foundation**: scaffold Next.js + React + TypeScript + React Three Fiber + Three.js + GSAP.
- [x] **T-003 — CI validation**: GitHub Actions installs dependencies, typechecks and production-builds successfully. Current validated implementation commit: `18bd11d`.
- [x] **T-004 — Full-homepage direction**: treat the rail experience as the homepage foundation, not a detached demo.

## Prototype catalog

- [x] **T-005 — Seven test products**: use seven instances of the same Amber Touch bottle for the interaction prototype.
- [x] **T-006 — Shared data model**: keep the seven instances data-driven so real fragrance data can replace them later without rebuilding the scene.

## 3D bottle

- [x] **T-007 — Bottle model v1 from reference image**: create the bottle procedurally from the supplied Amber Touch photo instead of waiting for CAD/GLB/dimensions.
- [x] **T-008 — Reference-style materials**: glass body, dark liquid, black sculpted cap, gold collar/top and black/gold front label.
- [x] **T-009 — Procedural Amber Touch label**: create a recognizable WAVE / Amber Touch test label inside the 3D scene without inventing alternate product identities.
- [x] **T-010 — Bottle fidelity pass**: refine silhouette, glass edges, cap waves, refraction/highlights and proportions against the supplied photo. Revalidated with the corrective pass in `9aa99be`.
- [x] **T-011 — Historical 3D optimization work (superseded)**: no longer relevant to the current DOM-image rail.

- [x] **T-038 — Historical GLB pipeline (superseded by T-043)**: move the bottle out of `Bottle.tsx` procedural geometry and generate a true `public/models/amber-touch.glb` asset during dev/build. Load it with `useGLTF` and map the real supplied label area from the source product photo.

- [x] **T-039 — Historical pixel-traced GLB correction (superseded by T-043)**: replace hand-estimated bottle widths with measurements taken directly from the supplied 1536×1536 reference rows; correct label position/UV crop and trace the cap radius profile from the source image.\n- [x] **T-040 — Historical GLB v2 rebuild (superseded by T-043)**: redo the GLB again from the latest reference using one global image-to-model scale, measured shoulder/body taper, a smaller photo-matched cap profile, full-height label placement and surface-following label depth. Validated in `5a24672`.

- [x] **T-041 — Mobile screenshot correction**: fix the vertically inverted label texture, pull the mobile camera back so the bottle no longer fills the viewport, lower the rail slightly, and reduce hero-title overlap. Validated in `d39040f`.\n\n- [x] **T-042 — Screenshot-driven bottle material correction**: extend the dark liquid through the lower body, remove the oversized pale base effect, make the glass clearer, darken the liquid and brighten the gold hardware to better match the real bottle. Validated in `5532d12`.\n\n- [x] **T-043 — No-guess bottle renderer**: retire the inferred GLB runtime, remove GLB generation from asset preparation, render the exact supplied front bottle reference on a cropped/chroma-keyed 3D plane, preserve the label text, and constrain Y-rotation so no unseen side geometry is fabricated.
- [x] **T-044 — No-guess live QA baseline**: CI and Vercel production validation completed for the reference-locked renderer; screenshot review exposed runtime keying artifacts, leading to T-045.

- [x] **T-046 — Remove striped alpha artifact**: replace connectivity/flood-fill background removal with one continuous traced silhouette mask, output PNG instead of WebP for stable iOS alpha, and keep the photographic bottle intact inside the silhouette. Validated in `7091b46`, live on Vercel.\n\n- [x] **T-047 — Retina bottle sharpness pass**: render the WebGL canvas at DPR 2–3, disable texture mipmaps for the bottle, keep linear full-resolution sampling, raise anisotropy, and generate a 2× Lanczos/sharpened transparent PNG for high-density mobile displays. Validated in `55f548c`, live on Vercel.\n\n## Current product rendering

- [x] **T-048 — Approved canonical bottle asset**: store the owner-approved isolated Amber Touch product at `public/products/amber-touch.avif` and make it the project source of truth.
- [x] **T-049 — DOM product rendering**: remove the WebGL bottle renderer and render the canonical asset as a normal browser image.
- [x] **T-050 — Simple rail stack**: remove obsolete Three.js / React Three Fiber / Drei / Sharp dependencies and the asset-generation script; keep the current rail on React + DOM/CSS interaction.
- [x] **T-051 — Canonical-asset rule**: document that agents must reuse the repository asset rather than regenerate/reinterpret the bottle.
- [~] **T-052 — DOM rail live visual QA**: CI and production deployment are ready; owner-facing mobile/desktop visual approval of the new approved asset remains.

## Rail interaction

- [x] **T-012 — Horizontal rail baseline**: render seven bottles across the rail.
- [x] **T-013 — Pointer/touch drag**: allow dragging/swiping through the collection.
- [x] **T-014 — Magnetic snap baseline**: release onto the nearest fragrance.
- [x] **T-015 — Wheel/trackpad navigation**: move through fragrances on desktop.
- [x] **T-016 — Active bottle state**: center bottle is visually active.
- [x] **T-017 — Selection baseline**: clicking the active bottle moves it toward the camera and pushes the others back.
- [x] **T-018 — Continuous rail physics**: one continuous rail position, requestAnimationFrame finger-follow smoothing, velocity projection, spring/inertia settling and seamless wrapping without resetting drag offsets.
- [x] **T-019 — Hanging-bottle secondary motion**: each bottle now has restrained spring lag and pendulum swing while the continuous rail remains the motion source; centered-product focus is driven by proximity rather than slider-style slot transitions.
- [x] **T-020 — Cinematic selection transition**: the centered bottle first sits lower on an extended hanger, then detaches upward/forward on selection while its hanger fades/retracts, neighboring bottles spread/recede, hero copy recedes and vignette energy increases.
- [x] **T-021 — Detail/notes reveal system**: selected-product reveal architecture is wired to render approved inspiration/notes when data exists.

- [x] **T-053 — Continuous RAF rail rebuild**: replace per-pointer React drag state + index reset snapping with a ref-driven continuous position, RAF interpolation, spring settling and seamless modulo wrapping.\n- [x] **T-054 — Direct canonical image rendering**: remove the hidden WebP + CSS pseudo-element workaround and render `public/products/amber-touch.avif` directly in the DOM image.\n- [~] **T-055 — Motion feel QA**: validate finger-follow latency, release projection, spring damping, wheel behavior and bottle spacing on the owner's iPhone; tune constants from live feedback only.\n\n- [x] **T-056 — Luxury hanging-gallery choreography**: add per-bottle spring lag, independent pendulum swing, center drop/focus scaling, hanger extension and a compositor-friendly gold aura without reintroducing WebGL.\n- [x] **T-057 — Animated selection detach**: selected bottle retracts from the hanger and moves forward while the rest of the rail spreads and fades; reduced-motion users keep a simplified state.\n- [~] **T-058 — Hanging-gallery feel QA**: validate on the owner's iPhone that the new choreography feels cinematic rather than carousel-like; tune swing amplitude, lag, focus drop and selection detach from screenshot/video feedback.\n\n- [x] **T-059 — WAVE motion system**: convert the hanging gallery from a premium carousel feel into a brand-driven traveling wave. Rail velocity, flick release and direction reversal inject energy; phase propagates across bottles; each bottle gets spring-smoothed vertical motion through hanger length rather than card-like Y translation.\n- [x] **T-060 — Physical hanger anchoring**: keep each bottle button anchored to the rail while hanger length changes, so vertical motion reads as a suspended object rather than the whole card sliding up/down.\n- [~] **T-061 — WAVE motion live feel QA**: validate on the owner's iPhone that the wave reads clearly without becoming cartoonish; tune amplitude, phase speed, recoil strength and center-focus depth from live feedback.\n\n- [x] **T-062 — Remove carousel affordances**: remove the row of pagination dots from the primary interaction and replace it with a subtle WAVE motion signature so the experience no longer visually reads as a standard slider.\n- [x] **T-063 — Interaction-driven wave pulse**: make the wave strongest on active drag, flick release and direction reversal; calm the centered bottle slightly and let scene lighting respond to wave phase/energy.\n- [~] **T-064 — WAVE motion tuning pass**: validate on the owner's iPhone that propagation is obvious, premium and not cartoonish; tune amplitude, propagation rate and damping from live feedback.\n\n- [x] **T-065 — Elastic Arc Gallery**: replace the traveling-wave browse motion with an arc-path system. Bottles approach the center along a shallow suspended arc instead of a flat horizontal line.\n- [x] **T-066 — Magnetic center**: add a soft center attraction during drag plus stronger visual compression near the focus point, while preserving continuous free drag and release snapping.\n- [x] **T-067 — Domino follow-through**: make bottles respond with direction-aware spring stiffness/lag so motion propagates through the row instead of moving as one rigid slider strip.\n- [x] **T-068 — Reduce slider cues**: reduce center scale dominance, keep side bottles more visible, and replace WAVE-motion labeling with the Elastic Arc interaction state.\n- [~] **T-069 — Elastic Arc live QA**: validate arc depth, magnetic strength, follow-through delay and recoil on the owner's iPhone and tune from live feedback.\n\n## Art direction

- [x] **T-022 — Black + gold base identity**: keep the current WAVE visual language.
- [x] **T-023 — Historical 3D lighting/reflection pass (superseded)**: current approved product image carries its own photographed/rendered lighting.
- [x] **T-024 — Background motion system**: background glow shifts with rail position and interaction energy.
- [~] **T-025 — Typography/UI polish**: transitions, selected states, safe-area behavior and premium card styling improved; final brand typography remains open.

## Homepage

- [x] **T-026 — Hero/collection foundation**: interactive rail occupies the main homepage hero.
- [ ] **T-027 — Homepage section architecture**: design the sections below the rail while keeping them consistent with the cinematic interaction.
- [ ] **T-028 — Navigation transitions**: make header/navigation feel integrated with the 3D experience.
- [ ] **T-029 — Footer/content completion**: finalize once approved content exists.

## Quality

- [x] **T-030 — Desktop + mobile baseline**: responsive shell and touch support are present with normal browser image rendering.
- [~] **T-031 — Mobile interaction tuning**: rail motion engine rebuilt to avoid pointer-event jitter and CSS snap jumps; physical-device feel/parameter tuning remains.
- [~] **T-032 — Desktop polish**: camera, wheel cadence and selection composition improved; visual QA on multiple large viewports remains.
- [ ] **T-033 — Reduced-motion pass**: verify the complete experience, including camera/background behavior.
- [ ] **T-034 — Performance budget**: profile FPS, memory, draw calls and initial load once the visual pass stabilizes.
- [ ] **T-035 — Final regression/CI pass**: clean typecheck/build plus interaction regression before any release.
- [x] **T-036 — Public live preview**: Vercel production deployment is READY and mapped to `https://try-threejs-nu.vercel.app`.

- [x] **T-037 — Reference-driven bottle silhouette correction**: redraw the body proportions, widen/facet the shoulders, enlarge the label area, correct neck proportions and replace stacked cap bands with one continuous lathed ripple profile based on the supplied front photo.

## Working rule

When a task is completed, change its checkbox to `[x]` in the same work cycle. If work is only partial, use `[~]` and state what remains. Never mark a task complete based on intent alone.
