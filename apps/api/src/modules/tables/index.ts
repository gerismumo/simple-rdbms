import { Router } from "express";
import tablesRoutes from "./tables.routes";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";

export default function tablesModule(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
):Router {
  const router = Router();
  router.use(tablesRoutes(state, getCurrentDb));
  return router;
}
