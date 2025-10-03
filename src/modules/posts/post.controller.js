import { asyncHandler, ok } from "../../utils/http.js";
import { validate } from "../../utils/validate.js";
import { createPostSchema, updatePostSchema } from "./post.validators.js";
import * as service from "./post.service.js";

export const list = asyncHandler(async (req, res) =>
  ok(res, await service.listPosts())
);

export const get = asyncHandler(async (req, res) =>
  ok(res, await service.getPost(req.query.id))
);

export const create = asyncHandler(async (req, res) => {
  const input = validate(createPostSchema, req.body);
  ok(res, await service.createPost(input), 201);
});

export const update = asyncHandler(async (req, res) => {
  const input = validate(updatePostSchema, req.body);
  ok(res, await service.updatePost(req.query.id, input));
});

export const remove = asyncHandler(async (req, res) => {
  await service.deletePost(req.query.id);
  ok(res, null, 204);
});