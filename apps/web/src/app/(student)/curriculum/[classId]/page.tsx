"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import { getClass, SUBJECT_COLORS } from "@/lib/curriculum-data";

export default function SubjectPickerPage() {
  const params = useParams();
  const router = useRouter();
  const classId = parseInt(params.classId as string, 10);
  
  const classData = getClass(classId);

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-marathi">
        <p>इयत्ता सापडली नाही.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
              <Link href="/curriculum" className="hover:text-brand-600">अभ्यासक्रम</Link>
              <ChevronRight className="w-3 h-3" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{classData.label}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">विषय निवडा</h2>
          <p className="text-slate-600">तुम्हाला कोणता विषय शिकायचा आहे?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classData.subjects.map((subject) => {
            const colors = SUBJECT_COLORS[subject.id as keyof typeof SUBJECT_COLORS];
            const chapterCount = subject.chapters.length;

            return (
              <Link
                key={subject.id}
                href={`/curriculum/${classId}/${subject.id}`}
                className={`bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-slate-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                style={{ boxShadow: "0 4px 0 #f1f5f9" }}
              >
                {/* Decorative blob */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${colors?.gradient || "from-slate-400 to-slate-600"} group-hover:scale-150 transition-transform duration-500`} />
                
                <div className={`w-14 h-14 ${colors?.bg || "bg-slate-100"} ${colors ? "text-white" : "text-slate-600"} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:-translate-y-1 transition-transform`}>
                  {subject.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{subject.title}</h3>
                <p className="text-xs text-slate-500 mb-6 font-medium uppercase tracking-wide">{subject.titleEn}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <BookOpen className="w-4 h-4" />
                    {chapterCount} {chapterCount === 1 ? "धडा" : "धडे"}
                  </div>
                  <div className={`w-8 h-8 rounded-full ${colors?.bg || "bg-slate-200"} text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
