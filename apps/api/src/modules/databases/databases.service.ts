import { createDatabase } from "../../core/database";
import { DatabaseData } from "../../core/types";
import { DatabaseServiceState } from "../../shared/types/database";
import {
  saveDatabase,
  loadDatabase,
  listAllDatabases,
} from "../../storage/persistence";
import { CreateDatabaseDto } from "./dto/create-database.dto";


export const DatabasesService = {
  async create(
    state: DatabaseServiceState,
    dto: CreateDatabaseDto
  ): Promise<DatabaseData> {
    if (state.databases.has(dto.name)) {
      const error = new Error(`Database ${dto.name} already exists`);
      (error as any).statusCode = 409;
      throw error;
    }

    const db = createDatabase(dto.name);
    state.databases.set(dto.name, db);
    saveDatabase(db, state.basePath);

    return db;
  },


  async getAll(state: DatabaseServiceState): Promise<
    Array<{
      name: string;
      tables: number;
      created_at?: string;
    }>
  > {
    return Array.from(state.databases.entries()).map(([name, db]) => ({
      name,
      tables: db.tables.size,
    }));
  },

  async getByName(
    state: DatabaseServiceState,
    name: string
  ): Promise<DatabaseData> {
    const db = state.databases.get(name);

    if (!db) {
      const error = new Error(`Database ${name} not found`);
      (error as any).statusCode = 404;
      throw error;
    }

    return db;
  },


  async switchTo(
    state: DatabaseServiceState,
    name: string
  ): Promise<DatabaseData> {
    const db = await this.getByName(state, name);
    return db;
  },


  async delete(state: DatabaseServiceState, name: string): Promise<void> {
    const db = await this.getByName(state, name);
    state.databases.delete(name);

    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(state.basePath, `${name}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },


  async loadAll(state: DatabaseServiceState): Promise<void> {
    const dbNames = listAllDatabases(state.basePath);

    dbNames.forEach((name) => {
      const db = loadDatabase(name, state.basePath);
      if (db) {
        state.databases.set(name, db);
      }
    });
  },


  async save(state: DatabaseServiceState, dbName: string): Promise<void> {
    const db = state.databases.get(dbName);
    if (db) {
      saveDatabase(db, state.basePath);
    }
  },
};
