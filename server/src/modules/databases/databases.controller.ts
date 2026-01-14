import { Request, Response, NextFunction } from "express";
import { DatabasesService } from "./databases.service";
import { CreateDatabaseSchema } from "./dto/create-database.dto";
import { UseDatabaseSchema } from "./dto/use-database.dto";
import { DatabaseServiceState } from "./types";

export const createDatabasesController = (state: DatabaseServiceState) => {
  const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateDatabaseSchema.parse(req.body);
      const db = await DatabasesService.create(state, parsed);

      return res.success(
        { name: db.name, tables: db.tables.size },
        "Database created successfully",
        201
      );
    } catch (err) {
      next(err);
    }
  };

  const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const databases = await DatabasesService.getAll(state);
      return res.success(databases);
    } catch (err) {
      next(err);
    }
  };

  const getByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;

      const name = params?.name as string;

      if (!name) {
        return res.fail("name is required");
      }
      const db = await DatabasesService.getByName(state, name);

      return res.success({
        name: db.name,
        tables: Array.from(db.tables.keys()),
      });
    } catch (err) {
      next(err);
    }
  };

  const switchDatabase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = UseDatabaseSchema.parse(req.body);
      const db = await DatabasesService.switchTo(state, parsed.name);

      return res.success(
        { name: db.name },
        `Switched to database ${parsed.name}`
      );
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req;

      const name = params?.name as string;
      await DatabasesService.delete(state, name);

      return res.success(null, "Database deleted successfully");
    } catch (err) {
      next(err);
    }
  };

  return {
    create,
    getAll,
    getByName,
    switchDatabase,
    delete: remove,
  };
};
