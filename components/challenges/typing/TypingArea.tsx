"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCharStatus } from "../../lib/typing";

const WRONG_THRESHOLD = 3;

interface TypingAreaProps {
  targetText: string;
  currentIndex: number;
  inputChars: string[];
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  disabled: boolean;
  paused?: boolean;
  onResume?: () => void;
}

export function TypingArea({
  targetText,
  currentIndex,
  inputChars,
  onKeyPress,
  onBackspace,
  disabled,
  paused,
  onResume,
}: TypingAreaProps) {
  const [hintKey, setHintKey] = useState<string | undefined>();
  const wrongCounts = useRef<Map<string, number>>(new Map());

  const currentChar = targetText[currentIndex];

  useEffect(() => {
    if (currentChar && wrongCounts.current.get(currentChar)!) {
      const count = wrongCounts.current.get(currentChar)!;
      if (count >= WRONG_THRESHOLD) {
        setHintKey(currentChar);
      }
    }
  }, [currentChar, currentIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      if (paused) {
        e.preventDefault();
        onResume?.();
        return;
      }

      const key = e.key;

      if (key === "Backspace") {
        e.preventDefault();
        onBackspace();
        return;
      }

      if (key.length === 1) {
        e.preventDefault();

        if (currentIndex === 0) {
          setHintKey(undefined);
          wrongCounts.current.clear();
        }

        const expected = targetText[currentIndex];
        const isCorrect = key === expected;

        if (!isCorrect) {
          const count = (wrongCounts.current.get(expected) || 0) + 1;
          wrongCounts.current.set(expected, count);
        } else {
          if (wrongCounts.current.has(expected)) {
            wrongCounts.current.delete(expected);
            if (hintKey === expected) setHintKey(undefined);
          }
        }

        onKeyPress(key);
      }
    },
    [disabled, paused, onResume, targetText, currentIndex, onKeyPress, onBackspace, hintKey]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative">
      <div className="font-mono text-lg leading-relaxed p-6 rounded-xl bg-[var(--muted)] border border-[var(--border)] select-none">
        {targetText.split("").map((char, index) => {
          const status = getCharStatus(
            index,
            currentIndex,
            inputChars,
            targetText
          );

          return (
            <motion.span
              key={index}
              initial={false}
              animate={
                status === "incorrect"
                  ? {
                      x: [0, -2, 2, -1, 1, 0],
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
              style={{
                color:
                  status === "correct"
                    ? "var(--success)"
                    : status === "incorrect"
                    ? "var(--destructive)"
                    : status === "current"
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                backgroundColor:
                  status === "current"
                    ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                    : status === "incorrect"
                    ? "color-mix(in srgb, var(--destructive) 15%, transparent)"
                    : "transparent",
              }}
              className={
                status === "current"
                  ? "border-b-2 border-[var(--primary)]"
                  : status === "incorrect"
                  ? "underline decoration-[var(--destructive)]"
                  : ""
              }
            >
              {char}
            </motion.span>
          );
        })}
      </div>

      <AnimatePresence>
        {hintKey && !disabled && !paused && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-sm text-[var(--warning)] bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg px-3 py-2"
          >
            <span className="font-semibold">Hint:</span>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--warning)]/20 font-mono font-bold">{`"${hintKey}"`}</kbd>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--muted)]/90 rounded-xl backdrop-blur-sm z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mb-3"
              >
                ⏸
              </motion.div>
              <p className="text-lg font-semibold text-[var(--foreground)] mb-1">
                Game Paused
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Press any key to resume
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {disabled && currentIndex === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]/80 rounded-xl">
          <p className="text-[var(--muted-foreground)] text-lg">
            Click here and start typing...
          </p>
        </div>
      )}
    </div>
  );
}
