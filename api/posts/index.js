import { list, create } from "../../src/modules/posts/post.controller.js";

export default async function handler(req, res) {
  if (req.method === "GET")  return list(req, res);
  if (req.method === "POST") return create(req, res);
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end("Method Not Allowed");
}