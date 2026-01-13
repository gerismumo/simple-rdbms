import { ENV } from "../config/env";

export const files = {
  logo: ENV.NODE_ENV === "production" ?`${ENV.BASE_URL}/logo.jpg`: "https://greenfieldestates.co.ke/new-logo.png",
} as const;
