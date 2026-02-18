import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { AdminService } from "../services/admin.service";
import {
  AdminLoginInput,
  BootstrapSuperadminInput,
  CreateAdminInput,
  UpdateAdminInput,
} from "../types/admin.types";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  public login = async (
    req: Request<{}, {}, AdminLoginInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.adminService.login(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public bootstrapSuperadmin = async (
    req: Request<{}, {}, BootstrapSuperadminInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.adminService.bootstrapSuperadmin(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public createAdmin = async (
    req: Request<{}, {}, CreateAdminInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const currentAdminRole = req.admin?.role;
      if (!currentAdminRole) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await this.adminService.createAdmin(req.body, currentAdminRole);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public listAdmins = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.adminService.listAdmins();
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAdminById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminService.getAdminById(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateAdmin = async (
    req: Request<{ id: string }, {}, UpdateAdminInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const currentAdminRole = req.admin?.role;
      if (!currentAdminRole) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await this.adminService.updateAdmin(req.params.id, req.body, currentAdminRole);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteAdmin = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const currentAdminId = req.admin?.id;
      if (!currentAdminId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this.adminService.deleteAdmin(req.params.id, currentAdminId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public profile = async (req: Request, res: Response): Promise<void> => {
    res.status(HTTP_STATUS.OK).json({
      admin: {
        id: req.admin?.id,
        fullName: req.admin?.fullName,
        email: req.admin?.email,
        role: req.admin?.role,
        isActive: req.admin?.isActive,
      },
    });
  };
}
