import { create } from 'zustand';
import { protocols, getProtocolEpoch, WEEK_IN_SECONDS } from '@/config/protocols';
import { getEpochBoundaries } from '@/lib/utils';

interface EpochStore {
  globalOffset: number;
  protocolOffsets: Record<string, number>;
  getCurrentTimestamp: () => number;
  getCurrentEpoch: (protocolId: string) => number;
  getDisplayEpoch: (protocolId: string, useGlobal?: boolean) => number;
  incrementGlobalEpoch: () => void;
  decrementGlobalEpoch: () => void;
  resetGlobalEpoch: () => void;
  incrementProtocolEpoch: (protocolId: string) => void;
  decrementProtocolEpoch: (protocolId: string) => void;
  resetProtocolEpoch: (protocolId: string) => void;
  setProtocolEpoch: (protocolId: string, targetEpoch: number) => void;
  getEpochInfo: (
    protocolId: string,
    epochNumber: number
  ) => {
    epochStart: number;
    epochEnd: number;
    epochDiff: number;
  };
}

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

const getCurrentEpoch = (protocolId: string) => {
  const now = getCurrentTimestamp();
  const protocol = protocols.find((p) => p.id === protocolId);
  if (!protocol) throw new Error(`Protocol ${protocolId} not found`);
  return getProtocolEpoch(protocol, now);
};

export const useEpochStore = create<EpochStore>((set, get) => {
  return {
    globalOffset: 0,
    protocolOffsets: {},

    getCurrentTimestamp,
    getCurrentEpoch,

    getDisplayEpoch: (protocolId: string, useGlobal = false) => {
      try {
        const currentEpoch = getCurrentEpoch(protocolId);
        const globalOffset = get().globalOffset;
        const protocolOffset = get().protocolOffsets[protocolId] || 0;
        // When useGlobal is true, only show global offset
        // When useGlobal is false, show both global AND protocol offset
        return currentEpoch + globalOffset + (!useGlobal ? protocolOffset : 0);
      } catch (error) {
        console.error('Error calculating display epoch:', error);
        return 0; // Return safe default
      }
    },

    incrementGlobalEpoch: () => {
      set((state) => ({
        globalOffset: state.globalOffset + 1,
        // Maintain protocol offsets when using global controls
        protocolOffsets: state.protocolOffsets,
      }));
    },

    decrementGlobalEpoch: () => {
      set((state) => ({
        globalOffset: state.globalOffset - 1,
        // Maintain protocol offsets when using global controls
        protocolOffsets: state.protocolOffsets,
      }));
    },

    resetGlobalEpoch: () => {
      set({
        globalOffset: 0,
        // Reset protocol offsets when resetting global
        protocolOffsets: {},
      });
    },

    incrementProtocolEpoch: (protocolId: string) => {
      set((state) => ({
        protocolOffsets: {
          ...state.protocolOffsets,
          [protocolId]: (state.protocolOffsets[protocolId] || 0) + 1,
        },
      }));
    },

    decrementProtocolEpoch: (protocolId: string) => {
      set((state) => ({
        protocolOffsets: {
          ...state.protocolOffsets,
          [protocolId]: (state.protocolOffsets[protocolId] || 0) - 1,
        },
      }));
    },

    resetProtocolEpoch: (protocolId: string) => {
      set((state) => ({
        protocolOffsets: {
          ...state.protocolOffsets,
          [protocolId]: 0,
        },
      }));
    },

    setProtocolEpoch: (protocolId: string, targetEpoch: number) => {
      try {
        const currentEpoch = getCurrentEpoch(protocolId);
        const globalOffset = get().globalOffset;
        // Account for global offset when setting protocol offset
        set((state) => ({
          protocolOffsets: {
            ...state.protocolOffsets,
            [protocolId]: targetEpoch - currentEpoch - globalOffset,
          },
        }));
      } catch (error) {
        console.error('Error setting protocol epoch:', error);
      }
    },

    getEpochInfo: (protocolId: string, epochNumber: number) => {
      try {
        const protocol = protocols.find((p) => p.id === protocolId);
        if (!protocol) throw new Error(`Protocol ${protocolId} not found`);

        const currentEpoch = getCurrentEpoch(protocolId);

        // Calculate the timestamp for this epoch
        const epochDiff = epochNumber - currentEpoch;
        const epochTimestamp =
          protocol.referenceTimestamp + (epochNumber - protocol.referenceEpoch) * WEEK_IN_SECONDS;
        const { start, end } = getEpochBoundaries(epochTimestamp);

        return {
          epochStart: start,
          epochEnd: end,
          epochDiff,
        };
      } catch (error) {
        console.error('Error getting epoch info:', error);
        return {
          epochStart: 0,
          epochEnd: 0,
          epochDiff: 0,
        };
      }
    },
  };
});
