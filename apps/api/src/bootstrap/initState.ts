import { initStorage } from "../storage/persistence";
import { DatabaseServiceState } from "../shared/types/database";
import { DatabaseData } from "../core/types";
import { DatabasesService } from "../modules/databases/databases.service";

export async function initState(
  dataPath: string
): Promise<DatabaseServiceState> {
  initStorage(dataPath);

  const state: DatabaseServiceState = {
    databases: new Map<string, DatabaseData>(),
    basePath: dataPath,
  };

  await DatabasesService.loadAll(state);
  return state;
}
