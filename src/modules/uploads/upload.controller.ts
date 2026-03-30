import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { uploadToR2 } from "../../shared/services/storage.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../../shared/config/r2.config";
import { env } from "../../shared/config/env";
import crypto from "crypto";

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

  // Returns a pre-signed R2 PUT URL so the browser can upload directly
  // — bypasses nginx entirely (no body size limit hit on the server).
  public getVideoPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ext = (req.query.ext as string) || ".mp4";
      const mime = (req.query.mime as string) || "video/mp4";
      const key = `videos/${crypto.randomUUID()}${ext.startsWith(".") ? ext : `.${ext}`}`;

      const command = new PutObjectCommand({
        Bucket: env.r2BucketName,
        Key: key,
        ContentType: mime,
      });

      const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
      const publicUrl = `${env.r2PublicUrl}/${key}`;

      res.status(HTTP_STATUS.OK).json({ presignedUrl, publicUrl, key });
    } catch (error) {
      next(error);
    }
  };
}
