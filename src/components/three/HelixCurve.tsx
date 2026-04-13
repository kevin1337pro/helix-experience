"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HELIX_RADIUS = 3;
const HELIX_HEIGHT = 40;
const HELIX_TURNS = 5;
const POINTS = 600;

export function generateHelixPoints() {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = i / POINTS;
    const angle = t * Math.PI * 2 * HELIX_TURNS;
    const x = Math.cos(angle) * HELIX_RADIUS;
    const y = -t * HELIX_HEIGHT + HELIX_HEIGHT / 2;
    const z = Math.sin(angle) * HELIX_RADIUS;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

export function getHelixPosition(t: number) {
  const angle = t * Math.PI * 2 * HELIX_TURNS;
  const x = Math.cos(angle) * HELIX_RADIUS;
  const y = -t * HELIX_HEIGHT + HELIX_HEIGHT / 2;
  const z = Math.sin(angle) * HELIX_RADIUS;
  return new THREE.Vector3(x, y, z);
}

export function getCameraPosition(t: number) {
  const angle = t * Math.PI * 2 * HELIX_TURNS;
  const cameraRadius = HELIX_RADIUS + 6;
  const x = Math.cos(angle + 0.5) * cameraRadius;
  const y = -t * HELIX_HEIGHT + HELIX_HEIGHT / 2 + 1.5;
  const z = Math.sin(angle + 0.5) * cameraRadius;
  return new THREE.Vector3(x, y, z);
}

interface HelixCurveProps {
  progress: number;
}

export default function HelixCurve({ progress }: HelixCurveProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const { tubeGeometry, glowGeometry } = useMemo(() => {
    const points = generateHelixPoints();
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
    const tube = new THREE.TubeGeometry(curve, 400, 0.04, 8, false);
    const glow = new THREE.TubeGeometry(curve, 400, 0.12, 8, false);
    return { tubeGeometry: tube, glowGeometry: glow };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const pulse = 0.6 + Math.sin(clock.elapsedTime * 2) * 0.4;
      mat.emissiveIntensity = pulse;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group>
      {/* Main helix tube */}
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Glow tube */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Energy particle travelling along helix */}
      <EnergyParticle progress={progress} />
    </group>
  );
}

function EnergyParticle({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (progress + clock.elapsedTime * 0.02) % 1;
    const pos = getHelixPosition(t);
    ref.current.position.copy(pos);
    const scale = 0.1 + Math.sin(clock.elapsedTime * 6) * 0.05;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
    </mesh>
  );
}

export { HELIX_RADIUS, HELIX_HEIGHT, HELIX_TURNS };
