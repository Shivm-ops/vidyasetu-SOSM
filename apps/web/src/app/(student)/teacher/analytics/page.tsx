"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BarChart, TrendingDown, TrendingUp, Users, AlertCircle, BookOpen, UserCircle2 } from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/teacher/dashboard" className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all text-slate-600">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <BarChart className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">वर्ग विश्लेषण</h1>
                <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Class Analytics</p>
              </div>
            </div>
          </div>
          <div>
            <select className="border border-slate-200 rounded-xl p-2 bg-slate-50 font-bold text-slate-700 text-sm focus:outline-none">
              <option>इयत्ता ५ वी</option>
              <option>इयत्ता ६ वी</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">एकूण विद्यार्थी</div>
            <div className="text-3xl font-black text-slate-900 mb-1">४५</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp className="w-3 h-3" /> १००% उपस्थिती
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">सरासरी गुण (गणित)</div>
            <div className="text-3xl font-black text-slate-900 mb-1">६८%</div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
              <TrendingDown className="w-3 h-3" /> ५% घसरण
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">सरासरी गुण (मराठी)</div>
            <div className="text-3xl font-black text-slate-900 mb-1">८५%</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp className="w-3 h-3" /> १०% वाढ
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">पूर्ण झालेले धडे</div>
            <div className="text-3xl font-black text-slate-900 mb-1">१२</div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              योजनेनुसार योग्य गतीने
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Mastery Progress */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> विषयानुसार प्रगती
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">मराठी</span>
                    <span className="text-green-600">८५%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">विज्ञान</span>
                    <span className="text-blue-600">७२%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">गणित</span>
                    <span className="text-rose-600">६८%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">इतिहास-भूगोल</span>
                    <span className="text-amber-600">८०%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-lg font-bold text-rose-900 mb-6 flex items-center gap-2 relative z-10">
                <AlertCircle className="w-5 h-5 text-rose-600" /> लर्निंग गॅप विश्लेषण (Weak Areas)
              </h2>

              <div className="space-y-4 relative z-10">
                <div className="border border-rose-100 bg-rose-50/50 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-rose-900">गणित: अपूर्णांकांची बेरीज</h3>
                    <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">High Priority</span>
                  </div>
                  <p className="text-sm text-rose-800 mb-3">वर्गातील ३५% विद्यार्थ्यांना अपूर्णांकांचा छेद समान करून बेरीज करण्यात अडचण येत आहे.</p>
                  <button className="text-xs font-bold bg-white text-rose-600 px-4 py-2 rounded-lg border border-rose-200 hover:bg-rose-50">
                    रेमेडियल (Remedial) धडा पाठवा
                  </button>
                </div>
                
                <div className="border border-amber-100 bg-amber-50/50 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-amber-900">विज्ञान: प्रकाशसंश्लेषण</h3>
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Medium Priority</span>
                  </div>
                  <p className="text-sm text-amber-800 mb-3">२०% विद्यार्थ्यांना 'हरितद्रव्य' (Chlorophyll) चे कार्य समजलेले नाही.</p>
                  <button className="text-xs font-bold bg-white text-amber-600 px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-50">
                    3D लॅब असाइनमेंट पाठवा
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Student Focus List */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-500" /> विद्यार्थ्यांकडे लक्ष द्या
              </h2>
              
              <div className="space-y-4">
                {[
                  { name: "रोहन जाधव", issue: "गणित क्विझमध्ये सलग कमी गुण", type: "academic" },
                  { name: "समीर शेख", issue: "३ दिवस गैरहजर", type: "attendance" },
                  { name: "अदिती पाटील", issue: "विज्ञान प्रकल्प पूर्ण नाही", type: "homework" },
                  { name: "नेहा माने", issue: "मराठी वाचनात अडचण", type: "academic" }
                ].map((student, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shrink-0">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <p className={`text-xs mt-0.5 ${
                        student.type === 'attendance' ? 'text-amber-600' :
                        student.type === 'academic' ? 'text-rose-600' : 'text-slate-500'
                      }`}>{student.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors">
                सर्व विद्यार्थी पहा
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
