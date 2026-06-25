"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar } from "lucide-react";
import { LeaderboardTable } from "../../components/scoreboard/LeaderboardTable";
import { TeamFilter } from "../../components/scoreboard/TeamFilter";
import { useScoreboard } from "../../hooks/useScoreboard";
import { useTeams } from "../../hooks/useTeams";
import { Button } from "../../components/ui/button";

const periods = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function ScoreboardPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const { data: teams } = useTeams();
  const { data: scoreboard, isLoading } = useScoreboard(
    selectedTeam ?? undefined,
    selectedPeriod === "all" ? undefined : selectedPeriod
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-warning" />
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">
            See who types the fastest in the office!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-sm border border-border p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {teams && (
              <TeamFilter
                teams={teams}
                selectedTeamId={selectedTeam}
                onSelect={setSelectedTeam}
              />
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {periods.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading scoreboard...
            </div>
          ) : scoreboard && scoreboard.length > 0 ? (
            <LeaderboardTable data={scoreboard} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No scores yet. Be the first to complete a challenge!
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
