"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Globe } from "lucide-react";

const EngineCanvas = dynamic(() => import("@/components/3d/EngineCanvas").then(m => ({ default: m.EngineCanvas })), { ssr: false });
const EarthScene = dynamic(() => import("@/components/3d/scenes/GeographyScenes").then(m => ({ default: m.EarthScene })), { ssr: false });
const MaharashtraScene = dynamic(() => import("@/components/3d/scenes/GeographyScenes").then(m => ({ default: m.MaharashtraScene })), { ssr: false });
const MountainsScene = dynamic(() => import("@/components/3d/scenes/GeographyScenes").then(m => ({ default: m.MountainsScene })), { ssr: false });
const RiversScene = dynamic(() => import("@/components/3d/scenes/GeographyScenes").then(m => ({ default: m.RiversScene })), { ssr: false });

const TABS = [
  { id: "earth", label: "🌍 पृथ्वी", subtitle: "Earth", component: EarthScene, camera: [0, 0, 6] as [number,number,number] },
  { id: "maharashtra", label: "🗺️ महाराष्ट्र", subtitle: "Maharashtra", component: MaharashtraScene, camera: [0, 2, 6] as [number,number,number] },
  { id: "mountains", label: "🏔️ पर्वत", subtitle: "Mountains", component: MountainsScene, camera: [0, 2, 8] as [number,number,number] },
  { id: "rivers", label: "🌊 नद्या", subtitle: "Rivers", component: RiversScene, camera: [0, 3, 6] as [number,number,number] },
];

const FACTS: Record<string, string[]> = {
  earth: ["पृथ्वी सूर्यापासून तिसरा ग्रह आहे", "पृथ्वीचा व्यास 12,742 km आहे", "71% पृष्ठभाग पाण्याने व्यापला आहे"],
  maharashtra: ["महाराष्ट्र क्षेत्रफळात 3रा मोठा राज्य आहे", "36 जिल्हे आहेत", "लोकसंख्या 12 कोटी+"],
  mountains: ["एव्हरेस्ट 8,848 मीटर उंच आहे", "हिमालय 2,400 km लांब आहे", "सह्याद्री UNESCO World Heritage आहे"],
  rivers: ["गोदावरी 1,465 km लांब आहे", "कृष्णा नदी 4 राज्यांतून वाहते", "नर्मदा पश्चिमेकडे वाहते"],
};

export default function GeographyLabPage() {
  const [activeTab, setActiveTab] = useState("earth");
  const tab = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-950 font-marathi text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link href="/classroom" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Globe className="w-6 h-6 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold">3D भूगोल लॅब</h1>
            <p className="text-xs text-white/50">3D Geography Lab</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 hide-scrollbar border-b border-white/10 bg-black/20">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-bold transition-all border ${
              activeTab === t.id
                ? "bg-cyan-600 text-white border-cyan-400 shadow-lg"
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
            }`}>
            {t.label}<span className="block text-[10px] font-normal opacity-70">{t.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[420px] lg:h-[500px]">
              <EngineCanvas cameraPosition={tab.camera} enableZoom enablePan>
                <tab.component />
              </EngineCanvas>
            </motion.div>
          </AnimatePresence>
          <p className="text-center text-white/40 text-xs mt-3">👆 मार्करवर क्लिक करा • माऊसने फिरवा • स्क्रोल करून झूम करा</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-cyan-600/20 border border-cyan-400/30 rounded-3xl p-5">
            <h2 className="font-extrabold text-xl mb-1">{tab.label}</h2>
            <p className="text-white/60 text-sm">{tab.subtitle} — 3D Interactive</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
            <h3 className="font-bold mb-3 text-cyan-300">📌 महत्त्वाचे तथ्य</h3>
            <ul className="flex flex-col gap-2">
              {(FACTS[activeTab] || []).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4">
            <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-white font-bold py-3 rounded-2xl transition-colors text-sm">
              ▶ मराठी स्पष्टीकरण ऐका
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
