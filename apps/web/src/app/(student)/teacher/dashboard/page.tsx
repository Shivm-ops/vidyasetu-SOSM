"use client";

import React from "react";
import Link from "next/link";
import { Users, FileText, BarChart, BookOpen, Clock, AlertCircle, Sparkles, PlusCircle } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">शिक्षक डॅशबोर्ड</h1>
              <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Teacher Assistant</p>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-700 text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Assistant Active
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">नमस्कार, पाटील सर!</h2>
          <p className="text-slate-600 font-medium">आजचा तुमचा वर्ग: ५वी व ६वी. काय मदत करू?</p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/teacher/lesson-planner"
            className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 hover:border-indigo-300 hover:shadow-xl transition-all group"
            style={{ boxShadow: "0 4px 0 #f1f5f9" }}
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI लेसन प्लॅनर</h3>
            <p className="text-sm text-slate-500 mb-4">कोणत्याही पाठाचे नियोजन सेकंदात करा.</p>
            <div className="flex items-center text-blue-600 text-sm font-bold gap-1">
              नवीन तयार करा <PlusCircle className="w-4 h-4" />
            </div>
          </Link>

          <Link 
            href="/teacher/question-generator"
            className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 hover:border-emerald-300 hover:shadow-xl transition-all group"
            style={{ boxShadow: "0 4px 0 #f1f5f9" }}
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">प्रश्नपत्रिका जनरेटर</h3>
            <p className="text-sm text-slate-500 mb-4">एका क्लिकवर प्रश्न आणि उत्तरे तयार करा.</p>
            <div className="flex items-center text-emerald-600 text-sm font-bold gap-1">
              नवीन तयार करा <PlusCircle className="w-4 h-4" />
            </div>
          </Link>

          <Link 
            href="/teacher/analytics"
            className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 hover:border-amber-300 hover:shadow-xl transition-all group"
            style={{ boxShadow: "0 4px 0 #f1f5f9" }}
          >
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">वर्ग विश्लेषण</h3>
            <p className="text-sm text-slate-500 mb-4">विद्यार्थ्यांची प्रगती आणि कमकुवत मुद्दे पहा.</p>
            <div className="flex items-center text-amber-600 text-sm font-bold gap-1">
              रिपोर्ट पहा <BarChart className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Schedule & Alerts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Schedule */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> आजचे वेळापत्रक
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 font-bold text-sm">०९:००</div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div>
                    <h4 className="font-bold text-slate-900">इयत्ता ५वी (गणित)</h4>
                    <p className="text-xs text-slate-500">अपूर्णांक - उजळणी</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="text-blue-500 font-bold text-sm">११:३०</div>
                  <div className="w-px h-8 bg-blue-200"></div>
                  <div>
                    <h4 className="font-bold text-blue-900">इयत्ता ६वी (विज्ञान)</h4>
                    <p className="text-xs text-blue-700">सजीव विश्व - ३D लॅब सेशन</p>
                  </div>
                </div>
                <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">आता</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 font-bold text-sm">०२:००</div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div>
                    <h4 className="font-bold text-slate-900">इयत्ता ५वी (मराठी)</h4>
                    <p className="text-xs text-slate-500">व्याकरण</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Alerts */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" /> AI अलर्ट्स
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                  <BarChart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-900 text-sm mb-1">५वी गणितात अडचण</h4>
                  <p className="text-sm text-rose-800/80 mb-2">१२ विद्यार्थ्यांना 'दशांश अपूर्णांक' समजायला कठीण जात आहे. सरावासाठी नवीन क्विझ पाठवावी का?</p>
                  <button className="text-xs font-bold bg-white text-rose-600 px-3 py-1.5 rounded-full border border-rose-200">
                    क्विझ जनरेट करा
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-1">अनुपस्थिती सूचना</h4>
                  <p className="text-sm text-amber-800/80">६वी तील रोहन सलग ३ दिवस गैरहजर आहे. पालकांशी संपर्क साधायला हवा.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
