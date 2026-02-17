import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
};
