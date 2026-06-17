"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, ArrowLeft, TrendingUp, Sparkles, Send, BrainCircuit, Target, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { GameButton } from "@/components/ui/game-button";
import { useGamificationStore } from "@/store/useGamificationStore";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  type?: "regular" | "plan" | "weakness";
  options?: string[];
}

export default function AIMentorPage() {
  const getGrowthLevel = useGamificationStore((state) => state.getGrowthLevel);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "ai",
        text: `नमस्कार अभिजीत! तू सध्या **${getGrowthLevel()}** लेव्हल वर आहेस. खूप छान प्रगती करत आहेस!`,
        type: "regular"
      },
      {
        id: "2",
        role: "ai",
        text: `मी तुझा वैयक्तिक AI कोच आहे. मी तुझे मागील क्विझ स्कोअर तपासले आहेत. गणितातील **अपूर्णांक** (Fractions) या विषयात तुला थोडी अडचण येत आहे असे दिसते.`,
        type: "weakness",
        options: ["अपूर्णांक पुन्हा समजावून सांगा", "माझा आजचा प्लॅन सांगा", "मला दुसरी शंका आहे"]
      }
    ]);
  }, [getGrowthLevel]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Remove options from last AI message
    setMessages(prev => prev.map(m => ({ ...m, options: undefined })));

    try {
      // Create history mapping (skip the first 2 initial greeting messages for pure context, or keep them)
      const chatHistory = messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text
      }));

      const res = await api.post("/intelligence/tutor/chat", {
        session_id: "demo-session-123",
        student_id: "student-123",
        grade: 5,
        subject: "सामान्य",
        question: text,
        language: "mr",
        history: chatHistory
      });

      const data = res.data;
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        text: data.answer || "मला क्षमा करा, काहीतरी तांत्रिक अडचण आली.",
        type: "regular",
        options: data.follow_up_questions && data.follow_up_questions.length > 0 ? data.follow_up_questions : undefined
      }]);
    } catch (error) {
      console.error("Failed to get response from AI mentor:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        text: "मला क्षमा करा, काहीतरी तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.",
        type: "regular",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-marathi flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">AI ग्रोथ कोच</h1>
                <p className="text-xs text-green-600 font-bold tracking-wide">Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col h-[calc(100vh-70px)]">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-6 px-2 hide-scrollbar">
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-100 inline-block px-3 py-1 rounded-full">आजचा संवाद</p>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mr-3 mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              
              <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "order-1" : "order-2"}`}>
                {msg.type === "plan" ? (
                  <div className="bg-white border-2 border-amber-200 rounded-3xl rounded-tl-none p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full blur-xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                    <div className="flex items-center gap-2 mb-3 text-amber-600 font-bold border-b border-amber-100 pb-2">
                      <Target className="w-5 h-5" />
                      आजचा स्टडी प्लॅन
                    </div>
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                      {msg.text}
                    </div>
                  </div>
                ) : msg.type === "weakness" ? (
                  <div className="bg-white border-2 border-rose-200 rounded-3xl rounded-tl-none p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-100 rounded-full blur-xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                    <div className="flex items-center gap-2 mb-3 text-rose-600 font-bold border-b border-rose-100 pb-2">
                      <TrendingUp className="w-5 h-5" />
                      कोचची शिफारस (Focus Area)
                    </div>
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-3xl rounded-tr-none" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-3xl rounded-tl-none"
                  }`}>
                    {msg.text.split("**").map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className={msg.role === "user" ? "text-indigo-100" : "text-indigo-600"}>{part}</strong> : part
                    )}
                  </div>
                )}

                {msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mr-3 mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-4 shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-2 shadow-lg flex items-end gap-2 shrink-0">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputValue);
              }
            }}
            placeholder="कोचला विचारा (उदा. 'अपूर्णांक म्हणजे काय?')..." 
            className="flex-1 bg-transparent p-3 max-h-32 min-h-[50px] resize-none focus:outline-none font-medium text-slate-700 placeholder:text-slate-400 hide-scrollbar"
            rows={1}
          />
          <button 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>

      </main>
    </div>
  );
}
