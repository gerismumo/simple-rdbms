import {
  createTable,
  getTable,
  listTables,
  dropTable,
} from "../../core/database";
import { DatabaseData } from "../../core/types";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabasesService } from "../databases/databases.service";
import { CreateTableDto } from "./dto/create-table.dto";

export const TablesService = {
  async create(
    db: DatabaseData,
    state: DatabaseServiceState,
    dto: CreateTableDto
  ): Promise<{ name: string; columns: number }> {
    createTable(db, {
      name: dto.name,
      columns: dto.columns as any,
    });

    await DatabasesService.save(state, db.name);

    return {
      name: dto.name,
      columns: dto.columns.length,
    };
  },

  async getAll(db: DatabaseData): Promise<Array<{ name: string }>> {
    const tables = listTables(db);
    return tables.map((name) => ({ name }));
  },

  async getRows(db: DatabaseData, tableName: string): Promise<any> {
    const table = getTable(db, tableName);

    return {
      name: table.schema.name,
      columns: table.schema.columns.map((col) => ({
        name: col.name,
        type: col.type + (col.maxLength ? `(${col.maxLength})` : ""),
        nullable: col.nullable ? "YES" : "NO",
        key: col.primaryKey ? "PRI" : col.unique ? "UNI" : "",
      })),
      rows: table.rows,
    };
  },

  async getSchema(db: DatabaseData, tableName: string): Promise<any> {
    const table = getTable(db, tableName);

    return {
      name: table.schema.name,
      columns: table.schema.columns.map((col) => ({
        name: col.name,
        type: col.type + (col.maxLength ? `(${col.maxLength})` : ""),
        nullable: col.nullable ? "YES" : "NO",
        key: col.primaryKey ? "PRI" : col.unique ? "UNI" : "",
      })),
      rowCount: table.rows.length,
    };
  },

  async drop(
    db: DatabaseData,
    state: DatabaseServiceState,
    tableName: string
  ): Promise<void> {
    dropTable(db, tableName);
    await DatabasesService.save(state, db.name);
  },
};
