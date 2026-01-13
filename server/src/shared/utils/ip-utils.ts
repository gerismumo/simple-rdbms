import { Request } from "express";

export function getClientIP(req: Request): string {
  const cfIP = req.headers["cf-connecting-ip"];
  const realIP = req.headers["x-real-ip"];
  const forwardedFor = req.headers["x-forwarded-for"];

  return (
    (Array.isArray(cfIP) ? cfIP[0] : cfIP) ||
    (Array.isArray(realIP) ? realIP[0] : realIP) ||
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]) ||
    req.socket.remoteAddress ||
    "127.0.0.1"
  );
}

export function getClientRegion(req: Request): string {
  const country = req.headers["cf-ipcountry"];
  return typeof country === "string" ? country : "Unknown";
}
