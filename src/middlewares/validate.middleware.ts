import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { HTTP_STATUS } from "../constants/httpStatus";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "Validation failed",
          errors: error.errors.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid payload" });
    }
  };
};
