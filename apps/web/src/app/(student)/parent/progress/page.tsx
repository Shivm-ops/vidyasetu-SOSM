"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ParentProgressPage() {
  const subjects = [
    { name: "मराठी", score: "८५%", trend: "up", color: "bg-green-500", lightBg: "bg-green-50", text: "text-green-700", msg: "खूप छान! वाचन सुधारले आहे." },
    { name: "गणित", score: "५५%", trend: "down", color: "bg-rose-500", lightBg: "bg-rose-50", text: "text-rose-700", msg: "कमी गुण. सरावाची गरज आहे." },
    { name: "विज्ञान", score: "७०%", trend: "same", color: "bg-blue-500", lightBg: "bg-blue-50", text: "text-blue-700", msg: "चांगली प्रगती. प्रयोग आवडतात." },
    { name: "इंग्रजी", score: "६०%", trend: "up", color: "bg-indigo-500", lightBg: "bg-indigo-50", text: "text-indigo-700", msg: "वाक्ये बोलण्याचा सराव सुरू आहे." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/parent" className="p-2 bg-slate-100 rounded-xl text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">विषयानुसार प्रगती</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 text-center mb-8 shadow-sm">
          <p className="text-slate-500 font-bold mb-1">एकूण सरासरी गुण</p>
          <div className="text-5xl font-black text-slate-900 mb-2">६७%</div>
          <p className="text-sm text-slate-600 font-medium">मागील महिन्यापेक्षा <span className="text-green-600 font-bold">+५%</span> सुधारणा</p>
        </div>

        <div className="space-y-4">
          {subjects.map((sub, i) => (
            <div key={i} className={`border-2 ${sub.lightBg} border-${sub.color.split('-')[1]}-200 rounded-3xl p-5 relative overflow-hidden`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-xl font-bold ${sub.text}`}>{sub.name}</h3>
                <div className="flex items-center gap-2">
                  {sub.trend === 'up' && <TrendingUp className={`w-5 h-5 text-green-600`} />}
                  {sub.trend === 'down' && <TrendingDown className={`w-5 h-5 text-rose-600`} />}
                  {sub.trend === 'same' && <Minus className={`w-5 h-5 text-blue-600`} />}
                  <span className={`text-2xl font-black ${sub.text}`}>{sub.score}</span>
                </div>
              </div>
              <p className={`text-sm font-bold ${sub.text} bg-white/50 inline-block px-3 py-1.5 rounded-lg`}>
                शिक्षकांचा शेरा: {sub.msg}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
