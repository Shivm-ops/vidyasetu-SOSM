"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsReports() {
  // Mock data for the heatmap & analytics
  const classStats = [
    { label: "एकूण विद्यार्थी", value: "४५", trend: "+२", isPositive: true },
    { label: "सरासरी उपस्थिती", value: "८८%", trend: "-३%", isPositive: false },
    { label: "क्विझ सरासरी (गणित)", value: "७६%", trend: "+५%", isPositive: true },
    { label: "पूर्ण झालेले धडे", value: "१२०", trend: "+१५", isPositive: true }
  ];

  const heatMapData = [
    { topic: "अपूर्णांकांची बेरीज", scores: [45, 52, 40, 60, 55], avg: 50.4 },
    { topic: "दशांश अपूर्णांक", scores: [80, 85, 75, 90, 88], avg: 83.6 },
    { topic: "भौमितिक रचना", scores: [65, 70, 60, 68, 72], avg: 67.0 },
    { topic: "गुणाकार आणि भागाकार", scores: [90, 92, 88, 95, 91], avg: 91.2 },
    { topic: "शेकडेवारी (Percentage)", scores: [35, 40, 30, 45, 38], avg: 37.6 },
  ];

  const getHeatmapColor = (score: number) => {
    if (score < 40) return "bg-red-100 text-red-700";
    if (score < 60) return "bg-orange-100 text-orange-700";
    if (score < 80) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" /> प्रगती अहवाल (Analytics)
        </h1>
        <p className="text-slate-400 mt-1">तुमच्या वर्गाची कामगिरी आणि सुधारणा आवश्यक असलेले विषय.</p>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {classStats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                <span className={`text-xs font-bold mb-1 flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-500" />
                वर्ग ५ वी - कमकुवत विषय (Weak Areas Heatmap)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                लाल आणि केशरी रंगातील विषयांकडे अधिक लक्ष देण्याची गरज आहे.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-4 w-1/3">विषय (Topic)</th>
                  <th className="p-4 text-center">गट अ (Group A)</th>
                  <th className="p-4 text-center">गट ब (Group B)</th>
                  <th className="p-4 text-center">गट क (Group C)</th>
                  <th className="p-4 text-center">गट ड (Group D)</th>
                  <th className="p-4 text-center bg-slate-50">सरासरी (Avg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {heatMapData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{row.topic}</td>
                    {row.scores.map((score, sIdx) => (
                      <td key={sIdx} className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md font-bold text-sm min-w-[3rem] ${getHeatmapColor(score)}`}>
                          {score}%
                        </span>
                      </td>
                    ))}
                    <td className="p-4 text-center bg-slate-50 border-l border-slate-100">
                      <span className={`inline-block px-3 py-1 rounded-md font-black text-sm min-w-[3rem] ${getHeatmapColor(row.avg)}`}>
                        {row.avg}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4 text-xs font-bold text-slate-600 justify-center">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200"></div> धोकादायक (&lt;40%)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-200"></div> सुधारणेची गरज (40-60%)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200"></div> साधारण (60-80%)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div> उत्तम (&gt;80%)</span>
          </div>
        </div>
      </main>
    </div>
  );
}
