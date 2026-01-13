import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

function required(name: string, value?: string): string {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const ENV = {
  HOST_NAME: process.env.HOST_NAME || "localhost",
  PORT: parseInt(required("PORT", process.env.PORT), 10),
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
  NODE_ENV: required("NODE_ENV", process.env.NODE_ENV),
  // JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
} as const;
