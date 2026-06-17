"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, CheckCircle2 } from "lucide-react";

export default function WeeklyReportPage() {
  const reportText = `*विद्यासेतू साাপ্তाहिक अहवाल*\nविद्यार्थी: अभिजीत पाटील\nइयत्ता: ५ वी\nदिनांक: १० जून ते १६ जून २०२६\n\n*१. उपस्थिती:* ५ पैकी ५ दिवस हजर ✅\n*२. अभ्यास:* ८ धडे पूर्ण केले 📚\n*३. क्विझ स्कोअर:* ६८% सरासरी 📊\n*४. शिक्षकांचा निरोप:* अभिजीतने विज्ञानात खूप चांगली प्रगती केली आहे. गणिताकडे थोडे लक्ष द्यावे. - पाटील सर\n\nअधिक माहितीसाठी VidyaSetu अॅप पहा.`;

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/parent" className="p-2 bg-slate-100 rounded-xl text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">आठवड्याचा रिपोर्ट</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        
        <div className="bg-green-50 border-2 border-green-200 rounded-[2rem] p-6 mb-8 text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-green-900 mb-2">रिपोर्ट तयार आहे!</h2>
          <p className="text-sm text-green-800">हा रिपोर्ट तुम्ही तुमच्या कुटुंबाला किंवा नातेवाईकांना WhatsApp वर पाठवू शकता.</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 mb-8 shadow-sm">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3">मेसेज (Preview)</h3>
          <div className="bg-slate-50 rounded-2xl p-4 font-medium text-slate-800 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100">
            {reportText}
          </div>
        </div>

        <button 
          onClick={() => {
            const encodedText = encodeURIComponent(reportText);
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
          }}
          className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_#128C7E] active:translate-y-1 active:shadow-none transition-all"
        >
          <Share2 className="w-5 h-5" /> WhatsApp वर पाठवा
        </button>
      </main>
    </div>
  );
}
