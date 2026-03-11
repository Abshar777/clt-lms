import { z } from "zod";

export const createTopicSchema = z.object({
  syllabusId: z.string().min(1, "syllabusId is required"),
  courseId: z.string().min(1, "courseId is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  videoUrl: z.string().url("videoUrl must be a valid URL"),
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  order: z.number().int().min(0).optional().default(0),
});

export const updateTopicSchema = z
  .object({
    title: z.string().min(2).optional(),
    videoUrl: z.string().url().optional(),
    overview: z.string().min(10).optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
