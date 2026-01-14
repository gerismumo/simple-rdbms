import { QueryResult } from "../../types/api";
import { apiClient } from "../api-client";

export const queriesApi = {
  execute: (sql: string, database?: string) =>
    apiClient.post<QueryResult>("/query", { sql, database }),
};
