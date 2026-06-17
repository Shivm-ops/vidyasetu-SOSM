"use client";

import React from "react";
import { Lightbulb, ArrowLeft, Star, Plus } from "lucide-react";
import Link from "next/link";
import { GameButton } from "@/components/ui/game-button";

export default function InnovationPage() {
  return (
    <div className="min-h-screen bg-yellow-50 font-marathi pb-20">
      <header className="sticky top-0 z-50 bg-innovation text-white px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8" />
              <h1 className="text-2xl font-bold">नावीन्य केंद्र</h1>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full font-bold flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>२०० XP</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
               <span>🛠️</span> प्रोजेक्ट बिल्डर
             </h2>
             <GameButton className="bg-yellow-500 hover:bg-yellow-400 shadow-[0_4px_0_#ca8a04]" size="sm">
               <Plus className="w-4 h-4 mr-1" /> नवीन प्रकल्प
             </GameButton>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
             <div className="bg-white p-6 rounded-3xl border-2 border-yellow-200 shadow-[0_4px_0_#fde047] cursor-pointer hover:-translate-y-1 transition-transform">
               <div className="text-4xl mb-2">💧</div>
               <h3 className="font-bold text-xl text-gray-900">पाणी शुद्धीकरण यंत्र</h3>
               <p className="text-sm text-gray-500 font-medium mb-3">प्लास्टिकच्या बाटल्या वापरून</p>
               <div className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full w-fit">प्रगती: ५०%</div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
