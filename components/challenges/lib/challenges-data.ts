import { ChallengeType } from "../types";

interface ChallengeSeed {
  title: string;
  description: string;
  type: ChallengeType;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  time_limit: number | null;
}

export const challenges: ChallengeSeed[] = [
  // Speed typing
  {
    title: "Morning Briefing",
    description: "Type this morning briefing as fast as you can",
    type: "speed",
    content:
      "Good morning team. Please review the quarterly report before our 10am standup. The marketing department has prepared a comprehensive analysis of our Q3 performance. We need to discuss budget allocation for the upcoming product launch. Remember to update your task status in the project management tool before the meeting.",
    difficulty: "easy",
    time_limit: null,
  },
  {
    title: "Project Update",
    description: "Quick project update memo",
    type: "speed",
    content:
      "The project milestone for Phase 2 has been completed ahead of schedule. Our development team delivered the API integration three days before the deadline. The quality assurance team has verified all critical paths and the staging environment is ready for client review. Please ensure all documentation is updated in Confluence.",
    difficulty: "medium",
    time_limit: null,
  },
  {
    title: "Strategy Document",
    description: "Type this strategic planning excerpt",
    type: "speed",
    content:
      "Our strategic initiative for the fiscal year focuses on three key pillars: operational excellence, customer-centric innovation, and sustainable growth. The cross-functional task force will coordinate implementation across all business units. Each department head should submit their quarterly objectives aligned with these strategic priorities by end of month.",
    difficulty: "hard",
    time_limit: null,
  },
  // Accuracy typing
  {
    title: "Financial Report",
    description: "Type this financial summary with precision",
    type: "accuracy",
    content:
      "Revenue: $4.2M (+12% YoY). Operating expenses: $3.1M. Net profit margin: 26.2%. Q3 highlights include a 15% increase in enterprise contracts and a 8% reduction in customer acquisition cost. The board approved a $500K budget for technology infrastructure upgrades.",
    difficulty: "medium",
    time_limit: null,
  },
  {
    title: "Technical Specification",
    description: "Type these technical details accurately",
    type: "accuracy",
    content:
      "API endpoint: /api/v2/users/{id}/settings. Method: PATCH. Required headers: Authorization: Bearer {token}, Content-Type: application/json. Rate limit: 100 requests/minute. Response codes: 200 (success), 401 (unauthorized), 429 (rate limited).",
    difficulty: "hard",
    time_limit: null,
  },
  // Office jargon
  {
    title: "Corporate Bingo",
    description: "Master the art of office buzzwords",
    type: "office_jargon",
    content:
      "Let's circle back on this after the standup meeting. We need to move the needle on our key performance indicators. This is a low-hanging fruit opportunity. Let's take this offline and sync up later. We should leverage our core competencies to drive synergy across departments.",
    difficulty: "easy",
    time_limit: null,
  },
  {
    title: "Meeting Speak",
    description: "Common phrases from corporate meetings",
    type: "office_jargon",
    content:
      "I'd like to double-click on that point. Let's boil the ocean on this initiative. We need to think outside the box and disrupt the status quo. This is a paradigm shift in how we approach stakeholder engagement. Let's ideate on this and come back with some blue-sky thinking.",
    difficulty: "medium",
    time_limit: null,
  },
  {
    title: "Management Speak",
    description: "Advanced corporate vocabulary",
    type: "office_jargon",
    content:
      "Our organizational transformation requires a holistic approach to change management. We must operationalize best practices while maintaining agile methodologies. The cross-functional synergy will enable us to scale our value proposition and optimize the customer journey across all touchpoints.",
    difficulty: "hard",
    time_limit: null,
  },
  // Email templates
  {
    title: "Follow-up Email",
    description: "Type a professional follow-up email",
    type: "email",
    content:
      "Hi Sarah,\n\nI wanted to follow up on our conversation from yesterday regarding the Q4 budget proposal. I've attached the revised spreadsheet with the updated projections you requested.\n\nCould we schedule a brief 15-minute call this week to review the final numbers before I submit them to the finance team?\n\nBest regards,\nAlex",
    difficulty: "easy",
    time_limit: null,
  },
  {
    title: "Project Status Update",
    description: "Type a project status email",
    type: "email",
    content:
      "Subject: Project Horizon - Weekly Status Update\n\nHi Team,\n\nHere's the weekly status update for Project Horizon:\n\n1. Development: On track (90% complete)\n2. Testing: Behind schedule by 3 days\n3. Documentation: In progress\n\nKey risks: Resource constraint in QA team. Mitigation: Cross-training developers on test automation.\n\nNext milestone: UAT sign-off by March 15th.\n\nPlease update your task status in Jira by EOD Friday.\n\nThanks,\nProject Manager",
    difficulty: "medium",
    time_limit: null,
  },
  {
    title: "Client Proposal",
    description: "Type a formal client proposal email",
    type: "email",
    content:
      "Subject: Proposal for Digital Transformation Initiative\n\nDear Mr. Johnson,\n\nThank you for the opportunity to present our proposal for your digital transformation initiative. Based on our discovery sessions, we recommend a phased approach:\n\nPhase 1 (Months 1-3): Infrastructure Assessment & Migration Planning\nPhase 2 (Months 4-6): Core System Modernization\nPhase 3 (Months 7-9): Data Analytics Platform\nPhase 4 (Months 10-12): AI/ML Integration\n\nThe total investment is estimated at $1.2M with an expected ROI of 340% over 3 years.\n\nWe look forward to discussing this further.\n\nSincerely,\nSenior Consultant",
    difficulty: "hard",
    time_limit: null,
  },
  // Code snippets
  {
    title: "React Component",
    description: "Type a simple React component",
    type: "code",
    content:
      'export function UserCard({ name, role, avatar }: UserCardProps) {\n  return (\n    <div className="flex items-center gap-4 p-4 rounded-lg border">\n      <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />\n      <div>\n        <h3 className="font-semibold">{name}</h3>\n        <p className="text-sm text-gray-500">{role}</p>\n      </div>\n    </div>\n  );\n}',
    difficulty: "easy",
    time_limit: null,
  },
  {
    title: "API Handler",
    description: "Type a Next.js API route handler",
    type: "code",
    content:
      'import { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(request: NextRequest) {\n  const searchParams = request.nextUrl.searchParams;\n  const query = searchParams.get("q");\n\n  if (!query) {\n    return NextResponse.json(\n      { error: "Query parameter required" },\n      { status: 400 }\n    );\n  }\n\n  const results = await searchDatabase(query);\n  return NextResponse.json({ results, count: results.length });\n}',
    difficulty: "medium",
    time_limit: null,
  },
  {
    title: "TypeScript Interface",
    description: "Type complex TypeScript types",
    type: "code",
    content:
      "interface ApiResponse<T> {\n  data: T;\n  meta: {\n    total: number;\n    page: number;\n    perPage: number;\n    totalPages: number;\n  };\n  errors?: Array<{\n    code: string;\n    message: string;\n    field?: string;\n  }>;\n}\n\ntype User = {\n  id: string;\n  email: string;\n  name: string;\n  role: \"admin\" | \"user\" | \"viewer\";\n  createdAt: Date;\n};",
    difficulty: "hard",
    time_limit: null,
  },
  // Timed challenges
  {
    title: "30-Second Sprint",
    description: "Type as much as you can in 30 seconds",
    type: "timed",
    content:
      "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly.",
    difficulty: "easy",
    time_limit: 30,
  },
  {
    title: "60-Second Challenge",
    description: "One minute typing challenge",
    type: "timed",
    content:
      "In the rapidly evolving landscape of enterprise technology, organizations must adapt their digital infrastructure to remain competitive. Cloud computing, artificial intelligence, and data analytics have become essential components of modern business strategy. Companies that embrace digital transformation report higher employee satisfaction, improved customer experiences, and significant cost reductions. The key to successful implementation lies in fostering a culture of continuous learning and innovation.",
    difficulty: "medium",
    time_limit: 60,
  },
  {
    title: "90-Second Marathon",
    description: "Extended 90-second typing challenge",
    type: "timed",
    content:
      "Effective project management requires a balanced approach that considers scope, timeline, and resources. The project manager must facilitate clear communication among stakeholders, manage risks proactively, and maintain quality standards throughout the project lifecycle. Agile methodologies have gained popularity due to their emphasis on iterative development, customer collaboration, and responsive planning. Teams that adopt agile practices often report improved morale, faster delivery times, and better alignment with business objectives. Regular retrospectives help teams identify areas for improvement and celebrate successes.",
    difficulty: "hard",
    time_limit: 90,
  },
];
