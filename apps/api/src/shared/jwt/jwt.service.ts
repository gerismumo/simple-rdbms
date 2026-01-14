import jwt from "jsonwebtoken";
import { createHttpError } from "../error/HttpError";
import logger from "../logger/logger";
import { ENV } from "../config/env";

const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
}

export const JwtService = {
  signAccessToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
    } catch (error) {
      throw createHttpError(500, "Internal server error", {
        context: "JwtService.signAccessToken",
        message: "Failed to generate access token",
      });
    }
  },

  signRefreshToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
    } catch (error) {
      throw createHttpError(500, "Internal server error", {
        context: "JwtService.signRefreshToken",
        message: "Failed to generate refresh token",
      });
    }
  },

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw createHttpError(401, "Access token expired", {
          context: "JwtService.verifyAccessToken",
          message: "User attempted to use an expired access token",
        });
      }
      throw createHttpError(401, "Invalid access token", {
        context: "JwtService.verifyAccessToken",
        message: "Access token verification failed",
      });
    }
  },

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw createHttpError(401, "Refresh token expired", {
          context: "JwtService.verifyRefreshToken",
          message: "User attempted to use an expired refresh token",
        });
      }
      throw createHttpError(401, "Invalid refresh token", {
        context: "JwtService.verifyRefreshToken",
        message: "Refresh token verification failed",
      });
    }
  },

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      logger.error("Failed to decode token:", error);
      throw createHttpError(500, "Internal server error", {
        context: "JwtService.decodeToken",
        message: "Unable to decode provided token",
      });
    }
  },
};
