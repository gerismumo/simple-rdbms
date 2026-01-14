import { select } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";
import { parseWhere } from "../helpers";

export function executeSelect(db: DatabaseData, sql: string): QueryResult {
  const joinMatch = sql.match(
    /SELECT\s+(.+?)\s+FROM\s+(\w+)\s+INNER JOIN\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i
  );

  if (joinMatch) {
    console.log("joinMatch", joinMatch);
  }

  const match = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
  if (!match) {
    throw new Error("Invalid SELECT syntax");
  }

  console.log("match", match);

  const selectPart = match[1].trim();
  const tableName = match[2];
  const wherePart = match[3];

  console.log("parseWhere(wherePart)", parseWhere(wherePart))

  let rows = wherePart
    ? select(db, tableName, {id:'1'})
    : select(db, tableName);

  if (selectPart !== "*") {
    const columns = selectPart.split(",").map((c) => c.trim());
    rows = rows.map((row) => {
      const filtered: Record<string, any> = {};
      columns.forEach((col) => {
        filtered[col] = row[col];
      });
      return filtered;
    });
  }

  return {
    success: true,
    rows,
    rowCount: rows.length,
  };
}
