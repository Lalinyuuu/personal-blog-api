import { query } from "../../db/pool.js";

export const findAll = async () =>
  (await query("SELECT * FROM posts ORDER BY created_at DESC")).rows;

export const findById = async (id) =>
  (await query("SELECT * FROM posts WHERE id = $1", [id])).rows[0];

export const create = async ({ title, content }) =>
  (await query(
    "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
    [title, content]
  )).rows[0];

export const update = async (id, { title, content }) =>
  (await query(
    "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *",
    [title, content, id]
  )).rows[0];

export const remove = async (id) => {
  await query("DELETE FROM posts WHERE id = $1", [id]);
};