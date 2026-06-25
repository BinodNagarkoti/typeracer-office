"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { ScoreboardEntry } from "../../types";

const columns: ColumnDef<ScoreboardEntry>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => {
      const rank = row.getValue("rank") as number;
      return (
        <div className="flex items-center justify-center w-8">
          {rank === 1 ? (
            <Trophy className="w-5 h-5 text-[var(--warning)]" />
          ) : rank === 2 ? (
            <Medal className="w-5 h-5 text-gray-400" />
          ) : rank === 3 ? (
            <Medal className="w-5 h-5 text-amber-600" />
          ) : (
            <span className="text-[var(--muted-foreground)] font-medium">{rank}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user_name",
    header: "Player",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)] font-semibold text-sm">
          {(row.getValue("user_name") as string).charAt(0).toUpperCase()}
        </div>
        <span className="font-medium text-[var(--foreground)]">
          {row.getValue("user_name") as string}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "team_name",
    header: "Team",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)]">{row.getValue("team_name") as string}</span>
    ),
  },
  {
    accessorKey: "best_wpm",
    header: "Best WPM",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-[var(--foreground)]">
        {row.getValue("best_wpm") as number}
      </span>
    ),
  },
  {
    accessorKey: "avg_accuracy",
    header: "Accuracy",
    cell: ({ row }) => {
      const accuracy = row.getValue("avg_accuracy") as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--success)]"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">{accuracy}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_attempts",
    header: "Games",
  },
];

interface LeaderboardTableProps {
  data: ScoreboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <table className="w-full">
        <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="hover:bg-[var(--accent)]"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
