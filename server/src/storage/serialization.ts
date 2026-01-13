import { createDatabase, createTable } from "../core/database";
import { insertRow } from "../core/table";
import { DatabaseData, TableData } from "../core/types";

export interface SerializedDatabase {
  version: string;
  savedAt: string;
  name: string;
  tables: Record<string, SerializedTable>;
}

export interface SerializedTable {
  schema: any;
  rows: any[];
  indexes: string[];
}

export function serializeDatabase(db: DatabaseData): SerializedDatabase {
  const serialized: SerializedDatabase = {
    version: "1.0",
    savedAt: new Date().toISOString(),
    name: db.name,
    tables: {},
  };

  db.tables.forEach((tableData, tableName) => {
    serialized.tables[tableName] = serializeTable(tableData);
  });

  return serialized;
}

function serializeTable(tableData: TableData): SerializedTable {
  return {
    schema: tableData.schema,
    rows: tableData.rows,
    indexes: Array.from(tableData.indexes.keys()),
  };
}

export function deserializeDatabase(data: SerializedDatabase): DatabaseData {
  const db = createDatabase(data.name);

  Object.entries(data.tables).forEach(([tableName, tableData]) => {
    deserializeTable(db, tableName, tableData);
  });

  return db;
}

function deserializeTable(
  db: DatabaseData,
  tableName: string,
  tableData: SerializedTable
): void {
  createTable(db, tableData.schema);

  const table = db.tables.get(tableName)!;

  tableData.rows.forEach((row: any) => {
    insertRow(table, row);
  });

  const { addIndex } = require("../core/table");
  tableData.indexes.forEach((indexName: string) => {
    const col = table.schema.columns.find((c) => c.name === indexName);
    if (col && !col.primaryKey && !col.unique) {
      addIndex(table, indexName, false);
    }
  });
}
