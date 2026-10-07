"use client";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  WheelEvent,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fragrances, productLabel } from "@/lib/fragrances";

const PRODUCT_ASSET = "/products/amber-touch.avif";
const PRODUCT_COUNT = fragrances.length;

type BottleMotion = {
  trailX: number;
  trailVelocity: number;
  arcY: number;
  arcVelocity: number;
  angle: number;
  angleVelocity: number;
  focus: number;
  focusVelocity: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const modulo = (value: number, size: number) =>
  ((value % size) + size) % size;

const wrappedDistance = (index: number, position: number) => {
  let distance = index - modulo(position, PRODUCT_COUNT);
  const half = PRODUCT_COUNT / 2;

  if (distance > half) distance -= PRODUCT_COUNT;
  if (distance < -half) distance += PRODUCT_COUNT;

  return distance;
};

const smoothstep = (value: number) => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};

const springStep = (
  value: number,
  velocity: number,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
) => {
  const acceleration = (target - value) * stiffness - velocity * damping;
  const nextVelocity = velocity + acceleration * dt;
  const nextValue = value + nextVelocity * dt;

  return [nextValue, nextVelocity] as const;
};

const applySoftMagnet = (position: number) => {
  const nearest = Math.round(position);
  const delta = position - nearest;
  const distance = Math.abs(delta);
  const strength = smoothstep(1 - distance / 0.34);

  return position - delta * strength * 0.24;
};

export function PerfumeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(390);

  const bottleRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const bottleMotionRef = useRef<Array<BottleMotion | undefined>>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const motionVelocityRef = useRef(0);
  const gestureVelocityRef = useRef(0);
  const draggingRef = useRef(false);
  const selectedIndexRef = useRef<number | null>(null);
  const selectionSubjectRef = useRef<number | null>(null);
  const selectionProgressRef = useRef(0);
  const selectionVelocityRef = useRef(0);
  const activeIndexRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const travelDirectionRef = useRef(1);
  const previousRailVelocityRef = useRef(0);
  const interactionEnergyRef = useRef(0);
  const idlePhaseRef = useRef(0);
  const idlePresenceRef = useRef(0);

  const pointerStartX = useRef(0);
  const pointerStartPosition = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const movedRef = useRef(false);

  const spacingRef = useRef(220);
  const wheelTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const spacing = useMemo(
    () => clamp(viewportWidth * 0.58, 215, 350),
    [viewportWidth],
  );

  const bottleWidth = useMemo(
    () => clamp(viewportWidth * 0.54, 205, 330),
    [viewportWidth],
  );

  useEffect(() => {
    spacingRef.current = spacing;
  }, [spacing]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;

    if (selectedIndex !== null) {
      selectionSubjectRef.current = selectedIndex;
    }
  }, [selectedIndex]);

  const activeFragrance = fragrances[selectedIndex ?? activeIndex];

  const renderRail = useCallback(
    (position: number, railVelocity: number, dt: number) => {
      const reducedMotion = reducedMotionRef.current;
      const selectionTarget = selectedIndexRef.current === null ? 0 : 1;

      if (reducedMotion) {
        selectionProgressRef.current = selectionTarget;
        selectionVelocityRef.current = 0;
      } else {
        const [progress, velocity] = springStep(
          selectionProgressRef.current,
          selectionVelocityRef.current,
          selectionTarget,
          72,
          16,
          dt,
        );
        selectionProgressRef.current = progress;
        selectionVelocityRef.current = velocity;
      }

      if (
        selectionTarget === 0 &&
        selectionProgressRef.current < 0.002 &&
        Math.abs(selectionVelocityRef.current) < 0.01
      ) {
        selectionProgressRef.current = 0;
        selectionVelocityRef.current = 0;
        selectionSubjectRef.current = null;
      }

      const selectionProgress = clamp(selectionProgressRef.current, 0, 1.12);
      const selectionSubject = selectionSubjectRef.current;
      const previousRailVelocity = previousRailVelocityRef.current;
      const speed = clamp(Math.abs(railVelocity), 0, 4.8);
      const speedNormalized = clamp(speed / 3.2, 0, 1);

      if (Math.abs(railVelocity) > 0.035) {
        travelDirectionRef.current =
          Math.sign(railVelocity) || travelDirectionRef.current;
      }

      const reversal =
        previousRailVelocity * railVelocity < -0.035
          ? clamp(Math.abs(previousRailVelocity - railVelocity) / 3.2, 0, 1)
          : 0;
      const acceleration = clamp(
        Math.abs(railVelocity - previousRailVelocity) / 3.8,
        0,
        1,
      );

      const energyTarget = reducedMotion
        ? 0
        : clamp(
            speedNormalized * 0.72 +
              reversal * 0.48 +
              acceleration * 0.22,
            0,
            1,
          );

      const energyFollow = 1 - Math.exp(-(draggingRef.current ? 9 : 4.2) * dt);
      interactionEnergyRef.current +=
        (energyTarget - interactionEnergyRef.current) * energyFollow;

      if (!draggingRef.current && speed < 0.06) {
        interactionEnergyRef.current *= Math.exp(-2.2 * dt);
      }

      previousRailVelocityRef.current = railVelocity;
      const interactionEnergy = clamp(interactionEnergyRef.current, 0, 1);

      const idleTarget =
        !reducedMotion &&
        !draggingRef.current &&
        selectedIndexRef.current === null &&
        speed < 0.055 &&
        interactionEnergy < 0.08
          ? 1
          : 0;
      const idleFollow = 1 - Math.exp(-(idleTarget > idlePresenceRef.current ? 1.6 : 5.5) * dt);
      idlePresenceRef.current +=
        (idleTarget - idlePresenceRef.current) * idleFollow;
      idlePhaseRef.current += dt * 0.78;

      const idlePresence = clamp(idlePresenceRef.current, 0, 1);

      bottleRefs.current.forEach((element, index) => {
        if (!element) return;

        const relative = wrappedDistance(index, position);
        const distance = Math.abs(relative);

        const magnetZone = smoothstep(1 - Math.min(distance / 0.72, 1));
        const magneticRelative = relative * (1 - magnetZone * 0.19);

        const focusTarget = smoothstep(1 - Math.min(distance / 0.9, 1));
        const arcRatio = clamp(distance / 2.25, 0, 1);
        const staticArcDrop = 34 * (1 - Math.pow(arcRatio, 1.55));

        const direction = travelDirectionRef.current;
        const directionalRelative = relative * direction;
        const followOrder = clamp((directionalRelative + 2.4) / 4.8, 0, 1);

        const motion =
          bottleMotionRef.current[index] ??
          ({
            trailX: 0,
            trailVelocity: 0,
            arcY: staticArcDrop,
            arcVelocity: 0,
            angle: 0,
            angleVelocity: 0,
            focus: focusTarget,
            focusVelocity: 0,
          } satisfies BottleMotion);

        bottleMotionRef.current[index] = motion;

        const trailTarget = clamp(
          -railVelocity *
            (5.5 + followOrder * 7.5) *
            (0.92 + (index % 3) * 0.045),
          -46,
          46,
        );

        const elasticDrop =
          interactionEnergy *
          (7 + followOrder * 14) *
          (0.35 + Math.min(distance, 1.8) * 0.22);
        const arcTarget = staticArcDrop + elasticDrop;

        const angleTarget = clamp(
          -railVelocity * (1.05 + followOrder * 0.72) +
            reversal * direction * (2.2 + followOrder * 2.4),
          -9.5,
          9.5,
        );

        if (reducedMotion) {
          motion.trailX = 0;
          motion.trailVelocity = 0;
          motion.arcY = staticArcDrop;
          motion.arcVelocity = 0;
          motion.angle = 0;
          motion.angleVelocity = 0;
          motion.focus = focusTarget;
          motion.focusVelocity = 0;
        } else {
          [motion.trailX, motion.trailVelocity] = springStep(
            motion.trailX,
            motion.trailVelocity,
            trailTarget,
            108 - followOrder * 46,
            17.5 - followOrder * 3.5,
            dt,
          );

          [motion.arcY, motion.arcVelocity] = springStep(
            motion.arcY,
            motion.arcVelocity,
            arcTarget,
            92 - followOrder * 38,
            16 - followOrder * 3.2,
            dt,
          );

          [motion.angle, motion.angleVelocity] = springStep(
            motion.angle,
            motion.angleVelocity,
            angleTarget,
            74 - followOrder * 30,
            12.2 - followOrder * 2.2,
            dt,
          );

          [motion.focus, motion.focusVelocity] = springStep(
            motion.focus,
            motion.focusVelocity,
            focusTarget,
            78,
            16,
            dt,
          );
        }

        const focus = clamp(motion.focus, 0, 1.06);

        const idlePhase =
          idlePhaseRef.current +
          index * 1.07 +
          Math.sin(index * 1.9) * 0.16;
        const idleCenterCalm = 0.42 + (1 - focus) * 0.58;
        const idleAngle =
          Math.sin(idlePhase) *
          0.62 *
          idlePresence *
          idleCenterCalm;
        const idleHang =
          Math.sin(idlePhase * 0.93 + 0.7) *
          2.35 *
          idlePresence *
          (0.7 + (1 - focus) * 0.3);
        const idleX =
          Math.cos(idlePhase * 0.81 - 0.4) *
          1.7 *
          idlePresence *
          idleCenterCalm;
        const idleBreath =
          (0.5 + 0.5 * Math.sin(idlePhase * 0.58 + 1.1)) *
          idlePresence;

        const isSelectionSubject =
          selectionSubject !== null && index === selectionSubject;
        const otherDuringSelection =
          selectionSubject !== null && !isSelectionSubject;

        let x =
          magneticRelative * spacingRef.current +
          motion.trailX +
          idleX;
        let imageLift = 0;
        let imageScale =
          0.925 +
          focus * 0.105 +
          idleBreath * 0.0025;
        let opacity = clamp(
          1 - Math.max(0, distance - 0.85) * 0.08,
          0.72,
          1,
        );
        let angle = motion.angle + idleAngle;
        let hangerExtra = clamp(motion.arcY + idleHang, -8, 60);
        let hangerOpacity = 1;
        let aura =
          0.025 +
          focus * 0.52 +
          interactionEnergy * magnetZone * 0.11 +
          idleBreath * focus * 0.035;

        if (isSelectionSubject) {
          imageLift -= selectionProgress * 68;
          imageScale += selectionProgress * 0.145;
          angle *= 1 - selectionProgress * 0.92;
          hangerExtra = clamp(hangerExtra - selectionProgress * 22, -10, 60);
          hangerOpacity = 1 - selectionProgress * 0.94;
          aura = Math.min(1, aura + selectionProgress * 0.58);
          opacity = 1;
        } else if (otherDuringSelection) {
          const pushDirection =
            Math.abs(relative) > 0.08
              ? Math.sign(relative)
              : index < (selectionSubject ?? index)
                ? -1
                : 1;

          x += pushDirection * selectionProgress * 76;
          imageLift += selectionProgress * 10;
          imageScale -= selectionProgress * 0.035;
          opacity *= 1 - selectionProgress * 0.8;
          angle *= 1 - selectionProgress * 0.6;
          aura *= 1 - selectionProgress * 0.9;
        }

        const zIndex = isSelectionSubject
          ? 30
          : Math.max(1, 18 - Math.round(distance * 3));

        element.style.transform =
          `translate3d(calc(-50% + ${x}px), 0, 0) rotate(${angle}deg)`;
        element.style.opacity = String(opacity);
        element.style.zIndex = String(zIndex);
        element.style.setProperty("--image-scale", imageScale.toFixed(4));
        element.style.setProperty("--image-lift", `${imageLift.toFixed(2)}px`);
        element.style.setProperty(
          "--hanger-extra",
          `${hangerExtra.toFixed(2)}px`,
        );
        element.style.setProperty(
          "--hanger-opacity",
          hangerOpacity.toFixed(3),
        );
        element.style.setProperty("--aura-opacity", aura.toFixed(3));
        element.style.setProperty("--focus", focus.toFixed(3));
      });

      const nearest = modulo(Math.round(position), PRODUCT_COUNT);
      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }

      if (shellRef.current) {
        const energy = Math.min(
          1,
          interactionEnergy * 0.72 +
            speedNormalized * 0.16 +
            selectionProgress * 0.3,
        );
        const glowOffset =
          clamp(-railVelocity * 4.2, -10, 10) *
          (0.35 + interactionEnergy * 0.65);

        shellRef.current.style.setProperty("--scene-energy", String(energy));
        shellRef.current.style.setProperty(
          "--selection-energy",
          selectionProgress.toFixed(3),
        );
        shellRef.current.style.setProperty(
          "--glow-x",
          `${(50 + glowOffset).toFixed(2)}%`,
        );
        shellRef.current.style.setProperty(
          "--motion-energy",
          interactionEnergy.toFixed(3),
        );
        shellRef.current.style.setProperty(
          "--idle-energy",
          idlePresence.toFixed(3),
        );
      }
    },
    [],
  );

  useEffect(() => {
    let frame = 0;
    let lastFrame = performance.now();

    const animate = (now: number) => {
      const dt = clamp((now - lastFrame) / 1000, 0.001, 0.032);
      lastFrame = now;

      const current = positionRef.current;
      const target = targetRef.current;
      let next = current;
      let railVelocity = 0;

      if (draggingRef.current) {
        const follow = 1 - Math.exp(-31 * dt);
        next = current + (target - current) * follow;
        railVelocity = (next - current) / dt;
        motionVelocityRef.current = railVelocity;
      } else {
        let velocity = motionVelocityRef.current;
        const displacement = target - current;

        if (
          Math.abs(displacement) > 0.0008 ||
          Math.abs(velocity) > 0.008
        ) {
          const stiffness = 94;
          const damping = 18.2;

          const acceleration = displacement * stiffness - velocity * damping;
          velocity += acceleration * dt;
          next = current + velocity * dt;

          motionVelocityRef.current = velocity;
          railVelocity = velocity;
        } else {
          next = target;
          motionVelocityRef.current = 0;
        }
      }

      positionRef.current = next;
      renderRail(next, railVelocity, dt);
      frame = window.requestAnimationFrame(animate);
    };

    renderRail(positionRef.current, 0, 1 / 60);
    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [renderRail]);

  useEffect(() => {
    renderRail(positionRef.current, motionVelocityRef.current, 1 / 60);
  }, [spacing, selectedIndex, renderRail]);

  useEffect(
    () => () => {
      if (wheelTimerRef.current !== null) {
        window.clearTimeout(wheelTimerRef.current);
      }
    },
    [],
  );

  const moveToIndex = useCallback((index: number) => {
    const current = positionRef.current;
    const wrapped = modulo(current, PRODUCT_COUNT);
    let delta = index - wrapped;
    const half = PRODUCT_COUNT / 2;

    if (delta > half) delta -= PRODUCT_COUNT;
    if (delta < -half) delta += PRODUCT_COUNT;

    targetRef.current = current + delta;
    motionVelocityRef.current = 0;
  }, []);

  const finishDrag = useCallback(() => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setDragging(false);

    const releaseVelocity = gestureVelocityRef.current;
    const projected =
      targetRef.current + clamp(releaseVelocity, -4.5, 4.5) * 0.145;

    targetRef.current = Math.round(projected);
    motionVelocityRef.current = releaseVelocity * 0.44;

    if (Math.abs(releaseVelocity) > 0.14) {
      travelDirectionRef.current =
        Math.sign(releaseVelocity) || travelDirectionRef.current;
      interactionEnergyRef.current = Math.max(
        interactionEnergyRef.current,
        clamp(Math.abs(releaseVelocity) / 3.2, 0.28, 1),
      );
    }

    gestureVelocityRef.current = 0;
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (selectedIndexRef.current !== null) return;

    draggingRef.current = true;
    setDragging(true);

    pointerStartX.current = event.clientX;
    pointerStartPosition.current = positionRef.current;
    targetRef.current = positionRef.current;

    lastPointerX.current = event.clientX;
    lastPointerTime.current = performance.now();
    gestureVelocityRef.current = 0;
    motionVelocityRef.current = 0;
    movedRef.current = false;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || selectedIndexRef.current !== null) return;

    const spacingNow = Math.max(spacingRef.current, 1);
    const dx = event.clientX - pointerStartX.current;
    const rawPosition = pointerStartPosition.current - dx / spacingNow;

    targetRef.current = applySoftMagnet(rawPosition);

    if (Math.abs(dx) > 7) movedRef.current = true;

    const now = performance.now();
    const dt = Math.max((now - lastPointerTime.current) / 1000, 0.008);
    const instantVelocity =
      -(event.clientX - lastPointerX.current) / spacingNow / dt;

    gestureVelocityRef.current =
      gestureVelocityRef.current * 0.68 +
      clamp(instantVelocity, -5, 5) * 0.32;

    lastPointerX.current = event.clientX;
    lastPointerTime.current = now;
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (selectedIndexRef.current !== null || draggingRef.current) return;

    const intent =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (Math.abs(intent) < 1) return;

    const delta = clamp(intent * 0.004, -0.4, 0.4);
    targetRef.current += delta;
    motionVelocityRef.current = clamp(
      motionVelocityRef.current + delta * 4.6,
      -4,
      4,
    );
    travelDirectionRef.current =
      Math.sign(delta) || travelDirectionRef.current;
    interactionEnergyRef.current = Math.max(
      interactionEnergyRef.current,
      clamp(Math.abs(delta) * 1.8, 0.16, 0.7),
    );

    if (wheelTimerRef.current !== null) {
      window.clearTimeout(wheelTimerRef.current);
    }

    wheelTimerRef.current = window.setTimeout(() => {
      targetRef.current = Math.round(targetRef.current);
      wheelTimerRef.current = null;
    }, 95);
  };

  const shellStyle = {
    "--glow-x": "50%",
    "--scene-energy": "0",
    "--selection-energy": "0",
    "--motion-energy": "0",
    "--idle-energy": "0",
    "--bottle-width": `${bottleWidth}px`,
  } as CSSProperties;

  return (
    <div
      ref={shellRef}
      className="experience-shell"
      data-dragging={dragging}
      data-selected={selectedIndex !== null}
      style={shellStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onWheel={onWheel}
    >
      <div className="dom-rail-stage" aria-label="Interactive fragrance rail">
        <div className="dom-rail-bar" aria-hidden="true" />

        {fragrances.map((fragrance, index) => {
          const initialRelative = wrappedDistance(index, 0);
          const initialX = initialRelative * spacing;
          const initialDistance = Math.abs(initialRelative);
          const initialArcRatio = clamp(initialDistance / 2.25, 0, 1);
          const initialArcDrop =
            34 * (1 - Math.pow(initialArcRatio, 1.55));
          const active = index === activeIndex;
          const selected = index === selectedIndex;

          return (
            <button
              ref={(element) => {
                bottleRefs.current[index] = element;
              }}
              key={fragrance.id}
              type="button"
              className="dom-bottle"
              data-active={active}
              data-selected={selected}
              style={{
                "--hanger-extra": `${initialArcDrop}px`,
                transform: `translate3d(calc(-50% + ${initialX}px), 0, 0)`,
                zIndex: Math.max(
                  1,
                  18 - Math.round(Math.abs(initialRelative) * 3),
                ),
              } as CSSProperties}
              aria-label={productLabel(fragrance, index)}
              onClick={(event) => {
                event.stopPropagation();

                if (movedRef.current) {
                  movedRef.current = false;
                  return;
                }

                if (!active) {
                  moveToIndex(index);
                  return;
                }

                setSelectedIndex(index);
              }}
            >
              <span className="bottle-aura" aria-hidden="true" />
              <span className="bottle-hanger" aria-hidden="true" />
              <img
                src={PRODUCT_ASSET}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <button
          className="detail-close"
          type="button"
          aria-label="Close fragrance detail"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedIndex(null);
          }}
        >
          ×
        </button>
      )}

      <div
        className="experience-ui"
        data-selected={selectedIndex !== null}
        aria-live="polite"
      >
        <div className="product-card">
          <span className="product-index">
            {String((selectedIndex ?? activeIndex) + 1).padStart(2, "0")} /{" "}
            {String(PRODUCT_COUNT).padStart(2, "0")}
          </span>
          <h3>{productLabel(activeFragrance, selectedIndex ?? activeIndex)}</h3>
          <p className="product-meta">
            {activeFragrance.size && <span>{activeFragrance.size}</span>}
            {activeFragrance.concentration && (
              <span>{activeFragrance.concentration}</span>
            )}
          </p>

          {selectedIndex !== null &&
            (activeFragrance.inspiration || activeFragrance.notes.length > 0) && (
              <div className="fragrance-details">
                {activeFragrance.inspiration && (
                  <p className="fragrance-inspiration">
                    {activeFragrance.inspiration}
                  </p>
                )}
                {activeFragrance.notes.length > 0 && (
                  <div className="fragrance-notes">
                    {activeFragrance.notes.map((note) => (
                      <span key={note}>{note}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>

        <div className="selection-controls">
          <span>
            {selectedIndex === null
              ? "Drag / swipe / scroll"
              : "Selected fragrance"}
          </span>
          <span className="arc-motion-label" aria-hidden="true">
            ELASTIC ARC
          </span>
        </div>
      </div>
    </div>
  );
}
