"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
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

export function Bottle({
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
  const bottleTexture = useTexture("/reference/amber-touch-cutout.webp");

  bottleTexture.colorSpace = THREE.SRGBColorSpace;
  bottleTexture.anisotropy = 8;
  bottleTexture.minFilter = THREE.LinearMipmapLinearFilter;
  bottleTexture.magFilter = THREE.LinearFilter;

  useFrame((_, delta) => {
    if (!swingRoot.current) return;

    const phaseScale = 0.9 + Math.sin(index * 1.15) * 0.1;
    const targetSwing = selected
      ? 0
      : THREE.MathUtils.clamp(-motion * 0.075 * phaseScale, -0.13, 0.13);
    const targetTwist = selected
      ? 0
      : THREE.MathUtils.clamp(motion * 0.008 * phaseScale, -0.016, 0.016);

    swingRoot.current.rotation.z = THREE.MathUtils.damp(
      swingRoot.current.rotation.z,
      targetSwing,
      7.5,
      delta,
    );
    swingRoot.current.rotation.y = THREE.MathUtils.damp(
      swingRoot.current.rotation.y,
      targetTwist,
      10,
      delta,
    );
  });

  useLayoutEffect(() => {
    if (!transformRoot.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = selected
      ? { z: 1.5, y: 0.12, scale: 1.25 }
      : active
        ? { z: 0.18, y: 0, scale: 1.055 }
        : { z: dimmed ? -0.82 : 0, y: 0, scale: dimmed ? 0.74 : 0.9 };

    const timeline = gsap.timeline({
      defaults: { duration: reducedMotion ? 0 : 0.76, ease: "power3.out" },
    });

    timeline.to(transformRoot.current.position, { z: target.z, y: target.y }, 0);
    timeline.to(
      transformRoot.current.scale,
      { x: target.scale, y: target.scale, z: target.scale },
      0,
    );

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
        <mesh position={[0, 0.39, 0]}>
          <planeGeometry args={[1.368, 2.6]} />
          <meshBasicMaterial
            map={bottleTexture}
            transparent
            alphaTest={0.015}
            depthWrite
            depthTest
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

useTexture.preload("/reference/amber-touch-cutout.webp");
