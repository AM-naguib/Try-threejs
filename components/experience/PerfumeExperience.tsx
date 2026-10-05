"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties } from "react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bottle } from "./Bottle";
import { fragrances, productLabel } from "@/lib/fragrances";

const SPACING = 1.72;

function RailScene({
  activeIndex,
  drag,
  motion,
  selectedIndex,
  setActiveIndex,
  setSelectedIndex,
}: {
  activeIndex: number;
  drag: number;
  motion: number;
  selectedIndex: number | null;
  setActiveIndex: (index: number) => void;
  setSelectedIndex: (index: number | null) => void;
}) {
  const rail = useRef<THREE.Group>(null);
  const positions = useMemo(() => fragrances.map((_, index) => index * SPACING), []);

  useFrame(({ camera, size }, delta) => {
    const mobile = size.width < 720;

    if (rail.current) {
      const targetX = -activeIndex * SPACING + drag * SPACING;
      rail.current.position.x = THREE.MathUtils.damp(rail.current.position.x, targetX, 10.5, delta);
      rail.current.position.y = THREE.MathUtils.damp(
        rail.current.position.y,
        mobile ? -0.38 : -0.27,
        6,
        delta,
      );
    }

    const selected = selectedIndex !== null;
    const targetZ = mobile
      ? (selected ? 6.25 : 7.35)
      : (selected ? 4.78 : 5.62);
    const targetY = mobile
      ? (selected ? 0.22 : 0.28)
      : (selected ? 0.33 : 0.42);

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      selected ? 4.2 : 5.6,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      5,
      delta,
    );
  });

  return (
    <>
      <fog attach="fog" args={["#080808", 6.3, 13]} />

      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 5, 5]} intensity={2.9} color="#fff2d3" />
      <directionalLight position={[-5, 2, 3]} intensity={1.25} color="#d8e0ff" />
      <spotLight
        position={[0, 5.5, 4.5]}
        intensity={52}
        distance={12}
        angle={0.46}
        penumbra={0.86}
        color="#ffe6ae"
      />
      <pointLight position={[0, -1.7, 3.4]} intensity={18} distance={6} color="#c89a36" />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={3.1}
          color="#fff4de"
          position={[0, 4, 3]}
          rotation={[Math.PI / 2.4, 0, 0]}
          scale={[6, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#d8e4ff"
          position={[-4, 1, 2]}
          rotation={[0, Math.PI / 2.3, 0]}
          scale={[3, 2, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.6}
          color="#d3a13d"
          position={[3.5, -1, 1]}
          rotation={[0, -Math.PI / 2.5, 0]}
          scale={2.2}
        />
      </Environment>

      <mesh position={[0, 1.77, -0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 14, 24]} />
        <meshStandardMaterial color="#a87929" metalness={0.94} roughness={0.18} />
      </mesh>

      <group ref={rail} position={[0, -0.27, 0]}>
        {fragrances.map((fragrance, index) => (
          <group key={fragrance.id} position={[positions[index], 0, 0]}>
            <mesh position={[0, 1.66, -0.19]}>
              <cylinderGeometry args={[0.011, 0.011, 0.24, 16]} />
              <meshStandardMaterial color="#8a6b35" metalness={0.78} roughness={0.28} />
            </mesh>
            <Bottle
              fragrance={fragrance}
              active={index === activeIndex}
              selected={index === selectedIndex}
              dimmed={selectedIndex !== null && index !== selectedIndex}
              motion={motion}
              index={index}
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
  const [velocity, setVelocity] = useState(0);

  const startX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const dragRef = useRef(0);
  const velocityRef = useRef(0);
  const wheelLock = useRef(false);

  const activeFragrance = fragrances[selectedIndex ?? activeIndex];
  const clampIndex = (value: number) => Math.max(0, Math.min(fragrances.length - 1, value));

  const finishDrag = () => {
    if (!dragging) return;

    const projectedDrag = THREE.MathUtils.clamp(
      dragRef.current + velocityRef.current * 0.085,
      -3.2,
      3.2,
    );
    const steps = Math.round(-projectedDrag);
    const fallbackStep =
      Math.abs(dragRef.current) > 0.2 ? (dragRef.current < 0 ? 1 : -1) : 0;

    setActiveIndex((current) => clampIndex(current + (steps || fallbackStep)));
    dragRef.current = 0;
    velocityRef.current = 0;
    setDrag(0);
    setVelocity(0);
    setDragging(false);
  };

  const motion = dragging ? drag * 0.42 + velocity * 0.052 : 0;
  const glowX = 18 + ((activeIndex + drag) / Math.max(fragrances.length - 1, 1)) * 64;

  const shellStyle = {
    "--glow-x": `${THREE.MathUtils.clamp(glowX, 12, 88)}%`,
    "--scene-energy": String(Math.min(1, Math.abs(motion) * 0.8)),
  } as CSSProperties;

  return (
    <div
      className="experience-shell"
      data-dragging={dragging}
      data-selected={selectedIndex !== null}
      style={shellStyle}
      onPointerDown={(event) => {
        if (selectedIndex !== null) return;

        startX.current = event.clientX;
        lastX.current = event.clientX;
        lastTime.current = performance.now();
        dragRef.current = 0;
        velocityRef.current = 0;
        setVelocity(0);
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging || selectedIndex !== null) return;

        const width = Math.max(window.innerWidth, 320);
        const denominator = Math.min(width * 0.22, 220);
        let normalized = (event.clientX - startX.current) / denominator;

        if ((activeIndex === 0 && normalized > 0) ||
            (activeIndex === fragrances.length - 1 && normalized < 0)) {
          normalized *= 0.3;
        }

        normalized = THREE.MathUtils.clamp(normalized, -2.75, 2.75);
        dragRef.current = normalized;
        setDrag(normalized);

        const now = performance.now();
        const dt = Math.max((now - lastTime.current) / 1000, 0.016);
        const nextVelocity = THREE.MathUtils.clamp(
          ((event.clientX - lastX.current) / denominator) / dt,
          -10,
          10,
        );

        velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, nextVelocity, 0.4);
        setVelocity(velocityRef.current);
        lastX.current = event.clientX;
        lastTime.current = now;
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onWheel={(event) => {
        if (selectedIndex !== null || wheelLock.current) return;

        const intent = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(intent) < 8) return;

        wheelLock.current = true;
        setActiveIndex((current) => clampIndex(current + (intent > 0 ? 1 : -1)));
        window.setTimeout(() => {
          wheelLock.current = false;
        }, 190);
      }}
    >
      <Canvas
        className="experience-canvas"
        camera={{ position: [0, 0.42, 5.62], fov: 38 }}
        dpr={[1, 1.55]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <RailScene
          activeIndex={activeIndex}
          drag={drag}
          motion={motion}
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

      <div className="experience-ui" data-selected={selectedIndex !== null} aria-live="polite">
        <div className="product-card">
          <span className="product-index">
            {String((selectedIndex ?? activeIndex) + 1).padStart(2, "0")} / {String(fragrances.length).padStart(2, "0")}
          </span>
          <h3>{productLabel(activeFragrance, selectedIndex ?? activeIndex)}</h3>
          <p className="product-meta">
            {activeFragrance.size && <span>{activeFragrance.size}</span>}
            {activeFragrance.concentration && <span>{activeFragrance.concentration}</span>}
          </p>

          {selectedIndex !== null &&
            (activeFragrance.inspiration || activeFragrance.notes.length > 0) && (
              <div className="fragrance-details">
                {activeFragrance.inspiration && (
                  <p className="fragrance-inspiration">{activeFragrance.inspiration}</p>
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
          <span>{selectedIndex === null ? "Drag / swipe / scroll" : "Selected fragrance"}</span>
          <div className="selection-dots" aria-label="Fragrance selector">
            {fragrances.map((fragrance, index) => (
              <button
                key={fragrance.id}
                className="selection-dot"
                type="button"
                aria-label={`${productLabel(fragrance, index)} ${index + 1}`}
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
