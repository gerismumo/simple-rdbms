import useSWR from "swr";
import { useAppStore } from "../../store/useAppStore";
import { tablesApi } from "../api/tables";
import { Table } from "../../types/api";

const fetchTables = async (database: string): Promise<Table[]> => {
  const response = await tablesApi.getAll(database);

  if (!response.success) {
    throw new Error(response.message || "Failed to load tables");
  }

  return response.data as Table[];
};

export const useTables = () => {
  const { currentDatabase } = useAppStore();

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Table[], Error>(
    currentDatabase ? ["tables", currentDatabase] : null,
    () => fetchTables(currentDatabase as string),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data ? data : [],        
    error,       
    isLoading,   
    mutate,
  };
};
