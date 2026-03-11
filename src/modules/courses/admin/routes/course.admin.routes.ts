import { Router } from "express";
import { requireAdminAuth } from "../../../admin/middlewares/admin-auth.middleware";
import { requireRoles } from "../../../admin/middlewares/role.middleware";
import { ADMIN_ROLES } from "../../../admin/models/admin.model";
import { validate } from "../../../../shared/middlewares/validate.middleware";
import { CourseAdminController } from "../controllers/course.admin.controller";
import { CourseAdminService } from "../services/course.admin.service";
import { createCourseSchema, updateCourseSchema } from "../types/course.types";

const router = Router();
const courseService = new CourseAdminService();
const courseController = new CourseAdminController(courseService);

/**
 * @swagger
 * tags:
 *   - name: Admin Courses
 *     description: Course management endpoints for admin panel.
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: TradeCraft Fundamentals
 *         photo:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/course.jpg
 *         description:
 *           type: string
 *           example: Learn the fundamentals of trading.
 *         rating:
 *           type: number
 *           example: 4.5
 *         duration:
 *           type: string
 *           example: 14 weeks
 *         totalModules:
 *           type: integer
 *           example: 8
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCourseRequest:
 *       type: object
 *       required: [title, photo, description, duration]
 *       properties:
 *         title:
 *           type: string
 *           example: TradeCraft Fundamentals
 *         photo:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/course.jpg
 *         description:
 *           type: string
 *           example: Learn the fundamentals of trading.
 *         rating:
 *           type: number
 *           example: 0
 *         duration:
 *           type: string
 *           example: 14 weeks
 *         totalModules:
 *           type: integer
 *           example: 8
 *         isPublished:
 *           type: boolean
 *           example: false
 *     UpdateCourseRequest:
 *       type: object
 *       description: Send one or more fields to update.
 *       properties:
 *         title:
 *           type: string
 *         photo:
 *           type: string
 *           format: uri
 *         description:
 *           type: string
 *         rating:
 *           type: number
 *         duration:
 *           type: string
 *         totalModules:
 *           type: integer
 *         isPublished:
 *           type: boolean
 *     CourseResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         course:
 *           $ref: '#/components/schemas/Course'
 *     CourseListResponse:
 *       type: object
 *       properties:
 *         courses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     tags: [Admin Courses]
 *     summary: Create a new course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/courses",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(createCourseSchema),
  courseController.createCourse,
);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     tags: [Admin Courses]
 *     summary: List all courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListResponse'
 */
router.get(
  "/courses",
  requireAdminAuth,
  courseController.listCourses,
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     tags: [Admin Courses]
 *     summary: Get course by ID
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
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 */
router.get("/courses/:id", requireAdminAuth, courseController.getCourseById);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     tags: [Admin Courses]
 *     summary: Update a course
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
 *             $ref: '#/components/schemas/UpdateCourseRequest'
 *     responses:
 *       200:
 *         description: Course updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 */
router.patch(
  "/courses/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(updateCourseSchema),
  courseController.updateCourse,
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     tags: [Admin Courses]
 *     summary: Delete a course
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
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete(
  "/courses/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  courseController.deleteCourse,
);

export default router;
