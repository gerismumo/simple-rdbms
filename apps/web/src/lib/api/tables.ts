import { CreateTableDto, Table, TableRows, TableSchema } from "../../types/api";
import { apiClient } from "../api-client";

export const tablesApi = {
  getAll: (db: string) => apiClient.get<Table[]>(`/tables/${db}`),

  create: ({data, db}:{data: CreateTableDto, db: string}) =>
    apiClient.post<{ name: string; columns: number }>(`/tables/${db}`, data),

  getSchema: ({name, db}:{name: string; db: string}) =>
    apiClient.get<TableSchema>(`/tables/${db}/${name}/schema`),

  getRows: ({name, db}:{name: string; db: string}) =>
    apiClient.get<TableRows>(`/tables/${db}/${name}/rows`),

  drop: ({name, db}:{name: string, db: string}) => apiClient.delete(`/tables/${db}/${name}`),
};
