import { Protocol, validateConfig } from "./schema";

// Default to development environment unless specified
// const ENV = process.env.NEXT_PUBLIC_ENV || "development";

// Import environment config
import { config as envConfig } from "./environments/development";

// Validate config
const config = validateConfig(envConfig);

// Calculate initial epoch timestamp from the earliest reference point
const firstProtocol = [...config.protocols].sort(
  (a, b) => a.referenceTimestamp - b.referenceTimestamp
)[0];

export const INITIAL_EPOCH_TIMESTAMP =
  firstProtocol.referenceTimestamp -
  firstProtocol.referenceEpoch * 7 * 24 * 60 * 60;

export const protocols: Protocol[] = config.protocols.sort(
  (a, b) => a.referenceEpoch - b.referenceEpoch
);
