import bcrypt from "bcryptjs";
import { createHttpError } from "../error/HttpError";
import { HttpErrorShape } from "../error/HttpError";

interface ComparePasswordInput {
  password: string;
  passwordHash: string;
}

export async function comparePassword({
  password,
  passwordHash,
}: ComparePasswordInput): Promise<void> {
  try {
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw createHttpError(401, "Invalid credentials", {
        context: "AuthService.loginUser",
        message: "Password does not match for given user",
      });
    }
  } catch (error) {
    if ((error as HttpErrorShape)?.statusCode) {
      throw error;
    }

    throw createHttpError(500, "Internal Server Error", {
      context: "comparePassword",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw createHttpError(500, "Internal Server Error", {
      context: "AuthService.hashPassword",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}