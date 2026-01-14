import { innerJoin } from "../../core/database";
import { select } from "../../core/operations";
import { DatabaseData, QueryResult } from "../../core/types";
import { parseWhere } from "../helpers";

export function executeSelect(db: DatabaseData, sql: string): QueryResult {
  const joinMatch = sql.match(
    /SELECT\s+(.+?)\s+FROM\s+(\w+)\s+INNER JOIN\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i
  );

  if (joinMatch) {
    const selectPart = joinMatch[1].trim();
    const leftTable = joinMatch[2];
    const rightTable = joinMatch[3];
    const leftColumn = joinMatch[5];
    const rightColumn = joinMatch[7];

    const selectColumns =
      selectPart === "*"
        ? undefined
        : selectPart.split(",").map((c) => c.trim());

    const rows = innerJoin(
      db,
      leftTable,
      rightTable,
      leftColumn,
      rightColumn,
      selectColumns
    );

    return {
      success: true,
      rows,
      rowCount: rows.length,
    };
  }

  const match = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
  if (!match) {
    throw new Error("Invalid SELECT syntax");
  }

  const selectPart = match[1].trim();
  const tableName = match[2];
  const wherePart = match[3];

  let rows = wherePart
    ? select(db, tableName, parseWhere(wherePart))
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
