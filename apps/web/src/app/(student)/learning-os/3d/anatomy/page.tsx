"use client";

import React, { useState } from "react";
import { EngineCanvas } from "@/components/3d/EngineCanvas";
import { AnatomyScene } from "@/components/3d/scenes/AnatomyScene";
import { ArrowLeft, ZoomIn, Rotate3D } from "lucide-react";
import Link from "next/link";
import { LayerSwitcher } from "@/components/3d/LayerSwitcher";
import { LearningPanel } from "@/components/3d/LearningPanel";
import { anatomyData } from "@/lib/anatomy-data";

export default function AnatomyPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["skin", "skeleton", "organ"]);
  const [activeOrganId, setActiveOrganId] = useState<string | null>(null);

  const activeOrganData = activeOrganId ? anatomyData[activeOrganId] : null;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b flex items-center justify-between z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/learning-os" className="p-2 bg-gray-100 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg font-marathi text-gray-900 leading-tight">मानवी शरीर रचना (Anatomy)</h1>
            <p className="text-xs text-brand-600 font-medium font-marathi">3D इमर्सिव्ह लर्निंग इंजिन</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full text-xs font-bold font-marathi">
            <Rotate3D className="w-4 h-4" /> फिरवा
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full text-xs font-bold font-marathi">
            <ZoomIn className="w-4 h-4" /> झूम करा
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full relative flex">
        
        {/* Layer Controls */}
        <LayerSwitcher activeLayers={activeLayers} onChange={setActiveLayers} />

        {/* 3D Engine Canvas */}
        <div className="flex-1 h-full relative">
          <EngineCanvas cameraPosition={[0, 0, 5]} enableZoom={true} enablePan={true}>
            <AnatomyScene 
              activeLayers={activeLayers} 
              selectedOrganId={activeOrganId}
              onSelectOrgan={setActiveOrganId} 
            />
          </EngineCanvas>
        </div>

        {/* Right Side Learning Panel */}
        {activeOrganData && (
          <div className="absolute right-0 top-0 h-full z-40">
            <LearningPanel data={activeOrganData} onClose={() => setActiveOrganId(null)} />
          </div>
        )}

      </div>

      {/* Mobile Hint Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:hidden">
        <div className="bg-gray-900/80 backdrop-blur-md text-white text-xs font-marathi py-2 px-4 rounded-full flex items-center gap-2 shadow-lg">
          <Rotate3D className="w-4 h-4" /> मॉडेल फिरवण्यासाठी स्क्रीनवर बोट फिरवा
        </div>
      </div>
    </div>
  );
}
