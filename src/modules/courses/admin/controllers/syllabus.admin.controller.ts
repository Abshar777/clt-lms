import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { SyllabusAdminService } from "../services/syllabus.admin.service";
import { CreateSyllabusInput, UpdateSyllabusInput } from "../types/syllabus.types";

export class SyllabusAdminController {
  private service: SyllabusAdminService;

  constructor(service: SyllabusAdminService) {
    this.service = service;
  }

  public createSyllabus = async (
    req: Request<{}, {}, CreateSyllabusInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.createSyllabus(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public listSyllabuses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.query.courseId as string | undefined;
      const skip = Number(req.query.skip) || 0;
      const limit = Number(req.query.limit) || 10;
      const result = await this.service.listSyllabuses(courseId, skip, limit);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getSyllabusById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.getSyllabusById(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateSyllabus = async (
    req: Request<{ id: string }, {}, UpdateSyllabusInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.updateSyllabus(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteSyllabus = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.deleteSyllabus(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
