import React from "react";
import { EngineCanvas } from "@/components/3d/EngineCanvas";
import { AgricultureScene } from "@/components/3d/scenes/AgricultureScene";
import { ArrowLeft, ZoomIn, ZoomOut, Rotate3D } from "lucide-react";
import Link from "next/link";

export default function AgriculturePage() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-green-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/village" className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-green-700" />
          </Link>
          <div>
            <h1 className="font-bold text-lg font-marathi text-gray-900 leading-tight">आधुनिक शेती (Agriculture)</h1>
            <p className="text-xs text-green-600 font-marathi">3D शेती तंत्रज्ञान</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold font-marathi border border-green-200">
            <Rotate3D className="w-4 h-4" /> फिरवा
          </div>
        </div>
      </header>

      {/* 3D Engine Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        <EngineCanvas cameraPosition={[0, 3, 6]} enableZoom={true} enablePan={true}>
          <AgricultureScene />
        </EngineCanvas>
      </div>

      {/* Mobile Hint Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:hidden">
        <div className="bg-green-900/80 backdrop-blur-md text-white text-xs font-marathi py-2 px-4 rounded-full flex items-center gap-2 shadow-lg">
          <Rotate3D className="w-4 h-4" /> मॉडेल पाहण्यासाठी फिरवा
        </div>
      </div>
    </div>
  );
}
