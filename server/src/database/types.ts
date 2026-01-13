export enum DataType {
  INTEGER = 'INTEGER',
  VARCHAR = 'VARCHAR',
  BOOLEAN = 'BOOLEAN',
  FLOAT = 'FLOAT',
  TEXT= 'TEXT'
}

export interface ColumnDefinition {
  name: string;
  type: DataType;
  primaryKey?: boolean;
  unique?: boolean;
  nullable?: boolean;
  maxLength?: number;
}

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
}

export type Row = Record<string, any>;

export interface Index {
  columnName: string;
  unique: boolean;
  values: Map<any, number[]>;
}

export interface QueryResult {
  success: boolean;
  message?: string;
  rows?: Row[];
  rowCount?: number;
}