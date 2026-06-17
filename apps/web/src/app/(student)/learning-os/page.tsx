"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ArrowLeft, Star, Lock, ChevronRight, Play,
  Zap, Target, Trophy, Brain, TrendingUp, Flame,
  CheckCircle2, Clock, BarChart3, Sparkles, X,
  GraduationCap, Award, Map, FlaskConical, Lightbulb,
  Layers, ChevronDown,
} from "lucide-react";
import { getChapter, getChapterJourneyDetails } from "@/lib/curriculum-data";
import { LearningDetailPanel } from "@/components/curriculum/LearningDetailPanel";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const PATH_ITEMS = [
  {
    classId: 5, subjectId: "mathematics" as const, chapterId: "fractions",
    chapter: getChapter(5, "mathematics", "fractions"),
    isLocked: false, subjectName: "गणित", subjectColor: "#3b82f6",
    progress: 65, timeLeft: "१२ मिनिटे",
    gradient: "from-blue-500 to-indigo-600",
    accent: "#3b82f6",
  },
  {
    classId: 6, subjectId: "science" as const, chapterId: "living-world",
    chapter: getChapter(6, "science", "living-world"),
    isLocked: false, subjectName: "विज्ञान", subjectColor: "#10b981",
    progress: 30, timeLeft: "२५ मिनिटे",
    gradient: "from-emerald-500 to-teal-600",
    accent: "#10b981",
  },
  {
    classId: 7, subjectId: "social_science" as const, chapterId: "maharashtra-geography",
    chapter: getChapter(7, "social_science", "maharashtra-geography"),
    isLocked: true, subjectName: "भूगोल", subjectColor: "#f59e0b",
    progress: 0, timeLeft: "४५ मिनिटे",
    gradient: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
  },
];

const STUDENT = {
  name: "राहुल पाटील",
  class: "इयत्ता सातवी",
  xp: 250,
  xpNext: 400,
  learningScore: 78,
  skillScore: 62,
  careerReadiness: 45,
  streak: 7,
  todayGoal: { done: 2, total: 3, label: "आजचे लक्ष्य: ३ टप्पे पूर्ण करा" },
  weakConcepts: ["दशांश बेरीज", "अपूर्णांक तुलना", "LCM काढणे"],
  recommendedActivities: ["रोटी विभाजन खेळ", "बाजार हिशोब कृती", "अपूर्णांक शर्यत"],
  recommendedSkills: ["आर्थिक साक्षरता", "समस्यानिवारण", "विश्लेषणात्मक विचार"],
  recommendedCareers: ["बँकर", "CA", "डेटा विश्लेषक", "शिक्षक"],
};

const SKILLS_DB: Record<string, { name: string; icon: string; color: string; desc: string }[]> = {
  fractions: [
    { name: "आर्थिक साक्षरता", icon: "💰", color: "#10b981", desc: "पैसे व्यवस्थापन, गुंतवणूक समजणे" },
    { name: "समस्यानिवारण", icon: "🧩", color: "#6366f1", desc: "गणिती समस्या सोडवणे" },
    { name: "तार्किक विचार", icon: "🔬", color: "#f59e0b", desc: "तर्कशुद्ध निष्कर्ष काढणे" },
  ],
  "living-world": [
    { name: "वैज्ञानिक निरीक्षण", icon: "🔭", color: "#06b6d4", desc: "सखोल निरीक्षण व नोंदी" },
    { name: "जैवविविधता ज्ञान", icon: "🌿", color: "#22c55e", desc: "पर्यावरण समजणे" },
    { name: "संशोधन कौशल्ये", icon: "📊", color: "#8b5cf6", desc: "माहिती गोळा व विश्लेषण" },
  ],
  "maharashtra-geography": [
    { name: "नकाशा वाचन", icon: "🗺️", color: "#f43f5e", desc: "भौगोलिक माहिती समजणे" },
    { name: "पर्यावरण जागरूकता", icon: "🌍", color: "#10b981", desc: "नैसर्गिक संसाधने" },
    { name: "सामाजिक विश्लेषण", icon: "🏘️", color: "#f59e0b", desc: "समाज व भूगोल संबंध" },
  ],
};

const CAREERS_DB: Record<string, { title: string; emoji: string; match: number; salary: string }[]> = {
  fractions: [
    { title: "बँकर", emoji: "🏦", match: 92, salary: "₹3L–₹18L" },
    { title: "चार्टर्ड अकाउंटंट", emoji: "💼", match: 88, salary: "₹6L–₹30L+" },
    { title: "डेटा विश्लेषक", emoji: "📊", match: 85, salary: "₹5L–₹25L" },
    { title: "आर्थिक सल्लागार", emoji: "💡", match: 80, salary: "₹4L–₹20L" },
  ],
  "living-world": [
    { title: "डॉक्टर", emoji: "🩺", match: 94, salary: "₹6L–₹25L+" },
    { title: "शास्त्रज्ञ", emoji: "🔬", match: 89, salary: "₹4L–₹20L+" },
    { title: "कृषी अधिकारी", emoji: "🌾", match: 82, salary: "₹3.5L–₹12L" },
    { title: "पर्यावरण सल्लागार", emoji: "🌿", match: 78, salary: "₹4L–₹15L" },
  ],
  "maharashtra-geography": [
    { title: "UPSC अधिकारी", emoji: "🏛️", match: 90, salary: "₹5L–₹20L+" },
    { title: "भूगोल शिक्षक", emoji: "📚", match: 85, salary: "₹2.5L–₹10L" },
    { title: "पर्यटन व्यवसायी", emoji: "✈️", match: 78, salary: "₹3L–₹15L" },
    { title: "NGO व्यवस्थापक", emoji: "🤝", match: 72, salary: "₹2L–₹12L" },
  ],
};

type SelectedChapterState = { chapter: NonNullable<ReturnType<typeof getChapter>>; classId: number; subjectId: string; };

// ─────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────

function StatRing({ value, label, color, icon }: { value: number; label: string; color: string; icon: React.ReactNode }) {
  const r = 30, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <motion.circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${(value / 100) * circ} ${circ}` }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-extrabold text-white leading-none">{value}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs text-white/40">{icon}</div>
        <p className="text-[11px] text-white/60 leading-tight mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function JourneyPipeline({ conceptCount, quizCount, activityCount, projectCount, skills, careers, accent }:
  { conceptCount: number; quizCount: number; activityCount: number; projectCount: number; skills: { name: string }[]; careers: { title: string }[]; accent: string }) {

  const steps = [
    { icon: "📚", label: "संकल्पना", count: conceptCount, hint: "शिकणे" },
    { icon: "📝", label: "क्विझ", count: quizCount, hint: "सराव" },
    { icon: "🧪", label: "कृती", count: activityCount, hint: "उपक्रम" },
    { icon: "💡", label: "प्रकल्प", count: projectCount, hint: "निर्मिती" },
    { icon: "🚀", label: "कौशल्ये", count: skills.length, hint: "Skill" },
    { icon: "🎯", label: "करिअर", count: careers.length, hint: "Career" },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[11px] font-extrabold text-white/70 flex items-center gap-1 bg-white/8 border border-white/10 px-2 py-1 rounded-xl">
              <span>{step.icon}</span>
              <span>{step.count}</span>
            </div>
            <span className="text-[9px] text-white/35">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-3 h-3 shrink-0 mb-3" style={{ color: `${accent}60` }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function LearningOS() {
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapterState | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>("fractions");
  const [activeTab, setActiveTab] = useState<"journey" | "skills" | "careers" | "recommend">("journey");

  const activeItem = PATH_ITEMS.find(p => p.chapterId === expandedCard) ?? PATH_ITEMS[0];
  const activeChapter = activeItem?.chapter;
  const activeSkills = SKILLS_DB[expandedCard ?? "fractions"] ?? [];
  const activeCareers = CAREERS_DB[expandedCard ?? "fractions"] ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 font-marathi text-white pb-24">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold leading-tight">Learning OS</h1>
                <p className="text-[10px] text-white/40">माझा अभ्यास प्रवास</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/20 border border-orange-400/30 rounded-full px-3 py-1.5 text-xs font-bold text-orange-300">
              <Flame className="w-3.5 h-3.5 fill-current" /> {STUDENT.streak} दिवस streak
            </div>
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1.5 text-xs font-bold text-amber-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {STUDENT.xp} XP
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO DASHBOARD
        ══════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600/25 via-indigo-600/15 to-violet-600/20 border border-blue-400/20 rounded-3xl p-6">
          <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar + Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-extrabold shadow-xl">
                  {STUDENT.name[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                  🔥{STUDENT.streak}
                </div>
              </div>
              <div>
                <p className="text-white/50 text-xs">नमस्कार 👋</p>
                <h2 className="text-xl font-extrabold">{STUDENT.name}</h2>
                <p className="text-white/50 text-xs">{STUDENT.class} • विद्यासेतू शिक्षार्थी</p>
              </div>
            </div>

            {/* Score Rings */}
            <div className="flex items-center gap-4 sm:ml-auto">
              <StatRing value={STUDENT.learningScore} label="Learning Score" color="#3b82f6" icon={<BookOpen className="w-3 h-3 mx-auto" />} />
              <StatRing value={STUDENT.skillScore} label="Skill Score" color="#8b5cf6" icon={<Zap className="w-3 h-3 mx-auto" />} />
              <StatRing value={STUDENT.careerReadiness} label="Career Ready" color="#f59e0b" icon={<Target className="w-3 h-3 mx-auto" />} />
            </div>
          </div>

          {/* XP Progress + Today's Goal */}
          <div className="relative mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* XP bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50 flex items-center gap-1"><Trophy className="w-3 h-3" /> XP प्रगती</span>
                <span className="text-xs font-bold text-amber-300">{STUDENT.xp} / {STUDENT.xpNext}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(STUDENT.xp / STUDENT.xpNext) * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg"
                />
              </div>
              <p className="text-[10px] text-white/35 mt-1">{STUDENT.xpNext - STUDENT.xp} XP बाकी — पुढील बॅज मिळवा!</p>
            </div>

            {/* Today's Goal */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <p className="text-xs text-white/50">{STUDENT.todayGoal.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  {Array.from({ length: STUDENT.todayGoal.total }).map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < STUDENT.todayGoal.done ? "bg-green-400" : "bg-white/15"}`} />
                  ))}
                </div>
              </div>
              <span className="text-sm font-extrabold text-green-400">{STUDENT.todayGoal.done}/{STUDENT.todayGoal.total}</span>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — CONTINUE LEARNING
        ══════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" /> अभ्यास सुरू ठेवा
            </h2>
            <span className="text-xs text-white/40">{PATH_ITEMS.filter(p => !p.isLocked).length} अध्याय उपलब्ध</span>
          </div>

          <div className="space-y-3">
            {PATH_ITEMS.map((item, index) => {
              const chapter = item.chapter;
              if (!chapter) return null;
              const isExpanded = expandedCard === item.chapterId;
              const conceptCount = chapter.topics.length;
              const quizCount = chapter.topics.reduce((a, t) => a + (t.quiz?.length || 0), 0);
              const activityCount = chapter.topics.filter(t => t.activity?.title).length;
              const projectCount = chapter.topics.filter(t => t.project?.title).length;
              const journey = getChapterJourneyDetails(chapter.id);

              return (
                <motion.div key={item.chapterId}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl overflow-hidden"
                  style={{ border: `1px solid ${item.isLocked ? "rgba(255,255,255,0.06)" : isExpanded ? `${item.accent}40` : "rgba(255,255,255,0.08)"}`, background: isExpanded ? `linear-gradient(135deg, ${item.accent}12, ${item.accent}05)` : "rgba(255,255,255,0.03)" }}
                >
                  {/* Card Header — always visible */}
                  <div
                    className={`p-5 ${item.isLocked ? "opacity-60" : "cursor-pointer"}`}
                    onClick={() => !item.isLocked && setExpandedCard(isExpanded ? null : item.chapterId)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Subject Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                        {item.isLocked ? "🔒" : chapter.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{ background: `${item.accent}20`, color: item.accent }}>
                            {item.subjectName}
                          </span>
                          {item.isLocked && (
                            <span className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> बंद
                            </span>
                          )}
                          {!item.isLocked && item.progress > 0 && (
                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                              चालू आहे
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-white text-base leading-tight truncate">{chapter.title}</h3>
                        <p className="text-white/45 text-xs mt-0.5">{chapter.titleEn}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {!item.isLocked && (
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold" style={{ color: item.accent }}>{item.progress}%</p>
                            <p className="text-[10px] text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.timeLeft}</p>
                          </div>
                        )}
                        {!item.isLocked && (
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-white/30">
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        )}
                        {item.isLocked && <Lock className="w-4 h-4 text-white/30" />}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {!item.isLocked && (
                      <div className="mt-4">
                        <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${item.accent}, ${item.accent}80)` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-white/35">{item.progress}% पूर्ण</span>
                          <span className="text-[10px] text-white/35 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {item.timeLeft} बाकी</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && !item.isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/8">
                          {/* Journey Pipeline */}
                          <div className="mb-4">
                            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-2">शिक्षण प्रवास</p>
                            <JourneyPipeline
                              conceptCount={chapter.topics.length}
                              quizCount={quizCount}
                              activityCount={activityCount}
                              projectCount={projectCount}
                              skills={SKILLS_DB[item.chapterId] ?? []}
                              careers={CAREERS_DB[item.chapterId] ?? []}
                              accent={item.accent}
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedChapter({ chapter, classId: item.classId, subjectId: item.subjectId })}
                              className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-90"
                              style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.accent}bb)`, boxShadow: `0 4px 0 ${item.accent}50` }}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> पुढे सुरू ठेवा
                            </button>
                            <button
                              onClick={() => { setExpandedCard(item.chapterId); setActiveTab("skills"); }}
                              className="flex items-center gap-2 text-xs font-bold text-white/70 bg-white/8 border border-white/10 hover:bg-white/12 px-4 py-2.5 rounded-xl transition-all"
                            >
                              <Zap className="w-3.5 h-3.5" /> कौशल्ये पाहा
                            </button>
                            <button
                              onClick={() => { setExpandedCard(item.chapterId); setActiveTab("careers"); }}
                              className="flex items-center gap-2 text-xs font-bold text-white/70 bg-white/8 border border-white/10 hover:bg-white/12 px-4 py-2.5 rounded-xl transition-all"
                            >
                              <Target className="w-3.5 h-3.5" /> करिअर पाहा
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTIONS 3-6 — TABBED DETAIL PANEL
        ══════════════════════════════════════════════════════ */}
        <section>
          {/* Section header + active chapter context */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" /> शिक्षण खोली
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="font-bold text-white/60">{activeChapter?.title ?? ""}</span> साठी
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {[
              { id: "journey", label: "🗺️ शिक्षण प्रवास" },
              { id: "skills", label: "⚡ कौशल्ये" },
              { id: "careers", label: "🎯 करिअर" },
              { id: "recommend", label: "💡 शिफारस" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-white/50 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Learning Journey ── */}
            {activeTab === "journey" && activeChapter && (
              <motion.div key="journey" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Journey flow card */}
                <div className="sm:col-span-2 lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <Map className="w-4 h-4 text-violet-400" /> प्रवास क्रम
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: "📚", label: "संकल्पना शिका", desc: `${activeChapter.topics.length} विषय`, color: "#3b82f6", done: true },
                      { icon: "📝", label: "क्विझ सोडवा", desc: `${activeChapter.topics.reduce((a, t) => a + (t.quiz?.length || 0), 0)} प्रश्न`, color: "#f59e0b", done: false },
                      { icon: "🧪", label: "कृती करा", desc: `${activeChapter.topics.filter(t => t.activity?.title).length} उपक्रम`, color: "#10b981", done: false },
                      { icon: "💡", label: "प्रकल्प बनवा", desc: `${activeChapter.topics.filter(t => t.project?.title).length} प्रकल्प`, color: "#8b5cf6", done: false },
                      { icon: "🚀", label: "Skill मिळवा", desc: `${activeSkills.length} कौशल्ये`, color: "#06b6d4", done: false },
                      { icon: "🎯", label: "करिअर जोडा", desc: `${activeCareers.length} करिअर`, color: "#f43f5e", done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${step.done ? "bg-green-500" : "bg-white/8 border border-white/15"}`}>
                            {step.done ? <CheckCircle2 className="w-4 h-4 text-white" /> : step.icon}
                          </div>
                          {i < 5 && <div className="w-0.5 h-4 my-0.5" style={{ background: step.done ? "#22c55e50" : "rgba(255,255,255,0.08)" }} />}
                        </div>
                        <div className="pb-1">
                          <p className="font-bold text-white text-xs">{step.label}</p>
                          <p className="text-white/40 text-[10px]">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics list */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-blue-400" /> विषय सूची
                  </h3>
                  <div className="space-y-2">
                    {activeChapter.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/20 flex items-center justify-center text-[10px] font-extrabold text-blue-300 shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{topic.title}</p>
                          <p className="text-[10px] text-white/40 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {topic.duration} • {topic.difficulty}
                          </p>
                        </div>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === 0 ? "text-green-400" : "text-white/15"}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini stats */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-amber-400" /> अध्याय आकडेवारी
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "संकल्पना", val: activeChapter.topics.length, icon: "📚", color: "#3b82f6" },
                      { label: "क्विझ प्रश्न", val: activeChapter.topics.reduce((a, t) => a + (t.quiz?.length || 0), 0), icon: "📝", color: "#f59e0b" },
                      { label: "उपक्रम", val: activeChapter.topics.filter(t => t.activity?.title).length, icon: "🧪", color: "#10b981" },
                      { label: "प्रकल्प", val: activeChapter.topics.filter(t => t.project?.title).length, icon: "💡", color: "#8b5cf6" },
                      { label: "कौशल्ये", val: activeSkills.length, icon: "🚀", color: "#06b6d4" },
                      { label: "करिअर", val: activeCareers.length, icon: "🎯", color: "#f43f5e" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
                        <div className="text-lg mb-1">{stat.icon}</div>
                        <div className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.val}</div>
                        <div className="text-[10px] text-white/40">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Skills ── */}
            {activeTab === "skills" && (
              <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-4 bg-white/4 border border-white/8 rounded-2xl p-4">
                  <p className="text-xs text-white/50 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <strong className="text-white">"{activeChapter?.title}"</strong> अध्यायातून तुम्ही हे कौशल्ये विकसित करता
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeSkills.map((skill, i) => (
                    <motion.div key={skill.name}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-5 group hover:border-white/20 transition-all"
                      style={{ borderColor: `${skill.color}25` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30` }}>
                          {skill.icon}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{skill.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1,2,3,4,5].map(s => (
                              <div key={s} className="w-4 h-1.5 rounded-full" style={{ background: s <= 3 + i ? skill.color : "rgba(255,255,255,0.1)" }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/50 text-xs">{skill.desc}</p>
                      <div className="mt-3 pt-3 border-t border-white/8 flex items-center gap-1 text-xs font-bold" style={{ color: skill.color }}>
                        <Award className="w-3 h-3" /> Skill Unlocked
                      </div>
                    </motion.div>
                  ))}

                  {/* All skills summary */}
                  <div className="sm:col-span-3 bg-gradient-to-r from-violet-600/15 to-indigo-600/15 border border-violet-400/20 rounded-3xl p-5">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-400" /> सर्व मिळालेली कौशल्ये
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[...activeSkills, ...SKILLS_DB["living-world"] ?? []].map(s => (
                        <span key={s.name} className="text-xs px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5"
                          style={{ color: s.color, borderColor: `${s.color}30`, background: `${s.color}10` }}>
                          {s.icon} {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Career Connection ── */}
            {activeTab === "careers" && (
              <motion.div key="careers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-4 bg-white/4 border border-white/8 rounded-2xl p-4">
                  <p className="text-xs text-white/50 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <strong className="text-white">"{activeChapter?.title}"</strong> अध्याय या करिअरसाठी उपयुक्त आहे
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCareers.map((career, i) => (
                    <motion.div key={career.title}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/8 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/20 flex items-center justify-center text-2xl">
                          {career.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-extrabold text-white">{career.title}</h4>
                          <p className="text-white/40 text-xs">💰 {career.salary}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-amber-400">{career.match}%</div>
                          <div className="text-[10px] text-white/40">Match</div>
                        </div>
                      </div>
                      <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                          initial={{ width: 0 }} animate={{ width: `${career.match}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                        <TrendingUp className="w-3 h-3" /> "{activeChapter?.title}" हे या करिअरमध्ये उपयुक्त आहे
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/career"
                    className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
                    <Sparkles className="w-4 h-4" /> सर्व करिअर पाहा → Career OS
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── Recommendations ── */}
            {activeTab === "recommend" && (
              <motion.div key="recommend" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Weak Concepts */}
                <div className="bg-rose-500/8 border border-rose-400/20 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4 text-rose-400" /> सुधारणे आवश्यक
                  </h3>
                  <div className="space-y-2">
                    {STUDENT.weakConcepts.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                        <span className="text-sm text-white/80">{c}</span>
                        <span className="ml-auto text-[10px] text-rose-400 font-bold">पुनरावलोकन करा</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Activities */}
                <div className="bg-emerald-500/8 border border-emerald-400/20 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <FlaskConical className="w-4 h-4 text-emerald-400" /> शिफारस उपक्रम
                  </h3>
                  <div className="space-y-2">
                    {STUDENT.recommendedActivities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                        <span className="text-sm">🧪</span>
                        <span className="text-sm text-white/80">{a}</span>
                        <span className="ml-auto text-[10px] text-emerald-400 font-bold">सुरू करा →</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Skills */}
                <div className="bg-violet-500/8 border border-violet-400/20 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-violet-400" /> शिफारस कौशल्ये
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {STUDENT.recommendedSkills.map((s, i) => (
                      <span key={i} className="text-xs bg-violet-500/15 border border-violet-400/25 text-violet-300 px-3 py-1.5 rounded-xl font-bold">
                        🚀 {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Careers */}
                <div className="bg-amber-500/8 border border-amber-400/20 rounded-3xl p-5">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-amber-400" /> शिफारस करिअर
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {STUDENT.recommendedCareers.map((c, i) => (
                      <Link key={i} href="/career"
                        className="text-xs bg-amber-500/15 border border-amber-400/25 text-amber-300 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-500/25 transition-colors">
                        🎯 {c}
                      </Link>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/30 mt-3">तुमच्या अभ्यासावर आधारित AI शिफारस</p>
                </div>

                {/* Full Roadmap CTA */}
                <div className="sm:col-span-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-400/20 rounded-3xl p-6 text-center">
                  <div className="text-4xl mb-3">🗺️</div>
                  <h3 className="text-xl font-extrabold mb-2">संपूर्ण करिअर रोडमॅप पाहा</h3>
                  <p className="text-white/50 text-sm mb-4">तुमच्या अभ्यासापासून ते करिअरपर्यंतचा संपूर्ण प्रवास</p>
                  <Link href="/career"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-colors">
                    <Map className="w-4 h-4" /> Career OS उघडा
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* ── Learning Detail Panel ── */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedChapter(null)}>
            <div onClick={e => e.stopPropagation()}>
              <LearningDetailPanel
                chapter={selectedChapter.chapter}
                classId={selectedChapter.classId}
                subjectId={selectedChapter.subjectId}
                onClose={() => setSelectedChapter(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
