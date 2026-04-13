"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712]"
        >
          {/* Animated helix loader */}
          <div className="relative w-16 h-32 mb-8">
            <motion.div
              className="absolute left-1 w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                y: [0, 120, 0],
                x: [0, 12, 0],
                scale: [1, 0.6, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ boxShadow: "0 0 12px #00d4ff" }}
            />
            <motion.div
              className="absolute right-1 w-2 h-2 rounded-full bg-purple-500"
              animate={{
                y: [120, 0, 120],
                x: [12, 0, 12],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ boxShadow: "0 0 12px #a855f7" }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs uppercase tracking-[0.3em] text-white/40"
          >
            Initializing
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
