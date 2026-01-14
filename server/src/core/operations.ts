import { getTable } from "./database";
import { addIndex, deleteRows, insertRow, selectRows, updateRows } from "./table";
import { DatabaseData } from "./types";

export function createIndexOn(
  db: DatabaseData,
  tableName: string,
  columnName: string,
  unique: boolean
): void {
  const table = getTable(db, tableName);
  addIndex(table, columnName, unique);
}

export function insert(
  db: DatabaseData,
  tableName: string,
  row: Record<string, any>
): void {
  const table = getTable(db, tableName);
  insertRow(table, row);
}

export function select(
  db: DatabaseData,
  tableName: string,
  conditions?: Record<string, any>
): Record<string, any>[] {
  const table = getTable(db, tableName);
  return selectRows(table, conditions);
}


export function update(
  db: DatabaseData,
  tableName: string,
  conditions: Record<string, any>,
  updates: Record<string, any>
): number {
  const table = getTable(db, tableName);
  return updateRows(table, conditions, updates);
}

export function deleteFrom(
  db: DatabaseData,
  tableName: string,
  conditions: Record<string, any>
): number {
  const table = getTable(db, tableName);
  return deleteRows(table, conditions);
}