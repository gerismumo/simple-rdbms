import { createHttpError } from "./HttpError";

export function handleRepositoryError(error: unknown, context: string): never {
  throw createHttpError(500, "Internal Server Error", {
    context,
    message: error instanceof Error ? error.message : String(error),
  });
}
