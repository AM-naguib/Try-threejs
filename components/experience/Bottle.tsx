"use client";

import { RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
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

export function Bottle({
  fragrance,
  active,
  selected,
  dimmed,
  onActivate,
  onSelect,
}: BottleProps) {
  const root = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = selected
      ? { z: 1.25, y: .16, scale: 1.22, rotationY: .18 }
      : active
        ? { z: .15, y: 0, scale: 1.05, rotationY: 0 }
        : { z: dimmed ? -.65 : 0, y: 0, scale: dimmed ? .78 : .9, rotationY: 0 };

    const timeline = gsap.timeline({
      defaults: { duration: reducedMotion ? 0 : .7, ease: "power3.out" },
    });
    timeline.to(root.current.position, { z: target.z, y: target.y }, 0);
    timeline.to(root.current.scale, { x: target.scale, y: target.scale, z: target.scale }, 0);
    timeline.to(root.current.rotation, { y: target.rotationY }, 0);

    return () => {\n      timeline.kill();\n    };
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
      <RoundedBox args={[1.04, 1.58, .44]} radius={.09} smoothness={5}>
        <meshPhysicalMaterial
          color="#c8bfae"
          roughness={.08}
          metalness={.02}
          transmission={.78}
          thickness={.62}
          ior={1.45}
          transparent
          opacity={.88}
        />
      </RoundedBox>

      <RoundedBox args={[.91, 1.34, .31]} radius={.055} smoothness={4} position={[0, -.03, 0]}>
        <meshPhysicalMaterial
          color="#261b0d"
          roughness={.22}
          transmission={.22}
          thickness={.28}
          transparent
          opacity={.46}
        />
      </RoundedBox>

      <mesh position={[0, -.06, .235]}>
        <planeGeometry args={[.77, .94]} />
        <meshStandardMaterial color="#090909" roughness={.52} metalness={.06} />
      </mesh>

      {[
        [0, .405, .241, .77, .018],
        [0, -.525, .241, .77, .018],
        [-.375, -.06, .241, .018, .94],
        [.375, -.06, .241, .018, .94],
      ].map(([x, y, z, width, height], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[width, height, .012]} />
          <meshStandardMaterial color="#c89a36" metalness={.82} roughness={.2} />
        </mesh>
      ))}

      <mesh position={[0, .93, 0]}>
        <cylinderGeometry args={[.29, .31, .2, 48]} />
        <meshStandardMaterial color="#c89a36" metalness={.92} roughness={.14} />
      </mesh>

      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[.38, .38, .4, 48]} />
        <meshStandardMaterial color="#080808" roughness={.42} metalness={.08} />
      </mesh>

      {[-.12, 0, .12].map((offset) => (
        <mesh key={offset} position={[0, 1.18 + offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[.37, .028, 12, 48]} />
          <meshStandardMaterial color="#121212" roughness={.5} />
        </mesh>
      ))}

      <mesh position={[0, 1.41, 0]}>
        <cylinderGeometry args={[.34, .36, .055, 48]} />
        <meshStandardMaterial color="#c89a36" metalness={.94} roughness={.1} />
      </mesh>

      {fragrance.labelReady && (
        <mesh position={[0, -.02, .247]}>
          <ringGeometry args={[.13, .145, 48]} />
          <meshBasicMaterial color="#c89a36" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
