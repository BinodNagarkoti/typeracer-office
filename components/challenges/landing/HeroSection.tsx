"use client";

import { motion } from "framer-motion";
import { Keyboard, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-8"
          >
            <Keyboard className="w-10 h-10 text-blue-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            TypeRacer{" "}
            <span className="text-blue-600">Office</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Challenge your colleagues to typing competitions. Improve your speed,
            accuracy, and have fun while learning office vocabulary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/challenges">
              <Button size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Typing
              </Button>
            </Link>
            <Link href="/scoreboard">
              <Button variant="secondary" size="lg">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">6 Challenge Types</h3>
              <p className="text-sm text-gray-500">Speed, accuracy, office jargon, emails, code, timed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Team Competition</h3>
              <p className="text-sm text-gray-500">Compete with your team and climb the ranks</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Live Leaderboard</h3>
              <p className="text-sm text-gray-500">Real-time rankings and progress tracking</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
