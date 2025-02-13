export interface Protocol {
  id: string;
  name: string;
  color: string;
  logo: string;
  startEpoch: number;
}

// Initial epoch timestamp set to a Thursday midnight UTC
export const INITIAL_EPOCH_TIMESTAMP = 1707350400; // Feb 8, 2024 00:00:00 UTC

export const protocols: Protocol[] = [
  {
    id: "alpha",
    name: "Protocol Alpha",
    color: "#3B82F6", // blue-500
    logo: "/protocol-alpha.svg",
    startEpoch: 0,
  },
  {
    id: "beta",
    name: "Protocol Beta",
    color: "#10B981", // emerald-500
    logo: "/protocol-beta.svg",
    startEpoch: 5,
  },
  {
    id: "gamma",
    name: "Protocol Gamma",
    color: "#8B5CF6", // violet-500
    logo: "/protocol-gamma.svg",
    startEpoch: 10,
  },
].sort((a, b) => a.startEpoch - b.startEpoch);
