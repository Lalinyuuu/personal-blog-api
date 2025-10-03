import "dotenv/config";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const dir = join(process.cwd(), "src", "db", "migrations");
  const files = readdirSync(dir).filter(f => f.endsWith(".sql")).sort();
  for (const f of files) {
    const sql = readFileSync(join(dir, f), "utf8");
    console.log("Running", f);
    await pool.query(sql);
  }
  await pool.end();
  console.log("Migrations complete ✅");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});