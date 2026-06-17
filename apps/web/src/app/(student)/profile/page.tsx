"use client";

import React from "react";
import { BookOpen, Rocket, Target, Lightbulb, Leaf, Star } from "lucide-react";

export default function StudentProfile() {
  // Mock data for the OS Growth Scores
  const scores = {
    learningScore: 85,
    skillScore: 45,
    careerReadinessScore: 60,
    innovationScore: 30,
    communityImpactScore: 50,
    overallGrowthScore: 54,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-marathi pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">तुमची प्रोफाईल (Profile)</h1>
        <p className="text-sm text-gray-500 mt-1">तुमचा सर्वांगीण विकास आणि स्कोअर्स</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Overall Score */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-center shadow-lg mb-8 relative overflow-hidden border border-indigo-400">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-white/80 font-bold text-lg mb-2">ओव्हरऑल ग्रोथ स्कोअर (Learning Intelligence Index)</h2>
            <div className="flex items-center justify-center gap-3">
              <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
              <span className="text-6xl font-extrabold text-white tracking-tight">{scores.overallGrowthScore}</span>
              <span className="text-white/60 text-xl font-bold self-end mb-2">/ 100</span>
            </div>
          </div>
        </section>

        {/* Phase 3: Career DNA Profile */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-500" />
            तुमचा करिअर DNA (Top Matches)
          </h2>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
            {[
              { title: "सॉफ्टवेअर इंजिनिअर (Software Engineer)", match: 92 },
              { title: "डेटा ॲनालिस्ट (Data Analyst)", match: 85 },
              { title: "ॲग्रीटेक एक्सपर्ट (Agritech)", match: 78 }
            ].map((career, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-gray-800 text-sm">{i + 1}. {career.title}</span>
                <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-green-200">
                  {career.match}% Match
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 3: Student Growth Timeline (Monthly Tracking) */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-500" />
            ६ महिन्यांची प्रगती (Growth Timeline)
          </h2>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
            <div className="flex gap-4 min-w-[500px]">
              {/* Mock Timeline Columns */}
              {[
                { month: "Jan", academic: 40, skill: 20 },
                { month: "Feb", academic: 45, skill: 25 },
                { month: "Mar", academic: 55, skill: 30 },
                { month: "Apr", academic: 60, skill: 35 },
                { month: "May", academic: 75, skill: 40 },
                { month: "Jun", academic: 85, skill: 45 }
              ].map((data, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="h-32 w-full bg-gray-50 rounded-lg relative flex items-end justify-center px-1">
                    {/* Academic Bar */}
                    <div className="w-1/3 bg-blue-500 rounded-t-sm" style={{ height: `${data.academic}%` }} />
                    {/* Skill Bar */}
                    <div className="w-1/3 bg-purple-500 rounded-t-sm" style={{ height: `${data.skill}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold text-gray-500">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm" /> अभ्यास (Academic)</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm" /> कौशल्ये (Skills)</div>
            </div>
          </div>
        </section>

        {/* 5 Pillars Progress Bars */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Vidyasetu V2 OS पिलर्स</h2>
        
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
          <ScoreBar label="लर्निंग (Learning OS)" icon={BookOpen} score={scores.learningScore} color="bg-blue-500" iconBg="bg-blue-50 text-blue-600" />
          <ScoreBar label="स्किल्स (Skill OS)" icon={Rocket} score={scores.skillScore} color="bg-purple-500" iconBg="bg-purple-50 text-purple-600" />
          <ScoreBar label="करिअर (Career OS)" icon={Target} score={scores.careerReadinessScore} color="bg-orange-500" iconBg="bg-orange-50 text-orange-600" />
          <ScoreBar label="इनोव्हेशन (Innovation OS)" icon={Lightbulb} score={scores.innovationScore} color="bg-yellow-500" iconBg="bg-yellow-50 text-yellow-600" />
          <ScoreBar label="कम्युनिटी (Village OS)" icon={Leaf} score={scores.communityImpactScore} color="bg-green-500" iconBg="bg-green-50 text-green-600" />
        </div>

      </main>
    </div>
  );
}

function ScoreBar({ label, icon: Icon, score, color, iconBg }: { label: string, icon: any, score: number, color: string, iconBg: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-700 text-sm">{label}</span>
        </div>
        <span className="font-bold text-gray-900 text-sm">{score}%</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
