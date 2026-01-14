import { saveDatabase } from "../storage/persistence";
import { DatabaseServiceState } from "../shared/types/database";

export function registerShutdown(state: DatabaseServiceState) {
  const shutdown = () => {
    console.log("\nSaving all databases...");
    state.databases.forEach((db) => {
      saveDatabase(db, state.basePath);
    });
    console.log("All databases saved. Goodbye!\n");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
