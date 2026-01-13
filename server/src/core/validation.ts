import { ColumnDefinition, DataType, Row } from "./types";

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
