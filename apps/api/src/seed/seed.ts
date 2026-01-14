// src/seed/seed.ts
import { initStorage } from "../storage/persistence";
import { DatabaseServiceState } from "../shared/types/database";
import { DatabasesService } from "../modules/databases/databases.service";
import { executeSQL } from "../parser";
import { APP_CONSTANTS } from "../shared/config/constant";
import { ENV } from "../shared/config/env";
import { initState } from "../bootstrap/initState";
import { DatabaseData } from "../core/types";

async function seedDatabase() {
  const state = await initState(ENV.DATA_PATH);

  const dbName = APP_CONSTANTS.DATABASE.DEFAULT_DB;

  let db: DatabaseData | null = null;

  if (!state.databases.has(dbName)) {
    console.log(`Creating default database: ${dbName}`);
    await DatabasesService.create(state, { name: dbName });
  }

  db = await DatabasesService.getByName(state, dbName);

  if (!db) return;

  const seedSQL = [
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description VARCHAR(500),
      completed BOOLEAN NOT NULL,
      created_at VARCHAR(50) NOT NULL
    );
    `,
    `
    INSERT INTO tasks (title, description, completed, created_at)
    VALUES (
      'Complete RDBMS challenge',
      'Implement a relational database from scratch with functional architecture',
      false,
      '${new Date().toISOString()}'
    );
    `,
    `
    INSERT INTO tasks (title, description, completed, created_at)
    VALUES (
      'Refactor to modular structure',
      'Organize code into modules with DTOs, services, controllers, and routes',
      true,
      '${new Date().toISOString()}'
    );
    `,
  ];

  for (const sql of seedSQL) {
    const result = executeSQL(db, state.databases, sql);
    console.log("result: " , result);
  }

  await DatabasesService.save(state, dbName);
  console.log("Database seeded successfully!");
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { seedDatabase };
