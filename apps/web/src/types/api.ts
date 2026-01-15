export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface Database {
  name: string;
  tables: number;
}

export interface Table {
  name: string;
}

export interface TableSchema {
  name: string;
  columns: Column[];
  rowCount: number;
}

export interface TableRows {
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
}

export interface Column {
  name: string;
  type: string;
  nullable: string;
  key: string;
}

export interface CreateTableDto {
  name: string;
  columns: ColumnDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: "INTEGER" | "VARCHAR" | "BOOLEAN" | "FLOAT";
  primaryKey?: boolean;
  unique?: boolean;
  nullable?: boolean;
  maxLength?: number;
}

export interface QueryResult {
  rows?: any[];
  rowCount?: number;
}

export interface TableRowsResponse {
  columns: Column[];
  rows: Record<string, any>[];
}
