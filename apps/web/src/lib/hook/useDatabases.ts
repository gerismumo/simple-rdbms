"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import { databasesApi } from "../api/databases";
import { useAppStore } from "../../store/useAppStore";

const fetchDatabases = async () => {
  const response = await databasesApi.getAll();
  console.log("response", response)
  if (!response.success) {
    throw new Error(response.message || "Failed to load databases");
  }
  return response.data;
};

export function useDatabases() {
  const {
    databases,
    setDatabases,
    currentDatabase,
    setCurrentDatabase,
    loading,
    setLoading,
  } = useAppStore();

  const { data, error, isLoading, mutate } = useSWR(
    "databases",
    fetchDatabases,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    setDatabases(data);
    
  }

//   if (error) {
//     toast.error(error.message || "Failed to load databases");

//   }

  return {
    databases,
    currentDatabase,
    setCurrentDatabase,
    loading: isLoading || loading.databases,
    refreshDatabases: mutate,
  };
}
