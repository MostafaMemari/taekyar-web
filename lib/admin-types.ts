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
  categoryIds: number[];
  tagIds: number[];
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

export type LoginError = "invalid" | "captcha_wrong" | "captcha_expired";

export interface LoginState {
  error?: LoginError;
}

