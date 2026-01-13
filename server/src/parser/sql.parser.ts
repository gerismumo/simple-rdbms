export function createSQLParser() {
  function execute(sql: string) {
    try {
      const startQuery = sql.trim().toUpperCase();

      if (startQuery.startsWith("CREATE TABLE")) {
        console.log("create table here");
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
