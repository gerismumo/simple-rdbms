import { Database } from "../../types/api";
import { apiClient } from "../api-client";

export const databasesApi = {
  getAll: () => apiClient.get<Database[]>("/databases"),

  create: (name: string) => apiClient.post<Database>("/databases", { name }),

  getByName: (name: string) =>
    apiClient.get<{ name: string; tables: string[] }>(`/databases/${name}`),

  switchTo: (name: string) =>
    apiClient.post<{ name: string }>("/databases/use", { name }),

  delete: (name: string) => apiClient.delete(`/databases/${name}`),
};
