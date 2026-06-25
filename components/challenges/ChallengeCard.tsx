"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Target,
  MessageSquare,
  Mail,
  Code,
  Timer,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Challenge, ChallengeType } from "../../types";

const typeIcons: Record<ChallengeType, React.ReactNode> = {
  speed: <Zap className="w-6 h-6" />,
  accuracy: <Target className="w-6 h-6" />,
  office_jargon: <MessageSquare className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  timed: <Timer className="w-6 h-6" />,
};

const typeColors: Record<ChallengeType, string> = {
  speed: "text-warning bg-warning/15",
  accuracy: "text-success bg-success/15",
  office_jargon: "text-purple-500 bg-purple-500/15",
  email: "text-primary bg-primary/15",
  code: "text-orange-500 bg-orange-500/15",
  timed: "text-destructive bg-destructive/15",
};

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "danger",
} as const;

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="relative">


          <CardHeader className="p-0! flex-row! gap-5">
            <div
              className={`shrink-0 p-3 rounded-xl w-fit mb-2 ${typeColors[challenge.type]}`}
            >
              {typeIcons[challenge.type]}
            </div>
            <div>

              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </div>
          </CardHeader>

          <CardFooter className="text-xs p-0! flex gap-5 justify-between text-muted-foreground opacity-60">
            <Badge variant={difficultyColors[challenge.difficulty]}>
              {challenge.difficulty}
            </Badge>
            <span className="capitalize">
              {challenge.type.replace("_", " ")}
            </span>
            {challenge.time_limit && (
              <span>{challenge.time_limit}s</span>
            )}
            <span>{(challenge as any).content_length || 0} chars</span>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}
