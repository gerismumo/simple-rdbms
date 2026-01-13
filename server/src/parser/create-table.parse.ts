import { DataType } from "../database/types";

export function parseCreateTable(sql: string) {
  const match = sql.match(/CREATE TABLE\s+(\w+)\s*\((.*)\)/i);
  if (!match) {
    throw new Error("Invalid CREATE TABLE syntax");
  }

  const tableName = match[1];
  const columnNamesData = match[2].split(",").map((n) => n.trim());

  const columns = columnNamesData.map((d) => {
    const parts = d.split(/\s+/);

    const name = parts[0];
    let type = parts[1].toUpperCase();

    let maxLength: number | undefined;
    const varcharMatch = type.match(/VARCHAR\((\d+)\)/);
    if (varcharMatch) {
      maxLength = parseInt(varcharMatch[1]);
      type = "VARCHAR";
    }

    const isPrimaryKey = d.toUpperCase().includes("PRIMARY KEY");
    const isUnique = d.toUpperCase().includes("UNIQUE");
    const isNullable = !d.toUpperCase().includes("NOT NULL") && !isPrimaryKey;

    return {
      name,
      type: type as DataType,
      primaryKey: isPrimaryKey,
      unique: isUnique,
      nullable: isNullable,
      maxLength,
    };
  });

  console.log("table", tableName);
  console.log("columns", columns);
}
