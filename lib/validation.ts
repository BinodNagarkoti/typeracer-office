import { z } from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less")
    .regex(/^[a-zA-Z0-9\s._-]+$/, "Name contains invalid characters"),
  teamId: z.number().int().positive("Team ID must be a positive integer"),
});

export const AttemptSchema = z.object({
  userId: z.number().int().positive(),
  challengeId: z.number().int().positive(),
  wpm: z.number().min(0).max(300, "WPM cannot exceed 300"),
  accuracy: z.number().min(0).max(100, "Accuracy cannot exceed 100%"),
  timeTaken: z.number().min(0.1).max(600, "Time cannot exceed 600 seconds"),
  errors: z.number().int().min(0).max(1000),
  completed: z.boolean(),
});

export const ChallengeQuerySchema = z.object({
  type: z
    .enum(["speed", "accuracy", "office_jargon", "email", "code", "timed"])
    .optional(),
});

export const ScoreboardQuerySchema = z.object({
  team_id: z.string().regex(/^\d+$/).optional(),
  period: z.enum(["today", "week", "month"]).optional(),
});
