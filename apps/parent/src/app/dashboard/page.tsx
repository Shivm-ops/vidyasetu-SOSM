"use client";

import React from "react";
import { Mic, GraduationCap, CalendarCheck, Award } from "lucide-react";

export default function ParentDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      {/* Top Header */}
      <header className="bg-brand-600 text-white p-6 shadow-md rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-2">पालक विभाग</h1>
        <p className="text-xl opacity-90 font-medium">तुमच्या पाल्याची प्रगती</p>
      </header>

      <main className="p-6 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">नमस्कार रमेशजी!</h2>

        <div className="space-y-6">
          {/* Voice Update Action (Prominent) */}
          <button className="w-full bg-blue-100 border-2 border-blue-300 text-blue-800 p-6 rounded-3xl flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-sm">
            <Mic className="w-10 h-10" />
            <div className="text-left">
              <span className="block text-2xl font-bold">आवाजात ऐका</span>
              <span className="block text-lg opacity-80">आजचा अहवाल</span>
            </div>
          </button>

          {/* Simple Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl text-center flex flex-col items-center">
              <CalendarCheck className="w-12 h-12 text-green-500 mb-2" />
              <span className="text-4xl font-bold text-gray-900 mb-1">९५%</span>
              <span className="text-xl text-gray-600 font-medium">उपस्थिती</span>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-3xl text-center flex flex-col items-center">
              <GraduationCap className="w-12 h-12 text-purple-500 mb-2" />
              <span className="text-4xl font-bold text-gray-900 mb-1">A+</span>
              <span className="text-xl text-gray-600 font-medium">ग्रेड</span>
            </div>
          </div>

          <div className="bg-orange-100 border-2 border-orange-300 text-orange-900 p-6 rounded-3xl flex items-center gap-4">
            <Award className="w-12 h-12 text-orange-600" />
            <div>
               <span className="block text-2xl font-bold">शिष्यवृत्ती</span>
               <span className="block text-lg opacity-80 font-medium">१ नवीन शिष्यवृत्ती उपलब्ध</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
