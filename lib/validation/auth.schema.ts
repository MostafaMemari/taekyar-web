import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().max(200),
  password: z.string().max(500),
  captchaAnswer: z.string().max(20),
});

export type LoginBody = z.infer<typeof loginSchema>;
