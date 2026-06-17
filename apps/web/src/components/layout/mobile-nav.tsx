"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Rocket, 
  Target, 
  Home,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "होम" },
  { href: "/learning-os", icon: BookOpen, label: "अभ्यास" },
  { href: "/skills", icon: Rocket, label: "कौशल्ये" },
  { href: "/career", icon: Target, label: "करिअर" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all",
                isActive ? "text-brand-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-brand-100")} />
              <span className="text-[10px] font-marathi font-medium">{item.label}</span>
            </Link>
          );
        })}
        {/* Placeholder for "More" menu or Village/AI Mentor */}
        <button className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-marathi font-medium">अधिक</span>
        </button>
      </div>
    </nav>
  );
}
