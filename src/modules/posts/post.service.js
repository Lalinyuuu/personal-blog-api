import * as repo from "./post.repository.js";

export const listPosts = () => repo.findAll();

export const getPost = async (id) => {
  const x = await repo.findById(id);
  if (!x) {
    const err = new Error("not found");
    err.status = 404;
    throw err;
  }
  return x;
};

export const createPost = (input) => repo.create(input);

export const updatePost = async (id, input) => {
  const x = await repo.update(id, input);
  if (!x) {
    const err = new Error("not found");
    err.status = 404;
    throw err;
  }
  return x;
};

export const deletePost = (id) => repo.remove(id);