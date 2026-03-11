import { z } from "zod";

export const postReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export const saveNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export type PostReviewInput = z.infer<typeof postReviewSchema>;
export type SaveNoteInput = z.infer<typeof saveNoteSchema>;
