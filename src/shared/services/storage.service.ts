import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../config/r2.config";
import { env } from "../config/env";
import path from "path";
import crypto from "crypto";

export const uploadToR2 = async (
  file: Express.Multer.File,
  folder: "images" | "videos",
): Promise<{ url: string; key: string }> => {
  const ext = path.extname(file.originalname).toLowerCase();
  const key = `${folder}/${crypto.randomUUID()}${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return { url: `${env.r2PublicUrl}/${key}`, key };
};

export const deleteFromR2 = async (url: string): Promise<void> => {
  const key = url.replace(`${env.r2PublicUrl}/`, "");
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
    }),
  );
};
