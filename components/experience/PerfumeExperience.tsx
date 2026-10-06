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

export function PerfumeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(390);

  const bottleRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const motionVelocityRef = useRef(0);
  const gestureVelocityRef = useRef(0);
  const draggingRef = useRef(false);
  const selectedIndexRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

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
  }, [selectedIndex]);

  const activeFragrance = fragrances[selectedIndex ?? activeIndex];

  const renderRail = useCallback((position: number, visualVelocity: number) => {
    const selected = selectedIndexRef.current;
    const swing = clamp(-visualVelocity * 0.45, -2.25, 2.25);

    bottleRefs.current.forEach((element, index) => {
      if (!element) return;

      const relative = wrappedDistance(index, position);
      const x = relative * spacingRef.current;
      const distance = Math.abs(relative);
      const isSelected = index === selected;
      const dimmed = selected !== null && !isSelected;

      const y = isSelected ? -16 : 0;
      const scale = isSelected ? 1.12 : 1;
      const opacity = dimmed ? 0.16 : 1;

      element.style.transform =
        `translate3d(calc(-50% + ${x}px), ${y}px, 0) scale(${scale}) rotate(${swing}deg)`;
      element.style.opacity = String(opacity);
      element.style.zIndex = String(
        isSelected ? 12 : Math.max(1, 10 - Math.round(distance)),
      );
    });

    const nearest = modulo(Math.round(position), PRODUCT_COUNT);
    if (nearest !== activeIndexRef.current) {
      activeIndexRef.current = nearest;
      setActiveIndex(nearest);
    }

    if (shellRef.current) {
      const energy = Math.min(1, Math.abs(visualVelocity) * 0.12);
      shellRef.current.style.setProperty("--scene-energy", String(energy));
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastFrame = performance.now();

    const animate = (now: number) => {
      const dt = clamp((now - lastFrame) / 1000, 0.001, 0.032);
      lastFrame = now;

      const current = positionRef.current;
      const target = targetRef.current;
      let next = current;
      let visualVelocity = 0;

      if (draggingRef.current) {
        const follow = 1 - Math.exp(-28 * dt);
        next = current + (target - current) * follow;
        visualVelocity = (next - current) / dt;
        motionVelocityRef.current = visualVelocity;
      } else {
        let velocity = motionVelocityRef.current;
        const displacement = target - current;

        if (
          Math.abs(displacement) > 0.0008 ||
          Math.abs(velocity) > 0.008
        ) {
          const stiffness = 88;
          const damping = 18;

          const acceleration = displacement * stiffness - velocity * damping;
          velocity += acceleration * dt;
          next = current + velocity * dt;

          motionVelocityRef.current = velocity;
          visualVelocity = velocity;
        } else {
          next = target;
          motionVelocityRef.current = 0;
        }
      }

      positionRef.current = next;

      const isMoving =
        draggingRef.current ||
        Math.abs(targetRef.current - next) > 0.0008 ||
        Math.abs(motionVelocityRef.current) > 0.008;

      if (isMoving) {
        renderRail(next, visualVelocity);
      }

      frame = window.requestAnimationFrame(animate);
    };

    renderRail(positionRef.current, 0);
    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [renderRail]);

  useEffect(() => {
    renderRail(positionRef.current, motionVelocityRef.current);
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
                zIndex: Math.max(1, 10 - Math.round(Math.abs(initialRelative))),
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
