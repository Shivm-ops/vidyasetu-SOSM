"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, ChevronRight, Play, CheckCircle2, 
  Lightbulb, MapPin, Beaker, BrainCircuit, 
  Trophy, BookOpen, Sparkles, Box, Star
} from "lucide-react";
import { getClass, getSubject, getChapter, getTopic, SUBJECT_COLORS } from "@/lib/curriculum-data";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const classId = parseInt(params.classId as string, 10);
  const subjectId = params.subject as string;
  const chapterId = params.chapter as string;
  const topicId = params.topic as string;
  
  const classData = getClass(classId);
  const subjectData = getSubject(classId, subjectId);
  const chapterData = getChapter(classId, subjectId, chapterId);
  const topicData = getTopic(classId, subjectId, chapterId, topicId);

  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!classData || !subjectData || !chapterData || !topicData) {
    return (
      <div className="min-h-screen flex items-center justify-center font-marathi">
        <p>माहिती सापडली नाही.</p>
      </div>
    );
  }

  const colors = SUBJECT_COLORS[subjectId as keyof typeof SUBJECT_COLORS];

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === topicData.quiz[activeQuizQuestion].answer) {
      setQuizScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuizQuestion < topicData.quiz.length - 1) {
      setActiveQuizQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {subjectData.title} • {chapterData.title}
              </div>
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {topicData.title}
              </h1>
            </div>
          </div>
          
          {/* Ask AI Button */}
          <Link 
            href={`/classroom/visual-teacher?q=${encodeURIComponent(topicData.title)}`}
            className="flex items-center gap-2 bg-brand-100 text-brand-700 hover:bg-brand-200 px-4 py-2 rounded-full font-bold text-sm transition-colors"
          >
            <BrainCircuit className="w-4 h-4" />
            <span className="hidden sm:inline">AI ला विचारा</span>
            <span className="sm:hidden">AI</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Title Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            {topicData.learningOutcome}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {topicData.title}
          </h2>
          <p className="text-slate-500 font-medium tracking-wide uppercase">{topicData.titleEn}</p>
        </div>

        {/* 1. Why Important & Real Life (AI Intelligence Layer) */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-amber-900 mb-2">हे का महत्त्वाचे आहे?</h3>
            <p className="text-amber-800 text-sm leading-relaxed">{topicData.whyImportant}</p>
            <Sparkles className="absolute top-4 right-4 w-24 h-24 text-amber-500 opacity-5" />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-emerald-900 mb-2">वास्तविक जीवनात (आपल्या गावात)</h3>
            <p className="text-emerald-800 text-sm leading-relaxed">{topicData.realLifeConnection}</p>
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-emerald-500 opacity-5"></div>
          </div>
        </div>

        {/* 2. Core Explanation */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className={`w-12 h-12 rounded-2xl ${colors?.bg || "bg-blue-500"} text-white flex items-center justify-center`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">मुख्य संकल्पना</h3>
              <p className="text-sm text-slate-500">Core Concept</p>
            </div>
          </div>
          
          <div className="prose prose-slate prose-p:text-slate-700 prose-p:leading-relaxed whitespace-pre-wrap font-medium">
            {topicData.concept}
          </div>

          <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> 
              लक्षात ठेवा (Key Points)
            </h4>
            <ul className="space-y-2">
              {topicData.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-slate-400">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. 3D Model Link (If available) */}
        {topicData.has3D && topicData.threeDRoute && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-lg">
            <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-white text-center sm:text-left">
                <h3 className="text-xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2">
                  <Box className="w-6 h-6" /> 3D मध्ये पाहा
                </h3>
                <p className="text-indigo-100 text-sm">हे स्वतः फिरवून आणि झूम करून समजून घ्या.</p>
              </div>
              <Link 
                href={topicData.threeDRoute}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold shadow-sm transition-colors w-full sm:w-auto text-center"
              >
                3D लॅब उघडा
              </Link>
            </div>
          </div>
        )}

        {/* 4. Quiz Section */}
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm" id="quiz">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">सराव चाचणी</h3>
              <p className="text-sm text-slate-500">Practice Quiz</p>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold text-slate-400 mb-2">
                <span>प्रश्न {activeQuizQuestion + 1} / {topicData.quiz.length}</span>
                <span>XP: +50</span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900">
                {topicData.quiz[activeQuizQuestion].q}
              </h4>

              <div className="space-y-3">
                {topicData.quiz[activeQuizQuestion].options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === topicData.quiz[activeQuizQuestion].answer;
                  const showCorrectness = showExplanation;
                  
                  let buttonClass = "w-full text-left p-4 rounded-2xl border-2 transition-all font-medium ";
                  
                  if (!showExplanation) {
                    buttonClass += isSelected 
                      ? "border-brand-500 bg-brand-50 text-brand-900" 
                      : "border-slate-100 bg-white hover:border-slate-300 text-slate-700";
                  } else {
                    if (isCorrect) {
                      buttonClass += "border-green-500 bg-green-50 text-green-900";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-rose-500 bg-rose-50 text-rose-900";
                    } else {
                      buttonClass += "border-slate-100 bg-white text-slate-400 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={showExplanation}
                      onClick={() => setSelectedAnswer(i)}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className={`p-4 rounded-2xl text-sm font-medium ${selectedAnswer === topicData.quiz[activeQuizQuestion].answer ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>
                  <p className="font-bold mb-1">{selectedAnswer === topicData.quiz[activeQuizQuestion].answer ? "बरोबर उत्तर! 🎉" : "चुकले! 💡 स्पष्टीकरण:"}</p>
                  <p>{topicData.quiz[activeQuizQuestion].explanation}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                {!showExplanation ? (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    उत्तर तपासा
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    {activeQuizQuestion < topicData.quiz.length - 1 ? "पुढचा प्रश्न" : "निकाल पाहा"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-brand-600" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 mb-2">चाचणी पूर्ण!</h4>
              <p className="text-slate-600 mb-6">तुमचा स्कोअर: {quizScore} / {topicData.quiz.length}</p>
              
              <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg mb-8 border border-yellow-200">
                +{quizScore * 50} XP मिळवले!
              </div>
              
              <div>
                <button 
                  onClick={() => {
                    setActiveQuizQuestion(0);
                    setQuizScore(0);
                    setQuizCompleted(false);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                  }}
                  className="text-brand-600 font-bold hover:underline"
                >
                  पुन्हा चाचणी द्या
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Activity & Project */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-sky-900">कृती (Activity)</h3>
            </div>
            <h4 className="font-bold text-sky-800 mb-2">{topicData.activity.title}</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-sky-800/80">
              {topicData.activity.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-fuchsia-600" />
              <h3 className="font-bold text-fuchsia-900">प्रकल्प (Project)</h3>
            </div>
            <h4 className="font-bold text-fuchsia-800 mb-2">{topicData.project.title}</h4>
            <p className="text-sm text-fuchsia-800/80 leading-relaxed">
              {topicData.project.description}
            </p>
          </div>
        </div>

        {/* Complete Button */}
        <div className="pt-8 text-center">
          <Link
            href={`/curriculum/${classId}/${subjectId}/${chapterId}`}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full transition-colors text-lg"
          >
            <CheckCircle2 className="w-6 h-6" />
            मुद्दा पूर्ण झाला
          </Link>
        </div>

      </main>
    </div>
  );
}
