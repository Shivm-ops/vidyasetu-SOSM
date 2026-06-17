"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Pencil, Calculator, FlaskConical, Globe, Wheat, Bot } from "lucide-react";

const modules = [
  {
    id: "smart-board",
    title: "AI स्मार्ट बोर्ड",
    subtitle: "AI Smart Board",
    desc: "लिहा, काढा — AI मराठीत समजावेल",
    icon: Pencil,
    href: "/classroom/smart-board",
    gradient: "from-violet-600 to-purple-700",
    shadow: "#4c1d95",
    emoji: "✍️",
    badge: "NEW",
  },
  {
    id: "math-solver",
    title: "AI गणित सोल्व्हर",
    subtitle: "AI Math Solver",
    desc: "समीकरण लिहा — पायरी पायरी उत्तर मिळवा",
    icon: Calculator,
    href: "/classroom/math-solver",
    gradient: "from-blue-600 to-indigo-700",
    shadow: "#1e3a8a",
    emoji: "🔢",
    badge: "NEW",
  },
  {
    id: "science-lab",
    title: "विज्ञान व्हिज्युअल लॅब",
    subtitle: "Visual Science Lab",
    desc: "हृदय, मेंदू, अणू, प्रकाशसंश्लेषण — इंटरएक्टिव्ह डायग्रामसह शिका",
    icon: FlaskConical,
    href: "/classroom/science-lab",
    gradient: "from-rose-500 to-pink-600",
    shadow: "#9f1239",
    emoji: "🔬",
    badge: "VISUAL",
  },
  {
    id: "geography-lab",
    title: "3D भूगोल लॅब",
    subtitle: "3D Geography Lab",
    desc: "पृथ्वी, महाराष्ट्र — 3D नकाशा एक्सप्लोर करा",
    icon: Globe,
    href: "/classroom/geography-lab",
    gradient: "from-sky-500 to-cyan-600",
    shadow: "#0369a1",
    emoji: "🌍",
    badge: "3D",
  },
  {
    id: "agriculture-lab",
    title: "3D शेती लॅब",
    subtitle: "3D Agriculture Lab",
    desc: "पिकांची वाढ, सिंचन, कापणी — 3D मध्ये",
    icon: Wheat,
    href: "/classroom/agriculture-lab",
    gradient: "from-green-500 to-emerald-600",
    shadow: "#065f46",
    emoji: "🌱",
    badge: "3D",
  },
  {
    id: "visual-teacher",
    title: "AI व्हिज्युअल शिक्षक",
    subtitle: "Visual Learning Engine",
    desc: "मराठीत विचारा — AI इंटरएक्टिव्ह डायग्राम, क्विझ आणि करिअर गाइड देईल",
    icon: Bot,
    href: "/classroom/visual-teacher",
    gradient: "from-violet-600 to-purple-700",
    shadow: "#4c1d95",
    emoji: "🔬",
    badge: "FLAGSHIP",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function ClassroomHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 font-marathi text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-500/20 rounded-xl border border-violet-400/30">
                <Sparkles className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">AI वर्गखोली</h1>
                <p className="text-xs text-white/50 font-medium">AI Smart Classroom</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 px-4 py-2 rounded-full text-sm font-bold text-violet-300">
            <Sparkles className="w-4 h-4" />
            भारतातील पहिली मराठी AI क्लासरूम
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-2 text-sm text-violet-300 font-bold mb-4">
            <Sparkles className="w-4 h-4" /> Phase 6 — Flagship Feature
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
            शिका AI सोबत,<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              3D मध्ये अनुभवा
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            AI स्मार्ट बोर्ड, गणित सोल्व्हर, 3D विज्ञान, भूगोल आणि शेती लॅब — सर्व मराठीत.
          </p>
        </motion.div>

        {/* Module Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((mod) => (
            <motion.div key={mod.id} variants={cardVariants}>
              <Link href={mod.href} className="block group">
                <div
                  className={`relative rounded-3xl p-6 bg-gradient-to-br ${mod.gradient} overflow-hidden cursor-pointer transition-all duration-200`}
                  style={{ boxShadow: `0 8px 0 ${mod.shadow}` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Background emoji decoration */}
                  <div className="absolute -right-4 -bottom-4 text-[100px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 select-none">
                    {mod.emoji}
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold tracking-widest px-2 py-1 rounded-full border border-white/30">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-colors">
                    <mod.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold mb-1 text-white">{mod.title}</h3>
                  <p className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">{mod.subtitle}</p>
                  <p className="text-sm text-white/80">{mod.desc}</p>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-2 text-white/70 text-sm font-bold group-hover:text-white transition-colors">
                    सुरू करा →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <div className="mt-14 text-center text-white/30 text-sm pb-8">
          VidyaSetu — भारतातील पहिली मराठी AI स्मार्ट क्लासरूम प्लॅटफॉर्म 🇮🇳
        </div>
      </main>
    </div>
  );
}
