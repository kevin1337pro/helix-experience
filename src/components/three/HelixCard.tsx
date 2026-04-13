"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { CardData } from "@/data/sections";

interface HelixCardProps {
  card: CardData;
  position: THREE.Vector3;
  index: number;
  totalCards: number;
  proximity: number; // 0-1 how close the scroll is
  fanAmount: number; // 0-1 how much the cards should fan out
  isActive: boolean; // fully active (clickable)
  isMobile?: boolean;
  accentColor: string;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
}

export default function HelixCard({
  card,
  position,
  index,
  totalCards,
  proximity,
  fanAmount,
  isActive,
  isMobile = false,
  accentColor,
  onSelect,
  selectedId,
}: HelixCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedId === card.id;
  const isFaded = selectedId !== null && !isSelected;

  // Fan-out angle for this card within the cluster
  const fanAngle =
    ((index - (totalCards - 1) / 2) / Math.max(totalCards - 1, 1)) *
    (Math.PI * 0.6);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.elapsedTime;

    // --- Position ---
    // Mobile: wider fan so fewer cards have more space
    const fanRadius = fanAmount * (isMobile ? 2.8 : 2.2);
    const targetX = position.x + Math.cos(fanAngle) * fanRadius;
    const targetY =
      position.y +
      fanAmount * (index * 0.3 - (totalCards - 1) * 0.15);
    const targetZ = position.z + Math.sin(fanAngle) * fanRadius;

    // Forward push when selected
    const selectPush = isSelected ? 1.5 : 0;

    groupRef.current.position.lerp(
      new THREE.Vector3(
        targetX + (isSelected ? Math.cos(fanAngle) * selectPush : 0),
        targetY,
        targetZ + (isSelected ? Math.sin(fanAngle) * selectPush : 0)
      ),
      0.06
    );

    // Subtle floating when visible
    if (fanAmount > 0.1) {
      groupRef.current.position.y +=
        Math.sin(t * 1.5 + index) * 0.003 * fanAmount;
    }

    // --- Scale ---
    // Phase 1 (approach): cards begin to appear small
    // Phase 2 (active): cards reach full size
    // Selected: slightly larger
    let targetScale = 0;
    if (proximity > 0.15) {
      const baseScale = Math.min(1, (proximity - 0.15) / 0.4);
      const mobileBoost = isMobile ? 1.15 : 1;
      targetScale = isSelected
        ? baseScale * 1.15 * mobileBoost
        : hovered
        ? baseScale * 1.05 * mobileBoost
        : baseScale * 0.9 * mobileBoost;
    }

    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    groupRef.current.scale.setScalar(newScale);

    // --- Rotation ---
    // Cards slowly rotate to face outward as they fan
    const targetRotY = fanAngle + Math.PI;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      fanAmount > 0.1 ? targetRotY : targetRotY + Math.PI * 0.5,
      0.05
    );
  });

  const isVisible = proximity > 0.15;

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Card mesh */}
      <mesh
        onPointerEnter={(e) => {
          if (!isActive) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          if (!isActive) return;
          e.stopPropagation();
          onSelect(isSelected ? null : card.id);
        }}
      >
        <boxGeometry args={[1.8, 2.2, 0.08]} />
        <meshPhysicalMaterial
          color="#111827"
          transparent
          opacity={isFaded ? 0.3 : 0.85}
          roughness={0.1}
          metalness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={accentColor}
          emissiveIntensity={
            isSelected ? 0.4 : hovered ? 0.25 : proximity * 0.1
          }
        />
      </mesh>

      {/* Card edge glow — intensifies during approach */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.85, 2.25, 0.01]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={
            isSelected
              ? 0.5
              : hovered
              ? 0.35
              : proximity * 0.2
          }
        />
      </mesh>

      {/* HTML content on the card */}
      {isVisible && (
        <Html
          transform
          occlude={false}
          position={[0, 0, 0.06]}
          style={{
            width: "160px",
            pointerEvents: "none",
            userSelect: "none",
            opacity: fanAmount,
            transition: "opacity 0.3s",
          }}
        >
          <div
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>
              {card.icon}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "4px",
                letterSpacing: "0.02em",
              }}
            >
              {card.title}
            </div>
            {isSelected && (
              <div
                style={{
                  fontSize: "10px",
                  opacity: 0.7,
                  lineHeight: 1.4,
                  marginTop: "4px",
                }}
              >
                {card.description}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
