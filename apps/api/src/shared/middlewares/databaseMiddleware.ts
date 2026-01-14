import { Request, Response, NextFunction } from 'express';
import { DatabaseData } from '../../core/types';


declare global {
  namespace Express {
    interface Request {
      db?: DatabaseData;
      databases?: Map<string, DatabaseData>;
    }
  }
}

export function databaseMiddleware(
  databases: Map<string, DatabaseData>,
  currentDb: DatabaseData | null
) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.databases = databases;
    req.db = currentDb || undefined;
    next();
  };
}