"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, Loader2, TrendingUp, BookOpen, BarChart3, Sparkles } from "lucide-react";

// --- Math Knowledge Base ---
interface MathSolution {
  topic: string;
  difficulty: "सोपे" | "मध्यम" | "कठीण";
  difficultyColor: string;
  steps: { label: string; expr: string; explanation: string }[];
  answer: string;
  graphFn?: (x: number) => number;
  graphLabel: string;
  practiceProblems: string[];
}

const MATH_KB: Record<string, MathSolution> = {
  linear: {
    topic: "रेषीय समीकरण (Linear Equation)",
    difficulty: "सोपे",
    difficultyColor: "bg-green-100 text-green-700",
    steps: [
      { label: "मूळ समीकरण", expr: "2x + 5 = 15", explanation: "हे रेषीय समीकरण आहे." },
      { label: "पाऊल १", expr: "2x = 15 − 5", explanation: "दोन्ही बाजूंमधून ५ वजा करा." },
      { label: "पाऊल २", expr: "2x = 10", explanation: "साधेपणाने." },
      { label: "पाऊल ३", expr: "x = 10 ÷ 2", explanation: "दोन्ही बाजूंना 2 ने भागा." },
      { label: "उत्तर", expr: "x = 5 ✓", explanation: "x = 5 हे उत्तर आहे!" },
    ],
    answer: "x = 5",
    graphFn: (x) => 2 * x + 5,
    graphLabel: "y = 2x + 5",
    practiceProblems: ["3x + 4 = 19", "5x − 3 = 12", "x/2 + 1 = 6"],
  },
  quadratic: {
    topic: "द्विघात समीकरण (Quadratic Equation)",
    difficulty: "मध्यम",
    difficultyColor: "bg-yellow-100 text-yellow-700",
    steps: [
      { label: "मूळ समीकरण", expr: "x² − 5x + 6 = 0", explanation: "द्विघात समीकरण ओळखा." },
      { label: "पाऊल १", expr: "a=1, b=−5, c=6", explanation: "मानक रूप: ax² + bx + c = 0" },
      { label: "पाऊल २", expr: "D = b² − 4ac = 25 − 24 = 1", explanation: "भेदक (Discriminant) काढा." },
      { label: "पाऊल ३", expr: "x = (5 ± √1) / 2", explanation: "मूळ सूत्र वापरा." },
      { label: "मूळ १", expr: "x₁ = (5 + 1) / 2 = 3", explanation: "पहिले मूळ." },
      { label: "मूळ २", expr: "x₂ = (5 − 1) / 2 = 2", explanation: "दुसरे मूळ." },
      { label: "उत्तर", expr: "x = 2 किंवा x = 3 ✓", explanation: "दोन मुळे सापडली!" },
    ],
    answer: "x = 2 किंवा x = 3",
    graphFn: (x) => x * x - 5 * x + 6,
    graphLabel: "y = x² − 5x + 6",
    practiceProblems: ["x² − 7x + 10 = 0", "x² + 3x − 4 = 0", "2x² − 8 = 0"],
  },
  area: {
    topic: "आयताचे क्षेत्रफळ (Rectangle Area)",
    difficulty: "सोपे",
    difficultyColor: "bg-green-100 text-green-700",
    steps: [
      { label: "दिलेली माहिती", expr: "लांबी (l) = 8 सें.मी., रुंदी (b) = 5 सें.मी.", explanation: "माहिती वाचा." },
      { label: "सूत्र", expr: "क्षेत्रफळ = l × b", explanation: "आयताचे क्षेत्रफळ = लांबी × रुंदी" },
      { label: "मूल्ये टाका", expr: "क्षेत्रफळ = 8 × 5", explanation: "संख्या बदला." },
      { label: "उत्तर", expr: "क्षेत्रफळ = 40 सें.मी.² ✓", explanation: "गणित पूर्ण!" },
    ],
    answer: "40 सें.मी.²",
    graphLabel: "Rectangle Area",
    practiceProblems: ["l=12, b=7 → क्षेत्रफळ?", "l=9, b=4 → क्षेत्रफळ?", "क्षेत्रफळ=60, l=10 → b=?"],
  },
};

function detectProblem(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("x²") || t.includes("x2") || t.includes("quadratic") || t.includes("द्विघात")) return "quadratic";
  if (t.includes("क्षेत्रफळ") || t.includes("area") || t.includes("rectangle") || t.includes("आयत")) return "area";
  return "linear";
}

function GraphCanvas({ fn, label }: { fn?: (x: number) => number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fn) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const scale = 20;

    // Grid
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += scale) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += scale) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Labels
    ctx.fillStyle = "#64748b"; ctx.font = "11px sans-serif";
    ctx.fillText("x", W - 12, cy - 6); ctx.fillText("y", cx + 6, 12);

    // Function curve
    ctx.strokeStyle = "#7c3aed"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < W; px++) {
      const x = (px - cx) / scale;
      const y = fn(x);
      const py = cy - y * scale;
      if (first) { ctx.moveTo(px, py); first = false; } else { ctx.lineTo(px, py); }
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = "#7c3aed"; ctx.font = "bold 11px sans-serif";
    ctx.fillText(label, 6, 16);
  }, [fn, label]);

  return <canvas ref={canvasRef} width={300} height={200} className="w-full rounded-2xl bg-slate-50" />;
}

export default function MathSolverPage() {
  const [input, setInput] = useState("");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const solve = async () => {
    if (!input.trim()) return;
    setSolving(true);
    setSolution(null);
    setRevealedSteps(0);
    await new Promise((r) => setTimeout(r, 1500));
    const key = detectProblem(input);
    const sol = MATH_KB[key];
    setSolution(sol);
    setSolving(false);
    // Reveal steps one by one
    let i = 0;
    const reveal = () => {
      i++;
      setRevealedSteps(i);
      if (i < sol.steps.length) setTimeout(reveal, 600);
    };
    setTimeout(reveal, 300);
  };

  const presets = [
    { label: "2x + 5 = 15", value: "2x + 5 = 15" },
    { label: "x² − 5x + 6 = 0", value: "x² − 5x + 6 = 0 द्विघात" },
    { label: "आयत: l=8, b=5", value: "आयत क्षेत्रफळ l=8 b=5" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 font-marathi text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/classroom" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">AI गणित सोल्व्हर</h1>
              <p className="text-xs text-blue-300">पायरी पायरी मराठी उत्तर</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6">
          <label className="block text-sm font-bold text-blue-200 mb-3 uppercase tracking-wide">
            गणित समस्या लिहा (Marathi or English)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="उदा: 2x + 5 = 15, x² − 5x + 6 = 0, आयत क्षेत्रफळ..."
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 font-medium"
              onKeyDown={(e) => e.key === "Enter" && solve()}
            />
            <motion.button
              onClick={solve}
              disabled={solving || !input.trim()}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors shadow-[0_4px_0_#1e3a8a]"
            >
              {solving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {solving ? "सोडवत आहे..." : "सोडवा"}
            </motion.button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setInput(p.value)}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {solving && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-blue-300 animate-pulse" />
              </div>
              <p className="font-bold text-blue-200 text-lg">AI गणित सोडवत आहे...</p>
              <div className="flex gap-2">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </div>
            </motion.div>
          )}

          {solution && !solving && (
            <motion.div key="solution" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Steps Panel */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-300" /> {solution.topic}
                  </h2>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${solution.difficultyColor}`}>
                    {solution.difficulty}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {solution.steps.slice(0, revealedSteps).map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-2xl p-4 ${i === solution.steps.length - 1 ? "bg-blue-500/30 border border-blue-400/50" : "bg-white/10 border border-white/10"}`}
                    >
                      <div className="text-xs font-bold text-blue-300 uppercase mb-1">{step.label}</div>
                      <div className="text-lg font-mono font-bold text-white mb-1">{step.expr}</div>
                      <div className="text-xs text-white/60">{step.explanation}</div>
                    </motion.div>
                  ))}
                </div>

                {revealedSteps >= solution.steps.length && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-4 bg-green-500/20 border border-green-400/40 rounded-2xl p-4 text-center">
                    <div className="text-lg font-extrabold text-green-300">🏆 उत्तर: {solution.answer}</div>
                  </motion.div>
                )}
              </div>

              {/* Graph + Practice */}
              <div className="flex flex-col gap-4">
                {solution.graphFn && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-300" /> आलेख (Graph)
                    </h3>
                    <GraphCanvas fn={solution.graphFn} label={solution.graphLabel} />
                  </div>
                )}

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-300" /> सराव प्रश्न (Practice Problems)
                  </h3>
                  <div className="flex flex-col gap-2">
                    {solution.practiceProblems.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(p)}
                        className="text-left bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                      >
                        {i + 1}. {p} →
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!solution && !solving && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 flex flex-col items-center gap-3 text-center">
              <div className="text-6xl">🔢</div>
              <p className="text-xl font-bold text-white/70">गणित समस्या टाइप करा</p>
              <p className="text-sm text-white/40">रेषीय समीकरण, द्विघात समीकरण, क्षेत्रफळ...</p>
              <p className="text-xs text-blue-400 font-bold mt-2">वरील उदाहरणांपैकी एक क्लिक करा!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
