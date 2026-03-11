import { Router } from "express";
import { requireAdminAuth } from "../../../admin/middlewares/admin-auth.middleware";
import { requireRoles } from "../../../admin/middlewares/role.middleware";
import { ADMIN_ROLES } from "../../../admin/models/admin.model";
import { validate } from "../../../../shared/middlewares/validate.middleware";
import { TopicAdminController } from "../controllers/topic.admin.controller";
import { TopicAdminService } from "../services/topic.admin.service";
import { createTopicSchema, updateTopicSchema } from "../types/topic.types";

const router = Router();
const topicService = new TopicAdminService();
const topicController = new TopicAdminController(topicService);

/**
 * @swagger
 * tags:
 *   - name: Admin Topics
 *     description: Topic management endpoints for admin panel.
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         syllabusId:
 *           type: string
 *         courseId:
 *           type: string
 *         title:
 *           type: string
 *           example: Introduction to Candlestick Charts
 *         videoUrl:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/video.mp4
 *         overview:
 *           type: string
 *           example: In this lesson we cover candlestick patterns.
 *         order:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTopicRequest:
 *       type: object
 *       required: [syllabusId, courseId, title, videoUrl, overview]
 *       properties:
 *         syllabusId:
 *           type: string
 *         courseId:
 *           type: string
 *         title:
 *           type: string
 *           example: Introduction to Candlestick Charts
 *         videoUrl:
 *           type: string
 *           format: uri
 *         overview:
 *           type: string
 *         order:
 *           type: integer
 *           example: 1
 *     UpdateTopicRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         videoUrl:
 *           type: string
 *           format: uri
 *         overview:
 *           type: string
 *         order:
 *           type: integer
 *     TopicResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         topic:
 *           $ref: '#/components/schemas/Topic'
 *     TopicListResponse:
 *       type: object
 *       properties:
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Topic'
 */

/**
 * @swagger
 * /api/v1/topics:
 *   post:
 *     tags: [Admin Topics]
 *     summary: Create a topic
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTopicRequest'
 *     responses:
 *       201:
 *         description: Topic created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 *       404:
 *         description: Syllabus not found
 */
router.post(
  "/topics",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(createTopicSchema),
  topicController.createTopic,
);

/**
 * @swagger
 * /api/v1/topics:
 *   get:
 *     tags: [Admin Topics]
 *     summary: List topics (filter by syllabusId or courseId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: syllabusId
 *         schema:
 *           type: string
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicListResponse'
 */
router.get("/topics", requireAdminAuth, topicController.listTopics);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   get:
 *     tags: [Admin Topics]
 *     summary: Get topic by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 *       404:
 *         description: Topic not found
 */
router.get("/topics/:id", requireAdminAuth, topicController.getTopicById);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   patch:
 *     tags: [Admin Topics]
 *     summary: Update a topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTopicRequest'
 *     responses:
 *       200:
 *         description: Topic updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicResponse'
 */
router.patch(
  "/topics/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(updateTopicSchema),
  topicController.updateTopic,
);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   delete:
 *     tags: [Admin Topics]
 *     summary: Delete a topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic deleted
 *       404:
 *         description: Topic not found
 */
router.delete(
  "/topics/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  topicController.deleteTopic,
);

export default router;
