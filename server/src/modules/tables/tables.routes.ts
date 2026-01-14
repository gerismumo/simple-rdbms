import { Router } from "express";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";
import { createTablesController } from "./tables.controller";

export default function tablesRoutes(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
) {
  const router = Router();
  const controller = createTablesController({ state, getCurrentDb });

  router.post("/", controller.create);
  router.get("/", controller.getAll);
  router.get("/:name/schema", controller.getSchema);
  router.delete("/:name", controller.drop);

  return router;
}
