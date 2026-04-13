"use client";

import { motion, AnimatePresence } from "framer-motion";
import { sections, type CardData } from "@/data/sections";

interface CardDetailPanelProps {
  selectedCardId: string | null;
  onClose: () => void;
  accentColor: string;
}

function findCard(id: string): CardData | undefined {
  for (const section of sections) {
    const card = section.cards.find((c) => c.id === id);
    if (card) return card;
  }
  return undefined;
}

export default function CardDetailPanel({
  selectedCardId,
  onClose,
  accentColor,
}: CardDetailPanelProps) {
  const card = selectedCardId ? findCard(selectedCardId) : null;

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 max-w-sm"
        >
          <div
            className="relative rounded-2xl border border-white/10 p-8 backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(17,24,39,0.7) 100%)`,
              boxShadow: `0 0 40px ${accentColor}20, 0 0 80px ${accentColor}10`,
            }}
          >
            {/* Accent line at top */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: accentColor }}
            />

            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {card.description}
            </p>
            {card.detail && (
              <p className="text-white/50 text-xs leading-relaxed mb-6">
                {card.detail}
              </p>
            )}

            {card.cta && (
              <a
                href={card.cta.href}
                className="inline-block px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105"
                style={{ background: accentColor }}
              >
                {card.cta.label}
              </a>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
