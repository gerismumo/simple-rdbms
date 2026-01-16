import { ENV } from "./shared/config/env";
import { initState } from "./bootstrap/initState";
import { registerShutdown } from "./bootstrap/shutdown";
import { APP_CONSTANTS } from "./shared/config/constant";
import { DatabaseData } from "./core/types";
import { DatabasesService } from "./modules/databases/databases.service";
import { createApp } from "./server";

async function server() {
  const state = await initState(ENV.DATA_PATH);
  const dbName = APP_CONSTANTS.DATABASE.DEFAULT_DB;
  let currentDatabase: DatabaseData | null = null;

  if (!state.databases.has(dbName)) {
    console.log(`Creating default database: ${dbName} `);
    await DatabasesService.create(state, { name: dbName });
  }

  currentDatabase = await DatabasesService.getByName(state, dbName);

  const app = createApp(state, () => currentDatabase);

  registerShutdown(state);

  app.listen(ENV.PORT ,() => {
    console.log(`
      MyRDBMS Server - Modular Architecture

      Server:     http://locahost:${ENV.PORT}
      API:        http://locahost:${ENV.PORT}/api/v1
      Data Path:  ${ENV.DATA_PATH.padEnd(43)}
      Database:   ${(currentDatabase?.name || "none").padEnd(43)}
      Tables:     ${
        currentDatabase ? Array.from(currentDatabase.tables.keys()).length : 0
      }

      Environment: ${ENV.NODE_ENV.padEnd(43)}
      Databases:   ${state.databases.size} loaded
      Server ready to accept connections
    `);
  });
}

server();
