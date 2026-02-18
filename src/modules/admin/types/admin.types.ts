import { z } from "zod";
import { ADMIN_ROLES } from "../models/admin.model";

const roleEnum = z.enum([
  ADMIN_ROLES.SUPERADMIN,
  ADMIN_ROLES.ADMIN,
  ADMIN_ROLES.MENTOR,
  ADMIN_ROLES.COUNSILOR,
]);

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const bootstrapSuperadminSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isActive: z.boolean().optional(),
});

export const createAdminSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleEnum,
  isActive: z.boolean().optional(),
});

export const updateAdminSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: roleEnum.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided",
  });

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type BootstrapSuperadminInput = z.infer<typeof bootstrapSuperadminSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
