"use client";

import { useState, useCallback, useRef } from "react";
import { calculateWPM, calculateAccuracy } from "../lib/typing";
import { TypingState, Challenge } from "../types";

const initialState: TypingState = {
  status: "idle",
  currentIndex: 0,
  inputChars: [],
  errors: 0,
  startTime: null,
  endTime: null,
  wpm: 0,
  accuracy: 100,
};

export function useTypingGame(challenge: Challenge) {
  const [state, setState] = useState<TypingState>(initialState);
  const targetText = challenge.content;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setState({
      status: "active",
      currentIndex: 0,
      inputChars: [],
      errors: 0,
      startTime: Date.now(),
      endTime: null,
      wpm: 0,
      accuracy: 100,
    });
  }, []);

  const handleKeyPress = useCallback(
    (char: string) => {
      setState((prev) => {
        if (prev.status !== "active") return prev;

        const newIndex = prev.currentIndex + 1;
        const isCorrect = char === targetText[prev.currentIndex];
        const newErrors = isCorrect ? prev.errors : prev.errors + 1;
        const newInputChars = [...prev.inputChars, char];

        const timeElapsed = Date.now() - (prev.startTime || Date.now());
        const newWpm = calculateWPM(newIndex, timeElapsed);
        const newAccuracy = calculateAccuracy(
          newIndex - newErrors,
          newIndex
        );

        const isComplete = newIndex >= targetText.length;

        return {
          ...prev,
          currentIndex: newIndex,
          inputChars: newInputChars,
          errors: newErrors,
          wpm: newWpm,
          accuracy: newAccuracy,
          status: isComplete ? "completed" : "active",
          endTime: isComplete ? Date.now() : null,
        };
      });
    },
    [targetText]
  );

  const handleBackspace = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "active" || prev.currentIndex === 0) return prev;

      const newIndex = prev.currentIndex - 1;
      const wasCorrect =
        prev.inputChars[newIndex] === targetText[newIndex];
      const newErrors = wasCorrect ? prev.errors : prev.errors - 1;
      const newInputChars = prev.inputChars.slice(0, -1);

      const timeElapsed = Date.now() - (prev.startTime || Date.now());
      const newWpm = calculateWPM(newIndex, timeElapsed);
      const newAccuracy = calculateAccuracy(newIndex - newErrors, newIndex);

      return {
        ...prev,
        currentIndex: newIndex,
        inputChars: newInputChars,
        errors: newErrors,
        wpm: newWpm,
        accuracy: newAccuracy,
      };
    });
  }, [targetText]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const getTimeTaken = useCallback(() => {
    if (!state.startTime) return 0;
    const end = state.endTime || Date.now();
    return (end - state.startTime) / 1000;
  }, [state.startTime, state.endTime]);

  return {
    ...state,
    targetText,
    startGame,
    handleKeyPress,
    handleBackspace,
    resetGame,
    getTimeTaken,
  };
}
