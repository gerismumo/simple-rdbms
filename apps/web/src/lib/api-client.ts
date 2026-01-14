import axios, { AxiosError, AxiosInstance } from "axios";
import { ApiResponse } from "../types/api";

const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      error: error.message || "Network error",
      statusCode: error.response?.status || 500,
    } as ApiResponse);
  }
);

export const apiClient = {
  get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    const response = await client.get<ApiResponse<T>>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await client.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await client.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await client.delete<ApiResponse<T>>(url);
    return response.data;
  },
};
