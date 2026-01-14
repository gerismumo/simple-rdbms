import {
  buildIndexFromRows,
  createAutoIndexes,
  createIndex,
  updateIndexOnInsert,
} from "./indexing";
import { Row, TableData, TableSchema } from "./types";
import {
  checkUniqueContraintsVal,
  matchesConditions,
  normalizeConditions,
  validateRow,
} from "./validation";

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

export function insertRow(tableData: TableData, row: Row): void {
  validateRow(row, tableData.schema.columns, true);
  checkUniqueContraintsVal(row, tableData.rows, tableData.schema.columns);

  const primaryKeyCol = tableData.schema.columns.find((c) => c.primaryKey);

  if (primaryKeyCol && row[primaryKeyCol.name] === undefined) {
    row[primaryKeyCol.name] = tableData.nextId++;
  }

  const rowIndex = tableData.rows.length;

  tableData.rows.push({ ...row });

  updateIndexOnInsert(tableData.indexes, row, rowIndex);
}

//select

export function selectRows(
  tableData: TableData,
  conditions?: Record<string, any>
): Row[] {
  if (!conditions || Object.keys(conditions).length === 0) {
    return [...tableData.rows];
  }

  const normalizedConditions = normalizeConditions(
    conditions,
    tableData.schema
  );

  const conditionKeys = Object.keys(normalizedConditions);
  for (const key of conditionKeys) {
    const index = tableData.indexes.get(key);
    if (index) {
      const indices = index.values.get(normalizedConditions[key]) || [];

      const results = indices.map((idx) => tableData.rows[idx]);
      return results.filter((row) =>
        matchesConditions(row, normalizedConditions)
      );
    }
  }

  return tableData.rows.filter((row) =>
    matchesConditions(row, normalizedConditions)
  );
}
