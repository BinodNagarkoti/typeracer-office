import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withRateLimit } from "@/lib/rate-limit";

export const GET = withRateLimit(async function () {
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM teams ORDER BY name");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Teams error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
});
