"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface ModuleCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  colorClass: string; 
  shadowColorHex: string; 
  delay?: number;
  progress?: number; // 0-100
}

export function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  colorClass, 
  shadowColorHex, 
  delay = 0,
  progress
}: ModuleCardProps) {
  return (
    <Link href={href} className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 6, boxShadow: `0 0px 0 ${shadowColorHex}` }}
        className={cn(
          "relative flex flex-col p-6 rounded-[2rem] cursor-pointer text-white overflow-hidden group transition-all duration-200",
          colorClass
        )}
        style={{
          boxShadow: `0 8px 0 ${shadowColorHex}`,
        }}
      >
        {/* Background Decoration */}
        <div className="absolute -right-4 -top-4 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <Icon size={140} />
        </div>

        <div className="relative z-10 flex flex-col h-full min-h-[140px]">
          <div className="flex items-center justify-between mb-auto">
            <div className="bg-white/20 p-3 rounded-2xl w-fit backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Icon size={32} className="text-white" />
            </div>
            
            {progress !== undefined && (
              <div className="relative w-12 h-12 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-white/20"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (progress / 100) * 125.6}
                    className="text-white transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold">{progress}%</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-1 font-marathi">{title}</h3>
            {description && (
              <p className="text-white/90 font-medium font-marathi text-sm line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
