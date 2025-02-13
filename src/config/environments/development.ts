import { Config } from "../schema";

export const config = {
  protocols: [
    {
      id: "alpha",
      name: "Protocol Alpha",
      color: "#3B82F6", // blue-500
      logo: "/protocol-alpha.svg",
      referenceTimestamp: 1707350400, // Feb 8, 2024 00:00:00 UTC
      referenceEpoch: 0,
    },
    {
      id: "beta",
      name: "Protocol Beta",
      color: "#10B981", // emerald-500
      logo: "/protocol-beta.svg",
      referenceTimestamp: 1707955200, // Feb 15, 2024 00:00:00 UTC
      referenceEpoch: 1,
    },
    {
      id: "gamma",
      name: "Protocol Gamma",
      color: "#8B5CF6", // violet-500
      logo: "/protocol-gamma.svg",
      referenceTimestamp: 1708560000, // Feb 22, 2024 00:00:00 UTC
      referenceEpoch: 2,
    },
  ],
};
