import { DatabaseData, QueryResult } from "../core/types";
import { executeCreateTable } from "./commands/create";
import { executeShowDatabases } from "./commands/info";
import { executeInsertRow } from "./commands/insert";

export function executeSQL(
  currentDb: DatabaseData | null,
  databases: Map<string, DatabaseData>,
  sql: string
): QueryResult {
  try {
    const trimmed = sql.trim();
    const upperSQL = trimmed.toUpperCase();

    if (upperSQL.startsWith("SHOW DATABASES")) {
      return executeShowDatabases(databases);
    }

    if (
      !currentDb &&
      !upperSQL.startsWith("CREATE DATABASE") &&
      !upperSQL.startsWith("USE")
    ) {
      return {
        success: false,
        message:
          'No database selected. Use "USE <database>" or "CREATE DATABASE <name>"',
      };
    }

    //sql commandss
    if (upperSQL.startsWith("CREATE TABLE")) {
      return executeCreateTable(currentDb!, trimmed);
    } else if (upperSQL.startsWith("INSERT INTO")) {
      return executeInsertRow(currentDb!, trimmed);
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
