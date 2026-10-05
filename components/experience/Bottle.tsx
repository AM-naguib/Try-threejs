"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Fragrance } from "@/lib/fragrances";

type BottleProps = {
  fragrance: Fragrance;
  active: boolean;
  selected: boolean;
  dimmed: boolean;
  motion: number;
  index: number;
  onActivate: () => void;
  onSelect: () => void;
};

const GOLD = "#d5a23b";
const BLACK = "#080808";

function createBottleShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-0.43, -0.82);
  shape.quadraticCurveTo(-0.52, -0.81, -0.525, -0.71);
  shape.lineTo(-0.49, 0.38);
  shape.quadraticCurveTo(-0.485, 0.5, -0.39, 0.56);
  shape.lineTo(-0.255, 0.64);
  shape.quadraticCurveTo(-0.2, 0.68, -0.19, 0.77);
  shape.lineTo(-0.18, 0.84);
  shape.lineTo(0.18, 0.84);
  shape.lineTo(0.19, 0.77);
  shape.quadraticCurveTo(0.2, 0.68, 0.255, 0.64);
  shape.lineTo(0.39, 0.56);
  shape.quadraticCurveTo(0.485, 0.5, 0.49, 0.38);
  shape.lineTo(0.525, -0.71);
  shape.quadraticCurveTo(0.52, -0.81, 0.43, -0.82);
  shape.quadraticCurveTo(0, -0.855, -0.43, -0.82);

  return shape;
}

const BOTTLE_SHAPE = createBottleShape();
const EXTRUDE_OPTIONS = {
  depth: 0.4,
  steps: 1,
  bevelEnabled: true,
  bevelSegments: 5,
  bevelSize: 0.04,
  bevelThickness: 0.04,
  curveSegments: 24,
};

const OUTER_GEOMETRY = new THREE.ExtrudeGeometry(BOTTLE_SHAPE, EXTRUDE_OPTIONS);
OUTER_GEOMETRY.translate(0, 0, -0.2);
OUTER_GEOMETRY.computeVertexNormals();

const GLASS_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#ded6c8"),
  roughness: 0.045,
  metalness: 0,
  transmission: 0.95,
  thickness: 0.62,
  ior: 1.48,
  transparent: true,
  opacity: 0.9,
  clearcoat: 0.26,
  clearcoatRoughness: 0.08,
  attenuationColor: new THREE.Color("#d8c7aa"),
  attenuationDistance: 2.1,
  envMapIntensity: 1.7,
});

const LIQUID_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#1d1007"),
  roughness: 0.18,
  metalness: 0,
  transmission: 0.16,
  thickness: 0.42,
  transparent: true,
  opacity: 0.73,
  envMapIntensity: 0.8,
});

const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(GOLD),
  metalness: 0.96,
  roughness: 0.115,
  envMapIntensity: 2,
});

const GOLD_HIGHLIGHT_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f2c661"),
  metalness: 0.98,
  roughness: 0.065,
  envMapIntensity: 2.3,
});

const CAP_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(BLACK),
  roughness: 0.34,
  metalness: 0.08,
  envMapIntensity: 0.8,
});

const labelTextureCache = new Map<string, THREE.CanvasTexture>();

function createLabelTexture(name: string) {
  if (typeof document === "undefined") return null;
  const cached = labelTextureCache.get(name);
  if (cached) return cached;

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
  gradient.addColorStop(0, "#f3cb6a");
  gradient.addColorStop(0.48, "#c88d25");
  gradient.addColorStop(1, "#4d2b08");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 326, 92, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,232,166,.92)";
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
  labelTextureCache.set(name, texture);

  return texture;
}

export function Bottle({
  fragrance,
  active,
  selected,
  dimmed,
  motion,
  index,
  onActivate,
  onSelect,
}: BottleProps) {
  const transformRoot = useRef<THREE.Group>(null);
  const swingRoot = useRef<THREE.Group>(null);
  const labelTexture = useMemo(
    () => createLabelTexture(fragrance.name ?? "WAVE"),
    [fragrance.name],
  );

  useFrame((_, delta) => {
    if (!swingRoot.current) return;

    const phaseScale = 0.9 + Math.sin(index * 1.15) * 0.1;
    const targetSwing = selected
      ? 0
      : THREE.MathUtils.clamp(-motion * 0.085 * phaseScale, -0.17, 0.17);
    const targetTwist = selected
      ? 0
      : THREE.MathUtils.clamp(motion * 0.04 * phaseScale, -0.08, 0.08);

    swingRoot.current.rotation.z = THREE.MathUtils.damp(
      swingRoot.current.rotation.z,
      targetSwing,
      7.5,
      delta,
    );
    swingRoot.current.rotation.y = THREE.MathUtils.damp(
      swingRoot.current.rotation.y,
      targetTwist,
      8.5,
      delta,
    );
  });

  useLayoutEffect(() => {
    if (!transformRoot.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = selected
      ? { z: 1.52, y: 0.14, scale: 1.28, rotationY: 0.2 }
      : active
        ? { z: 0.19, y: 0, scale: 1.06, rotationY: 0 }
        : { z: dimmed ? -0.82 : 0, y: 0, scale: dimmed ? 0.74 : 0.9, rotationY: 0 };

    const timeline = gsap.timeline({
      defaults: { duration: reducedMotion ? 0 : 0.76, ease: "power3.out" },
    });
    timeline.to(transformRoot.current.position, { z: target.z, y: target.y }, 0);
    timeline.to(
      transformRoot.current.scale,
      { x: target.scale, y: target.scale, z: target.scale },
      0,
    );
    timeline.to(transformRoot.current.rotation, { y: target.rotationY }, 0);

    return () => {
      timeline.kill();
    };
  }, [active, selected, dimmed]);

  return (
    <group
      ref={transformRoot}
      onClick={(event) => {
        event.stopPropagation();
        if (active) onSelect();
        else onActivate();
      }}
    >
      <group ref={swingRoot}>
        <mesh castShadow>
          <primitive object={OUTER_GEOMETRY} attach="geometry" />
          <primitive object={GLASS_MATERIAL} attach="material" />
        </mesh>

        <group scale={[0.885, 0.9, 0.72]} position={[0, -0.055, -0.012]}>
          <mesh>
            <primitive object={OUTER_GEOMETRY} attach="geometry" />
            <primitive object={LIQUID_MATERIAL} attach="material" />
          </mesh>
        </group>

        <mesh position={[0, -0.795, 0.012]} scale={[0.94, 1, 0.92]}>
          <boxGeometry args={[0.92, 0.095, 0.39, 1, 1, 1]} />
          <primitive object={GLASS_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 0.015, 0.227]}>
          <planeGeometry args={[0.77, 0.975]} />
          {labelTexture ? (
            <meshStandardMaterial
              map={labelTexture}
              roughness={0.5}
              metalness={0.04}
              envMapIntensity={0.7}
            />
          ) : (
            <meshStandardMaterial color={BLACK} roughness={0.5} />
          )}
        </mesh>

        <mesh position={[0, 0.91, 0]}>
          <cylinderGeometry args={[0.255, 0.28, 0.19, 48]} />
          <primitive object={GOLD_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[0.305, 0.29, 0.065, 48]} />
          <primitive object={GOLD_HIGHLIGHT_MATERIAL} attach="material" />
        </mesh>

        {[
          { y: 1.115, rTop: 0.334, rBottom: 0.35, h: 0.12 },
          { y: 1.215, rTop: 0.375, rBottom: 0.345, h: 0.12 },
          { y: 1.315, rTop: 0.342, rBottom: 0.375, h: 0.12 },
          { y: 1.415, rTop: 0.372, rBottom: 0.342, h: 0.12 },
          { y: 1.515, rTop: 0.335, rBottom: 0.368, h: 0.11 },
        ].map((band) => (
          <mesh key={band.y} position={[0, band.y, 0]}>
            <cylinderGeometry args={[band.rTop, band.rBottom, band.h, 48]} />
            <primitive object={CAP_MATERIAL} attach="material" />
          </mesh>
        ))}

        <mesh position={[0, 1.59, 0]}>
          <cylinderGeometry args={[0.33, 0.34, 0.055, 48]} />
          <primitive object={GOLD_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 1.622, 0]}>
          <cylinderGeometry args={[0.295, 0.315, 0.02, 48]} />
          <primitive object={GOLD_HIGHLIGHT_MATERIAL} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
