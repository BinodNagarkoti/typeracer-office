"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const INACTIVITY_TIMEOUT = 5000;

export function useActivityPause(onPause: () => void, onResume: () => void) {
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (activeRef.current) {
        setIsPaused(true);
        onPause();
      }
    }, INACTIVITY_TIMEOUT);
  }, [onPause]);

  const handleActivity = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      onResume();
    }
    resetTimer();
  }, [isPaused, onResume, resetTimer]);

  const activate = useCallback(() => {
    activeRef.current = true;
    resetTimer();
  }, [resetTimer]);

  const deactivate = useCallback(() => {
    activeRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    isPaused,
    activate,
    deactivate,
    handleActivity,
  };
}
