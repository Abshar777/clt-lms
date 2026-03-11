import { Router } from "express";
import { requireAdminAuth } from "../../../admin/middlewares/admin-auth.middleware";
import { requireRoles } from "../../../admin/middlewares/role.middleware";
import { ADMIN_ROLES } from "../../../admin/models/admin.model";
import { validate } from "../../../../shared/middlewares/validate.middleware";
import { SyllabusAdminController } from "../controllers/syllabus.admin.controller";
import { SyllabusAdminService } from "../services/syllabus.admin.service";
import { createSyllabusSchema, updateSyllabusSchema } from "../types/syllabus.types";

const router = Router();
const syllabusService = new SyllabusAdminService();
const syllabusController = new SyllabusAdminController(syllabusService);

/**
 * @swagger
 * tags:
 *   - name: Admin Syllabus
 *     description: Syllabus management endpoints for admin panel.
 * components:
 *   schemas:
 *     SyllabusTopicEntry:
 *       type: object
 *       properties:
 *         topicId:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         progress:
 *           type: number
 *           example: 0
 *     Syllabus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         courseId:
 *           type: string
 *         title:
 *           type: string
 *           example: Module 1 - Basics
 *         moduleLabel:
 *           type: string
 *           example: Week 1
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyllabusTopicEntry'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateSyllabusRequest:
 *       type: object
 *       required: [courseId, title, moduleLabel]
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: Module 1 - Basics
 *         moduleLabel:
 *           type: string
 *           example: Week 1
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyllabusTopicEntry'
 *     UpdateSyllabusRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         moduleLabel:
 *           type: string
 *         topics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyllabusTopicEntry'
 *     SyllabusResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         syllabus:
 *           $ref: '#/components/schemas/Syllabus'
 *     SyllabusListResponse:
 *       type: object
 *       properties:
 *         syllabuses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Syllabus'
 */

/**
 * @swagger
 * /api/v1/syllabuses:
 *   post:
 *     tags: [Admin Syllabus]
 *     summary: Create a syllabus module
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSyllabusRequest'
 *     responses:
 *       201:
 *         description: Syllabus created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyllabusResponse'
 *       404:
 *         description: Course not found
 */
router.post(
  "/syllabuses",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(createSyllabusSchema),
  syllabusController.createSyllabus,
);

/**
 * @swagger
 * /api/v1/syllabuses:
 *   get:
 *     tags: [Admin Syllabus]
 *     summary: List syllabuses (optionally filter by courseId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: List of syllabuses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyllabusListResponse'
 */
router.get("/syllabuses", requireAdminAuth, syllabusController.listSyllabuses);

/**
 * @swagger
 * /api/v1/syllabuses/{id}:
 *   get:
 *     tags: [Admin Syllabus]
 *     summary: Get syllabus by ID
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
 *         description: Syllabus details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyllabusResponse'
 *       404:
 *         description: Syllabus not found
 */
router.get("/syllabuses/:id", requireAdminAuth, syllabusController.getSyllabusById);

/**
 * @swagger
 * /api/v1/syllabuses/{id}:
 *   patch:
 *     tags: [Admin Syllabus]
 *     summary: Update a syllabus
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
 *             $ref: '#/components/schemas/UpdateSyllabusRequest'
 *     responses:
 *       200:
 *         description: Syllabus updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyllabusResponse'
 */
router.patch(
  "/syllabuses/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MENTOR),
  validate(updateSyllabusSchema),
  syllabusController.updateSyllabus,
);

/**
 * @swagger
 * /api/v1/syllabuses/{id}:
 *   delete:
 *     tags: [Admin Syllabus]
 *     summary: Delete a syllabus
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
 *         description: Syllabus deleted
 *       404:
 *         description: Syllabus not found
 */
router.delete(
  "/syllabuses/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  syllabusController.deleteSyllabus,
);

export default router;
