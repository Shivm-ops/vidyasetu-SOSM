"use client";

import React, { useState } from "react";
import { FileQuestion, Settings2, Loader2, Download, Printer, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function AssessmentGenerator() {
  const [grade, setGrade] = useState("5");
  const [subject, setSubject] = useState("गणित");
  const [chapter, setChapter] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim()) return;

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await axios.post("http://localhost:3001/api/v1/intelligence/generate-quiz", {
        subject: subject,
        grade: parseInt(grade, 10),
        chapter: chapter,
        num_questions: numQuestions,
        difficulty: difficulty,
        question_types: ["MCQ", "SHORT_ANSWER"],
        language: "mr"
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
      } else {
        setError("प्रश्नपत्रिका तयार करताना त्रुटी आली.");
      }
    } catch (err) {
      console.error(err);
      setError("AI सर्व्हरशी संपर्क होऊ शकला नाही.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-marathi pb-20">
      <header className="bg-emerald-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileQuestion className="w-6 h-6" /> प्रश्नपत्रिका जनरेटर
        </h1>
        <p className="text-emerald-100 mt-1">AI वापरून सेकंदात तुमच्या वर्गासाठी सराव चाचणी तयार करा.</p>
      </header>

      <main className="p-6 max-w-5xl mx-auto grid lg:grid-cols-12 gap-6">
        
        {/* Form Section */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <form onSubmit={handleGenerate} className="space-y-5">
            <h3 className="font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> सेटिंग्ज (Settings)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">इयत्ता</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(g => (
                    <option key={g} value={g}>इयत्ता {g} वी</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">विषय</label>
                <select 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="गणित">गणित</option>
                  <option value="विज्ञान">विज्ञान</option>
                  <option value="इंग्रजी">इंग्रजी</option>
                  <option value="मराठी">मराठी</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">धडा (Chapter/Topic)</label>
              <input 
                type="text" 
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="उदा. पेशींची रचना"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">प्रश्नांची संख्या ({numQuestions})</label>
              <input 
                type="range" 
                min="5" 
                max="20" 
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>५ प्रश्न</span>
                <span>२० प्रश्न</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">काठिण्य पातळी (Difficulty)</label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                      difficulty === level 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {level === 'easy' ? 'सोपी' : level === 'medium' ? 'मध्यम' : 'कठीण'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !chapter.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileQuestion className="w-5 h-5" />}
              प्रश्नपत्रिका तयार करा
            </button>
          </form>
          
          {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8">
          {!questions.length && !loading && (
            <div className="bg-emerald-50 border-2 border-emerald-100 border-dashed rounded-2xl h-full flex flex-col items-center justify-center p-10 text-center text-emerald-400">
              <FileQuestion className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">डावीकडील फॉर्म भरून प्रश्नपत्रिका तयार करा.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl h-full min-h-[400px] shadow-sm border border-gray-200 flex flex-col items-center justify-center p-10 text-emerald-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-bold text-lg">AI प्रश्नपत्रिका तयार करत आहे...</p>
              <p className="text-sm text-gray-500 mt-2">प्रश्न निवडण्यासाठी थोडा वेळ लागू शकतो.</p>
            </div>
          )}

          {questions.length > 0 && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">सराव चाचणी: {chapter}</h2>
                  <p className="text-gray-500 text-sm mt-1">इयत्ता {grade} वी • {subject} • {questions.length} प्रश्न</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-200" title="Print">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors border border-emerald-100" title="Download PDF">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {questions.map((q: any, idx: number) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute left-0 top-0 text-emerald-600 font-bold">{idx + 1}.</div>
                    <div className="space-y-3">
                      <p className="font-bold text-gray-900 text-lg">{q.question_text}</p>
                      
                      {q.options && q.options.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-3 mt-4">
                          {q.options.map((opt: any, optIdx: number) => (
                            <div key={optIdx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                              <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-500 bg-white">
                                {opt.id.toUpperCase()}
                              </span>
                              <span className="text-gray-700">{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
                        <p className="text-sm font-bold text-green-800 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> उत्तर: {q.correct_answer}
                        </p>
                        <p className="text-sm text-green-700 opacity-90">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
