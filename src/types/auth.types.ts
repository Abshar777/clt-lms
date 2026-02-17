import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  country: z.string().min(2, "country must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "newPassword must be at least 6 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
