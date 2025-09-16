const express = require("express");
require("dotenv").config();

const { pool } = require("./api/db");

const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "personal-blog-api" }));


app.get("/profiles", (_req, res) => {
  res.json({ data: { name: "john", age: 20 } });
});


app.post("/assignments", async (req, res) => {
  try {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = req.body || {};


    const missing =
      !title || typeof title !== "string" || !title.trim() ||
      !image || typeof image !== "string" || !image.trim() ||
      category_id === undefined || category_id === null || isNaN(Number(category_id)) ||
      !description || typeof description !== "string" || !description.trim() ||
      !content || typeof content !== "string" || !content.trim() ||
      status_id === undefined || status_id === null || isNaN(Number(status_id));

    if (missing) {
      return res.status(400).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }


    const q = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const v = [
      title.trim(),
      image.trim(),
      Number(category_id),
      description.trim(),
      content.trim(),
      Number(status_id),
    ];

    await pool.query(q, v);

    return res.status(201).json({ message: "Created post sucessfully" });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});