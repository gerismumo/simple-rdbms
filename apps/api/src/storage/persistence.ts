import * as path from "path";

import {
  existsDirectory,
  listFiles,
  loadFromFile,
  saveToFile,
} from "./fileOperations";
import { DatabaseData } from "../core/types";
import { deserializeDatabase, serializeDatabase } from "./serialization";

export function initStorage(basePath: string): void {
  existsDirectory(basePath);
  existsDirectory(path.join(basePath, "backups"));
}

export function listAllDatabases(basePath: string): string[] {
  const pattern = /^(.+)\.json$/;
  const files = listFiles(basePath, pattern);

  return files
    .map((f) => f.replace(".json", ""))
    .filter((name) => name !== "backups");
}

export function saveDatabase(db: DatabaseData, basePath: string): void {
  const serialized = serializeDatabase(db);

  const filePath = path.join(basePath, `${db.name}.json`);

  saveToFile(filePath, serialized);
}

export function loadDatabase(
  dbName: string,
  basePath: string
): DatabaseData | null {
  const filePath = path.join(basePath, `${dbName}.json`);
  const data = loadFromFile(filePath);

  if (!data) {
    return null;
  }

  return deserializeDatabase(data);
}
