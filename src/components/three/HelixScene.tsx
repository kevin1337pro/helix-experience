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
  onActiveSection: (index: number) => void;
  onSelectCard: (id: string | null) => void;
  selectedCardId: string | null;
}

export default function HelixScene({
  progress,
  onActiveSection,
  onSelectCard,
  selectedCardId,
}: HelixSceneProps) {
  const [activeSection, setActiveSection] = useState(0);

  // Determine active section based on scroll progress
  const sectionCount = sections.length;
  useEffect(() => {
    // Map progress to section index
    // 0-0.1 = intro, then evenly distribute sections
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
        camera={{ position: [10, 22, 10], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[10, 20, 5]} intensity={0.4} />
          <pointLight
            position={[0, 10, 0]}
            intensity={0.6}
            color="#00d4ff"
            distance={30}
          />
          <pointLight
            position={[0, -10, 0]}
            intensity={0.4}
            color="#a855f7"
            distance={30}
          />

          {/* Fog for depth */}
          <fog attach="fog" args={["#030712", 15, 45]} />

          {/* The Helix */}
          <HelixCurve progress={progress} />

          {/* Section nodes with cards */}
          {sections.map((section, i) => {
            // Each section center in progress space
            const sectionCenter =
              0.08 + ((i + 0.5) / sectionCount) * 0.84;
            // proximity: 1 = exactly at section, 0 = far away
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
                selectedCardId={proximity > 0.3 ? selectedCardId : null}
                onSelectCard={onSelectCard}
              />
            );
          })}

          {/* Background particles */}
          <Particles />

          {/* Camera controller */}
          <CameraController progress={progress} />

          {/* Post-processing */}
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
        </Suspense>
      </Canvas>
    </div>
  );
}
