"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { formatUnixTimestamp, copyToClipboard } from "@/lib/utils";
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { useEpochStore } from "@/lib/stores/useEpochStore";
import { useToast } from "@/lib/hooks/ToastContext";
import { protocols } from "@/config/protocols";

export function EpochClock() {
  const { theme } = useTheme();
  const { success } = useToast();
  const { 
    getCurrentTimestamp,
    getDisplayEpoch,
    getEpochInfo,
    decrementGlobalEpoch,
    incrementGlobalEpoch,
    resetGlobalEpoch
  } = useEpochStore();

  // Use the first protocol as reference for global clock
  const referenceProtocol = protocols[0];
  const currentTimestamp = getCurrentTimestamp();
  const displayEpoch = getDisplayEpoch(referenceProtocol.id, true); // true = use global offset

  const { epochStart, epochEnd, epochDiff } = getEpochInfo(
    referenceProtocol.id,
    displayEpoch
  );

  const handlePreviousEpoch = () => {
    decrementGlobalEpoch();
  };

  const handleNextEpoch = () => {
    incrementGlobalEpoch();
  };

  const handleResetToCurrentEpoch = () => {
    resetGlobalEpoch();
  };

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async (text: string) => {
    try {
      if (typeof window === "undefined") return;
      await copyToClipboard(text);
      success("Timestamp Copied");
    } catch (error) {
      console.error("Failed to copy timestamp:", error);
    }
  };

  const timeString = currentTime?.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-xl backdrop-blur-md transition-all duration-200">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-6 drop-shadow-sm ${
          theme === 'dark' ? 'text-white/90' : 'text-slate-900'
        }`}>
          Epoch Explorer
        </h1>
        <div className="space-y-3">
          {mounted && (
            <p className={`text-xl font-medium ${
              theme === 'dark' ? 'text-white/80' : 'text-slate-700'
            }`}>
              {timeString}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2">
            <p className={`font-mono text-lg ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>
              Current Unix Timestamp:
            </p>
            <div className="flex items-center space-x-2">
              <span className={`font-mono text-lg font-medium ${
                theme === 'dark' ? 'text-white/80' : 'text-slate-700'
              }`}>
                {currentTimestamp}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(currentTimestamp.toString())}
                className={
                  theme === 'dark'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-6 rounded-xl glass-card">
          <h2 className={`text-xl font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Epoch Start
          </h2>
          <div className="space-y-2 mb-4">
            <p className={`font-mono ${
              theme === 'dark' ? 'text-white/80' : 'text-slate-700'
            }`}>
              {epochStart}
            </p>
            <p className={
              theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-slate-500'
            }>
              {formatUnixTimestamp(epochStart)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(epochStart.toString())}
            className={`w-full ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : 'bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border-slate-200/50'
            }`}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Timestamp
          </Button>
        </div>

        <div className={`text-center p-6 rounded-xl glass-card ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/20'
            : 'bg-gradient-to-br from-blue-100/80 to-indigo-100/80 border border-slate-200/50'
        }`}>
          <h2 className={`text-xl font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Adjust Epoch
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousEpoch}
                className={`hover:scale-110 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextEpoch}
                className={`hover:scale-110 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToCurrentEpoch}
                className={`text-sm font-mono group-hover:bg-opacity-20 ${
                  theme === 'dark'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Current Epoch {epochDiff === 0 ? "(0)" : epochDiff > 0 ? `(+${epochDiff})` : `(${epochDiff})`}
              </Button>
              <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 ${
                theme === 'dark'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-slate-800 text-white'
              }`}>
                Click to reset to current epoch
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-6 rounded-xl glass-card">
          <h2 className={`text-xl font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Epoch End
          </h2>
          <div className="space-y-2 mb-4">
            <p className={`font-mono ${
              theme === 'dark' ? 'text-white/80' : 'text-slate-700'
            }`}>
              {epochEnd}
            </p>
            <p className={
              theme === 'dark' ? 'text-sm text-white/60' : 'text-sm text-slate-500'
            }>
              {formatUnixTimestamp(epochEnd)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(epochEnd.toString())}
            className={`w-full ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : 'bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border-slate-200/50'
            }`}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Timestamp
          </Button>
        </div>
      </div>
    </div>
  );
}
