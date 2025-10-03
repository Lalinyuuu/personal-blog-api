import { Pool } from "pg";
import { config } from "../config/env.js";
export const pool = new Pool({ connectionString: config.dbUrl, ssl: { rejectUnauthorized: false } });
export const query = (t, p) => pool.query(t, p);