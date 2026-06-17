"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wheat } from "lucide-react";

const EngineCanvas = dynamic(() => import("@/components/3d/EngineCanvas").then(m => ({ default: m.EngineCanvas })), { ssr: false });
const SugarcaneScene = dynamic(() => import("@/components/3d/scenes/AgricultureScenes").then(m => ({ default: m.SugarcaneScene })), { ssr: false });
const RiceScene = dynamic(() => import("@/components/3d/scenes/AgricultureScenes").then(m => ({ default: m.RiceScene })), { ssr: false });
const IrrigationScene = dynamic(() => import("@/components/3d/scenes/AgricultureScenes").then(m => ({ default: m.IrrigationScene })), { ssr: false });

const CROPS = [
  { id: "sugarcane", label: "🌿 ऊस", subtitle: "Sugarcane" },
  { id: "rice", label: "🌾 भात", subtitle: "Rice" },
  { id: "irrigation", label: "💧 सिंचन", subtitle: "Irrigation" },
];

const STAGES = ["बीज (Seedling)", "वाढ (Growing)", "पक्व (Mature)", "कापणी (Harvest)"];

const CROP_INFO: Record<string, { facts: string[]; soil: string; water: string }> = {
  sugarcane: {
    facts: ["ऊस 12-18 महिन्यांत पक्व होतो", "उत्पादन: 70-100 टन/हेक्टर", "साखर उद्योगाचे मुख्य पीक"],
    soil: "काळी व लाल माती उत्तम",
    water: "जास्त पाणी लागते (1500-2500mm)",
  },
  rice: {
    facts: ["भात 3-6 महिन्यांत पक्व होतो", "भारत जगातील 2रा मोठा उत्पादक", "पाणी साचलेल्या जमिनीत वाढतो"],
    soil: "चिकण माती (Clay loam) उत्तम",
    water: "भरपूर पाणी (1200-2000mm)",
  },
  irrigation: {
    facts: ["ठिबक सिंचनाने 90% पाणी वाचते", "महाराष्ट्रात 50+ लाख हेक्टर सिंचित", "PM-Krishi सिंचाई Yojana उपलब्ध"],
    soil: "सर्व प्रकारच्या जमिनीसाठी",
    water: "पाणी बचत हे मुख्य उद्दिष्ट",
  },
};

export default function AgricultureLabPage() {
  const [activeCrop, setActiveCrop] = useState("sugarcane");
  const [growthStage, setGrowthStage] = useState(2);
  const info = CROP_INFO[activeCrop];

  const SceneComponent = activeCrop === "sugarcane" ? SugarcaneScene :
    activeCrop === "rice" ? RiceScene : IrrigationScene;

  return (
    <div className="min-h-screen bg-green-950 font-marathi text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link href="/classroom" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Wheat className="w-6 h-6 text-green-400" />
          <div>
            <h1 className="text-xl font-bold">3D शेती लॅब</h1>
            <p className="text-xs text-white/50">3D Agriculture Lab</p>
          </div>
        </div>
      </header>

      {/* Crop Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 hide-scrollbar border-b border-white/10 bg-black/20">
        {CROPS.map(c => (
          <button key={c.id} onClick={() => { setActiveCrop(c.id); setGrowthStage(2); }}
            className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-bold transition-all border ${
              activeCrop === c.id
                ? "bg-green-600 text-white border-green-400 shadow-lg"
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
            }`}>
            {c.label}<span className="block text-[10px] font-normal opacity-70">{c.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4 py-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeCrop}-${growthStage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[380px] lg:h-[440px]">
              <EngineCanvas cameraPosition={[0, 1, 5]} enableZoom enablePan>
                {activeCrop === "sugarcane" && <SugarcaneScene stage={growthStage} />}
                {activeCrop === "rice" && <RiceScene stage={growthStage} />}
                {activeCrop === "irrigation" && <IrrigationScene />}
              </EngineCanvas>
            </motion.div>
          </AnimatePresence>

          {/* Growth Stage Slider */}
          {activeCrop !== "irrigation" && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="text-sm font-bold mb-3 text-green-300">वाढीचा टप्पा: {STAGES[growthStage]}</div>
              <div className="flex gap-2">
                {STAGES.map((s, i) => (
                  <button key={i} onClick={() => setGrowthStage(i)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl transition-all ${
                      growthStage === i
                        ? "bg-green-500 text-white shadow"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}>
                    {s.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-green-600/20 border border-green-400/30 rounded-3xl p-5">
            <h2 className="font-extrabold text-xl mb-2">{CROPS.find(c => c.id === activeCrop)?.label}</h2>
            <div className="text-sm text-white/70 space-y-1">
              <p>🌱 <strong>माती:</strong> {info.soil}</p>
              <p>💧 <strong>पाणी:</strong> {info.water}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
            <h3 className="font-bold mb-3 text-green-300">📌 महत्त्वाचे तथ्य</h3>
            <ul className="flex flex-col gap-2">
              {info.facts.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4">
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
              ▶ मराठी स्पष्टीकरण ऐका
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
