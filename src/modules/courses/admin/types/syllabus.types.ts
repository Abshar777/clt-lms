import { z } from "zod";

const topicEntrySchema = z.object({
  topicId: z.string().min(1, "topicId is required"),
  progress: z.number().min(0).max(100).optional().default(0),
});

export const createSyllabusSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  moduleLabel: z.string().min(1, "moduleLabel is required"),
  topics: z.array(topicEntrySchema).optional().default([]),
});

export const updateSyllabusSchema = z
  .object({
    title: z.string().min(2).optional(),
    moduleLabel: z.string().min(1).optional(),
    topics: z.array(topicEntrySchema).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateSyllabusInput = z.infer<typeof createSyllabusSchema>;
export type UpdateSyllabusInput = z.infer<typeof updateSyllabusSchema>;
