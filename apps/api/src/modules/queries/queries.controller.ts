import { Request, Response, NextFunction } from "express";
import { QueriesService } from "./queries.service";
import { ExecuteQuerySchema } from "./dto/execute-query.dto";
import { DatabaseData } from "../../core/types";
import { DatabaseServiceState } from "../../shared/types/database";

type QueriesControllerDeps = {
  state: DatabaseServiceState;
  getCurrentDb: () => DatabaseData | null;
};

export const createQueriesController = ({
  state,
  getCurrentDb,
}: QueriesControllerDeps) => {
  const execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ExecuteQuerySchema.parse(req.body);
      const currentDb = getCurrentDb();

      const result = await QueriesService.execute(state, currentDb, parsed);

      if (result.success) {
        return res.success(
          {
            rows: result.rows,
            rowCount: result.rowCount,
          },
          result.message
        );
      }

      return res.fail(result.message || "Query failed", 400);
    } catch (err) {
      next(err);
    }
  };

  return {
    execute,
  };
};
