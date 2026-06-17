"use client";

import React, { useState } from "react";
import { AnatomyNode } from "@/lib/anatomy-data";
import { X, PlayCircle, BookOpen, FileText, Briefcase, Activity, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";

interface LearningPanelProps {
  data: AnatomyNode;
  onClose: () => void;
}

export function LearningPanel({ data, onClose }: LearningPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "learn" | "practice" | "career">("overview");

  return (
    <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-40 flex flex-col animate-in slide-in-from-right-8 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-50 to-white">
        <div>
          <h2 className="text-xl font-bold text-brand-900 font-marathi">{data.name}</h2>
          <p className="text-xs text-brand-600 font-medium">{data.scientificName} • {data.relatedSystems[0]}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-brand-100 rounded-full text-brand-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-2 border-b bg-white">
        {[
          { id: "overview", icon: FileText, label: "माहिती" },
          { id: "learn", icon: BookOpen, label: "AI शिक्षक" },
          { id: "practice", icon: Activity, label: "सराव" },
          { id: "career", icon: Briefcase, label: "करिअर" }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 text-xs font-semibold transition-all border-b-2 ${
                isActive ? "border-brand-500 text-brand-600 bg-brand-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-marathi">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">स्थान (Location)</h3>
              <p className="text-gray-800 font-marathi">{data.location}</p>
            </section>
            
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">कार्य (Function)</h3>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <p className="text-gray-800 font-marathi font-medium">{data.function}</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-rose-600 font-marathi flex gap-2"><span className="text-rose-500 font-bold">⚠️ महत्त्व:</span> {data.importance}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">सामान्य आजार</h3>
              <div className="flex flex-wrap gap-2">
                {data.commonDiseases.map((d, i) => (
                  <span key={i} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-marathi">{d}</span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">प्रतिबंध (Prevention)</h3>
              <ul className="space-y-2">
                {data.preventionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-marathi">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {tip}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">रोचक तथ्य (Did you know?)</h3>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-xl">
                <ul className="space-y-3">
                  {data.interestingFacts.map((fact, i) => (
                    <li key={i} className="text-sm text-amber-900 font-marathi leading-relaxed">💡 {fact}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-brand-500 text-white p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold font-marathi">AI शिक्षक (Explanation)</h3>
                  <p className="text-xs text-brand-100 mt-0.5">साध्या भाषेत समजून घ्या</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-gray-800 font-marathi leading-relaxed">{data.aiExplanation}</p>
                
                <div className="bg-peacock-50 border border-peacock-100 p-4 rounded-lg">
                  <h4 className="font-bold text-peacock-800 text-sm mb-2 flex items-center gap-2">
                    <span>🏡</span> गावाकडचे उदाहरण (Village Example)
                  </h4>
                  <p className="text-sm text-peacock-700 font-marathi leading-relaxed">{data.villageExample}</p>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-700 py-3 rounded-lg font-bold hover:bg-brand-100 transition-colors">
                  <PlayCircle className="w-5 h-5" /> ऑडिओ ऐका (Listen)
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
              <h3 className="font-bold text-indigo-900 mb-2">AI ला प्रश्न विचारा</h3>
              <input 
                type="text" 
                placeholder="तुम्हाला काय विचारायचे आहे?" 
                className="w-full px-4 py-2 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">ज्ञानाची चाचणी (Quiz)</h3>
              <div className="space-y-4">
                {data.quizzes.map((quiz, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="font-semibold text-gray-800 font-marathi mb-3">Q{i+1}. {quiz.question}</p>
                    <div className="space-y-2">
                      {quiz.options.map((opt, j) => (
                         <button key={j} className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 text-sm text-gray-700 font-marathi transition-colors">
                           {opt}
                         </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">प्रात्यक्षिक (Activities)</h3>
              <div className="space-y-3">
                {data.activities.map((act, i) => (
                  <div key={i} className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 p-4 rounded-xl">
                    <h4 className="font-bold text-emerald-800 font-marathi mb-1">{act.title}</h4>
                    <p className="text-sm text-emerald-700/80 font-marathi">{act.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CAREER TAB */}
        {activeTab === "career" && (
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-marathi border border-blue-100 mb-6">
              या विषयाचा अभ्यास करून तुम्ही वैद्यकीय क्षेत्रातील (Medical Field) खालील उत्कृष्ट करिअर निवडू शकता.
            </div>

            {data.careers.map((career, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                <div className="absolute right-0 top-0 w-2 h-full bg-blue-100 group-hover:bg-blue-400 transition-colors" />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{career.title}</h3>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Career Path:</h4>
                <div className="flex items-center gap-2 text-sm text-blue-700 font-medium flex-wrap">
                  {career.path.split(" -> ").map((step, j, arr) => (
                    <React.Fragment key={j}>
                      <span className="bg-blue-50 px-2 py-1 rounded">{step}</span>
                      {j < arr.length - 1 && <ChevronRight className="w-4 h-4 text-blue-300" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
