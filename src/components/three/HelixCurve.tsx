"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HELIX_RADIUS = 3;
const HELIX_HEIGHT = 40;
const HELIX_TURNS = 5;
const POINTS = 600;

// Offset for second strand (opposite side, like DNA)
const STRAND_OFFSET = Math.PI;

function generateStrandPoints(offset: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = i / POINTS;
    const angle = t * Math.PI * 2 * HELIX_TURNS + offset;
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

function buildTubeFromPoints(points: THREE.Vector3[], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  return new THREE.TubeGeometry(curve, 400, radius, 8, false);
}

// Connector bridges between the two strands
function buildBridges() {
  const bridgeCount = HELIX_TURNS * 6; // 6 bridges per turn
  const bridges: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
  for (let i = 0; i < bridgeCount; i++) {
    const t = (i + 0.5) / bridgeCount;
    const angle1 = t * Math.PI * 2 * HELIX_TURNS;
    const angle2 = angle1 + STRAND_OFFSET;
    const y = -t * HELIX_HEIGHT + HELIX_HEIGHT / 2;
    bridges.push({
      start: new THREE.Vector3(
        Math.cos(angle1) * HELIX_RADIUS,
        y,
        Math.sin(angle1) * HELIX_RADIUS
      ),
      end: new THREE.Vector3(
        Math.cos(angle2) * HELIX_RADIUS,
        y,
        Math.sin(angle2) * HELIX_RADIUS
      ),
    });
  }
  return bridges;
}

interface HelixCurveProps {
  progress: number;
  isMobile?: boolean;
}

export default function HelixCurve({ progress, isMobile = false }: HelixCurveProps) {
  const strand1Ref = useRef<THREE.Mesh>(null);
  const strand2Ref = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);

  const { tube1, tube2, glow1, glow2, bridges } = useMemo(() => {
    const points1 = generateStrandPoints(0);
    const points2 = generateStrandPoints(STRAND_OFFSET);
    return {
      tube1: buildTubeFromPoints(points1, 0.04),
      tube2: buildTubeFromPoints(points2, 0.04),
      glow1: buildTubeFromPoints(points1, 0.12),
      glow2: buildTubeFromPoints(points2, 0.12),
      bridges: buildBridges(),
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse1 = 0.6 + Math.sin(t * 2) * 0.4;
    const pulse2 = 0.6 + Math.sin(t * 2 + 1) * 0.4;

    if (strand1Ref.current) {
      (strand1Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse1;
    }
    if (strand2Ref.current) {
      (strand2Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse2;
    }
    if (glow1Ref.current) {
      (glow1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 1.5) * 0.03;
    }
    if (glow2Ref.current) {
      (glow2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 1.5 + 1) * 0.03;
    }
  });

  return (
    <group>
      {/* === Strand 1 (cyan) === */}
      <mesh ref={strand1Ref} geometry={tube1}>
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
      <mesh ref={glow1Ref} geometry={glow1}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* === Strand 2 (purple) === */}
      <mesh ref={strand2Ref} geometry={tube2}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={glow2Ref} geometry={glow2}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* === Bridges between strands (skip on mobile) === */}
      {!isMobile &&
        bridges.map((bridge, i) => (
          <Bridge key={i} start={bridge.start} end={bridge.end} index={i} />
        ))}

      {/* Energy flow — fewer particles on mobile */}
      <EnergyStream progress={progress} offset={0} color="#00d4ff" count={isMobile ? 3 : 8} />
      <EnergyStream progress={progress} offset={STRAND_OFFSET} color="#a855f7" count={isMobile ? 3 : 8} />
    </group>
  );
}

function Bridge({
  start,
  end,
  index,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const { position, rotation, length } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return { position: mid, rotation: euler, length: len };
  }, [start, end]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 2 + index * 0.5) * 0.06;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.015, 0.015, length, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}

function EnergyStream({
  progress,
  offset,
  color,
  count,
}: {
  progress: number;
  offset: number;
  color: string;
  count: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Each particle is spaced evenly and moves at its own speed
      const spacing = i / count;
      const speed = 0.03 + i * 0.003;
      const particleT = ((progress + t * speed + spacing) % 1);

      const angle = particleT * Math.PI * 2 * HELIX_TURNS + offset;
      const y = -particleT * HELIX_HEIGHT + HELIX_HEIGHT / 2;
      const x = Math.cos(angle) * HELIX_RADIUS;
      const z = Math.sin(angle) * HELIX_RADIUS;

      dummy.position.set(x, y, z);

      // Pulse scale per particle
      const scale = 0.06 + Math.sin(t * 5 + i * 1.2) * 0.03;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export { HELIX_RADIUS, HELIX_HEIGHT, HELIX_TURNS };
