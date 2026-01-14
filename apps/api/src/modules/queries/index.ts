import { Router } from "express";
import queriesRoutes from "./queries.routes";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";

export default function queriesModule(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
) {
  const router = Router();
  router.use(queriesRoutes(state, getCurrentDb));
  return router;
}
