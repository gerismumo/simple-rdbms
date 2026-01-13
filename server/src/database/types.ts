export enum DataType {
  INTEGER = 'INTEGER',
  VARCHAR = 'VARCHAR',
  BOOLEAN = 'BOOLEAN',
  FLOAT = 'FLOAT'
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

export interface TableData {
  schema: TableSchema;
  rows: Row[];
  indexes: Map<string, Index>;
  nextId: number;
}

export interface DatabaseData {
  name: string;
  tables: Map<string, TableData>;
}