"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SectionData } from "@/data/sections";
import { getHelixPosition } from "./HelixCurve";
import HelixCard from "./HelixCard";

interface SectionNodeProps {
  section: SectionData;
  sectionIndex: number;
  totalSections: number;
  isActive: boolean;
  selectedCardId: string | null;
  onSelectCard: (id: string | null) => void;
}

export default function SectionNode({
  section,
  sectionIndex,
  totalSections,
  isActive,
  selectedCardId,
  onSelectCard,
}: SectionNodeProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  // Position along helix: each section sits at evenly spaced t values
  const t = (sectionIndex + 1) / (totalSections + 1);
  const basePosition = getHelixPosition(t);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const pulse = isActive
      ? 0.6 + Math.sin(clock.elapsedTime * 3) * 0.3
      : 0.1;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = pulse;
    const scale = isActive ? 0.6 + Math.sin(clock.elapsedTime * 2) * 0.1 : 0.3;
    glowRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      {/* Glow sphere at the node point */}
      <mesh ref={glowRef} position={basePosition}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={section.color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Cards fanning out from this node */}
      {section.cards.map((card, i) => (
        <HelixCard
          key={card.id}
          card={card}
          position={basePosition}
          index={i}
          totalCards={section.cards.length}
          isActive={isActive}
          accentColor={section.color}
          onSelect={onSelectCard}
          selectedId={selectedCardId}
        />
      ))}
    </group>
  );
}
