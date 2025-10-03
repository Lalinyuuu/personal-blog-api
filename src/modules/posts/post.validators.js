import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "title is required"),
  content: z.string().min(1, "content is required"),
});

export const updatePostSchema = createPostSchema.partial();