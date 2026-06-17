import React from "react";
import { EngineCanvas } from "@/components/3d/EngineCanvas";
import { InnovationLabScene } from "@/components/3d/scenes/InnovationLabScene";
import { ArrowLeft, Rotate3D } from "lucide-react";
import Link from "next/link";

export default function InnovationLabPage() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-yellow-50 relative overflow-hidden">
      <header className="bg-white px-4 py-3 border-b flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/innovation" className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-yellow-700" />
          </Link>
          <div>
            <h1 className="font-bold text-lg font-marathi text-gray-900 leading-tight">इनोव्हेशन लॅब (Innovation)</h1>
            <p className="text-xs text-yellow-600 font-marathi">3D प्रोजेक्ट्स आणि मॉडेल्स</p>
          </div>
        </div>
      </header>
      <div className="flex-1 w-full h-full relative">
        <EngineCanvas cameraPosition={[0, 3, 5]} enableZoom={true} enablePan={true}>
          <InnovationLabScene />
        </EngineCanvas>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:hidden">
        <div className="bg-yellow-900/80 backdrop-blur-md text-white text-xs font-marathi py-2 px-4 rounded-full flex items-center gap-2 shadow-lg">
          <Rotate3D className="w-4 h-4" /> पाहण्यासाठी फिरवा
        </div>
      </div>
    </div>
  );
}
