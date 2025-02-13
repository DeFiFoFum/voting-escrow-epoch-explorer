"use client";

import React, { useState } from "react";
import { Protocol } from "@/config/protocols";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { copyToClipboard, formatUnixTimestamp, getEpochBoundaries } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "@/lib/hooks/useTheme";
import { INITIAL_EPOCH_TIMESTAMP } from "@/config/protocols";
import { useToast } from "@/lib/hooks/ToastContext";

interface ProtocolCardProps {
  protocol: Protocol;
  currentEpoch: number;
  epochStart: number;
  epochEnd: number;
  onEpochChange: (epochNumber: number) => void;
}

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export function ProtocolCard({
  protocol,
  currentEpoch,
  epochStart: globalEpochStart,
  epochEnd: globalEpochEnd,
}: ProtocolCardProps) {
  const { theme } = useTheme();
  const { success } = useToast();
  const [localEpoch, setLocalEpoch] = useState(Math.max(0, currentEpoch - protocol.startEpoch));

  // Calculate local timestamps based on local epoch
  const localTimestamp = INITIAL_EPOCH_TIMESTAMP + (localEpoch + protocol.startEpoch) * WEEK_IN_SECONDS;
  const { start: localEpochStart, end: localEpochEnd } = getEpochBoundaries(localTimestamp);

  const handleEpochInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLocalEpoch(value);
    }
  };

  const handleCopy = async (text: string) => {
    if (typeof window === "undefined") return;
    await copyToClipboard(text);
    success("Copied Text");
  };

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
                  {protocol.name}
                </h3>
                <p className={
                  theme === 'dark' ? 'text-sm text-white/70' : 'text-sm text-slate-600'
                }>
                  Epoch {localEpoch}
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
                  value={localEpoch}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(localEpochStart.toString())}
                      className={
                        theme === 'dark'
                          ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                          : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(localEpochEnd.toString())}
                      className={
                        theme === 'dark'
                          ? 'w-fit text-white/70 hover:text-white hover:bg-white/10'
                          : 'w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
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
