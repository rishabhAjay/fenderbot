import { configDotenv } from "dotenv";

configDotenv();
interface Env {
  CLIENT_TOKEN: string;
  CLIENT_ID: string;
  DATABASE_URL: string;
  ENCRYPTION_KEY: string;
  NODE_ENV: string;
  SUPER_ADMIN: string;
  SERVER_INVITE_LINK: string;
  SUPPORT_SERVER_REPORT_CHANNEL_ID: string;
  SUPPORT_SERVER_ID: string;
  BOT_NAME: string;
}

export const env: Env = {
  CLIENT_TOKEN: process.env.CLIENT_TOKEN || "",
  CLIENT_ID: process.env.CLIENT_ID || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  SUPER_ADMIN: process.env.SUPER_ADMIN || "",
  SERVER_INVITE_LINK: process.env.SERVER_INVITE_LINK || "",
  SUPPORT_SERVER_ID: process.env.SUPPORT_SERVER_ID || "",
  SUPPORT_SERVER_REPORT_CHANNEL_ID:
    process.env.SUPPORT_SERVER_REPORT_CHANNEL_ID || "",
  BOT_NAME: process.env.BOT_NAME || "",
};
