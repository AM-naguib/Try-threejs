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

  // Traced from the supplied Amber Touch front reference:
  // narrower foot -> gently widening body -> broad faceted shoulders -> narrow neck.
  shape.moveTo(-0.46, -0.86);
  shape.quadraticCurveTo(-0.53, -0.855, -0.545, -0.79);
  shape.quadraticCurveTo(-0.565, -0.28, -0.585, 0.34);
  shape.quadraticCurveTo(-0.59, 0.455, -0.515, 0.515);
  shape.lineTo(-0.315, 0.625);
  shape.quadraticCurveTo(-0.255, 0.66, -0.245, 0.73);
  shape.lineTo(-0.235, 0.82);
  shape.lineTo(0.235, 0.82);
  shape.lineTo(0.245, 0.73);
  shape.quadraticCurveTo(0.255, 0.66, 0.315, 0.625);
  shape.lineTo(0.515, 0.515);
  shape.quadraticCurveTo(0.59, 0.455, 0.585, 0.34);
  shape.quadraticCurveTo(0.565, -0.28, 0.545, -0.79);
  shape.quadraticCurveTo(0.53, -0.855, 0.46, -0.86);
  shape.quadraticCurveTo(0, -0.9, -0.46, -0.86);

  return shape;
}

function createCapGeometry() {
  // One continuous lathed profile gives the cap the broad, wrapped/rippled
  // silhouette visible in the product photo instead of stacked straight cylinders.
  const profile = [
    new THREE.Vector2(0.305, -0.31),
    new THREE.Vector2(0.345, -0.285),
    new THREE.Vector2(0.365, -0.235),
    new THREE.Vector2(0.35, -0.19),
    new THREE.Vector2(0.395, -0.145),
    new THREE.Vector2(0.415, -0.07),
    new THREE.Vector2(0.405, 0.01),
    new THREE.Vector2(0.37, 0.065),
    new THREE.Vector2(0.385, 0.13),
    new THREE.Vector2(0.395, 0.19),
    new THREE.Vector2(0.365, 0.245),
    new THREE.Vector2(0.335, 0.285),
    new THREE.Vector2(0.305, 0.31),
  ];

  const geometry = new THREE.LatheGeometry(profile, 64);
  geometry.computeVertexNormals();
  return geometry;
}

const BOTTLE_SHAPE = createBottleShape();
const EXTRUDE_OPTIONS = {
  depth: 0.42,
  steps: 1,
  bevelEnabled: true,
  bevelSegments: 6,
  bevelSize: 0.045,
  bevelThickness: 0.045,
  curveSegments: 32,
};

const OUTER_GEOMETRY = new THREE.ExtrudeGeometry(BOTTLE_SHAPE, EXTRUDE_OPTIONS);
OUTER_GEOMETRY.translate(0, 0, -0.21);
OUTER_GEOMETRY.computeVertexNormals();

const CAP_GEOMETRY = createCapGeometry();

const GLASS_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#e5ded2"),
  roughness: 0.04,
  metalness: 0,
  transmission: 0.96,
  thickness: 0.72,
  ior: 1.49,
  transparent: true,
  opacity: 0.92,
  clearcoat: 0.3,
  clearcoatRoughness: 0.07,
  attenuationColor: new THREE.Color("#d8c7aa"),
  attenuationDistance: 2.25,
  envMapIntensity: 1.85,
});

const LIQUID_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#160b05"),
  roughness: 0.2,
  metalness: 0,
  transmission: 0.1,
  thickness: 0.48,
  transparent: true,
  opacity: 0.78,
  envMapIntensity: 0.82,
});

const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(GOLD),
  metalness: 0.97,
  roughness: 0.1,
  envMapIntensity: 2.2,
});

const GOLD_HIGHLIGHT_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f4ca68"),
  metalness: 0.99,
  roughness: 0.055,
  envMapIntensity: 2.5,
});

const CAP_MATERIAL = new THREE.MeshStandardMaterial({
  color: new THREE.Color(BLACK),
  roughness: 0.38,
  metalness: 0.06,
  envMapIntensity: 0.75,
});

const labelTextureCache = new Map<string, THREE.CanvasTexture>();

function createLabelTexture(name: string) {
  if (typeof document === "undefined") return null;
  const cached = labelTextureCache.get(name);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 744;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gold = "#d7a63e";
  ctx.fillStyle = "#070707";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 9;
  ctx.strokeRect(24, 24, 464, 696);
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, 436, 668);

  ctx.fillStyle = gold;
  ctx.textAlign = "center";
  ctx.font = "500 72px Arial";
  ctx.fillText("WAVE", 256, 126);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 5;
  for (const offset of [-11, 0, 11]) {
    ctx.beginPath();
    ctx.moveTo(208, 154 + offset);
    ctx.quadraticCurveTo(256, 124 + offset, 304, 154 + offset);
    ctx.stroke();
  }

  ctx.font = "19px Georgia";
  ctx.fillText("Not just a Perfume... It's Your Personal Signature!", 256, 193);

  const gradient = ctx.createRadialGradient(220, 300, 12, 256, 340, 104);
  gradient.addColorStop(0, "#f5d070");
  gradient.addColorStop(0.48, "#c98d25");
  gradient.addColorStop(1, "#4e2b08");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 352, 98, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,232,166,.92)";
  ctx.lineWidth = 7;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(182, 366 + i * 11);
    ctx.bezierCurveTo(228, 322 + i * 6, 280, 400 - i * 8, 334, 345 + i * 9);
    ctx.stroke();
  }

  ctx.fillStyle = gold;
  ctx.font = "700 44px Arial";
  ctx.fillText(name, 256, 554);

  ctx.fillStyle = "#f0eee8";
  ctx.font = "25px Arial";
  ctx.fillText("60ml", 256, 615);
  ctx.font = "22px Arial";
  ctx.fillText("Extrait De Parfum", 256, 654);

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
      ? { z: 1.5, y: 0.12, scale: 1.25, rotationY: 0.14 }
      : active
        ? { z: 0.18, y: 0, scale: 1.055, rotationY: 0 }
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

        <group scale={[0.865, 0.86, 0.7]} position={[0, -0.12, -0.012]}>
          <mesh>
            <primitive object={OUTER_GEOMETRY} attach="geometry" />
            <primitive object={LIQUID_MATERIAL} attach="material" />
          </mesh>
        </group>

        <mesh position={[0, -0.825, 0.005]} scale={[1, 1, 0.96]}>
          <boxGeometry args={[0.94, 0.12, 0.4]} />
          <primitive object={GLASS_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, -0.055, 0.257]}>
          <planeGeometry args={[0.92, 1.35]} />
          {labelTexture ? (
            <meshStandardMaterial
              map={labelTexture}
              roughness={0.48}
              metalness={0.035}
              envMapIntensity={0.7}
            />
          ) : (
            <meshStandardMaterial color={BLACK} roughness={0.5} />
          )}
        </mesh>

        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.245, 0.27, 0.17, 64]} />
          <primitive object={GOLD_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 0.995, 0]}>
          <cylinderGeometry args={[0.305, 0.285, 0.055, 64]} />
          <primitive object={GOLD_HIGHLIGHT_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 1.335, 0]} castShadow>
          <primitive object={CAP_GEOMETRY} attach="geometry" />
          <primitive object={CAP_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 1.66, 0]}>
          <cylinderGeometry args={[0.32, 0.335, 0.055, 64]} />
          <primitive object={GOLD_MATERIAL} attach="material" />
        </mesh>

        <mesh position={[0, 1.691, 0]}>
          <cylinderGeometry args={[0.287, 0.31, 0.018, 64]} />
          <primitive object={GOLD_HIGHLIGHT_MATERIAL} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
