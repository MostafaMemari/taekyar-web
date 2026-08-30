export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PostPublishStatus = "DRAFT" | "PUBLISHED";

export interface TaxonomyInput {
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  categoryId: number;
  tagIds: number[];
  date: string;
  readTimeMinutes: number;
  content: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: PostPublishStatus;
}

export interface PostFormState {
  status: "idle" | "error";
  message?: string;
}

export interface LoginState {
  error?: string;
}

