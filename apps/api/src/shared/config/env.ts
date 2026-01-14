import * as dotenv from "dotenv";
import path from "path";

function loadEnv() {
  const NODE_ENV = process.env.NODE_ENV ?? "development";

  const envFiles = [".env", `.env.${NODE_ENV}`, ".env.local"];

  for (const file of envFiles) {
    dotenv.config({
      path: path.resolve(__dirname, "../../../", file),
      override: false,
    });
  }

  return NODE_ENV;
}

const NODE_ENV = loadEnv();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  NODE_ENV,
  HOST_NAME: process.env.HOST_NAME || "localhost",
  PORT: parseInt(required("PORT"), 10),
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT}`,
  DATA_PATH: process.env.DATA_PATH || "./data",
} as const;
