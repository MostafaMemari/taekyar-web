import type {
  AdminBarEdit,
  FaqInput,
  HomepageFaqInput,
  MediaPage,
  MediaUploadResult,
  MenuItemInput,
  PageInput,
  PostFaqsResult,
  PostInput,
  SimpleResult,
  SiteSettingsInput,
  SubmitCommentResult,
  TaxonomyInput,
} from "@/types/api";

import { apiRequest } from "./client";

export const API_PREFIX = "/api/v1";

export const authApi = {
  login(body: { username: string; password: string; captchaAnswer: string }): Promise<{ username: string }> {
    return apiRequest(`${API_PREFIX}/auth/login`, { method: "POST", body: JSON.stringify(body) });
  },
  async logout(): Promise<void> {
    await apiRequest(`${API_PREFIX}/auth/logout`, { method: "POST" });
  },
};

export const commentsApi = {
  submit(body: {
    slug: string;
    name: string;
    message: string;
    parentId?: string | null;
    captchaAnswer: string;
    honeypot?: string;
  }): Promise<SubmitCommentResult> {
    return apiRequest(`${API_PREFIX}/comments`, { method: "POST", body: JSON.stringify(body) });
  },
  setStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED"): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/comments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  remove(id: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/comments/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export const postsApi = {
  create(input: PostInput): Promise<{ slug: string }> {
    return apiRequest(`${API_PREFIX}/posts`, { method: "POST", body: JSON.stringify(input) });
  },
  update(slug: string, input: PostInput): Promise<{ slug: string }> {
    return apiRequest(`${API_PREFIX}/posts/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
  trash(slug: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/posts/${encodeURIComponent(slug)}/trash`, { method: "POST" });
  },
  restore(slug: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/posts/${encodeURIComponent(slug)}/restore`, { method: "POST" });
  },
  remove(slug: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/posts/${encodeURIComponent(slug)}`, { method: "DELETE" });
  },
  saveFaqs(slug: string, faqs: FaqInput[]): Promise<PostFaqsResult> {
    return apiRequest(`${API_PREFIX}/posts/${encodeURIComponent(slug)}/faqs`, {
      method: "PUT",
      body: JSON.stringify({ faqs }),
    });
  },
};

export const categoriesApi = {
  create(input: TaxonomyInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/categories`, { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: TaxonomyInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/categories/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(id: number): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/categories/${id}`, { method: "DELETE" });
  },
};

export const tagsApi = {
  create(input: TaxonomyInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/tags`, { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: TaxonomyInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/tags/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(id: number): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/tags/${id}`, { method: "DELETE" });
  },
};

export const pagesApi = {
  create(input: PageInput): Promise<{ slug: string }> {
    return apiRequest(`${API_PREFIX}/pages`, { method: "POST", body: JSON.stringify(input) });
  },
  update(slug: string, input: PageInput): Promise<{ slug: string }> {
    return apiRequest(`${API_PREFIX}/pages/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
  remove(slug: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/pages/${encodeURIComponent(slug)}`, { method: "DELETE" });
  },
};

export const menuItemsApi = {
  create(input: MenuItemInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/menu-items`, { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: MenuItemInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/menu-items/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(id: number): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/menu-items/${id}`, { method: "DELETE" });
  },
  move(id: number, direction: "up" | "down"): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/menu-items/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ direction }),
    });
  },
};

export const faqsApi = {
  create(input: HomepageFaqInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/faqs`, { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: HomepageFaqInput): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/faqs/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(id: number): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/faqs/${id}`, { method: "DELETE" });
  },
  toggle(id: number, isActive: boolean): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/faqs/${id}/toggle`, {
      method: "POST",
      body: JSON.stringify({ isActive }),
    });
  },
  reorder(ids: number[]): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/faqs/reorder`, { method: "POST", body: JSON.stringify({ ids }) });
  },
};

export const mediaApi = {
  list(params: { query?: string; page?: number } = {}): Promise<MediaPage> {
    const search = new URLSearchParams();
    if (params.query) search.set("query", params.query);
    if (params.page !== undefined) search.set("page", String(params.page));
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return apiRequest(`${API_PREFIX}/media${suffix}`);
  },
  upload(file: File): Promise<MediaUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest(`${API_PREFIX}/media`, { method: "POST", body: formData });
  },
  remove(key: string): Promise<{ ok: true }> {
    return apiRequest(`${API_PREFIX}/media?key=${encodeURIComponent(key)}`, { method: "DELETE" });
  },
};

export const settingsApi = {
  save(input: SiteSettingsInput): Promise<{ message?: string }> {
    return apiRequest(`${API_PREFIX}/settings`, { method: "PUT", body: JSON.stringify(input) });
  },
};

export const adminBarApi = {
  editContext(pathname: string): Promise<{ context: AdminBarEdit | null }> {
    return apiRequest(`${API_PREFIX}/admin-bar/context?pathname=${encodeURIComponent(pathname)}`);
  },
};

export type { SimpleResult };
