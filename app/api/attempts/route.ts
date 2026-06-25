import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { AttemptSchema } from "@/lib/validation";
import { withRateLimit } from "@/lib/rate-limit";

export const POST = withRateLimit(async function (request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const parsed = AttemptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { userId, challengeId, wpm, accuracy, timeTaken, errors, completed } =
      parsed.data;

    const userExists = await db.execute({
      sql: "SELECT id FROM users WHERE id = ?",
      args: [userId],
    });
    if (userExists.rows.length === 0) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    const challengeExists = await db.execute({
      sql: "SELECT id FROM challenges WHERE id = ?",
      args: [challengeId],
    });
    if (challengeExists.rows.length === 0) {
      return NextResponse.json({ error: "Invalid challenge" }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO attempts (user_id, challenge_id, wpm, accuracy, time_taken, errors, completed)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [userId, challengeId, wpm, accuracy, timeTaken, errors, completed ? 1 : 0],
    });

    return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (error) {
    console.error("Attempt error:", error);
    return NextResponse.json(
      { error: "Failed to submit attempt" },
      { status: 500 }
    );
  }
});

export const GET = withRateLimit(async function (request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId || !/^\d+$/.test(userId)) {
      return NextResponse.json(
        { error: "Valid user_id is required" },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: `SELECT a.id, a.wpm, a.accuracy, a.time_taken, a.errors, a.completed, a.created_at,
                   c.title as challenge_title
            FROM attempts a
            JOIN challenges c ON a.challenge_id = c.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
            LIMIT 50`,
      args: [userId],
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Attempts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
});
