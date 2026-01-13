import { buildIndexFromRows, createAutoIndexes, createIndex } from "./indexing";
import { TableData, TableSchema } from "./types";

export function createTable(schema: TableSchema): TableData {
  return {
    schema,
    rows: [],
    indexes: createAutoIndexes(schema.columns),
    nextId: 1,
  };
}

export function addIndex(
  tableData: TableData,
  columnName: string,
  unique: boolean
): void {
  if (tableData.indexes.has(columnName)) {
    throw new Error(`Index already exists on column ${columnName}`);
  }

  const index = createIndex(columnName, unique);
  buildIndexFromRows(index, tableData.rows);
  tableData.indexes.set(columnName, index);
}
