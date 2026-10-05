"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bottle } from "./Bottle";
import { fragrances, productLabel } from "@/lib/fragrances";

const SPACING = 1.72;

function RailScene({
  activeIndex,
  drag,
  selectedIndex,
  setActiveIndex,
  setSelectedIndex,
}: {
  activeIndex: number;
  drag: number;
  selectedIndex: number | null;
  setActiveIndex: (index: number) => void;
  setSelectedIndex: (index: number | null) => void;
}) {
  const rail = useRef<THREE.Group>(null);
  const positions = useMemo(() => fragrances.map((_, index) => index * SPACING), []);

  useFrame((_, delta) => {
    if (!rail.current) return;
    const targetX = -activeIndex * SPACING + drag * SPACING;
    rail.current.position.x = THREE.MathUtils.damp(rail.current.position.x, targetX, 9, delta);
  });

  return (
    <>
      <ambientLight intensity={.5} />
      <directionalLight position={[4, 5, 5]} intensity={4.3} color="#fff5df" />
      <directionalLight position={[-4, 2, 2]} intensity={2.2} color="#d0d7ff" />
      <pointLight position={[0, -1.6, 3.5]} intensity={25} distance={7} color="#c89a36" />

      <mesh position={[0, 1.72, -.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[.025, .025, 14, 24]} />
        <meshStandardMaterial color="#b58a36" metalness={.9} roughness={.2} />
      </mesh>

      <group ref={rail} position={[0, -.25, 0]}>
        {fragrances.map((fragrance, index) => (
          <group key={fragrance.id} position={[positions[index], 0, 0]}>
            <mesh position={[0, 1.58, -.2]}>
              <cylinderGeometry args={[.012, .012, .3, 16]} />
              <meshStandardMaterial color="#6e5b39" metalness={.7} roughness={.32} />
            </mesh>
            <Bottle
              fragrance={fragrance}
              active={index === activeIndex}
              selected={index === selectedIndex}
              dimmed={selectedIndex !== null && index !== selectedIndex}
              onActivate={() => {
                if (selectedIndex === null) setActiveIndex(index);
              }}
              onSelect={() => setSelectedIndex(index)}
            />
          </group>
        ))}
      </group>
    </>
  );
}

export function PerfumeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const wheelLock = useRef(false);

  const activeFragrance = fragrances[selectedIndex ?? activeIndex];
  const clampIndex = (value: number) => Math.max(0, Math.min(fragrances.length - 1, value));

  const finishDrag = () => {
    if (!dragging) return;
    const steps = Math.round(-drag);
    const fallbackStep = Math.abs(drag) > .26 ? (drag < 0 ? 1 : -1) : 0;
    setActiveIndex((current) => clampIndex(current + (steps || fallbackStep)));
    setDrag(0);
    setDragging(false);
  };

  return (
    <div
      className="experience-shell"
      data-dragging={dragging}
      onPointerDown={(event) => {
        if (selectedIndex !== null) return;
        startX.current = event.clientX;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging || selectedIndex !== null) return;
        const width = Math.max(window.innerWidth, 320);
        const normalized = (event.clientX - startX.current) / Math.min(width * .22, 220);
        setDrag(Math.max(-2.4, Math.min(2.4, normalized)));
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onWheel={(event) => {
        if (selectedIndex !== null || wheelLock.current) return;
        const intent = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(intent) < 8) return;
        wheelLock.current = true;
        setActiveIndex((current) => clampIndex(current + (intent > 0 ? 1 : -1)));
        window.setTimeout(() => { wheelLock.current = false; }, 320);
      }}
    >
      <Canvas
        className="experience-canvas"
        camera={{ position: [0, .4, 5.6], fov: 38 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <RailScene
          activeIndex={activeIndex}
          drag={drag}
          selectedIndex={selectedIndex}
          setActiveIndex={setActiveIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </Canvas>

      {selectedIndex !== null && (
        <button
          className="detail-close"
          type="button"
          aria-label="Close fragrance detail"
          onClick={() => setSelectedIndex(null)}
        >
          ×
        </button>
      )}

      <div className="experience-ui" aria-live="polite">
        <div className="product-card">
          <span className="product-index">
            {String((selectedIndex ?? activeIndex) + 1).padStart(2, "0")} / {String(fragrances.length).padStart(2, "0")}
          </span>
          <h3>{productLabel(activeFragrance, selectedIndex ?? activeIndex)}</h3>
          {activeFragrance.name ? (
            <p className="product-meta">
              {activeFragrance.size && <span>{activeFragrance.size}</span>}
              {activeFragrance.concentration && <span>{activeFragrance.concentration}</span>}
            </p>
          ) : (
            <p className="catalog-pending">Catalog details pending.</p>
          )}
        </div>

        <div className="selection-controls">
          <span>{selectedIndex === null ? "Drag / swipe / scroll" : "Selected fragrance"}</span>
          <div className="selection-dots" aria-label="Fragrance selector">
            {fragrances.map((fragrance, index) => (
              <button
                key={fragrance.id}
                className="selection-dot"
                type="button"
                aria-label={productLabel(fragrance, index)}
                aria-current={index === activeIndex}
                onClick={() => {
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
