"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Keyboard, Trophy, Zap, Target, Timer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TextType } from "../components/ui/text-type";
import Hyperspeed from "../components/ui/hyperspeed";
import { useTeams } from "../hooks/useTeams";
import { useUserContext } from "../components/layout/UserProvider";
import { useTheme } from "../components/layout/ThemeProvider";
import Link from "next/link";

const features = [
  { icon: Zap, title: "Speed Challenges", desc: "Race against the clock to type as fast as you can" },
  { icon: Target, title: "Accuracy Tests", desc: "Precision matters — type perfectly without errors" },
  { icon: Timer, title: "Timed Rounds", desc: "Beat the timer and climb the leaderboard" },
  { icon: Trophy, title: "Leaderboard", desc: "Compete with colleagues and prove your skills" },
];

export default function HomePage() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const { resolvedTheme } = useTheme();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const [name, setName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const validateName = (value: string): string | null => {
    const sstiPatterns = [
      /\{\{.*\}\}/,       // {{ }}
      /\$\{.*\}/,         // ${ }
      /%\{.*\}/,          // %{ }
      /<%.*%>/,           // <%%>
      /\{\%.*\%\}/,       // {% %}
      /<!--[\s\S]*-->/,    // HTML comments
      /javascript:/,       // javascript:
      /on\w+\s*=/,         // onEvent=
    ];
    for (const pattern of sstiPatterns) {
      if (pattern.test(value)) {
        return "Invalid characters detected. Please enter a valid name.";
      }
    }
    return null;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleJoin = async () => {
    if (name.trim() && selectedTeam && !nameError) {
      await setUser({ name: name.trim(), teamId: selectedTeam });
      router.push("/challenges");
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome back, <span className="text-primary">{user.name}</span>!
            </h1>
            <p className="text-muted-foreground mb-8">Ready to test your typing skills?</p>
            <div className="flex justify-center gap-4">
              <Link href="/challenges">
                <Button size="lg">
                  <Keyboard className="w-5 h-5 mr-2" />
                  Start Typing
                </Button>
              </Link>
              <Link href="/scoreboard">
                <Button variant="secondary" size="lg">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Hyperspeed
            effectOptions={{
              distortion: "turbulentDistortion",
              length: 400,
              roadWidth: 9,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 20,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [12, 80],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: resolvedTheme === "dark" ? 0x111111 : 0xd1d5db,
                islandColor: resolvedTheme === "dark" ? 0x1a1a1a : 0xbfc6d0,
                background: resolvedTheme === "dark" ? 0x0a0a0a : 0xf8fafc,
                shoulderLines: resolvedTheme === "dark" ? 0x3b82f6 : 0x1d4ed8,
                brokenLines: resolvedTheme === "dark" ? 0xd1d5db : 0x374151,
                leftCars: [0x3b82f6, 0x60a5fa, 0x93c5fd],
                rightCars: [0xf59e0b, 0xfbbf24, 0xfcd34d],
                sticks: resolvedTheme === "dark" ? 0x60a5fa : 0x2563eb,
              },
            }}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/50 to-background z-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-8"
            >
              <Keyboard className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              TypeRacer{" "}
              <span className="text-primary">Office</span>
            </h1>

            <div className="text-xl sm:text-2xl text-muted-foreground mb-4 h-10">
              <TextType
                texts={[
                  "Challenge your colleagues",
                  "Improve your typing speed",
                  "Climb the leaderboard",
                  "Have fun while learning",
                ]}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={1800}
                className="text-primary"
              />
            </div>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Challenge your colleagues to typing competitions. Improve your speed,
              accuracy, and have fun while learning office vocabulary.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="#join">
                <Button size="lg" className="text-lg px-8">
                  <Keyboard className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link href="/scoreboard">
                <Button variant="secondary" size="lg" className="text-lg px-8">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Join the Competition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none ${
                      nameError ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {nameError && (
                    <p className="text-destructive text-sm mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Select Your Team
                  </label>
                  {teamsLoading ? (
                    <div className="text-muted-foreground">Loading teams...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {teams?.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => setSelectedTeam(team.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTeam === team.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                            }`}
                        >
                          {team.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleJoin}
                  disabled={!name.trim() || !selectedTeam || !!nameError}
                >
                  Start Typing
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
