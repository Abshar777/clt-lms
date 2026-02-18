import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { User } from "../models/user.model";
import { verifyToken } from "../../../shared/services/token.service";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Authorization token missing or invalid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (decoded.tokenType !== "user") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token type for user" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
