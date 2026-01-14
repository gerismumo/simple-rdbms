import { DatabaseData } from "../../core/types";

export interface DatabaseServiceState {
  databases: Map<string, DatabaseData>;
  basePath: string;
}