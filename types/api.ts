export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PostPublishStatus = "DRAFT" | "PUBLISHED";

export interface SeoOverrideInput {
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string | null;
  canonical: string | null;
  robotsTags: string | null;
}

export interface FaqInput {
  question: string;
  answer: string;
}

export interface HomepageFaqInput extends FaqInput {
  isActive: boolean;
}

export interface PostInput extends SeoOverrideInput {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryIds: number[];
  tagIds: number[];
  readTimeMinutes: number | string | null;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: PostPublishStatus;
  faqs?: FaqInput[];
}

export interface PostUpdateInput extends PostInput {
  currentSlug: string;
}

export interface PageInput extends SeoOverrideInput {
  title: string;
  slug: string;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: PostPublishStatus;
}

export interface PageUpdateInput extends PageInput {
  currentSlug: string;
}

export interface TaxonomyInput extends SeoOverrideInput {
  name: string;
  slug: string;
  parentId: number | null;
  image: string | null;
  imageAlt: string | null;
  description: string | null;
}

export type TaxonomyKind = "category" | "tag";

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

export type TaxonomyFieldKey = "name" | "slug";

export type TaxonomyFieldErrors = Partial<Record<TaxonomyFieldKey, string>>;

export type MenuItemFieldKey = "title" | "target" | "customUrl" | "parentId";

export type MenuItemFieldErrors = Partial<Record<MenuItemFieldKey, string>>;

export type FaqFieldKey = "question" | "answer";

export type FaqFieldErrors = Partial<Record<FaqFieldKey, string>>;

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
  | "twitterUrl"
  | "appDownloadUrl";

export type SiteSettingsFieldErrors = Partial<Record<SiteSettingsFieldKey, string>>;

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
  appDownloadUrl: string | null;
}

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

export interface MenuLinkTargets {
  pages: MenuItemOption[];
  posts: MenuItemOption[];
  categories: MenuItemOption[];
  tags: MenuItemOption[];
}

export type LoginErrorCode = "invalid" | "captcha_wrong" | "captcha_expired" | "rate_limited";

export type LoginResult = { ok: true } | { ok: false; error: LoginErrorCode };

export type CommentRejectReason =
  | "validation"
  | "captcha_wrong"
  | "captcha_expired"
  | "rate_limited"
  | "not_found";

export interface SubmitCommentInput {
  slug: string;
  name: string;
  message: string;
  parentId?: string | null;
  captchaAnswer: string;
  honeypot?: string;
}

export type SubmitCommentResult = { ok: true } | { ok: false; reason: CommentRejectReason };

export type SimpleResult = { ok: boolean; reason?: string };

export type TaxonomyDeleteResult = { ok: boolean; reason?: "hasChildren" | "hasPosts" };

export interface MediaItem {
  key: string;
  url: string;
  name: string;
  extension: string;
  typeLabel: string;
  size: number;
  sizeLabel: string;
  uploadedAt: string;
  uploadedAtLabel: string;
}

export interface MediaPage {
  items: MediaItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  failed: boolean;
}

export type MediaUploadErrorCode = "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE" | "UPLOAD_FAILED";

export interface MediaUploadResult {
  ok: boolean;
  key?: string;
  url?: string;
  error?: MediaUploadErrorCode;
}

export interface AdminBarEdit {
  href: string;
  label: string;
}

export interface PostMutationResult {
  ok: boolean;
  slug?: string;
  fieldErrors?: PostFieldErrors;
  message?: string;
}

export interface PageMutationResult {
  ok: boolean;
  slug?: string;
  fieldErrors?: PageFieldErrors;
  message?: string;
}

export interface TaxonomyMutationResult {
  ok: boolean;
  fieldErrors?: TaxonomyFieldErrors;
  message?: string;
}

export interface MenuItemMutationResult {
  ok: boolean;
  fieldErrors?: MenuItemFieldErrors;
  message?: string;
}

export interface FaqMutationResult {
  ok: boolean;
  fieldErrors?: FaqFieldErrors;
  message?: string;
}

export interface SettingsMutationResult {
  ok: boolean;
  message?: string;
  fieldErrors?: SiteSettingsFieldErrors;
}

export interface PostFaqsResult {
  ok: boolean;
  faqs: FaqInput[];
}
