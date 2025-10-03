import { ZodError } from "zod";

export const validate = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      const err = new Error(e.errors.map((x) => x.message).join("; "));
      err.status = 400;
      throw err;
    }
    throw e;
  }
};