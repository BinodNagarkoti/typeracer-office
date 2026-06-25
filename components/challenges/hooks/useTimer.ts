"use client";

import { useState, useEffect, useCallback } from "react";

export function useTimer(initialTime?: number) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(
    initialTime ?? null
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);

      if (countdown !== null) {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, countdown]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setTimeElapsed(0);
    setIsRunning(false);
    setCountdown(newTime ?? initialTime ?? null);
  }, [initialTime]);

  return {
    timeElapsed,
    isRunning,
    countdown,
    start,
    stop,
    reset,
  };
}
