import { Router } from "express";
import { createDatabasesController } from "./databases.controller";
import { DatabaseServiceState } from "../../shared/types/database";

export default function databasesRoutes(state: DatabaseServiceState) {
  const router = Router();
  const controller = createDatabasesController(state);

  router.post("/", controller.create);
  router.get("/", controller.getAll);
  router.get("/:name", controller.getByName);
  router.post("/use", controller.switchDatabase);
  router.delete("/:name", controller.delete);

  return router;
}
