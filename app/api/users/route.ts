import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { UserSchema } from "@/lib/validation";
import { withRateLimit } from "@/lib/rate-limit";
import { setSession, getSession } from "@/lib/auth";

export const POST = withRateLimit(
  async function (request: NextRequest) {
  try {
    const existingSession = await getSession();
    if (existingSession) {
      return NextResponse.json({
        user: {
          id: existingSession.userId,
          name: existingSession.name,
          team_id: existingSession.teamId,
        },
      });
    }

    const db = getDb();
    const body = await request.json();

    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, teamId } = parsed.data;

    const teamExists = await db.execute({
      sql: "SELECT id FROM teams WHERE id = ?",
      args: [teamId],
    });
    if (teamExists.rows.length === 0) {
      return NextResponse.json({ error: "Invalid team" }, { status: 400 });
    }

    let result = await db.execute({
      sql: "SELECT id, name, team_id FROM users WHERE name = ? AND team_id = ?",
      args: [name, teamId],
    });

    if (result.rows.length === 0) {
      result = await db.execute({
        sql: "INSERT INTO users (name, team_id) VALUES (?, ?) RETURNING id, name, team_id",
        args: [name, teamId],
      });
    }

    const user = result.rows[0];

    await setSession({
      userId: Number(user.id),
      name: String(user.name),
      teamId: Number(user.team_id),
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        team_id: user.team_id,
      },
    });
  } catch (error) {
    console.error("User error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}, "write");
