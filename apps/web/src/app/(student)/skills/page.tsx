"use client";

import React from "react";
import { Rocket, ArrowLeft, Star, Award, Zap, MessageCircle, Wallet, Laptop, Bot, Crown, Lightbulb } from "lucide-react";
import Link from "next/link";

const SKILL_TRACKS = [
  {
    id: "english",
    title: "इंग्रजी बोलणे",
    titleEn: "Spoken English",
    icon: MessageCircle,
    color: "bg-blue-500",
    shadow: "#1d4ed8",
    progress: 40,
    desc: "दैनंदिन जीवनातील इंग्रजी संवाद"
  },
  {
    id: "finance",
    title: "आर्थिक साक्षरता",
    titleEn: "Financial Literacy",
    icon: Wallet,
    color: "bg-emerald-500",
    shadow: "#047857",
    progress: 10,
    desc: "पैसे, बचत आणि बँकिंगचे ज्ञान"
  },
  {
    id: "digital",
    title: "डिजिटल साक्षरता",
    titleEn: "Digital Literacy",
    icon: Laptop,
    color: "bg-cyan-500",
    shadow: "#0369a1",
    progress: 0,
    desc: "इंटरनेट, ईमेल आणि सुरक्षितता"
  },
  {
    id: "ai",
    title: "AI साक्षरता",
    titleEn: "AI Literacy",
    icon: Bot,
    color: "bg-indigo-500",
    shadow: "#4338ca",
    progress: 0,
    desc: "AI म्हणजे काय आणि त्याचा वापर"
  },
  {
    id: "leadership",
    title: "नेतृत्व",
    titleEn: "Leadership",
    icon: Crown,
    color: "bg-amber-500",
    shadow: "#b45309",
    progress: 0,
    desc: "निर्णय घेणे आणि आत्मविश्वास"
  },
  {
    id: "entrepreneurship",
    title: "उद्योजकता",
    titleEn: "Entrepreneurship",
    icon: Lightbulb,
    color: "bg-rose-500",
    shadow: "#be123c",
    progress: 0,
    desc: "नवीन व्यवसाय आणि कल्पना"
  }
];

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all text-slate-600">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">कौशल्ये डोजो</h1>
                <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Skill Development</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-2 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>१२० XP</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Active Weekly Mission */}
        <section className="mb-10 relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-sm group hover:border-purple-300 transition-all">
          <div className="absolute -right-10 -top-10 opacity-5 group-hover:scale-110 transition-transform duration-500">
             <Zap size={200} className="text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3 h-3 fill-current" /> आठवड्याचे मिशन
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-slate-900">
              AI मित्रासोबत ५ इंग्रजी वाक्ये बोला
            </h2>
            <p className="text-slate-600 font-medium mb-8 max-w-lg">
              इंग्रजी बोलण्याची भीती घालवण्यासाठी रोज ५ साधी वाक्ये AI सोबत बोला. चुका झाल्या तरी चालतील!
            </p>
            
            {/* Progress Bar */}
            <div className="mb-6 max-w-md">
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>प्रगती: २/५ दिवस</span>
                <span className="text-purple-600">४०% पूर्ण</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: '40%' }} />
              </div>
            </div>

            <Link href="/skills/english" className="inline-block bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors shadow-md">
              मिशन सुरू करा
            </Link>
          </div>
        </section>

        {/* Skill Tracks */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">२१ व्या शतकातील कौशल्ये</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_TRACKS.map(track => (
              <Link 
                key={track.id}
                href={`/skills/${track.id}`}
                className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 hover:border-slate-300 transition-all group relative overflow-hidden"
                style={{ boxShadow: `0 6px 0 ${track.progress > 0 ? track.shadow : '#f1f5f9'}` }}
              >
                {/* Bg glow */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${track.color} group-hover:scale-150 transition-transform duration-500`} />
                
                <div className={`w-14 h-14 rounded-2xl ${track.color} text-white flex items-center justify-center mb-5 shadow-sm group-hover:-translate-y-1 transition-transform`}>
                  <track.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{track.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{track.titleEn}</p>
                <p className="text-sm text-slate-600 font-medium mb-6">{track.desc}</p>
                
                {/* Mini progress */}
                <div className="mt-auto">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    <span>{track.progress}%</span>
                    {track.progress === 100 ? <span className="text-green-600">पूर्ण</span> : <span>सुरू करा</span>}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${track.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${track.progress}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
