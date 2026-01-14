import { deleteFrom } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";
import { parseWhere } from "../helpers";

export function executeDelete(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(/DELETE FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
  if (!match) {
    throw new Error('Invalid DELETE syntax');
  }

  const tableName = match[1];
  const wherePart = match[2];

  if (!wherePart) {
    throw new Error('DELETE without WHERE clause is not supported for safety');
  }

  const conditions = parseWhere(wherePart);
  const rowCount = deleteFrom(db, tableName, conditions);

  return {
    success: true,
    message: `${rowCount} row(s) deleted`,
    rowCount
  };
}