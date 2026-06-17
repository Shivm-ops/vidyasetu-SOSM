"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Rocket, 
  Target, 
  Lightbulb, 
  Leaf, 
  Bot, 
  Home,
  LogOut,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "डॅशबोर्ड", color: "text-gray-700" },
  { href: "/learning-os", icon: BookOpen, label: "अभ्यास", color: "text-learning" },
  { href: "/skills", icon: Rocket, label: "कौशल्ये", color: "text-skills" },
  { href: "/career", icon: Target, label: "करिअर", color: "text-career" },
  { href: "/innovation", icon: Lightbulb, label: "नावीन्य", color: "text-innovation" },
  { href: "/village", icon: Leaf, label: "कम्युनिटी", color: "text-village" },
  { href: "/ai-mentor", icon: Bot, label: "AI कोच", color: "text-ai" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r bg-white glass z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-lg shadow-md shadow-brand-200">
          वि
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-900 font-marathi leading-none">विद्यासेतू</h1>
          <p className="text-xs text-gray-500 font-medium">VidyaSetu</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        <div className="mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          मेनू (Menu)
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-marathi font-medium",
                isActive 
                  ? "bg-brand-50 text-brand-700 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-brand-600" : item.color)} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-marathi text-sm"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          सेटिंग्ज
        </Link>
        <button
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-marathi text-sm"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          लॉगआउट
        </button>
      </div>
    </aside>
  );
}
