"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fragrances, productLabel } from "@/lib/fragrances";

const PRODUCT_ASSET = "/products/amber-touch-approved.webp";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function PerfumeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(390);
  const [velocity, setVelocity] = useState(0);

  const startX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const dragRef = useRef(0);
  const velocityRef = useRef(0);
  const movedRef = useRef(false);
  const wheelLock = useRef(false);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const spacing = useMemo(
    () => clamp(viewportWidth * 0.58, 190, 360),
    [viewportWidth],
  );

  const bottleWidth = useMemo(
    () => clamp(viewportWidth * 0.46, 180, 320),
    [viewportWidth],
  );

  const activeFragrance = fragrances[selectedIndex ?? activeIndex];
  const clampIndex = useCallback(
    (value: number) => clamp(value, 0, fragrances.length - 1),
    [],
  );

  const finishDrag = useCallback(() => {
    if (!dragging) return;

    const projected = dragRef.current + velocityRef.current * 120;
    let steps = Math.round(-projected / spacing);

    if (steps === 0 && Math.abs(dragRef.current) > spacing * 0.2) {
      steps = dragRef.current < 0 ? 1 : -1;
    }

    steps = clamp(steps, -2, 2);

    setActiveIndex((current) => clampIndex(current + steps));
    setDragX(0);
    setVelocity(0);
    dragRef.current = 0;
    velocityRef.current = 0;
    setDragging(false);
  }, [clampIndex, dragging, spacing]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (selectedIndex !== null) return;

    startX.current = event.clientX;
    lastX.current = event.clientX;
    lastTime.current = performance.now();
    dragRef.current = 0;
    velocityRef.current = 0;
    movedRef.current = false;
    setVelocity(0);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || selectedIndex !== null) return;

    let nextDrag = event.clientX - startX.current;

    if (
      (activeIndex === 0 && nextDrag > 0) ||
      (activeIndex === fragrances.length - 1 && nextDrag < 0)
    ) {
      nextDrag *= 0.28;
    }

    nextDrag = clamp(nextDrag, -spacing * 2.3, spacing * 2.3);
    dragRef.current = nextDrag;
    setDragX(nextDrag);

    if (Math.abs(nextDrag) > 7) movedRef.current = true;

    const now = performance.now();
    const dt = Math.max(now - lastTime.current, 16);
    const nextVelocity = clamp((event.clientX - lastX.current) / dt, -2.4, 2.4);
    velocityRef.current = velocityRef.current * 0.55 + nextVelocity * 0.45;
    setVelocity(velocityRef.current);

    lastX.current = event.clientX;
    lastTime.current = now;
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (selectedIndex !== null || wheelLock.current) return;

    const intent =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (Math.abs(intent) < 8) return;

    wheelLock.current = true;
    setActiveIndex((current) =>
      clampIndex(current + (intent > 0 ? 1 : -1)),
    );

    window.setTimeout(() => {
      wheelLock.current = false;
    }, 180);
  };

  const glowX =
    18 +
    ((activeIndex - dragX / Math.max(spacing, 1)) /
      Math.max(fragrances.length - 1, 1)) *
      64;

  const shellStyle = {
    "--glow-x": `${clamp(glowX, 12, 88)}%`,
    "--scene-energy": String(Math.min(1, Math.abs(velocity) * 0.7)),
    "--bottle-width": `${bottleWidth}px`,
  } as CSSProperties;

  return (
    <div
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
          const relative = index - activeIndex;
          const x = relative * spacing + dragX;
          const distance = Math.min(Math.abs(x) / spacing, 2.4);
          const active = index === activeIndex;
          const selected = index === selectedIndex;
          const dimmed = selectedIndex !== null && !selected;

          const scale = selected
            ? 1.16
            : active
              ? 1.03
              : Math.max(0.82, 0.94 - distance * 0.055);

          const opacity = dimmed
            ? 0.18
            : Math.max(0.5, 1 - distance * 0.16);

          const swing =
            dragging && Math.abs(velocity) > 0.01
              ? clamp(-velocity * 4.8, -8, 8)
              : active
                ? 0
                : clamp(relative * -0.8, -2.5, 2.5);

          const y = selected ? -16 : active ? 0 : distance * 4;

          return (
            <button
              key={fragrance.id}
              type="button"
              className="dom-bottle"
              data-active={active}
              data-selected={selected}
              style={{
                transform: `translate3d(calc(-50% + ${x}px), ${y}px, 0) scale(${scale}) rotate(${swing}deg)`,
                opacity,
                zIndex: selected ? 12 : active ? 10 : Math.max(1, 8 - Math.round(distance)),
              }}
              aria-label={productLabel(fragrance, index)}
              onClick={(event) => {
                event.stopPropagation();
                if (movedRef.current) {
                  movedRef.current = false;
                  return;
                }

                if (!active) {
                  setActiveIndex(index);
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
            {String(fragrances.length).padStart(2, "0")}
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
                  if (selectedIndex === null) setActiveIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
