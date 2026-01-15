import { Request, Response, NextFunction } from "express";
import { TablesService } from "./tables.service";
import { CreateTableSchema } from "./dto/create-table.dto";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabaseData } from "../../core/types";
import { DatabasesService } from "../databases/databases.service";

type TablesControllerDeps = {
  state: DatabaseServiceState;
  getCurrentDb: () => DatabaseData | null;
};

export const createTablesController = ({
  state,
  getCurrentDb,
}: TablesControllerDeps) => {
  const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;
      const database = params?.db;

      const currentDb = await DatabasesService.switchTo(state, database);

      if (!currentDb) {
        return res.fail("No database selected", 400);
      }

      const parsed = CreateTableSchema.parse(req.body);
      const result = await TablesService.create(currentDb, state, parsed);

      return res.success(result, "Table created successfully", 201);
    } catch (err) {
      next(err);
    }
  };

  const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;
      const database = params?.db;

      const currentDb = await DatabasesService.switchTo(state, database);

      if (!currentDb) {
        return res.fail("No database selected", 400);
      }

      const tables = await TablesService.getAll(currentDb);

      return res.success(tables);
    } catch (err) {
      next(err);
    }
  };

  const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;
      const database = params?.db;

      const currentDb = await DatabasesService.switchTo(state, database);

      if (!currentDb) {
        return res.fail("No database selected", 400);
      }

      const name = params?.name as string;
      const schema = await TablesService.getSchema(currentDb, name);

      return res.success(schema);
    } catch (err) {
      next(err);
    }
  };

  const drop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;
      const database = params?.db;

      const currentDb = await DatabasesService.switchTo(state, database);

      if (!currentDb) {
        return res.fail("No database selected", 400);
      }

      const name = params?.name as string;

      await TablesService.drop(currentDb, state, name);

      return res.success(null, "Table dropped successfully");
    } catch (err) {
      next(err);
    }
  };

  return {
    create,
    getAll,
    getSchema,
    drop,
  };
};
