import { Config, Protocol, validateConfig } from "./schema";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

// Helper to align timestamp to week boundary
function alignToWeekBoundary(timestamp: number): number {
  return timestamp - (timestamp % WEEK_IN_SECONDS);
}

// Get relative epoch (-1, 0, 1) from current time
function getRelativeEpoch(timestamp: number, currentTime: number): number {
  const alignedTimestamp = alignToWeekBoundary(timestamp);
  const alignedCurrent = alignToWeekBoundary(currentTime);

  if (alignedTimestamp < alignedCurrent) return -1;
  if (alignedTimestamp > alignedCurrent) return 1;
  return 0;
}

const config: Config = {
  protocols: [
    {
      id: "alpha",
      name: "Protocol Alpha",
      color: "#3B82F6", // blue-500
      logo: "/protocol-alpha.svg",
      referenceTimestamp: alignToWeekBoundary(1707350400), // Feb 8, 2024 00:00:00 UTC
      referenceEpoch: 0,
    },
    {
      id: "beta",
      name: "Protocol Beta",
      color: "#10B981", // emerald-500
      logo: "/protocol-beta.svg",
      referenceTimestamp: alignToWeekBoundary(1707955200), // Feb 15, 2024 00:00:00 UTC
      referenceEpoch: 0,
    },
    {
      id: "gamma",
      name: "Protocol Gamma",
      color: "#8B5CF6", // violet-500
      logo: "/protocol-gamma.svg",
      referenceTimestamp: alignToWeekBoundary(1708560000), // Feb 22, 2024 00:00:00 UTC
      referenceEpoch: 0,
    },
  ],
};

// Validate config
const parsedConfig = validateConfig(config);

// Helper function to calculate protocol-specific epoch
export function getProtocolEpoch(protocol: Protocol, timestamp: number) {
  // Calculate how many weeks have passed since the reference timestamp
  const weeksSinceReference = Math.floor(
    (timestamp - protocol.referenceTimestamp) / WEEK_IN_SECONDS
  );
  // Add weeks passed to reference epoch to get current epoch
  return protocol.referenceEpoch + weeksSinceReference;
}

export const protocols: Protocol[] = parsedConfig.protocols;
export { WEEK_IN_SECONDS, getRelativeEpoch };
