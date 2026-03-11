import { Router } from "express";
import { requireAuth } from "../../../auth/middlewares/auth.middleware";
import { validate } from "../../../../shared/middlewares/validate.middleware";
import { CourseClientController } from "../controllers/course.client.controller";
import { CourseClientService } from "../services/course.client.service";
import { postReviewSchema, saveNoteSchema } from "../types/course.client.types";

const router = Router();
const courseService = new CourseClientService();
const courseController = new CourseClientController(courseService);

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Course browsing and learning endpoints for clients.
 * components:
 *   schemas:
 *     CourseListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *           example: TradeCraft Fundamentals
 *         photo:
 *           type: string
 *           format: uri
 *         totalModules:
 *           type: integer
 *           example: 8
 *         duration:
 *           type: string
 *           example: 14 weeks
 *         rating:
 *           type: number
 *           example: 4.5
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *           example: not_started
 *     CourseSyllabusEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         moduleLabel:
 *           type: string
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyllabusTopicEntry'
 *     TopicDetail:
 *       type: object
 *       properties:
 *         topic:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *             videoUrl:
 *               type: string
 *               format: uri
 *             overview:
 *               type: string
 *             order:
 *               type: integer
 *         notes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         myNote:
 *           nullable: true
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             content:
 *               type: string
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               user:
 *                 type: object
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     PostReviewRequest:
 *       type: object
 *       required: [rating, comment]
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: Great lesson, very clear!
 *     SaveNoteRequest:
 *       type: object
 *       required: [content]
 *       properties:
 *         content:
 *           type: string
 *           example: My personal notes for this topic.
 */

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     tags: [Courses]
 *     summary: List all published courses with user enrollment status
 *     description: Returns courses with title, photo, totalModules, duration, rating, and status (not_started | in_progress | completed).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourseListItem'
 *       401:
 *         description: Unauthorized
 */
router.get("/courses", requireAuth, courseController.listCourses);

/**
 * @swagger
 * /api/v1/courses/{courseId}/syllabus:
 *   get:
 *     tags: [Courses]
 *     summary: Get syllabus modules for a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course syllabus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                 syllabus:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourseSyllabusEntry'
 *       404:
 *         description: Course not found
 */
router.get("/courses/:courseId/syllabus", requireAuth, courseController.getSyllabusByCourseId);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get topic detail by ID (includes notes and reviews)
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
 *         description: Topic detail with notes and reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicDetail'
 *       404:
 *         description: Topic not found
 */
router.get("/topics/:id", requireAuth, courseController.getTopicById);

/**
 * @swagger
 * /api/v1/topics/{id}/reviews:
 *   post:
 *     tags: [Courses]
 *     summary: Post or update a review for a topic
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
 *             $ref: '#/components/schemas/PostReviewRequest'
 *     responses:
 *       201:
 *         description: Review posted
 *       404:
 *         description: Topic not found
 */
router.post(
  "/topics/:id/reviews",
  requireAuth,
  validate(postReviewSchema),
  courseController.postReview,
);

/**
 * @swagger
 * /api/v1/topics/{id}/notes:
 *   post:
 *     tags: [Courses]
 *     summary: Save or update personal notes for a topic
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
 *             $ref: '#/components/schemas/SaveNoteRequest'
 *     responses:
 *       201:
 *         description: Note saved
 *       404:
 *         description: Topic not found
 */
router.post(
  "/topics/:id/notes",
  requireAuth,
  validate(saveNoteSchema),
  courseController.saveNote,
);

export default router;
