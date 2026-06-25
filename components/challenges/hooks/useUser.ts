"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../types";

export function useUser() {
  return useQuery<{ user: User }>({
    queryKey: ["user"],
    queryFn: async () => {
      const stored = localStorage.getItem("typing-user");
      if (!stored) throw new Error("No user");

      const { name, teamId } = JSON.parse(stored);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, teamId }),
      });
      if (!res.ok) throw new Error("Failed to get user");
      return res.json();
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, teamId }: { name: string; teamId: number }) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, teamId }),
      });
      if (!res.ok) throw new Error("Failed to login");
      const data = await res.json();
      localStorage.setItem("typing-user", JSON.stringify({ name, teamId }));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("typing-user");
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
}
