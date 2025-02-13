"use client";

import { EpochClock } from "@/components/EpochClock";
import { ProtocolCard } from "@/components/ProtocolCard";
import { protocols } from "@/config/protocols";
import { getEpochBoundaries } from "@/lib/utils";
import React, { useState } from "react";
import { INITIAL_EPOCH_TIMESTAMP } from "@/config/protocols";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { theme } = useTheme();
  const [expandedProtocols, setExpandedProtocols] = useState<Set<string>>(new Set());

  const handleCollapseAll = () => {
    setExpandedProtocols(new Set());
  };

  const handleAccordionChange = (value: string) => {
    setExpandedProtocols((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Dark theme gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(-45deg, #0F172A, #1E293B, #0D1B2A, #1F2937)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      />
      
      {/* Light theme gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(-45deg, #EFF6FF, #F8FAFC, #F0F9FF, #FFFFFF)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <EpochClock />

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="w-full text-center">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' 
                  ? 'text-white/90' 
                  : 'text-slate-900'
              }`}>
                Protocols
              </h2>
            </div>
            {expandedProtocols.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCollapseAll}
                className={`absolute right-4 ${
                  theme === 'dark'
                    ? 'text-white/70 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="h-4 w-4 mr-2" />
                Collapse All
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {protocols.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                protocol={protocol}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
