import type { ApiResponse } from "../types";

export class AppError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "UNKNOWN_ERROR", status = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: AppError }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    if (err instanceof AppError) {
      return { data: null, error: err };
    }
    if (err instanceof Error) {
      return {
        data: null,
        error: new AppError(err.message),
      };
    }
    return {
      data: null,
      error: new AppError("An unexpected error occurred"),
    };
  }
}

export function tryCatchSync<T>(
  fn: () => T
): { data: T; error: null } | { data: null; error: AppError } {
  try {
    const data = fn();
    return { data, error: null };
  } catch (err) {
    if (err instanceof AppError) {
      return { data: null, error: err };
    }
    if (err instanceof Error) {
      return {
        data: null,
        error: new AppError(err.message),
      };
    }
    return {
      data: null,
      error: new AppError("An unexpected error occurred"),
    };
  }
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  const body: ApiResponse<T> = await res.json();

  if (!body.success) {
    throw new AppError(body.error.message, body.error.code, res.status);
  }

  return body.data;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
