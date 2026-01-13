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