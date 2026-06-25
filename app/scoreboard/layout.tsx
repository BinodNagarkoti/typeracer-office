import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See who types the fastest in the office! View the all-time, daily, weekly, and monthly typing speed leaderboard rankings.",
  openGraph: {
    title: "Leaderboard | TypeRacer Office",
    description:
      "See who types the fastest in the office! View typing speed rankings.",
    url: "https://typeracer.binodnagarkoti.com.np/scoreboard",
  },
  alternates: {
    canonical: "https://typeracer.binodnagarkoti.com.np/scoreboard",
  },
};

export default function ScoreboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
