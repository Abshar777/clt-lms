import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { uploadToR2 } from "../../shared/services/storage.service";

export class UploadController {
  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
      }
      const { url, key } = await uploadToR2(req.file, "images");
      res.status(HTTP_STATUS.OK).json({
        url,
        public_id: key,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadVideo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
      }
      const { url, key } = await uploadToR2(req.file, "videos");
      res.status(HTTP_STATUS.OK).json({
        url,
        public_id: key,
        message: "Video uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
