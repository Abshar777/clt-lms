import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { Admin } from "../models/admin.model";
import { verifyToken } from "../../../shared/services/token.service";

export const requireAdminAuth = async (
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

    if (decoded.tokenType !== "admin") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token type for admin" });
      return;
    }

    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token" });
      return;
    }

    if (!admin.isActive) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Admin account is inactive" });
      return;
    }

    req.admin = admin;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
