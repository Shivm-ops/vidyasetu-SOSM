"use client";

import Link from "next/link";

const SUBJECT_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  MARATHI: { bg: "#FFF7ED", text: "#EA580C", emoji: "📖" },
  ENGLISH: { bg: "#EFF6FF", text: "#2563EB", emoji: "🔤" },
  HINDI: { bg: "#FDF4FF", text: "#9333EA", emoji: "🗣️" },
  MATH: { bg: "#F0FDF4", text: "#16A34A", emoji: "🔢" },
  SCIENCE: { bg: "#ECFEFF", text: "#0891B2", emoji: "🔬" },
  HISTORY: { bg: "#FFFBEB", text: "#D97706", emoji: "🏛️" },
  GEOGRAPHY: { bg: "#F0FDF4", text: "#15803D", emoji: "🗺️" },
  CIVICS: { bg: "#FFF1F2", text: "#BE123C", emoji: "⚖️" },
  DEFAULT: { bg: "#F9FAFB", text: "#4B5563", emoji: "📚" },
};

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    nameMarathi?: string;
    code: string;
    iconUrl?: string;
    colorCode?: string;
    _count?: { chapters: number };
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const style = SUBJECT_COLORS[subject.code] ?? SUBJECT_COLORS.DEFAULT;

  return (
    <Link
      href={`/learn/subjects/${subject.code}`}
      className="subject-card flex items-center gap-3"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl"
        style={{ backgroundColor: style.bg }}
      >
        {subject.iconUrl ? (
          <img src={subject.iconUrl} alt={subject.name} className="h-6 w-6" />
        ) : (
          style.emoji
        )}
      </div>
      <div className="min-w-0">
        <p
          className="font-medium text-sm text-gray-800 truncate font-marathi"
          style={{ color: style.text }}
        >
          {subject.nameMarathi ?? subject.name}
        </p>
        <p className="text-xs text-gray-400">
          {subject._count?.chapters ?? 0} प्रकरणे
        </p>
      </div>
    </Link>
  );
}
