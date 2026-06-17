"use client";

import React, { useEffect } from "react";
import { BookOpen, Rocket, Target, Lightbulb, Leaf, Bot, Play, Flame, Sparkles, FlaskConical } from "lucide-react";
import { ModuleCard } from "@/components/ui/module-card";
import { StreakBadge, XPBadge, GrowthAvatar } from "@/components/ui/gamification-badges";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useGamificationStoreSafe } from "@/hooks/useGamificationStoreSafe";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentDashboard() {
  const updateStreak = useGamificationStore((state) => state.updateStreak);
  const addXP = useGamificationStore((state) => state.addXP);
  
  // Growth Engine Pillars
  const learningXP = useGamificationStoreSafe((state) => state.learningXP) ?? 0;
  const skillXP = useGamificationStoreSafe((state) => state.skillXP) ?? 0;
  const careerXP = useGamificationStoreSafe((state) => state.careerXP) ?? 0;
  const innovationXP = useGamificationStoreSafe((state) => state.innovationXP) ?? 0;
  const communityXP = useGamificationStoreSafe((state) => state.communityXP) ?? 0;

  useEffect(() => {
    updateStreak();
    addXP('learning', 10); // Login bonus to learning
  }, [updateStreak, addXP]);

  return (
    <div className="min-h-screen bg-gray-50/50 font-marathi">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <GrowthAvatar />
          <div className="flex items-center gap-3">
            <StreakBadge />
            <XPBadge />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 font-marathi">
            👋 नमस्कार अभिजीत!
          </h1>
          <p className="text-gray-500 font-medium font-marathi">
            चला, आजचा प्रवास सुरू करूया.
          </p>
        </section>

        {/* Phase 3: Smart Recommendation Banner */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 sm:p-6 shadow-md border border-orange-400 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shrink-0">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-orange-100 tracking-wider uppercase mb-1">स्मार्ट रेकमेंडेशन (AI Engine)</div>
                <h3 className="text-white font-bold text-lg leading-tight">तुमचा 'अपूर्णांक' हा विषय थोडा कच्चा आहे.</h3>
                <p className="text-white/80 text-sm mt-1">आपण १० मिनिटांची उजळणी करूया का?</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-white text-orange-600 font-bold py-2.5 px-6 rounded-xl shadow-sm hover:bg-orange-50 transition-colors shrink-0">
              सराव सुरू करा
            </button>
          </div>
        </section>

        {/* AI Classroom Hero Banner */}
        <section className="mb-8">
          <Link href="/classroom" className="block group">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-[2rem] p-6 overflow-hidden border border-purple-500/30"
              style={{ boxShadow: "0 8px 0 #3b0764" }}
            >
              {/* Background glows */}
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-violet-600 rounded-full blur-3xl opacity-20" />
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-pink-600 rounded-full blur-3xl opacity-10" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-500/20 border border-violet-400/30 p-3 rounded-2xl backdrop-blur-sm shrink-0">
                    <Sparkles className="w-8 h-8 text-violet-300" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-violet-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                      <span className="bg-violet-500/30 border border-violet-400/40 px-2 py-0.5 rounded-full">NEW</span>
                      Flagship Feature
                    </div>
                    <h2 className="text-2xl font-extrabold text-white leading-tight">AI वर्गखोली</h2>
                    <p className="text-white/60 text-sm mt-0.5">AI Smart Board • 3D विज्ञान लॅब • AI व्हिज्युअल शिक्षक</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-violet-500 group-hover:bg-violet-400 transition-colors text-white font-bold py-3 px-6 rounded-2xl shadow-[0_4px_0_#4c1d95] shrink-0 text-sm">
                  <FlaskConical className="w-4 h-4" /> AI क्लासरूम उघडा
                </div>
              </div>

              {/* Mini module indicators */}
              <div className="relative z-10 mt-4 flex gap-2 flex-wrap">
                {["✍️ Smart Board", "🔢 Math Solver", "🫀 Science Lab", "🌍 Geography", "🌱 Agriculture", "🤖 AI Teacher"].map(label => (
                  <span key={label} className="text-[11px] font-bold text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{label}</span>
                ))}
              </div>
            </motion.div>
          </Link>
        </section>

        {/* Current Mission Banner (Duolingo style) */}
        <section className="mb-10">
          <div className="bg-brand-50 border-2 border-brand-200 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-200 rounded-full blur-3xl opacity-50" />
            
            <div className="flex items-center gap-4 z-10 w-full md:w-auto">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-100 flex-shrink-0">
                <BookOpen className="w-8 h-8 text-brand-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-600 mb-1 tracking-wide uppercase">आजचे मिशन</div>
                <h2 className="text-xl font-bold text-gray-900">गणित: अपूर्णांक आणि दशांश</h2>
                <p className="text-sm text-gray-600">लेव्हल ३ • ६०% पूर्ण</p>
              </div>
            </div>
            
            <Link href="/curriculum/5/mathematics/fractions" className="w-full md:w-auto btn-3d bg-brand-500 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_6px_0_#c2410c] hover:bg-brand-400 flex items-center justify-center gap-2 z-10">
              <Play className="w-5 h-5 fill-white" />
              सुरू करा
            </Link>
          </div>
        </section>

        {/* Stat Bar (Replaces old colored pentagon boxes) */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-gray-900">तुमचा विकास (XP)</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            <StatPill icon={BookOpen} color="text-learning" bg="bg-learning-light" value={learningXP} label="अभ्यास" />
            <StatPill icon={Rocket} color="text-skills" bg="bg-skills-light" value={skillXP} label="कौशल्ये" />
            <StatPill icon={Target} color="text-career" bg="bg-career-light" value={careerXP} label="करिअर" />
            <StatPill icon={Lightbulb} color="text-innovation" bg="bg-innovation-light" value={innovationXP} label="नावीन्य" />
            <StatPill icon={Leaf} color="text-village" bg="bg-village-light" value={communityXP} label="समाज" />
          </div>
        </section>

        {/* 3D Immersive Learning Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span className="bg-brand-100 text-brand-600 px-2 py-1 rounded-lg text-sm">नवीन</span> 
            3D इमर्सिव्ह लर्निंग
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            <Link href="/learning-os/3d/anatomy" className="block shrink-0 snap-start w-64 h-40 bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2rem] p-5 relative overflow-hidden group shadow-[0_6px_0_#9f1239] hover:translate-y-1 hover:shadow-[0_2px_0_#9f1239] transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"><BookOpen size={100} /></div>
              <h3 className="text-white font-bold text-xl font-marathi">मानवी शरीर रचना</h3>
              <p className="text-white/80 text-sm mt-1 font-marathi">Anatomy 3D</p>
            </Link>
            
            <Link href="/learning-os/3d/science" className="block shrink-0 snap-start w-64 h-40 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] p-5 relative overflow-hidden group shadow-[0_6px_0_#3730a3] hover:translate-y-1 hover:shadow-[0_2px_0_#3730a3] transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"><Rocket size={100} /></div>
              <h3 className="text-white font-bold text-xl font-marathi">विज्ञान प्रयोगशाळा</h3>
              <p className="text-white/80 text-sm mt-1 font-marathi">Science Lab 3D</p>
            </Link>

            <Link href="/learning-os/3d/geography" className="block shrink-0 snap-start w-64 h-40 bg-gradient-to-br from-sky-400 to-cyan-600 rounded-[2rem] p-5 relative overflow-hidden group shadow-[0_6px_0_#0369a1] hover:translate-y-1 hover:shadow-[0_2px_0_#0369a1] transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"><Target size={100} /></div>
              <h3 className="text-white font-bold text-xl font-marathi">भूगोल</h3>
              <p className="text-white/80 text-sm mt-1 font-marathi">Geography 3D</p>
            </Link>

            <Link href="/village/3d/agriculture" className="block shrink-0 snap-start w-64 h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-5 relative overflow-hidden group shadow-[0_6px_0_#065f46] hover:translate-y-1 hover:shadow-[0_2px_0_#065f46] transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"><Leaf size={100} /></div>
              <h3 className="text-white font-bold text-xl font-marathi">शेती तंत्रज्ञान</h3>
              <p className="text-white/80 text-sm mt-1 font-marathi">Agriculture 3D</p>
            </Link>
          </div>
        </section>

        {/* The Modules Grid - Vidyasetu V2 OS Widgets */}
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          आजचे ओएस डॅशबोर्ड (OS Dashboard)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="📚 आजचे शिक्षण"
            description="लर्निंग OS - अपूर्णांक आणि दशांश"
            icon={BookOpen}
            href="/learning-os"
            colorClass="bg-learning"
            shadowColorHex="#1d4ed8"
            progress={65}
            delay={0.1}
          />
          <ModuleCard
            title="🎯 आजचे ध्येय"
            description="करिअर OS - दररोज २ धडे वाचा"
            icon={Target}
            href="/career"
            colorClass="bg-career"
            shadowColorHex="#c2410c"
            progress={50}
            delay={0.2}
          />
          <ModuleCard
            title="📝 आजची चाचणी"
            description="विज्ञान सराव आणि टेस्ट"
            icon={FlaskConical}
            href="/learning-os"
            colorClass="bg-blue-500"
            shadowColorHex="#1e3a8a"
            progress={0}
            delay={0.3}
          />
          <ModuleCard
            title="🚀 नवीन कौशल्य"
            description="स्किल्स OS - आर्थिक साक्षरता"
            icon={Rocket}
            href="/skills"
            colorClass="bg-skills"
            shadowColorHex="#7e22ce"
            progress={25}
            delay={0.4}
          />
          <ModuleCard
            title="💡 आजची नवकल्पना"
            description="इनोव्हेशन OS - पाणी वाचवणे मॉडेल"
            icon={Lightbulb}
            href="/innovation"
            colorClass="bg-innovation"
            shadowColorHex="#a16207"
            progress={40}
            delay={0.5}
          />
          <ModuleCard
            title="🌾 गावासाठी प्रकल्प"
            description="व्हिलेज OS - शेततळे माहिती"
            icon={Leaf}
            href="/village"
            colorClass="bg-village"
            shadowColorHex="#15803d"
            progress={15}
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function StatPill({ icon: Icon, color, bg, value, label }: { icon: any, color: string, bg: string, value: number, label: string }) {
  return (
    <div className="flex items-center gap-3 bg-white p-3 pr-5 rounded-2xl border border-gray-100 shadow-sm snap-start shrink-0">
      <div className={`p-2 rounded-xl ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="font-bold text-gray-900 leading-none mb-1">{value}</div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}
