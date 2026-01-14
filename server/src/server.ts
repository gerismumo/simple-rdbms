import { ENV } from "./shared/config/env";

import { initStorage, saveDatabase } from "./storage/persistence";
import { DatabaseServiceState } from "./shared/types/database";
import { DatabaseData, DataType } from "./core/types";
import { DatabasesService } from "./modules/databases/databases.service";
import { APP_CONSTANTS } from "./shared/config/constant";
import { createDatabase, createTable } from "./core/database";
import { insert } from "./core/operations";
import { createApp } from "./app";

initStorage(ENV.DATA_PATH);

const state: DatabaseServiceState = {
  databases: new Map<string, DatabaseData>(),
  basePath: ENV.DATA_PATH,
};

let currentDatabase: DatabaseData | null = null;

// Load dbs
DatabasesService.loadAll(state).then(() => {
  if (!state.databases.has(APP_CONSTANTS.DATABASE.DEFAULT_DB)) {
    console.log(
      `Creating default database: ${APP_CONSTANTS.DATABASE.DEFAULT_DB}`
    );
    const db = createDatabase(APP_CONSTANTS.DATABASE.DEFAULT_DB);
    state.databases.set(APP_CONSTANTS.DATABASE.DEFAULT_DB, db);
    saveDatabase(db, state.basePath);
  }

  currentDatabase =
    state.databases.get(APP_CONSTANTS.DATABASE.DEFAULT_DB) || null;

  if (currentDatabase) {
    const tables = Array.from(currentDatabase.tables.keys());

    if (!tables.includes("tasks")) {
      console.log("Creating tasks table...");
      createTable(currentDatabase, {
        name: "tasks",
        columns: [
          { name: "id", type: DataType.INTEGER, primaryKey: true },
          {
            name: "title",
            type: DataType.VARCHAR,
            maxLength: 200,
            nullable: false,
          },
          {
            name: "description",
            type: DataType.VARCHAR,
            maxLength: 500,
            nullable: true,
          },
          { name: "completed", type: DataType.BOOLEAN, nullable: false },
          {
            name: "created_at",
            type: DataType.VARCHAR,
            maxLength: 50,
            nullable: false,
          },
        ],
      });

      insert(currentDatabase, "tasks", {
        title: "Complete RDBMS challenge",
        description:
          "Implement a relational database from scratch with functional architecture",
        completed: false,
        created_at: new Date().toISOString(),
      });

      insert(currentDatabase, "tasks", {
        title: "Refactor to modular structure",
        description:
          "Organize code into modules with DTOs, services, controllers, and routes",
        completed: true,
        created_at: new Date().toISOString(),
      });

      saveDatabase(currentDatabase, state.basePath);
      console.log("Sample tasks added");
    }
  }

  const app = createApp(state, () => currentDatabase);

  const shutdown = () => {
    console.log("\n\n Saving all databases...");
    state.databases.forEach((db, name) => {
      saveDatabase(db, state.basePath);
    });
    console.log(" All databases saved. Goodbye!\n");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  app.listen(ENV.PORT, ENV.HOST_NAME, () => {
    console.log(`                                                              
      MyRDBMS Server - Modular Architecture                  

      Server:     http://${ENV.HOST_NAME}:${ENV.PORT}                       
      API:        http://${ENV.HOST_NAME}:${ENV.PORT}/api/v1             
      Data Path:  ${ENV.DATA_PATH.padEnd(43)} 
      Database:   ${(currentDatabase?.name || "none").padEnd(43)} 
      Tables:     ${
        currentDatabase ? Array.from(currentDatabase.tables.keys()).length : 0
      } 
                                                            
      Environment:   ${ENV.NODE_ENV.padEnd(43)} 
      Databases:     ${
        state.databases.size
      } loaded                               
      Server ready to accept connections
    `);
  });
});
