import { get, update, remove } from "../../src/modules/posts/post.controller.js";

export default async function handler(req, res) {
  if (req.method === "GET")    return get(req, res);
  if (req.method === "PUT")    return update(req, res);
  if (req.method === "DELETE") return remove(req, res);
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end("Method Not Allowed");
}