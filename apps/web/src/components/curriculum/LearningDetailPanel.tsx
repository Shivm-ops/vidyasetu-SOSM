"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, PlayCircle, BookOpen, FileText, Briefcase, Activity, CheckCircle2, ChevronRight, Award, Trophy, Compass, Calendar, ArrowRight, Zap, Target } from "lucide-react";
import { Chapter, Topic, getChapterJourneyDetails, SkillMapping, CareerMapping } from "@/lib/curriculum-data";

interface LearningDetailPanelProps {
  chapter: Chapter;
  classId: number;
  subjectId: string;
  onClose: () => void;
}

export function LearningDetailPanel({ chapter, classId, subjectId, onClose }: LearningDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "concepts" | "practice" | "career">("overview");

  // Compute counts
  const conceptCount = chapter.topics.length;
  const quizCount = chapter.topics.reduce((acc, t) => acc + (t.quiz?.length || 0), 0);
  const activityCount = chapter.topics.filter(t => t.activity?.title).length;
  const projectCount = chapter.topics.filter(t => t.project?.title).length;

  // Retrieve journey details
  const journey = getChapterJourneyDetails(chapter.id);

  // Mock progress and mastery
  const progressPercent = Math.round((2 / Math.max(conceptCount, 3)) * 100);
  const masteryScore = 75;

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-brand-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-2xl shadow-md">
            {chapter.icon || "📖"}
          </div>
          <div>
            <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              पाठाचा प्रवास
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-marathi mt-0.5">{chapter.title}</h2>
            <p className="text-xs text-slate-500 font-medium">{chapter.titleEn}</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors border border-transparent hover:border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white px-2">
        {[
          { id: "overview", label: "प्रवास आढावा", icon: Compass },
          { id: "concepts", label: "📚 संकल्पना", icon: BookOpen },
          { id: "practice", label: "🧪 सराव व प्रकल्प", icon: Activity },
          { id: "career", label: "🎯 करिअर यश", icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all border-b-2 ${
                isActive 
                  ? "border-brand-500 text-brand-600 bg-brand-50/20" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-marathi">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Progress & Mastery */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" /> पाठाची प्रगती
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                  {progressPercent}% पूर्ण
                </span>
              </div>
              <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              
              <div className="pt-2 flex justify-between items-center border-t border-indigo-100/50">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-600" /> संकल्पना मास्टरी (Mastery)
                </span>
                <span className="text-sm font-black text-purple-700">
                  {masteryScore}%
                </span>
              </div>
            </div>

            {/* Summary */}
            <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                थोडक्यात माहिती (Summary)
              </h3>
              <p className="text-slate-700 font-marathi leading-relaxed text-sm">
                {journey.summary}
              </p>
            </section>

            {/* Learning Path Flow Diagram */}
            <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                करिअर प्रवासाची पावले (Journey Steps)
              </h3>
              <div className="relative pl-6 border-l-2 border-dashed border-brand-200 space-y-5 ml-3 my-2 text-sm">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white" />
                  <span className="font-extrabold text-blue-600 block mb-0.5">📚 शिकणे (Learning)</span>
                  <span className="text-xs text-slate-500 font-medium">{conceptCount} मुख्य शैक्षणिक मुद्दे व संकल्पना</span>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-white" />
                  <span className="font-extrabold text-amber-600 block mb-0.5">📝 चाचणी (Quiz)</span>
                  <span className="text-xs text-slate-500 font-medium">{quizCount} प्रश्न सोडवून स्वतःचे मूल्यमापन करा</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
                  <span className="font-extrabold text-emerald-600 block mb-0.5">🧪 कृती (Activity)</span>
                  <span className="text-xs text-slate-500 font-medium">{activityCount} साध्या घरगुती किंवा वर्गातील प्रात्यक्षिक कृती</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 border-4 border-white" />
                  <span className="font-extrabold text-rose-600 block mb-0.5">💡 प्रकल्प (Project)</span>
                  <span className="text-xs text-slate-500 font-medium">{projectCount} स्थानिक गाव किंवा पर्यावरणाशी संबंधित प्रकल्प</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white" />
                  <span className="font-extrabold text-indigo-600 block mb-0.5">🚀 कौशल्य (Skill)</span>
                  <span className="text-xs text-slate-500 font-medium">{journey.skills.map(s => s.name).join(", ")} विकास</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white" />
                  <span className="font-extrabold text-orange-600 block mb-0.5">🎯 करिअर (Career)</span>
                  <span className="text-xs text-slate-500 font-medium">उद्याचे करिअर: {journey.careers.map(c => c.title).join(", ")}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CONCEPTS TAB */}
        {activeTab === "concepts" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <section>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                📚 शैक्षणिक मुद्दे (Learning Concepts)
              </h3>
              
              <div className="space-y-3">
                {chapter.topics.map((topic, i) => (
                  <Link
                    key={topic.id}
                    href={`/curriculum/${classId}/${subjectId}/${chapter.id}/${topic.id}`}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 hover:border-brand-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-brand-600 transition-colors">
                        {topic.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{topic.titleEn}</p>
                    </div>
                    <div className="shrink-0 text-slate-400 group-hover:text-brand-500 transition-colors">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                🎓 शिकण्याचे उद्दिष्ट (Learning Objectives)
              </h3>
              <ul className="space-y-3">
                {chapter.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">{topic.title}:</span>
                      {topic.learningOutcome}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quizzes */}
            <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📝</span>
                <h3 className="text-sm font-bold text-slate-800">प्रकरण क्विझ (Chapter Quiz)</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                या पाठातील सर्व संकल्पनांवर आधारित एकूण {quizCount} सराव प्रश्न उपलब्ध आहेत.
              </p>
              
              <Link 
                href={`/curriculum/${classId}/${subjectId}/${chapter.id}/${chapter.topics[0]?.id || ""}`}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-amber-500/10 hover:-translate-y-0.5"
              >
                क्विझ सोडवा ⚡
              </Link>
            </section>

            {/* Activities */}
            <section>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                🧪 प्रात्यक्षिक कृती (Activities)
              </h3>
              <div className="space-y-3">
                {chapter.topics.map((t, i) => t.activity?.title && (
                  <div key={i} className="bg-gradient-to-r from-emerald-50/50 to-white border border-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        कृती {i + 1}
                      </span>
                      <h4 className="font-bold text-emerald-900 text-sm font-marathi">
                        {t.activity.title}
                      </h4>
                    </div>
                    <ul className="space-y-1 pl-1">
                      {t.activity.steps.slice(0, 3).map((step, j) => (
                        <li key={j} className="text-xs text-emerald-700/90 font-medium font-marathi flex gap-1">
                          <span>{j + 1}.</span> <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                💡 स्थानिक प्रकल्प (Village Projects)
              </h3>
              <div className="space-y-3">
                {chapter.topics.map((t, i) => t.project?.title && (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-200 transition-colors">
                    <div className="absolute right-0 top-0 w-1.5 h-full bg-brand-100 group-hover:bg-brand-500 transition-colors" />
                    <h4 className="font-bold text-slate-800 text-sm font-marathi mb-1">
                      {t.project.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-marathi leading-relaxed">
                      {t.project.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CAREER TAB */}
        {activeTab === "career" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Skills Mapping */}
            <section>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                🚀 विकसित होणारी कौशल्ये (Skills Gained)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {journey.skills.map((skill, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs font-marathi">
                        {skill.name}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {skill.nameEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Careers Mapping */}
            <section>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                🎯 करिअर संधी (Target Careers)
              </h3>
              
              <div className="space-y-4">
                {journey.careers.map((career, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-colors">
                    <div className="absolute right-0 top-0 w-1.5 h-full bg-orange-100 group-hover:bg-orange-500 transition-colors" />
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xl">🎯</span>
                      <h4 className="font-bold text-slate-900 text-base font-marathi">
                        {career.title}
                      </h4>
                    </div>
                    
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      करिअर रोडमॅप पायऱ्या (Career Path Steps)
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-orange-700 font-bold flex-wrap">
                      {career.path.split(" -> ").map((step, j, arr) => (
                        <React.Fragment key={j}>
                          <span className="bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                            {step}
                          </span>
                          {j < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-orange-300 shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
