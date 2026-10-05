"use client";

import { useTexture } from "@react-three/drei";
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

const CROP = {
  left: 429 / 1536,
  right: 1054 / 1536,
  top: 84 / 1536,
  bottom: 1272 / 1536,
};

const LABEL_BOX = {
  left: 505 / 1536,
  right: 982 / 1536,
  top: 430 / 1536,
  bottom: 1130 / 1536,
};

const VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  varying vec2 vUv;

  const float cropLeft = ${CROP.left.toFixed(8)};
  const float cropRight = ${CROP.right.toFixed(8)};
  const float cropTop = ${CROP.top.toFixed(8)};
  const float cropBottom = ${CROP.bottom.toFixed(8)};

  const float labelLeft = ${LABEL_BOX.left.toFixed(8)};
  const float labelRight = ${LABEL_BOX.right.toFixed(8)};
  const float labelTop = ${LABEL_BOX.top.toFixed(8)};
  const float labelBottom = ${LABEL_BOX.bottom.toFixed(8)};

  void main() {
    vec2 sourceUv = vec2(
      mix(cropLeft, cropRight, vUv.x),
      mix(1.0 - cropBottom, 1.0 - cropTop, vUv.y)
    );

    vec4 src = texture2D(uMap, sourceUv);

    float darkest = min(min(src.r, src.g), src.b);
    float lightest = max(max(src.r, src.g), src.b);
    float darkness = 1.0 - darkest;
    float chroma = lightest - darkest;

    float alpha = smoothstep(0.012, 0.17, max(darkness, chroma * 0.8));

    vec2 sourcePxUv = vec2(sourceUv.x, 1.0 - sourceUv.y);
    bool insideLabel =
      sourcePxUv.x >= labelLeft &&
      sourcePxUv.x <= labelRight &&
      sourcePxUv.y >= labelTop &&
      sourcePxUv.y <= labelBottom;

    if (insideLabel) {
      alpha = 1.0;
    }

    if (alpha < 0.01) discard;

    vec3 rgb = src.rgb;
    if (!insideLabel) {
      rgb = clamp(
        (src.rgb - vec3(1.0 - alpha)) / max(alpha, 0.08),
        0.0,
        1.0
      );
    }

    gl_FragColor = vec4(rgb, alpha);
  }
`;

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
  const referenceTexture = useTexture("/reference/amber-touch.webp");

  const spriteMaterial = useMemo(() => {
    referenceTexture.colorSpace = THREE.SRGBColorSpace;
    referenceTexture.anisotropy = 8;
    referenceTexture.minFilter = THREE.LinearMipmapLinearFilter;
    referenceTexture.magFilter = THREE.LinearFilter;
    referenceTexture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: referenceTexture },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
    });

    material.toneMapped = false;
    return material;
  }, [referenceTexture]);

  useFrame((_, delta) => {
    if (!swingRoot.current) return;

    const phaseScale = 0.9 + Math.sin(index * 1.15) * 0.1;
    const targetSwing = selected
      ? 0
      : THREE.MathUtils.clamp(-motion * 0.075 * phaseScale, -0.13, 0.13);
    const targetTwist = selected
      ? 0
      : THREE.MathUtils.clamp(motion * 0.012 * phaseScale, -0.025, 0.025);

    swingRoot.current.rotation.z = THREE.MathUtils.damp(
      swingRoot.current.rotation.z,
      targetSwing,
      7.5,
      delta,
    );
    swingRoot.current.rotation.y = THREE.MathUtils.damp(
      swingRoot.current.rotation.y,
      targetTwist,
      9.5,
      delta,
    );
  });

  useLayoutEffect(() => {
    if (!transformRoot.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = selected
      ? { z: 1.5, y: 0.12, scale: 1.25, rotationY: 0.035 }
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

  useLayoutEffect(() => {
    return () => {
      spriteMaterial.dispose();
    };
  }, [spriteMaterial]);

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
          <primitive object={spriteMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

useTexture.preload("/reference/amber-touch.webp");
