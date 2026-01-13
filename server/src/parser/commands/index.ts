import { createIndexOn } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";

export function executeCreateIndex(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(
    /CREATE\s+(UNIQUE\s+)?INDEX\s+\w+\s+ON\s+(\w+)\s*\((\w+)\)/i
  );
  if (!match) {
    throw new Error("Invalid CREATE INDEX syntax");
  }

  const isUnique = !!match[1];
  const tableName = match[2];
  const columnName = match[3];

  createIndexOn(db, tableName, columnName, isUnique);

  return {
    success: true,
    message: `Index created on ${tableName}.${columnName}`,
  };
}
