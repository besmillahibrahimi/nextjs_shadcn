import { type ServerEnv, serverSchema } from "./schema";

function parseServerEnv(): ServerEnv {
  const env = {
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      environment: process.env.NEXT_PUBLIC_NODE_ENV,
      address: process.env.NEXT_PUBLIC_APP_ADDRESS,
      apiUrl: process.env.NEXT_PUBLIC_APP_API_URL,
    },
    db: {
      uri: process.env.DB_URI,
      name: process.env.DB_NAME,
    },
  };

  return serverSchema.parse(env);
}

export const serverEnv = parseServerEnv();
