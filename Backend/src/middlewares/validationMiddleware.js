import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const data = {
        ...req.body,
        ...req.params,
        ...req.query
    };
    schema.parse(data);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};
