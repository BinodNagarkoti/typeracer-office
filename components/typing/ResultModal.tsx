"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Target, Clock, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

interface ResultModalProps {
  isOpen: boolean;
  wpm: number;
  accuracy: number;
  timeTaken: number;
  errors: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function ResultModal({
  isOpen,
  wpm,
  accuracy,
  timeTaken,
  errors,
  onPlayAgain,
  onClose,
}: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--card)] rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Trophy className="w-16 h-16 text-[var(--warning)]" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-6">
              Challenge Complete!
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-4 bg-[var(--warning)]/10 rounded-xl"
              >
                <Zap className="w-8 h-8 text-[var(--warning)]" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">WPM</p>
                  <p className="text-3xl font-bold text-[var(--foreground)]">{wpm}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-4 bg-[var(--success)]/10 rounded-xl"
              >
                <Target className="w-8 h-8 text-[var(--success)]" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Accuracy</p>
                  <p className="text-3xl font-bold text-[var(--foreground)]">{accuracy}%</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-4 bg-[var(--primary)]/10 rounded-xl"
              >
                <Clock className="w-8 h-8 text-[var(--primary)]" />
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Time</p>
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {timeTaken.toFixed(1)}s
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-4 bg-[var(--destructive)]/10 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[var(--destructive)] text-2xl font-bold">
                  {errors}
                </div>
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">Errors</p>
                  <p className="text-3xl font-bold text-[var(--foreground)]">{errors}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onPlayAgain}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button className="flex-1" onClick={onClose}>
                Back to Challenges
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
