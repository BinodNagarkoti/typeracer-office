"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { TypingArea } from "../../../components/typing/TypingArea";
import { Timer } from "../../../components/typing/Timer";
import { StatsBar } from "../../../components/typing/StatsBar";
import { ResultModal } from "../../../components/typing/ResultModal";
import { RaceTrack } from "../../../components/typing/RaceTrack";
import { Button } from "../../../components/ui/button";
import { useTypingGame } from "../../../hooks/useTypingGame";
import { useTimer } from "../../../hooks/useTimer";
import { useActivityPause } from "../../../hooks/useActivityPause";
import { useUserContext } from "../../../components/layout/UserProvider";
import { useQuery } from "@tanstack/react-query";
import { Challenge } from "../../../types";
import { useToast } from "../../../components/ui/toast";
import { getErrorMessage } from "../../../lib/try-catch";

export default function ChallengePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserContext();
  const { error: toastError } = useToast();
  const [showResult, setShowResult] = useState(false);

  const { data: challenge, isLoading } = useQuery<Challenge>({
    queryKey: ["challenge", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/challenges/${params.id}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const {
    status,
    currentIndex,
    inputChars,
    wpm,
    accuracy,
    errors,
    targetText,
    startGame,
    handleKeyPress,
    handleBackspace,
    resetGame,
    getTimeTaken,
  } = useTypingGame(
    challenge || {
      id: 0,
      title: "",
      description: null,
      type: "speed",
      content: "",
      difficulty: "easy",
      time_limit: null,
      created_at: "",
    }
  );

  const { timeElapsed, countdown, start, stop, reset: resetTimer } = useTimer(challenge?.time_limit ?? undefined);

  const onPause = useCallback(() => {
    stop();
  }, [stop]);

  const onResume = useCallback(() => {
    start();
  }, [start]);

  const { isPaused, activate, deactivate, handleActivity } = useActivityPause(
    onPause,
    onResume
  );

  useEffect(() => {
    if (challenge?.time_limit) {
      resetTimer(challenge.time_limit);
    }
  }, [challenge, resetTimer]);

  useEffect(() => {
    if (status === "active" && countdown === 0) {
      setShowResult(true);
    }
  }, [status, countdown]);

  useEffect(() => {
    if (status === "completed") {
      setShowResult(true);
      saveAttempt();
    }
  }, [status]);

  const saveAttempt = async () => {
    if (!user || !challenge) return;

    try {
      await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          wpm,
          accuracy,
          timeTaken: getTimeTaken(),
          errors,
          completed: true,
        }),
      });
    } catch (err) {
      toastError(getErrorMessage(err));
    }
  };

  const handleStart = () => {
    startGame();
    if (challenge?.time_limit) {
      resetTimer(challenge.time_limit);
    }
    start();
    activate();
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    resetGame();
    if (challenge?.time_limit) {
      resetTimer(challenge.time_limit);
    }
    deactivate();
  };

  const handleClose = () => {
    setShowResult(false);
    deactivate();
    router.push("/challenges");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Challenge not found</p>
          <Button onClick={() => router.push("/challenges")}>
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/challenges")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {challenge.title}
          </h1>
          <p className="text-muted-foreground">{challenge.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6"
        >
          <RaceTrack
            wpm={wpm}
            accuracy={accuracy}
            isPlaying={status === "active"}
            isPaused={isPaused}
          />

          <div className="flex items-center justify-between mt-6 mb-6">
            <StatsBar wpm={wpm} accuracy={accuracy} isPaused={isPaused} />
            <Timer
              timeElapsed={timeElapsed}
              countdown={countdown}
              timeLimit={challenge.time_limit}
              isPaused={isPaused}
            />
          </div>

          <TypingArea
            targetText={targetText}
            currentIndex={currentIndex}
            inputChars={inputChars}
            onKeyPress={(char) => {
              if (status === "idle") handleStart();
              handleActivity();
              handleKeyPress(char);
            }}
            onBackspace={handleBackspace}
            disabled={status === "completed"}
            paused={isPaused}
            onResume={handleActivity}
          />

          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <Button size="lg" onClick={handleStart}>
                Start Challenge
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <ResultModal
        isOpen={showResult}
        wpm={wpm}
        accuracy={accuracy}
        timeTaken={getTimeTaken()}
        errors={errors}
        onPlayAgain={handlePlayAgain}
        onClose={handleClose}
      />
    </div>
  );
}
