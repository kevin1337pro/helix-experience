"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HeroOverlayProps {
  visible: boolean;
  isMobile?: boolean;
}

export default function HeroOverlay({
  visible,
  isMobile = false,
}: HeroOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none ${
            isMobile ? "px-6" : ""
          }`}
        >
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`font-bold tracking-tight text-white mb-4 ${
              isMobile ? "text-4xl text-center" : "text-5xl md:text-7xl"
            }`}
          >
            Helix
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {" "}Experience
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`text-white/60 mb-12 tracking-wide ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            Explore the structure
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {isMobile ? "Swipe up" : "Scroll to enter"}
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
