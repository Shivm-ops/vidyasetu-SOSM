"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Lock, CheckCircle2, Trophy, Star, MessageCircle, Wallet, Laptop, Bot, Crown, Lightbulb } from "lucide-react";

// Mock Data for Skill Tracks
const SKILL_DATA = {
  "english": {
    title: "इंग्रजी बोलणे",
    titleEn: "Spoken English",
    icon: MessageCircle,
    color: "bg-blue-500",
    text: "text-blue-600",
    desc: "रोजच्या जीवनात आत्मविश्वासाने इंग्रजी बोलायला शिका.",
    modules: [
      { id: 1, title: "स्वतःची ओळख (Introduction)", duration: "15 min", completed: true, locked: false },
      { id: 2, title: "दुकानात संवाद (At the Shop)", duration: "20 min", completed: false, locked: false },
      { id: 3, title: "वेळ आणि दिवस (Time & Days)", duration: "15 min", completed: false, locked: true },
      { id: 4, title: "भावना व्यक्त करणे (Emotions)", duration: "20 min", completed: false, locked: true }
    ]
  },
  "finance": {
    title: "आर्थिक साक्षरता",
    titleEn: "Financial Literacy",
    icon: Wallet,
    color: "bg-emerald-500",
    text: "text-emerald-600",
    desc: "पैसे वाचवणे, बँक खाते आणि हुशारीने खर्च करणे शिका.",
    modules: [
      { id: 1, title: "बचत का महत्त्वाची?", duration: "15 min", completed: true, locked: false },
      { id: 2, title: "बँक खाते कसे उघडायचे?", duration: "25 min", completed: false, locked: false },
      { id: 3, title: "UPI आणि डिजिटल पेमेंट", duration: "20 min", completed: false, locked: true },
      { id: 4, title: "व्याजाची जादू (Compound Interest)", duration: "30 min", completed: false, locked: true }
    ]
  },
  "digital": {
    title: "डिजिटल साक्षरता",
    titleEn: "Digital Literacy",
    icon: Laptop,
    color: "bg-cyan-500",
    text: "text-cyan-600",
    desc: "इंटरनेटचा सुरक्षित वापर आणि ईमेल करणे शिका.",
    modules: [
      { id: 1, title: "इंटरनेट काय आहे?", duration: "15 min", completed: false, locked: false },
      { id: 2, title: "ईमेल पाठवणे आणि वाचणे", duration: "20 min", completed: false, locked: true },
      { id: 3, title: "ऑनलाइन फसवणूक (Scams) टाळा", duration: "20 min", completed: false, locked: true }
    ]
  },
  "ai": {
    title: "AI साक्षरता",
    titleEn: "AI Literacy",
    icon: Bot,
    color: "bg-indigo-500",
    text: "text-indigo-600",
    desc: "AI म्हणजे काय आणि ते तुमचे काम कसे सोपे करू शकते.",
    modules: [
      { id: 1, title: "AI म्हणजे काय?", duration: "15 min", completed: false, locked: false },
      { id: 2, title: "ChatGPT कसे वापरावे?", duration: "25 min", completed: false, locked: true },
      { id: 3, title: "अभ्यासात AI चा वापर", duration: "20 min", completed: false, locked: true }
    ]
  },
  "leadership": {
    title: "नेतृत्व",
    titleEn: "Leadership",
    icon: Crown,
    color: "bg-amber-500",
    text: "text-amber-600",
    desc: "आत्मविश्वास वाढवा आणि उत्तम निर्णय घ्यायला शिका.",
    modules: [
      { id: 1, title: "आत्मविश्वास कसा वाढवायचा?", duration: "15 min", completed: false, locked: false },
      { id: 2, title: "लोकांसमोर कसे बोलायचे?", duration: "30 min", completed: false, locked: true },
      { id: 3, title: "कठीण निर्णय घेणे", duration: "20 min", completed: false, locked: true }
    ]
  },
  "entrepreneurship": {
    title: "उद्योजकता",
    titleEn: "Entrepreneurship",
    icon: Lightbulb,
    color: "bg-rose-500",
    text: "text-rose-600",
    desc: "स्वतःचा व्यवसाय कसा सुरू करायचा याच्या कल्पना.",
    modules: [
      { id: 1, title: "व्यवसाय म्हणजे काय?", duration: "15 min", completed: false, locked: false },
      { id: 2, title: "गावातील नवीन व्यवसाय कल्पना", duration: "25 min", completed: false, locked: true },
      { id: 3, title: "नफा आणि तोटा समजून घेणे", duration: "20 min", completed: false, locked: true }
    ]
  }
};

export default function SkillTrackPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.skillId as string;
  
  const skill = SKILL_DATA[skillId as keyof typeof SKILL_DATA];

  if (!skill) {
    return <div className="min-h-screen flex items-center justify-center">कौशल्य सापडले नाही.</div>;
  }

  const completedCount = skill.modules.filter(m => m.completed).length;
  const progress = Math.round((completedCount / skill.modules.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
              <Link href="/skills" className="hover:text-brand-600">कौशल्ये डोजो</Link>
            </div>
            <h1 className={`text-xl font-bold ${skill.text} flex items-center gap-2`}>
              <skill.icon className="w-5 h-5" /> {skill.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={`${skill.color} text-white py-12 px-4 relative overflow-hidden`}>
        <div className="absolute right-0 top-0 opacity-10 scale-150 translate-x-1/4 -translate-y-1/4">
          <skill.icon size={250} />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {skill.titleEn}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{skill.title}</h2>
          <p className="text-white/90 text-lg font-medium max-w-lg mb-8">{skill.desc}</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">प्रगती</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-white/80 mt-2 text-center">{completedCount} पैकी {skill.modules.length} धडे पूर्ण</p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-4">
        
        {/* Certificate Teaser */}
        {progress < 100 && (
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 mb-8 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">प्रमाणपत्र जिंका!</h3>
              <p className="text-sm text-slate-600 font-medium">हा कोर्स पूर्ण करा आणि '{skill.title}' चे प्रमाणपत्र मिळवा.</p>
            </div>
          </div>
        )}

        {/* Modules List */}
        <h3 className="text-xl font-bold text-slate-900 mb-4">अभ्यासक्रम</h3>
        <div className="space-y-4">
          {skill.modules.map((mod, i) => (
            <div 
              key={mod.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all flex items-center gap-4 ${
                mod.locked 
                  ? "border-slate-100 opacity-60 grayscale" 
                  : mod.completed 
                    ? "border-green-200" 
                    : "border-slate-200 hover:border-brand-300 shadow-sm"
              }`}
            >
              {/* Status Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                mod.completed ? "bg-green-100 text-green-600" :
                mod.locked ? "bg-slate-100 text-slate-400" :
                "bg-brand-50 text-brand-600"
              }`}>
                {mod.completed ? <CheckCircle2 className="w-6 h-6" /> :
                 mod.locked ? <Lock className="w-5 h-5" /> :
                 <Play className="w-5 h-5 ml-1 fill-current" />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">धडा {i + 1}</div>
                <h4 className={`text-lg font-bold ${mod.completed ? "text-green-900" : "text-slate-900"} mb-1`}>
                  {mod.title}
                </h4>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span>{mod.duration}</span>
                  {!mod.locked && !mod.completed && <span className="text-brand-600 font-bold">+५० XP</span>}
                </div>
              </div>

              {/* Action Button */}
              {!mod.locked && !mod.completed && (
                <button className={`hidden sm:flex bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors`}>
                  सुरू करा
                </button>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
