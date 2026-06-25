export interface Team {
  id: number;
  name: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  team_id: number;
  team_name?: string;
  created_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string | null;
  type: ChallengeType;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  time_limit: number | null;
  created_at: string;
}

export type ChallengeType =
  | "speed"
  | "accuracy"
  | "office_jargon"
  | "email"
  | "code"
  | "timed";

export interface Attempt {
  id: number;
  user_id: number;
  challenge_id: number;
  wpm: number;
  accuracy: number;
  time_taken: number;
  errors: number;
  completed: number;
  created_at: string;
  user_name?: string;
  team_name?: string;
  challenge_title?: string;
}

export interface ScoreboardEntry {
  rank: number;
  user_id: number;
  user_name: string;
  team_id: number;
  team_name: string;
  best_wpm: number;
  avg_accuracy: number;
  total_attempts: number;
  last_played: string;
}

export interface TypingState {
  status: "idle" | "active" | "completed";
  currentIndex: number;
  inputChars: string[];
  errors: number;
  startTime: number | null;
  endTime: number | null;
  wpm: number;
  accuracy: number;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
