export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PostPublishStatus = "DRAFT" | "PUBLISHED";

export interface SeoOverrideInput {
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string | null;
  canonical: string | null;
  robotsTags: string | null;
}

export interface TaxonomyInput extends SeoOverrideInput {
  name: string;
  slug: string;
  parentId: number | null;
  image: string | null;
  imageAlt: string | null;
  description: string | null;
}

export interface PostInput extends SeoOverrideInput {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryIds: number[];
  tagIds: number[];
  readTimeMinutes: number | null;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: PostPublishStatus;
}

export interface PageInput extends SeoOverrideInput {
  title: string;
  slug: string;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: PostPublishStatus;
}

export type PageFieldKey =
  | "title"
  | "slug"
  | "coverImage"
  | "coverImageAlt"
  | "seoTitle"
  | "seoDescription"
  | "keywords"
  | "canonical"
  | "robotsTags";

export type PageFieldErrors = Partial<Record<PageFieldKey, string>>;

export interface PageFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: PageFieldErrors;
}

export type PostFieldKey =
  | "title"
  | "slug"
  | "excerpt"
  | "readTimeMinutes"
  | "content"
  | "coverImage"
  | "coverImageAlt"
  | "seoTitle"
  | "seoDescription"
  | "keywords"
  | "canonical";

export type PostFieldErrors = Partial<Record<PostFieldKey, string>>;

export interface PostFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: PostFieldErrors;
}

export type TaxonomyFieldKey = "name" | "slug";

export type TaxonomyFieldErrors = Partial<Record<TaxonomyFieldKey, string>>;

export interface TaxonomyFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: TaxonomyFieldErrors;
}

export interface SiteSettingsInput {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  logoImage: string | null;
  logoImageAlt: string | null;
  faviconImage: string | null;
  defaultOgImage: string | null;
  defaultOgImageAlt: string | null;
  telegramUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
}

export type SiteSettingsFieldKey =
  | "siteName"
  | "siteTitle"
  | "siteDescription"
  | "defaultSeoTitle"
  | "defaultSeoDescription"
  | "logoImageAlt"
  | "defaultOgImageAlt"
  | "telegramUrl"
  | "instagramUrl"
  | "youtubeUrl"
  | "twitterUrl";

export type SiteSettingsFieldErrors = Partial<Record<SiteSettingsFieldKey, string>>;

export type MenuItemTypeDto = "PAGE" | "POST" | "CATEGORY" | "TAG" | "CUSTOM";

export type MenuLocationDto = "HEADER_DESKTOP" | "HEADER_MOBILE" | "FOOTER_QUICK" | "FOOTER_BLOG";

export interface MenuItemInput {
  title: string;
  type: MenuItemTypeDto;
  pageId: number | null;
  postId: number | null;
  categoryId: number | null;
  tagId: number | null;
  customUrl: string | null;
  parentId: number | null;
  location: MenuLocationDto;
}

export type MenuItemFieldKey = "title" | "target" | "customUrl" | "parentId";

export type MenuItemFieldErrors = Partial<Record<MenuItemFieldKey, string>>;

export interface MenuItemFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: MenuItemFieldErrors;
}

export interface MenuItemOption {
  id: number;
  name: string;
  depth?: number;
}

export interface MenuItemRowDto {
  id: number;
  title: string;
  type: MenuItemTypeDto;
  pageId: number | null;
  postId: number | null;
  categoryId: number | null;
  tagId: number | null;
  customUrl: string | null;
  parentId: number | null;
  order: number;
}

export type LoginError = "invalid" | "captcha_wrong" | "captcha_expired";

export interface LoginState {
  error?: LoginError;
}

