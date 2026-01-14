import { createTable, dropTable } from "../../core/database";
import {
  ColumnDefinition,
  DatabaseData,
  DataType,
  QueryResult,
} from "../../core/types";

export function parseCreateDatabase(sql: string): { dbName: string } {
  const match = sql.match(/CREATE DATABASE\s+(\w+)/i);
  if (!match) {
    throw new Error("Invalid CREATE DATABASE syntax");
  }
  return { dbName: match[1] };
}

export function parseUseDatabase(sql: string): { dbName: string } {
  const match = sql.match(/USE\s+(\w+)/i);
  if (!match) {
    throw new Error("Invalid USE syntax");
  }
  return { dbName: match[1] };
}

export function executeCreateTable(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(/CREATE TABLE\s+(\w+)\s*\((.*)\)/i);
  if (!match) {
    throw new Error("Invalid CREATE TABLE syntax");
  }

  const tableName = match[1];
  const columnDefs = match[2].split(",").map((def) => def.trim());

  const columns: ColumnDefinition[] = columnDefs.map((def) => {
    const parts = def.split(/\s+/);
    const name = parts[0];
    let type = parts[1].toUpperCase();

    let maxLength: number | undefined;
    const varcharMatch = type.match(/VARCHAR\((\d+)\)/);
    if (varcharMatch) {
      maxLength = parseInt(varcharMatch[1]);
      type = "VARCHAR";
    }

    const isPrimaryKey = def.toUpperCase().includes("PRIMARY KEY");
    const isUnique = def.toUpperCase().includes("UNIQUE");
    const isNullable = !def.toUpperCase().includes("NOT NULL") && !isPrimaryKey;

    return {
      name,
      type: type as DataType,
      primaryKey: isPrimaryKey,
      unique: isUnique,
      nullable: isNullable,
      maxLength,
    };
  });

  createTable(db, { name: tableName, columns });

  return {
    success: true,
    message: `Table ${tableName} created successfully in database ${db.name}`,
  };
}

export function executeDropTable(db: DatabaseData, sql: string): QueryResult {
  const match = sql.match(/DROP TABLE\s+(\w+)/i);
  if (!match) {
    throw new Error("Invalid DROP TABLE syntax");
  }

  const tableName = match[1];

  dropTable(db, tableName);

  return {
    success: true,
    message: `Table ${tableName} dropped successfully`,
  };
}
