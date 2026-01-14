import { Router } from "express";
import databasesModule from "./databases";
import { DatabaseData } from "../core/types";
import { DatabaseServiceState } from "../shared/types/database";


export default function modules(
  state: DatabaseServiceState,
  getCurrentDb: () => DatabaseData | null
) {
  const router = Router();
  router.use("/databases", databasesModule(state));

  return router;
}
