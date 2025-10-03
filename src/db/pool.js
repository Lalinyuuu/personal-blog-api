import { Pool } from "pg";

// อ่านจาก ENV ที่ Vercel inject มาโดยตรง
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // เผื่อเคสไม่มี sslmode=require
});

export const query = (text, params) => pool.query(text, params);