"use client";

import React from "react";
import { Leaf, ArrowLeft, Star, Users } from "lucide-react";
import Link from "next/link";
import { GameButton } from "@/components/ui/game-button";

export default function VillagePage() {
  return (
    <div className="min-h-screen bg-green-50 font-marathi pb-20">
      <header className="sticky top-0 z-50 bg-village text-white px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8" />
              <h1 className="text-2xl font-bold">कम्युनिटी इम्पॅक्ट</h1>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full font-bold flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>५० XP</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <span>🌍</span> गावाची मिशन
          </h2>
          <div className="bg-white p-6 rounded-3xl border-2 border-green-200 shadow-[0_4px_0_#86efac]">
            <h3 className="font-bold text-xl text-gray-900 mb-2">मिशन: स्वच्छ गाव</h3>
            <p className="text-gray-600 font-medium mb-4">गावातील ३ कचरा कुंड्या ओळखा आणि फोटो अपलोड करा.</p>
            <GameButton variant="success" className="w-full sm:w-auto">
               मिशन स्वीकारा (१०० XP)
            </GameButton>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Users className="text-green-600" /> गाव लीडरबोर्ड
          </h2>
          <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 shadow-sm opacity-80 text-center">
             <p className="font-bold text-gray-500 py-4">लीडरबोर्ड लवकरच येत आहे...</p>
          </div>
        </section>
      </main>
    </div>
  );
}
