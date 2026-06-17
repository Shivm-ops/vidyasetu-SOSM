"use client";

import React, { useState } from "react";
import { BookOpen, Bot, Loader2, Download, CheckCircle2, Target } from "lucide-react";
import axios from "axios";

export default function AILessonPlanner() {
  const [grade, setGrade] = useState("5");
  const [subject, setSubject] = useState("गणित");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setLessonPlan(null);

    try {
      const response = await axios.post("http://localhost:3001/api/v1/intelligence/teacher-assistant", {
        session_id: "teacher-session-1",
        teacher_id: "teacher-1",
        subject: subject,
        grade: parseInt(grade, 10),
        topic: topic,
        task: "lesson_plan",
        language: "mr"
      }, {
        headers: { "Content-Type": "application/json" }
        // Note: In a real app, authorization token from Teacher login would be sent here
      });

      if (response.data.success && response.data.data?.structured_output) {
        setLessonPlan(response.data.data.structured_output);
      } else if (response.data.structured_output) {
         setLessonPlan(response.data.structured_output);
      } else {
        setError("पाठ नियोजन तयार करताना त्रुटी आली.");
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
      <header className="bg-indigo-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" /> AI पाठ नियोजन (Lesson Planner)
        </h1>
        <p className="text-indigo-100 mt-1">तुमच्या वर्गासाठी स्मार्ट आणि अचूक धडे तयार करा.</p>
      </header>

      <main className="p-6 max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">इयत्ता (Class)</label>
              <select 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(g => (
                  <option key={g} value={g}>इयत्ता {g} वी</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">विषय (Subject)</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="गणित">गणित (Maths)</option>
                <option value="विज्ञान">विज्ञान (Science)</option>
                <option value="इंग्रजी">इंग्रजी (English)</option>
                <option value="मराठी">मराठी (Marathi)</option>
                <option value="इतिहास">इतिहास (History)</option>
                <option value="भूगोल">भूगोल (Geography)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">घटक (Topic)</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="उदा. अपूर्णांकांची बेरीज"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              प्लॅन तयार करा
            </button>
          </form>
          
          {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
        </div>

        {/* Results Section */}
        <div className="md:col-span-2">
          {!lessonPlan && !loading && (
            <div className="bg-indigo-50 border-2 border-indigo-100 border-dashed rounded-2xl h-full flex flex-col items-center justify-center p-10 text-center text-indigo-400">
              <BookOpen className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">डावीकडील फॉर्म भरून पाठ नियोजन तयार करा.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl h-full min-h-[400px] shadow-sm border border-gray-200 flex flex-col items-center justify-center p-10 text-indigo-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-bold text-lg">AI पाठ तयार करत आहे...</p>
              <p className="text-sm text-gray-500 mt-2">ह्यासाठी १०-१५ सेकंद लागू शकतात.</p>
            </div>
          )}

          {lessonPlan && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h2>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">इयत्ता {grade} • {subject}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                      ⏱ {lessonPlan.duration}
                    </span>
                  </div>
                </div>
                <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors border border-indigo-100">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-bold text-green-900 mb-1 flex items-center gap-2">
                  <Target className="w-4 h-4" /> उद्देश (Objective)
                </h3>
                <p className="text-green-800 text-sm">{lessonPlan.objective}</p>
              </div>

              <div className="space-y-4">
                {lessonPlan.sections?.map((section: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        {section.name}
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </p>
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
