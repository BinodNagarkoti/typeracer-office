import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withRateLimit } from "@/lib/rate-limit";

export const GET = withRateLimit(async function (request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    const validTypes = ["speed", "accuracy", "office_jargon", "email", "code", "timed"];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid challenge type" }, { status: 400 });
    }

    let result;
    if (type) {
      result = await db.execute({
        sql: "SELECT id, title, description, type, difficulty, time_limit, LENGTH(content) as content_length FROM challenges WHERE type = ? ORDER BY id",
        args: [type],
      });
    } else {
      result = await db.execute(
        "SELECT id, title, description, type, difficulty, time_limit, LENGTH(content) as content_length FROM challenges ORDER BY id"
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Challenges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
});
