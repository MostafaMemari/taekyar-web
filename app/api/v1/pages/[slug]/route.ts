import { NextResponse, type NextRequest } from "next/server";

import { pageInputSchema } from "@/lib/validation/page.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deletePage, updatePage } from "@/server/services/pages.service";
import { revalidatePagePaths } from "@/server/services/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { slug } = await params;

    const body = await parseJsonBody(request, pageInputSchema);
    const result = await updatePage({ ...body, currentSlug: slug });

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    if (result.slug) {
      revalidatePagePaths(slug);
      if (result.slug !== slug) revalidatePagePaths(result.slug);
    }
    return jsonOk({ slug: result.slug });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);
    await requireApiSession();
    const { slug } = await params;

    const result = await deletePage(slug);
    if (!result.ok) return jsonError(404, "not_found");

    revalidatePagePaths(slug);
    return jsonOk({ ok: true });
  });
}
