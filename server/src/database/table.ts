import {
  ColumnDefinition,
  Index,
  TableData,
  TableSchema,
} from "./types";

//create unique and primary index
export function createIndex(columnName: string, unique: boolean): Index {
  return {
    columnName,
    unique,
    values: new Map(),
  };
}

export function createAutoIndexes(
  columns: ColumnDefinition[]
): Map<string, Index> {
  const indexes = new Map<string, Index>();

  columns.forEach((col) => {
    if (col.primaryKey || col.unique) {
      indexes.set(col.name, createIndex(col.name, true));
    }
  });

  return indexes;
}

export function createTable(schema: TableSchema): TableData {
  return {
    schema,
    rows: [],
    indexes: createAutoIndexes(schema.columns),
    nextId: 1,
  };
}
