"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sections } from "@/data/sections";

interface SectionTitleProps {
  activeIndex: number;
  isMobile?: boolean;
}

export default function SectionTitle({
  activeIndex,
  isMobile = false,
}: SectionTitleProps) {
  const section = sections[activeIndex];
  if (!section) return null;

  return (
    <div
      className={`fixed z-50 text-center pointer-events-none ${
        isMobile
          ? "bottom-36 left-4 right-4"
          : "bottom-12 left-1/2 -translate-x-1/2"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className={`font-bold tracking-tight mb-1 ${
              isMobile ? "text-2xl" : "text-3xl md:text-4xl"
            }`}
            style={{ color: section.color }}
          >
            {section.title}
          </h2>
          <p
            className={`text-white/40 tracking-wide ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            {section.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
