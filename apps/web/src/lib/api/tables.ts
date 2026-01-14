import { CreateTableDto, Table, TableSchema } from "../../types/api";
import { apiClient } from "../api-client";

export const tablesApi = {
  getAll: () => apiClient.get<Table[]>("/tables"),

  create: (data: CreateTableDto) =>
    apiClient.post<{ name: string; columns: number }>("/tables", data),

  getSchema: (name: string) =>
    apiClient.get<TableSchema>(`/tables/${name}/schema`),

  drop: (name: string) => apiClient.delete(`/tables/${name}`),
};
