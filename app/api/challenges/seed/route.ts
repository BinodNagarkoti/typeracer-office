import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { challenges } from "@/lib/challenges-data";

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();

    await db.execute(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, team_id)
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK(type IN ('speed', 'accuracy', 'office_jargon', 'email', 'code', 'timed')),
        content TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
        time_limit INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        wpm REAL NOT NULL,
        accuracy REAL NOT NULL,
        time_taken REAL NOT NULL,
        errors INTEGER NOT NULL DEFAULT 0,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute("DELETE FROM attempts");
    await db.execute("DELETE FROM challenges");
    await db.execute("DELETE FROM users");
    await db.execute("DELETE FROM teams");

    const defaultTeams = [
      "Engineering", "Marketing", "Sales", "HR", "Finance", "Design",
    ];

    for (const team of defaultTeams) {
      await db.execute({
        sql: "INSERT INTO teams (name) VALUES (?)",
        args: [team],
      });
    }

    for (const c of challenges) {
      await db.execute({
        sql: `INSERT INTO challenges (title, description, type, content, difficulty, time_limit)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [c.title, c.description, c.type, c.content, c.difficulty, c.time_limit],
      });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      teams: defaultTeams.length,
      challenges: challenges.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
