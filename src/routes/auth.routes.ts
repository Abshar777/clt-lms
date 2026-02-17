import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { AuthService } from "../services/auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from "../types/auth.types";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and account recovery
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Create new user account
 *     description: Registers a user with fullName, country, email, and password, then sends OTP to email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, country, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               country:
 *                 type: string
 *                 example: United States
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Signup successful
 *       409:
 *         description: Email already registered
 */
router.post("/signup", validate(signupSchema), authController.signup);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified and JWT returned
 */
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend verification OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send password reset OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Generic success response
 */
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using email + OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: newSecret123
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", requireAuth, authController.profile);

export default router;
