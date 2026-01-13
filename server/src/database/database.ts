import { DatabaseData, TableSchema } from "./types";
import { createTable as createTableHelper } from "./table";

export function createDatabase(name: string): DatabaseData {
  return {
    name,
    tables: new Map(),
  };
}

export function createTable(db: DatabaseData, schema: TableSchema): void {
  if (db.tables.has(schema.name)) {
    throw new Error(`Table ${schema.name} already exists`);
  }

  const primaryKeys = schema.columns.filter((c) => c.primaryKey);
  if (primaryKeys.length > 1) {
    throw new Error("Only one primary key column is allowed");
  }

  db.tables.set(schema.name, createTableHelper(schema));
}
