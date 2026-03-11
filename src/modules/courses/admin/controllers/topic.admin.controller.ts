import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { TopicAdminService } from "../services/topic.admin.service";
import { CreateTopicInput, UpdateTopicInput } from "../types/topic.types";

export class TopicAdminController {
  private service: TopicAdminService;

  constructor(service: TopicAdminService) {
    this.service = service;
  }

  public createTopic = async (
    req: Request<{}, {}, CreateTopicInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.createTopic(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public listTopics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const syllabusId = req.query.syllabusId as string | undefined;
      const courseId = req.query.courseId as string | undefined;
      const result = await this.service.listTopics(syllabusId, courseId);
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
      const result = await this.service.getTopicById(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateTopic = async (
    req: Request<{ id: string }, {}, UpdateTopicInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.updateTopic(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteTopic = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.deleteTopic(req.params.id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
