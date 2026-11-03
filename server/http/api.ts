import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";

import { getSession } from "@/lib/auth";
import type { SessionPayload } from "@/lib/session";

import { ApiError } from "./api-error";

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message?: string;
    fieldErrors?: Record<string, string>;
  };
}

export type ApiResponseBody<T> = ApiSuccess<T> | ApiFailure;

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, init);
}

export function jsonError(
  status: number,
  code: string,
  options: { message?: string; fieldErrors?: Record<string, string> } = {},
): NextResponse {
  return NextResponse.json<ApiFailure>(
    { ok: false, error: { code, message: options.message, fieldErrors: options.fieldErrors } },
    { status },
  );
}

function toErrorResponse(error: ApiError): NextResponse {
  return jsonError(error.status, error.code, { message: error.message, fieldErrors: error.fieldErrors });
}

export async function handleApi(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) return toErrorResponse(error);
    console.error("[api] unhandled error:", error);
    return jsonError(500, "internal_error");
  }
}

export async function requireApiSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "unauthenticated");
  return session;
}

function zodFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join(".") : "body";
    if (!(key in fieldErrors)) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new ApiError(400, "invalid_json");
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new ApiError(400, "validation", { fieldErrors: zodFieldErrors(parsed.error) });
  }
  return parsed.data;
}

export function parseQuery<T>(request: Request, schema: ZodType<T>): T {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    throw new ApiError(400, "validation", { fieldErrors: zodFieldErrors(parsed.error) });
  }
  return parsed.data;
}
