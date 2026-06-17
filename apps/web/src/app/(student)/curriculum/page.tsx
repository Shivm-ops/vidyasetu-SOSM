"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { CURRICULUM, CLASS_ICONS } from "@/lib/curriculum-data";

export default function CurriculumHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">अभ्यासक्रम</h1>
              <p className="text-xs text-slate-500 font-medium">Curriculum Explorer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">तुमची इयत्ता निवडा</h2>
          <p className="text-slate-600">महाराष्ट्र राज्य मंडळ अभ्यासक्रम • Class 1 to 10</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CURRICULUM.map((cls) => (
            <Link
              key={cls.id}
              href={`/curriculum/${cls.id}`}
              className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-brand-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col items-center text-center"
              style={{ boxShadow: "0 4px 0 #f1f5f9" }}
            >
              {/* Highlight for full content classes */}
              {cls.isFullContent && (
                <div className="absolute top-3 right-3 bg-brand-100 text-brand-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Full
                </div>
              )}

              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-brand-50 transition-transform">
                {CLASS_ICONS[cls.id]}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cls.label}</h3>
              <p className="text-xs text-slate-500 mb-4">{cls.ageRange}</p>

              <div className="w-full mt-auto bg-slate-50 text-slate-500 group-hover:bg-brand-500 group-hover:text-white py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1">
                सुरू करा <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-lg">शिकणे कधीही थांबू नका!</h4>
              <p className="text-blue-700 text-sm">येथे सर्व इयत्तांचा अभ्यासक्रम उपलब्ध आहे. तुम्ही कोणत्याही इयत्तेचे धडे पाहू शकता.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
