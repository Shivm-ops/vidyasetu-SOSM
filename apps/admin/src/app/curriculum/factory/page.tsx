"use client";

import React, { useState } from "react";
import { Sparkles, Save, Server, BookOpen, Brain, Briefcase } from "lucide-react";
import { api } from "@/lib/api";

export default function AICurriculumFactory() {
  const [grade, setGrade] = useState("7");
  const [subjectCode, setSubjectCode] = useState("SCI7");
  const [chapterTitle, setChapterTitle] = useState("");
  
  const [status, setStatus] = useState<"IDLE" | "GENERATING" | "REVIEW" | "APPROVING" | "SUCCESS" | "ERROR">("IDLE");
  const [message, setMessage] = useState("");
  const [payload, setPayload] = useState<any>(null);

  const handleGenerate = async () => {
    if (!chapterTitle.trim()) {
      setStatus("ERROR");
      setMessage("Please enter a chapter title.");
      return;
    }
    
    try {
      setStatus("GENERATING");
      const res = await api.post("/factory/generate", { grade, subjectCode, chapterTitle });
      setPayload(res.data.data);
      setStatus("REVIEW");
    } catch (e: any) {
      setStatus("ERROR");
      setMessage(e.response?.data?.message || e.message || "Failed to generate");
    }
  };

  const handleApprove = async () => {
    try {
      setStatus("APPROVING");
      const res = await api.post("/factory/approve", payload);
      setStatus("SUCCESS");
      setMessage(`Successfully Published: ${res.data.data.chapters} Chapters, ${res.data.data.concepts} Concepts.`);
    } catch (e: any) {
      setStatus("ERROR");
      setMessage(e.response?.data?.message || e.message || "Failed to approve");
    }
  };

  const chapter = payload?.classes?.[0]?.subjects?.[0]?.chapters?.[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-marathi">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              AI Curriculum Factory
            </h1>
            <p className="text-slate-500 mt-1">
              Generate entire curriculum trees via AI and publish them to the Knowledge Graph.
            </p>
          </div>
        </header>

        {/* Input Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Class</label>
            <select className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500" value={grade} onChange={e => setGrade(e.target.value)}>
              {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>Class {i+1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
            <select className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500" value={subjectCode} onChange={e => setSubjectCode(e.target.value)}>
              <option value={`SCI${grade}`}>Science</option>
              <option value={`MATH${grade}`}>Mathematics</option>
              <option value={`MAR${grade}`}>Marathi</option>
              <option value={`ENG${grade}`}>English</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chapter Title</label>
              <input 
                type="text" 
                placeholder="e.g. Photosynthesis"
                value={chapterTitle}
                onChange={e => setChapterTitle(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={status === "GENERATING" || status === "APPROVING"}
              className="px-6 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 h-[38px] mt-auto"
            >
              {status === "GENERATING" ? (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Thinking...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate</span>
              )}
            </button>
          </div>
        </div>

        {/* Error / Success Message */}
        {status === "ERROR" && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {message}
          </div>
        )}
        {status === "SUCCESS" && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 font-medium flex items-center gap-2">
            <Server className="w-5 h-5 text-green-500" />
            {message}
          </div>
        )}

        {/* Review Interface */}
        {status === "REVIEW" && chapter && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div>
                <h3 className="text-purple-900 font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Generation Complete
                </h3>
                <p className="text-sm text-purple-700 mt-1">Please review the content below before publishing to production.</p>
              </div>
              <button 
                onClick={handleApprove}
                className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Approve & Publish
              </button>
            </div>

            {/* Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{chapter.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{chapter.summary}</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-700 text-sm mb-2 uppercase tracking-wide">Learning Objectives</h4>
                  <ul className="space-y-1">
                    {chapter.learningObjectives.map((lo: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span> {lo}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm mb-2 uppercase tracking-wide">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {chapter.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Concepts Grid */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Generated Concepts ({chapter.concepts.length})
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {chapter.concepts.map((concept: any, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-lg mb-2">{concept.name}</h4>
                    <p className="text-sm text-slate-600 mb-4">{concept.explanation}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <span className="block text-xs font-bold text-orange-800 mb-1">REAL LIFE EXAMPLE</span>
                        <p className="text-xs text-orange-700">{concept.realLifeExample}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <span className="block text-xs font-bold text-emerald-800 mb-1">VILLAGE EXAMPLE</span>
                        <p className="text-xs text-emerald-700">{concept.villageExample}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-600">
                          {concept.careers.length} Careers Detected
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-600">
                          {concept.skills.length} Skills Mapped
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
