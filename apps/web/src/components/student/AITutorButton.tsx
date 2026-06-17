"use client";

import { useState } from "react";
import { Bot, Send, X, Mic } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AITutorButton({ grade }: { grade: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `नमस्कार! मी तुमचा AI शिक्षक आहे. इयत्ता ${grade} च्या कोणत्याही विषयाबद्दल प्रश्न विचारा! 😊`,
    },
  ]);
  const [input, setInput] = useState("");
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await aiApi.post("/tutor/chat", {
        session_id: user?.student?.id ?? "session",
        student_id: user?.student?.id ?? "",
        grade,
        question,
        language: "mr",
        history: messages.slice(-6),
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    },
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    mutation.mutate(question);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-white shadow-lg shadow-brand-200 hover:shadow-xl transition-all hover:-translate-y-0.5 md:bottom-8"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium font-marathi">AI शिक्षक</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 flex h-[85vh] w-full max-w-lg flex-col rounded-t-3xl md:rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold font-marathi">AI शिक्षक</p>
                  <p className="text-xs text-brand-100">इयत्ता {grade} • मराठी</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed font-marathi ${
                      msg.role === "user"
                        ? "bg-brand-500 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {mutation.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-gray-100 px-4 py-3 rounded-tl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4 safe-bottom">
              <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="प्रश्न विचारा..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 font-marathi"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || mutation.isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
