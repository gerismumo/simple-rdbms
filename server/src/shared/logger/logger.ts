import pino from "pino";
import { ENV } from "../config/env";

const pinoLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  },
  level: ENV.NODE_ENV === "production" ? "info" : "debug",
});

function sendToExternal(error: unknown, meta?: unknown) {
  if (ENV.NODE_ENV !== "production") return;
  // Example: Sentry
}

const logger = {
  info(message: string, meta?: unknown) {
    pinoLogger.info(meta, message);
  },

  warn(message: string, meta?: unknown) {
    pinoLogger.warn(meta, message);
  },

  error(error: unknown, meta?: unknown) {
    pinoLogger.error({ error, meta });

    sendToExternal(error, meta);
  },

  debug(message: string, meta?: unknown) {
    pinoLogger.debug(meta, message);
  },
};

export default logger;
