const express = require("express");
require("dotenv").config();

const { pool } = require("./api/db");

const app = express();
app.use(express.json());


app.get("/", (_req, res) => res.json({ ok: true, service: "personal-blog-api" }));


app.post("/assignments", async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body || {};
    const missing =
      !title || typeof title !== "string" || !title.trim() ||
      !image || typeof image !== "string" || !image.trim() ||
      category_id === undefined || category_id === null || isNaN(Number(category_id)) ||
      !description || typeof description !== "string" || !description.trim() ||
      !content || typeof content !== "string" || !content.trim() ||
      status_id === undefined || status_id === null || isNaN(Number(status_id));

    if (missing) {
      return res.status(400).json({
        message: "Server could not create post because there are missing data from client"
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
      Number(status_id)
    ];

    await pool.query(q, v);
    return res.status(201).json({ message: "Created post sucessfully" });
  } catch (err) {
    console.error("CREATE error:", err);
    return res.status(500).json({
      message: "Server could not create post because database connection"
    });
  }
});


app.get("/posts/:postId", async (req, res) => {
  try {
    const id = Number(req.params.postId);
    if (Number.isNaN(id)) {
      return res.status(404).json({ message: "Server could not find a requested post" });
    }

    const q = `
      SELECT p.id, p.image, c.name AS category, p.title, p.description, p.date, p.content,
             s.status AS status, COALESCE(p.likes_count, 0) AS likes_count
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN statuses   s ON s.id = p.status_id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(q, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Server could not find a requested post" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("READ one error:", err);
    return res.status(500).json({ message: "Server could not read post because database connection" });
  }
});


app.put("/posts/:postId", async (req, res) => {
  try {
    const id = Number(req.params.postId);
    if (Number.isNaN(id)) {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }

    const { title, image, category_id, description, content, status_id } = req.body || {};
    const missing =
      !title || typeof title !== "string" || !title.trim() ||
      !image || typeof image !== "string" || !image.trim() ||
      category_id === undefined || category_id === null || isNaN(Number(category_id)) ||
      !description || typeof description !== "string" || !description.trim() ||
      !content || typeof content !== "string" || !content.trim() ||
      status_id === undefined || status_id === null || isNaN(Number(status_id));

    if (missing) {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }

    const q = `
      UPDATE posts
      SET title=$1, image=$2, category_id=$3, description=$4, content=$5, status_id=$6
      WHERE id=$7
      RETURNING id
    `;
    const v = [
      title.trim(),
      image.trim(),
      Number(category_id),
      description.trim(),
      content.trim(),
      Number(status_id),
      id
    ];
    const { rowCount } = await pool.query(q, v);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Server could not find a requested post to update" });
    }
    return res.status(200).json({ message: "Updated post sucessfully" });
  } catch (err) {
    console.error("UPDATE error:", err);
    return res.status(500).json({ message: "Server could not update post because database connection" });
  }
});


app.delete("/posts/:postId", async (req, res) => {
  try {
    const id = Number(req.params.postId);
    if (Number.isNaN(id)) {
      return res.status(404).json({ message: "Server could not find a requested post to delete" });
    }

    const { rowCount } = await pool.query("DELETE FROM posts WHERE id=$1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Server could not find a requested post to delete" });
    }
    return res.status(200).json({ message: "Deleted post sucessfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return res.status(500).json({ message: "Server could not delete post because database connection" });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.max(1, Number(req.query.limit) || 6);
    const offset = (page - 1) * limit;

    const category = (req.query.category || "").trim();
    const keyword  = (req.query.keyword  || "").trim();

    const where = [];
    const params = [];
    let i = 1;

    if (category) {
      where.push(`c.name ILIKE $${i++}`);
      params.push(category); 
    }
    if (keyword) {
      where.push(`(p.title ILIKE $${i} OR p.description ILIKE $${i} OR p.content ILIKE $${i})`);
      params.push(`%${keyword}%`); i++;
    }
    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";


    const countQ = `
      SELECT COUNT(*) AS total
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereSQL}
    `;
    const { rows: countRows } = await pool.query(countQ, params);
    const totalPosts = Number(countRows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));


    const listQ = `
      SELECT p.id, p.image, c.name AS category, p.title, p.description, p.date,
             s.status AS status, COALESCE(p.likes_count, 0) AS likes_count
      FROM posts p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN statuses   s ON s.id = p.status_id
      ${whereSQL}
      ORDER BY p.date DESC NULLS LAST, p.id DESC
      LIMIT $${i} OFFSET $${i + 1}
    `;
    const listParams = params.concat([limit, offset]);
    const { rows } = await pool.query(listQ, listParams);

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: rows,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    console.error("READ list error:", err);
    return res.status(500).json({ message: "Server could not read post because database connection" });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});