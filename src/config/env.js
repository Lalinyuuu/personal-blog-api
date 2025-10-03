import "dotenv/config";
export const config = {
  dbUrl: process.env.DATABASE_URL,
};
if (!config.dbUrl) throw new Error("DATABASE_URL is missing");