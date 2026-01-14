import { Router } from "express";
import databasesModule from "./databases";
import { DatabaseData } from "../core/types";
import { DatabaseServiceState } from "../shared/types/database";
import queriesModule from "./queries";
import tablesModule from "./tables";

export default function modules(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
) {
  const router = Router();

  router.use("/databases", databasesModule(state));
  router.use("/query", queriesModule(state, getCurrentDb));
  router.use("/tables", tablesModule(state, getCurrentDb));

  return router;
}
