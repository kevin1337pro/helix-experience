"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getCameraPosition, getHelixPosition } from "./HelixCurve";

interface CameraControllerProps {
  progress: number;
  isMobile?: boolean;
}

export default function CameraController({
  progress,
  isMobile = false,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    const camPos = getCameraPosition(progress);
    const lookAtPos = getHelixPosition(progress);

    // Mouse parallax — desktop only
    let mx = 0;
    let my = 0;
    if (!isMobile && typeof window !== "undefined") {
      mx =
        ((globalThis as unknown as Record<string, number>).__mouseX ?? 0) *
        0.3;
      my =
        ((globalThis as unknown as Record<string, number>).__mouseY ?? 0) *
        0.2;
    }

    // On mobile: camera is closer to the helix for better card visibility
    const mobileOffset = isMobile ? -1.5 : 0;

    camera.position.lerp(
      new THREE.Vector3(
        camPos.x + mx + (isMobile ? camPos.x * mobileOffset * 0.15 : 0),
        camPos.y + my,
        camPos.z + (isMobile ? camPos.z * mobileOffset * 0.15 : 0)
      ),
      0.04
    );

    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);

    const newLookAt = currentLookAt.lerp(lookAtPos, 0.06);
    camera.lookAt(newLookAt);
  });

  return null;
}
