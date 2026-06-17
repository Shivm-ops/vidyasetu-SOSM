import React from "react";
import { EngineCanvas } from "@/components/3d/EngineCanvas";
import { ScienceLabScene } from "@/components/3d/scenes/ScienceLabScene";
import { ArrowLeft, ZoomIn, ZoomOut, Rotate3D } from "lucide-react";
import Link from "next/link";

export default function SciencePage() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-900 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/learning-os" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="font-bold text-lg font-marathi text-white leading-tight">विज्ञान प्रयोगशाळा (Science Lab)</h1>
            <p className="text-xs text-gray-300 font-marathi">सूर्यमाला (Solar System)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold font-marathi border border-white/20">
            <Rotate3D className="w-4 h-4" /> फिरवा
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold font-marathi border border-white/20">
            <ZoomIn className="w-4 h-4" /> झूम करा
          </div>
        </div>
      </header>

      {/* 3D Engine Canvas Area */}
      <div className="flex-1 w-full h-full relative bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        {/* Dark overlay for better space effect */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        
        <div className="absolute inset-0 z-10">
          <EngineCanvas cameraPosition={[0, 4, 8]} enableZoom={true} enablePan={true}>
            <ScienceLabScene />
          </EngineCanvas>
        </div>
      </div>

      {/* Mobile Hint Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 sm:hidden">
        <div className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-marathi py-2 px-4 rounded-full flex items-center gap-2 shadow-lg border border-gray-200">
          <Rotate3D className="w-4 h-4" /> पाहण्यासाठी फिरवा
        </div>
      </div>
    </div>
  );
}
