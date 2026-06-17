"use client";

import React, { useState } from "react";
import { Mic, Play, Pause, Loader2, Award, Calendar, Clock, Star } from "lucide-react";
import { api } from "@/lib/api";

export default function ParentVoiceReports() {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reportText, setReportText] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch voice report from the AI Proxy
      const response = await api.post("/intelligence/voice-report", {
        student_name: "अभिजीत",
        lessons_completed: 5,
        skills_learned: 2,
        attendance_percent: 96
      });

      if (response.data.success) {
        setReportText(response.data.data.report_text_marathi);
        setAudioUrl(response.data.data.audio_url);
      } else {
        setError("रिपोर्ट तयार करताना त्रुटी आली.");
      }
    } catch (err) {
      console.error(err);
      setError("AI सर्व्हरशी संपर्क होऊ शकला नाही.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      // Mock pause audio
    } else {
      setPlaying(true);
      // Mock play audio
      setTimeout(() => setPlaying(false), 5000); // Auto stop after 5s mock
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-marathi pb-20">
      <header className="bg-rose-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="w-6 h-6" /> प्रगती अहवाल (Voice Reports)
        </h1>
        <p className="text-rose-100 mt-1">तुमच्या पाल्याची आठवड्याची प्रगती ऐका.</p>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-4 border-4 border-white shadow-md">
            <Star className="w-10 h-10 fill-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">अभिजीत पाटील</h2>
          <p className="text-gray-500 font-medium">इयत्ता ५ वी</p>
          
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 font-bold mb-1">
                <Calendar className="w-4 h-4" /> ९६%
              </div>
              <p className="text-xs text-gray-500">उपस्थिती</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold mb-1">
                <Award className="w-4 h-4" /> २
              </div>
              <p className="text-xs text-gray-500">नवीन कौशल्ये</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 font-bold mb-1">
                <Clock className="w-4 h-4" /> ५
              </div>
              <p className="text-xs text-gray-500">पूर्ण धडे</p>
            </div>
          </div>
        </div>

        {/* Voice Report Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">या आठवड्याचा रिपोर्ट</h3>
          
          {!reportText && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-6 font-medium">नवीन प्रगती अहवाल उपलब्ध आहे.</p>
              <button 
                onClick={handleGenerateReport}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors"
              >
                रिपोर्ट तयार करा
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-rose-600">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-bold">AI रिपोर्ट तयार करत आहे...</p>
            </div>
          )}

          {reportText && !loading && (
            <div className="space-y-6">
              {/* Audio Player UI */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-transform active:scale-95 ${playing ? 'bg-rose-800' : 'bg-rose-600 hover:bg-rose-700'}`}
                >
                  {playing ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-rose-200 rounded-full w-full overflow-hidden mb-2">
                    <div className={`h-full bg-rose-500 rounded-full ${playing ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'w-0'}`} style={{ width: playing ? '100%' : '0%', transition: 'width 5s linear' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-500">
                    <span>{playing ? '0:02' : '0:00'}</span>
                    <span>0:15</span>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Transcript (मजकूर)</h4>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {reportText}
                </p>
              </div>
            </div>
          )}
          
          {error && <p className="mt-4 text-red-600 text-sm font-medium text-center">{error}</p>}
        </div>

      </main>
    </div>
  );
}
