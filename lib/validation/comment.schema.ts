import { z } from "zod";

export const submitCommentSchema = z.object({
  slug: z.string().min(1).max(300),
  name: z.string().max(200),
  message: z.string().max(2500),
  parentId: z.string().min(1).max(64).nullish(),
  captchaAnswer: z.string().max(20),
  honeypot: z.string().max(200).optional(),
});

export type SubmitCommentBody = z.infer<typeof submitCommentSchema>;

export const commentStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
