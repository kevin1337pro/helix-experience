"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 5 sections + intro + outro = 7 snap points
const SECTION_COUNT = 5;
const SNAP_POINTS = [0];
for (let i = 0; i < SECTION_COUNT; i++) {
  // Intro takes 0-0.08, sections spread across 0.08-0.92, outro 0.92-1
  SNAP_POINTS.push(0.08 + ((i + 0.5) / SECTION_COUNT) * 0.84);
}
SNAP_POINTS.push(1);

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    // Create a ScrollTrigger that maps the full page scroll to 0-1 progress
    triggerRef.current = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8, // smooth scrubbing with 0.8s delay
      snap: {
        snapTo: SNAP_POINTS,
        duration: { min: 0.3, max: 0.8 },
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      triggerRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return progress;
}
