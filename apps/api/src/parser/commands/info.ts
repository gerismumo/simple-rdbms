import { getTable, listTables } from "../../core/database";
import { DatabaseData, QueryResult } from "../../core/types";

export function executeShowDatabases(
  databases: Map<string, DatabaseData>
): QueryResult {
  const rows = Array.from(databases.keys()).map((name) => ({
    database_name: name,
  }));

  return {
    success: true,
    rows,
    rowCount: rows.length,
  };
}

export function executeShowTables(db: DatabaseData): QueryResult {
  const tables = listTables(db);
  const rows = tables.map((name) => ({ table_name: name }));

  return {
    success: true,
    rows,
    rowCount: rows.length,
  };
}


export function executeDescribe(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(/DESCRIBE\s+(\w+)/i);
  if (!match) {
    throw new Error('Invalid DESCRIBE syntax');
  }

  const tableName = match[1];
  const table = getTable(db, tableName);

  const rows = table.schema.columns.map(col => ({
    column: col.name,
    type: col.type + (col.maxLength ? `(${col.maxLength})` : ''),
    nullable: col.nullable ? 'YES' : 'NO',
    key: col.primaryKey ? 'PRI' : col.unique ? 'UNI' : ''
  }));

  return {
    success: true,
    rows,
    rowCount: rows.length
  };
}
