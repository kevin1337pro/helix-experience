"use client";

import { motion } from "framer-motion";
import { sections } from "@/data/sections";

interface NavigationDotsProps {
  activeIndex: number;
  isMobile?: boolean;
}

export default function NavigationDots({
  activeIndex,
  isMobile = false,
}: NavigationDotsProps) {
  // Mobile: horizontal dots at bottom, no labels
  if (isMobile) {
    return (
      <nav className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {sections.map((section, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={section.id}
              className="relative flex items-center justify-center w-3 h-3"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-ring-mobile"
                  className="absolute w-5 h-5 rounded-full border"
                  style={{ borderColor: section.color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? "scale-100" : "scale-75 opacity-40"
                }`}
                style={{
                  backgroundColor: isActive ? section.color : "#ffffff",
                }}
              />
            </div>
          );
        })}
      </nav>
    );
  }

  // Desktop: vertical dots on right side with labels
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {sections.map((section, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={section.id} className="group flex items-center gap-3">
            <span
              className={`text-xs tracking-wider uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 ${
                isActive
                  ? "!opacity-100 !translate-x-0 text-white"
                  : "text-white/50"
              }`}
            >
              {section.title}
            </span>
            <div className="relative flex items-center justify-center w-3 h-3">
              {isActive && (
                <motion.div
                  layoutId="nav-ring"
                  className="absolute w-5 h-5 rounded-full border"
                  style={{ borderColor: section.color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? "scale-100" : "scale-75 opacity-40"
                }`}
                style={{
                  backgroundColor: isActive ? section.color : "#ffffff",
                }}
              />
            </div>
          </div>
        );
      })}
    </nav>
  );
}
