import { getTable } from "./database";
import { addIndex } from "./table";
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