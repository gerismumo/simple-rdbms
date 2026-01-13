import { ApiResponse } from "../responses/apiResponse";

declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, message?: string, statusCode?: number): void;

      fail(message: string, statusCode?: number): void;
    }
  }
}

export {};
