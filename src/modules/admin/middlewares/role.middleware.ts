import { NextFunction, Request, Response } from "express";
import { AdminRole } from "../models/admin.model";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";

export const requireRoles = (...allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.admin.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Insufficient role" });
      return;
    }

    next();
  };
};
