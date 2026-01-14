import { DatabaseData, QueryResult } from "../../core/types";
import { executeSQL } from "../../parser";
import { DatabaseServiceState } from "../../shared/types/database";
import { DatabasesService } from "../databases/databases.service";
import { ExecuteQueryDto } from "./dto/execute-query.dto";

export const QueriesService = {
  async execute(
    state: DatabaseServiceState,
    currentDb: DatabaseData | null,
    dto: ExecuteQueryDto
  ): Promise<QueryResult> {
    let targetDb = currentDb;

    if (dto.database) {
      targetDb = await DatabasesService.getByName(state, dto.database);
    }


    const result = executeSQL(targetDb, state.databases, dto.sql);

    // Auto-save
    if (result.success && targetDb) {
      const upperSQL = dto.sql.toUpperCase();
      if (
        upperSQL.includes('INSERT') ||
        upperSQL.includes('UPDATE') ||
        upperSQL.includes('DELETE') ||
        upperSQL.includes('CREATE TABLE') ||
        upperSQL.includes('DROP TABLE')
      ) {
        await DatabasesService.save(state, targetDb.name);
      }
    }

    return result;
  },
};