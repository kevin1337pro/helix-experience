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

const MAX_MOBILE_CARDS = 2;

interface SectionNodeProps {
  section: SectionData;
  sectionIndex: number;
  totalSections: number;
  proximity: number;
  isMobile?: boolean;
  selectedCardId: string | null;
  onSelectCard: (id: string | null) => void;
}

export default function SectionNode({
  section,
  sectionIndex,
  totalSections,
  proximity,
  isMobile = false,
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

  const fanAmount = isActive
    ? 1
    : isApproaching
    ? (proximity - 0.2) / 0.3
    : 0;

  // On mobile: only show the first N cards
  const visibleCards = isMobile
    ? section.cards.slice(0, MAX_MOBILE_CARDS)
    : section.cards;

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const t = clock.elapsedTime;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;

    const basePulse = proximity * 0.5;
    const pulse = basePulse + Math.sin(t * 3) * proximity * 0.2;
    mat.opacity = pulse;

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

      {/* Cards — limited on mobile */}
      {visibleCards.map((card, i) => (
        <HelixCard
          key={card.id}
          card={card}
          position={basePosition}
          index={i}
          totalCards={visibleCards.length}
          proximity={proximity}
          fanAmount={fanAmount}
          isActive={isActive}
          isMobile={isMobile}
          accentColor={section.color}
          onSelect={onSelectCard}
          selectedId={selectedCardId}
        />
      ))}
    </group>
  );
}
