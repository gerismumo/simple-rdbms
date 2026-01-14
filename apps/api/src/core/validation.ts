import { ColumnDefinition, DataType, Row, TableSchema } from "./types";

export function validateRow(
  row: Row,
  columns: ColumnDefinition[],
  isInsert: boolean
): void {
  columns.forEach((col) => {
    const value = row[col.name];

    if (value === undefined || value === null) {
      if (col.nullable === false && !col.primaryKey) {
        throw new Error(`Column ${col.name} cannot be null`);
      }
      return;
    }

    //intro switch cas e here

    switch (col.type) {
      case DataType.INTEGER:
        if (!Number.isInteger(value)) {
          throw new Error(`Column ${col.name} must be an integer`);
        }
        break;
      case DataType.FLOAT:
        if (typeof value !== "number") {
          throw new Error(`Column ${col.name} must be a number`);
        }
        break;
      case DataType.VARCHAR:
        if (typeof value !== "string") {
          throw new Error(`Column ${col.name} must be a string`);
        }
        if (col.maxLength && value.length > col.maxLength) {
          throw new Error(
            `Column ${col.name} exceeds max length of ${col.maxLength}`
          );
        }
        break;
      case DataType.BOOLEAN:
        if (typeof value !== "boolean") {
          throw new Error(`Column ${col.name} must be a boolean`);
        }
        break;
    }
  });
}

export function checkUniqueContraintsVal(
  row: Row,
  rows: Row[],
  columns: ColumnDefinition[],
  excludeIndex?: number
): void {
  columns.forEach((col) => {
    if (col.unique || col.primaryKey) {
      const value = row[col.name];

      const existingRow = rows.findIndex(
        (r, idx) => r[col.name] === value && idx !== excludeIndex
      );

      if (existingRow !== -1) {
        throw new Error(`Duplicate value for unique column ${col.name}`);
      }
    }
  });
}

//match val
export function matchesConditions(
  row: Row,
  conditions: Record<string, any>
): boolean {
  return Object.entries(conditions).every(([key, value]) => row[key] === value);
}

export function normalizeConditions(
  conditions: Record<string, any>,
  schema: TableSchema
): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const key in conditions) {
    const column = schema.columns.find((col) => col.name === key);

    if (!column) {
      normalized[key] = conditions[key];
      continue;
    }

    normalized[key] = formatValueByType(conditions[key], column.type);
  }

  return normalized;
}

function formatValueByType(value: any, type: DataType) {
  if (value === null || value === undefined) return value;

  switch (type) {
    case DataType.INTEGER:
      return Number.parseInt(value, 10);

    case DataType.FLOAT:
      return Number.parseFloat(value);

    case DataType.BOOLEAN:
      if (typeof value === "boolean") return value;
      return value === "true" || value === "1";

    case DataType.VARCHAR:
      return String(value);

    default:
      return value;
  }
}
