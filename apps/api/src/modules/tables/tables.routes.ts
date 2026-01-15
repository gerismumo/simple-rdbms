import { Router } from "express";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";
import { createTablesController } from "./tables.controller";

export default function tablesRoutes(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
):Router {
  const router = Router();
  const controller = createTablesController({ state, getCurrentDb });

  router.post("/:db", controller.create);
  router.get("/:db", controller.getAll);
  router.get("/:db/:name/rows", controller.getRows);
  router.get("/:db/:name/schema", controller.getSchema);
  router.delete("/:db/:name", controller.drop);

  return router;
}
