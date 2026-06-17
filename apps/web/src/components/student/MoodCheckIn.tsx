"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const MOODS = [
  { value: "VERY_HAPPY", emoji: "😄", label: "खूप आनंदी" },
  { value: "HAPPY", emoji: "😊", label: "आनंदी" },
  { value: "NEUTRAL", emoji: "😐", label: "ठीक" },
  { value: "SAD", emoji: "😢", label: "दुःखी" },
  { value: "ANXIOUS", emoji: "😰", label: "काळजीत" },
  { value: "TIRED", emoji: "😴", label: "थकलेलो" },
];

export function MoodCheckIn({ studentId }: { studentId: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (mood: string) =>
      api.post(`/students/${studentId}/mood`, { mood }),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">
        <p className="text-green-700 font-medium font-marathi">
          धन्यवाद! तुमची भावना नोंदवली. 💚
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm p-4">
      <p className="text-sm font-medium text-gray-700 mb-3 font-marathi">
        आज तुम्हाला कसे वाटत आहे?
      </p>
      <div className="grid grid-cols-6 gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => {
              setSelected(mood.value);
              mutation.mutate(mood.value);
            }}
            disabled={mutation.isPending}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
              selected === mood.value
                ? "bg-brand-100 scale-110"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[9px] text-gray-500 font-marathi">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
