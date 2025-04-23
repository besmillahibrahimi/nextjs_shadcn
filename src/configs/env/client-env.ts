"use client";

import { clientSchema, type ClientEnv } from "./schema";

function parseClientEnv(): ClientEnv {
  const env = {
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      environment: process.env.NEXT_PUBLIC_NODE_ENV,
      address: process.env.NEXT_PUBLIC_APP_ADDRESS,
      apiUrl: process.env.NEXT_PUBLIC_APP_API_URL,
    },
  };

  return clientSchema.parse(env);
}

export const clientEnv = parseClientEnv();
