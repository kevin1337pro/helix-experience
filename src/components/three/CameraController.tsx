"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getCameraPosition, getHelixPosition } from "./HelixCurve";

interface CameraControllerProps {
  progress: number;
}

export default function CameraController({ progress }: CameraControllerProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse for subtle parallax
  if (typeof window !== "undefined") {
    if (!mouseRef.current) mouseRef.current = { x: 0, y: 0 };
  }

  useFrame(() => {
    // Get target camera position along the helix
    const camPos = getCameraPosition(progress);
    const lookAtPos = getHelixPosition(progress);

    // Add subtle mouse parallax
    const mx =
      typeof window !== "undefined"
        ? ((globalThis as unknown as Record<string, number>).__mouseX ?? 0) * 0.3
        : 0;
    const my =
      typeof window !== "undefined"
        ? ((globalThis as unknown as Record<string, number>).__mouseY ?? 0) * 0.2
        : 0;

    // Smoothly interpolate camera position
    camera.position.lerp(
      new THREE.Vector3(camPos.x + mx, camPos.y + my, camPos.z),
      0.04
    );

    // Smoothly look at the helix center point
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);

    const newLookAt = currentLookAt.lerp(lookAtPos, 0.06);
    camera.lookAt(newLookAt);
  });

  return null;
}
