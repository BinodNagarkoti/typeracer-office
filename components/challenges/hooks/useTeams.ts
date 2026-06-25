"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Team } from "../types";

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });
}
