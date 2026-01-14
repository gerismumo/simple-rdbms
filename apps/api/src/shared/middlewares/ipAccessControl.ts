import { Request, Response, NextFunction } from "express";
import { getClientIP, getClientRegion } from "../utils/ip-utils";
import { ENV } from "../config/env";

//controls user ip and  region
export function ipAccessControl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = getClientIP(req);
  const region = getClientRegion(req);

  (req as any).clientIp = ip;
  (req as any).clientRegion = region;

  if (ENV.NODE_ENV === "production") {
    const isPrivateIP =
      ip === "127.0.0.1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.");

    if (isPrivateIP) {
      return res.fail("Access denied from local/private IP", 403);
    }
  }

  next();
}
