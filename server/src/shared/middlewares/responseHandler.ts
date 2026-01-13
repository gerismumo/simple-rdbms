import { Response, Request, NextFunction } from "express";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../responses/apiResponse";

export function responseHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function <T>(data: T, message = "ok", statusCode = 200) {
    return res
      .status(statusCode)
      .json(createSuccessResponse(data, message, statusCode));
  };

  res.fail = function (message: string, statusCode = 400) {
    return res
      .status(statusCode)
      .json(createErrorResponse({ message, statusCode }));
  };

  next();
}
