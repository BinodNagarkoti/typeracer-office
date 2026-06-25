-- ============================================================
-- TypeRacer Office - Database Initialization Script
-- Run this in Turso SQL Console or any SQLite client
-- ============================================================

-- Drop existing tables (clean start)
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;

-- Create teams table
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  team_id INTEGER REFERENCES teams(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK(type IN ('speed', 'accuracy', 'office_jargon', 'email', 'code', 'timed')),
  content TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create attempts table
CREATE TABLE attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  challenge_id INTEGER NOT NULL REFERENCES challenges(id),
  wpm REAL NOT NULL,
  accuracy REAL NOT NULL,
  time_taken REAL NOT NULL,
  errors INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed Teams
-- ============================================================
INSERT INTO teams (name) VALUES ('Engineering');
INSERT INTO teams (name) VALUES ('Marketing');
INSERT INTO teams (name) VALUES ('Sales');
INSERT INTO teams (name) VALUES ('HR');
INSERT INTO teams (name) VALUES ('Finance');
INSERT INTO teams (name) VALUES ('Design');

-- ============================================================
-- Seed Challenges
-- ============================================================

-- Speed typing challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Morning Briefing',
  'Type this morning briefing as fast as you can',
  'speed',
  'Good morning team. Please review the quarterly report before our 10am standup. The marketing department has prepared a comprehensive analysis of our Q3 performance. We need to discuss budget allocation for the upcoming product launch. Remember to update your task status in the project management tool before the meeting.',
  'easy',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Project Update',
  'Quick project update memo',
  'speed',
  'The project milestone for Phase 2 has been completed ahead of schedule. Our development team delivered the API integration three days before the deadline. The quality assurance team has verified all critical paths and the staging environment is ready for client review. Please ensure all documentation is updated in Confluence.',
  'medium',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Strategy Document',
  'Type this strategic planning excerpt',
  'speed',
  'Our strategic initiative for the fiscal year focuses on three key pillars: operational excellence, customer-centric innovation, and sustainable growth. The cross-functional task force will coordinate implementation across all business units. Each department head should submit their quarterly objectives aligned with these strategic priorities by end of month.',
  'hard',
  NULL
);

-- Accuracy typing challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Financial Report',
  'Type this financial summary with precision',
  'accuracy',
  'Revenue: $4.2M (+12% YoY). Operating expenses: $3.1M. Net profit margin: 26.2%. Q3 highlights include a 15% increase in enterprise contracts and a 8% reduction in customer acquisition cost. The board approved a $500K budget for technology infrastructure upgrades.',
  'medium',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Technical Specification',
  'Type these technical details accurately',
  'accuracy',
  'API endpoint: /api/v2/users/{id}/settings. Method: PATCH. Required headers: Authorization: Bearer {token}, Content-Type: application/json. Rate limit: 100 requests/minute. Response codes: 200 (success), 401 (unauthorized), 429 (rate limited).',
  'hard',
  NULL
);

-- Office jargon challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Corporate Bingo',
  'Master the art of office buzzwords',
  'office_jargon',
  'Let''s circle back on this after the standup meeting. We need to move the needle on our key performance indicators. This is a low-hanging fruit opportunity. Let''s take this offline and sync up later. We should leverage our core competencies to drive synergy across departments.',
  'easy',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Meeting Speak',
  'Common phrases from corporate meetings',
  'office_jargon',
  'I''d like to double-click on that point. Let''s boil the ocean on this initiative. We need to think outside the box and disrupt the status quo. This is a paradigm shift in how we approach stakeholder engagement. Let''s ideate on this and come back with some blue-sky thinking.',
  'medium',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Management Speak',
  'Advanced corporate vocabulary',
  'office_jargon',
  'Our organizational transformation requires a holistic approach to change management. We must operationalize best practices while maintaining agile methodologies. The cross-functional synergy will enable us to scale our value proposition and optimize the customer journey across all touchpoints.',
  'hard',
  NULL
);

-- Email template challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Follow-up Email',
  'Type a professional follow-up email',
  'email',
  'Hi Sarah,

I wanted to follow up on our conversation from yesterday regarding the Q4 budget proposal. I''ve attached the revised spreadsheet with the updated projections you requested.

Could we schedule a brief 15-minute call this week to review the final numbers before I submit them to the finance team?

Best regards,
Alex',
  'easy',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Project Status Update',
  'Type a project status email',
  'email',
  'Subject: Project Horizon - Weekly Status Update

Hi Team,

Here''s the weekly status update for Project Horizon:

1. Development: On track (90% complete)
2. Testing: Behind schedule by 3 days
3. Documentation: In progress

Key risks: Resource constraint in QA team. Mitigation: Cross-training developers on test automation.

Next milestone: UAT sign-off by March 15th.

Please update your task status in Jira by EOD Friday.

Thanks,
Project Manager',
  'medium',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'Client Proposal',
  'Type a formal client proposal email',
  'email',
  'Subject: Proposal for Digital Transformation Initiative

Dear Mr. Johnson,

Thank you for the opportunity to present our proposal for your digital transformation initiative. Based on our discovery sessions, we recommend a phased approach:

Phase 1 (Months 1-3): Infrastructure Assessment & Migration Planning
Phase 2 (Months 4-6): Core System Modernization
Phase 3 (Months 7-9): Data Analytics Platform
Phase 4 (Months 10-12): AI/ML Integration

The total investment is estimated at $1.2M with an expected ROI of 340% over 3 years.

We look forward to discussing this further.

Sincerely,
Senior Consultant',
  'hard',
  NULL
);

-- Code snippet challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'React Component',
  'Type a simple React component',
  'code',
  'export function UserCard({ name, role, avatar }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}',
  'easy',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'API Handler',
  'Type a Next.js API route handler',
  'code',
  'import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter required" },
      { status: 400 }
    );
  }

  const results = await searchDatabase(query);
  return NextResponse.json({ results, count: results.length });
}',
  'medium',
  NULL
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  'TypeScript Interface',
  'Type complex TypeScript types',
  'code',
  'interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  createdAt: Date;
};',
  'hard',
  NULL
);

-- Timed challenges
INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  '30-Second Sprint',
  'Type as much as you can in 30 seconds',
  'timed',
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly.',
  'easy',
  30
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  '60-Second Challenge',
  'One minute typing challenge',
  'timed',
  'In the rapidly evolving landscape of enterprise technology, organizations must adapt their digital infrastructure to remain competitive. Cloud computing, artificial intelligence, and data analytics have become essential components of modern business strategy. Companies that embrace digital transformation report higher employee satisfaction, improved customer experiences, and significant cost reductions. The key to successful implementation lies in fostering a culture of continuous learning and innovation.',
  'medium',
  60
);

INSERT INTO challenges (title, description, type, content, difficulty, time_limit) VALUES (
  '90-Second Marathon',
  'Extended 90-second typing challenge',
  'timed',
  'Effective project management requires a balanced approach that considers scope, timeline, and resources. The project manager must facilitate clear communication among stakeholders, manage risks proactively, and maintain quality standards throughout the project lifecycle. Agile methodologies have gained popularity due to their emphasis on iterative development, customer collaboration, and responsive planning. Teams that adopt agile practices often report improved morale, faster delivery times, and better alignment with business objectives. Regular retrospectives help teams identify areas for improvement and celebrate successes.',
  'hard',
  90
);

-- ============================================================
-- Verify data
-- ============================================================
SELECT 'Teams: ' || COUNT(*) FROM teams;
SELECT 'Challenges: ' || COUNT(*) FROM challenges;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Attempts: ' || COUNT(*) FROM attempts;
