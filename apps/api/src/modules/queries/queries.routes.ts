import { Router } from "express";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";
import { createQueriesController } from "./queries.controller";

export default function queriesRoutes(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
):Router {
  const router = Router();
  const controller = createQueriesController({ state, getCurrentDb });

  router.post("/", controller.execute);

  return router;
}
