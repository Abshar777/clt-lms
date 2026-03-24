import { Router } from "express";
import { requireAdminAuth } from "../admin/middlewares/admin-auth.middleware";
import { uploadImage, uploadVideo } from "../../shared/middlewares/upload.middleware";
import { UploadController } from "./upload.controller";

const router = Router();
const uploadController = new UploadController();

/**
 * @swagger
 * /api/v1/uploads/image:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload an image (course photo, syllabus cover, etc.)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 public_id:
 *                   type: string
 */
router.post("/uploads/image", requireAdminAuth, uploadImage, uploadController.uploadImage);

/**
 * @swagger
 * /api/v1/uploads/video:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload a video (topic video)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded
 */
router.post("/uploads/video", requireAdminAuth, uploadVideo, uploadController.uploadVideo);

export default router;
