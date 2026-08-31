export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PostPublishStatus = "DRAFT" | "PUBLISHED";

export interface TaxonomyInput {
  name: string;
  slug: string;
  parentId: number | null;
  image: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryId: number | null;
  tagIds: number[];
  date: string | null;
  readTimeMinutes: number | null;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: PostPublishStatus;
}

export type PostFieldKey =
  | "title"
  | "slug"
  | "excerpt"
  | "categoryId"
  | "date"
  | "readTimeMinutes"
  | "content"
  | "coverImage"
  | "coverImageAlt"
  | "metaTitle"
  | "metaDescription";

export type PostFieldErrors = Partial<Record<PostFieldKey, string>>;

export interface PostFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: PostFieldErrors;
}

export interface LoginState {
  error?: string;
}

