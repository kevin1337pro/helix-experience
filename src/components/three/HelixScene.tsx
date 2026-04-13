"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import HelixCurve from "./HelixCurve";
import SectionNode from "./SectionNode";
import CameraController from "./CameraController";
import Particles from "./Particles";
import { sections } from "@/data/sections";

interface HelixSceneProps {
  progress: number;
  isMobile: boolean;
  onActiveSection: (index: number) => void;
  onSelectCard: (id: string | null) => void;
  selectedCardId: string | null;
}

export default function HelixScene({
  progress,
  isMobile,
  onActiveSection,
  onSelectCard,
  selectedCardId,
}: HelixSceneProps) {
  const [activeSection, setActiveSection] = useState(0);

  const sectionCount = sections.length;
  useEffect(() => {
    const contentProgress = Math.max(0, (progress - 0.08) / 0.84);
    const idx = Math.min(
      sectionCount - 1,
      Math.max(0, Math.floor(contentProgress * sectionCount))
    );
    setActiveSection(idx);
    onActiveSection(idx);
  }, [progress, sectionCount, onActiveSection]);

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{
          position: [10, 22, 10],
          fov: isMobile ? 65 : 55,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: !isMobile,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={isMobile ? 0.25 : 0.15} />
          <directionalLight position={[10, 20, 5]} intensity={0.4} />
          <pointLight
            position={[0, 10, 0]}
            intensity={0.6}
            color="#00d4ff"
            distance={30}
          />
          {!isMobile && (
            <pointLight
              position={[0, -10, 0]}
              intensity={0.4}
              color="#a855f7"
              distance={30}
            />
          )}

          {/* Fog */}
          <fog attach="fog" args={["#030712", isMobile ? 12 : 15, isMobile ? 35 : 45]} />

          {/* The Helix */}
          <HelixCurve progress={progress} isMobile={isMobile} />

          {/* Section nodes with cards */}
          {sections.map((section, i) => {
            const sectionCenter =
              0.08 + ((i + 0.5) / sectionCount) * 0.84;
            const distance = Math.abs(progress - sectionCenter);
            const sectionWidth = 0.84 / sectionCount;
            const proximity = Math.max(
              0,
              1 - distance / (sectionWidth * 0.8)
            );

            return (
              <SectionNode
                key={section.id}
                section={section}
                sectionIndex={i}
                totalSections={sectionCount}
                proximity={proximity}
                isMobile={isMobile}
                selectedCardId={proximity > 0.3 ? selectedCardId : null}
                onSelectCard={onSelectCard}
              />
            );
          })}

          {/* Background particles — fewer on mobile */}
          <Particles count={isMobile ? 80 : 300} />

          {/* Camera controller */}
          <CameraController progress={progress} isMobile={isMobile} />

          {/* Post-processing — lighter on mobile */}
          {isMobile ? (
            <EffectComposer>
              <Bloom
                intensity={0.8}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <Vignette
                offset={0.3}
                darkness={0.5}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          ) : (
            <EffectComposer>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <Vignette
                offset={0.3}
                darkness={0.7}
                blendFunction={BlendFunction.NORMAL}
              />
              <ChromaticAberration
                offset={new THREE.Vector2(0.0006, 0.0006)}
                blendFunction={BlendFunction.NORMAL}
                radialModulation={false}
                modulationOffset={0.0}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
