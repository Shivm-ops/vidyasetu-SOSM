"use client";

import React from "react";
import { Users, BookOpen, Bot } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-marathi pb-20">
      <header className="bg-brand-600 text-white p-6 shadow-md rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-1">शिक्षक डॅशबोर्ड</h1>
        <p className="text-lg opacity-90 font-medium">सुसज्ज आणि सोपे</p>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">नमस्कार शिक्षक!</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white border-2 border-brand-200 p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform shadow-[0_4px_0_#fed7aa]">
            <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
               <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">उपस्थिती</h3>
            <p className="text-gray-600 font-medium text-lg">वर्गातील विद्यार्थ्यांची हजेरी घ्या</p>
          </div>

          <div className="bg-white border-2 border-blue-200 p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform shadow-[0_4px_0_#bfdbfe]">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
               <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">अभ्यास आणि गृहपाठ</h3>
            <p className="text-gray-600 font-medium text-lg">नवीन धडे आणि गृहपाठ द्या</p>
          </div>

          <div className="sm:col-span-2 bg-indigo-50 border-2 border-indigo-200 p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform shadow-[0_4px_0_#a5b4fc] flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
               <Bot className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI पाठ नियोजन (Lesson Planner)</h3>
              <p className="text-gray-600 font-medium text-lg">तुमच्या वर्गासाठी AI द्वारे पाठाचे नियोजन करा</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
