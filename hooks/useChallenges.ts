"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Challenge, ChallengeType } from "../types";
import { AppError } from "../lib/try-catch";

export function useChallenges(type?: ChallengeType) {
  return useQuery<Challenge[], AppError>({
    queryKey: ["challenges", type],
    queryFn: async () => {
      const url = type
        ? `/api/challenges?type=${type}`
        : "/api/challenges";
      const res = await fetch(url);
      if (!res.ok) throw new AppError("Failed to fetch challenges", "FETCH_CHALLENGES", res.status);
      return res.json();
    },
  });
}

export function useSeedChallenges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/challenges/seed", { method: "POST" });
      if (!res.ok) throw new AppError("Failed to seed challenges", "SEED_CHALLENGES", res.status);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
