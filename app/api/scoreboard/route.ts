import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withRateLimit } from "@/lib/rate-limit";

export const GET = withRateLimit(async function (request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("team_id");
    const period = searchParams.get("period");

    if (teamId && !/^\d+$/.test(teamId)) {
      return NextResponse.json({ error: "Invalid team_id" }, { status: 400 });
    }
    if (period && !["today", "week", "month"].includes(period)) {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    let dateFilter = "";
    if (period === "today") {
      dateFilter = "AND a.created_at >= datetime('now', '-1 day')";
    } else if (period === "week") {
      dateFilter = "AND a.created_at >= datetime('now', '-7 days')";
    } else if (period === "month") {
      dateFilter = "AND a.created_at >= datetime('now', '-30 days')";
    }

    let teamFilter = "";
    const args: (string | number)[] = [];
    if (teamId) {
      teamFilter = "AND u.team_id = ?";
      args.push(teamId);
    }

    const result = await db.execute({
      sql: `SELECT 
              u.id as user_id,
              u.name as user_name,
              t.id as team_id,
              t.name as team_name,
              MAX(a.wpm) as best_wpm,
              ROUND(AVG(a.accuracy), 1) as avg_accuracy,
              COUNT(a.id) as total_attempts,
              MAX(a.created_at) as last_played
            FROM attempts a
            JOIN users u ON a.user_id = u.id
            JOIN teams t ON u.team_id = t.id
            WHERE a.completed = 1
            ${dateFilter}
            ${teamFilter}
            GROUP BY u.id, u.name, t.id, t.name
            ORDER BY best_wpm DESC`,
      args,
    });

    const entries = result.rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Scoreboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scoreboard" },
      { status: 500 }
    );
  }
});
