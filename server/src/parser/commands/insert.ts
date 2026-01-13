import { insert } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";
import { parseValues } from "../helpers";

export function executeInsertRow(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(
    /INSERT INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i
  );

  if (!match) {
    throw new Error("Invalid INSERT syntax");
  }

  console.log("match", match);

  const tableName = match[1];
  const columns = match[2].split(",").map((c) => c.trim());
  const values = parseValues(match[3]);

  if (columns.length !== values.length) {
    throw new Error("Column count does not match value count");
  }

  const row: Record<string, any> = {};

  columns.forEach((col, idx) => {
    row[col] = values[idx];
  });

  insert(db, tableName, row);

  return {
    success: true,
    message: "Row inserted successfully",
    rowCount: 1,
  };
}
