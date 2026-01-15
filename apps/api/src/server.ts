import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import requestLogger from "./shared/middlewares/requestLogger";
import modules from "./modules";
import { responseHandler } from "./shared/middlewares/responseHandler";
import path from "path";
import { errorHandler } from "./shared/middlewares/errorHandler";
import { DatabaseServiceState } from "./shared/types/database";
import { DatabaseData } from "./core/types";
import cors from "cors";

export function createApp(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
): Express {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );

  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(requestLogger);
  app.use(responseHandler);

  app.use("/", express.static(path.join(__dirname, "../public")));

  app.use("/api/v1", modules(state, getCurrentDb));

  app.get("/", (_req, res) => res.json({ ok: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    (error as any).statusCode = 404;
    next(error);
  });

  app.use(errorHandler);

  return app;
}
