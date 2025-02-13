import { z } from 'zod';

export const ProtocolSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  logo: z.string(),
  referenceTimestamp: z.number(),
  referenceEpoch: z.number(),
});

export const ConfigSchema = z.object({
  protocols: z.array(ProtocolSchema),
});

export type Protocol = z.infer<typeof ProtocolSchema>;
export type Config = z.infer<typeof ConfigSchema>;

export function validateConfig(config: unknown): Config {
  return ConfigSchema.parse(config);
}

export function validateConfigFromJson(jsonString: string): Config {
  return ConfigSchema.parse(JSON.parse(jsonString));
}
