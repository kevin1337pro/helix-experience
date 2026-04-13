"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sections } from "@/data/sections";

interface SectionTitleProps {
  activeIndex: number;
}

export default function SectionTitle({ activeIndex }: SectionTitleProps) {
  const section = sections[activeIndex];
  if (!section) return null;

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight mb-1"
            style={{ color: section.color }}
          >
            {section.title}
          </h2>
          <p className="text-sm text-white/40 tracking-wide">
            {section.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
