import React from "react";
import { EngineCanvas } from "@/components/3d/EngineCanvas";
import { CareerSimulatorScene } from "@/components/3d/scenes/CareerSimulatorScene";
import { ArrowLeft, Rotate3D } from "lucide-react";
import Link from "next/link";

export default function CareerSimulatorPage() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50 relative overflow-hidden">
      <header className="bg-white px-4 py-3 border-b flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/career" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="font-bold text-lg font-marathi text-gray-900 leading-tight">करिअर सिम्युलेटर (Career)</h1>
            <p className="text-xs text-slate-500 font-marathi">3D करिअर अनुभव</p>
          </div>
        </div>
      </header>
      <div className="flex-1 w-full h-full relative">
        <EngineCanvas cameraPosition={[0, 4, 6]} enableZoom={true} enablePan={false}>
          <CareerSimulatorScene />
        </EngineCanvas>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:hidden">
        <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-marathi py-2 px-4 rounded-full flex items-center gap-2 shadow-lg">
          <Rotate3D className="w-4 h-4" /> पाहण्यासाठी फिरवा
        </div>
      </div>
    </div>
  );
}
