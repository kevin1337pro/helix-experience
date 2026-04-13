"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useIsMobile } from "@/hooks/useIsMobile";
import HeroOverlay from "@/components/ui/HeroOverlay";
import NavigationDots from "@/components/ui/NavigationDots";
import SectionTitle from "@/components/ui/SectionTitle";
import CardDetailPanel from "@/components/ui/CardDetailPanel";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { sections } from "@/data/sections";

const HelixScene = dynamic(() => import("@/components/three/HelixScene"), {
  ssr: false,
});

export default function Home() {
  const progress = useScrollProgress();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleActiveSection = useCallback((idx: number) => {
    setActiveSection(idx);
  }, []);

  const handleSelectCard = useCallback((id: string | null) => {
    setSelectedCardId(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax — desktop only
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      (globalThis as unknown as Record<string, number>).__mouseX =
        (e.clientX / window.innerWidth - 0.5) * 2;
      (globalThis as unknown as Record<string, number>).__mouseY =
        (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const showHero = progress < 0.06;
  const currentSection = sections[activeSection];

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      {/* Scroll spacer */}
      <div className="relative" style={{ height: "600vh" }} />

      {/* 3D Scene */}
      <HelixScene
        progress={progress}
        isMobile={isMobile}
        onActiveSection={handleActiveSection}
        onSelectCard={handleSelectCard}
        selectedCardId={selectedCardId}
      />

      {/* Hero */}
      {!isLoading && <HeroOverlay visible={showHero} isMobile={isMobile} />}

      {/* Navigation dots */}
      {!isLoading && !showHero && (
        <NavigationDots activeIndex={activeSection} isMobile={isMobile} />
      )}

      {/* Section title */}
      {!isLoading && !showHero && (
        <SectionTitle activeIndex={activeSection} isMobile={isMobile} />
      )}

      {/* Card detail panel */}
      <CardDetailPanel
        selectedCardId={selectedCardId}
        onClose={() => setSelectedCardId(null)}
        accentColor={currentSection?.color ?? "#00d4ff"}
        isMobile={isMobile}
      />
    </>
  );
}
