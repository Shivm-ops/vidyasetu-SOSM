"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Play, BookOpen, Sparkles } from "lucide-react";
import { getClass, getSubject, SUBJECT_COLORS, getChapterJourneyDetails, Chapter } from "@/lib/curriculum-data";
import { LearningDetailPanel } from "@/components/curriculum/LearningDetailPanel";

export default function ChapterListPage() {
  const params = useParams();
  const router = useRouter();
  
  const classId = parseInt(params.classId as string, 10);
  const subjectId = params.subject as string;
  
  const classData = getClass(classId);
  const subjectData = getSubject(classId, subjectId);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  if (!classData || !subjectData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-marathi">
        <p>माहिती सापडली नाही.</p>
      </div>
    );
  }

  const colors = SUBJECT_COLORS[subjectId as keyof typeof SUBJECT_COLORS];

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide truncate">
              <Link href="/curriculum" className="hover:text-brand-600 shrink-0">अभ्यासक्रम</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <Link href={`/curriculum/${classId}`} className="hover:text-brand-600 shrink-0">{classData.label}</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 truncate flex items-center gap-2">
              <span className="text-2xl">{subjectData.icon}</span> {subjectData.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className={`bg-gradient-to-br ${colors?.gradient || "from-slate-600 to-slate-800"} text-white py-12 px-4`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">{subjectData.title}</h2>
            <p className="text-white/80 font-medium tracking-wide">{subjectData.titleEn}</p>
          </div>
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-5xl">
            {subjectData.icon}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-6">
        <div className="space-y-4">
          {subjectData.chapters.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">धडे उपलब्ध नाहीत</h3>
              <p className="text-slate-500">या विषयाचे धडे लवकरच उपलब्ध होतील.</p>
            </div>
          ) : (
            subjectData.chapters.map((chapter, index) => {
              const conceptCount = chapter.topics.length;
              const quizCount = chapter.topics.reduce((acc, t) => acc + (t.quiz?.length || 0), 0);
              const activityCount = chapter.topics.filter(t => t.activity?.title).length;
              const projectCount = chapter.topics.filter(t => t.project?.title).length;
              const journey = getChapterJourneyDetails(chapter.id);

              // Phase 3: Concept Mastery Hard Gate Mock Logic
              const isLocked = index > 0;
              
              return (
                <div
                  key={chapter.id}
                  className={`block bg-white border-2 border-slate-100 rounded-3xl p-6 transition-all group ${
                    isLocked ? 'opacity-70 cursor-not-allowed' : 'hover:border-brand-300 hover:shadow-lg cursor-pointer'
                  }`}
                  style={{ boxShadow: isLocked ? "none" : "0 4px 0 #f1f5f9" }}
                  onClick={() => {
                    if (isLocked) {
                      alert("Concept Mastery Required: You must master the previous chapter's concepts before unlocking this chapter.");
                    } else {
                      setSelectedChapter(chapter);
                    }
                  }}
                >
                  <div className="flex flex-col gap-4">
                    {/* Chapter Header */}
                    <div className="flex items-center gap-5">
                      {/* Chapter Number Badge */}
                      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center font-bold border border-slate-100 shrink-0 transition-colors ${isLocked ? 'text-slate-400' : 'text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                        <span className="text-[10px] uppercase tracking-wider mb-0.5">पाठ</span>
                        <span className="text-xl leading-none">{index + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{chapter.icon}</span>
                          <h3 className={`text-lg font-bold truncate transition-colors ${isLocked ? 'text-slate-500' : 'text-slate-900 group-hover:text-brand-600'}`}>
                            {chapter.title}
                          </h3>
                          {isLocked && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 flex items-center gap-1">
                              🔒 Locked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide truncate">{chapter.titleEn}</p>
                        {isLocked && (
                          <p className="text-xs text-red-500 font-medium mt-1">Previous concept mastery required.</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isLocked ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:text-white'}`}>
                          {isLocked ? (
                            <span className="text-lg">🔒</span>
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Student Growth Journey Pipeline */}
                    {!isLocked && (
                      <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl">
                            📚 {conceptCount} शिकणे
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 animate-pulse" />
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl">
                            📝 {quizCount} प्रश्न
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 animate-pulse" />
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl">
                            🧪 {activityCount} कृती
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 animate-pulse" />
                          <span className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-xl">
                            💡 {projectCount} प्रकल्प
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                          {journey.skills.map((s, i) => (
                            <span key={i} className="flex items-center gap-1 bg-indigo-50/50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full">
                              🚀 {s.name}
                            </span>
                          ))}
                          {journey.careers.map((c, i) => (
                            <span key={i} className="flex items-center gap-1 bg-orange-50/50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full">
                              🎯 {c.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Learning Detail Panel Slide-Over Dialog */}
      {selectedChapter && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setSelectedChapter(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LearningDetailPanel
              chapter={selectedChapter}
              classId={classId}
              subjectId={subjectId}
              onClose={() => setSelectedChapter(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
