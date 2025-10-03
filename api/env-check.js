// api/env-check.js
export default function handler(req, res) {
    res.status(200).json({
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      sample: process.env.DATABASE_URL?.slice(0, 40) + "..."
    });
  }