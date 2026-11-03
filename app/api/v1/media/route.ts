import { NextResponse, type NextRequest } from "next/server";

import { mediaDeleteSchema, mediaQuerySchema } from "@/lib/validation/media.schema";
import { handleApi, jsonError, jsonOk, parseQuery, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deleteMedia, getMediaPage, uploadImage } from "@/server/services/media.service";
import { revalidateMedia } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_ERROR_STATUS: Record<string, number> = {
  UNSUPPORTED_TYPE: 415,
  FILE_TOO_LARGE: 413,
  UPLOAD_FAILED: 502,
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    await requireApiSession();

    const query = parseQuery(request, mediaQuerySchema);
    const page = await getMediaPage({ query: query.query, page: query.page });
    return jsonOk(page);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError(400, "invalid_form_data");
    }

    const file = formData.get("file");
    if (!(file instanceof File)) return jsonError(400, "validation");

    const result = await uploadImage(file);
    if (!result.ok) {
      return jsonError(UPLOAD_ERROR_STATUS[result.error ?? "UPLOAD_FAILED"] ?? 502, result.error ?? "UPLOAD_FAILED");
    }

    revalidateMedia();
    return jsonOk(result);
  });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();

    const query = parseQuery(request, mediaDeleteSchema);
    const result = await deleteMedia(query.key);
    if (!result.ok) return jsonError(400, "invalid_key");

    revalidateMedia();
    return jsonOk({ ok: true });
  });
}
