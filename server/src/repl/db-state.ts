import { createDatabase } from "../core/database";
import { DatabaseData } from "../core/types";

export interface REPLState {
  databases: Map<string, DatabaseData>;
  currentDb: DatabaseData | null;
  basePath: string;
}

export function createREPLState(basePath: string): REPLState {
  return {
    databases: new Map(),
    currentDb: null,
    basePath,
  };
}

export function createNewDatabase(state: REPLState, name: string): void {
  if (state.databases.has(name)) {
    throw new Error(`Database ${name} already exists`);
  }

  const db = createDatabase(name);
  state.databases.set(name, db);
  console.log("db", db)
  console.log("basePath", state.basePath)
//   saveDatabase(db, state.basePath);
  console.log(`Database '${name}' created`);
}
