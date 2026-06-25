import "server-only";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const SESSION_COOKIE = "tr_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.TURSO_AUTH_TOKEN;
  if (!secret) {
    throw new Error("SESSION_SECRET or TURSO_AUTH_TOKEN must be set");
  }
  return secret;
}

export interface Session {
  userId: number;
  name: string;
  teamId: number;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function createSessionToken(session: Session): string {
  const data = JSON.stringify(session);
  const encoded = Buffer.from(data).toString("base64url");
  const signature = sign(encoded, getSecret());
  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string): Session | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSig = sign(encoded, getSecret());

  if (signature !== expectedSig) return null;

  try {
    const data = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(data) as Session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(session);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
