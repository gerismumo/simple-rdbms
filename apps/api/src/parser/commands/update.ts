import { update } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";
import { parseSet, parseWhere } from "../helpers";

export function executeUpdate(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
  if (!match) {
    throw new Error('Invalid UPDATE syntax');
  }

  const tableName = match[1];
  const setPart = match[2];
  const wherePart = match[3];

  const updates = parseSet(setPart);
  const conditions = wherePart ? parseWhere(wherePart) : {};

  const rowCount = update(db, tableName, conditions, updates);

  return {
    success: true,
    message: `${rowCount} row(s) updated`,
    rowCount
  };
}