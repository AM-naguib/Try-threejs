"use client";

import { useGLTF, useTexture } from "@react-three/drei";
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

const GLASS_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: "#ece6db",
  roughness: 0.055,
  metalness: 0,
  transmission: 0.94,
  thickness: 0.7,
  ior: 1.49,
  transparent: true,
  opacity: 0.9,
  clearcoat: 0.32,
  clearcoatRoughness: 0.07,
  attenuationColor: new THREE.Color("#d7c8ad"),
  attenuationDistance: 2.2,
  envMapIntensity: 1.9,
});

const LIQUID_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: "#160b05",
  roughness: 0.2,
  transmission: 0.08,
  thickness: 0.5,
  transparent: true,
  opacity: 0.82,
  envMapIntensity: 0.85,
});

const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#d5a23b",
  metalness: 0.97,
  roughness: 0.11,
  envMapIntensity: 2.2,
});

const GOLD_TOP_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#f2c55f",
  metalness: 0.99,
  roughness: 0.065,
  envMapIntensity: 2.45,
});

const CAP_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#080808",
  metalness: 0.05,
  roughness: 0.38,
  envMapIntensity: 0.78,
});

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

  const { scene } = useGLTF("/models/amber-touch.glb");
  const referenceTexture = useTexture("/reference/amber-touch.webp");

  const model = useMemo(() => {
    referenceTexture.colorSpace = THREE.SRGBColorSpace;
    referenceTexture.flipY = false;
    referenceTexture.anisotropy = 4;
    referenceTexture.needsUpdate = true;

    const labelMaterial = new THREE.MeshStandardMaterial({
      map: referenceTexture,
      roughness: 0.48,
      metalness: 0.025,
      side: THREE.DoubleSide,
      envMapIntensity: 0.7,
    });

    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.name === "Bottle_Glass" || object.name === "Bottle_Foot") {
        object.material = GLASS_MATERIAL;
      } else if (object.name === "Bottle_Liquid") {
        object.material = LIQUID_MATERIAL;
      } else if (
        object.name === "Neck_Gold" ||
        object.name === "Collar_Low" ||
        object.name === "Collar_High" ||
        object.name === "Cap_Gold_Rim"
      ) {
        object.material = GOLD_MATERIAL;
      } else if (object.name === "Cap_Gold_Top") {
        object.material = GOLD_TOP_MATERIAL;
      } else if (object.name === "Cap_Black_Rippled") {
        object.material = CAP_MATERIAL;
      } else if (object.name === "Label_Front") {
        object.material = labelMaterial;
      }
    });

    return clone;
  }, [scene, referenceTexture, fragrance.id]);

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
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/amber-touch.glb");
