"use client";

import React, { useState, useEffect } from "react";
import { Protocol } from "@/config/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { 
  copyToClipboard, 
  formatUnixTimestamp, 
  formatRelativeTime,
  getTimeDifferenceInSeconds
} from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "@/lib/hooks/useTheme";
import { useToast } from "@/lib/hooks/ToastContext";
import { useEpochStore } from "@/lib/stores/useEpochStore";

interface ProtocolCardProps {
  protocol: Protocol;
}

export function ProtocolCard({ protocol }: ProtocolCardProps) {
  const { theme } = useTheme();
  const { success } = useToast();
  const { 
    getCurrentTimestamp,
    getDisplayEpoch,
    getEpochInfo,
    setProtocolEpoch
  } = useEpochStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp());

  // Get current and display epochs for this protocol
  const displayEpoch = getDisplayEpoch(protocol.id, false); // false = use protocol-specific offset

  // Get epoch information including relative difference
  const { 
    epochStart: localEpochStart, 
    epochEnd: localEpochEnd,
    epochDiff: relativeEpoch 
  } = getEpochInfo(protocol.id, displayEpoch);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimestamp());
    }, 1000);
    return () => clearInterval(timer);
  }, [getCurrentTimestamp]);

  // Handle epoch adjustments
  const handleEpochInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = parseInt(e.target.value);
      if (!isNaN(value)) {
        setProtocolEpoch(protocol.id, value);
      }
    } catch (error) {
      console.error("Error handling epoch input change:", error);
    }
  };

  const handleCopyTimestamp = async (timestamp: number) => {
    try {
      if (typeof window === "undefined") return;
      const copied = await copyToClipboard(timestamp.toString());
      if (copied) {
        success("Unix timestamp copied");
      }
    } catch (error) {
      console.error("Error copying timestamp:", error);
    }
  };

  const handleCopyDiff = async (timestamp: number) => {
    try {
      if (typeof window === "undefined") return;
      const diff = getTimeDifferenceInSeconds(timestamp, currentTime);
      const copied = await copyToClipboard(diff.toString());
      if (copied) {
        success("Unix time diff copied");
      }
    } catch (error) {
      console.error("Error copying time difference:", error);
    }
  };

  // Calculate display labels based on relative epoch
  const offsetLabel = relativeEpoch === 0 ? "" : relativeEpoch > 0 ? `(+${relativeEpoch})` : `(${relativeEpoch})`;

  return (
    <div className="w-full rounded-xl overflow-hidden glass-card">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={protocol.id} className="border-none">
          <AccordionTrigger className="hover:no-underline px-6 py-4">
            <div className="flex items-center space-x-4 w-full">
              {protocol.logo && (
                <div className={`relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-white/10 to-white/5'
                    : 'bg-gradient-to-br from-slate-100 to-white'
                }`}>
                  <div className="relative w-8 h-8">
                    <Image
                      src={protocol.logo}
                      alt={protocol.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 text-left">
                <h3 
                  className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  } drop-shadow-sm`}
                  style={{ color: protocol.color }}
                >
                  {protocol.name} {offsetLabel}
                </h3>
                <p className={
                  theme === 'dark' ? 'text-sm text-white/70' : 'text-sm text-slate-600'
                }>
                  Epoch {displayEpoch}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 px-6 pb-6">
              <div className="flex items-center space-x-4">
                <label className={
                  theme === 'dark' ? 'text-sm font-medium text-white' : 'text-sm font-medium text-slate-900'
                }>
                  Epoch Number:
                </label>
                <input
                  type="number"
                  value={displayEpoch}
                  onChange={handleEpochInputChange}
                  className={`
                    px-3 py-2 rounded-lg w-28 text-center font-mono
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    ${theme === 'dark'
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-slate-100/80 text-slate-900 border border-slate-200/50'
                    }
                  `}
                  min="0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg glass-card">
                  <p className={
                    theme === 'dark' ? 'text-sm font-medium mb-2 text-white' : 'text-sm font-medium mb-2 text-slate-900'
                  }>
                    Start Time
                  </p>
                  <div className="flex flex-col space-y-2">
                    <span className={
                      theme === 'dark' ? 'text-sm font-mono text-white/80' : 'text-sm font-mono text-slate-700'
                    }>
                      {localEpochStart}
                    </span>
                    <span className={
                      theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-slate-500'
                    }>
                      {formatUnixTimestamp(localEpochStart)}
                    </span>
                    <span className={
                      theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-slate-500'
                    }>
                      {formatRelativeTime(localEpochStart, currentTime)}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyTimestamp(localEpochStart)}
                        className={
                          theme === 'dark'
                            ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                            : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Time
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyDiff(localEpochStart)}
                        className={
                          theme === 'dark'
                            ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                            : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Diff
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg glass-card">
                  <p className={
                    theme === 'dark' ? 'text-sm font-medium mb-2 text-white' : 'text-sm font-medium mb-2 text-slate-900'
                  }>
                    End Time
                  </p>
                  <div className="flex flex-col space-y-2">
                    <span className={
                      theme === 'dark' ? 'text-sm font-mono text-white/80' : 'text-sm font-mono text-slate-700'
                    }>
                      {localEpochEnd}
                    </span>
                    <span className={
                      theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-slate-500'
                    }>
                      {formatUnixTimestamp(localEpochEnd)}
                    </span>
                    <span className={
                      theme === 'dark' ? 'text-xs text-white/60' : 'text-xs text-slate-500'
                    }>
                      {formatRelativeTime(localEpochEnd, currentTime)}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyTimestamp(localEpochEnd)}
                        className={
                          theme === 'dark'
                            ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                            : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Time
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyDiff(localEpochEnd)}
                        className={
                          theme === 'dark'
                            ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                            : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Diff
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
