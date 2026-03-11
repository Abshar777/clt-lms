import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { CourseClientService } from "../services/course.client.service";

export class CourseClientController {
  private service: CourseClientService;

  constructor(service: CourseClientService) {
    this.service = service;
  }

  public listCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.listCourses(userId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getSyllabusByCourseId = async (
    req: Request<{ courseId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.getSyllabusByCourseId(req.params.courseId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getTopicById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.getTopicById(req.params.id, userId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public postReview = async (
    req: Request<{ id: string }, {}, { rating: number; comment: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.postReview(req.params.id, userId, req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public saveNote = async (
    req: Request<{ id: string }, {}, { content: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const result = await this.service.saveNote(req.params.id, userId, req.body.content);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };
}
