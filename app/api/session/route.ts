import { NextResponse } from "next/server";
import { getSession, deleteSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: session.userId,
      name: session.name,
      teamId: session.teamId,
    },
  });
}

export async function DELETE() {
  await deleteSession();
  return NextResponse.json({ success: true });
}
