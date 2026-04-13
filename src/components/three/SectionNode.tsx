"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SectionData } from "@/data/sections";
import { getHelixPosition } from "./HelixCurve";
import HelixCard from "./HelixCard";

/**
 * proximity: 0 = far away, 1 = exactly at this section
 *
 * Phase mapping:
 *   0.0 – 0.2  = dormant (cards hidden inside helix)
 *   0.2 – 0.5  = approach (glow starts, cards begin to emerge)
 *   0.5 – 1.0  = active (cards fully fanned out, clickable)
 *   falling back = transition (cards retract into helix)
 */

interface SectionNodeProps {
  section: SectionData;
  sectionIndex: number;
  totalSections: number;
  proximity: number;
  selectedCardId: string | null;
  onSelectCard: (id: string | null) => void;
}

export default function SectionNode({
  section,
  sectionIndex,
  totalSections,
  proximity,
  selectedCardId,
  onSelectCard,
}: SectionNodeProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  // Position along helix
  const t = (sectionIndex + 1) / (totalSections + 1);
  const basePosition = getHelixPosition(t);

  // Phase calculations
  const isApproaching = proximity > 0.2;
  const isActive = proximity > 0.5;

  // Fan amount: 0 when dormant, ramps up during approach, full at active
  const fanAmount = isActive
    ? 1
    : isApproaching
    ? (proximity - 0.2) / 0.3 // 0→1 during approach phase
    : 0;

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = clock.elapsedTime;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;

    // Glow intensity follows proximity
    const basePulse = proximity * 0.5;
    const pulse = basePulse + Math.sin(t * 3) * proximity * 0.2;
    mat.opacity = pulse;

    // Scale grows as user approaches
    const scale = 0.2 + proximity * 0.5 + Math.sin(t * 2) * proximity * 0.08;
    glowRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      {/* Glow sphere at the node point */}
      <mesh ref={glowRef} position={basePosition}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={section.color} transparent opacity={0.1} />
      </mesh>

      {/* Cards */}
      {section.cards.map((card, i) => (
        <HelixCard
          key={card.id}
          card={card}
          position={basePosition}
          index={i}
          totalCards={section.cards.length}
          proximity={proximity}
          fanAmount={fanAmount}
          isActive={isActive}
          accentColor={section.color}
          onSelect={onSelectCard}
          selectedId={selectedCardId}
        />
      ))}
    </group>
  );
}
