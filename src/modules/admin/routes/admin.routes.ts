import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { ADMIN_ROLES } from "../models/admin.model";
import { requireAdminAuth } from "../middlewares/admin-auth.middleware";
import { requireRoles } from "../middlewares/role.middleware";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { AdminService } from "../services/admin.service";
import {
  adminLoginSchema,
  bootstrapSuperadminSchema,
  createAdminSchema,
  updateAdminSchema,
} from "../types/admin.types";

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

/**
 * @swagger
 * tags:
 *   - name: Admin Auth
 *     description: Authentication endpoints for admin panel users.
 *   - name: Admin Management
 *     description: Role-based CRUD endpoints for admin users.
 * components:
 *   schemas:
 *     AdminRole:
 *       type: string
 *       enum: [superadmin, admin, mentor, counsilor]
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 67b7d1f763f7cfc1d4f2c001
 *         fullName:
 *           type: string
 *           example: Root Admin
 *         email:
 *           type: string
 *           format: email
 *           example: root@company.com
 *         role:
 *           $ref: '#/components/schemas/AdminRole'
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AdminLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: root@company.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: StrongPass123!
 *     BootstrapSuperadminRequest:
 *       type: object
 *       required: [fullName, email, password]
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 2
 *           example: Root Admin
 *         email:
 *           type: string
 *           format: email
 *           example: root@company.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: StrongPass123!
 *         isActive:
 *           type: boolean
 *           example: true
 *     CreateAdminRequest:
 *       type: object
 *       required: [fullName, email, password, role]
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 2
 *           example: Mentor One
 *         email:
 *           type: string
 *           format: email
 *           example: mentor@company.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: MentorPass123!
 *         role:
 *           $ref: '#/components/schemas/AdminRole'
 *         isActive:
 *           type: boolean
 *           example: true
 *     UpdateAdminRequest:
 *       type: object
 *       description: Send one or more fields to update.
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 2
 *           example: Updated Name
 *         email:
 *           type: string
 *           format: email
 *           example: updated@company.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: NewStrongPass123!
 *         role:
 *           $ref: '#/components/schemas/AdminRole'
 *         isActive:
 *           type: boolean
 *           example: false
 *     AdminAuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Admin login successful
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         admin:
 *           $ref: '#/components/schemas/Admin'
 *     AdminResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Admin created successfully
 *         admin:
 *           $ref: '#/components/schemas/Admin'
 *     AdminListResponse:
 *       type: object
 *       properties:
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Admin'
 */

/**
 * @swagger
 * /api/v1/admin-auth/bootstrap-superadmin:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Bootstrap first superadmin
 *     description: Creates the first superadmin. Works only when no admin exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BootstrapSuperadminRequest'
 *     responses:
 *       201:
 *         description: Superadmin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *       403:
 *         description: Bootstrap disabled when an admin already exists
 */
router.post(
  "/admin-auth/bootstrap-superadmin",
  validate(bootstrapSuperadminSchema),
  adminController.bootstrapSuperadmin,
);

/**
 * @swagger
 * /api/v1/admin-auth/login:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Login admin
 *     description: Returns bearer token for admin APIs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminAuthResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Admin account inactive
 */
router.post("/admin-auth/login", validate(adminLoginSchema), adminController.login);

/**
 * @swagger
 * /api/v1/admin-auth/profile:
 *   get:
 *     tags: [Admin Auth]
 *     summary: Get current admin profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-auth/profile", requireAdminAuth, adminController.profile);

/**
 * @swagger
 * /api/v1/admins:
 *   post:
 *     tags: [Admin Management]
 *     summary: Create admin (from admin side)
 *     description: Allowed for roles `superadmin` and `admin`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       201:
 *         description: Admin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *       403:
 *         description: Insufficient role / forbidden operation
 *       409:
 *         description: Email already exists
 */
router.post(
  "/admins",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  validate(createAdminSchema),
  adminController.createAdmin,
);

/**
 * @swagger
 * /api/v1/admins:
 *   get:
 *     tags: [Admin Management]
 *     summary: List admins
 *     description: Allowed for roles `superadmin` and `admin`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminListResponse'
 */
router.get(
  "/admins",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  adminController.listAdmins,
);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   get:
 *     tags: [Admin Management]
 *     summary: Get admin by id
 *     description: Allowed for roles `superadmin` and `admin`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b7d1f763f7cfc1d4f2c001
 *     responses:
 *       200:
 *         description: Admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin not found
 */
router.get(
  "/admins/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  adminController.getAdminById,
);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   patch:
 *     tags: [Admin Management]
 *     summary: Update admin
 *     description: Allowed for roles `superadmin` and `admin`. Non-superadmin cannot update/promote superadmin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b7d1f763f7cfc1d4f2c001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdminRequest'
 *     responses:
 *       200:
 *         description: Admin updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *       403:
 *         description: Forbidden by role rule
 *       404:
 *         description: Admin not found
 *       409:
 *         description: Email already exists
 */
router.patch(
  "/admins/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN, ADMIN_ROLES.ADMIN),
  validate(updateAdminSchema),
  adminController.updateAdmin,
);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   delete:
 *     tags: [Admin Management]
 *     summary: Delete admin
 *     description: Allowed only for `superadmin`. You cannot delete your own account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b7d1f763f7cfc1d4f2c001
 *     responses:
 *       200:
 *         description: Admin deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin deleted successfully
 *       400:
 *         description: Cannot delete own account
 *       403:
 *         description: Forbidden by role rule
 *       404:
 *         description: Admin not found
 */
router.delete(
  "/admins/:id",
  requireAdminAuth,
  requireRoles(ADMIN_ROLES.SUPERADMIN),
  adminController.deleteAdmin,
);

export default router;
