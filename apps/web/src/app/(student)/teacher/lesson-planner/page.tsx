"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, Loader2, Save, Download } from "lucide-react";

export default function LessonPlannerPage() {
  const [topic, setTopic] = useState("");
  const [classGrade, setClassGrade] = useState("५ वी");
  const [subject, setSubject] = useState("गणित");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setPlan(null);

    // Simulate AI generation
    setTimeout(() => {
      setPlan(`
# पाठ नियोजन: ${topic}
**इयत्ता:** ${classGrade} | **विषय:** ${subject} | **वेळ:** ४५ मिनिटे

---

## १. पाठाचे उद्दिष्ट (Learning Outcomes)
- विद्यार्थ्यांना '${topic}' ची मूळ संकल्पना समजेल.
- विद्यार्थी दैनंदिन जीवनातील उदाहरणांशी याचा संबंध जोडू शकतील.

## २. पूर्वज्ञान जागृती (Introduction) - ५ मिनिटे
- **प्रश्न:** काल आपण काय शिकलो होतो?
- **AI सुचवलेली कृती:** विद्यार्थ्यांना एक साधे उदाहरण द्या (उदा. बाजारातील हिशोब).

## ३. मुख्य संकल्पना शिकवणे (Core Concept) - २० मिनिटे
- **स्पष्टीकरण:** ${topic} म्हणजे काय हे सोप्या भाषेत सांगा.
- **वापरण्याचे साहित्य:** खडू-फळा, 3D स्मार्ट बोर्ड लॅब, किंवा स्मार्ट टीव्ही.
- **टीप:** वर्गातील दोन विद्यार्थ्यांची उदाहरणे देऊन समजावून सांगा.

## ४. गट कार्य आणि सराव (Group Activity) - १० मिनिटे
- **कृती:** वर्गाचे ४ गट करा. प्रत्येकाला एक कृतीपत्रिका (Worksheet) द्या.
- **AI मदत:** विज्ञानासाठी 3D लॅब उघडून मुलांना स्वतः पाहू द्या. गणितासाठी स्मार्ट बोर्डवर प्रश्न द्या.

## ५. मूल्यमापन (Assessment) - ५ मिनिटे
- विद्यार्थ्यांना ३ साधे प्रश्न विचारा. 
- जे उत्तर देतील त्यांना VidyaSetu अॅपवर १० XP चे बक्षीस देण्याचे सांगा.

## ६. गृहपाठ (Homework) - ५ मिनिटे
- पुस्तकातील स्वाध्याय आणि VidyaSetu अॅपवरील सराव चाचणी सोडवून आणण्यास सांगा.
      `);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/teacher/dashboard" className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all text-slate-600">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI लेसन प्लॅनर</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!plan && !isGenerating && (
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" /> पाठाची माहिती द्या
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">इयत्ता</label>
                <select 
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {["१ ली", "२ री", "३ री", "४ थी", "५ वी", "६ वी", "७ वी", "८ वी", "९ वी", "१० वी"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">विषय</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-blue-500 focus:outline-none"
                >
                  {["मराठी", "गणित", "इंग्रजी", "विज्ञान", "इतिहास-भूगोल"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">पाठाचे नाव / मुद्दा</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="उदा. अपूर्णांक, प्रकाशसंश्लेषण, सजीव विश्व..."
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> प्लॅन जनरेट करा
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">AI प्लॅन तयार करत आहे...</h2>
            <p className="text-slate-500">कृपया काही सेकंद थांबा</p>
          </div>
        )}

        {plan && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end mb-4 gap-3">
              <button onClick={() => setPlan(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">
                नवीन तयार करा
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">
                <Download className="w-4 h-4" /> PDF डाउनलोड
              </button>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h2:text-blue-700 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4">
                {/* Note: In a real app we'd use a markdown parser. Here we just use a basic text display for the simulation. */}
                {plan.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mb-4 text-center">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-blue-700 border-b border-blue-100 pb-2 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.replace('- ', '')}</li>;
                  if (line.startsWith('**')) {
                     const parts = line.split('**');
                     return <p key={i} className="mb-4">{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>
                  }
                  if (line.startsWith('---')) return <hr key={i} className="my-6" />;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
