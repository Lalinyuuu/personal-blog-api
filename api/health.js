import { query } from "../src/db/pool.js";

export default async function handler(req, res) {
  try {
    const { rows } = await query("SELECT NOW() as ts");
    res.status(200).json({ ok: true, ts: rows[0].ts });
  } catch (e) {
    console.error("[/api/health]", e);
    res.status(500).json({ ok: false, message: e.message });
  }
}