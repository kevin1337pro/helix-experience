"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import HeroOverlay from "@/components/ui/HeroOverlay";
import NavigationDots from "@/components/ui/NavigationDots";
import SectionTitle from "@/components/ui/SectionTitle";
import CardDetailPanel from "@/components/ui/CardDetailPanel";
import { sections } from "@/data/sections";

// Dynamically import the 3D scene (no SSR — Three.js needs the browser)
const HelixScene = dynamic(() => import("@/components/three/HelixScene"), {
  ssr: false,
});

export default function Home() {
  const progress = useScrollProgress();
  const [activeSection, setActiveSection] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleActiveSection = useCallback((idx: number) => {
    setActiveSection(idx);
  }, []);

  const handleSelectCard = useCallback((id: string | null) => {
    setSelectedCardId(id);
  }, []);

  // Track mouse position for camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      (globalThis as unknown as Record<string, number>).__mouseX =
        (e.clientX / window.innerWidth - 0.5) * 2;
      (globalThis as unknown as Record<string, number>).__mouseY =
        (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const showHero = progress < 0.06;
  const currentSection = sections[activeSection];

  return (
    <>
      {/* Scroll spacer — the page needs height to scroll through */}
      <div className="relative" style={{ height: "600vh" }} />

      {/* 3D Scene (fixed, fills viewport) */}
      <HelixScene
        progress={progress}
        onActiveSection={handleActiveSection}
        onSelectCard={handleSelectCard}
        selectedCardId={selectedCardId}
      />

      {/* Hero overlay */}
      <HeroOverlay visible={showHero} />

      {/* Navigation dots (right side) */}
      {!showHero && <NavigationDots activeIndex={activeSection} />}

      {/* Section title (bottom center) */}
      {!showHero && <SectionTitle activeIndex={activeSection} />}

      {/* Card detail panel (left side) */}
      <CardDetailPanel
        selectedCardId={selectedCardId}
        onClose={() => setSelectedCardId(null)}
        accentColor={currentSection?.color ?? "#00d4ff"}
      />
    </>
  );
}
