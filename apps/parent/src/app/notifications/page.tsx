"use client";

import React from "react";
import { Bell, Trophy, BookOpen, UserCheck, Megaphone, Star } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "achievement",
      icon: Trophy,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      title: "नवीन बॅज मिळवला!",
      message: "अभिजीतने 'मॅथ चॅम्पियन' बॅज जिंकला आहे. त्याने गणितातील ५ सराव चाचण्या पूर्ण केल्या.",
      time: "२ तासांपूर्वी",
    },
    {
      id: 2,
      type: "learning",
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      title: "धडा पूर्ण झाला",
      message: "विज्ञान विषयातील 'पेशींची रचना' हा धडा पूर्ण झाला आहे. आता तो नवीन धडा शिकण्यास तयार आहे.",
      time: "आज सकाळी १०:३०",
    },
    {
      id: 3,
      type: "announcement",
      icon: Megaphone,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      title: "शिक्षकांचा निरोप",
      message: "उद्या शाळेत विज्ञान प्रदर्शन आहे. कृपया सर्व पालकांनी उपस्थित राहावे.",
      time: "काल",
    },
    {
      id: 4,
      type: "attendance",
      icon: UserCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      title: "उपस्थिती",
      message: "अभिजीत आज शाळेत वेळेवर उपस्थित होता.",
      time: "काल",
    },
    {
      id: 5,
      type: "skill",
      icon: Star,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      title: "कौशल्य विकास (Skill)",
      message: "अभिजीतने 'आर्थिक साक्षरता' मधील पहिले मॉड्यूल पूर्ण केले आहे! +५० XP",
      time: "२ दिवसांपूर्वी",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-marathi pb-20">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" /> सूचना आणि प्रगती (Notifications)
        </h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="relative border-l-2 border-indigo-100 ml-4 space-y-8 pb-8">
          {notifications.map((notif, idx) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="relative pl-8">
                {/* Timeline Dot */}
                <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${notif.iconBg}`}>
                  <Icon className={`w-3.5 h-3.5 ${notif.iconColor}`} />
                </div>
                
                {/* Content Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">{notif.title}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{notif.time}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
