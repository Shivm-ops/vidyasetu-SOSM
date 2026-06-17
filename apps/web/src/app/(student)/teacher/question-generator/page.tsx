"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, Loader2, Download, Printer } from "lucide-react";

export default function QuestionGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [classGrade, setClassGrade] = useState("५ वी");
  const [subject, setSubject] = useState("गणित");
  const [marks, setMarks] = useState("२०");
  const [isGenerating, setIsGenerating] = useState(false);
  const [paper, setPaper] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setPaper(null);

    // Simulate AI generation
    setTimeout(() => {
      setPaper(`
# चाचणी परीक्षा: ${topic}
**इयत्ता:** ${classGrade} | **विषय:** ${subject} | **एकूण गुण:** ${marks}

---

## प्रश्न १: रिकाम्या जागा भरा. (५ गुण)
१. अंश आणि छेद असलेल्या संख्येला __________ म्हणतात.
२. एका भाकरीचे ४ समान भाग केल्यास प्रत्येक भाग __________ असतो.
३. जर अंश मोठा असेल तर तो अपूर्णांक __________ असतो.
४. २/४ म्हणजे __________ होय.
५. ज्या अपूर्णांकात अंश आणि छेद समान असतात, त्याचे मूल्य __________ असते.

## प्रश्न २: योग्य पर्याय निवडा. (५ गुण)
१. १/२ आणि १/४ मध्ये कोणता अपूर्णांक मोठा आहे?
   अ) १/४  ब) १/२  क) दोन्ही समान  ड) सांगता येत नाही
२. ३/३ = ?
   अ) ०  ब) ३  क) १  ड) ९
   
*(AI ने उर्वरित प्रश्न लपवले आहेत)*

## प्रश्न ३: खालील उदाहरणे सोडवा. (१० गुण)
१. रामूने एका कलिंगडाचे ८ तुकडे केले. त्यातील ३ तुकडे त्याने खाल्ले. तर त्याने किती अपूर्णांक कलिंगड खाल्ले? (२ गुण)
२. ३/५ आणि १/५ ची बेरीज करा. (२ गुण)
३. ५/७ मधून २/७ वजा करा. (२ गुण)
४. ३/४ ला सममूल्य (Equivalent) असलेला कोणताही एक अपूर्णांक लिहा. (२ गुण)
५. एका शेताचा १/३ भाग गव्हाचा आणि १/३ भाग ज्वारीचा आहे. तर एकूण किती भागात धान्य लावले आहे? (२ गुण)

---
**शिक्षक टीप:** VidyaSetu अॅपवर या चाचणीची उत्तरे उपलब्ध आहेत.
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
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">प्रश्नपत्रिका जनरेटर</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!paper && !isGenerating && (
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-500" /> चाचणीची माहिती द्या
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">इयत्ता</label>
                  <select 
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-emerald-500 focus:outline-none"
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
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    {["मराठी", "गणित", "इंग्रजी", "विज्ञान", "इतिहास-भूगोल"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">पाठाचे नाव / घटक</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="उदा. अपूर्णांक, प्रकाशसंश्लेषण..."
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">एकूण गुण</label>
                <select 
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-medium focus:border-emerald-500 focus:outline-none"
                >
                  {["१०", "१५", "२०", "२५", "४०", "५०"].map(m => (
                    <option key={m} value={m}>{m} गुण</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> प्रश्नपत्रिका जनरेट करा
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">AI प्रश्न तयार करत आहे...</h2>
            <p className="text-slate-500">कृतीपत्रिका आणि उत्तरे शोधत आहे</p>
          </div>
        )}

        {paper && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end mb-4 gap-3">
              <button onClick={() => setPaper(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">
                नवीन तयार करा
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">
                <Download className="w-4 h-4" /> PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">
                <Printer className="w-4 h-4" /> प्रिंट
              </button>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h2:text-emerald-700 prose-h2:mt-6 prose-h2:mb-3">
                {paper.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mb-4 text-center">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-emerald-700 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('**शिक्षक टीप:**')) return <p key={i} className="mt-8 pt-4 border-t border-slate-200 text-slate-500 italic text-sm">{line}</p>;
                  if (line.startsWith('**')) {
                     const parts = line.split('**');
                     return <p key={i} className="mb-4">{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>
                  }
                  if (line.startsWith('---')) return <hr key={i} className="my-6" />;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
