import type { ApiFailure, ApiResponseBody, ApiSuccess } from "@/server/http/api";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, code: string, options: { message?: string; fieldErrors?: Record<string, string> } = {}) {
    super(options.message ?? code);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = options.fieldErrors;
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

function isFailure(payload: unknown): payload is ApiFailure {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as ApiFailure).ok === false &&
    typeof (payload as ApiFailure).error === "object"
  );
}

export const apiBaseUrl = API_BASE_URL;

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasJsonBody = init.body !== undefined && !(init.body instanceof FormData);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (isFailure(payload)) {
    throw new ApiClientError(response.status, payload.error.code, {
      message: payload.error.message,
      fieldErrors: payload.error.fieldErrors,
    });
  }

  if (!response.ok) {
    throw new ApiClientError(response.status, "internal_error");
  }

  return (payload as ApiSuccess<T>).data;
}

export type { ApiResponseBody };
