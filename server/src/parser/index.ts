import { DatabaseData, QueryResult } from "../core/types";
import { executeCreateTable, executeDropTable } from "./commands/create";
import { executeDelete } from "./commands/delete";
import {
  executeDescribe,
  executeShowDatabases,
  executeShowTables,
} from "./commands/info";
import { executeInsertRow } from "./commands/insert";
import { executeSelect } from "./commands/select";
import { executeUpdate } from "./commands/update";

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
    } else if (upperSQL.startsWith("DROP TABLE")) {
      return executeDropTable(currentDb!, trimmed);
    } else if (upperSQL.startsWith("INSERT INTO")) {
      return executeInsertRow(currentDb!, trimmed);
    } else if (upperSQL.startsWith("SELECT")) {
      return executeSelect(currentDb!, trimmed);
    } else if (upperSQL.startsWith("UPDATE")) {
      return executeUpdate(currentDb!, trimmed);
    } else if (upperSQL.startsWith("DELETE FROM")) {
      return executeDelete(currentDb!, trimmed);
    } else if (upperSQL.startsWith("SHOW TABLES")) {
      return executeShowTables(currentDb!);
    } else if (upperSQL.startsWith("DESCRIBE")) {
      return executeDescribe(currentDb!, trimmed);
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
