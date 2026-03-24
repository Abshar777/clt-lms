import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { CourseAdminService } from "../services/course.admin.service";
import { CreateCourseInput, UpdateCourseInput } from "../types/course.types";

export class CourseAdminController {
  private service: CourseAdminService;

  constructor(service: CourseAdminService) {
    this.service = service;
  }

  public createCourse = async (
    req: Request<{}, {}, CreateCourseInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.createCourse(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public listCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skip = Number(req.query.skip) || 0;
      const limit = Number(req.query.limit) || 10;
      const result = await this.service.listCourses(skip, limit);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.getCourseById(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (
    req: Request<{ id: string }, {}, UpdateCourseInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.updateCourse(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.deleteCourse(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
