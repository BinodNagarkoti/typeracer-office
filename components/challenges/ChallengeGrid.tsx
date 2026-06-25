"use client";

import { motion } from "framer-motion";
import { ChallengeCard } from "./ChallengeCard";
import { Challenge } from "../../types";

interface ChallengeGridProps {
  challenges: Challenge[];
  onSelect: (challenge: Challenge) => void;
}

export function ChallengeGrid({ challenges, onSelect }: ChallengeGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {challenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ChallengeCard
            challenge={challenge}
            onClick={() => onSelect(challenge)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
