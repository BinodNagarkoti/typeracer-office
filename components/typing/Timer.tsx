"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatTime } from "../../lib/typing";

interface TimerProps {
  timeElapsed: number;
  countdown: number | null;
  timeLimit?: number | null;
  isPaused?: boolean;
}

export function Timer({ timeElapsed, countdown, timeLimit, isPaused }: TimerProps) {
  const displayTime =
    countdown !== null
      ? formatTime(countdown)
      : formatTime(timeElapsed / 1000);

  const isLow = countdown !== null && countdown <= 10;
  const progress =
    timeLimit && countdown !== null
      ? ((timeLimit - countdown) / timeLimit) * 100
      : null;

  return (
    <div
      className="flex items-center gap-2 transition-opacity duration-300"
      style={{ opacity: isPaused ? 0.35 : 1, filter: isPaused ? "grayscale(1)" : "none" }}
    >
      <Clock
        className={`w-5 h-5 ${isLow ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}
      />
      <motion.span
        className={`text-2xl font-mono font-bold ${
          isLow ? "text-[var(--destructive)]" : "text-[var(--foreground)]"
        }`}
        animate={isLow ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        {displayTime}
      </motion.span>

      {progress !== null && (
        <div className="w-24 h-2 bg-[var(--secondary)] rounded-full overflow-hidden ml-2">
          <motion.div
            className="h-full bg-[var(--primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}
