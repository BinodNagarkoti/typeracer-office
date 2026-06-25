"use client";

import { Button } from "../ui/button";
import { Team } from "../../types";

interface TeamFilterProps {
  teams: Team[];
  selectedTeamId: number | null;
  onSelect: (teamId: number | null) => void;
}

export function TeamFilter({
  teams,
  selectedTeamId,
  onSelect,
}: TeamFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedTeamId === null ? "primary" : "secondary"}
        size="sm"
        onClick={() => onSelect(null)}
        className="whitespace-nowrap"
      >
        All Teams
      </Button>
      {teams.map((team) => (
        <Button
          key={team.id}
          variant={selectedTeamId === team.id ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelect(team.id)}
          className="whitespace-nowrap"
        >
          {team.name}
        </Button>
      ))}
    </div>
  );
}
