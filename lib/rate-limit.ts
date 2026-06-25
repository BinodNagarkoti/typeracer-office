import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMITS = {
  read: { windowMs: 60_000, maxRequests: 60 },
  write: { windowMs: 60_000, maxRequests: 15 },
  seed: { windowMs: 3_600_000, maxRequests: 3 },
};

type RateLimitType = keyof typeof RATE_LIMITS;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(
  key: string,
  type: RateLimitType = "read"
): { allowed: boolean; retryAfter: number } {
  const config = RATE_LIMITS[type];
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

export function rateLimit(ip: string, type: RateLimitType = "read"): boolean {
  return checkRateLimit(`ip:${ip}`, type).allowed;
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  type: RateLimitType = "read"
) {
  return async (request: NextRequest) => {
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkRateLimit(`ip:${ip}`, type);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    return handler(request);
  };
}
