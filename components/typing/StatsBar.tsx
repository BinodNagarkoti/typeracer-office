"use client";

import { Zap, Target } from "lucide-react";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  isPaused?: boolean;
}

export function StatsBar({ wpm, accuracy, isPaused }: StatsBarProps) {
  return (
    <div
      className="flex items-center gap-6 transition-opacity duration-300"
      style={{ opacity: isPaused ? 0.35 : 1, filter: isPaused ? "grayscale(1)" : "none" }}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-[var(--warning)]" />
        <div>
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">WPM</p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{wpm}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-[var(--success)]" />
        <div>
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">
            Accuracy
          </p>
          <p className="text-2xl font-bold text-[var(--foreground)]">{accuracy}%</p>
        </div>
      </div>
    </div>
  );
}
