"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Fragrance } from "@/lib/fragrances";

type BottleProps = {
  fragrance: Fragrance;
  active: boolean;
  selected: boolean;
  dimmed: boolean;
  onActivate: () => void;
  onSelect: () => void;
};

const GOLD = "#d5a23b";
const BLACK = "#080808";

function createBottleShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-0.47, -0.78);
  shape.quadraticCurveTo(-0.52, -0.77, -0.52, -0.69);
  shape.lineTo(-0.48, 0.39);
  shape.quadraticCurveTo(-0.47, 0.53, -0.35, 0.59);
  shape.lineTo(-0.24, 0.64);
  shape.quadraticCurveTo(-0.19, 0.67, -0.18, 0.76);
  shape.lineTo(-0.17, 0.84);
  shape.lineTo(0.17, 0.84);
  shape.lineTo(0.18, 0.76);
  shape.quadraticCurveTo(0.19, 0.67, 0.24, 0.64);
  shape.lineTo(0.35, 0.59);
  shape.quadraticCurveTo(0.47, 0.53, 0.48, 0.39);
  shape.lineTo(0.52, -0.69);
  shape.quadraticCurveTo(0.52, -0.77, 0.47, -0.78);
  shape.quadraticCurveTo(0, -0.83, -0.47, -0.78);

  return shape;
}

function createLabelTexture(name: string) {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gold = "#d7a63e";
  ctx.fillStyle = "#070707";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 10;
  ctx.strokeRect(24, 24, 464, 592);
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, 436, 564);

  ctx.fillStyle = gold;
  ctx.textAlign = "center";
  ctx.font = "500 72px Arial";
  ctx.fillText("WAVE", 256, 118);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  for (const offset of [-12, 0, 12]) {
    ctx.beginPath();
    ctx.moveTo(205, 145 + offset);
    ctx.quadraticCurveTo(256, 115 + offset, 307, 145 + offset);
    ctx.stroke();
  }

  ctx.font = "20px Georgia";
  ctx.fillText("Not just a Perfume... It's Your Personal Signature!", 256, 182);

  const gradient = ctx.createRadialGradient(220, 280, 12, 256, 315, 96);
  gradient.addColorStop(0, "#f1c15b");
  gradient.addColorStop(0.5, "#c58820");
  gradient.addColorStop(1, "#5b3409");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 326, 92, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,228,153,.9)";
  ctx.lineWidth = 7;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(188, 340 + i * 11);
    ctx.bezierCurveTo(230, 300 + i * 6, 278, 375 - i * 8, 330, 322 + i * 9);
    ctx.stroke();
  }

  ctx.fillStyle = gold;
  ctx.font = "700 45px Arial";
  ctx.fillText(name, 256, 486);

  ctx.fillStyle = "#f0eee8";
  ctx.font = "26px Arial";
  ctx.fillText("60ml", 256, 538);
  ctx.font = "22px Arial";
  ctx.fillText("Extrait De Parfum", 256, 578);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

export function Bottle({
  fragrance,
  active,
  selected,
  dimmed,
  onActivate,
  onSelect,
}: BottleProps) {
  const root = useRef<THREE.Group>(null);
  const bottleShape = useMemo(() => createBottleShape(), []);
  const labelTexture = useMemo(
    () => createLabelTexture(fragrance.name ?? "WAVE"),
    [fragrance.name],
  );
  const extrude = useMemo(
    () => ({
      depth: 0.38,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 18,
    }),
    [],
  );

  useEffect(
    () => () => {
      labelTexture?.dispose();
    },
    [labelTexture],
  );

  useLayoutEffect(() => {
    if (!root.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = selected
      ? { z: 1.36, y: 0.16, scale: 1.24, rotationY: 0.2 }
      : active
        ? { z: 0.17, y: 0, scale: 1.055, rotationY: 0 }
        : { z: dimmed ? -0.72 : 0, y: 0, scale: dimmed ? 0.77 : 0.9, rotationY: 0 };

    const timeline = gsap.timeline({
      defaults: { duration: reducedMotion ? 0 : 0.72, ease: "power3.out" },
    });
    timeline.to(root.current.position, { z: target.z, y: target.y }, 0);
    timeline.to(root.current.scale, { x: target.scale, y: target.scale, z: target.scale }, 0);
    timeline.to(root.current.rotation, { y: target.rotationY }, 0);

    return () => {
      timeline.kill();
    };
  }, [active, selected, dimmed]);

  return (
    <group
      ref={root}
      onClick={(event) => {
        event.stopPropagation();
        if (active) onSelect();
        else onActivate();
      }}
    >
      <mesh position={[0, 0, -0.19]} castShadow>
        <extrudeGeometry args={[bottleShape, extrude]} />
        <meshPhysicalMaterial
          color="#f0e8d8"
          roughness={0.055}
          metalness={0}
          transmission={0.93}
          thickness={0.52}
          ior={1.47}
          transparent
          opacity={0.84}
        />
      </mesh>

      <group scale={[0.89, 0.91, 0.72]} position={[0, -0.055, -0.135]}>
        <mesh>
          <extrudeGeometry args={[bottleShape, extrude]} />
          <meshPhysicalMaterial
            color="#1f1309"
            roughness={0.19}
            metalness={0}
            transmission={0.14}
            thickness={0.4}
            transparent
            opacity={0.68}
          />
        </mesh>
      </group>

      <mesh position={[0, 0.02, 0.235]}>
        <planeGeometry args={[0.76, 0.96]} />
        {labelTexture ? (
          <meshStandardMaterial map={labelTexture} roughness={0.5} metalness={0.04} />
        ) : (
          <meshStandardMaterial color={BLACK} roughness={0.5} />
        )}
      </mesh>

      <mesh position={[0, 0.915, 0]}>
        <cylinderGeometry args={[0.255, 0.28, 0.19, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.96} roughness={0.12} />
      </mesh>

      <mesh position={[0, 1.005, 0]}>
        <cylinderGeometry args={[0.305, 0.29, 0.065, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.96} roughness={0.11} />
      </mesh>

      {[
        { y: 1.12, r: 0.345, h: 0.12 },
        { y: 1.22, r: 0.375, h: 0.12 },
        { y: 1.32, r: 0.35, h: 0.12 },
        { y: 1.42, r: 0.37, h: 0.12 },
        { y: 1.52, r: 0.34, h: 0.11 },
      ].map((band) => (
        <mesh key={band.y} position={[0, band.y, 0]}>
          <cylinderGeometry args={[band.r * 0.98, band.r, band.h, 48]} />
          <meshStandardMaterial color={BLACK} roughness={0.36} metalness={0.08} />
        </mesh>
      ))}

      <mesh position={[0, 1.585, 0]}>
        <cylinderGeometry args={[0.33, 0.34, 0.055, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.08} />
      </mesh>

      <mesh position={[0, 1.617, 0]}>
        <cylinderGeometry args={[0.295, 0.315, 0.018, 48]} />
        <meshStandardMaterial color="#f1c562" metalness={0.98} roughness={0.06} />
      </mesh>
    </group>
  );
}
