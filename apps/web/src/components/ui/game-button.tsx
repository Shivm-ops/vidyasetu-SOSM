"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-blue-500 text-white shadow-[0_4px_0_rgb(29,78,216)] hover:bg-blue-400 hover:shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none rounded-2xl",
      secondary: "bg-purple-500 text-white shadow-[0_4px_0_rgb(126,34,206)] hover:bg-purple-400 hover:shadow-[0_4px_0_rgb(147,51,234)] active:translate-y-1 active:shadow-none rounded-2xl",
      success: "bg-green-500 text-white shadow-[0_4px_0_rgb(21,128,61)] hover:bg-green-400 hover:shadow-[0_4px_0_rgb(22,163,74)] active:translate-y-1 active:shadow-none rounded-2xl",
      danger: "bg-red-500 text-white shadow-[0_4px_0_rgb(185,28,28)] hover:bg-red-400 hover:shadow-[0_4px_0_rgb(220,38,38)] active:translate-y-1 active:shadow-none rounded-2xl",
      ghost: "hover:bg-accent hover:text-accent-foreground rounded-2xl",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-lg",
      lg: "h-14 px-8 text-xl",
      icon: "h-12 w-12",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
GameButton.displayName = "GameButton";
