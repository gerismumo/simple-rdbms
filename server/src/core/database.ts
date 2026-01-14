import { DatabaseData, Row, TableData, TableSchema } from "./types";
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

//get table
export function getTable(db: DatabaseData, tableName: string): TableData {
  const table = db.tables.get(tableName);
  if (!table) {
    throw new Error(`Table ${tableName} does not exist`);
  }

  return table;
}

export function listTables(db: DatabaseData): string[] {
  return Array.from(db.tables.keys());
}

export function innerJoin(
  db: DatabaseData,
  leftTable: string,
  rightTable: string,
  leftColumn: string,
  rightColumn: string,
  selectColumns?: string[]
): Row[] {
  const left = getTable(db, leftTable);
  const right = getTable(db, rightTable);
  const results: Row[] = [];

  left.rows.forEach((leftRow) => {
    right.rows.forEach((rightRow) => {
      if (leftRow[leftColumn] === rightRow[rightColumn]) {
        const joinedRow: Row = {};

        if (selectColumns) {
          selectColumns.forEach((col) => {
            if (col.includes(".")) {
              const [table, column] = col.split(".");
              const sourceRow = table === leftTable ? leftRow : rightRow;
              joinedRow[col] = sourceRow[column];
            } else {
              joinedRow[col] = leftRow[col] ?? rightRow[col];
            }
          });
        } else {
          Object.entries(leftRow).forEach(([key, value]) => {
            joinedRow[`${leftTable}.${key}`] = value;
          });
          Object.entries(rightRow).forEach(([key, value]) => {
            joinedRow[`${rightTable}.${key}`] = value;
          });
        }

        results.push(joinedRow);
      }
    });
  });

  return results;
}
