"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`
        fixed top-8 right-8 z-50 w-12 h-12 rounded-full glass-card
        transition-all duration-300 hover:scale-110
        ${theme === 'dark'
          ? 'bg-white/5 hover:bg-white/10 text-white'
          : 'bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900'
        }
      `}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun 
          className={`h-5 w-5 absolute transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
        />
        <Moon 
          className={`h-5 w-5 absolute transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
