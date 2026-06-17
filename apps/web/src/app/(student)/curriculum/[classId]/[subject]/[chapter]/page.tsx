"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Play, Clock, BarChart, BookOpen, Star, Sparkles } from "lucide-react";
import { getClass, getSubject, getChapter, SUBJECT_COLORS } from "@/lib/curriculum-data";

export default function TopicListPage() {
  const params = useParams();
  const router = useRouter();
  
  const classId = parseInt(params.classId as string, 10);
  const subjectId = params.subject as string;
  const chapterId = params.chapter as string;
  
  const classData = getClass(classId);
  const subjectData = getSubject(classId, subjectId);
  const chapterData = getChapter(classId, subjectId, chapterId);

  if (!classData || !subjectData || !chapterData) {
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
              <Link href={`/curriculum/${classId}/${subjectId}`} className="hover:text-brand-600 shrink-0">{subjectData.title}</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-slate-400 truncate">पाठ: {chapterData.title}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 truncate flex items-center gap-2">
              <span className="text-2xl">{chapterData.icon}</span> {chapterData.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className={`bg-gradient-to-br ${colors?.gradient || "from-slate-600 to-slate-800"} text-white py-12 px-4 relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{subjectData.title} • {classData.label}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">{chapterData.title}</h2>
            <p className="text-white/80 font-medium tracking-wide">{chapterData.titleEn}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex gap-6 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{chapterData.topics.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold">मुद्दे</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                {chapterData.topics.length * 50}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold">XP</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-6">
        <div className="space-y-6">
          {/* Section Heading */}
          <div className="flex items-center gap-3 ml-2">
            <div className={`w-8 h-8 rounded-full ${colors?.bg || "bg-slate-200"} flex items-center justify-center text-white`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">पाठाचे मुद्दे (Topics)</h3>
          </div>

          {chapterData.topics.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-100 shadow-sm">
              <p className="text-slate-500">या पाठाचे मुद्दे लवकरच उपलब्ध होतील.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {chapterData.topics.map((topic, index) => {
                const getDifficultyColor = (diff: string) => {
                  if (diff === "सोपे") return "bg-green-100 text-green-700 border-green-200";
                  if (diff === "मध्यम") return "bg-amber-100 text-amber-700 border-amber-200";
                  return "bg-rose-100 text-rose-700 border-rose-200";
                };

                return (
                  <Link
                    key={topic.id}
                    href={`/curriculum/${classId}/${subjectId}/${chapterId}/${topic.id}`}
                    className="group flex flex-col sm:flex-row bg-white border-2 border-slate-100 rounded-3xl p-1 hover:border-brand-300 hover:shadow-lg transition-all"
                    style={{ boxShadow: "0 4px 0 #f1f5f9" }}
                  >
                    {/* Number block */}
                    <div className="bg-slate-50 rounded-2xl p-4 sm:w-20 flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-1 shrink-0 border border-slate-100 group-hover:bg-brand-50 transition-colors m-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover:text-brand-400">मुद्दा</span>
                      <span className="text-2xl font-black text-slate-700 group-hover:text-brand-600">{index + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
                      <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">{topic.titleEn}</p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          {topic.duration}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${getDifficultyColor(topic.difficulty)}`}>
                          <BarChart className="w-3 h-3" />
                          {topic.difficulty}
                        </span>

                        {topic.has3D && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                            <span className="animate-pulse">✨</span> 3D
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 sm:p-5 sm:pl-0 flex items-center justify-end sm:justify-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:text-white transition-all shadow-sm">
                        <Play className="w-5 h-5 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
