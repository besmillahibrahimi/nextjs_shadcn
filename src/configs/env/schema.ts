import { z } from "zod";

// Base schema for common environment variables
const baseSchema = z.object({
  app: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    environment: z.enum(["development", "production", "test"]),
    address: z.string().url(),
    apiUrl: z.string().url(),
  }),
});

// Server-only schema
export const serverSchema = baseSchema.extend({
  db: z.object({
    uri: z.string().min(1),
    name: z.string().min(1),
  }),
});

// Client-only schema (subset of base schema)
export const clientSchema = baseSchema.pick({
  app: true,
});

// Type inference
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
