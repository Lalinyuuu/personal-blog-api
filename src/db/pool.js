import { Pool } from "pg";
import { config } from "../config/env.js";

export const pool = new Pool({
  connectionString: config.dbUrl,
  ssl: { rejectUnauthorized: false }, // Neon
});

export const query = (text, params) => pool.query(text, params);