"use client";

import React from "react";
import Link from "next/link";
import { User, CheckCircle2, TrendingUp, Calendar, BookOpen, AlertCircle, Phone, MessageCircle } from "lucide-react";

export default function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      {/* Super Simple Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">पालक पोर्टल</h1>
              <p className="text-sm text-slate-500 font-medium">अभिजीत पाटील यांचे पालक</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Today's Summary Banner */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <h2 className="text-xl font-bold mb-1">आजची माहिती</h2>
          <p className="text-green-100 mb-4">१६ जून २०२६</p>
          
          <div className="flex items-center gap-3 bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="bg-white text-green-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">अभिजीत शाळेत हजर होता.</p>
              <p className="text-sm text-green-50 mt-1">आज त्याने ३ धडे पूर्ण केले.</p>
            </div>
          </div>
        </div>

        {/* Main Navigation Buttons (Big and Clear) */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/parent/progress"
            className="bg-white border-2 border-slate-100 rounded-[2rem] p-5 text-center shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">प्रगती पहा</h3>
            <p className="text-xs text-slate-500 mt-1">विषयानुसार गुण</p>
          </Link>

          <Link 
            href="/parent/weekly-report"
            className="bg-white border-2 border-slate-100 rounded-[2rem] p-5 text-center shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">आठवड्याचा रिपोर्ट</h3>
            <p className="text-xs text-slate-500 mt-1">WhatsApp वर पाठवा</p>
          </Link>
        </div>

        {/* Simple Alerts */}
        <div className="bg-white border-2 border-rose-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" /> शिक्षकांचा निरोप
          </h3>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
            <p className="text-slate-800 text-sm leading-relaxed font-medium">
              "अभिजीत गणितात थोडा मागे पडत आहे. कृपया त्याला रोज संध्याकाळी १५ मिनिटे VidyaSetu अॅपवर गणिताचा सराव करायला सांगा." 
              <br/><br/>
              <span className="text-rose-600 font-bold">- पाटील सर (वर्गशिक्षक)</span>
            </p>
          </div>
        </div>

        {/* Contact Teacher */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">शिक्षकांशी बोला</h3>
          <p className="text-slate-400 text-sm mb-6">काही प्रश्न असल्यास सरांना थेट मेसेज करा.</p>
          <div className="flex gap-3">
            <button className="flex-1 bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> मेसेज
            </button>
            <button className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
              <Phone className="w-5 h-5" /> कॉल
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
