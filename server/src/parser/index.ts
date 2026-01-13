import { DatabaseData, QueryResult } from "../database/types";
import { executeCreateTable } from "./commands/create";

export function executeSQL(
  currentDb: DatabaseData | null,
  databases: Map<string, DatabaseData>,
  sql: string
): QueryResult {
  try {
    const trimmed = sql.trim();
    const upperSQL = trimmed.toUpperCase();

    //sql commandss
    if (upperSQL.startsWith("CREATE TABLE")) {
      return executeCreateTable(currentDb!, trimmed);
    } else {
      return {
        success: false,
        message: "Unsupported SQL command",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
