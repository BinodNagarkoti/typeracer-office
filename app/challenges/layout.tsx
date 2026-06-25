import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Challenges",
  description:
    "Choose from speed, accuracy, office jargon, email, and code typing challenges. Test your keyboard skills and improve your WPM with fun timed rounds.",
  openGraph: {
    title: "Typing Challenges | TypeRacer Office",
    description:
      "Choose from speed, accuracy, office jargon, email, and code typing challenges.",
    url: "https://typeracer.binodnagarkoti.com.np/challenges",
  },
  alternates: {
    canonical: "https://typeracer.binodnagarkoti.com.np/challenges",
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
