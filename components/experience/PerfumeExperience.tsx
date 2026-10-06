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
  lagX: number;
  lagVelocity: number;
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
    () => clamp(viewportWidth * 0.56, 205, 340),
    [viewportWidth],
  );

  const bottleWidth = useMemo(
    () => clamp(viewportWidth * 0.60, 220, 360),
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

      bottleRefs.current.forEach((element, index) => {
        if (!element) return;

        const relative = wrappedDistance(index, position);
        const distance = Math.abs(relative);
        const focusTarget = smoothstep(1 - Math.min(1, distance));

        const motion =
          bottleMotionRef.current[index] ??
          ({
            lagX: 0,
            lagVelocity: 0,
            angle: 0,
            angleVelocity: 0,
            focus: focusTarget,
            focusVelocity: 0,
          } satisfies BottleMotion);

        bottleMotionRef.current[index] = motion;

        const trailWeight = 0.86 + (index % 3) * 0.08;
        const lagTarget = clamp(
          -railVelocity * 8.5 * trailWeight,
          -34,
          34,
        );
        const angleTarget = clamp(
          -railVelocity * (1.15 + (index % 4) * 0.08),
          -7.5,
          7.5,
        );

        if (reducedMotion) {
          motion.lagX = 0;
          motion.lagVelocity = 0;
          motion.angle = 0;
          motion.angleVelocity = 0;
          motion.focus = focusTarget;
          motion.focusVelocity = 0;
        } else {
          [motion.lagX, motion.lagVelocity] = springStep(
            motion.lagX,
            motion.lagVelocity,
            lagTarget,
            94 - (index % 3) * 6,
            15.5,
            dt,
          );

          [motion.angle, motion.angleVelocity] = springStep(
            motion.angle,
            motion.angleVelocity,
            angleTarget,
            62 - (index % 3) * 3,
            10.5,
            dt,
          );

          [motion.focus, motion.focusVelocity] = springStep(
            motion.focus,
            motion.focusVelocity,
            focusTarget,
            76,
            16,
            dt,
          );
        }

        const focus = clamp(motion.focus, 0, 1.08);
        const isSelectionSubject =
          selectionSubject !== null && index === selectionSubject;
        const otherDuringSelection =
          selectionSubject !== null && !isSelectionSubject;

        let x = relative * spacingRef.current + motion.lagX;
        let y = focus * 18;
        let imageScale = 0.91 + focus * 0.105;
        let opacity = clamp(1 - Math.max(0, distance - 0.5) * 0.13, 0.58, 1);
        let angle = motion.angle;
        let hangerExtra = focus * 11;
        let hangerOpacity = 1;
        let aura = 0.08 + focus * 0.72;

        if (isSelectionSubject) {
          y -= selectionProgress * 78;
          imageScale += selectionProgress * 0.16;
          angle *= 1 - selectionProgress * 0.9;
          hangerExtra -= selectionProgress * 13;
          hangerOpacity = 1 - selectionProgress * 0.92;
          aura = Math.min(1, aura + selectionProgress * 0.55);
          opacity = 1;
        } else if (otherDuringSelection) {
          const direction =
            Math.abs(relative) > 0.08
              ? Math.sign(relative)
              : index < (selectionSubject ?? index)
                ? -1
                : 1;

          x += direction * selectionProgress * 82;
          y += selectionProgress * 12;
          imageScale -= selectionProgress * 0.045;
          opacity *= 1 - selectionProgress * 0.78;
          angle *= 1 - selectionProgress * 0.55;
          aura *= 1 - selectionProgress * 0.88;
        }

        const zIndex = isSelectionSubject
          ? 30
          : Math.max(1, 16 - Math.round(distance * 3));

        element.style.transform =
          `translate3d(calc(-50% + ${x}px), ${y}px, 0) rotate(${angle}deg)`;
        element.style.opacity = String(opacity);
        element.style.zIndex = String(zIndex);
        element.style.setProperty("--image-scale", imageScale.toFixed(4));
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
          Math.abs(railVelocity) * 0.13 + selectionProgress * 0.32,
        );
        shellRef.current.style.setProperty("--scene-energy", String(energy));
        shellRef.current.style.setProperty(
          "--selection-energy",
          selectionProgress.toFixed(3),
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
        const follow = 1 - Math.exp(-30 * dt);
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
          const stiffness = 86;
          const damping = 17.5;

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

    const projected =
      targetRef.current + clamp(gestureVelocityRef.current, -4.5, 4.5) * 0.14;

    targetRef.current = Math.round(projected);
    motionVelocityRef.current = gestureVelocityRef.current * 0.42;
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

    targetRef.current = pointerStartPosition.current - dx / spacingNow;

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

    const delta = clamp(intent * 0.0042, -0.42, 0.42);
    targetRef.current += delta;
    motionVelocityRef.current = clamp(
      motionVelocityRef.current + delta * 4.5,
      -4,
      4,
    );

    if (wheelTimerRef.current !== null) {
      window.clearTimeout(wheelTimerRef.current);
    }

    wheelTimerRef.current = window.setTimeout(() => {
      targetRef.current = Math.round(targetRef.current);
      wheelTimerRef.current = null;
    }, 90);
  };

  const shellStyle = {
    "--glow-x": "50%",
    "--scene-energy": "0",
    "--selection-energy": "0",
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
                transform: `translate3d(calc(-50% + ${initialX}px), 0, 0)`,
                zIndex: Math.max(1, 16 - Math.round(Math.abs(initialRelative) * 3)),
              }}
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
          <div className="selection-dots" aria-label="Fragrance selector">
            {fragrances.map((fragrance, index) => (
              <button
                key={fragrance.id}
                className="selection-dot"
                type="button"
                aria-label={`${productLabel(fragrance, index)} ${index + 1}`}
                aria-current={index === activeIndex}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  if (selectedIndex === null) moveToIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
