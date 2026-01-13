import { createDatabase } from "../core/database";
import { DatabaseData } from "../core/types";
import { listAllDatabases, loadDatabase, saveDatabase } from "../storage/persistence";

export interface REPLState {
  databases: Map<string, DatabaseData>;
  currentDb: DatabaseData | null;
  basePath: string;
}

export function loadExistingDatabases(state: REPLState): void {
  const dbNames = listAllDatabases(state.basePath);

  console.log("dbNames", dbNames)
  
  dbNames.forEach(name => {
    const db = loadDatabase(name, state.basePath);
    if (db) {
      state.databases.set(name, db);
    }
  });

  if (dbNames.length > 0) {
    console.log(`\n Loaded ${dbNames.length} existing database(s): ${dbNames.join(', ')}`);
  }
}

export function createREPLState(basePath: string): REPLState {
  return {
    databases: new Map(),
    currentDb: null,
    basePath,
  };
}

export function createNewDatabase(state: REPLState, name: string): void {
    console.log('state.databases', state.databases)
  if (state.databases.has(name)) {
    throw new Error(`Database ${name} already exists`);
  }

  const db = createDatabase(name);
  state.databases.set(name, db);
  saveDatabase(db, state.basePath);
  console.log(`Database '${name}' created`);
}
