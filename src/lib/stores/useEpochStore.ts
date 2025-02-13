import { create } from "zustand";
import { INITIAL_EPOCH_TIMESTAMP } from "@/config/protocols";
import { getEpochBoundaries } from "@/lib/utils";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

interface EpochStore {
  globalEpoch: number;
  protocolOffsets: Record<string, number>;
  setGlobalEpoch: (epoch: number) => void;
  setProtocolOffset: (protocolId: string, offset: number) => void;
  resetAllOffsets: () => void;
  getCurrentEpoch: () => number;
  getEpochInfo: (epochNumber: number) => {
    epochStart: number;
    epochEnd: number;
    epochDiff: number;
  };
}

const getCurrentEpoch = () => {
  const now = Math.floor(Date.now() / 1000);
  const { start } = getEpochBoundaries(now);
  return Math.floor((start - INITIAL_EPOCH_TIMESTAMP) / WEEK_IN_SECONDS);
};

export const useEpochStore = create<EpochStore>((set, get) => {
  // Start auto-sync if we're in a browser environment
  if (typeof window !== "undefined") {
    setInterval(() => {
      const current = getCurrentEpoch();
      const state = get();
      // Only update if we're at the current epoch (not manually adjusted)
      if (state.globalEpoch === current) {
        set({ globalEpoch: current });
      }
    }, 1000);
  }

  return {
    globalEpoch: getCurrentEpoch(),
    protocolOffsets: {},

    setGlobalEpoch: (epoch: number) => {
      set({ globalEpoch: epoch });
    },

    setProtocolOffset: (protocolId: string, offset: number) => {
      set((state) => ({
        protocolOffsets: {
          ...state.protocolOffsets,
          [protocolId]: offset,
        },
      }));
    },

    resetAllOffsets: () => {
      set({
        globalEpoch: getCurrentEpoch(),
        protocolOffsets: {},
      });
    },

    getCurrentEpoch,

    getEpochInfo: (epochNumber: number) => {
      const currentEpoch = getCurrentEpoch();
      const epochTimestamp =
        INITIAL_EPOCH_TIMESTAMP + epochNumber * WEEK_IN_SECONDS;
      const { start, end } = getEpochBoundaries(epochTimestamp);
      return {
        epochStart: start,
        epochEnd: end,
        epochDiff: epochNumber - currentEpoch,
      };
    },
  };
});
