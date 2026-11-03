import { NextResponse, type NextRequest } from "next/server";

import { postInputSchema } from "@/lib/validation/post.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody, requireApiSession } from "@/server/http/api";
import { assertSameOrigin } from "@/server/security/origin";
import { deletePostPermanently, updatePost } from "@/server/services/posts.service";
import { revalidatePostPaths } from "@/server/services/revalidation";

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

    const body = await parseJsonBody(request, postInputSchema);
    const result = await updatePost({ ...body, currentSlug: slug });

    if (!result.ok) {
      return jsonError(400, "validation", { message: result.message, fieldErrors: result.fieldErrors });
    }

    if (result.slug) {
      revalidatePostPaths(slug);
      if (result.slug !== slug) revalidatePostPaths(result.slug);
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

    const result = await deletePostPermanently(slug);
    if (!result.ok) return jsonError(404, "not_found");

    revalidatePostPaths(slug);
    return jsonOk({ ok: true });
  });
}
