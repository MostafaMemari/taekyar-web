import type { PostBlock } from "@/lib/post-content";

export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTimeMinutes: number;
  content: PostBlock[];
}

export interface PostFormState {
  status: "idle" | "error";
  message?: string;
}

export interface LoginState {
  error?: string;
}
