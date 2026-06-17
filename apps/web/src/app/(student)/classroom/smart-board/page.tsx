"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Eraser, Wand2, Loader2, BookOpen, MessageSquare, HelpCircle, Volume2 } from "lucide-react";

// --- AI Response Knowledge Base (Simulation Mode) ---
const AI_KNOWLEDGE: Record<string, {
  concept: string;
  marathi: string;
  english: string;
  steps: string[];
  questions: { q: string; options: string[]; answer: number }[];
}> = {
  "त्रिकोण": {
    concept: "त्रिकोण (Triangle)",
    marathi: "त्रिकोण हा तीन बाजू आणि तीन कोन असलेला आकार आहे. त्रिकोणाच्या तीन कोनांची बेरीज नेहमी १८०° असते.",
    english: "A triangle is a polygon with 3 sides and 3 angles. The sum of interior angles of a triangle is always 180°.",
    steps: [
      "त्रिकोणाला तीन बाजू (sides) असतात.",
      "त्रिकोणाला तीन कोन (angles) असतात.",
      "तिन्ही कोनांची बेरीज = १८०°",
      "समभुज त्रिकोण: तिन्ही बाजू समान",
      "काटकोन त्रिकोण: एक कोन ९०°",
    ],
    questions: [
      { q: "त्रिकोणाच्या कोनांची बेरीज किती?", options: ["९०°", "१८०°", "३६०°", "२७०°"], answer: 1 },
      { q: "समभुज त्रिकोणाच्या बाजू कशा असतात?", options: ["असमान", "समान", "दोन समान", "एक मोठी"], answer: 1 },
      { q: "काटकोन किती अंशाचा असतो?", options: ["४५°", "६०°", "९०°", "१२०°"], answer: 2 },
    ],
  },
  "वर्तुळ": {
    concept: "वर्तुळ (Circle)",
    marathi: "वर्तुळ हे एक बंद वक्र आकृती आहे. वर्तुळाच्या परिघाला 'परिधी' म्हणतात. त्याचे सूत्र π × व्यास आहे.",
    english: "A circle is a closed curved figure where all points are equidistant from the center. Circumference = π × diameter.",
    steps: [
      "केंद्र (Center): वर्तुळाचा मध्य बिंदू",
      "त्रिज्या (Radius): केंद्रापासून परिघापर्यंतचे अंतर",
      "व्यास (Diameter) = २ × त्रिज्या",
      "परिघ (Circumference) = 2πr",
      "क्षेत्रफळ (Area) = πr²",
    ],
    questions: [
      { q: "व्यास = ?", options: ["r/2", "πr", "2r", "r²"], answer: 2 },
      { q: "वर्तुळाचे क्षेत्रफळ काय?", options: ["2πr", "πr²", "πd", "r²"], answer: 1 },
      { q: "वर्तुळाचे सर्व बिंदू केंद्रापासून काय असतात?", options: ["जवळ", "दूर", "समान अंतरावर", "भिन्न अंतरावर"], answer: 2 },
    ],
  },
  "x²": {
    concept: "द्विघात समीकरण (Quadratic Equation)",
    marathi: "ax² + bx + c = 0 या रूपातील समीकरणाला द्विघात समीकरण म्हणतात. याचे उत्तर भेदक सूत्राने काढता येते.",
    english: "A quadratic equation is of the form ax² + bx + c = 0. Its roots can be found using the discriminant formula.",
    steps: [
      "ax² + bx + c = 0 हे मानक रूप आहे.",
      "D = b² - 4ac (भेदक / Discriminant)",
      "D > 0 → दोन वास्तव मुळे",
      "D = 0 → एकच मूळ",
      "D < 0 → काल्पनिक मुळे",
      "x = (-b ± √D) / 2a",
    ],
    questions: [
      { q: "भेदक D = ?", options: ["b²+4ac", "b²-4ac", "2b-ac", "b-4ac"], answer: 1 },
      { q: "D=0 असेल तर किती मुळे?", options: ["शून्य", "एक", "दोन", "अनंत"], answer: 1 },
      { q: "द्विघात समीकरणाची घात किती?", options: ["1", "2", "3", "0"], answer: 1 },
    ],
  },
  default: {
    concept: "सामान्य संकल्पना",
    marathi: "AI ने तुमची आकृती/लिखाण ओळखले आहे. हे एक गणितीय किंवा वैज्ञानिक संकल्पना असल्याचे दिसते. अधिक अचूक विश्लेषणासाठी स्पष्ट चिन्हे काढा.",
    english: "The AI has detected your drawing. It appears to be a mathematical or scientific concept. For better analysis, draw clear symbols.",
    steps: [
      "आकृती स्पष्टपणे काढा.",
      "गणिती चिन्हे वापरा.",
      "संकल्पनेचे नाव लिहा.",
    ],
    questions: [
      { q: "शिकण्यासाठी कोणता विषय आवडतो?", options: ["गणित", "विज्ञान", "भूगोल", "इतिहास"], answer: 0 },
      { q: "3D मध्ये काय पहायचे आहे?", options: ["हृदय", "मेंदू", "सूर्यमाला", "वनस्पती"], answer: 0 },
      { q: "AI स्मार्ट बोर्ड उपयुक्त आहे का?", options: ["हो!", "अजून शिकतोय", "प्रश्न आहे", "नको"], answer: 0 },
    ],
  },
};

function detectConcept(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("त्रिकोण") || t.includes("triangle")) return "त्रिकोण";
  if (t.includes("वर्तुळ") || t.includes("circle")) return "वर्तुळ";
  if (t.includes("x²") || t.includes("x2") || t.includes("quadratic")) return "x²";
  return "default";
}

export default function SmartBoardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof AI_KNOWLEDGE[string] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, number>>({});
  const [textInput, setTextInput] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setLastPos(getPos(e));
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    if (!ctx || !lastPos) return;
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setLastPos(pos);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setResult(null);
    setSelectedAnswer({});
    setQuizSubmitted(false);
    setTextInput("");
  };

  const analyze = useCallback(async () => {
    setIsAnalyzing(true);
    setResult(null);
    setSelectedAnswer({});
    setQuizSubmitted(false);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 2000));
    const key = detectConcept(textInput);
    setResult(AI_KNOWLEDGE[key] ?? AI_KNOWLEDGE.default);
    setIsAnalyzing(false);
  }, [textInput]);

  const score = quizSubmitted && result
    ? result.questions.reduce((acc, q, i) => acc + (selectedAnswer[i] === q.answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-marathi flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-violet-700 text-white px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/classroom" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">AI स्मार्ट बोर्ड</h1>
              <p className="text-xs text-violet-200">लिहा किंवा काढा — AI मराठीत समजावेल</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-violet-200 font-medium">
            <Sparkles className="w-4 h-4" /> Simulation Mode
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Drawing Board */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-violet-50 border-b border-violet-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-violet-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> बोर्डवर लिहा किंवा काढा
              </span>
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors font-bold bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-xl"
              >
                <Eraser className="w-3.5 h-3.5" /> साफ करा
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={600}
              height={320}
              className="w-full cursor-crosshair touch-none block bg-white"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>

          {/* Text input for concept */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              संकल्पना टाइप करा (उदा: त्रिकोण, वर्तुळ, x²)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="येथे संकल्पना लिहा..."
                className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 font-medium"
                onKeyDown={(e) => e.key === "Enter" && analyze()}
              />
              <motion.button
                onClick={analyze}
                disabled={isAnalyzing}
                whileTap={{ scale: 0.95 }}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-[0_4px_0_#4c1d95]"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isAnalyzing ? "विश्लेषण..." : "AI विश्लेषण"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Output */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border-2 border-violet-200 p-8 flex flex-col items-center justify-center gap-4 min-h-[200px]"
              >
                <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-violet-500 animate-pulse" />
                </div>
                <p className="font-bold text-violet-700 text-center">AI विश्लेषण करत आहे...</p>
                <p className="text-sm text-slate-500 text-center">मराठी स्पष्टीकरण तयार करत आहे</p>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Concept Detected */}
                <div className="bg-violet-700 text-white rounded-3xl p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-violet-300 mb-1">AI ने ओळखले:</div>
                  <h2 className="text-2xl font-extrabold mb-3">{result.concept}</h2>

                  {/* Marathi Explanation */}
                  <div className="bg-white/10 rounded-2xl p-4 mb-3 flex gap-3">
                    <MessageSquare className="w-5 h-5 shrink-0 text-violet-300 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-violet-300 mb-1 uppercase">मराठी स्पष्टीकरण</div>
                      <p className="text-sm text-white/90 leading-relaxed">{result.marathi}</p>
                    </div>
                  </div>

                  {/* English */}
                  <div className="bg-white/10 rounded-2xl p-4 flex gap-3">
                    <BookOpen className="w-5 h-5 shrink-0 text-violet-300 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-violet-300 mb-1 uppercase">English Explanation</div>
                      <p className="text-sm text-white/80 leading-relaxed">{result.english}</p>
                    </div>
                  </div>
                </div>

                {/* Step-by-step */}
                <div className="bg-white rounded-3xl border-2 border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" /> पायरी पायरी (Step by Step)
                  </h3>
                  <ol className="flex flex-col gap-2">
                    {result.steps.map((step, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Quiz */}
                <div className="bg-white rounded-3xl border-2 border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-500" /> सराव प्रश्न (Practice Quiz)
                  </h3>
                  <div className="flex flex-col gap-5">
                    {result.questions.map((q, qi) => (
                      <div key={qi}>
                        <p className="text-sm font-bold text-slate-800 mb-2">{qi + 1}. {q.q}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => {
                            const isSelected = selectedAnswer[qi] === oi;
                            const isCorrect = quizSubmitted && oi === q.answer;
                            const isWrong = quizSubmitted && isSelected && oi !== q.answer;
                            return (
                              <button
                                key={oi}
                                onClick={() => !quizSubmitted && setSelectedAnswer((s) => ({ ...s, [qi]: oi }))}
                                className={`text-sm font-medium py-2 px-3 rounded-xl border-2 text-left transition-all ${
                                  isCorrect ? "border-green-400 bg-green-50 text-green-700" :
                                  isWrong ? "border-red-400 bg-red-50 text-red-700" :
                                  isSelected ? "border-violet-400 bg-violet-50 text-violet-700" :
                                  "border-slate-200 hover:border-violet-300 text-slate-600"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(selectedAnswer).length < result.questions.length}
                      className="mt-4 w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-colors shadow-[0_4px_0_#92400e]"
                    >
                      उत्तरे तपासा
                    </button>
                  ) : (
                    <div className={`mt-4 p-4 rounded-2xl text-center font-bold ${score === result.questions.length ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                      {score === result.questions.length ? "🏆 शाब्बास! सर्व उत्तरे बरोबर!" : `✅ ${score}/${result.questions.length} बरोबर — छान प्रयत्न!`}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {!result && !isAnalyzing && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center gap-3 min-h-[300px] text-center"
              >
                <div className="text-5xl">✍️</div>
                <p className="font-bold text-slate-700 text-lg">बोर्डवर काहीतरी लिहा</p>
                <p className="text-sm text-slate-400">संकल्पना टाइप करा किंवा आकृती काढा, मग "AI विश्लेषण" दाबा</p>
                <p className="text-xs text-violet-500 font-bold mt-1">उदाहरण: त्रिकोण, वर्तुळ, x²</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
