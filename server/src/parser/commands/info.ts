import { DatabaseData, QueryResult } from "../../core/types";

export function executeShowDatabases(databases: Map<string, DatabaseData>): QueryResult {
  const rows = Array.from(databases.keys()).map(name => ({ database_name: name }));
  
  return {
    success: true,
    rows,
    rowCount: rows.length
  };
}