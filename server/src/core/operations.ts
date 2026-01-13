import { getTable } from "./database";
import { addIndex, insertRow } from "./table";
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
