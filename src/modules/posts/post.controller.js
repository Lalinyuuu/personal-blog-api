import * as service from "./post.service.js";

const ok = (res, data, status = 200) => res.status(status).json({ ok: true, data });
const fail = (res, err) => res.status(err.status || 500).json({ ok: false, message: err.message });

export const list = async (req, res) => {
  try { ok(res, await service.listPosts()); }
  catch (e) { fail(res, e); }
};

export const get = async (req, res) => {
  try { ok(res, await service.getPost(req.query.id)); }
  catch (e) { fail(res, e); }
};

export const create = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) { const e = new Error("title & content required"); e.status = 400; throw e; }
    ok(res, await service.createPost({ title, content }), 201);
  } catch (e) { fail(res, e); }
};

export const update = async (req, res) => {
  try {
    const { title, content } = req.body || {};
    ok(res, await service.updatePost(req.query.id, { title, content }));
  } catch (e) { fail(res, e); }
};

export const remove = async (req, res) => {
  try { await service.deletePost(req.query.id); res.status(204).end(); }
  catch (e) { fail(res, e); }
};