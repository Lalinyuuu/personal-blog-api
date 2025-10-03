import "dotenv/config";

export const config = {
  dbUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV ?? "development",
};

if (!config.dbUrl) {
  throw new Error("DATABASE_URL is missing");
}