
import { parseCreateTable } from "./create-table.parse";

export function createSQLParser() {
  function execute(sql: string) {
    try {
      const trimmed = sql.trim();
      const startQuery = trimmed.toUpperCase();

      if (startQuery.startsWith("CREATE TABLE")) {
        return parseCreateTable(trimmed);
      } else if (startQuery.startsWith("INSERT INTO")) {
        console.log("insert table here");
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

  return { execute };
}
