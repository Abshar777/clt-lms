import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  photo: z.string().url("Photo must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(0).max(5).optional(),
  duration: z.string().min(1, "Duration is required"),
  totalModules: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const updateCourseSchema = z
  .object({
    title: z.string().min(2).optional(),
    photo: z.string().url().optional(),
    description: z.string().min(10).optional(),
    rating: z.number().min(0).max(5).optional(),
    duration: z.string().min(1).optional(),
    totalModules: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
