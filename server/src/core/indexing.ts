import { ColumnDefinition, Index, Row } from "./types";

//create unique and primary index
export function createIndex(columnName: string, unique: boolean): Index {
  return {
    columnName,
    unique,
    values: new Map(),
  };
}

export function buildIndexFromRows(index: Index, rows: Row[]): void {
  rows.forEach((row, idx) => {
    const value = row[index.columnName];
    if (value !== undefined && value !== null) {
      if (!index.values.has(value)) {
        index.values.set(value, []);
      }
      index.values.get(value)!.push(idx);
    }
  });
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
