"use client";

import { useQuery } from "@tanstack/react-query";
import { ScoreboardEntry } from "../types";

export function useScoreboard(teamId?: number, period?: string) {
  return useQuery<ScoreboardEntry[]>({
    queryKey: ["scoreboard", teamId, period],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (teamId) params.set("team_id", String(teamId));
      if (period) params.set("period", period);

      const res = await fetch(`/api/scoreboard?${params}`);
      if (!res.ok) throw new Error("Failed to fetch scoreboard");
      return res.json();
    },
  });
}
