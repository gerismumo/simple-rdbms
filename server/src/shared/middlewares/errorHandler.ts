import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";
import { ZodError } from "zod";
import { HttpErrorShape } from "../error/HttpError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let status = (err as HttpErrorShape).statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details = (err as HttpErrorShape).details;

  if (err instanceof ZodError) {
    status = 400;
    message = err.issues
      .map(
        (i) => `${i.message}${i.path.length ? ` (${i.path.join(".")})` : ""}`
      )
      .join(", ");

    details = {
      context: "validation error",
      message,
    };
  }

  if (status >= 500) {
    logger.error(err, {
      context: "GlobalErrorHandler",
      details,
    });
  } else {
    logger.warn(message, {
      status,
      details,
    });
  }

  return res.fail(message, status);
}
