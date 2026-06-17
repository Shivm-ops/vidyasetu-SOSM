"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Flame, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";

import { useGamificationStoreSafe } from "@/hooks/useGamificationStoreSafe";

export function StreakBadge() {
  const streak = useGamificationStoreSafe((state) => state.streak) ?? 0;

  return (
    <div className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-bold shadow-sm border-2 border-orange-200">
      <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
      <span className="text-lg">{streak}</span>
    </div>
  );
}

export function XPBadge() {
  const learningXP = useGamificationStoreSafe((state) => state.learningXP) ?? 0;
  const skillXP = useGamificationStoreSafe((state) => state.skillXP) ?? 0;
  const careerXP = useGamificationStoreSafe((state) => state.careerXP) ?? 0;
  const innovationXP = useGamificationStoreSafe((state) => state.innovationXP) ?? 0;
  const communityXP = useGamificationStoreSafe((state) => state.communityXP) ?? 0;
  const xp = learningXP + skillXP + careerXP + innovationXP + communityXP;

  return (
    <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-bold shadow-sm border-2 border-yellow-300">
      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
      <span className="text-lg">{xp} XP</span>
    </div>
  );
}

export function GrowthAvatar() {
  const learningXP = useGamificationStoreSafe((state) => state.learningXP) ?? 0;
  const skillXP = useGamificationStoreSafe((state) => state.skillXP) ?? 0;
  const careerXP = useGamificationStoreSafe((state) => state.careerXP) ?? 0;
  const innovationXP = useGamificationStoreSafe((state) => state.innovationXP) ?? 0;
  const communityXP = useGamificationStoreSafe((state) => state.communityXP) ?? 0;
  const total = learningXP + skillXP + careerXP + innovationXP + communityXP;

  let level: 'Beginner' | 'Growing' | 'Strong Learner' | 'Future Leader' | 'Champion' = 'Beginner';
  if (total < 500) level = 'Beginner';
  else if (total < 2000) level = 'Growing';
  else if (total < 5000) level = 'Strong Learner';
  else if (total < 10000) level = 'Future Leader';
  else level = 'Champion';

  const levelConfig = {
    'Beginner': { icon: '🌱', color: 'bg-green-100 border-green-300 text-green-700' },
    'Growing': { icon: '🌿', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
    'Strong Learner': { icon: '🌳', color: 'bg-forest-100 border-forest-300 text-forest-700' },
    'Future Leader': { icon: '🚀', color: 'bg-purple-100 border-purple-300 text-purple-700' },
    'Champion': { icon: '👑', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  };

  const config = levelConfig[level];

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-2xl border-2 shadow-sm font-bold",
        config.color
      )}
    >
      <span className="text-2xl">{config.icon}</span>
      <span className="hidden sm:inline-block font-marathi">{level}</span>
    </motion.div>
  );
}
