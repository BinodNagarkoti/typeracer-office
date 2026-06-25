"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { ChallengeGrid } from "../../components/challenges/ChallengeGrid";
import { useChallenges, useSeedChallenges } from "../../hooks/useChallenges";
import { useUserContext } from "../../components/layout/UserProvider";
import { Challenge, ChallengeType } from "../../types";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";
import { getErrorMessage } from "../../lib/try-catch";

const types: { value: ChallengeType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "speed", label: "Speed" },
  { value: "accuracy", label: "Accuracy" },
  { value: "office_jargon", label: "Office Jargon" },
  { value: "email", label: "Email" },
  { value: "code", label: "Code" },
  { value: "timed", label: "Timed" },
];

export default function ChallengesPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { error: toastError } = useToast();
  const [selectedType, setSelectedType] = useState<ChallengeType | "all">("all");
  const { data: challenges, isLoading, refetch } = useChallenges(
    selectedType === "all" ? undefined : selectedType
  );
  const seedMutation = useSeedChallenges();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSelect = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.id}`);
  };

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync();
      refetch();
    } catch (err) {
      toastError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose Your Challenge
          </h1>
          <p className="text-muted-foreground">
            Pick a typing challenge and test your skills, {user.name}!
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-muted-foreground" />
          {types.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading challenges...
          </div>
        ) : challenges && challenges.length > 0 ? (
          <ChallengeGrid challenges={challenges} onSelect={handleSelect} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">No challenges found.</p>
            <Button
              onClick={handleSeed}
              disabled={seedMutation.isPending}
            >
              {seedMutation.isPending ? "Seeding..." : "Seed Database"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
